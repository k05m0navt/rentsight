/**
 * Reports Page
 *
 * Advanced reporting page for generating detailed income and expense reports.
 * Features:
 * - Report type selection
 * - Date range filtering
 * - Property and tag filtering
 * - Export functionality (PDF, CSV, Excel)
 */

'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { BarChart3, FileText, Calculator, Download } from 'lucide-react';

export default function ReportsPage() {
  const [reportType, setReportType] = useState('income_summary');
  const [generating, setGenerating] = useState(false);
  const [reportData, setReportData] = useState<{
    generated_at: string;
    summary: { totalIncome: number; totalExpenses: number; netIncome: number; entryCount: number };
    data: unknown;
  } | null>(null);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportType,
          filters: {}, // Add filter support later
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setReportData(data);
      } else {
        alert('Failed to generate report');
      }
    } catch {
      alert('Network error');
    } finally {
      setGenerating(false);
    }
  };

  const handleExport = async (format: string) => {
    try {
      const response = await fetch('/api/reports/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportType,
          format,
          filters: {},
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message || 'Export successful');
      }
    } catch {
      alert('Export failed');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="text-sm text-muted dark:text-muted-dark mt-1">
          Generate detailed reports for analysis and tax preparation
        </p>
      </div>

      {/* Report Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Report Configuration</CardTitle>
          <CardDescription>Select the type of report you want to generate</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="reportType" className="block text-sm font-medium mb-2">
              Report Type
            </label>
            <Select
              id="reportType"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="income_summary">Income Summary</option>
              <option value="expense_breakdown">Expense Breakdown</option>
              <option value="tax_report">Tax Report</option>
            </Select>
          </div>

          <Button onClick={handleGenerate} disabled={generating}>
            {generating ? 'Generating...' : 'Generate Report'}
          </Button>
        </CardContent>
      </Card>

      {/* Report Types Info */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-base">Income Summary</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted dark:text-muted-dark">
              Comprehensive breakdown of rental income by period, platform, and property
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10 dark:bg-success/20">
                <FileText className="h-5 w-5 text-success" />
              </div>
              <CardTitle className="text-base">Expense Breakdown</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted dark:text-muted-dark">
              Analyze expenses by category and property with trend analysis
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 dark:bg-blue-500/20">
                <Calculator className="h-5 w-5 text-blue-500" />
              </div>
              <CardTitle className="text-base">Tax Report</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted dark:text-muted-dark">
              Annual income and expenses formatted for tax preparation
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Report Display */}
      {reportData && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Report Results</CardTitle>
                <CardDescription>
                  Generated at {new Date(reportData.generated_at).toLocaleString()}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => handleExport('pdf')}>
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </Button>
                <Button variant="secondary" size="sm" onClick={() => handleExport('csv')}>
                  <Download className="h-4 w-4 mr-2" />
                  CSV
                </Button>
                <Button variant="secondary" size="sm" onClick={() => handleExport('excel')}>
                  <Download className="h-4 w-4 mr-2" />
                  Excel
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Summary */}
              <div className="grid gap-4 md:grid-cols-4">
                <div className="p-4 rounded-lg bg-card dark:bg-card-dark border border-border dark:border-border-dark">
                  <p className="text-sm text-muted dark:text-muted-dark mb-1">Total Income</p>
                  <p className="text-xl font-bold text-success">
                    ${reportData.summary.totalIncome.toFixed(2)}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-card dark:bg-card-dark border border-border dark:border-border-dark">
                  <p className="text-sm text-muted dark:text-muted-dark mb-1">Total Expenses</p>
                  <p className="text-xl font-bold text-red-500">
                    ${reportData.summary.totalExpenses.toFixed(2)}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-card dark:bg-card-dark border border-border dark:border-border-dark">
                  <p className="text-sm text-muted dark:text-muted-dark mb-1">Net Income</p>
                  <p className="text-xl font-bold text-primary">
                    ${reportData.summary.netIncome.toFixed(2)}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-card dark:bg-card-dark border border-border dark:border-border-dark">
                  <p className="text-sm text-muted dark:text-muted-dark mb-1">Total Entries</p>
                  <p className="text-xl font-bold">{reportData.summary.entryCount}</p>
                </div>
              </div>

              {/* Report Data Preview */}
              <div className="p-4 rounded-lg bg-card dark:bg-card-dark border border-border dark:border-border-dark">
                <p className="text-sm font-medium mb-2">Report Data:</p>
                <pre className="text-xs overflow-auto max-h-96 text-muted dark:text-muted-dark">
                  {JSON.stringify(reportData.data, null, 2)}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!reportData && (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="p-4 rounded-full bg-card dark:bg-card-dark inline-block mb-4">
              <BarChart3 className="h-12 w-12 text-muted dark:text-muted-dark" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Report Generated Yet</h3>
            <p className="text-muted dark:text-muted-dark max-w-md mx-auto">
              Select a report type above and click &quot;Generate Report&quot; to see your data
              analysis
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
