import React from 'react';

const TONES = {
  blue: 'bg-[#F0F4FD] text-[#002DC2]',
  navy: 'bg-[#F0F4FD] text-[#123B92]',
  green: 'bg-[#EAF7EC] text-[#1A822B]',
  solid: 'bg-[#002DC2] text-white'
};

const SIZES = {
  md: 'w-12 h-12 rounded-xl',  // 24px icon - compact rows (contact details, checklists)
  lg: 'w-14 h-14 rounded-2xl'  // 32px icon - feature / persona cards
};

// Shared square tile that frames a lucide icon, so every feature card uses the same icon size and shape.
export default function IconTile({ icon: Icon, tone = 'blue', size = 'lg', className = '' }) {
  return (
    <span className={`inline-flex items-center justify-center shrink-0 ${SIZES[size]} ${TONES[tone]} ${className}`} aria-hidden="true">
      <Icon className={size === 'lg' ? 'w-8 h-8' : 'w-6 h-6'} />
    </span>
  );
}
