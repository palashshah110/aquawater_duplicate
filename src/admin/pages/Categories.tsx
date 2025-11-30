import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  Eye,
  EyeOff,
  Loader2,
  RefreshCw,
  Package,
  FolderOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { categoriesApi, Category } from '../services/api';

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [updatingCounts, setUpdatingCounts] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoriesApi.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const category = categories.find(c => c._id === id);
      if (!category) return;  
      await categoriesApi.update(id, { ...category, isActive: !currentStatus });

      setCategories(
        categories.map((c) =>
          c._id === id ? { ...c, isActive: !currentStatus } : c
        )
      );
      toast.success('Category status updated');
    } catch (error) {
      console.error('Error updating category status:', error);
      toast.error('Failed to update category status');
    }
  };

  const handleDelete = (id: string) => {
    setCategoryToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      setDeleting(true);
      await categoriesApi.delete(categoryToDelete);
      setCategories(categories.filter((c) => c._id !== categoryToDelete));
      toast.success('Category deleted successfully');
    } catch (error: any) {
      console.error('Error deleting category:', error);
      toast.error(error.message || 'Failed to delete category');
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  const moveUp = async (index: number) => {
    if (index === 0) return;

    const newCategories = [...categories];
    [newCategories[index - 1], newCategories[index]] = [newCategories[index], newCategories[index - 1]];

    const reorderData = newCategories.map((c, i) => ({
      id: c._id,
      order: i + 1,
    }));

    try {
      setReordering(true);
      await categoriesApi.reorder(reorderData);
      newCategories.forEach((c, i) => (c.order = i + 1));
      setCategories(newCategories);
      toast.success('Category order updated');
    } catch (error) {
      console.error('Error reordering categories:', error);
      toast.error('Failed to update category order');
    } finally {
      setReordering(false);
    }
  };

  const moveDown = async (index: number) => {
    if (index === categories.length - 1) return;

    const newCategories = [...categories];
    [newCategories[index], newCategories[index + 1]] = [newCategories[index + 1], newCategories[index]];

    const reorderData = newCategories.map((c, i) => ({
      id: c._id,
      order: i + 1,
    }));

    try {
      setReordering(true);
      await categoriesApi.reorder(reorderData);
      newCategories.forEach((c, i) => (c.order = i + 1));
      setCategories(newCategories);
      toast.success('Category order updated');
    } catch (error) {
      console.error('Error reordering categories:', error);
      toast.error('Failed to update category order');
    } finally {
      setReordering(false);
    }
  };

  const handleUpdateCounts = async () => {
    try {
      setUpdatingCounts(true);
      await categoriesApi.updateCounts();
      await fetchCategories();
      toast.success('Product counts updated');
    } catch (error) {
      console.error('Error updating counts:', error);
      toast.error('Failed to update product counts');
    } finally {
      setUpdatingCounts(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-muted-foreground">Manage product categories</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleUpdateCounts}
            disabled={updatingCounts}
          >
            <Package className={`w-4 h-4 mr-2 ${updatingCounts ? 'animate-pulse' : ''}`} />
            Update Counts
          </Button>
          <Button variant="outline" onClick={fetchCategories} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Link to="/admin/categories/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </Link>
        </div>
      </div>

      {/* Categories List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl border border-border overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground w-16">
                    Order
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">
                    Category
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">
                    Description
                  </th>
                  <th className="text-center py-4 px-4 text-sm font-medium text-muted-foreground w-24">
                    Products
                  </th>
                  <th className="text-center py-4 px-4 text-sm font-medium text-muted-foreground w-24">
                    Status
                  </th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground w-32">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories
                  .sort((a, b) => a.order - b.order)
                  .map((category, index) => (
                    <tr
                      key={category._id}
                      className={`border-t border-border hover:bg-muted/30 transition-colors ${
                        !category.isActive ? 'opacity-60' : ''
                      }`}
                    >
                      <td className="py-4 px-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-center text-sm text-muted-foreground">
                            {category.order}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="font-medium">{category.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 hidden md:table-cell">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {category.description || '-'}
                        </p>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-primary/10 text-primary rounded-full text-sm font-medium">
                          {category.productsCount}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2">
                          {category.isActive ? (
                            <Eye className="w-4 h-4 text-green-500" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-muted-foreground" />
                          )}
                          <Switch
                            checked={category.isActive}
                            onCheckedChange={() =>
                              handleToggleActive(category._id, category.isActive)
                            }
                          />
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link to={`/admin/categories/edit/${category._id}`}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDelete(category._id)}
                                disabled={category.productsCount > 0}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {categories.length === 0 && (
            <div className="text-center py-12">
              <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No categories found</p>
              <Link to="/admin/categories/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Category
                </Button>
              </Link>
            </div>
          )}
        </motion.div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this category? This action cannot be
              undone. Categories with products cannot be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Categories;
