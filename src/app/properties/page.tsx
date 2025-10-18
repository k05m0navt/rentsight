/**
 * Properties Page
 *
 * Property management page for viewing, creating, editing, and deleting properties.
 * Features:
 * - Property list with search and pagination
 * - Create/edit modal
 * - Delete confirmation
 * - Empty states
 */

'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PropertyList } from '@/components/properties/PropertyList';
import { PropertyForm } from '@/components/properties/PropertyForm';
import { PropertyListSkeleton } from '@/components/properties/PropertyListSkeleton';
import { PropertyWithStats } from '@/types/property';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { X } from 'lucide-react';

export default function PropertiesPage() {
  const [showModal, setShowModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState<PropertyWithStats | null>(null);
  const [deletingProperty, setDeletingProperty] = useState<PropertyWithStats | null>(null);
  const router = useRouter();

  const handleAdd = () => {
    setEditingProperty(null);
    setShowModal(true);
  };

  const handleEdit = (property: PropertyWithStats) => {
    setEditingProperty(property);
    setShowModal(true);
  };

  const handleDelete = (property: PropertyWithStats) => {
    setDeletingProperty(property);
  };

  const confirmDelete = async () => {
    if (!deletingProperty) return;

    try {
      const response = await fetch(`/api/properties/${deletingProperty.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setDeletingProperty(null);
        // Refresh page to update list
        router.refresh();
        window.location.reload();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to delete property');
      }
    } catch {
      alert('Network error. Please try again.');
    }
  };

  const handleFormSuccess = () => {
    setShowModal(false);
    setEditingProperty(null);
    // Refresh page to update list
    router.refresh();
    window.location.reload();
  };

  return (
    <AuthGuard fallback={<PropertyListSkeleton />}>
      <div className="flex flex-col gap-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold">Properties</h1>
          <p className="text-sm text-muted dark:text-muted-dark mt-1">
            Manage your rental properties and track their performance
          </p>
        </div>

        {/* Property List */}
        <PropertyList onAdd={handleAdd} onEdit={handleEdit} onDelete={handleDelete} />

        {/* Add/Edit Modal */}
        {showModal && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowModal(false)}
          >
            <Card
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{editingProperty ? 'Edit Property' : 'Add New Property'}</CardTitle>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowModal(false)}
                    aria-label="Close"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <PropertyForm
                  initialData={editingProperty || undefined}
                  onSuccess={handleFormSuccess}
                  onCancel={() => setShowModal(false)}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deletingProperty && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setDeletingProperty(null)}
          >
            <Card className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
              <CardHeader>
                <CardTitle>Delete Property</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Are you sure you want to delete <strong>{deletingProperty.name}</strong>?
                </p>
                {((deletingProperty._count?.rentEntries || 0) > 0 ||
                  (deletingProperty._count?.expenseEntries || 0) > 0) && (
                  <p className="text-sm text-muted dark:text-muted-dark bg-card dark:bg-card-dark p-3 rounded">
                    This property has {deletingProperty._count?.rentEntries || 0} rent entries and{' '}
                    {deletingProperty._count?.expenseEntries || 0} expense entries. These entries
                    will not be deleted, but will no longer be associated with a property.
                  </p>
                )}
                <div className="flex gap-2 justify-end">
                  <Button variant="secondary" onClick={() => setDeletingProperty(null)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={confirmDelete}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Delete Property
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
