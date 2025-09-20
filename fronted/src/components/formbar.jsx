'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Formsbar() {
  const router = useRouter();

  return (
    <nav className="w-full flex justify-between items-center px-6 py-4 border-b bg-white">
      {/* Left side */}
      <div className='flex gap-2'>
        <Button>New</Button>
        <Button>Confirm</Button>
        <Button>Archived</Button>
      </div>

      {/* Right side */}
      <div className="flex gap-2">
        <Link href="/admin">
          <Button variant="outline">Home</Button>
        </Link>
        <Button variant="outline" onClick={() => router.back()}>
          Back
        </Button>
      </div>
    </nav>
  );
}
