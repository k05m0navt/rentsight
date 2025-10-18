/**
 * Help Page
 *
 * Help and documentation page with search, FAQs, and support information.
 * Features:
 * - Search bar with live results
 * - FAQ accordion organized by category
 * - Links to popular articles
 * - Contact support section
 */

import { HelpSearch } from '@/components/help/HelpSearch';
import { FAQList } from '@/components/help/FAQList';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Mail, MessageCircle } from 'lucide-react';
import { readFile } from 'fs/promises';
import path from 'path';

export const metadata = {
  title: 'Help & Support - RentSight',
  description: 'Find answers to common questions and learn how to use RentSight',
};

interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export default async function HelpPage() {
  // Load FAQs from JSON file
  let faqs: FAQ[] = [];
  try {
    const faqsPath = path.join(process.cwd(), 'public', 'help', 'faqs.json');
    const faqsContent = await readFile(faqsPath, 'utf-8');
    faqs = JSON.parse(faqsContent);
  } catch (error) {
    console.error('Error loading FAQs:', error);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">Help & Support</h1>
        <p className="text-sm text-muted dark:text-muted-dark mt-1">
          Find answers to common questions and learn how to use RentSight
        </p>
      </div>

      {/* Search Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Search Help</h2>
        <HelpSearch />
      </section>

      {/* FAQ Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
        <FAQList faqs={faqs} />
      </section>

      {/* Quick Links to App Pages */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">📊 Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted dark:text-muted-dark mb-3">
                View your rental income overview and key metrics
              </p>
              <a
                href="/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                Go to Dashboard →
              </a>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">🏠 Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted dark:text-muted-dark mb-3">
                Manage your rental properties and view details
              </p>
              <a
                href="/properties"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                Go to Properties →
              </a>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">🏷️ Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted dark:text-muted-dark mb-3">
                Organize your entries with custom tags
              </p>
              <a
                href="/tags"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                Go to Tags →
              </a>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">📈 Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted dark:text-muted-dark mb-3">
                Generate detailed reports and export data
              </p>
              <a
                href="/reports"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                Go to Reports →
              </a>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Popular Articles */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Popular Articles</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="hover:shadow-md transition-shadow" data-testid="popular-article">
            <CardHeader>
              <CardTitle className="text-base">Getting Started</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted dark:text-muted-dark mb-3">
                Learn the basics of RentSight and how to set up your account
              </p>
              <div className="flex items-center gap-2 text-xs text-muted dark:text-muted-dark">
                <span>📖</span>
                <span>Step-by-step guide</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow" data-testid="popular-article">
            <CardHeader>
              <CardTitle className="text-base">Managing Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted dark:text-muted-dark mb-3">
                Create, edit, and organize your rental properties effectively
              </p>
              <div className="flex items-center gap-2 text-xs text-muted dark:text-muted-dark">
                <span>🏠</span>
                <span>Property management tips</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow" data-testid="popular-article">
            <CardHeader>
              <CardTitle className="text-base">Using Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted dark:text-muted-dark mb-3">
                Master tags for flexible categorization and filtering
              </p>
              <div className="flex items-center gap-2 text-xs text-muted dark:text-muted-dark">
                <span>🏷️</span>
                <span>Organization strategies</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow" data-testid="popular-article">
            <CardHeader>
              <CardTitle className="text-base">Creating Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted dark:text-muted-dark mb-3">
                Generate detailed reports and export your data
              </p>
              <div className="flex items-center gap-2 text-xs text-muted dark:text-muted-dark">
                <span>📊</span>
                <span>Data analysis guide</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Support */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Contact Support</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card data-testid="email-support">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-base">Email Support</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted dark:text-muted-dark mb-2">Get help via email</p>
              <a
                href="mailto:support@rentsight.app"
                className="text-sm text-primary hover:underline"
              >
                support@rentsight.app
              </a>
            </CardContent>
          </Card>

          <Card data-testid="community-support">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10 dark:bg-success/20">
                  <MessageCircle className="h-5 w-5 text-success" />
                </div>
                <CardTitle className="text-base">Community</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted dark:text-muted-dark mb-2">
                Join our community forum
              </p>
              <a
                href="https://community.rentsight.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-success hover:underline"
              >
                Visit Community →
              </a>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
