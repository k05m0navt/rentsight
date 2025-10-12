'use client'

import { Badge } from '@/components/ui/badge'
import { X, Edit2 } from 'lucide-react'

interface Tag {
  id: string
  name: string
  color?: string
}

interface TagItemProps {
  tag: Tag
  selected?: boolean
  onClick?: () => void
  onEdit?: () => void
  onDelete?: () => void
  variant?: 'default' | 'selectable' | 'compact'
}

export function TagItem({
  tag,
  selected = false,
  onClick,
  onEdit,
  onDelete,
  variant = 'default'
}: TagItemProps) {
  if (variant === 'compact') {
    return (
      <Badge
        variant={selected ? 'primary' : 'outline'}
        className="inline-flex items-center gap-1 cursor-pointer transition-[opacity,transform] duration-200 hover:scale-105"
        onClick={onClick}
      >
        {tag.color && (
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: tag.color }}
          />
        )}
        <span>{tag.name}</span>
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="ml-1 hover:opacity-70 transition-opacity duration-150"
            aria-label={`Remove ${tag.name}`}
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </Badge>
    )
  }

  if (variant === 'selectable') {
    return (
      <div
        className={`
          flex items-center gap-3 p-3 rounded-md border transition-[opacity,transform] duration-200 cursor-pointer
          ${selected 
            ? 'border-primary bg-primary/10 text-primary' 
            : 'border-border dark:border-border-dark bg-card dark:bg-card-dark text-text dark:text-text-dark hover:bg-hover dark:hover:bg-hover-dark'
          }
        `}
        onClick={onClick}
      >
        <div className="flex items-center gap-2 flex-1">
          {tag.color && (
            <div
              className="w-4 h-4 rounded-full border border-border dark:border-border-dark"
              style={{ backgroundColor: tag.color }}
            />
          )}
          <span className="font-medium">{tag.name}</span>
        </div>
        <div className="flex items-center gap-2">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onEdit()
              }}
              className="p-1 hover:opacity-70 transition-opacity duration-150"
              aria-label={`Edit ${tag.name}`}
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
              className="p-1 hover:text-error transition-colors duration-150"
              aria-label={`Delete ${tag.name}`}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    )
  }

  // Default variant
  return (
    <div
      className="flex items-center gap-3 p-4 rounded-lg border border-border dark:border-border-dark bg-card dark:bg-card-dark transition-[opacity,transform] duration-200 hover:shadow-md cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center gap-3 flex-1">
        {tag.color && (
          <div
            className="w-5 h-5 rounded-full border border-border dark:border-border-dark"
            style={{ backgroundColor: tag.color }}
          />
        )}
        <div className="flex flex-col">
          <span className="font-medium text-text dark:text-text-dark">
            {tag.name}
          </span>
          {selected && (
            <span className="text-xs text-primary mt-1">
              Currently selected
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {onEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEdit()
            }}
            className="p-2 text-muted dark:text-muted-dark hover:text-primary transition-colors duration-200 rounded-md hover:bg-hover dark:hover:bg-hover-dark"
            aria-label={`Edit ${tag.name}`}
          >
            <Edit2 className="w-4 h-4" />
          </button>
        )}
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="p-2 text-muted dark:text-muted-dark hover:text-error transition-colors duration-200 rounded-md hover:bg-hover dark:hover:bg-hover-dark"
            aria-label={`Delete ${tag.name}`}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

