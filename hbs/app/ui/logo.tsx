// app/ui/Logo.tsx
import Link from 'next/link';

export default function Logo() {
  return (
    <div className="text-xl font-bold ">
      <Link href="/" className="text-white text-2xl ">
        Harmosoft Book Store
      </Link>
    </div>
  );
}
