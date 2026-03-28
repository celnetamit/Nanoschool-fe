'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, User, MapPin, CheckCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

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
}

export default function WorkshopEnrollmentDialog({
  isOpen,
  onClose,
  pid = 'NSTC2120',
  workshopTitle = 'AI for Plastic Pollution Analytics: Sources, Pathways & Prediction',
  courseFee = '0.00',
  professionFees = {},
  itemType = 'workshops',
}: WorkshopEnrollmentDialogProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [payableAmount, setPayableAmount] = useState(courseFee);
  // Unique sequential PID fetched from the server when the dialog opens
  const [uniquePid, setUniquePid] = useState('Loading...');
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

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sync payableAmount with courseFee prop when it changes or dialog opens
  useEffect(() => {
    if (isOpen) {
      setPayableAmount(courseFee);
    }
  }, [isOpen, courseFee]);

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
      // When profession or learning mode changes, update the payable amount
      if ((name === 'profession' || name === 'learningMode') && value) {
        const fee = professionFees[value];
        console.log('Price Update Trace:', { name, value, fee, courseFee, professionFees });
        if (fee) {
          setPayableAmount(fee);
        } else if (itemType === 'courses') {
          // Fallback calculation for courses based on base fee (courseFee)
          const baseMatch = courseFee.match(/([0-9,.]+)/);
          const baseVal = baseMatch ? parseFloat(baseMatch[0].replace(/,/g, '')) : 0;
          console.log('Calculation Trace:', { baseMatch, baseVal });
          
          if (baseVal > 0) {
            let multiplier = 1;
            if (value.includes('Live')) multiplier = 2.5;
            else if (value.includes('Video')) multiplier = 1.5;
            
            const calculated = Math.round(baseVal * multiplier);
            const formatted = courseFee.replace(/[0-9,.]+/, calculated.toLocaleString());
            console.log('Resulting Price:', { calculated, formatted });
            setPayableAmount(formatted);
          }
        } else if (itemType === 'workshops') {
           setPayableAmount(courseFee);
        }
      }
    }
  };

  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          courseFee: payableAmount,
          payableAmount,
          itemType,
          category: itemType === 'courses' ? 'Course' : 'Workshop',
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit enrollment.');
      }

      const entryId = result.data?.id;
      
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
          currency: 'INR', // Defaulting to INR as per usual Razorpay usage, or adjust based on otherCurrency logic
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
                entryId: entryId
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok) {
              toast.dismiss();
              toast.success('Payment successful! Enrollment confirmed.');
              setTimeout(() => {
                onClose();
                setIsSubmitting(false);
              }, 2000);
            } else {
              throw new Error(verifyData.error || 'Payment verification failed.');
            }
          } catch (err: any) {
            toast.dismiss();
            toast.error(err.message);
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
          ondismiss: function() {
            toast('Payment cancelled. Your details are saved as a lead.', { icon: 'ℹ️' });
            setIsSubmitting(false);
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

  if (!isOpen || !isMounted) return null;

  const dialogContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md overflow-y-auto">
      <Toaster position="top-center" reverseOrder={false} />
      <div 
        className="absolute inset-0" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      <div className="relative z-[101] w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
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

        <form onSubmit={handleEnrollSubmit} className="p-8 space-y-8">
          
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
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Country *</label>
                  <input 
                    type="text" 
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                    placeholder="e.g. United States"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                  />
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
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Payable Amount</label>
                  <input 
                    type="text" 
                    value={payableAmount} 
                    readOnly 
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-900 rounded-xl text-white font-bold text-lg focus:outline-none shadow-inner"
                  />
                  {Object.keys(professionFees).length > 0 && (
                    <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                      <span>💡</span>
                      {itemType === 'courses' 
                        ? (formData.learningMode ? `Fee for ${formData.learningMode}` : 'Select a learning mode above')
                        : (formData.profession ? `Fee for ${formData.profession}` : 'Select a profession above')}
                    </p>
                  )}
                </div>

                {itemType !== 'courses' && (
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <label className="block text-sm font-bold text-slate-700 mb-3">Do you want to pay Other than USD?</label>
                    <div className="flex gap-4">
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
                  </div>
                )}
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
              disabled={isSubmitting}
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
      </div>
    </div>
  );

  return createPortal(dialogContent, document.body);
}
