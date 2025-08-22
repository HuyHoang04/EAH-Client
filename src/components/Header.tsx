import Link from 'next/link';

interface HeaderProps {
  transparent?: boolean;
}

export default function Header({ transparent = false }: HeaderProps) {
  return (
    <nav className={`${transparent ? 'bg-transparent' : 'bg-blue-600 shadow-lg'} text-white`}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">EduAutomation Hub</Link>
        <div className="space-x-4">
          <Link href="/login" className="hover:text-blue-200 transition-colors">Login</Link>
          <Link href="/register" className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-100 transition-colors">
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}
