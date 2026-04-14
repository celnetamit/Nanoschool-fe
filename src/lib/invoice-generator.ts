import { calculateGST, numberToWords, getStateCode } from './tax';

/**
 * Generates the full HTML string for the Retail Tax Invoice.
 * This should be identical to the one rendered in the Dashboard's InvoiceModal.
 */
export function generateInvoiceHTML(payment: any, sysConfig: any): string {
  const taxBreakdown = calculateGST(payment.amount, payment.country, payment.state);
  const { baseAmount, cgst, sgst, igst, totalTax } = taxBreakdown;
  
  const invoiceDate = new Date(payment.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');
  const invoiceNumber = `INV-${payment.id.slice(-6).toUpperCase()}`;

  const conf = sysConfig?.invoice || {
    companyName: "IT Break Com Private Limited",
    addressLine1: "A-118, Level 1B, Sector 63",
    addressLine2: "Noida, Gautambuddha Nagar",
    addressLine3: "Uttar Pradesh, 201301",
    gstin: "09AAACI8565D2ZD",
    cinNo: "U74899DL2001PTC109327",
    stateCode: "09",
  };

  const clientInfo = [
    { label: 'Participant ID:', value: payment.pid || `NSTC-${payment.id.slice(-4).toUpperCase()}` },
    { label: 'Name:', value: payment.name },
    { label: 'Address:', value: [payment.address, payment.state, payment.country, payment.zipCode].filter(v => v && v !== '').join(', ') },
    { label: 'Contact Number:', value: payment.contactNumber && payment.contactNumber !== 'N/A' ? payment.contactNumber : '' },
    { label: 'Email:', value: payment.email },
    { label: 'State Code:', value: getStateCode(payment.state) || '09' },
    { label: 'Profession / Mode:', value: payment.learningMode || payment.profession || '' },
    { label: 'Enrollment Category:', value: payment.category || 'Course' },
    { label: 'Reference No:', value: payment.transactionId || 'N/A' }
  ].filter(info => info.value && info.value !== '' && info.value !== 'N/A');

  return `
    <div style="width: 800px; margin: 0 auto; border: 1.5px solid black; font-family: 'Times New Roman', serif; font-size: 13px; color: black; line-height: 1.2; background: white;">
      <!-- 1. Header with Logos -->
      <div style="display: grid; grid-template-columns: 220px 1fr 180px; align-items: center; border-bottom: 1.5px solid black; padding: 15px; text-align: center;">
        <div style="text-align: left;">
          <img src="/images/logos/nanoschool-logo.svg" style="width: 180px; height: auto;" alt="Logo" />
          <p style="font-size: 8px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; color: #2563eb; margin: 5px 0 0 5px;">The Learning Revolution</p>
        </div>
        <div>
          <h2 style="margin: 0; font-size: 16px; font-weight: 900; text-transform: uppercase;">${conf.companyName}</h2>
          <div style="height: 2px; width: 40px; background: black; margin: 2px auto;"></div>
          <p style="font-size: 10px; font-weight: bold; margin: 5px 0 0 0;">
            ${conf.addressLine1}, ${conf.addressLine2},<br />
            ${conf.addressLine3}
          </p>
        </div>
        <div style="display: flex; justify-content: flex-end;">
          <div style="width: 60px; height: 60px; border: 1px solid black; padding: 5px; display: flex; align-items: center; justify-content: center; position: relative;">
            <img src="/images/logos/nstc-logo.svg" style="width: 50px; height: 50px;" alt="NSTC" />
            <span style="position: absolute; bottom: -5px; right: 0; background: white; font-size: 8px; font-weight: bold; padding: 0 2px;">NSTC</span>
          </div>
        </div>
      </div>

      <!-- 2. Compliance Row -->
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); border-bottom: 1.5px solid black; font-size: 11px; font-weight: bold; background: #f8fafc;">
        <div style="padding: 8px; border-right: 1px solid black;">GSTIN No: ${conf.gstin || '09AAACI8565D2ZD'}</div>
        <div style="padding: 8px; border-right: 1px solid black; text-align: center;">State Code: ${conf.stateCode || '09'}</div>
        <div style="padding: 8px; text-align: right; text-transform: uppercase;">CIN NO: ${conf.cinNo || 'U74899DL2001PTC109327'}</div>
      </div>

      <!-- 3. Title Row -->
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); border-bottom: 1.5px solid black; font-size: 11px; align-items: center;">
        <div style="padding: 8px; border-right: 1px solid black;">Invoice No: <span style="font-weight: bold;">${invoiceNumber}</span></div>
        <div style="padding: 8px; border-right: 1px solid black; text-align: center; font-weight: 900; font-size: 13px; letter-spacing: 1px;">RETAIL TAX INVOICE</div>
        <div style="padding: 8px; text-align: right;">Invoice Date: <span style="font-weight: bold;">${invoiceDate}</span></div>
      </div>

      <!-- 4. Client Info Grid -->
      <table style="width: 100%; border-collapse: collapse; border-bottom: 1.5px solid black;">
        <tbody>
          ${clientInfo.map((info, idx) => `
            <tr>
              <td style="width: 160px; padding: 8px; border-right: 1px solid black; border-bottom: ${idx < clientInfo.length - 1 ? '1px solid #e2e8f0' : 'none'}; font-weight: bold; background: ${idx % 2 === 0 ? 'white' : '#f8fafc'};">${info.label}</td>
              <td style="padding: 8px; border-bottom: ${idx < clientInfo.length - 1 ? '1px solid #e2e8f0' : 'none'}; background: ${idx % 2 === 0 ? 'white' : '#f8fafc'};">${info.value}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <!-- 5. Items Table -->
      <div style="border-bottom: 1.5px solid black;">
        <table style="width: 100%; text-align: center; border-collapse: collapse;">
          <thead>
            <tr style="border-bottom: 1px solid black; font-size: 11px; font-weight: bold;">
              <th style="padding: 5px; border-right: 1px solid black; width: 40px;">S.No.</th>
              <th style="padding: 5px; border-right: 1px solid black;">Particular</th>
              <th style="padding: 5px; border-right: 1px solid black; width: 80px;">HSN Code</th>
              <th style="padding: 5px; border-right: 1px solid black; width: 90px;">Taxable Value</th>
              <th style="padding: 5px; border-right: 1px solid black; width: 70px;">GST</th>
              <th style="padding: 5px; width: 110px;">Amount (INR)</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid #e2e8f0; vertical-align: top;">
              <td style="padding: 10px; border-right: 1px solid black;">1</td>
              <td style="padding: 10px; border-right: 1px solid black; text-align: left; font-weight: bold;">${payment.course}</td>
              <td style="padding: 10px; border-right: 1px solid black;">998439</td>
              <td style="padding: 10px; border-right: 1px solid black;">${baseAmount.toFixed(2)}</td>
              <td style="padding: 10px; border-right: 1px solid black;">${totalTax.toFixed(2)}</td>
              <td style="padding: 10px; font-weight: bold;">${payment.amount}</td>
            </tr>
            <tr style="height: 20px;">
              <td style="border-right: 1px solid black;"></td>
              <td style="border-right: 1px solid black;"></td>
              <td style="border-right: 1px solid black;"></td>
              <td style="border-right: 1px solid black;"></td>
              <td style="border-right: 1px solid black;"></td>
              <td></td>
            </tr>
          </tbody>
          <tfoot style="border-top: 1px solid black; font-weight: bold;">
            <tr>
              <td colspan="3" rowspan="3" style="border-right: 1px solid black; padding: 10px; text-align: left; vertical-align: top;">
                <p style="font-size: 10px; color: #64748b; margin: 0 0 5px 0;">AMOUNT IN WORDS (IN INR):</p>
                <p style="margin: 0; font-style: italic;"><u>${numberToWords(payment.amount)}</u></p>
              </td>
              <td style="padding: 8px; border-right: 1px solid black; border-bottom: 1px solid black; text-align: right;">Taxable Value</td>
              <td colspan="2" style="padding: 8px; border-bottom: 1px solid black; text-align: right;">${baseAmount.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-right: 1px solid black; border-bottom: 1px solid black; text-align: right;">
                ${igst > 0 ? 'Add: IGST (18%)' : 'Add: CGST/SGST (9%+9%)'}
              </td>
              <td colspan="2" style="padding: 8px; border-bottom: 1px solid black; text-align: right;">${totalTax.toFixed(2)}</td>
            </tr>
            <tr style="background: #0f172a; color: white;">
              <td style="padding: 8px; border-right: 1px solid white; text-align: right;">TOTAL AMOUNT</td>
              <td colspan="2" style="padding: 8px; text-align: right; font-size: 16px;">${payment.amount}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- 6. Bottom Declaration -->
      <div style="padding: 8px; border-bottom: 1px solid black; font-size: 11px; font-weight: bold;">
        GST HEAD: Other on-line Contents n.e.c
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr;">
        <div style="padding: 10px; border-right: 1px solid black; font-size: 9px; font-style: italic;">
          <p style="font-weight: bold; text-decoration: underline; margin: 0 0 5px 0;">Terms & Conditions:</p>
          <ul style="margin: 0; padding-left: 15px;">
            <li>Subject to local jurisdiction.</li>
            <li>Payment is strictly non-refundable once enrollment is confirmed.</li>
            <li>Professionally generated digital document.</li>
          </ul>
        </div>
        <div style="padding: 10px; display: flex; flex-direction: column; justify-content: space-between; text-align: center; min-height: 80px;">
          <p style="font-size: 10px; font-weight: bold; text-transform: uppercase; margin: 0;">For ${conf.companyName}</p>
          <div style="height: 1px; width: 140px; background: black; margin: 0 auto;"></div>
          <p style="font-size: 9px; font-weight: bold; margin: 0;">Authorized Signatory</p>
        </div>
      </div>
    </div>
  `;
}
