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
  pricesInr?: {
    regular?: string;
    sale?: string;
  };
  pricesUsd?: {
    regular?: string;
    sale?: string;
  };
  itemType?: string;
  initialCurrency?: 'USD' | 'INR';
  initialSelection?: string;
  href?: string;
}

export default function WorkshopEnrollButton({
  children,
  className = '',
  pid = 'NSTC2120',
  workshopTitle = 'Workshop',
  courseFee = '0.00',
  professionFees = {},
  pricesInr,
  pricesUsd,
  itemType = 'workshops',
  initialCurrency = 'INR',
  initialSelection = '',
  href
}: WorkshopEnrollButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    // Open dialog for workshops and courses.
    if (itemType === 'workshops' || itemType === 'courses') {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  // Only use <a> for non-dialog types
  if (itemType !== 'workshops' && itemType !== 'courses' && href) {
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
        itemType={itemType}
        priceUSD={courseFee}
        pricesINR={pricesInr}
        pricesUSD={pricesUsd}
        initialCurrency={initialCurrency}
        initialSelection={initialSelection}
      />
    </>
  );
}
