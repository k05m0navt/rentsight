'use client'

import { Tag, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface TagEmptyStateProps {
  onCreateTag?: () => void
}

export function TagEmptyState({ onCreateTag }: TagEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="rounded-full bg-card dark:bg-card-dark p-6 mb-4">
        <Tag className="w-12 h-12 text-muted dark:text-muted-dark" />
      </div>
      
      <h3 className="text-xl font-bold text-text dark:text-text-dark mb-2">
        No tags yet
      </h3>
      
      <p className="text-base text-muted dark:text-muted-dark mb-6 max-w-md">
        Create your first tag to organize and categorize your rent and expense entries.
        Tags help you filter and analyze your data more effectively.
      </p>

      {onCreateTag && (
        <Button
          variant="primary"
          onClick={onCreateTag}
          className="inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Your First Tag
        </Button>
      )}

      <div className="mt-8 text-sm text-muted dark:text-muted-dark max-w-md">
        <p className="font-medium mb-2">Tips for using tags:</p>
        <ul className="text-left space-y-1 list-disc list-inside">
          <li>Use descriptive names for easy identification</li>
          <li>Choose colors to visually distinguish tags</li>
          <li>Apply multiple tags to entries for better organization</li>
          <li>Filter your data by tags in the dashboard</li>
        </ul>
      </div>
    </div>
  )
}

