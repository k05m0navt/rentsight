'use client'

import { Card } from '@/components/ui/card'

interface Tag {
  id: string
  name: string
  color?: string
}

interface TagListProps {
  tags: Tag[]
  onTagClick?: (tag: Tag) => void
  onTagEdit?: (tag: Tag) => void
  onTagDelete?: (tagId: string) => void
  selectedTagIds?: string[]
  layout?: 'grid' | 'list'
}

export function TagList({
  tags,
  onTagClick,
  onTagEdit,
  onTagDelete,
  selectedTagIds = [],
  layout = 'grid'
}: TagListProps) {
  if (layout === 'list') {
    return (
      <div className="space-y-2">
        {tags.map((tag) => (
          <Card
            key={tag.id}
            className="p-4 cursor-pointer transition-[opacity,transform] duration-200 hover:scale-[1.01] hover:shadow-lg"
            onClick={() => onTagClick?.(tag)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {tag.color && (
                  <div
                    className="w-4 h-4 rounded-full border border-border dark:border-border-dark"
                    style={{ backgroundColor: tag.color }}
                  />
                )}
                <span className="font-medium text-text dark:text-text-dark">
                  {tag.name}
                </span>
                {selectedTagIds.includes(tag.id) && (
                  <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
                    Selected
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {onTagEdit && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onTagEdit(tag)
                    }}
                    className="text-muted dark:text-muted-dark hover:text-primary transition-colors duration-200"
                    aria-label={`Edit ${tag.name}`}
                  >
                    Edit
                  </button>
                )}
                {onTagDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onTagDelete(tag.id)
                    }}
                    className="text-muted dark:text-muted-dark hover:text-error transition-colors duration-200"
                    aria-label={`Delete ${tag.name}`}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  // Grid layout (default)
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {tags.map((tag) => (
        <Card
          key={tag.id}
          className="p-4 cursor-pointer transition-[opacity,transform] duration-200 hover:scale-[1.02] hover:shadow-lg"
          onClick={() => onTagClick?.(tag)}
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              {tag.color && (
                <div
                  className="w-4 h-4 rounded-full border border-border dark:border-border-dark"
                  style={{ backgroundColor: tag.color }}
                />
              )}
              <span className="font-medium text-text dark:text-text-dark truncate">
                {tag.name}
              </span>
            </div>
            {selectedTagIds.includes(tag.id) && (
              <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full text-center">
                Selected
              </span>
            )}
            <div className="flex items-center gap-2 mt-2">
              {onTagEdit && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onTagEdit(tag)
                  }}
                  className="text-sm text-muted dark:text-muted-dark hover:text-primary transition-colors duration-200"
                  aria-label={`Edit ${tag.name}`}
                >
                  Edit
                </button>
              )}
              {onTagDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onTagDelete(tag.id)
                  }}
                  className="text-sm text-muted dark:text-muted-dark hover:text-error transition-colors duration-200"
                  aria-label={`Delete ${tag.name}`}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

