/** Navy page banner. Holds the page's single <h1>. */
export default function PageHeader({ eyebrow, title, children, maxWidth = "max-w-7xl", aside = null }) {
  return (
    <div className="bg-navy py-12 md:py-16 print:hidden">
      <div className={`${maxWidth} mx-auto px-4 md:px-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4`}>
        <div>
          {eyebrow && <p className="text-xs font-mono uppercase tracking-[0.3em] text-brand">{eyebrow}</p>}
          <h1 className="text-3xl md:text-5xl font-black text-white mt-2 tracking-tight">{title}</h1>
          {children && <div className="text-slate-400 mt-3 max-w-2xl text-sm md:text-base">{children}</div>}
        </div>
        {aside}
      </div>
    </div>
  );
}
