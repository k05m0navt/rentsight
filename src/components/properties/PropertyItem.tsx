/**
 * PropertyItem Component
 *
 * Displays a single property as a card with details and actions.
 */

'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Calendar, MapPin, Trash2, Edit, TrendingUp, TrendingDown } from 'lucide-react';
import { PropertyWithStats } from '@/types/property';

interface PropertyItemProps {
  property: PropertyWithStats;
  onEdit: (property: PropertyWithStats) => void;
  onDelete: (property: PropertyWithStats) => void;
}

export function PropertyItem({ property, onEdit, onDelete }: PropertyItemProps) {
  const formatDate = (date: Date | null | undefined) => {
    if (!date) return 'Not set';
    return new Date(date).toLocaleDateString();
  };

  const hasEntries =
    (property._count?.rentEntries || 0) > 0 || (property._count?.expenseEntries || 0) > 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{property.name}</CardTitle>
              {property.property_type && (
                <CardDescription className="capitalize">{property.property_type}</CardDescription>
              )}
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onEdit(property)}
              aria-label={`Edit ${property.name}`}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onDelete(property)}
              aria-label={`Delete ${property.name}`}
              className="text-red-600 hover:text-red-700 dark:text-red-400"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {property.address && (
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted dark:text-muted-dark mt-0.5 shrink-0" />
            <span className="text-muted dark:text-muted-dark">{property.address}</span>
          </div>
        )}

        {property.start_date && (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted dark:text-muted-dark" />
            <span className="text-muted dark:text-muted-dark">
              Since {formatDate(property.start_date)}
            </span>
          </div>
        )}

        {property.notes && (
          <p className="text-sm text-muted dark:text-muted-dark line-clamp-2">{property.notes}</p>
        )}

        {/* Entry Statistics */}
        <div className="flex gap-4 pt-3 border-t border-border dark:border-border-dark">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-success" />
            <span className="text-sm">
              <span className="font-medium">{property._count?.rentEntries || 0}</span>{' '}
              <span className="text-muted dark:text-muted-dark">rent entries</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-red-500" />
            <span className="text-sm">
              <span className="font-medium">{property._count?.expenseEntries || 0}</span>{' '}
              <span className="text-muted dark:text-muted-dark">expenses</span>
            </span>
          </div>
        </div>

        {hasEntries && (
          <p className="text-xs text-muted dark:text-muted-dark pt-2">
            Note: Deleting this property will not delete associated entries
          </p>
        )}
      </CardContent>
    </Card>
  );
}

