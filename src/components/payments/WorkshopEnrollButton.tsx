'use client';

import React, { useState, useEffect } from 'react';
import WorkshopEnrollmentDialog from './WorkshopEnrollmentDialog';
import { useAuthAction } from '@/hooks/useAuthAction';
import { useSession } from 'next-auth/react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
  const { performAction } = useAuthAction();
  const { data: session } = useSession();
  const router = useRouter();
  
  const [isChecking, setIsChecking] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setIsChecking(true);
      fetch('/api/user/payments')
        .then(res => res.json())
        .then(data => {
            if (data.success && data.payments) {
                // Check if user has a SUCCESS/Paid entry matching this specific title
                // Fuzzy Matcher: Handles cases where WP Title and Database Title differ
                const hasPaid = data.payments.some((p: any) => {
                    const dbTitle = (p.course || '').toLowerCase();
                    const wpTitle = (workshopTitle || '').toLowerCase();
                    const hasSuccessfulPayment = p.status === 'Paid';
                    
                    if (!hasSuccessfulPayment || !dbTitle || !wpTitle) return false;

                    // 1. Direct or partial match (Require a reasonably specific match)
                    if (dbTitle.includes(wpTitle) || wpTitle.includes(dbTitle)) {
                        // Avoid matching on generic single words like "Workshop"
                        if (wpTitle.length > 8 || dbTitle.length > 8) return true;
                    }
                    
                    // 2. Surrogate Matches (Special cases for known discrepancies)
                    const isOmicsDiscrepancy = 
                        (wpTitle.includes('omics') && (dbTitle.includes('drug discovery') || dbTitle.includes('genomics'))) ||
                        (wpTitle.includes('manufacturing') && dbTitle.includes('smart factories'));
                        
                    if (isOmicsDiscrepancy) return true;

                    return false;
                });
                
                setIsEnrolled(hasPaid);
            }
        })
        .finally(() => setIsChecking(false));
    }
  }, [session, workshopTitle]);

  const handleClick = (e: React.MouseEvent) => {
    // If already enrolled, send them directly to their products dashboard
    if (isEnrolled) {
        e.preventDefault();
        router.push('/dashboard/products');
        return;
    }

    // Open dialog for workshops and courses.
    if (itemType === 'workshops' || itemType === 'courses') {
      e.preventDefault();
      performAction(() => {
        setIsOpen(true);
      });
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
      <button type="button" onClick={handleClick} className={className} disabled={isChecking}>
        {isChecking ? (
           <span className="relative z-10 flex items-center justify-center gap-2">
             <Loader2 size={16} className="animate-spin" /> Verifying...
           </span>
        ) : isEnrolled ? (
           <span className="relative z-10 flex items-center justify-center gap-2">
              <CheckCircle2 size={16} className="text-white" /> Already Enrolled
           </span>
        ) : (
           children
        )}
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
