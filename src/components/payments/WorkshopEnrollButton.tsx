'use client';

import React, { useState, useEffect } from 'react';
import WorkshopEnrollmentDialog from './WorkshopEnrollmentDialog';
import { useAuthAction } from '@/hooks/useAuthAction';
import { useSession } from 'next-auth/react';
import { Loader2, CheckCircle2, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { isProductMatched } from '@/lib/matchers';

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
  const [pendingEntryId, setPendingEntryId] = useState<string | null>(null);
  const [pendingPid, setPendingPid] = useState<string | null>(null);
  const [pendingItemType, setPendingItemType] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      setIsChecking(true);
      fetch('/api/user/payments')
        .then(res => res.json())
        .then(data => {
            if (data.success && data.payments) {
                // 1. Check for SUCCESSFUL Enrollment
                const paidEntry = data.payments.find((p: any) => {
                    return p.status === 'Paid' && isProductMatched(p.course, workshopTitle || '');
                });
                
                if (paidEntry) {
                    setIsEnrolled(true);
                    setPendingEntryId(null);
                } else {
                    // 2. Check for PENDING (Unpaid) Enrollment to Resume
                    const unpaidEntry = data.payments.find((p: any) => {
                        return p.status !== 'Paid' && isProductMatched(p.course, workshopTitle || '');
                    });
                    
                    if (unpaidEntry) {
                        setPendingEntryId(unpaidEntry.id);
                        setPendingPid(unpaidEntry.pid);
                        
                        // Categorical Translation for Resumption
                        const cat = unpaidEntry.category?.toLowerCase() || '';
                        let type = 'workshops';
                        if (cat === 'course') type = 'courses';
                        else if (cat === 'internship') type = 'internships';
                        else type = 'workshops';
                        
                        setPendingItemType(type);
                    }
                }
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

    // Open dialog for workshops, courses, and internships.
    if (itemType === 'workshops' || itemType === 'courses' || itemType === 'internships' || pendingItemType) {
      e.preventDefault();
      performAction(() => {
        setIsOpen(true);
      });
    }
  };

  // Only use <a> for non-dialog types
  if (itemType !== 'workshops' && itemType !== 'courses' && itemType !== 'internships' && !pendingItemType && href) {
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
        ) : pendingEntryId ? (
           <span className="relative z-10 flex items-center justify-center gap-2">
              <ArrowRight size={16} className="animate-pulse" /> Resume Payment
           </span>
        ) : (
           children
        )}
      </button>

      <WorkshopEnrollmentDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        pid={pendingPid || pid}
        workshopTitle={workshopTitle}
        courseFee={courseFee}
        professionFees={professionFees}
        itemType={pendingItemType || itemType}
        priceUSD={courseFee}
        pricesINR={pricesInr}
        pricesUSD={pricesUsd}
        initialCurrency={initialCurrency}
        initialSelection={initialSelection}
        entryId={pendingEntryId || undefined}
      />
    </>
  );
}
