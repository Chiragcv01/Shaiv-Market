import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, ChevronRight, MessageCircle, Link2, Check, ShieldCheck, ArrowLeft } from 'lucide-react';
import { POSTS, postBySlug, BlogPost } from '../content/blog';
import { useApp } from '../context/AppContext';
import { navigateTo, usePath } from '../utils/navigate';
import { ArticleCover } from './visuals/ArticleCover';

const fmtDate = (iso: string) =>
  new Date(iso + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

/** Clicks on internal links inside article HTML navigate without a full reload. */
const interceptLinks = (e: React.MouseEvent) => {
  const a = (e.target as HTMLElement).closest('a');
  const href = a?.getAttribute('href');
  if (!a || !href || !href.startsWith('/') || a.target === '_blank' || e.metaKey || e.ctrlKey) return;
  e.preventDefault();
  navigateTo(href);
};

export const BlogScreen: React.FC = () => {
  const path = usePath();
  const slug = path.startsWith('/blog/') ? path.slice(6).replace(/\/$/, '') : '';
  const post = slug ? postBySlug(slug) : undefined;
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={slug || 'index'} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
        {post ? <BlogPostView post={post} /> : <BlogIndex />}
      </motion.div>
    </AnimatePresence>
  );
};

const PostCard: React.FC<{ p: BlogPost; big?: boolean }> = ({ p, big }) => (
  <motion.a
    href={`/blog/${p.slug}`}
    onClick={(e) => { e.preventDefault(); navigateTo(`/blog/${p.slug}`); }}
    whileHover={{ y: -4 }}
    transition={{ type: 'spring', stiffness: 400, damping: 28 }}
    className={`group flex flex-col rounded-3xl bg-white ring-1 ring-[#D3DCE6] hover:ring-[#0F2740] overflow-hidden ${big ? 'md:flex-row md:col-span-2' : ''}`}
  >
    <div className={`${big ? 'md:w-1/2 h-48 md:h-auto' : 'h-36'} shrink-0`}>
      <ArticleCover seed={p.slug} />
    </div>
    <div className={`flex-1 p-5 sm:p-6 ${big ? 'md:p-8' : ''}`}>
      <p className="text-xs text-[#8A6420] font-semibold">{p.category}</p>
      <h2 className={`font-display font-semibold text-[#0F2740] leading-snug mt-1 group-hover:underline decoration-[#E3B65C] decoration-2 underline-offset-4 ${big ? 'text-2xl sm:text-3xl' : 'text-xl'}`}>{p.title}</h2>
      <p className={`mt-2 text-[#43566B] ${big ? 'text-base' : 'text-sm line-clamp-3'}`}>{p.description}</p>
      <p className="mt-4 text-xs text-[#6B7C8F] inline-flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{p.minutes} min read</p>
    </div>
  </motion.a>
);

