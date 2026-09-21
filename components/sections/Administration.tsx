import { administration } from '@/data/administration';
import { resolveImage } from '@/lib/images';
import { Container, Section } from '@/components/ui/Container';
import { StaffCard } from '@/components/ui/StaffCard';
import { Reveal } from '@/components/animations/Reveal';

/**
 * Секция «Администрация»: сетка портретов, без карусели — состав
 * небольшой, в один экран умещается и на мобильных.
 * [ЗАМЕНИТЬ НА ФАКТИЧЕСКИЕ ДАННЫЕ] — data/administration.ts
 */
export function Administration() {
  const cards = administration.map((member) => ({
    member,
    photo: resolveImage(member.photo)
  }));

  return (
    <Section id="administration">
      <Container>
        <Reveal
          as="ul"
          stagger={0.08}
          childSelector=":scope > li"
          className="grid grid-cols-2 gap-x-[clamp(14px,1.6vw,28px)] gap-y-[clamp(16px,2vw,34px)] sm:grid-cols-3 lg:grid-cols-4"
        >
          {cards.map(({ member, photo }) => (
            <li key={member.id}>
              <StaffCard member={member} photo={photo} />
            </li>
          ))}
        </Reveal>
      </Container>
    </Section>
  );
}
