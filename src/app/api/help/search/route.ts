import { NextResponse } from 'next/server';
import { readdir, readFile } from 'fs/promises';
import path from 'path';

interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
  relevance?: number;
}

interface HelpArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  relevance?: number;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Search query is required', code: 'MISSING_QUERY' },
        { status: 400 },
      );
    }

    const searchTerm = query.toLowerCase().trim();

    // Load FAQs
    const faqsPath = path.join(process.cwd(), 'public', 'help', 'faqs.json');
    const faqsContent = await readFile(faqsPath, 'utf-8');
    const allFaqs: FAQ[] = JSON.parse(faqsContent);

    // Search FAQs
    const matchedFaqs = allFaqs
      .map((faq) => {
        const questionMatch = faq.question.toLowerCase().includes(searchTerm);
        const answerMatch = faq.answer.toLowerCase().includes(searchTerm);
        const categoryMatch = faq.category.toLowerCase().includes(searchTerm);

        let relevance = 0;
        if (questionMatch) relevance += 3;
        if (answerMatch) relevance += 1;
        if (categoryMatch) relevance += 2;

        return { ...faq, relevance };
      })
      .filter((faq) => faq.relevance > 0)
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, limit);

    // Load articles
    const articlesPath = path.join(process.cwd(), 'public', 'help', 'articles');
    let articleFiles: string[] = [];
    try {
      articleFiles = await readdir(articlesPath);
    } catch {
      // Articles directory might not exist yet
      articleFiles = [];
    }

    const articles: HelpArticle[] = [];
    for (const file of articleFiles) {
      if (!file.endsWith('.md')) continue;

      try {
        const filePath = path.join(articlesPath, file);
        const content = await readFile(filePath, 'utf-8');

        // Extract title from first h1
        const titleMatch = content.match(/^#\s+(.+)$/m);
        const title = titleMatch ? titleMatch[1] : file.replace('.md', '');

        const contentLower = content.toLowerCase();
        const titleLower = title.toLowerCase();

        let relevance = 0;
        if (titleLower.includes(searchTerm)) relevance += 5;
        if (contentLower.includes(searchTerm)) relevance += 1;

        if (relevance > 0) {
          articles.push({
            id: file.replace('.md', ''),
            title,
            content: content.slice(0, 500), // First 500 chars as preview
            category: 'Help Article',
            relevance,
          });
        }
      } catch {
        // Skip files that can't be read
        continue;
      }
    }

    const matchedArticles = articles
      .sort((a, b) => b.relevance! - a.relevance!)
      .slice(0, limit);

    return NextResponse.json({
      articles: matchedArticles,
      faqs: matchedFaqs,
    });
  } catch (error) {
    console.error('Error searching help content:', error);
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 },
    );
  }
}