const BlogIndex: React.FC = () => {
  const cats = useMemo(() => ['All', ...Array.from(new Set(POSTS.map((p) => p.category)))], []);
  const [cat, setCat] = useState('All');
  const list = POSTS.filter((p) => cat === 'All' || p.category === cat);
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 md:py-16">
      <div className="max-w-3xl">
        <h1 className="font-display text-4xl sm:text-6xl font-semibold text-[#0F2740] leading-[1.02]">Mutual fund guides, written plainly</h1>
        <p className="mt-4 text-lg text-[#43566B]">
          SIPs, tax, retirement income and choosing the right help, from Chirag Sharma, AMFI registered mutual fund distributor in Jaipur (ARN-337289). Real numbers, no jargon.
        </p>
      </div>
      <div role="tablist" aria-label="Topics" className="mt-8 flex gap-1.5 overflow-x-auto scrollbar-none p-1.5 rounded-2xl bg-[#EEF3F8] w-fit max-w-full">
        {cats.map((c) => (
          <button key={c} role="tab" aria-selected={cat === c} onClick={() => setCat(c)}
            className={`relative px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap cursor-pointer ${cat === c ? 'text-white' : 'text-[#43566B] hover:text-[#0F2740]'}`}>
            {cat === c && <motion.span layoutId="blog-cat" className="absolute inset-0 rounded-xl bg-[#0F2740]" transition={{ type: 'spring', stiffness: 450, damping: 35 }} />}
            <span className="relative">{c}</span>
          </button>
        ))}
      </div>
      <motion.div layout className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {list.map((p, i) => (
            <motion.div key={p.slug} layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
              className={i === 0 && cat === 'All' ? 'md:col-span-2 lg:col-span-2' : ''}>
              <PostCard p={p} big={i === 0 && cat === 'All'} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

const BlogPostView: React.FC<{ post: BlogPost }> = ({ post }) => {
  const { siteSettings } = useApp();
  const [active, setActive] = useState(post.toc[0]?.id);
  const [copied, setCopied] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const url = `https://shaivmarket.com/blog/${post.slug}`;
  const related = POSTS.filter((p) => p.slug !== post.slug).sort((a, b) => (a.category === post.category ? -1 : 0) - (b.category === post.category ? -1 : 0)).slice(0, 3);

  // highlight the section being read in the contents list
  useEffect(() => {
    const heads = bodyRef.current?.querySelectorAll('h2[id]');
    if (!heads?.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) setActive(en.target.id); });
    }, { rootMargin: '-20% 0px -70% 0px' });
    heads.forEach((h) => io.observe(h));
    return () => io.disconnect();
  }, [post.slug]);

  const copy = async () => {
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* ignore */ }
  };

  return (
    <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 md:py-14">
      <nav aria-label="Breadcrumb" className="text-sm text-[#6B7C8F] flex items-center gap-1 flex-wrap">
        <a href="/" onClick={(e) => { e.preventDefault(); navigateTo('/'); }} className="hover:text-[#0F2740]">Home</a>
        <ChevronRight className="w-3.5 h-3.5" />
        <a href="/blog" onClick={(e) => { e.preventDefault(); navigateTo('/blog'); }} className="hover:text-[#0F2740]">Blog</a>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#43566B] truncate max-w-[60vw]">{post.category}</span>
      </nav>

      <header className="max-w-3xl mt-5">
        <h1 className="font-display text-[34px] sm:text-5xl font-semibold text-[#0F2740] leading-[1.08]">{post.title}</h1>
        <div className="mt-5 flex items-center gap-3">
          {siteSettings.founderPhotoUrl && <img src={siteSettings.founderPhotoUrl} alt="Chirag Sharma" className="w-11 h-11 rounded-full object-cover ring-2 ring-[#E3B65C]" />}
          <div className="text-sm">
            <p className="text-[#0F2740] font-semibold">Chirag Sharma <span className="font-normal text-[#6B7C8F]">AMFI registered MFD, ARN-337289</span></p>
            <p className="text-[#6B7C8F]">Updated {fmtDate(post.updated)}, {post.minutes} min read</p>
          </div>
        </div>
      </header>

      <div className="mt-10 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 min-w-0">
          {post.answer && (
            <aside className="rounded-2xl bg-[#0F2740] text-white p-6 sm:p-7 mb-10">
              <p className="text-sm font-semibold text-[#E3B65C]">The short answer</p>
              <p className="mt-2 text-lg leading-relaxed text-white/90">{post.answer}</p>
            </aside>
          )}
          <div ref={bodyRef} className="blog-body" onClick={interceptLinks} dangerouslySetInnerHTML={{ __html: post.html }} />

          <div className="mt-12 rounded-3xl bg-[#FBF6EA] ring-1 ring-[#F3D58E] p-6 sm:p-8">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#0F2740]">Want this worked out for your own numbers?</h2>
            <p className="mt-2 text-[#43566B]">A free 30-minute call with Chirag. Bring your current investments; leave with a plan.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button onClick={() => navigateTo('/book-free-consultation')} className="rounded-xl bg-[#0F2740] hover:bg-[#1D4268] text-white font-semibold px-5 py-3 cursor-pointer">Book a free call</button>
              <a href={`https://wa.me/919950653247?text=${encodeURIComponent(`Hi Chirag, I read "${post.title}" on your website and have a question.`)}`} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold px-5 py-3">
                <MessageCircle className="w-4 h-4" /> Ask on WhatsApp
              </a>
            </div>
          </div>

          <div className="mt-8 flex items-start gap-4 rounded-2xl ring-1 ring-[#D3DCE6] bg-white p-5">
            {siteSettings.founderPhotoUrl && <img src={siteSettings.founderPhotoUrl} alt="" className="w-16 h-16 rounded-2xl object-cover" />}
            <div>
              <p className="font-display text-lg font-semibold text-[#0F2740]">About the author</p>
              <p className="text-sm text-[#43566B] mt-1">
                Chirag Sharma is an AMFI registered mutual fund distributor (ARN-337289, EUIN E641362) and NISM Series V-A certified, based at Bhamashah Techno Hub, Jhalana Doongari, Jaipur. He helps families plan SIPs, retirement income and goal-based portfolios.
              </p>
              <button onClick={() => navigateTo('/about')} className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-[#8A6420] hover:underline cursor-pointer">
                <ShieldCheck className="w-4 h-4" /> See credentials
              </button>
            </div>
          </div>

          <p className="mt-6 text-xs text-[#6B7C8F] leading-relaxed">
            Mutual fund investments are subject to market risks, read all scheme related documents carefully. Figures are illustrations at assumed returns and are not guaranteed. Tax rules are as understood at the time of writing; check with your tax adviser for your situation. Shaiv Market is an AMFI registered mutual fund distributor, not a SEBI registered investment adviser.
          </p>
        </div>

        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--header-h,80px)+24px)] space-y-6 transition-[top] duration-300">
            {post.toc.length > 2 && (
              <nav aria-label="On this page" className="rounded-2xl bg-white ring-1 ring-[#D3DCE6] p-5 hidden lg:block">
                <p className="text-sm font-semibold text-[#0F2740] mb-3">On this page</p>
                <ul className="space-y-1">
                  {post.toc.map((t) => (
                    <li key={t.id}>
                      <a href={`#${t.id}`} onClick={(e) => { e.preventDefault(); document.getElementById(t.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
                        className={`relative block pl-4 py-1.5 text-sm transition-colors ${active === t.id ? 'text-[#0F2740] font-medium' : 'text-[#6B7C8F] hover:text-[#0F2740]'}`}>
                        {active === t.id && <motion.span layoutId="toc-dot" className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-5 rounded-full bg-[#E3B65C]" />}
                        {t.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
            <div className="rounded-2xl bg-white ring-1 ring-[#D3DCE6] p-5">
              <p className="text-sm font-semibold text-[#0F2740] mb-3">Share this guide</p>
              <div className="flex gap-2">
                <a href={`https://wa.me/?text=${encodeURIComponent(`${post.title} ${url}`)}`} target="_blank" rel="noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] text-white text-sm font-semibold py-2.5">
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
                <button onClick={copy} className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl ring-1 ring-[#D3DCE6] hover:ring-[#0F2740] text-sm font-semibold text-[#0F2740] py-2.5 cursor-pointer">
                  {copied ? <><Check className="w-4 h-4 text-[#25D366]" /> Copied</> : <><Link2 className="w-4 h-4" /> Copy link</>}
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <section className="mt-16" aria-labelledby="related-heading">
        <div className="flex items-end justify-between gap-4">
          <h2 id="related-heading" className="font-display text-3xl font-semibold text-[#0F2740]">Keep reading</h2>
          <button onClick={() => navigateTo('/blog')} className="inline-flex items-center gap-1 text-sm font-semibold text-[#8A6420] cursor-pointer"><ArrowLeft className="w-4 h-4" /> All guides</button>
        </div>
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          {related.map((p) => <PostCard key={p.slug} p={p} />)}
        </div>
      </section>
    </article>
  );
};
