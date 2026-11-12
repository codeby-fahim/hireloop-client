import React from 'react';

const featuresData = [
  {
    id: 1,
    title: 'Smart Search',
    description: 'Find your ideal job with advanced filters.',
    icon: (
      <svg
        className="w-5 h-5 text-purple-300"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
    ),
  },
  {
    id: 2,
    title: 'Salary Insights',
    description: 'Get real salary data to negotiate confidently.',
    icon: (
      <svg
        className="w-5 h-5 text-purple-300"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 3v16a2 2 0 0 0 2 2h16" />
        <path d="m7 14 4-4 4 4 6-6" />
      </svg>
    ),
  },
  {
    id: 3,
    title: 'Top Companies',
    description: 'Apply to vetted companies that are hiring.',
    icon: (
      <svg
        className="w-5 h-5 text-purple-300"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
        <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
        <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
        <path d="M10 6h4" />
        <path d="M10 10h4" />
        <path d="M10 14h4" />
        <path d="M10 18h4" />
      </svg>
    ),
  },
  {
    id: 4,
    title: 'Saved Jobs',
    description: 'Manage apps & favorites on your dashboard.',
    icon: (
      <svg
        className="w-5 h-5 text-purple-300"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
      </svg>
    ),
  },
  {
    id: 5,
    title: 'One-Click Apply',
    description: 'Simplify your job applications for an easier process!',
    icon: (
      <svg
        className="w-5 h-5 text-purple-300"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 9 5 12l2.5.6L8 15l1-6Z" />
        <path d="m14 14 7 2-3.5 1.5L16 21l-2-7Z" />
        <path d="M12 3v3" />
        <path d="M5.6 5.6 7.8 7.8" />
        <path d="M18.4 5.6 16.2 7.8" />
      </svg>
    ),
  },
  {
    id: 6,
    title: 'Resume Builder',
    description: 'Create professional resumes with modern templates.',
    icon: (
      <svg
        className="w-5 h-5 text-purple-300"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="14" height="18" x="5" y="3" rx="2" />
        <circle cx="12" cy="9" r="2" />
        <path d="M9 14h6" />
        <path d="M9 17h4" />
      </svg>
    ),
  },
  {
    id: 7,
    title: 'Skill-Based Matching',
    description: 'Discover jobs that match your skills and experience.',
    icon: (
      <svg
        className="w-5 h-5 text-purple-300"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 4 4 8.5v7L12 20l8-4.5v-7L12 4Z" />
      </svg>
    ),
  },
  {
    id: 8,
    title: 'Career Growth Resources',
    description: 'Boost your career with quick interview tips.',
    icon: (
      <svg
        className="w-5 h-5 text-purple-300"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    ),
  },
];

const JobFeature = () => {
  return (
    <section className="bg-[#111015] text-white py-20 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2.5 text-[11px] font-semibold tracking-[0.2em] uppercase text-zinc-400 mb-3">
            <span className="w-1.5 h-1.5 rounded-xs bg-indigo-500 shadow-[0_0_8px_#6366f1]" />
            <span>Features Job</span>
            <span className="w-1.5 h-1.5 rounded-xs bg-indigo-500 shadow-[0_0_8px_#6366f1]" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-[42px] font-semibold tracking-tight text-white leading-[1.15]">
            Everything you need <br className="hidden sm:inline" /> to succeed
          </h2>
        </div>

        {/* Responsive 4-Column Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 sm:gap-y-12">
          {featuresData.map((feature) => (
            <div
              key={feature.id}
              className="group flex items-start gap-4 transition-transform duration-200"
            >
              {/* Icon Container */}
              <div className="w-11 h-11 shrink-0 rounded-xl bg-[#18171e] border border-white/6 group-hover:border-purple-500/30 group-hover:bg-[#1e1c26] flex items-center justify-center transition-colors duration-200">
                {feature.icon}
              </div>

              {/* Text Content */}
              <div className="pt-0.5">
                <h3 className="text-[15px] font-semibold text-white tracking-tight mb-1.5">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-[13px] text-zinc-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JobFeature;