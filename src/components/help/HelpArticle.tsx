/**
 * HelpArticle Component
 *
 * Renders a help article with proper styling.
 * For MVP, renders plain text. Can be enhanced with markdown rendering later.
 */

'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface HelpArticleProps {
  title: string;
  content: string;
}

export function HelpArticle({ title, content }: HelpArticleProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose dark:prose-invert max-w-none">
          <pre className="whitespace-pre-wrap font-sans text-sm text-text dark:text-text-dark">
            {content}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}

