/**
 * About Page
 *
 * Application information, version, tech stack, credits, and legal links.
 */

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FileText, Code, Heart, Scale, Shield } from 'lucide-react';
import Link from 'next/link';
import packageJson from '../../../package.json';

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">About RentSight</h1>
        <p className="text-sm text-muted dark:text-muted-dark mt-1">
          Version {packageJson.version}
        </p>
      </div>

      {/* App Description */}
      <Card>
        <CardHeader>
          <CardTitle>Modern Rental Analytics Platform</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p>
            RentSight is a comprehensive web application designed to help property owners and rental
            managers track their income, expenses, and performance across all rental properties.
          </p>
          <p className="text-sm text-muted dark:text-muted-dark">
            Built with modern web technologies and designed with user experience in mind, RentSight
            provides powerful analytics while remaining easy to use.
          </p>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle>Key Features</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2 md:grid-cols-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>Settings - Profile and preferences management</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>Properties - Organize rental properties</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>Analytics Dashboard - Visual data insights</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>Reports - Advanced reporting and export</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>Tags - Flexible categorization system</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>Dark/Light themes - Customizable appearance</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Tech Stack */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20">
              <Code className="h-5 w-5 text-primary" />
            </div>
            <CardTitle>Technology Stack</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 text-sm">
            <div>
              <p className="font-medium mb-1">Frontend</p>
              <ul className="text-muted dark:text-muted-dark space-y-1">
                <li>• Next.js 15.5.4</li>
                <li>• React 19.1.0</li>
                <li>• TypeScript 5.x</li>
                <li>• Tailwind CSS 4</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-1">Backend</p>
              <ul className="text-muted dark:text-muted-dark space-y-1">
                <li>• Supabase (Auth & Database)</li>
                <li>• Prisma ORM 6.17.0</li>
                <li>• PostgreSQL</li>
                <li>• Next.js API Routes</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Design Credits */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10 dark:bg-success/20">
              <Heart className="h-5 w-5 text-success" />
            </div>
            <CardTitle>Design Credits</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            Design inspired by{' '}
            <strong>&quot;AI Hiring - SaaS CRM Web App&quot;</strong> by Tamim Al Arafat on
            Dribbble
          </p>
          <p className="text-sm text-muted dark:text-muted-dark mt-2">
            Component library: shadcn/ui with Radix UI primitives
          </p>
        </CardContent>
      </Card>

      {/* Legal Links */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 dark:bg-blue-500/20">
              <Scale className="h-5 w-5 text-blue-500" />
            </div>
            <CardTitle>Legal</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <Link href="/legal/terms" className="text-primary hover:underline">
              Terms of Service →
            </Link>
          </div>
          <div>
            <Link href="/legal/privacy" className="text-primary hover:underline">
              Privacy Policy →
            </Link>
          </div>
          <p className="text-xs text-muted dark:text-muted-dark mt-4">
            ⚠️ Legal documents require review by qualified legal counsel before production deployment
          </p>
        </CardContent>
      </Card>

      {/* License and Contact */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10 dark:bg-purple-500/20">
                <FileText className="h-5 w-5 text-purple-500" />
              </div>
              <CardTitle>License</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Licensed under the <strong>MIT License</strong>
            </p>
            <p className="text-xs text-muted dark:text-muted-dark mt-2">
              Open source and free to use for personal and commercial projects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10 dark:bg-orange-500/20">
                <Shield className="h-5 w-5 text-orange-500" />
              </div>
              <CardTitle>Contact & Support</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm font-medium">Email</p>
              <a
                href="mailto:support@rentsight.app"
                className="text-sm text-primary hover:underline"
              >
                support@rentsight.app
              </a>
            </div>
            <div>
              <p className="text-sm font-medium">GitHub</p>
              <a
                href="https://github.com/yourusername/rentsight"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                github.com/yourusername/rentsight →
              </a>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer Note */}
      <div className="text-center text-sm text-muted dark:text-muted-dark py-4">
        <p>Built with ❤️ using Next.js, React, TypeScript, and Tailwind CSS</p>
        <p className="mt-1">© 2025 RentSight. All rights reserved.</p>
      </div>
    </div>
  );
}

