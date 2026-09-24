import { parallaxGallery } from '@/data/gallery';
import { lifeFrames } from '@/data/content';
import { resolveImages } from '@/lib/images';
import { ParallaxSection } from '@/components/ui/ParallaxSection';

/**
 * Три полноэкранных кадра с фиксированным фоном между секциями.
 *
 * Фото стоят на месте, секции прокручиваются поверх — при скролле один
 * снимок «сменяет» другой. Пути к файлам разрешаются на сервере.
 */
export function ParallaxGallery() {
  const images = resolveImages(parallaxGallery);

  return (
    <div aria-label="Жизнь лицея в фотографиях" role="region" className="mt-[clamp(40px,4.4vw,72px)]">
      {images.map((image, index) => (
        <ParallaxSection
          key={image.file}
          image={image}
          overlay={lifeFrames[index]?.overlay}
          eager={index === 0}
        >
          <p>{lifeFrames[index]?.text}</p>
        </ParallaxSection>
      ))}
    </div>
  );
}
