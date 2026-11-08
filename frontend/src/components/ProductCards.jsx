import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import IconTile from './IconTile';
import { productImage, isPlaceholder, nodeTitle } from '../data/productCatalog';

// A product's photo (or the shared placeholder until the real photo is added in productCatalog.js)
export function ProductImage({ node, className = '' }) {
  const { t } = useLanguage();
  const src = productImage(node);
  return (
    <img
      src={src}
      alt={isPlaceholder(src) ? '' : nodeTitle(node, t)}
      loading="lazy"
      className={`object-cover bg-[#EEF2F7] ${className}`}
    />
  );
}

// One product card: photo, title, one-line description, and - for a product with sub-products -
// the list of those sub-products, each linking to its own page.
export function ProductCard({ node }) {
  const { t } = useLanguage();
  const title = nodeTitle(node, t);
  return (
    <article className="group flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:border-[#002DC2]/40 hover:shadow-lg transition-all">
      <Link to={node.path} className="relative block" aria-label={title}>
        <div className="aspect-[4/3] overflow-hidden">
          <ProductImage node={node} className="w-full h-full group-hover:scale-105 transition-transform duration-500" />
        </div>
        <IconTile icon={node.icon} size="md" tone="solid" className="absolute left-5 -bottom-6 shadow-md" />
      </Link>
      <div className="flex-1 flex flex-col gap-2 p-5 pt-9">
        <h3 className="text-lg font-bold text-[#123B92] leading-snug">
          <Link to={node.path} className="hover:text-[#002DC2] transition-colors">{title}</Link>
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed">{t(node.shortKey)}</p>
        {node.children && (
          <ul className="mt-1 divide-y divide-slate-100 border-y border-slate-100">
            {node.children.map(child => (
              <li key={child.id}>
                <Link to={child.path} className="flex items-center gap-2 py-2 text-sm font-semibold text-slate-700 hover:text-[#002DC2] transition-colors">
                  <ChevronRight className="w-4 h-4 text-[#23AC39] shrink-0" />
                  <span>{nodeTitle(child, t)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
        <Link to={node.path} className="mt-auto pt-2 inline-flex items-center gap-1.5 text-sm font-bold text-[#002DC2]">
          {t('cat_viewProduct')} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </article>
  );
}

// Grid of product cards (2 or 3 cards use the full width; 4+ wrap in rows of 3-4)
export function ProductGrid({ nodes }) {
  const cols = nodes.length === 2 ? 'md:grid-cols-2' : nodes.length === 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-2 lg:grid-cols-3';
  return (
    <div className={`grid grid-cols-1 ${cols} gap-6`}>
      {nodes.map(node => <ProductCard key={node.id} node={node} />)}
    </div>
  );
}
