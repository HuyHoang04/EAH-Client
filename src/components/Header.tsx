import Link from 'next/link';
import Image from 'next/image';

interface HeaderProps {
  transparent?: boolean;
}

export default function Header({ transparent = false }: HeaderProps) {
  return (
    <nav className={`${transparent ? 'bg-transparent' : 'bg-white border-b-2 border-black'} text-black`}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center group">
          <Image
            src="/eah-logo.svg"
            alt="Education Automation Hub Logo"
            width={40}
            height={40}
            className="mr-3 transition-transform group-hover:scale-105"
          />
          <span className="text-xl font-bold group-hover:text-blue-600 transition-colors">Education Automation Hub</span>
        </Link>
        <div className="space-x-4">
          <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
            Login
          </Link>
          <Link href="/register" className="bg-black text-white px-4 py-2 rounded-md hover:bg-blue-600 font-medium transition-colors shadow-sm">
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}
