import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export const Header = () => (
  <header className="fixed top-0 left-0 right-0 bg-black bg-opacity-100 z-50 py-4 px-6 ">
    <div className="max-w-7xl mx-auto flex justify-between items-center">
      <Image
        className="dark:invert"
        src="/images/tplogo.png"
        alt="Tick8 Plus Logo"
        width={150}
        height={38}
        priority
      />
      <nav className="hidden md:flex space-x-6">
        {['Home', 'Overview', 'Features', 'Beta Program', 'Contact'].map((item) => (
          <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="text-white hover:text-purple-400 transition-colors">
            {item}
          </a>
        ))}
      </nav>
      <Link href="#beta-program">
        <Button className="bg-purple-600 hover:bg-purple-700">Sign Up for Beta</Button>
      </Link>

    </div>
  </header>
);
