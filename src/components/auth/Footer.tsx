"use client";

import React from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const footerLinks = [
  {
    title: 'Product',
    links: [
      { label: 'Job discovery', href: '#job-discovery' },
      { label: 'Worker AI', href: '#worker-ai' },
      { label: 'Companies', href: '#companies' },
      { label: 'Salary data', href: '#salary-data' },
    ],
  },
  {
    title: 'Navigation',
    links: [
      { label: 'Help center', href: '#help-center' },
      { label: 'Career library', href: '#career-library' },
      { label: 'Contact', href: '#contact' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Brand Guideline', href: '#brand-guideline' },
      { label: 'Newsroom', href: '#newsroom' },
    ],
  },
];

const Footer = () => {
  const pathname = usePathname();

  // Do not render marketing footer on dashboard routes
  if (pathname.startsWith("/dashboard")) {
    return null;
  }

  return (
    <footer className="bg-[#050506] text-white border-t border-white/6 pt-16 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Top Section: Brand + Navigation Columns */}
        <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-16 pb-16">
          {/* Left Brand Column */}
          <div className="max-w-xs">
            <a
              href="#"
              className="inline-flex items-center mb-4 select-none"
            >
              <Image
                src="/images/logo.png"
                alt="Hireloop Logo"
                width={120}
                height={32}
                className="h-8 w-auto object-contain"
                priority
              />
            </a>

            <p className="text-xs sm:text-[13px] text-zinc-500 leading-relaxed">
              The AI-native career platform. Built for people who take their work seriously.
            </p>
          </div>

          {/* Right Link Columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-14 lg:gap-20">
            {footerLinks.map((column) => (
              <div key={column.title}>
                <h3 className="text-xs sm:text-[13px] font-medium text-[#5c6bc0] mb-4">
                  {column.title}
                </h3>
                <ul className="space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-xs sm:text-[13px] text-zinc-500 hover:text-zinc-200 transition-colors duration-200"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section: Social Icons & Copyright */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-6">
          {/* Social Buttons */}
          <div className="flex items-center gap-2.5">
            {/* Facebook */}
            <a
              href="#facebook"
              aria-label="Facebook"
              className="w-8 h-8 rounded-md bg-[#121215] hover:bg-[#1c1c21] border border-white/6 text-zinc-400 hover:text-white flex items-center justify-center transition-colors duration-200"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z" />
              </svg>
            </a>

            {/* Instagram (Highlighted Purple/Indigo Box) */}
            <a
              href="#instagram"
              aria-label="Instagram"
              className="w-8 h-8 rounded-md bg-[#4c46a8] hover:bg-[#5a53c4] text-white flex items-center justify-center transition-colors duration-200 shadow-sm"
            >
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="#linkedin"
              aria-label="LinkedIn"
              className="w-8 h-8 rounded-md bg-[#121215] hover:bg-[#1c1c21] border border-white/6 text-zinc-400 hover:text-white flex items-center justify-center transition-colors duration-200"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002zM7 8.48H3V21h4V8.48zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91l.04-1.68z" />
              </svg>
            </a>
          </div>

          {/* Copyright & Legal Links */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] sm:text-xs text-zinc-500">
            <span>Copyright 2026 — Programming Hero</span>
            <div className="flex items-center gap-2">
              <a
                href="#terms"
                className="hover:text-zinc-300 transition-colors duration-200"
              >
                Terms &amp; Policy
              </a>
              <span>•</span>
              <a
                href="#privacy"
                className="hover:text-zinc-300 transition-colors duration-200"
              >
                Privacy Guideline
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;