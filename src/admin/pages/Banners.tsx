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
import { bannersApi, Banner } from '../services/api';

const Banners = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [reordering, setReordering] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await bannersApi.getAllAdmin();
      setBanners(response.data);
    } catch (error) {
      console.error('Error fetching banners:', error);
      toast.error('Failed to fetch banners');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const banner = banners.find(b => b._id === id);
      if (!banner) return;

      const formData = new FormData();
      formData.append('isActive', (!currentStatus).toString());
      formData.append('title', banner.title);
      formData.append('buttonText', banner.buttonText);
      formData.append('buttonLink', banner.buttonLink);
      formData.append('order', banner.order.toString());

      await bannersApi.update(id, formData);

      setBanners(
        banners.map((b) =>
          b._id === id ? { ...b, isActive: !currentStatus } : b
        )
      );
      toast.success('Banner status updated');
    } catch (error) {
      console.error('Error updating banner status:', error);
      toast.error('Failed to update banner status');
    }
  };

  const handleDelete = (id: string) => {
    setBannerToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!bannerToDelete) return;

    try {
      setDeleting(true);
      await bannersApi.delete(bannerToDelete);
      setBanners(banners.filter((b) => b._id !== bannerToDelete));
      toast.success('Banner deleted successfully');
    } catch (error) {
      console.error('Error deleting banner:', error);
      toast.error('Failed to delete banner');
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setBannerToDelete(null);
    }
  };

  const moveUp = async (index: number) => {
    if (index === 0) return;

    const newBanners = [...banners];
    [newBanners[index - 1], newBanners[index]] = [newBanners[index], newBanners[index - 1]];

    const reorderData = newBanners.map((b, i) => ({
      id: b._id,
      order: i + 1,
    }));

    try {
      setReordering(true);
      await bannersApi.reorder(reorderData);
      newBanners.forEach((b, i) => (b.order = i + 1));
      setBanners(newBanners);
      toast.success('Banner order updated');
    } catch (error) {
      console.error('Error reordering banners:', error);
      toast.error('Failed to update banner order');
    } finally {
      setReordering(false);
    }
  };

  const moveDown = async (index: number) => {
    if (index === banners.length - 1) return;

    const newBanners = [...banners];
    [newBanners[index], newBanners[index + 1]] = [newBanners[index + 1], newBanners[index]];

    const reorderData = newBanners.map((b, i) => ({
      id: b._id,
      order: i + 1,
    }));

    try {
      setReordering(true);
      await bannersApi.reorder(reorderData);
      newBanners.forEach((b, i) => (b.order = i + 1));
      setBanners(newBanners);
      toast.success('Banner order updated');
    } catch (error) {
      console.error('Error reordering banners:', error);
      toast.error('Failed to update banner order');
    } finally {
      setReordering(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Banners</h1>
          <p className="text-muted-foreground">Manage hero slider banners</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchBanners} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Link to="/admin/banners/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Banner
            </Button>
          </Link>
        </div>
      </div>

      {/* Banners List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {banners
            .sort((a, b) => a.order - b.order)
            .map((banner, index) => (
              <div
                key={banner._id}
                className={`bg-card rounded-xl border border-border overflow-hidden ${
                  !banner.isActive ? 'opacity-60' : ''
                }`}
              >
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="md:w-64 h-40 md:h-auto shrink-0">
                    <img
                      src={banner.image?.url || 'https://via.placeholder.com/400x200'}
                      alt={banner.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4 md:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {banner.badge && (
                            <span className="inline-block px-2 py-0.5 bg-primary text-primary-foreground rounded text-xs font-medium">
                              {banner.badge}
                            </span>
                          )}
                          <span className="text-sm text-muted-foreground">
                            Order: {banner.order}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold mb-1">{banner.title}</h3>
                        {banner.subtitle && (
                          <p className="text-primary font-medium mb-2">
                            {banner.subtitle}
                          </p>
                        )}
                        {banner.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {banner.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-4">
                          <span className="text-sm text-muted-foreground">
                            Button: "{banner.buttonText}"
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {/* Reorder buttons */}
                        <div className="hidden sm:flex flex-col gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => moveUp(index)}
                            disabled={index === 0 || reordering}
                          >
                            <span className="text-xs">↑</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => moveDown(index)}
                            disabled={index === banners.length - 1 || reordering}
                          >
                            <span className="text-xs">↓</span>
                          </Button>
                        </div>

                        {/* Active Toggle */}
                        <div className="flex items-center gap-2">
                          {banner.isActive ? (
                            <Eye className="w-4 h-4 text-green-500" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-muted-foreground" />
                          )}
                          <Switch
                            checked={banner.isActive}
                            onCheckedChange={() => handleToggleActive(banner._id, banner.isActive)}
                          />
                        </div>

                        {/* More Actions */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/admin/banners/edit/${banner._id}`}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDelete(banner._id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

          {banners.length === 0 && (
            <div className="bg-card rounded-xl border border-border p-12 text-center">
              <p className="text-muted-foreground mb-4">No banners found</p>
              <Link to="/admin/banners/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Banner
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
            <AlertDialogTitle>Delete Banner</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this banner? This action cannot be
              undone.
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

export default Banners;
