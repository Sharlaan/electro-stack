import type { LinksFunction } from '@remix-run/node';
import styles from '~/styles/landing-page.css';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }];

export default function LandingPage() {
  return (
    <>
      <header>
        <h1>Welcome to Remix "Electro Stack"</h1>

        <div className="tech-stack">
          {[
            {
              src: 'vercel-logotype.svg',
              alt: 'Vercel',
              href: 'https://vercel.io',
            },
            {
              src: 'https://avatars.githubusercontent.com/oa/1787661?s=120&u=62dead1c48aae82c79ba6bf1501bdec78750558b&v=4',
              alt: 'Supabase',
              href: 'https://supabase.io',
            },
            {
              src: 'https://avatars.githubusercontent.com/u/64235328?s=200&v=4',
              alt: 'Remix',
              href: 'https://remix.run',
            },
            {
              src: 'https://th.bing.com/th/id/OIP.kLldduaRDS8LGYEXrrWhqgHaHa?pid=ImgDet&rs=1',
              alt: 'React',
              href: 'https://reactjs.org',
            },
            {
              src: 'https://user-images.githubusercontent.com/1500684/157773063-20a0ed64-b9f8-4e0b-9d1e-0b65a3d4a6db.svg',
              alt: 'TypeScript',
              href: 'https://typescriptlang.org',
            },
          ].map(({ alt, href, src }) => (
            <a key={href} href={href} rel="noreferrer" target="_blank">
              <img alt={alt} src={src} height={45} />
            </a>
          ))}
        </div>
      </header>

      <img
        src="https://www.wallpaperup.com/uploads/wallpapers/2016/06/09/980773/a3a1170249387ca3657121777aba7041.jpg"
        alt="Electro concert wallpaper"
      ></img>
    </>
  );
}
