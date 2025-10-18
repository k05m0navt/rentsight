/**
 * Platform Management Modal
 *
 * Modal for managing user's custom platforms (create, edit, delete)
 */

'use client';

import { useState, useEffect } from 'react';
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
// import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, Settings } from 'lucide-react';
import type { CustomPlatform } from '@/types/regional';

interface PlatformManagementModalProps {
  userId: string;
  onPlatformChange?: () => void;
}

export function PlatformManagementModal({ onPlatformChange }: PlatformManagementModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customPlatforms, setCustomPlatforms] = useState<CustomPlatform[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingPlatform, setEditingPlatform] = useState<CustomPlatform | null>(null);
  const [newPlatformName, setNewPlatformName] = useState('');
  const [editPlatformName, setEditPlatformName] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Fetch custom platforms when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchCustomPlatforms();
    }
  }, [isOpen]);

  const fetchCustomPlatforms = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/platforms/custom');
      if (response.ok) {
        const data = await response.json();
        setCustomPlatforms(data.customPlatforms || []);
      }
    } catch (error) {
      console.error('Error fetching custom platforms:', error);
      setError('Failed to load custom platforms');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlatform = async () => {
    if (!newPlatformName.trim()) {
      setError('Platform name is required');
      return;
    }

    if (newPlatformName.trim().length < 2) {
      setError('Platform name must be at least 2 characters');
      return;
    }

    if (newPlatformName.trim().length > 100) {
      setError('Platform name must be less than 100 characters');
      return;
    }

    try {
      const response = await fetch('/api/platforms/custom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newPlatformName.trim() }),
      });

      if (response.ok) {
        setNewPlatformName('');
        setError(null);
        await fetchCustomPlatforms();
        onPlatformChange?.();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create platform');
      }
    } catch (error) {
      console.error('Error creating platform:', error);
      setError('Failed to create platform');
    }
  };

  const handleEditPlatform = async () => {
    if (!editingPlatform || !editPlatformName.trim()) {
      setError('Platform name is required');
      return;
    }

    if (editPlatformName.trim().length < 2) {
      setError('Platform name must be at least 2 characters');
      return;
    }

    if (editPlatformName.trim().length > 100) {
      setError('Platform name must be less than 100 characters');
      return;
    }

    try {
      const response = await fetch(`/api/platforms/custom/${editingPlatform.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: editPlatformName.trim() }),
      });

      if (response.ok) {
        setEditingPlatform(null);
        setEditPlatformName('');
        setError(null);
        await fetchCustomPlatforms();
        onPlatformChange?.();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update platform');
      }
    } catch (error) {
      console.error('Error updating platform:', error);
      setError('Failed to update platform');
    }
  };

  const handleDeletePlatform = async (platformId: string) => {
    try {
      const response = await fetch(`/api/platforms/custom/${platformId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchCustomPlatforms();
        onPlatformChange?.();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to delete platform');
      }
    } catch (error) {
      console.error('Error deleting platform:', error);
      setError('Failed to delete platform');
    }
  };

  const startEdit = (platform: CustomPlatform) => {
    setEditingPlatform(platform);
    setEditPlatformName(platform.name);
    setError(null);
  };

  const cancelEdit = () => {
    setEditingPlatform(null);
    setEditPlatformName('');
    setError(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm" className="w-full sm:w-auto">
          <Settings className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Manage Platforms</span>
          <span className="sm:hidden">Manage</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-2xl max-h-[80vh] overflow-y-auto mx-4 sm:mx-6">
        <DialogHeader>
          <DialogTitle>Manage Custom Platforms</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Create New Platform */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add New Platform
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter platform name"
                  value={newPlatformName}
                  onChange={(e) => setNewPlatformName(e.target.value)}
                  maxLength={100}
                />
                <Button onClick={handleCreatePlatform} disabled={!newPlatformName.trim()}>
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Custom Platforms List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Custom Platforms</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">Loading platforms...</p>
                </div>
              ) : customPlatforms.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">No custom platforms yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {customPlatforms.map((platform) => (
                    <div
                      key={platform.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      {editingPlatform?.id === platform.id ? (
                        <div className="flex items-center gap-2 flex-1">
                          <Input
                            value={editPlatformName}
                            onChange={(e) => setEditPlatformName(e.target.value)}
                            maxLength={100}
                            className="flex-1"
                          />
                          <Button size="sm" onClick={handleEditPlatform}>
                            Save
                          </Button>
                          <Button size="sm" variant="secondary" onClick={cancelEdit}>
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-3">
                            <span className="font-medium">{platform.name}</span>
                            <Badge variant="outline">
                              {platform.usage_count} usage{platform.usage_count !== 1 ? 's' : ''}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => startEdit(platform)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => {
                                if (platform.usage_count > 0) {
                                  setError(
                                    `Cannot delete "${platform.name}" - it is used in ${platform.usage_count} rent entr${platform.usage_count !== 1 ? 'ies' : 'y'}`,
                                  );
                                } else if (
                                  confirm(`Are you sure you want to delete "${platform.name}"?`)
                                ) {
                                  handleDeletePlatform(platform.id);
                                }
                              }}
                              disabled={platform.usage_count > 0}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </>
                      )}
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
