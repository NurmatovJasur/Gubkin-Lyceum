import { parallaxGallery } from '@/data/gallery';
import { resolveImages } from '@/lib/images';
import { ParallaxComponent } from '@/components/ui/parallax-scrolling';

/**
 * Три полноэкранных кадра между секциями.
 *
 * Пути к файлам разрешаются на сервере (`resolveImages` читает файловую
 * систему), а клиентский ParallaxComponent получает готовые объекты и
 * отвечает только за движение.
 */
export function ParallaxGallery() {
  const images = resolveImages(parallaxGallery);

  return (
    <section aria-label="Жизнь лицея в фотографиях" className="mt-[clamp(40px,4.4vw,72px)]">
      <ParallaxComponent images={images} />
    </section>
  );
}
