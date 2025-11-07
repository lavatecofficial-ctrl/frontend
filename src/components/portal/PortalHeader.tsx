'use client';

import Image from 'next/image';

import { Bookmaker } from '@/types/portal';

interface PortalHeaderProps {
  selectedBookmaker: Bookmaker;
}

export default function PortalHeader({ selectedBookmaker }: PortalHeaderProps) {
  return (
    <div className="col-span-12 row-span-1 bg-transparent border border-gray-700 flex items-center px-6" style={{ borderRadius: '20px' }}>
      <Image
        src={selectedBookmaker.bookmakerImg}
        alt={`${selectedBookmaker.bookmaker} Logo`}
        width={40}
        height={40}
        className="object-contain"
      />
    </div>
  );
}
