'use client';

import React, { useState } from 'react';
import WorkshopEnrollmentDialog from './WorkshopEnrollmentDialog';

interface WorkshopEnrollButtonProps {
  children: React.ReactNode;
  className?: string;
  pid?: string;
  workshopTitle?: string;
  courseFee?: string;
  professionFees?: Record<string, string>;
  itemType?: string;
  href?: string;
}

export default function WorkshopEnrollButton({
  children,
  className = '',
  pid = 'NSTC2120',
  workshopTitle = 'Workshop',
  courseFee = '0.00',
  professionFees = {},
  itemType = 'workshops',
  href
}: WorkshopEnrollButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    // Only open dialog for workshops. Others continue to normal link.
    if (itemType === 'workshops') {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  if (itemType !== 'workshops' && href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }

  return (
    <>
      <button type="button" onClick={handleClick} className={className}>
        {children}
      </button>

      <WorkshopEnrollmentDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        pid={pid}
        workshopTitle={workshopTitle}
        courseFee={courseFee}
        professionFees={professionFees}
      />
    </>
  );
}
