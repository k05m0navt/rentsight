/**
 * Color Test Page
 * 
 * This page helps verify that the new orange accent color (#FF6B35) is properly applied.
 * Navigate to /test-colors to see all the color implementations.
 */

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { Home, Check, X } from 'lucide-react';

export default function TestColorsPage() {
  return (
    <div className="container mx-auto p-8 space-y-8 max-w-4xl">
      <div className="space-y-4">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted hover:text-text">
          <Home className="h-4 w-4" />
          Back to Home
        </Link>
        
        <h1 className="text-3xl font-bold">Color System Test Page</h1>
        <p className="text-muted">
          This page verifies that the orange accent color (#FF6B35) from the AI Hiring SaaS CRM design is properly applied.
        </p>
      </div>

      {/* Color Swatches */}
      <Card>
        <CardHeader>
          <CardTitle>Design Token Colors</CardTitle>
          <CardDescription>Primary colors from the design system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="h-24 bg-primary rounded-lg mb-2 flex items-center justify-center">
                <span className="text-white font-bold">Primary</span>
              </div>
              <p className="text-sm font-mono">#FF6B35 (Orange)</p>
              <p className="text-xs text-muted">Should be ORANGE, not red</p>
            </div>
            <div>
              <div className="h-24 bg-success rounded-lg mb-2 flex items-center justify-center">
                <span className="text-white font-bold">Success</span>
              </div>
              <p className="text-sm font-mono">#1DCC5C (Green)</p>
              <p className="text-xs text-muted">Success/positive actions</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Button Components</CardTitle>
          <CardDescription>All button variants using the new color palette</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primary Button (Orange)</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="link">Link Button (Orange)</Button>
            <Button variant="destructive">Destructive Button</Button>
          </div>
          
          <div className="p-4 bg-muted/10 rounded-md">
            <p className="text-sm font-semibold mb-2">✅ Expected:</p>
            <ul className="text-sm space-y-1 text-muted">
              <li>• Primary button should have ORANGE background (#FF6B35)</li>
              <li>• Link button text should be ORANGE</li>
              <li>• No RED colors should appear</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Form Elements */}
      <Card>
        <CardHeader>
          <CardTitle>Form Elements</CardTitle>
          <CardDescription>Input fields with focus states</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Test Input Field</label>
            <Input placeholder="Click here to see orange focus border" />
            <p className="text-xs text-muted mt-1">
              Click the input above - the focus border should be ORANGE
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Another Input</label>
            <Input placeholder="Type something here" />
          </div>
        </CardContent>
      </Card>

      {/* Links */}
      <Card>
        <CardHeader>
          <CardTitle>Link Colors</CardTitle>
          <CardDescription>Text links using primary color</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-base">
            This is a paragraph with a{' '}
            <a href="#" className="text-primary hover:underline font-medium">
              clickable link that should be ORANGE
            </a>
            {' '}and more text after it.
          </p>
          
          <p className="text-base">
            Another example:{' '}
            <Link href="/" className="text-primary hover:underline">
              Navigate Home (Orange)
            </Link>
          </p>
        </CardContent>
      </Card>

      {/* Icons with Colors */}
      <Card>
        <CardHeader>
          <CardTitle>Icons with Color Classes</CardTitle>
          <CardDescription>Icons using text-primary and text-success</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-8 items-center">
            <div className="text-center">
              <Check className="h-12 w-12 text-primary mx-auto mb-2" />
              <p className="text-sm">text-primary</p>
              <p className="text-xs text-muted">Should be orange</p>
            </div>
            <div className="text-center">
              <Check className="h-12 w-12 text-success mx-auto mb-2" />
              <p className="text-sm">text-success</p>
              <p className="text-xs text-muted">Should be green</p>
            </div>
            <div className="text-center">
              <X className="h-12 w-12 text-error mx-auto mb-2" />
              <p className="text-sm">text-error</p>
              <p className="text-xs text-muted">Should be red</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Background with Opacity */}
      <Card>
        <CardHeader>
          <CardTitle>Background Colors with Opacity</CardTitle>
          <CardDescription>Semi-transparent backgrounds</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-sm font-medium">bg-primary/10</p>
              <p className="text-xs text-muted mt-1">Light orange background</p>
            </div>
            <div className="p-4 bg-primary/30 rounded-lg border border-primary/40">
              <p className="text-sm font-medium">bg-primary/30</p>
              <p className="text-xs text-muted mt-1">Medium orange background</p>
            </div>
            <div className="p-4 bg-primary/50 rounded-lg border border-primary/60">
              <p className="text-sm font-medium text-white">bg-primary/50</p>
              <p className="text-xs text-white/80 mt-1">Darker orange background</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verification Checklist */}
      <Card className="border-2 border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Check className="h-5 w-5 text-primary" />
            Verification Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded border-2 border-border flex-shrink-0" />
              <div>
                <p className="font-medium">Primary Button is ORANGE (#FF6B35)</p>
                <p className="text-sm text-muted">Not red (#DD1202)</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded border-2 border-border flex-shrink-0" />
              <div>
                <p className="font-medium">Links are ORANGE</p>
                <p className="text-sm text-muted">Check "clickable link" text above</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded border-2 border-border flex-shrink-0" />
              <div>
                <p className="font-medium">Input focus border is ORANGE</p>
                <p className="text-sm text-muted">Click any input field above</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded border-2 border-border flex-shrink-0" />
              <div>
                <p className="font-medium">Icons with text-primary are ORANGE</p>
                <p className="text-sm text-muted">Check icons section above</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-success/10 border border-success/30 rounded-lg">
            <p className="text-sm font-semibold text-success mb-1">✅ Success!</p>
            <p className="text-sm">
              If all the above items show ORANGE (not red), then the color system is working correctly!
            </p>
          </div>
          
          <div className="mt-4 p-4 bg-error/10 border border-error/30 rounded-lg">
            <p className="text-sm font-semibold text-error mb-1">❌ Still seeing red?</p>
            <p className="text-sm mb-2">Try these steps:</p>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li>Stop the dev server (Ctrl+C)</li>
              <li>Run: <code className="bg-background-dark px-2 py-0.5 rounded">rm -rf .next</code></li>
              <li>Run: <code className="bg-background-dark px-2 py-0.5 rounded">npm run dev</code></li>
              <li>Hard refresh browser (Cmd+Shift+R or Ctrl+Shift+R)</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
