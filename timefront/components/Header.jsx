// app/components/Header.js
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center p-3">
        {/* Лого */}
        <Link href="/">
          <h1 className="text-2xl font-bold">Hello</h1>
        </Link>

        {/* Навигацийн холбоосууд */}
        <nav className="space-x-4">
          <Link href="/" className="hover:text-gray-200">
            Home
          </Link>
          <Link href="/huviar" className="hover:text-gray-200">
            Хуваарь
          </Link>
          <Link href="/form/angi" className="hover:text-gray-200">
            Анги
          </Link>
          <Link href="/form/bagsh" className="hover:text-gray-200">
            Багш
          </Link>
          <Link href="/form/hicheel" className="hover:text-gray-200">
            Хичээл
          </Link>
          <Link href="/form/room" className="hover:text-gray-200">
            Өрөө
          </Link>
        </nav>
      </div>
    </header>
  );
}
