import React from 'react';

export default function PricingSection({ modules }: { modules: { title: string, content: string }[] }) {
    // Parse modules to extract pricing
    const pricingData = modules.map(m => {
        // Strip HTML tags to get raw text
        const rawText = m.content.replace(/<[^>]*>?/gm, '');
        const prices = rawText.split('|').map(s => s.trim());
        const priceINR = prices[0] || 'TBD';
        const priceUSD = prices[1] || '-';

        return {
            title: m.title.replace(' Fee', ''), // Clean title
            priceINR,
            priceUSD,
        };
    }).filter(item => item.priceINR !== 'TBD' && item.priceINR !== ''); // Filter out TBD entries

    // Don't render the section if there's no valid pricing data
    if (pricingData.length === 0) {
        return null;
    }

    return (
        <div className="py-8">
            <h3 className="text-2xl font-black text-gray-900 mb-8 text-center uppercase tracking-widest opacity-80">Fee Structure</h3>

            <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm bg-white">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-widest text-gray-500 font-bold">
                            <th className="p-4 md:p-6">Category</th>
                            <th className="p-4 md:p-6">Fee (INR)</th>
                            <th className="p-4 md:p-6">Fee (USD)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {pricingData.map((plan, index) => (
                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 md:p-6 font-bold text-gray-900">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-lg ${plan.title.includes('Student') ? 'bg-blue-100 text-blue-600' :
                                            plan.title.includes('Ph.D') ? 'bg-purple-100 text-purple-600' :
                                                'bg-orange-100 text-orange-600'
                                            }`}>
                                            {plan.title.includes('Student') ? '🎓' : plan.title.includes('Ph.D') ? '🔬' : '👨‍🏫'}
                                        </div>
                                        <span>{plan.title}</span>
                                    </div>
                                </td>
                                <td className="p-4 md:p-6 font-bold text-gray-700">{plan.priceINR}</td>
                                <td className="p-4 md:p-6 font-medium text-gray-500">{plan.priceUSD}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p className="text-center text-xs text-gray-400 mt-4">* Fees are inclusive of all taxes. International participants can pay via PayPal/Stripe.</p>
        </div>
    );
}
