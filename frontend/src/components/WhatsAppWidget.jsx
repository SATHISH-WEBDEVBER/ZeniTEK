import React, { useState } from 'react';

export default function WhatsAppWidget() {
  const [isHovered, setIsHovered] = useState(false);

  // ZeniTEK Official WhatsApp Sales & Support number
  const phoneNumber = '918098613422';
  const defaultMessage = encodeURIComponent(
    'Hi ZeniTEK Team! I am interested in your Solar Dryers and Renewable Energy solutions. Please share more details.'
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;

  return (
    <aside 
      aria-label="Direct WhatsApp Contact"
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex items-center group"
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative flex items-center justify-center bg-[#25D366] hover:bg-[#20bd5a] text-white w-13 h-13 sm:w-14 sm:h-14 rounded-full shadow-lg shadow-black/15 hover:shadow-xl hover:shadow-[#25D366]/40 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 border-2 border-white cursor-pointer"
        title="Chat with ZeniTEK on WhatsApp (+91 80986 13422)"
        aria-label="Chat directly with ZeniTEK on WhatsApp"
      >
        {/* Calm Online Presence Indicator Badge */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-300 rounded-full border-2 border-white shadow-xs" />

        {/* WhatsApp Official Vector Icon */}
        <svg
          viewBox="0 0 24 24"
          className="w-7 h-7 sm:w-7.5 sm:h-7.5 fill-current text-white relative z-10 shrink-0"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.04 14.69 2 12.04 2ZM12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67ZM8.53 7.33C8.37 7.33 8.1 7.39 7.87 7.64C7.65 7.89 7.02 8.48 7.02 9.68C7.02 10.88 7.9 12.04 8.02 12.2C8.14 12.37 9.73 14.83 12.18 15.89C14.22 16.77 14.63 16.6 15.08 16.56C15.53 16.52 16.52 15.97 16.73 15.38C16.94 14.79 16.94 14.29 16.88 14.18C16.82 14.07 16.65 14.01 16.39 13.88C16.14 13.76 14.91 13.15 14.68 13.07C14.45 12.99 14.29 12.95 14.12 13.2C13.96 13.45 13.49 14.01 13.34 14.18C13.2 14.34 13.05 14.36 12.8 14.24C12.55 14.11 11.74 13.85 10.78 12.99C10.03 12.32 9.53 11.5 9.4 11.25C9.28 11.01 9.38 10.87 9.51 10.75C9.62 10.64 9.76 10.46 9.89 10.31C10.01 10.17 10.06 10.06 10.14 9.9C10.22 9.73 10.18 9.59 10.12 9.47C10.06 9.34 9.57 8.14 9.36 7.66C9.17 7.18 8.97 7.25 8.81 7.24C8.67 7.24 8.51 7.33 8.53 7.33Z" />
        </svg>

        {/* Calm Hover Tooltip */}
        <span
          className={`hidden md:flex items-center absolute right-full mr-3 px-3 py-1.5 bg-slate-900/90 text-white text-xs font-semibold rounded-lg whitespace-nowrap shadow-md pointer-events-none transition-all duration-200 ${
            isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-1'
          }`}
        >
          Chat with us on WhatsApp
          <span className="w-2 h-2 bg-slate-900/90 rotate-45 absolute -right-1 top-1/2 -translate-y-1/2" />
        </span>
      </a>
    </aside>
  );
}
