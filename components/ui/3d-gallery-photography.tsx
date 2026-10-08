'use client';

import type React from 'react';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Бесконечная 3D-галерея: кадры летят навстречу зрителю.
 *
 * Плоскости с фотографиями расставлены в глубину и по кругу от центра,
 * медленно наплывают на камеру, по дальней кромке коридора проявляются из
 * размытия и у ближней уходят в него. Собственный шейдер выгибает кадр по
 * ходу движения (эффект ткани), а при наведении курсора по картинке идёт
 * волна, как по флагу.
 *
 * Отличия от исходного компонента — важны для встраивания в страницу сайта:
 *
 *   1. Прокрутка не перехватывается. В оригинале на canvas висел `wheel`
 *      с `preventDefault()` и `keydown` на всём документе — внутри обычной
 *      страницы это забрало бы и колесо мыши, и стрелки клавиатуры.
 *      Здесь движение берётся из прокрутки самой страницы: сколько пикселей
 *      проехал документ, настолько сильнее толчок (SCROLL_FORCE). Плюс
 *      постоянный спокойный дрейф (BASE_SPEED) — секция живёт и когда
 *      страница стоит на месте.
 *
 *   2. Ни скорость, ни положения плоскостей не лежат в state. Оригинал
 *      вызывал `setScrollVelocity` внутри `useFrame`, то есть перерисовывал
 *      React-дерево каждый кадр. Здесь это ref'ы, а меши двигаются
 *      императивно (`mesh.position.set`) — React в кадрах не участвует.
 *
 *   3. Канвас засыпает (`frameloop: 'never'`), когда секция уходит из
 *      вьюпорта, и уважает `prefers-reduced-motion`: при нём нет ни дрейфа,
 *      ни толчков — кадры просто стоят в коридоре.
 *
 *   4. Материалы освобождаются при размонтировании, у них `depthWrite: false`
 *      — иначе полупрозрачные плоскости срезают друг друга.
 */

type ImageItem = string | { src: string; alt?: string };

interface FadeSettings {
  fadeIn: {
    start: number;
    end: number;
  };
  fadeOut: {
    start: number;
    end: number;
  };
}

interface BlurSettings {
  blurIn: {
    start: number;
    end: number;
  };
  blurOut: {
    start: number;
    end: number;
  };
  maxBlur: number;
}

interface InfiniteGalleryProps {
  images: ImageItem[];
  speed?: number;
  visibleCount?: number;
  fadeSettings?: FadeSettings;
  blurSettings?: BlurSettings;
  className?: string;
  style?: React.CSSProperties;
  /**
   * Из исходного API компонента. Раскладку коридора задают
   * DEFAULT_DEPTH_RANGE и окна fade/blur, поэтому здесь эти два параметра
   * не используются — оставлены, чтобы не ломать вызовы вида `zSpacing={3}`.
   */
  zSpacing?: number;
  falloff?: { near: number; far: number };
}

interface PlaneData {
  index: number;
  z: number;
  imageIndex: number;
  x: number;
  y: number;
}

const DEFAULT_DEPTH_RANGE = 50;

/*
 * Ширина и высота разброса кадров поперёк коридора, в единицах сцены.
 * В оригинале оба равнялись 8 — при камере с fov 55° кадр с таким смещением
 * уходит за край экрана ещё до подлёта, и середина полосы пустует. Эти
 * значения подобраны так, чтобы снимок оставался в кадре почти до самой
 * камеры и лишь у конца коридора уходил в сторону.
 */
const MAX_HORIZONTAL_OFFSET = 4.6;
const MAX_VERTICAL_OFFSET = 3;

/** Короткая сторона кадра в единицах сцены (в оригинале — 2). */
const PLANE_SIZE = 2.4;

/** Постоянный дрейф: единиц глубины в секунду. */
const BASE_SPEED = 0.9;

/** Во сколько единиц скорости превращается один пиксель прокрутки страницы. */
const SCROLL_FORCE = 0.02;

