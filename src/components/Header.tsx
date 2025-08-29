import Link from 'next/link';
import Image from 'next/image';

interface HeaderProps {
  transparent?: boolean;
}

export default function Header({ transparent = false }: HeaderProps) {
  return (
    <nav className={`${transparent ? 'bg-transparent' : 'bg-white shadow-lg'} text-black`}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Image 
            src="/eah-logo.svg" 
            alt="Education Automation Hub Logo" 
            width={40} 
            height={40} 
            className="mr-3"
          />
          <span className="text-xl font-bold">Education Automation Hub</span>
        </Link>
        <div className="space-x-4">
          <Link href="/login" className="hover:text-stone-700 transition-colors">Login</Link>
          <Link href="/register" className="bg-black text-white px-4 py-2 rounded-md hover:bg-stone-700 transition-colors">
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}
