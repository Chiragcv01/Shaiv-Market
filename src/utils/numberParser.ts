// Utility for parsing Indian financial number formats and shortcuts like '3 lakh', '2,50,890', '1.5 cr', '50k'

export function parseIndianNumber(val: string | number | undefined | null): number {
  if (val === undefined || val === null) return 0;
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  
  let s = val.toString().trim().toLowerCase();
  if (!s) return 0;
  
  // Remove currency symbol ₹ and commas, extra spaces
  s = s.replace(/₹/g, '').replace(/,/g, '').trim();
  
  // Match patterns like "3lakk", "3 lakh", "3lakhs", "3lac", "3 lac", "3l", "3.5l"
  const lakhMatch = s.match(/^([\d.]+)\s*(lakh|lakhs|lakk|lakks|lac|lacs|l)$/i);
  if (lakhMatch) {
    const num = parseFloat(lakhMatch[1]);
    return isNaN(num) ? 0 : Math.round(num * 100000);
  }
  
  // Match patterns like "1.5crore", "1.5 crore", "1.5cr", "1.5 cr", "1.5crores"
  const crMatch = s.match(/^([\d.]+)\s*(crore|crores|cr|crs)$/i);
  if (crMatch) {
    const num = parseFloat(crMatch[1]);
    return isNaN(num) ? 0 : Math.round(num * 10000000);
  }
  
  // Match patterns like "50k", "50 k", "50 thousand"
  const kMatch = s.match(/^([\d.]+)\s*(k|thousand|thousands|th)$/i);
  if (kMatch) {
    const num = parseFloat(kMatch[1]);
    return isNaN(num) ? 0 : Math.round(num * 1000);
  }
  
  // Direct numeric value
  const num = parseFloat(s);
  return isNaN(num) ? 0 : num;
}

export function formatIndianCurrency(num: number): string {
  if (isNaN(num)) return '₹0';
  if (num >= 10000000) {
    const cr = num / 10000000;
    return `₹${cr.toFixed(cr % 1 === 0 ? 0 : 2)} Cr`;
  }
  if (num >= 100000) {
    const lakh = num / 100000;
    return `₹${lakh.toFixed(lakh % 1 === 0 ? 0 : 2)} Lakh`;
  }
  return `₹${Math.round(num).toLocaleString('en-IN')}`;
}

export function formatIndianNumberExact(num: number): string {
  if (isNaN(num)) return '0';
  return Math.round(num).toLocaleString('en-IN');
}
