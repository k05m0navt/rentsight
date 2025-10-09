import { useState } from 'react';
import { Button } from './button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu';

interface ExportButtonProps {
  selectedTagIds?: string[];
}

export function ExportButton({ selectedTagIds }: ExportButtonProps) {
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async (format: 'pdf' | 'csv' | 'excel') => {
    setExporting(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('format', format);
      selectedTagIds?.forEach(tagId => queryParams.append('tag_ids', tagId));

      const response = await fetch(`/api/analytics/export?${queryParams.toString()}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error: ${response.status}`);
      }

      const blob = await response.blob();
      const contentDisposition = response.headers.get('Content-Disposition');
      const filenameMatch = contentDisposition && contentDisposition.match(/filename="(.+)"/);
      const filename = filenameMatch ? filenameMatch[1] : `analytics.${format}`;

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button disabled={exporting}>
            {exporting ? 'Exporting...' : 'Export Data'}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuItem onClick={() => handleExport('csv')}>Export as CSV</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport('pdf')}>Export as PDF (Coming Soon)</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport('excel')}>Export as Excel (Coming Soon)</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {error && <p className="text-red-500 text-sm mt-2">Error: {error}</p>}
    </div>
  );
}

