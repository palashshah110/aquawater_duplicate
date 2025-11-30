import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  GripVertical,
  Eye,
  EyeOff,
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

// Mock data
const initialBanners = [
  {
    id: '1',
    title: 'Smart Water Tank Monitoring',
    subtitle: 'Never Worry About Water Overflow',
    description: 'IoT-enabled automatic overflow protection with real-time alerts',
    buttonText: 'Shop Now',
    badge: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=400',
    order: 1,
    isActive: true,
  },
  {
    id: '2',
    title: 'Advanced Water Level Sensors',
    subtitle: 'Precision Water Management',
    description: '99.9% accurate monitoring with instant notifications',
    buttonText: 'Explore Products',
    badge: 'New Arrival',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400',
    order: 2,
    isActive: true,
  },
  {
    id: '3',
    title: 'Complete Tank Protection',
    subtitle: 'Save Water, Save Money',
    description: 'Automatic cut-off system with 2-year warranty',
    buttonText: 'View Details',
    badge: 'Featured',
    image: 'https://images.unsplash.com/photo-1548198131-bb0d0e8e9f0a?w=400',
    order: 3,
    isActive: false,
  },
];

const Banners = () => {
  const [banners, setBanners] = useState(initialBanners);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<string | null>(null);

  const handleToggleActive = (id: string) => {
    setBanners(
      banners.map((banner) =>
        banner.id === id ? { ...banner, isActive: !banner.isActive } : banner
      )
    );
    toast.success('Banner status updated');
  };

  const handleDelete = (id: string) => {
    setBannerToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (bannerToDelete) {
      setBanners(banners.filter((b) => b.id !== bannerToDelete));
      toast.success('Banner deleted successfully');
    }
    setDeleteDialogOpen(false);
    setBannerToDelete(null);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newBanners = [...banners];
    [newBanners[index - 1], newBanners[index]] = [newBanners[index], newBanners[index - 1]];
    newBanners.forEach((b, i) => (b.order = i + 1));
    setBanners(newBanners);
    toast.success('Banner order updated');
  };

  const moveDown = (index: number) => {
    if (index === banners.length - 1) return;
    const newBanners = [...banners];
    [newBanners[index], newBanners[index + 1]] = [newBanners[index + 1], newBanners[index]];
    newBanners.forEach((b, i) => (b.order = i + 1));
    setBanners(newBanners);
    toast.success('Banner order updated');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Banners</h1>
          <p className="text-muted-foreground">Manage hero slider banners</p>
        </div>
        <Link to="/admin/banners/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Banner
          </Button>
        </Link>
      </div>

      {/* Banners List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {banners
          .sort((a, b) => a.order - b.order)
          .map((banner, index) => (
            <div
              key={banner.id}
              className={`bg-card rounded-xl border border-border overflow-hidden ${
                !banner.isActive ? 'opacity-60' : ''
              }`}
            >
              <div className="flex flex-col md:flex-row">
                {/* Image */}
                <div className="md:w-64 h-40 md:h-auto shrink-0">
                  <img
                    src={banner.image}
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
                      <p className="text-primary font-medium mb-2">
                        {banner.subtitle}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {banner.description}
                      </p>
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
                          disabled={index === 0}
                        >
                          <span className="text-xs">↑</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => moveDown(index)}
                          disabled={index === banners.length - 1}
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
                          onCheckedChange={() => handleToggleActive(banner.id)}
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
                            <Link to={`/admin/banners/edit/${banner.id}`}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(banner.id)}
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
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Banners;
