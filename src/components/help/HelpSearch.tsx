/**
 * HelpSearch Component
 *
 * Search bar for help content with debounced search and results display.
 */

'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
  relevance: number;
}

interface HelpArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  relevance: number;
}

interface SearchResults {
  articles: HelpArticle[];
  faqs: FAQ[];
}

export function HelpSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search query (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Perform search when debounced query changes
  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedQuery || debouncedQuery.trim().length === 0) {
        setResults(null);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`/api/help/search?q=${encodeURIComponent(debouncedQuery)}`);
        if (response.ok) {
          const data = await response.json();
          setResults(data);
        } else {
          setResults(null);
        }
      } catch (error) {
        console.error('Search error:', error);
        setResults(null);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [debouncedQuery]);

  // Helper function to highlight search terms
  const highlightText = (text: string, searchTerm: string) => {
    if (!searchTerm) return text;

    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (regex.test(part)) {
        return (
          <mark
            key={index}
            data-testid="highlighted-text"
            className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded"
          >
            {part}
          </mark>
        );
      }
      return part;
    });
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted dark:text-muted-dark" />
        <Input
          type="text"
          placeholder="Search help articles and FAQs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 text-lg h-12"
        />
      </div>

      {/* Loading State */}
      {loading && query && (
        <p className="text-center text-muted dark:text-muted-dark py-4">Searching...</p>
      )}

      {/* Results */}
      {!loading && results && query && (
        <div className="space-y-4" data-testid="search-results">
          {/* Articles */}
          {results.articles.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Help Articles</h3>
              <div className="space-y-2">
                {results.articles.map((article) => (
                  <Card key={article.id} data-testid="search-result">
                    <CardHeader>
                      <CardTitle className="text-base">
                        {highlightText(article.title, query)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted dark:text-muted-dark line-clamp-2">
                        {highlightText(article.content, query)}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* FAQs */}
          {results.faqs.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Frequently Asked Questions</h3>
              <div className="space-y-2">
                {results.faqs.map((faq) => (
                  <Card key={faq.id} data-testid="search-result">
                    <CardHeader>
                      <CardTitle className="text-base">
                        {highlightText(faq.question, query)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted dark:text-muted-dark">
                        {highlightText(faq.answer, query)}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {results.articles.length === 0 && results.faqs.length === 0 && (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted dark:text-muted-dark">
                  No results found for &quot;{query}&quot;
                </p>
                <p className="text-sm text-muted dark:text-muted-dark mt-2">
                  Try different keywords or browse the FAQs below
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