/** Затухание толчка за кадр (как в оригинале). */
const DAMPING = 0.95;

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/** Есть ли в браузере WebGL. На сервере считаем, что есть: там ничего не рисуется. */
const hasWebGL = (): boolean => {
  if (typeof document === 'undefined') return true;

  try {
    const probe = document.createElement('canvas');
    return Boolean(
      probe.getContext('webgl2') ||
        probe.getContext('webgl') ||
        probe.getContext('experimental-webgl')
    );
  } catch {
    return false;
  }
};

const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia(REDUCED_MOTION_QUERY).matches;

const createClothMaterial = () => {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      map: { value: null },
      opacity: { value: 1.0 },
      blurAmount: { value: 0.0 },
      scrollForce: { value: 0.0 },
      time: { value: 0.0 },
      isHovered: { value: 0.0 }
    },
    vertexShader: `
      uniform float scrollForce;
      uniform float time;
      uniform float isHovered;
      varying vec2 vUv;
      varying vec3 vNormal;

      void main() {
        vUv = uv;
        vNormal = normal;

        vec3 pos = position;

        // Плавный изгиб кадра по силе прокрутки
        float curveIntensity = scrollForce * 0.3;

        float distanceFromCenter = length(pos.xy);
        float curve = distanceFromCenter * distanceFromCenter * curveIntensity;

        // Мелкая рябь — эффект ткани
        float ripple1 = sin(pos.x * 2.0 + scrollForce * 3.0) * 0.02;
        float ripple2 = sin(pos.y * 2.5 + scrollForce * 2.0) * 0.015;
        float clothEffect = (ripple1 + ripple2) * abs(curveIntensity) * 2.0;

        // Волна «как по флагу» под курсором
        float flagWave = 0.0;
        if (isHovered > 0.5) {
          float wavePhase = pos.x * 3.0 + time * 8.0;
          float waveAmplitude = sin(wavePhase) * 0.1;
          // Свободный край (справа) качается сильнее
          float dampening = smoothstep(-0.5, 0.5, pos.x);
          flagWave = waveAmplitude * dampening;

          float secondaryWave = sin(pos.x * 5.0 + time * 12.0) * 0.03 * dampening;
          flagWave += secondaryWave;
        }

        pos.z -= (curve + clothEffect + flagWave);

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D map;
      uniform float opacity;
      uniform float blurAmount;
      uniform float scrollForce;
      varying vec2 vUv;
      varying vec3 vNormal;

      void main() {
        vec4 color = texture2D(map, vUv);

        // Приблизительное размытие
        if (blurAmount > 0.0) {
          vec2 texelSize = 1.0 / vec2(textureSize(map, 0));
          vec4 blurred = vec4(0.0);
          float total = 0.0;

          for (float x = -2.0; x <= 2.0; x += 1.0) {
            for (float y = -2.0; y <= 2.0; y += 1.0) {
              vec2 offset = vec2(x, y) * texelSize * blurAmount;
              float weight = 1.0 / (1.0 + length(vec2(x, y)));
              blurred += texture2D(map, vUv + offset) * weight;
              total += weight;
            }
          }
          color = blurred / total;
        }

        // Лёгкий подсвет на изгибе
        float curveHighlight = abs(scrollForce) * 0.05;
        color.rgb += vec3(curveHighlight * 0.1);

        gl_FragColor = vec4(color.rgb, color.a * opacity);
      }
    `
  });
};

