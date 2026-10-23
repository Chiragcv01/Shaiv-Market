import React, { useState } from 'react';
import { Link2, MessageCircle, Check } from 'lucide-react';
import { SITE_URL, CalcRoute } from '../../seo/routes';

/** Share row under a calculator: people are sent to the calculator on shaivmarket.com. */
export const ShareEmbed: React.FC<{ c: CalcRoute }> = ({ c }) => {
  const [copied, setCopied] = useState(false);
  const url = `${SITE_URL}/calculators/${c.slug}`;
  const copy = async () => {
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* clipboard blocked */ }
  };

  return (
    <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
      <span className="text-[#6B7C8F] mr-1">Share this calculator:</span>
      <button type="button" onClick={copy} className="inline-flex items-center gap-1.5 rounded-xl ring-1 ring-[#D3DCE6] hover:ring-[#0F2740] bg-white px-3 py-2 font-medium text-[#0F2740] cursor-pointer">
        {copied ? <Check className="w-4 h-4 text-[#1F6B43]" /> : <Link2 className="w-4 h-4" />} {copied ? 'Copied' : 'Copy link'}
      </button>
      <a href={`https://wa.me/?text=${encodeURIComponent(`${c.name}: ${c.blurb} ${url}`)}`} target="_blank" rel="noreferrer"
        className="inline-flex items-center gap-1.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white px-3 py-2 font-medium">
        <MessageCircle className="w-4 h-4" /> WhatsApp
      </a>
    </div>
  );
};
