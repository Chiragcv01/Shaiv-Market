import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Code2, Link2, MessageCircle, Check, X } from 'lucide-react';
import { SITE_URL, CalcRoute } from '../../seo/routes';

export const embedCode = (c: CalcRoute) => `<iframe id="sm-${c.slug}" src="${SITE_URL}/embed/${c.slug}" title="${c.name} by Shaiv Market" width="100%" height="1100" style="border:0;border-radius:16px;max-width:1200px" loading="lazy"></iframe>
<p style="font:13px/1.4 sans-serif;margin:6px 0 0">${c.name} by <a href="${SITE_URL}/calculators/${c.slug}">Shaiv Market</a></p>
<script>addEventListener("message",function(e){if(e.origin==="${SITE_URL}"&&e.data&&e.data.smSlug==="${c.slug}"){var f=document.getElementById("sm-${c.slug}");if(f)f.style.height=e.data.smHeight+"px"}});</script>`;

/** Share row under a calculator: copy link, WhatsApp, and embed code for other websites. */
export const ShareEmbed: React.FC<{ c: CalcRoute }> = ({ c }) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<'link' | 'code' | null>(null);
  const url = `${SITE_URL}/calculators/${c.slug}`;
  const copy = async (text: string, what: 'link' | 'code') => {
    try { await navigator.clipboard.writeText(text); setCopied(what); setTimeout(() => setCopied(null), 1800); } catch { /* clipboard blocked */ }
  };

  return (
    <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
      <span className="text-[#6B7C8F] mr-1">Share this calculator:</span>
      <button type="button" onClick={() => copy(url, 'link')} className="inline-flex items-center gap-1.5 rounded-xl ring-1 ring-[#D3DCE6] hover:ring-[#0F2740] bg-white px-3 py-2 font-medium text-[#0F2740] cursor-pointer">
        {copied === 'link' ? <Check className="w-4 h-4 text-[#1F6B43]" /> : <Link2 className="w-4 h-4" />} {copied === 'link' ? 'Copied' : 'Copy link'}
      </button>
      <a href={`https://wa.me/?text=${encodeURIComponent(`${c.name}: ${c.blurb} ${url}`)}`} target="_blank" rel="noreferrer"
        className="inline-flex items-center gap-1.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white px-3 py-2 font-medium">
        <MessageCircle className="w-4 h-4" /> WhatsApp
      </a>
      <button type="button" onClick={() => setOpen(true)} className="inline-flex items-center gap-1.5 rounded-xl ring-1 ring-[#D3DCE6] hover:ring-[#0F2740] bg-white px-3 py-2 font-medium text-[#0F2740] cursor-pointer">
        <Code2 className="w-4 h-4" /> Embed on your website
      </button>

      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-[#0A1D30]/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <motion.div role="dialog" aria-modal="true" aria-label="Embed this calculator"
              className="relative w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl"
              initial={{ y: 24, scale: 0.97 }} animate={{ y: 0, scale: 1 }} exit={{ y: 16, scale: 0.98 }} transition={{ type: 'spring', stiffness: 420, damping: 32 }}>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-[#EEF3F8] cursor-pointer"><X className="w-5 h-5" /></button>
              <p className="font-display text-2xl font-semibold text-[#0F2740]">Put this calculator on your website</p>
              <p className="mt-1 text-sm text-[#43566B]">Free for blogs, CA and finance websites. Paste this code where you want the calculator to appear. It resizes itself to fit.</p>
              <textarea readOnly value={embedCode(c)} onFocus={(e) => e.currentTarget.select()}
                className="mt-4 w-full h-40 rounded-xl bg-[#0F2740] text-[#E3ECF5] font-mono text-xs p-3 resize-none outline-none" />
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <button type="button" onClick={() => copy(embedCode(c), 'code')} className="inline-flex items-center gap-1.5 rounded-xl bg-[#0F2740] hover:bg-[#1D4268] text-white text-sm font-semibold px-4 py-2.5 cursor-pointer">
                  {copied === 'code' ? <Check className="w-4 h-4" /> : <Code2 className="w-4 h-4" />} {copied === 'code' ? 'Code copied' : 'Copy embed code'}
                </button>
                <a href={`/embed/${c.slug}`} target="_blank" rel="noopener" className="text-sm font-semibold text-[#8A6420] hover:underline">Preview the embed</a>
              </div>
              <p className="mt-3 text-xs text-[#6B7C8F]">Please keep the small credit line under the calculator.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
