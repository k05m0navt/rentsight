/**
 * Category Management Modal
 *
 * Modal for managing custom expense categories.
 * Allows users to create, edit, and delete custom categories.
 * Similar to PlatformManagementModal but for expense categories.
 */

'use client';

import { useState, useEffect } from 'react';
import { Settings, Plus, Edit2, Trash2, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CustomCategory {
  id: string;
  user_id: string;
  name: string;
  usage_count: number;
  created_at: Date;
  updated_at: Date;
}

interface CategoryManagementModalProps {
  onCategoryChange?: () => void;
}

export function CategoryManagementModal({ onCategoryChange }: CategoryManagementModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CustomCategory | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch custom categories
  const fetchCustomCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/categories/custom');
      if (response.ok) {
        const data = await response.json();
        setCustomCategories(data);
      }
    } catch (error) {
      console.error('Error fetching custom categories:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create new category
  const createCategory = async () => {
    if (!newCategoryName.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/categories/custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });

      if (response.ok) {
        setNewCategoryName('');
        await fetchCustomCategories();
        onCategoryChange?.();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to create category');
      }
    } catch (error) {
      console.error('Error creating category:', error);
      alert('Failed to create category');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update category
  const updateCategory = async () => {
    if (!editingCategory || !newCategoryName.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/categories/custom/${editingCategory.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });

      if (response.ok) {
        setEditingCategory(null);
        setNewCategoryName('');
        await fetchCustomCategories();
        onCategoryChange?.();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to update category');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Failed to update category');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete category
  const deleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const response = await fetch(`/api/categories/custom/${categoryId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchCustomCategories();
        onCategoryChange?.();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category');
    }
  };

  // Start editing
  const startEditing = (category: CustomCategory) => {
    setEditingCategory(category);
    setNewCategoryName(category.name);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingCategory(null);
    setNewCategoryName('');
  };

  // Load categories when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchCustomCategories();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm" className="w-full sm:w-auto">
          <Settings className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Manage Categories</span>
          <span className="sm:hidden">Manage</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-2xl max-h-[80vh] overflow-y-auto mx-4 sm:mx-6">
        <DialogHeader>
          <DialogTitle>Manage Custom Categories</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Add New Category */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Enter category name"
                  maxLength={100}
                />
                <Button
                  onClick={editingCategory ? updateCategory : createCategory}
                  disabled={!newCategoryName.trim() || isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : editingCategory ? 'Update' : 'Add'}
                </Button>
                {editingCategory && (
                  <Button variant="secondary" onClick={cancelEditing}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Custom Categories List */}
          <Card>
            <CardHeader>
              <CardTitle>Your Custom Categories</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">Loading categories...</div>
              ) : customCategories.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No custom categories yet. Create your first one above!
                </div>
              ) : (
                <div className="space-y-3">
                  {customCategories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{category.name}</span>
                        <Badge variant="outline">
                          {category.usage_count} {category.usage_count === 1 ? 'entry' : 'entries'}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => startEditing(category)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => deleteCategory(category.id)}
                          disabled={category.usage_count > 0}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