function GalleryScene({
  images,
  speed = 1,
  visibleCount = 8,
  reducedMotion = false,
  fadeSettings = {
    fadeIn: { start: 0.05, end: 0.15 },
    fadeOut: { start: 0.85, end: 0.95 }
  },
  blurSettings = {
    blurIn: { start: 0.0, end: 0.1 },
    blurOut: { start: 0.9, end: 1.0 },
    maxBlur: 3.0
  }
}: Omit<InfiniteGalleryProps, 'className' | 'style' | 'zSpacing' | 'falloff'> & {
  reducedMotion?: boolean;
}) {
  /** Накопленная скорость (единиц глубины в секунду) и толчки прокрутки. */
  const velocity = useRef(0);
  const impulse = useRef(0);
  const meshes = useRef<Array<THREE.Mesh | null>>([]);
  /** Пропорции снимка, который сейчас на плоскости. */
  const aspects = useRef<number[]>([]);

  /**
   * Поправка на форму полосы.
   *
   * Коридор рассчитан на широкий экран. На телефоне полоса почти квадратная,
   * и кадр у самой камеры перестаёт помещаться по ширине — остаётся каша из
   * обрезков. Поэтому на узких экранах и сами кадры, и разброс поперёк
   * коридора уменьшаются: хореография та же, масштаб мельче.
   */
  const canvasSize = useThree((state) => state.size);
  const fit = THREE.MathUtils.clamp(canvasSize.width / canvasSize.height / 2.4, 0.58, 1);

  const normalizedImages = useMemo(
    () => images.map((img) => (typeof img === 'string' ? { src: img, alt: '' } : img)),
    [images]
  );

  const loaded = useTexture(normalizedImages.map((img) => img.src));
  const textures = useMemo(() => (Array.isArray(loaded) ? loaded : [loaded]), [loaded]);

  /** Пул материалов: по одному на плоскость, кадры в них подменяются. */
  const materials = useMemo(
    () => Array.from({ length: visibleCount }, () => createClothMaterial()),
    [visibleCount]
  );

  useEffect(() => {
    return () => {
      materials.forEach((material) => material.dispose());
    };
  }, [materials]);

  /**
   * Разброс кадров поперёк коридора.
   *
   * В оригинале компонента углы и радиусы считались по двум независимым
   * формулам, и при десятке кадров они сбивались в один угол экрана: то
   * внизу слева пусто, то все вместе. Здесь — «подсолнух»: угол растёт на
   * золотой (137,5°), радиус как корень из номера. Точки ложатся по диску
   * равномерно на любом количестве кадров, первый при этом остаётся в
   * центре — ровно напротив камеры.
   */
  const spatialPositions = useMemo(() => {
    const positions: { x: number; y: number }[] = [];
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < visibleCount; i++) {
      const angle = i * goldenAngle;
      const radius = Math.sqrt(i / Math.max(visibleCount - 1, 1));

      positions.push({
        x: Math.cos(angle) * radius * MAX_HORIZONTAL_OFFSET,
        y: Math.sin(angle) * radius * MAX_VERTICAL_OFFSET
      });
    }

    return positions;
  }, [visibleCount]);

  const totalImages = normalizedImages.length;
  const depthRange = DEFAULT_DEPTH_RANGE;

  /** Стартовая раскладка плоскостей по коридору. */
  const planes = useMemo<PlaneData[]>(
    () =>
      Array.from({ length: visibleCount }, (_, i) => ({
        index: i,
        z: visibleCount > 0 ? ((depthRange / Math.max(visibleCount, 1)) * i) % depthRange : 0,
        imageIndex: totalImages > 0 ? i % totalImages : 0,
        x: spatialPositions[i]?.x ?? 0,
        y: spatialPositions[i]?.y ?? 0
      })),
    [depthRange, spatialPositions, totalImages, visibleCount]
  );

  /* Движение берётся из прокрутки страницы: колесо и стрелки остаются
     браузеру, страница скроллится как обычно. */
  useEffect(() => {
    if (reducedMotion) return;

    let last = window.scrollY;
    const handleScroll = () => {
      const current = window.scrollY;
      impulse.current += (current - last) * SCROLL_FORCE * speed;
      last = current;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [reducedMotion, speed]);

  useFrame((state, delta) => {
    // Первый кадр после паузы бывает очень длинным — не даём коридору прыгнуть.
    const step = Math.min(delta, 0.05);

    velocity.current = velocity.current * DAMPING + impulse.current;
    impulse.current = 0;

    const drift = reducedMotion ? 0 : BASE_SPEED * speed;
    const advance = (velocity.current + drift) * step;

    const time = state.clock.getElapsedTime();
    const scrollForce = THREE.MathUtils.clamp(velocity.current * 0.25, -2, 2);
    materials.forEach((material) => {
      material.uniforms.time.value = time;
      material.uniforms.scrollForce.value = scrollForce;
    });

    const imageAdvance = totalImages > 0 ? visibleCount % totalImages || totalImages : 0;
    const totalRange = depthRange;
    const halfRange = totalRange / 2;

    planes.forEach((plane, i) => {
      let newZ = plane.z + advance;
      let wrapsForward = 0;
      let wrapsBackward = 0;

      if (newZ >= totalRange) {
        wrapsForward = Math.floor(newZ / totalRange);
        newZ -= totalRange * wrapsForward;
      } else if (newZ < 0) {
        wrapsBackward = Math.ceil(-newZ / totalRange);
        newZ += totalRange * wrapsBackward;
      }

      if (wrapsForward > 0 && imageAdvance > 0 && totalImages > 0) {
        plane.imageIndex = (plane.imageIndex + wrapsForward * imageAdvance) % totalImages;
      }

      if (wrapsBackward > 0 && imageAdvance > 0 && totalImages > 0) {
        const back = plane.imageIndex - wrapsBackward * imageAdvance;
        plane.imageIndex = ((back % totalImages) + totalImages) % totalImages;
      }

      plane.z = ((newZ % totalRange) + totalRange) % totalRange;

      const worldZ = plane.z - halfRange;

      /* --- Прозрачность по окну fade ---------------------------------- */
      const normalizedPosition = plane.z / totalRange; // 0…1
      let opacity = 1;

      if (
        normalizedPosition >= fadeSettings.fadeIn.start &&
        normalizedPosition <= fadeSettings.fadeIn.end
      ) {
        opacity =
          (normalizedPosition - fadeSettings.fadeIn.start) /
          (fadeSettings.fadeIn.end - fadeSettings.fadeIn.start);
      } else if (normalizedPosition < fadeSettings.fadeIn.start) {
        opacity = 0;
      } else if (
        normalizedPosition >= fadeSettings.fadeOut.start &&
        normalizedPosition <= fadeSettings.fadeOut.end
      ) {
        opacity =
          1 -
          (normalizedPosition - fadeSettings.fadeOut.start) /
            (fadeSettings.fadeOut.end - fadeSettings.fadeOut.start);
      } else if (normalizedPosition > fadeSettings.fadeOut.end) {
        opacity = 0;
      }

      opacity = Math.max(0, Math.min(1, opacity));

      /* --- Размытие по окну blur -------------------------------------- */
      let blur = 0;

      if (
        normalizedPosition >= blurSettings.blurIn.start &&
        normalizedPosition <= blurSettings.blurIn.end
      ) {
        const blurInProgress =
          (normalizedPosition - blurSettings.blurIn.start) /
          (blurSettings.blurIn.end - blurSettings.blurIn.start);
        blur = blurSettings.maxBlur * (1 - blurInProgress);
      } else if (normalizedPosition < blurSettings.blurIn.start) {
        blur = blurSettings.maxBlur;
      } else if (
        normalizedPosition >= blurSettings.blurOut.start &&
        normalizedPosition <= blurSettings.blurOut.end
      ) {
        const blurOutProgress =
          (normalizedPosition - blurSettings.blurOut.start) /
          (blurSettings.blurOut.end - blurSettings.blurOut.start);
        blur = blurSettings.maxBlur * blurOutProgress;
      } else if (normalizedPosition > blurSettings.blurOut.end) {
        blur = blurSettings.maxBlur;
      }

      blur = Math.max(0, Math.min(blurSettings.maxBlur, blur));

      const material = materials[i];
      const mesh = meshes.current[i];
      if (!material || !mesh) return;

      material.uniforms.opacity.value = opacity;
      material.uniforms.blurAmount.value = blur;

      // Кадр у плоскости меняется только на перемотке коридора — там же
      // запоминаем пропорции снимка.
      const texture = textures[plane.imageIndex];
      if (texture && material.uniforms.map.value !== texture) {
        material.uniforms.map.value = texture;

        const image = texture.image as { width: number; height: number } | undefined;
        aspects.current[i] = image && image.height ? image.width / image.height : 1;
      }

      const aspect = aspects.current[i] ?? 1;
      const size = PLANE_SIZE * fit;
      if (aspect > 1) {
        mesh.scale.set(size * aspect, size, 1);
      } else {
        mesh.scale.set(size, size / aspect, 1);
      }

      mesh.position.set(plane.x * fit, plane.y * fit, worldZ);
      // Невидимый кадр не растрируется и не ловит курсор.
      mesh.visible = opacity > 0.001;
    });
  });

  if (normalizedImages.length === 0) return null;

  return (
    <>
      {planes.map((plane, i) => {
        const material = materials[i];
        if (!material) return null;

        return (
          <mesh
            key={plane.index}
            ref={(node) => {
              meshes.current[i] = node;
            }}
            material={material}
            // Положение и масштаб выставляет useFrame; до первого кадра
            // плоскость стоит за дальней кромкой коридора.
            position={[plane.x, plane.y, -depthRange]}
            onPointerEnter={() => {
              material.uniforms.isHovered.value = 1.0;
            }}
            onPointerLeave={() => {
              material.uniforms.isHovered.value = 0.0;
            }}
          >
            <planeGeometry args={[1, 1, 32, 32]} />
          </mesh>
        );
      })}
    </>
  );
}

/** Запасной вид, если WebGL недоступен: обычная сетка фотографий. */
function FallbackGallery({ images }: { images: ImageItem[] }) {
  const normalizedImages = useMemo(
    () => images.map((img) => (typeof img === 'string' ? { src: img, alt: '' } : img)),
    [images]
  );

  return (
    <div className="grid size-full grid-cols-2 gap-3 overflow-hidden md:grid-cols-3">
      {normalizedImages.slice(0, 6).map((img) => (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          key={img.src}
          src={img.src}
          alt={img.alt ?? ''}
          loading="lazy"
          decoding="async"
          className="size-full rounded-media object-cover"
        />
      ))}
    </div>
  );
}

export default function InfiniteGallery({
  images,
  speed,
  visibleCount,
  className = 'h-96 w-full',
  style,
  fadeSettings = {
    /*
     * Окно видимости кадра, доля коридора (0 — дальняя кромка, 0.5 —
     * плоскость камеры). Шире исходного: кадр проявляется раньше и уходит
     * почти у самого зрителя, поэтому в полосе всегда несколько снимков,
     * а не один-два.
     */
    fadeIn: { start: 0.03, end: 0.14 },
    fadeOut: { start: 0.44, end: 0.49 }
  },
  blurSettings = {
    blurIn: { start: 0.0, end: 0.12 },
    blurOut: { start: 0.42, end: 0.49 },
    maxBlur: 8.0
  }
}: InfiniteGalleryProps) {
  const wrapper = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  // Компонент грузится только на клиенте (`ssr: false`), поэтому опрос
  // возможностей браузера делается один раз при инициализации state —
  // без эффекта и без лишнего прохода рендера.
  const [webglSupported] = useState(hasWebGL);
  const [reducedMotion, setReducedMotion] = useState(prefersReducedMotion);

  /* Настройку «меньше движения» пользователь может переключить на ходу. */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const query = window.matchMedia(REDUCED_MOTION_QUERY);
    const handleChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches);

    query.addEventListener('change', handleChange);
    return () => query.removeEventListener('change', handleChange);
  }, []);

  /* Канвас рисует только пока секция на экране. */
  useEffect(() => {
    const element = wrapper.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: '150px 0px' }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  if (!webglSupported) {
    return (
      <div ref={wrapper} className={className} style={style}>
        <FallbackGallery images={images} />
      </div>
    );
  }

  return (
    <div ref={wrapper} className={className} style={style}>
      <Canvas
        camera={{ position: [0, 0, 0], fov: 55 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.75]}
        frameloop={inView ? 'always' : 'never'}
      >
        <Suspense fallback={null}>
          <GalleryScene
            images={images}
            speed={speed}
            visibleCount={visibleCount}
            reducedMotion={reducedMotion}
            fadeSettings={fadeSettings}
            blurSettings={blurSettings}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
