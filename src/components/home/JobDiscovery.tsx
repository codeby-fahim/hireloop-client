import React from 'react';

const jobsData = [
  {
    id: 1,
    title: 'Frontend Developer',
    description:
      'Build accessible, high-performance web applications using React, Next.js, and modern CSS architectures.',
    location: 'New York, USA',
    type: 'Hybrid',
    rate: '€25-€40/hour',
  },
  {
    id: 2,
    title: 'Full Stack Engineer',
    description:
      'Design scalable REST APIs and seamless user interfaces with TypeScript, Node.js, and cloud databases.',
    location: 'London, UK',
    type: 'Remote',
    rate: '€35–€55/hour',
  },
  {
    id: 3,
    title: 'UI/UX Product Designer',
    description:
      'Craft intuitive design systems and interactive prototypes focused on user-centered digital experiences.',
    location: 'Berlin, Germany',
    type: 'Remote',
    rate: '€30–€45/hour',
  },
  {
    id: 4,
    title: 'Backend Node.js Developer',
    description:
      'Architect microservices, optimize database queries, and maintain secure server-side infrastructure.',
    location: 'Toronto, Canada',
    type: 'Hybrid',
    rate: '€32–€50/hour',
  },
  {
    id: 5,
    title: 'React Native Developer',
    description:
      'Deliver smooth cross-platform iOS and Android mobile experiences with clean, maintainable code.',
    location: 'Amsterdam, NL',
    type: 'Remote',
    rate: '€28–€44/hour',
  },
  {
    id: 6,
    title: 'AI Integration Specialist',
    description:
      'Embed LLM workflows, intelligent search, and automated agents into production web platforms.',
    location: 'San Francisco, USA',
    type: 'Remote',
    rate: '€45–€70/hour',
  },
];

const JobDiscovery = () => {
  return (
    <section className="min-h-screen bg-[#070708] text-white py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center font-sans">
      <div className="max-w-6xl w-full mx-auto">
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2.5 text-[11px] font-semibold tracking-[0.2em] uppercase text-zinc-400 mb-3">
            <span className="w-1.5 h-1.5 rounded-xs bg-indigo-500 shadow-[0_0_8px_#6366f1]" />
            <span>Smart Job Discovery</span>
            <span className="w-1.5 h-1.5 rounded-xs bg-indigo-500 shadow-[0_0_8px_#6366f1]" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white leading-[1.15]">
            The roles you&apos;d never find by searching
          </h2>
        </div>

        {/* Responsive Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {jobsData.map((job) => (
            <div
              key={job.id}
              className="group bg-[#121214] border border-white/6 hover:border-white/15 rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1"
            >
              <div>
                {/* Job Title */}
                <h3 className="text-xl font-semibold text-white tracking-tight mb-2.5">
                  {job.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                  {job.description}
                </p>

                {/* Metadata Badges */}
                <div className="flex flex-wrap gap-2 mb-7">
                  {/* Location Pill */}
                  <span className="inline-flex items-center gap-1.5 bg-[#1c1c20] border border-white/4 text-zinc-300 text-xs font-medium px-3 py-1.5 rounded-full">
                    <svg
                      className="w-3.5 h-3.5 text-purple-400 shrink-0"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {job.location}
                  </span>

                  {/* Work Mode Pill */}
                  <span className="inline-flex items-center gap-1.5 bg-[#1c1c20] border border-white/4 text-zinc-300 text-xs font-medium px-3 py-1.5 rounded-full">
                    <svg
                      className="w-3.5 h-3.5 text-purple-400 shrink-0"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.5 5.25a3 3 0 013-3h3a3 3 0 013 3v.205c.933.085 1.857.197 2.774.334 1.454.218 2.476 1.483 2.476 2.917v3.033c0 1.211-.734 2.352-1.936 2.752A24.726 24.726 0 0112 15.75c-2.73 0-5.357-.442-7.814-1.259-1.202-.4-1.936-1.541-1.936-2.752V8.706c0-1.434 1.022-2.7 2.476-2.917A48.814 48.814 0 017.5 5.455V5.25zm7.5 0v.09a49.488 49.488 0 00-6 0v-.09a1.5 1.5 0 011.5-1.5h3a1.5 1.5 0 011.5 1.5zm-3 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                        clipRule="evenodd"
                      />
                      <path d="M3 18.4v-2.796a4.3 4.3 0 00.713.31A26.226 26.226 0 0012 17.25c2.892 0 5.68-.468 8.287-1.335.252-.084.49-.189.713-.311V18.4c0 1.452-1.047 2.728-2.523 2.923-2.12.282-4.282.427-6.477.427a49.19 49.19 0 01-6.477-.427C4.047 21.128 3 19.852 3 18.4z" />
                    </svg>
                    {job.type}
                  </span>

                  {/* Rate Pill */}
                  <span className="inline-flex items-center gap-1.5 bg-[#1c1c20] border border-white/4 text-zinc-300 text-xs font-medium px-3 py-1.5 rounded-full">
                    <svg
                      className="w-3.5 h-3.5 text-purple-400 shrink-0"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.902 7.098a3.75 3.75 0 013.903-.884.75.75 0 10.498-1.415A5.25 5.25 0 008.005 9.75H7.5a.75.75 0 000 1.5h.054a5.281 5.281 0 000 1.5H7.5a.75.75 0 000 1.5h.505a5.25 5.25 0 006.494 2.701.75.75 0 10-.498-1.415 3.75 3.75 0 01-4.252-1.286h3.001a.75.75 0 000-1.5H9.075a3.77 3.77 0 010-1.5h3.675a.75.75 0 000-1.5h-3c.105-.14.221-.274.348-.402z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {job.rate}
                  </span>
                </div>
              </div>

              {/* Action Link */}
              <div>
                <a
                  href={`#apply-${job.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-300 hover:text-white transition-colors"
                >
                  <span>Apply Now</span>
                  <span className="transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Button */}
        <div className="mt-12 text-center">
          <button
            type="button"
            className="bg-white text-zinc-950 hover:bg-zinc-200 active:scale-[0.98] text-xs sm:text-sm font-medium px-6 py-3 rounded-lg transition-all duration-200 cursor-pointer shadow-sm"
          >
            View all job open
          </button>
        </div>
      </div>
    </section>
  );
};

export default JobDiscovery;