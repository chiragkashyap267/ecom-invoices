'use client';

import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
const Plus = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Trash2 = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M3 6h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 6v14M16 6v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 6V4h4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Download = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 11l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 21H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Upload = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 21V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 13l4-4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LayoutTemplate = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
    <path d="M8 3v18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Type = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 7h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 7v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

declare global {
  interface Window {
    html2pdf?: () => {
      set: (opt: unknown) => { from: (el: HTMLElement) => { save: () => void } };
    };
  }
}

type InvoiceItem = { id: number; description: string; price: number; qty: number };

type InvoiceData = {
  invoiceTitle: string;
  invoiceNo: string;
  date: string;
  dueDate: string;
  currency: string;
  companyName: string;
  companyAddress: string;
  companyEmail: string;
  companyPhone: string;
  signatoryName: string;
  signatoryTitle: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  items: InvoiceItem[];
  discount: number;
  amountPaid: number;
  paymentMethod: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
  qrCodeImage?: string;
};

export default function InvoiceApp(): React.JSX.Element {
  // PRE-FILLED DATA: These are your defaults.
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    invoiceTitle: 'INVOICE FOR ANVIRA WEBSITE DESIGN',
    invoiceNo: '49',
    date: '2026-01-25',
    dueDate: '2026-01-25',
    currency: 'RS',
    
    // Company Details (EcomXpert Studios) - PRE-FILLED
    companyName: 'EcomXpert Studios',
    companyAddress: '46 mahdi road, Roorkee-247667',
    companyEmail: 'businesswithchirag267@gmail.com',
    companyPhone: '+91 9548174325',
    signatoryName: 'Kashyap',
    signatoryTitle: 'Administrator',
    
    // Client Details (Neelkanth Enterprise)
    clientName: 'NEELKANTH ENTERPRISE',
    clientEmail: 'pranika.care@gmail.com',
    clientPhone: '+91 79904 26066',
    clientAddress: '',
    
    // Items
    items: [
      { id: 1, description: 'INFOGRAPHICS FOR Scalp Serum', price: 90, qty: 6 },
      { id: 2, description: 'INFOGRAPHICS FOR Radiance Serum', price: 90, qty: 6 },
      { id: 3, description: 'Label for Sunscreen', price: 400, qty: 1 },
      { id: 4, description: 'Label for Radiance cleanse', price: 400, qty: 1 },
      { id: 5, description: 'INFOGRAPHICS FOR Sunscreen', price: 90, qty: 6 },
      { id: 6, description: 'INFOGRAPHICS FOR Radiance cleanse', price: 90, qty: 6 },
    ],
    
    // Financials
    discount: 360,
    amountPaid: 0, 
    
    // Payment Details - PRE-FILLED
    paymentMethod: 'Online (QR CODE)',
    bankName: 'kotak mahindra bank',
    accountNumber: '7745700684',
    ifscCode: 'KKBK0005486',
    upiId: '9548174325@ptsbi',
    qrCodeImage: '/default-qr.svg' 
  });

  const invoiceRef = useRef<HTMLDivElement | null>(null);
  const [pdfReady, setPdfReady] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
    script.async = true;
    script.onload = () => setPdfReady(true);
    script.onerror = () => setPdfReady(false);
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  const calculateSubTotal = () => {
    return invoiceData.items.reduce((acc, item) => acc + (item.price * item.qty), 0);
  };

  const calculateTotal = () => {
    return calculateSubTotal() - invoiceData.discount;
  };

  const calculateBalanceDue = () => {
    return calculateTotal() - (invoiceData.amountPaid || 0);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value } = target;
    // Convert numeric fields to numbers where appropriate
    if (name === 'discount' || name === 'amountPaid') {
      setInvoiceData(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setInvoiceData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleItemChange = (id: number, field: keyof InvoiceItem, value: string | number) => {
    setInvoiceData(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === id ? { ...item, [field]: field === 'description' ? String(value) : Number(value) } : item
      )
    }));
  };

  const addItem = () => {
    setInvoiceData(prev => ({
      ...prev,
      items: [...prev.items, { id: Date.now(), description: 'New Item', price: 0, qty: 1 }]
    }));
  };

  const removeItem = (id: number) => {
    setInvoiceData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const handleQrUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInvoiceData(prev => ({ ...prev, qrCodeImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const [pdfStatus, setPdfStatus] = useState<string | null>(null);

  const generatePDF = async () => {
    if (typeof window === 'undefined' || !invoiceRef.current) return;
    setIsGenerating(true);
    setPdfStatus('Starting PDF generation...');
    const filename = `Invoice-${invoiceData.invoiceNo}.pdf`;

    // Prefer local fallback (html2canvas + jsPDF) because CDN html2pdf can be unreliable in some deployment environments.
    try {
      console.debug('generatePDF: using local html2canvas + jsPDF fallback');
      setPdfStatus('Rendering canvas (html2canvas)...');
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf')
      ]);

      const element = invoiceRef.current as HTMLDivElement;
      console.debug('generatePDF: calling html2canvas');
      // Use onclone to copy resolved/computed colors into the cloned DOM to avoid unsupported color functions like lab()
      // Helper: convert lab(...) occurrences to rgb(...) string
      const replaceLabInCssValue = (val: string): string => {
        if (!val || typeof val !== 'string') return val;
        return val.replace(/lab\(([^)]+)\)/gi, (_, inner) => {
          try {
            const parts = inner.trim().split(/\s+|,\s*/).filter(Boolean);
            if (parts.length < 3) return _;
            // parse L a b
            let L = parts[0];
            let a = parts[1];
            let b = parts[2];
            const parseNumber = (s: string) => {
              if (s.endsWith('%')) return parseFloat(s) * 100 / 100; // percent -> 0-100
              return parseFloat(s);
            };
            const Lnum = parseNumber(L);
            const anum = parseFloat(a);
            const bnum = parseFloat(b);
            const labToRgb = (L: number, a: number, b: number) => {
              // Convert LAB to XYZ
              const y = (L + 16) / 116;
              const x = a / 500 + y;
              const z = y - b / 200;
              const fx3 = (t: number) => (t * t * t > 0.008856 ? t * t * t : (t - 16 / 116) / 7.787);
              const X = fx3(x) * 95.047;
              const Y = fx3(y) * 100.0;
              const Z = fx3(z) * 108.883;
              // Convert XYZ to sRGB
              let r = X * 0.032406 + Y * -0.015372 + Z * -0.004986;
              let g = X * -0.009689 + Y * 0.017658 + Z * 0.000415;
              let bl = X * 0.000557 + Y * -0.002040 + Z * 0.010570;
              // normalize from 0..100 to 0..1
              r = r / 100;
              g = g / 100;
              bl = bl / 100;
              const gamma = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);
              r = Math.min(1, Math.max(0, gamma(r)));
              g = Math.min(1, Math.max(0, gamma(g)));
              bl = Math.min(1, Math.max(0, gamma(bl)));
              return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(bl * 255)})`;
            };
            return labToRgb(Lnum, anum, bnum);
          } catch (e) {
            console.warn('lab to rgb conversion failed', e);
            return _;
          }
        });
      };

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        onclone: (clonedDoc: Document) => {
          try {
            // Replace lab() usages inside stylesheet rules first
            try {
              for (const sheet of Array.from(clonedDoc.styleSheets || [] as any)) {
                try {
                  const rules = (sheet as CSSStyleSheet).cssRules || [];
                  for (const rule of Array.from(rules as any)) {
                    try {
                      if ((rule as CSSStyleRule).style && (rule as CSSStyleRule).style.cssText) {
                        const cssText = (rule as CSSStyleRule).style.cssText;
                        if (cssText && cssText.includes('lab(')) {
                          (rule as CSSStyleRule).style.cssText = replaceLabInCssValue(cssText);
                        }
                      }
                    } catch (e) {
                      // ignore rule access issues
                    }
                  }
                } catch (e) {
                  // ignore sheet access issues (CORS, etc.)
                }
              }
            } catch (e) {
              console.warn('styleSheet patch failed', e);
            }

            const originals = element.querySelectorAll('*');
            const clones = clonedDoc.querySelectorAll('*');
            const len = Math.min(originals.length, clones.length);
            for (let i = 0; i < len; i++) {
              const o = originals[i] as HTMLElement;
              const c = clones[i] as HTMLElement;
              const cs = window.getComputedStyle(o);
              // replace lab() in computed styles with rgb equivalents when possible
              if (cs.color) c.style.color = replaceLabInCssValue(cs.color);
              if (cs.backgroundColor) c.style.backgroundColor = replaceLabInCssValue(cs.backgroundColor);
              if (cs.borderColor) c.style.borderColor = replaceLabInCssValue(cs.borderColor);
              if (cs.boxShadow && cs.boxShadow !== 'none') c.style.boxShadow = replaceLabInCssValue(cs.boxShadow);
            }
          } catch (e) {
            console.warn('onclone style patch failed', e);
          }
        }
      });
      console.debug('generatePDF: canvas rendered', { width: canvas.width, height: canvas.height });
      setPdfStatus('Canvas rendered, preparing PDF');

      let imgData: string | null = null;
      try {
        imgData = canvas.toDataURL('image/jpeg', 0.98);
        console.debug('generatePDF: canvas.toDataURL() succeeded');
      } catch (err) {
        console.warn('generatePDF: canvas.toDataURL failed, trying toBlob fallback', err);
        setPdfStatus('Canvas toDataURL failed, trying blob fallback');
        imgData = await new Promise<string>((resolve, reject) => {
          canvas.toBlob((blob) => {
            if (!blob) return reject(new Error('toBlob returned null'));
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = (e) => reject(e);
            reader.readAsDataURL(blob);
          }, 'image/jpeg', 0.98);
        });
        console.debug('generatePDF: canvas.toBlob -> dataURL succeeded');
      }

      const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgProps = (pdf as any).getImageProperties ? pdf.getImageProperties(imgData) : { width: canvas.width, height: canvas.height };
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      console.debug('generatePDF: adding image to pdf', { pdfWidth, pdfHeight });
      pdf.addImage(imgData as string, 'JPEG', 0, 0, pdfWidth, pdfHeight);

      // Create blob and trigger download via object URL for better reliability
      setPdfStatus('Generating PDF blob...');
      const blob = await pdf.output('blob');
      console.debug('generatePDF: pdf blob ready', blob);
      setPdfStatus('PDF blob ready, triggering download');
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      console.debug('generatePDF: calling a.click()');
      a.click();
      console.debug('generatePDF: a.click() returned');
      a.remove();

      // Delay revoke to avoid revoking before browser starts download
      setTimeout(() => {
        try { URL.revokeObjectURL(blobUrl); console.debug('generatePDF: revoked blobUrl'); } catch (e) {}
      }, 3000);

      // Fallback: try opening in new tab if download didn't start (best-effort)
      try {
        const opened = window.open(blobUrl);
        if (opened) {
          console.debug('generatePDF: opened blobUrl in new tab as fallback');
          setPdfStatus('Opened PDF in a new tab');
        }
      } catch (e) {
        console.debug('generatePDF: window.open fallback failed', e);
      }

      console.debug('generatePDF: download triggered via blobUrl');
      setPdfStatus('Download triggered');
      setIsGenerating(false);
      setTimeout(() => setPdfStatus(null), 2000);
    } catch (err) {
      console.error('PDF generation failed', err);
      setPdfStatus('PDF generation failed');
      setIsGenerating(false);
      alert('PDF generation failed. Please open the browser console for details.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800 p-4 md:p-8">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Invoice Generator</h1>
          <p className="text-gray-500 text-sm">Next.js Ready • PDF Export • Payment Integration</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={generatePDF}
            disabled={isGenerating}
            className={`flex items-center gap-2 ${isGenerating ? 'bg-blue-400 cursor-wait' : 'bg-blue-600 hover:bg-blue-700'} text-white px-6 py-2.5 rounded-lg shadow transition-all font-medium`}
          >
            <Download size={18} /> {isGenerating ? 'Generating...' : 'Download PDF'}
          </button>
        </div>
        {pdfStatus && (
          <div className="mt-3 w-full text-center">
            <span className="inline-block bg-white px-3 py-1 rounded text-sm text-gray-700 shadow">{pdfStatus}</span>
          </div>
        )}
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT: Editor Form */}
        <div className="lg:col-span-5 space-y-6 h-fit overflow-y-auto max-h-screen custom-scrollbar pr-2">
          
          {/* Company Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-600">
              <LayoutTemplate size={18} /> Company Info
            </h2>
            <div className="space-y-3">
              <div className="mb-4 pb-4 border-b border-gray-100">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Main Project Title</label>
                <div className="flex items-center gap-2 border rounded bg-gray-50 focus-within:ring-2 focus-within:ring-blue-100">
                   <Type size={16} className="text-gray-400 ml-2" />
                   <input 
                    name="invoiceTitle" 
                    value={invoiceData.invoiceTitle} 
                    onChange={handleInputChange} 
                    placeholder="e.g. INVOICE FOR WEBSITE DESIGN"
                    className="w-full p-2 text-sm bg-transparent outline-none font-medium text-gray-700" 
                  />
                </div>
              </div>

              <input 
                name="companyName" 
                value={invoiceData.companyName} 
                onChange={handleInputChange} 
                placeholder="Company Name"
                className="w-full p-2 border rounded text-sm bg-gray-50 focus:ring-2 focus:ring-blue-100 outline-none" 
              />
              <textarea 
                name="companyAddress" 
                value={invoiceData.companyAddress} 
                onChange={handleInputChange} 
                placeholder="Address"
                rows={2}
                className="w-full p-2 border rounded text-sm bg-gray-50 focus:ring-2 focus:ring-blue-100 outline-none" 
              />
              <div className="grid grid-cols-2 gap-3">
                <input 
                  name="companyEmail" 
                  value={invoiceData.companyEmail} 
                  onChange={handleInputChange} 
                  placeholder="Email"
                  className="w-full p-2 border rounded text-sm bg-gray-50" 
                />
                 <input 
                  name="companyPhone" 
                  value={invoiceData.companyPhone} 
                  onChange={handleInputChange} 
                  placeholder="Phone"
                  className="w-full p-2 border rounded text-sm bg-gray-50" 
                />
              </div>
            </div>
          </div>

          {/* Client Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4 text-blue-600">Client Info</h2>
            <div className="space-y-3">
              <input 
                name="clientName" 
                value={invoiceData.clientName} 
                onChange={handleInputChange} 
                placeholder="Client Name"
                className="w-full p-2 border rounded text-sm bg-gray-50" 
              />
              
              <div className="grid grid-cols-2 gap-3">
                <input 
                  name="clientEmail" 
                  value={invoiceData.clientEmail} 
                  onChange={handleInputChange} 
                  placeholder="Client Email"
                  className="w-full p-2 border rounded text-sm bg-gray-50" 
                />
                 <input 
                  name="clientPhone" 
                  value={invoiceData.clientPhone} 
                  onChange={handleInputChange} 
                  placeholder="Client Phone"
                  className="w-full p-2 border rounded text-sm bg-gray-50" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                 <input 
                  name="invoiceNo" 
                  value={invoiceData.invoiceNo} 
                  onChange={handleInputChange} 
                  placeholder="Invoice No"
                  className="w-full p-2 border rounded text-sm bg-gray-50" 
                />
                 <input 
                  type="date"
                  name="date" 
                  value={invoiceData.date} 
                  onChange={handleInputChange} 
                  className="w-full p-2 border rounded text-sm bg-gray-50" 
                />
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-blue-600">Items</h2>
              <button onClick={addItem} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 flex items-center gap-1">
                <Plus size={14} /> Add Item
              </button>
            </div>
            <div className="space-y-3">
              {invoiceData.items.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-center bg-gray-50 p-2 rounded border border-gray-100">
                  <div className="col-span-6">
                    <input 
                      value={item.description} 
                      onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                      placeholder="Description"
                      className="w-full p-1 bg-transparent border-b border-dashed border-gray-300 text-sm focus:border-blue-500 outline-none" 
                    />
                  </div>
                  <div className="col-span-2">
                    <input 
                      type="number"
                      value={item.price} 
                      onChange={(e) => handleItemChange(item.id, 'price', parseFloat(e.target.value) || 0)}
                      placeholder="Price"
                      className="w-full p-1 bg-transparent border-b border-dashed border-gray-300 text-sm text-right" 
                    />
                  </div>
                  <div className="col-span-2">
                    <input 
                      type="number"
                      value={item.qty} 
                      onChange={(e) => handleItemChange(item.id, 'qty', parseFloat(e.target.value) || 0)}
                      placeholder="Qty"
                      className="w-full p-1 bg-transparent border-b border-dashed border-gray-300 text-sm text-center" 
                    />
                  </div>
                  <div className="col-span-2 flex justify-end">
                    <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm font-medium text-gray-500">Discount</span>
                <input 
                  type="number"
                  name="discount" 
                  value={invoiceData.discount} 
                  onChange={handleInputChange} 
                  className="w-24 p-1 border rounded text-right text-sm" 
                />
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm font-medium text-gray-500">Amount Paid</span>
                <input 
                  type="number"
                  name="amountPaid" 
                  value={invoiceData.amountPaid} 
                  onChange={handleInputChange} 
                  className="w-24 p-1 border rounded text-right text-sm" 
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
             <h2 className="text-lg font-semibold mb-4 text-blue-600">Payment Info</h2>
             <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input 
                    name="bankName" 
                    value={invoiceData.bankName} 
                    onChange={handleInputChange} 
                    placeholder="Bank Name"
                    className="w-full p-2 border rounded text-sm bg-gray-50" 
                  />
                   <input 
                    name="accountNumber" 
                    value={invoiceData.accountNumber} 
                    onChange={handleInputChange} 
                    placeholder="Account No"
                    className="w-full p-2 border rounded text-sm bg-gray-50" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input 
                    name="ifscCode" 
                    value={invoiceData.ifscCode} 
                    onChange={handleInputChange} 
                    placeholder="IFSC Code"
                    className="w-full p-2 border rounded text-sm bg-gray-50" 
                  />
                   <input 
                    name="upiId" 
                    value={invoiceData.upiId} 
                    onChange={handleInputChange} 
                    placeholder="UPI ID"
                    className="w-full p-2 border rounded text-sm bg-gray-50" 
                  />
                </div>
                <div className="border-t pt-3 mt-3">
                  <label className="text-sm text-gray-600 block mb-2">Payment QR Code (Upload Image)</label>
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-2 rounded text-sm flex items-center gap-2 transition">
                      <Upload size={16} /> Upload QR
                      <input type="file" onChange={handleQrUpload} className="hidden" accept="image/*" />
                    </label>
                    <span className="text-xs text-gray-400">or use default</span>
                  </div>
                </div>
             </div>
          </div>

        </div>

        {/* RIGHT: Preview (A4 Size) */}
        <div className="lg:col-span-7 bg-gray-300 p-4 md:p-8 overflow-x-auto flex justify-center items-start rounded-xl">
          <div 
            id="invoice-preview" 
            ref={invoiceRef}
            className="bg-white shadow-2xl relative"
            style={{ 
              // FIXED WIDTH: 190mm fits perfectly inside A4 (210mm) with 10mm margins on both sides
              width: '190mm', 
              minHeight: '297mm',
              padding: '0'
            }}
          >
            {/* INVOICE CONTENT START */}
            <div className="flex flex-col h-full justify-between">
              
              {/* TOP SECTION */}
              <div className="p-8">
                
                {/* Main Heading */}
                <div className="text-center mb-10">
                   <h2 className="text-xl font-bold uppercase tracking-widest border-b-2 border-black pb-2 inline-block" style={{ color: '#000000' }}>
                     {invoiceData.invoiceTitle}
                   </h2>
                </div>

                {/* Header Row */}
                <div className="flex justify-between items-start mb-16">
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight uppercase" style={{ color: '#000000' }}>{invoiceData.companyName}</h1>
                  </div>
                  <div className="text-right">
                     <div className="mb-2">
                        <span className="block text-sm uppercase tracking-wider font-bold" style={{ color: '#333333' }}>Invoice No</span>
                        <span className="text-xl font-bold" style={{ color: '#000000' }}>{invoiceData.invoiceNo}</span>
                     </div>
                     <div className="mb-6">
                        <span className="block text-sm uppercase tracking-wider font-bold" style={{ color: '#333333' }}>Date</span>
                        <span className="text-md font-bold" style={{ color: '#000000' }}>
                          {new Date(invoiceData.date).toLocaleDateString('en-GB')}
                        </span>
                     </div>
                     
                     {/* FIXED TOTAL DUE BLOCK - PLAIN BLACK TEXT, NO BOX */}
                     <div className="inline-block text-right min-w-[140px]">
                        <span 
                          className="block text-xs font-bold uppercase mb-1" 
                          style={{ color: '#000000' }}
                        >
                          Total Due
                        </span>
                        <span 
                          className="block text-2xl font-extrabold" 
                          style={{ color: '#000000' }}
                        >
                          {calculateBalanceDue().toLocaleString()} {invoiceData.currency}
                        </span>
                     </div>

                  </div>
                </div>

                {/* Table */}
                <div className="mb-12">
                   <table className="w-full">
                      <thead>
                         <tr className="border-b-2 border-black">
                            <th className="text-left py-3 text-sm font-bold uppercase w-[50%]" style={{ color: '#000000' }}>Service</th>
                            <th className="text-right py-3 text-sm font-bold uppercase" style={{ color: '#000000' }}>Price</th>
                            <th className="text-center py-3 text-sm font-bold uppercase" style={{ color: '#000000' }}>Qty</th>
                            <th className="text-right py-3 text-sm font-bold uppercase" style={{ color: '#000000' }}>Total</th>
                         </tr>
                      </thead>
                      <tbody>
                        {invoiceData.items.map((item, index) => (
                          <tr key={index} className="border-b border-gray-200 last:border-0" style={{ pageBreakInside: 'avoid' }}>
                            <td className="py-4 text-sm font-bold" style={{ color: '#000000' }}>{item.description}</td>
                            <td className="py-4 text-sm font-medium text-right" style={{ color: '#000000' }}>{item.price} {invoiceData.currency}</td>
                            <td className="py-4 text-sm font-medium text-center" style={{ color: '#000000' }}>{item.qty}</td>
                            <td className="py-4 text-sm font-bold text-right" style={{ color: '#000000' }}>
                              {(item.price * item.qty).toLocaleString()} {invoiceData.currency}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                   </table>
                </div>

                {/* Middle Info Section */}
                <div className="flex justify-between items-start mt-8" style={{ pageBreakInside: 'avoid' }}>
                  {/* Bill To */}
                  <div className="w-1/2 pr-8">
                     <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#000000' }}>Invoice To:</h4>
                     <div className="font-bold text-lg mb-1" style={{ color: '#000000' }}>{invoiceData.clientName}</div>
                     <div className="text-sm mb-1" style={{ color: '#000000' }}>{invoiceData.clientEmail}</div>
                     <div className="text-sm mb-4" style={{ color: '#000000' }}>{invoiceData.clientPhone}</div>

                     {/* Payment Method Block */}
                     <div className="mt-8">
                        <h4 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#000000' }}>Payment Details:</h4>
                        <div className="bg-gray-50 p-4 rounded border border-gray-200 text-sm">
                           <div className="flex gap-4">
                              {/* QR Code */}
                              <div className="flex-shrink-0">
                                {invoiceData.qrCodeImage ? (
                                  <img src={invoiceData.qrCodeImage} alt="Payment QR" className="w-24 h-24 object-cover border rounded" />
                                ) : (
                                  <div className="w-24 h-24 bg-gray-200 flex items-center justify-center text-xs text-gray-500">No QR</div>
                                )}
                              </div>
                              {/* Bank Details */}
                              <div className="flex flex-col justify-center space-y-1">
                                 <p className="font-bold" style={{ color: '#000000' }}>{invoiceData.bankName}</p>
                                 <p style={{ color: '#000000' }}><span className="font-medium">A/C:</span> {invoiceData.accountNumber}</p>
                                 <p style={{ color: '#000000' }}><span className="font-medium">IFSC:</span> {invoiceData.ifscCode}</p>
                                 <p style={{ color: '#000000' }}><span className="font-medium">UPI:</span> {invoiceData.upiId}</p>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Totals Block */}
                  <div className="w-1/3">
                      <div className="space-y-3 border-t-2 border-black pt-4">
                        <div className="flex justify-between items-center" style={{ color: '#000000' }}>
                           <span className="font-bold text-sm">Sub-total:</span>
                           <span className="font-bold">{calculateSubTotal().toLocaleString()} {invoiceData.currency}</span>
                        </div>
                        <div className="flex justify-between items-center text-red-600">
                           <span className="font-bold text-sm">Discount:</span>
                           <span className="font-bold">- {invoiceData.discount} {invoiceData.currency}</span>
                        </div>
                        
                         <div className="flex justify-between items-center" style={{ color: '#000000' }}>
                            <span className="font-bold text-sm">Total:</span>
                            <span className="font-bold">{calculateTotal().toLocaleString()} {invoiceData.currency}</span>
                         </div>
                        
                        {invoiceData.amountPaid > 0 && (
                           <div className="flex justify-between items-center text-green-700">
                              <span className="font-bold text-sm">Paid:</span>
                              <span className="font-bold">- {invoiceData.amountPaid} {invoiceData.currency}</span>
                           </div>
                        )}

                        <div className="flex justify-between items-center pt-4 border-t border-gray-300" style={{ color: '#000000' }}>
                           <span className="font-extrabold text-lg">Balance Due:</span>
                           <span className="font-extrabold text-xl">{calculateBalanceDue().toLocaleString()} {invoiceData.currency}</span>
                        </div>
                      </div>
                      
                      <div className="mt-8 text-right">
                         <p className="text-sm font-bold italic" style={{ color: '#2563eb' }}>Thank you for purchase!</p>
                      </div>
                  </div>
                </div>
              </div>

              {/* FOOTER SECTION */}
              <div className="bg-gray-50 px-8 py-8 mt-auto border-t border-gray-200">
                 <div className="flex justify-between items-end">
                    
                    {/* Contact Us */}
                    <div>
                       <h4 className="text-md font-bold mb-2" style={{ color: '#000000' }}>Contact Us</h4>
                       <div className="space-y-1 text-sm" style={{ color: '#000000' }}>
                          <p className="font-bold">{invoiceData.companyPhone}</p>
                          <p>{invoiceData.companyEmail}</p>
                          <p className="max-w-[200px] leading-tight mt-2">{invoiceData.companyAddress}</p>
                       </div>
                    </div>

                 </div>
              </div>
              
            </div>
            {/* INVOICE CONTENT END */}
          </div>
        </div>
      </div>
    </div>
  );
}