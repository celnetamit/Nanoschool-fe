'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, User, MapPin, CheckCircle, LayoutDashboard, Globe, CheckCircle2, ChevronDown, Search, Lock } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { countries } from '@/data/countries';
import { useAuthAction } from '@/hooks/useAuthAction';
import LoginRequiredModal from '../auth/LoginRequiredModal';

import { calculateGST, TaxBreakdown } from '@/lib/tax';
import { getCurrencyForCountry, formatPrice, getCurrencyName, getUniqueCurrencies, getCurrencyFlag } from '@/lib/currency';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface ProfessionFees {
  Student?: string;
  Researcher?: string;
  Academician?: string;
  Professional?: string;
  [key: string]: string | undefined;
}

interface WorkshopEnrollmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  pid?: string;
  workshopTitle?: string;
  courseFee?: string;
  professionFees?: ProfessionFees;
  itemType?: 'workshops' | 'courses' | string;
  priceUSD?: string;
  pricesINR?: {
    regular?: string;
    sale?: string;
  };
  pricesUSD?: {
    regular?: string;
    sale?: string;
  };
  initialCurrency?: string;
  initialSelection?: string;
}

export default function WorkshopEnrollmentDialog({
  isOpen,
  onClose,
  pid = 'NSTC2120',
  workshopTitle = 'AI for Plastic Pollution Analytics: Sources, Pathways & Prediction',
  courseFee = '0.00',
  professionFees = {},
  itemType = 'workshops',
  priceUSD,
  pricesINR,
  pricesUSD,
  initialCurrency = 'INR',
  initialSelection = '',
}: WorkshopEnrollmentDialogProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [payableAmount, setPayableAmount] = useState(courseFee);
  const [paymentFailed, setPaymentFailed] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [taxDetails, setTaxDetails] = useState<TaxBreakdown>({
    baseAmount: 0,
    cgst: 0,
    sgst: 0,
    igst: 0,
    totalTax: 0,
    grandTotal: 0,
    taxStatus: 'Inclusive',
    description: 'GST Inclusive'
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    countryCode: '+91',
    mobileNumber: '',
    currentAffiliation: '',
    profession: '',
    designation: '',
    address: '',
    state: '',
    country: '',
    pinCode: '',
    gstVatNo: '',
    hasCoupon: 'no',
    couponCode: '',
    otherCurrency: 'no',
    referralSource: '',
    learningMode: '',
    termsAgreed: false,
  });
  const [currency, setCurrency] = useState<string>(initialCurrency); // Sync with initialSelection from page
  const [currencySymbol, setCurrencySymbol] = useState(initialCurrency === 'INR' ? '₹' : '$');
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});
  const [uniqueCurrencies, setUniqueCurrencies] = useState<{ code: string; symbol: string; name: string }[]>([]);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');

  // Unique sequential PID fetched from the server when the dialog opens
  const [uniquePid, setUniquePid] = useState('Loading...');

  // Helper to parse price string to number
  const parsePrice = (str: string) => {
    if (!str) return 0;
    const clean = str.replace(/[^0-9.]/g, '');
    return parseFloat(clean) || 0;
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Update taxes whenever amount, country or state changes
  useEffect(() => {
    const amount = parsePrice(payableAmount);
    if (amount > 0) {
      const breakdown = calculateGST(amount, formData.country, formData.state);
      setTaxDetails(breakdown);
    }
  }, [payableAmount, formData.country, formData.state]);

  // AGGRESSIVE STATE SYNC: Sync currency and selection whenever dialog opens
  useEffect(() => {
    if (isOpen) {
      if (initialCurrency) setCurrency(initialCurrency);
      if (initialSelection) {
        const fieldName = itemType === 'courses' ? 'learningMode' : 'profession';
        setFormData(prev => ({ ...prev, [fieldName]: initialSelection }));
      }
    }
  }, [isOpen, initialCurrency, initialSelection, itemType]);

  // Sync payableAmount with selection-driven logic below (Removed redundant courseFee reset)

  // Auto-select first available profession/mode to ensure price visibility
  useEffect(() => {
    if (!isOpen) return;
    
    const availableOptions = Object.keys(professionFees);
    if (availableOptions.length > 0) {
      const fieldName = itemType === 'courses' ? 'learningMode' : 'profession';
      
      // Only auto-select if nothing is selected yet
      if (!(formData as any)[fieldName]) {
        const defaultValue = availableOptions[0];
        setFormData(prev => ({ ...prev, [fieldName]: defaultValue }));
      }
    }
  }, [isOpen, itemType, professionFees, formData]);

  // Effect to handle currency switching in real-time
  useEffect(() => {
    if (!isOpen) return;
    
    const selectedOption = itemType === 'courses' ? formData.learningMode : formData.profession;
    const fee = selectedOption ? professionFees[selectedOption] : courseFee;
    const professionFeeUSD = selectedOption ? (professionFees as any)[`${selectedOption}_usd`] : null;
    
    if (!fee) return;

    // Helper to safely parse numbers from strings like "₹5,499" or "$148"
    const parsePrice = (str: string) => {
      if (!str) return 0;
      const clean = str.replace(/[^0-9.]/g, '');
      return parseFloat(clean) || 0;
    };

    let baseFee = fee;
    // Fallback calculation for courses if professionFees[selectedOption] is missing
    if (!professionFees[selectedOption] && itemType === 'courses' && selectedOption) {
       const baseVal = parsePrice(courseFee);
       if (baseVal > 0) {
         let multiplier = 1;
         if (selectedOption.includes('Live')) multiplier = 2.5;
         else if (selectedOption.includes('Video')) multiplier = 1.5;
         
         const calculated = Math.round(baseVal * multiplier);
         baseFee = courseFee.replace(/[0-9,.]+/, calculated.toLocaleString());
       }
    }

    if (currency === 'INR') {
      // If we have real INR price from WooCommerce, use it, but still apply multipliers for courses
      if (pricesINR?.sale) {
        const baseSaleVal = parseInt(pricesINR.sale);
        if (itemType === 'courses' && selectedOption) {
          let multiplier = 1;
          if (selectedOption.includes('Live')) multiplier = 2.5;
          else if (selectedOption.includes('Video')) multiplier = 1.5;
          const calculated = Math.round(baseSaleVal * multiplier);
          setPayableAmount(`₹${calculated.toLocaleString()}`);
        } else {
          setPayableAmount(`₹${baseSaleVal.toLocaleString()}`);
        }
      } else {
        // Fallback: search for ₹ in the original fee or convert
        const inrMatch = baseFee.match(/₹\s?([0-9,]+)/);
        if (inrMatch) {
          setPayableAmount(inrMatch[0]);
        } else {
          // Hard conversion fallback if no INR found
          const usdVal = parsePrice(baseFee);
          if (usdVal > 0) {
            setPayableAmount(`₹${Math.round(usdVal * (exchangeRates['INR'] || 84)).toLocaleString()}`);
          }
        }
      }
    } else if (currency === 'USD') {
      // USD mode
      // Case 1: Prioritize extracted USD price from WooCommerce meta
      if (pricesUSD?.sale) {
        const baseUSDVal = parseFloat(pricesUSD.sale);
        if (itemType === 'courses' && selectedOption) {
            let multiplier = 1;
            if (selectedOption.includes('Live')) multiplier = 2.5;
            else if (selectedOption.includes('Video')) multiplier = 1.5;
            const calculated = Math.round(baseUSDVal * multiplier);
            setPayableAmount(`$${calculated.toLocaleString()}`);
        } else {
            setPayableAmount(`$${baseUSDVal.toLocaleString()}`);
        }
      }
      // Case 2: Prioritize parsed USD fee from the profession matching (for manual entries)
      else if (professionFeeUSD) {
        setPayableAmount(professionFeeUSD);
      } 
      else if (priceUSD && !priceUSD.includes('₹') && !selectedOption) {
         setPayableAmount(`$${parsePrice(priceUSD).toLocaleString() || priceUSD}`);
      } else {
        const usdMatch = baseFee.match(/\$\s?([0-9,]+)/);
        if (usdMatch) {
          setPayableAmount(usdMatch[0]);
        } else {
           // Fallback to conversion if it looks like INR, or just return original
           const val = parsePrice(baseFee);
           if (baseFee.includes('₹') && val > 0) {
              setPayableAmount(`$${Math.round(val / (exchangeRates['INR'] || 84)).toLocaleString()}`);
           } else {
              setPayableAmount(baseFee);
           }
        }
      }
    } else {
      // Any other international currency
      const usdVal = parsePrice(pricesUSD?.sale || (baseFee.includes('$') ? baseFee : '0'));
      const fallbackUsdVal = usdVal || (baseFee.includes('₹') ? parsePrice(baseFee) / (exchangeRates['INR'] || 84) : parsePrice(baseFee));
      
      const rate = exchangeRates[currency] || 1;
      const convertedAmount = Math.round(fallbackUsdVal * rate);
      
      setPayableAmount(formatPrice(convertedAmount, currency, currencySymbol));
    }
  }, [currency, currencySymbol, exchangeRates, formData.profession, formData.learningMode, isOpen, priceUSD, pricesINR, pricesUSD, professionFees, courseFee, itemType]);

  // Fetch the next sequential PID whenever the dialog opens
  useEffect(() => {
    if (!isOpen) return;
    setUniquePid('Loading...');
    fetch('/api/formidable/next-pid')
      .then(res => res.json())
      .then(data => setUniquePid(data.pid || 'NSTC0001'))
      .catch(() => setUniquePid('NSTC0001'));

    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    // Fetch exchange rates
    fetch('/api/currency/rates')
      .then(res => res.json())
      .then(data => {
        if (data.rates) setExchangeRates(data.rates);
      })
      .catch(err => console.error('Failed to fetch rates:', err));

    // Fetch unique currencies
    const currenciesList = getUniqueCurrencies();
    setUniqueCurrencies(currenciesList);

    return () => {
      document.body.removeChild(script);
    };
  }, [isOpen]);

  // Prevent background scrolling when dialog is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      
      // Automatic Currency Selection based on Country
      if (name === 'country') {
        if (value === 'India') {
          setCurrency('INR');
          setCurrencySymbol('₹');
        } else {
          // International country selected
          if (formData.otherCurrency === 'yes') {
            const selectedCountry = countries.find(c => c.name === value);
            if (selectedCountry) {
              const { code, symbol } = getCurrencyForCountry(selectedCountry.code);
              setCurrency(code);
              setCurrencySymbol(symbol);
            }
          } else {
            // Default to USD for all other countries unless 'Other Currency' is 'Yes'
            setCurrency('USD');
            setCurrencySymbol('$');
          }
        }
      }

      // Handle Other Currency Toggle
      if (name === 'otherCurrency') {
        if (value === 'no') {
          // Revert to country-based default rule
          if (formData.country === 'India') {
            setCurrency('INR');
            setCurrencySymbol('₹');
          } else {
            setCurrency('USD');
            setCurrencySymbol('$');
          }
        } else {
          // Switching to 'yes' - try to use country's local currency
          const selectedCountry = countries.find(c => c.name === formData.country);
          if (selectedCountry) {
            const { code, symbol } = getCurrencyForCountry(selectedCountry.code);
            setCurrency(code);
            setCurrencySymbol(symbol);
          }
        }
      }

      // Handle Manual Currency Selection
      if (name === 'selectedCurrency') {
        const selected = uniqueCurrencies.find(c => c.code === value);
        if (selected) {
          setCurrency(selected.code);
          setCurrencySymbol(selected.symbol);
        }
      }
    }
  };

  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (uniquePid === 'Loading...') {
      toast.error('Please wait for the PID to generate before submitting.');
      return;
    }

    setIsSubmitting(true);
    

    
    try {
      // Step 1: Save lead to WordPress
      const response = await fetch('/api/formidable/enrollment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          pid: uniquePid,
          workshopTitle,
          courseFee: payableAmount,   // Use the calculated fee for selected mode/profession
          payableAmount,              // Final dynamically calculated discount/fee
          itemType,
          category: itemType === 'courses' ? 'Course' : 'Workshop',
          currency,               // Added the selected currency
          currencySymbol,         // Added the selected currency symbol
          payableFeeAmount: payableAmount, // Explicit field for IMS
          taxStatus: taxDetails.taxStatus, // Added tax status
          taxAmount: taxDetails.totalTax.toFixed(2), // Added tax amount
          taxDescription: taxDetails.description, // Added tax description
          otherCurrency: formData.otherCurrency === 'yes' ? 'yes' : 'no' 
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit enrollment.');
      }

      const entryId = result.data?.id;
      const itemMeta = result.itemMeta;
      
      // Step 2: Create Razorpay Order
      // Only proceed to payment if amount is > 0
      const amountValue = parseFloat(payableAmount.replace(/[^0-9.]/g, ''));
      
      if (isNaN(amountValue) || amountValue <= 0) {
        toast.success('Enrollment submitted successfully!');
        setTimeout(() => {
          onClose();
          setIsSubmitting(false);
        }, 2000);
        return;
      }

      const orderRes = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amountValue,
          currency: currency, // Using the dynamic currency switch
          receipt: `rcpt_${uniquePid}`,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error || 'Failed to create payment order.');

      // Step 3: Open Razorpay Checkout
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'NanoSchool',
        description: workshopTitle,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          toast.loading('Verifying payment...');
          try {
            const verifyRes = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                entryId: entryId,
                itemMeta: itemMeta
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok) {
              toast.dismiss();
              setPaymentSuccess(true);
              setIsSubmitting(false);
            } else {
              throw new Error(verifyData.error || 'Payment verification failed.');
            }
          } catch (err: any) {
            toast.dismiss();
            setPaymentFailed(true);
            setIsSubmitting(false);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: `${formData.countryCode}${formData.mobileNumber}`,
        },
        theme: {
          color: '#2563eb', // Blue-600 to match button
        },
        modal: {
          ondismiss: async function() {
            setPaymentFailed(true);
            setIsSubmitting(false);

            // Notify WordPress and IMS about the payment decline
            try {
              await fetch('/api/razorpay/payment-declined', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  entryId: entryId,
                  itemMeta: itemMeta,
                  razorpay_order_id: orderData.orderId,
                }),
              });
            } catch (declineErr) {
              console.error('Failed to notify decline endpoint:', declineErr);
            }
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error: any) {
      console.error('Submission Error:', error);
      toast.error(error.message || 'An error occurred during submission.');
      setIsSubmitting(false);
    }
  };

  const { performAction, showLoginModal, closeLoginModal, currentPath } = useAuthAction();

  const handleProtectedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performAction(() => {
        handleEnrollSubmit(e);
    });
  };

  if (!isOpen || !isMounted) return null;

  const dialogContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md overflow-y-auto">
      <Toaster position="top-center" reverseOrder={false} />
      <div 
        className="absolute inset-0" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      <div className={`relative z-[101] w-full transition-all duration-500 ease-in-out ${paymentSuccess || paymentFailed ? 'max-w-md' : 'max-w-4xl'} max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl animate-in fade-in zoom-in-95`}>
        
        {/* Main Enrollment Form - Hidden when showing results */}
        {!paymentSuccess && !paymentFailed && (
          <>
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-8 py-6 bg-white border-b border-slate-100 rounded-t-3xl">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{itemType === 'courses' ? 'Course Enrollment' : 'Enrollment Form'}</h2>
            <p className="text-sm text-slate-500 font-medium mt-1">New enrollment form as of 15 Aug 24</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleProtectedSubmit} className="p-8 space-y-8">
          
          {/* Workshop Info (Readonly) */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">PID *</label>
              <input 
                type="text" 
                value={uniquePid} 
                readOnly 
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 font-medium focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Enrollment For</label>
              <input 
                type="text" 
                value={workshopTitle} 
                readOnly 
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 font-medium focus:outline-none truncate"
                title={workshopTitle}
              />
            </div>
          </div>

          {/* Personal Information */}
          <div>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <User className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 tracking-tight">Personal Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Name *</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Jane Doe"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email *</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="e.g. example@gmail.com"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Mobile Number *</label>
                <div className="flex gap-2">
                  <select 
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleChange}
                    className="w-32 px-3 py-3 border border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all bg-white"
                  >
                    <option value="+91">+91 (IN)</option>
                    <option value="+1">+1 (US)</option>
                    <option value="+44">+44 (UK)</option>
                  </select>
                  <input 
                    type="tel" 
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    required
                    pattern="[0-9]{10}"
                    title="10 digit mobile number"
                    placeholder="e.g 9876543210"
                    className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              {itemType !== 'courses' && (
                <>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Current Affiliation</label>
                    <input 
                      type="text" 
                      name="currentAffiliation"
                      value={formData.currentAffiliation}
                      onChange={handleChange}
                      placeholder="University or Company"
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Profession *</label>
                    <select 
                      name="profession"
                      value={formData.profession}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all bg-white"
                    >
                      <option value="" disabled>Select</option>
                      <option value="Student">Student</option>
                      <option value="Researcher">Researcher</option>
                      <option value="Academician">Academician</option>
                      <option value="Professional">Professional</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Designation</label>
                    <input 
                      type="text" 
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      placeholder="e.g. Data Scientist"
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>
                </>
              )}

              {itemType === 'courses' && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Choose your learning mode *</label>
                  <select 
                    name="learningMode"
                    value={formData.learningMode}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all bg-white"
                  >
                    <option value="" disabled>Select Mode</option>
                    <option value="e-LMS">e-LMS</option>
                    <option value="Video + e-LMS">Video + e-LMS</option>
                    <option value="Live Lectures + Video + e-LMS">Live Lectures + Video + e-LMS</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Address Information */}
          <div>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 tracking-tight">Location Details</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Address</label>
                <textarea 
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Street layout or Apartment No."
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 resize-none"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">State</label>
                  <input 
                    type="text" 
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="e.g. California"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
                <div className="relative">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Country *</label>
                  <div 
                    onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl flex items-center justify-between cursor-pointer focus-within:ring-4 focus-within:ring-blue-50 focus-within:border-blue-500 transition-all bg-white"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      {formData.country ? (
                        <>
                          <span className="text-xl flex-shrink-0">{countries.find(c => c.name === formData.country)?.flag}</span>
                          <span className="font-medium text-slate-800 truncate">{formData.country}</span>
                        </>
                      ) : (
                        <span className="text-slate-400">Select Country</span>
                      )}
                    </div>
                    <ChevronDown className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>

                  {isCountryDropdownOpen && (
                    <div className="absolute z-[100] mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                      <div className="p-3 border-b border-slate-100 sticky top-0 bg-white">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            autoFocus
                            placeholder="Search country..."
                            value={countrySearch}
                            onChange={(e) => setCountrySearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none text-sm focus:border-blue-500 transition-all"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>
                      <div className="max-h-60 overflow-y-auto no-scrollbar">
                        {countries
                          .filter(c => c.name.toLowerCase().includes(countrySearch.toLowerCase()))
                          .map(c => (
                            <div
                              key={c.code}
                              onClick={() => {
                                setFormData(prev => ({ ...prev, country: c.name }));
                                if (c.name === 'India') {
                                  setCurrency('INR');
                                  setCurrencySymbol('₹');
                                } else if (formData.otherCurrency === 'yes') {
                                  const { code, symbol } = getCurrencyForCountry(c.code);
                                  setCurrency(code);
                                  setCurrencySymbol(symbol);
                                } else {
                                  setCurrency('USD');
                                  setCurrencySymbol('$');
                                }
                                setIsCountryDropdownOpen(false);
                                setCountrySearch('');
                              }}
                              className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors ${formData.country === c.name ? 'bg-blue-50 text-blue-600' : 'text-slate-700'}`}
                            >
                              <span className="text-xl">{c.flag}</span>
                              <span className="font-medium">{c.name}</span>
                              {formData.country === c.name && <CheckCircle className="w-4 h-4 ml-auto" />}
                            </div>
                          ))}
                        {countries.filter(c => c.name.toLowerCase().includes(countrySearch.toLowerCase())).length === 0 && (
                          <div className="px-4 py-6 text-center text-slate-400 text-sm">No countries found</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">PIN Code</label>
                  <input 
                    type="text" 
                    name="pinCode"
                    value={formData.pinCode}
                    onChange={handleChange}
                    placeholder="e.g. 10001"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
                {itemType !== 'courses' && (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">GST/VAT No. (Not Mandatory)</label>
                    <input 
                      type="text" 
                      name="gstVatNo"
                      value={formData.gstVatNo}
                      onChange={handleChange}
                      placeholder="Tax ID if applicable"
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Billing Details */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8">
            <h3 className="text-lg font-bold text-slate-800 tracking-tight mb-6">Billing & Preferences</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Course Fee</label>
                  <input 
                    type="text" 
                    value={payableAmount} 
                    readOnly 
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 font-medium focus:outline-none"
                  />
                </div>
                
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <label className="block text-sm font-bold text-slate-700 mb-3">Have a Coupon?</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="hasCoupon" 
                        value="yes"
                        checked={formData.hasCoupon === 'yes'}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm font-medium">Yes</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="hasCoupon" 
                        value="no"
                        checked={formData.hasCoupon === 'no'}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm font-medium">No</span>
                    </label>
                  </div>
                  
                  {formData.hasCoupon === 'yes' && (
                    <div className="mt-4 pt-4 border-t border-slate-100 animate-in fade-in slide-in-from-top-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Coupon</label>
                      <input 
                        type="text" 
                        name="couponCode"
                        value={formData.couponCode}
                        onChange={handleChange}
                        required
                        placeholder="Enter The Coupon Code"
                        className="w-full px-4 py-3 border border-emerald-300 bg-emerald-50 rounded-xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 outline-none transition-all placeholder:text-emerald-400"
                      />
                    </div>
                  )}
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <label className="block text-sm font-bold text-slate-700">Other Currency</label>
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium mb-3">Do you want to pay Other than USD?</p>
                  <div className="flex gap-4 mb-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="otherCurrency" 
                        value="yes"
                        checked={formData.otherCurrency === 'yes'}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm font-medium">Yes</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="otherCurrency" 
                        value="no"
                        checked={formData.otherCurrency === 'no'}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm font-medium">No</span>
                    </label>
                  </div>

                  {formData.otherCurrency === 'yes' && (
                    <div className="animate-in fade-in slide-in-from-top-2">
                       <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Select Currency</label>
                       <select 
                         name="selectedCurrency"
                         value={currency}
                         onChange={handleChange}
                         className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 transition-all font-medium"
                       >
                         {uniqueCurrencies.map(c => (
                           <option key={c.code} value={c.code}>
                             {c.name} ({c.symbol})
                           </option>
                         ))}
                       </select>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                {taxDetails.totalTax > 0 && (
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 animate-in fade-in slide-in-from-top-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 font-medium">Net Service Value:</span>
                      <span className="text-slate-900 font-bold">₹{taxDetails.baseAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    {taxDetails.cgst > 0 ? (
                      <>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-500 font-medium">CGST (9%):</span>
                          <span className="text-slate-900 font-bold">₹{taxDetails.cgst.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-500 font-medium">SGST (9%):</span>
                          <span className="text-slate-900 font-bold">₹{taxDetails.sgst.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500 font-medium">IGST (18%):</span>
                        <span className="text-slate-900 font-bold">₹{taxDetails.igst.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                    )}
                    <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs font-black text-blue-600 uppercase tracking-widest">
                      <span>Total Inclusive Tax:</span>
                      <span>₹{taxDetails.totalTax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                )}

                {taxDetails.taxStatus === 'Exempt' && (
                  <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100/50 shadow-sm flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                          <CheckCircle2 size={20} />
                      </div>
                      <div>
                          <h4 className="text-sm font-black text-emerald-950 tracking-tight">Export Exemption Applied</h4>
                          <p className="text-[10px] font-bold text-emerald-600/80 uppercase tracking-widest leading-none mt-1">International Registration (0% GST)</p>
                      </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Payable Amount {taxDetails.taxStatus === 'Exempt' ? '(Exempted)' : '(Inclusive of GST)'}
                  </label>
                  <div className="relative group">
                    <input 
                      type="text" 
                      value={payableAmount} 
                      readOnly 
                      className={`w-full px-4 py-3 bg-slate-900 border border-slate-900 rounded-xl text-white font-bold text-lg focus:outline-none shadow-inner ${taxDetails.taxStatus === 'Exempt' ? 'ring-2 ring-emerald-500/20' : ''}`}
                    />
                    {taxDetails.taxStatus === 'Exempt' && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black text-emerald-400 uppercase tracking-widest">
                         Tax Free
                      </div>
                    )}
                  </div>
                  {Object.keys(professionFees).length > 0 && (
                    <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                      <span>💡</span>
                      {itemType === 'courses' 
                        ? (formData.learningMode ? `Fee for ${formData.learningMode}` : 'Select a learning mode above')
                        : (formData.profession ? `Fee for ${formData.profession}` : 'Select a profession above')}
                    </p>
                  )}
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-md">
                  <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                    <span>Payment Currency</span>
                    <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded uppercase font-black">Auto-Selected</span>
                  </label>
                  
                  <div className="mt-2 p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-right-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-sm border border-blue-100">
                      {getCurrencyFlag(currency)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-0.5">Payment In</div>
                      <div className="font-black text-blue-900 text-lg leading-tight">
                        {getCurrencyName(currency)} ({currencySymbol})
                      </div>
                      <p className="text-[10px] text-blue-500 font-medium leading-tight mt-1">
                        Selected based on country: <span className="underline decoration-blue-300">{formData.country || 'Not Selected'}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {itemType !== 'courses' && (
              <div className="mt-6 pt-6 border-t border-slate-200">
                <label className="block text-sm font-bold text-slate-700 mb-2">How do you come to know about this workshop? *</label>
                <select 
                  name="referralSource"
                  value={formData.referralSource}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all"
                >
                  <option value="" disabled>Select</option>
                  <option value="Email">Email</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Colleague">Colleague</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            )}
          </div>

          {/* Terms */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <input 
              type="checkbox" 
              name="termsAgreed"
              id="terms"
              checked={formData.termsAgreed}
              onChange={handleChange}
              required
              className="mt-1 w-5 h-5 rounded border-blue-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor="terms" className="text-sm text-slate-600 leading-relaxed cursor-pointer">
              I agree to the <a href="#" className="font-semibold text-blue-600 hover:underline">Terms & Conditions</a>. I ensure that all the information provided above is correct.
            </label>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center pt-8 pb-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={isSubmitting || uniquePid === 'Loading...'}
              className="w-full sm:w-2/3 px-8 py-5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:from-blue-700 hover:to-indigo-800 transition-all shadow-xl shadow-blue-500/20 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              {isSubmitting ? 'Processing Submission...' : (
                <>
                  <span className="relative z-10">{itemType === 'courses' ? 'Confirm & Enroll in Course' : 'Confirm & Enroll in Workshop'}</span>
                  <CheckCircle className="w-5 h-5 relative z-10" />
                </>
              )}
            </button>
            </div>
          </form>
        </>
      )}

      {/* Premium Payment Success Popup */}
      {paymentSuccess && (
        <div className="p-10 text-center flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 text-emerald-600 shadow-inner">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h3 className="text-3xl font-black text-slate-900 mb-3 tracking-tighter">
            Success!
          </h3>
          <div className="max-w-xs">
            <p className="text-slate-500 mb-8 leading-relaxed text-sm">
              Your enrollment for <strong>{workshopTitle}</strong> is confirmed. Details were sent to <strong>{formData.email}</strong>.
            </p>
            
            <div className="bg-slate-50 rounded-2xl p-4 mb-8 border border-slate-100 grid grid-cols-2 gap-2 text-left text-xs">
              <div>
                <p className="font-bold text-slate-400 uppercase tracking-widest mb-1">PID</p>
                <p className="font-extrabold text-slate-700">{uniquePid}</p>
              </div>
              <div>
                <p className="font-bold text-slate-400 uppercase tracking-widest mb-1">Paid</p>
                <p className="font-extrabold text-slate-700">{payableAmount}</p>
              </div>
            </div>
          </div>
          <button 
            type="button"
            onClick={() => {
              setPaymentSuccess(false);
              onClose();
            }}
            className="w-full px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-95"
          >
            Go to My Dashboard
          </button>
        </div>
      )}
      
      {/* Premium Payment Failure Popup */}
      {paymentFailed && (
        <div className="p-10 text-center flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 text-red-600 shadow-inner">
            <X className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
            Enrollment Incomplete
          </h3>
          <div className="max-w-xs">
            <p className="text-slate-500 mb-8 leading-relaxed text-sm">
              Your payment process was interrupted. The enrollment window has been securely closed to protect your data.
            </p>
          </div>
          <button 
            type="button"
            onClick={() => {
              setPaymentFailed(false);
              onClose();
            }}
            className="w-full px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl shadow-xl transition-all hover:scale-[1.02] active:scale-95"
          >
            Acknowledge & Close
          </button>
        </div>
      )}
      </div>
      
      <LoginRequiredModal 
        isOpen={showLoginModal} 
        onClose={closeLoginModal} 
        title="Account Required"
        message="Please sign in to your NanoSchool account to complete your enrollment. This ensures your course progress and certificates are correctly linked to your profile."
        callbackUrl={currentPath}
      />
    </div>
  );

  return isMounted ? createPortal(dialogContent, document.body) : null;
}
