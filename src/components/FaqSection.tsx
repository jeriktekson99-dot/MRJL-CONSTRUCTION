import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'What services does MRJL Construction Corporation provide?',
    answer: 'We provide end-to-end construction development including architectural planning & design, structural & civil engineering, municipal permitting, and turnkey general contracting construction management.'
  },
  {
    question: 'How do you handle project budgets and cost guarantees?',
    answer: 'We provide transparent, fixed-budget proposals with single-point accountability. Our integrated design-build approach eliminates costly miscommunication between architects and contractors, ensuring strict adherence to budget.'
  },
  {
    question: 'Can MRJL assist with complex zoning and municipal permitting?',
    answer: 'Yes. Our in-house team specializes in navigating complex land development regulations, environmental reviews, zoning variances, and city permit approvals.'
  },
  {
    question: 'Do you work on both residential and commercial developments?',
    answer: 'We specialize in custom residential estates, complex structural developments, commercial spaces, and adaptive renovations.'
  },
  {
    question: 'What is the typical timeline for a custom build or development project?',
    answer: 'Timelines depend on scope and city approvals. Typically, pre-construction planning and engineering take 2 to 4 months, followed by construction execution spanning 6 to 18 months.'
  }
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-white text-zinc-900 border-t border-zinc-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2.5 mb-4">
            <span className="w-2 h-2 bg-[#FF5500] shrink-0" />
            <span className="font-display text-xs font-bold uppercase tracking-widest text-[#FF5500]">
              Frequently Asked Questions
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl md:text-[48px] leading-tight font-black tracking-tight text-zinc-900 whitespace-nowrap">
            Got Questions? We Have Answers.
          </h2>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="border border-zinc-200 bg-[#F8F9FA] transition-colors hover:border-[#FF5500]"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full flex items-center justify-between p-5 text-left font-display font-bold text-base text-zinc-900 cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="pr-4">{item.question}</span>
                  <div className={`w-8 h-8 rounded-none bg-zinc-900 text-white flex items-center justify-center shrink-0 transition-transform duration-200 ${isOpen ? 'bg-[#003399] rotate-180' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 font-body text-xs sm:text-sm text-zinc-600 leading-relaxed border-t border-zinc-200/60 pt-4">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
