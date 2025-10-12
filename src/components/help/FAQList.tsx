/**
 * FAQList Component
 *
 * Displays FAQs organized by category using accordion UI.
 */

'use client';

import { Accordion } from '@/components/ui/accordion';
import { useMemo } from 'react';

interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
}

interface FAQListProps {
  faqs: FAQ[];
}

export function FAQList({ faqs }: FAQListProps) {
  // Group FAQs by category
  const categorizedFaqs = useMemo(() => {
    const categories: Record<string, FAQ[]> = {};
    faqs.forEach((faq) => {
      if (!categories[faq.category]) {
        categories[faq.category] = [];
      }
      categories[faq.category].push(faq);
    });
    return categories;
  }, [faqs]);

  const categories = Object.keys(categorizedFaqs);

  if (categories.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted dark:text-muted-dark">No FAQs available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <div key={category}>
          <h3 className="text-lg font-semibold mb-3">{category}</h3>
          <Accordion
            items={categorizedFaqs[category].map((faq) => ({
              id: faq.id,
              title: faq.question,
              content: <p className="text-sm">{faq.answer}</p>,
            }))}
            allowMultiple={true}
          />
        </div>
      ))}
    </div>
  );
}
