import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

interface BannerFormData {
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  badge: string;
  order: string;
  isActive: boolean;
}

const BannerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [formData, setFormData] = useState<BannerFormData>({
    title: '',
    subtitle: '',
    description: '',
    buttonText: 'Shop Now',
    buttonLink: '/products',
    badge: '',
    order: '1',
    isActive: true,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title) {
      toast.error('Please enter a banner title');
      return;
    }

    if (!image && !isEditing) {
      toast.error('Please upload a banner image');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success(
      isEditing ? 'Banner updated successfully' : 'Banner created successfully'
    );
    navigate('/admin/banners');
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {isEditing ? 'Edit Banner' : 'Add New Banner'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? 'Update banner information' : 'Create a new hero slider banner'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-lg font-semibold mb-4">Banner Image</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Recommended size: 1920x800 pixels
              </p>

              {image ? (
                <div className="relative aspect-[2.4/1] bg-muted rounded-lg overflow-hidden">
                  <img
                    src={image}
                    alt="Banner preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="aspect-[2.4/1] border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                  <Upload className="w-10 h-10 text-muted-foreground mb-3" />
                  <span className="text-muted-foreground">
                    Click to upload banner image
                  </span>
                  <span className="text-sm text-muted-foreground mt-1">
                    PNG, JPG, WebP up to 10MB
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Preview */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-lg font-semibold mb-4">Preview</h2>
              <div className="relative aspect-[2.4/1] bg-gradient-to-r from-background/95 via-background/70 to-transparent rounded-lg overflow-hidden">
                {image && (
                  <img
                    src={image}
                    alt="Preview"
                    className="absolute inset-0 w-full h-full object-cover -z-10"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
                <div className="relative h-full p-6 flex flex-col justify-center">
                  {formData.badge && (
                    <span className="inline-block w-fit px-2 py-0.5 bg-primary text-primary-foreground rounded text-xs font-medium mb-2">
                      {formData.badge}
                    </span>
                  )}
                  <h3 className="text-xl font-bold mb-1">
                    {formData.title || 'Banner Title'}
                  </h3>
                  <p className="text-primary font-medium text-sm mb-1">
                    {formData.subtitle || 'Subtitle here'}
                  </p>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                    {formData.description || 'Description text will appear here'}
                  </p>
                  <Button size="sm" className="w-fit">
                    {formData.buttonText || 'Shop Now'}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Form Fields */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Content */}
            <div className="bg-card rounded-xl p-6 border border-border space-y-4">
              <h2 className="text-lg font-semibold">Banner Content</h2>

              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter banner title"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleInputChange}
                  placeholder="Enter subtitle"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter description"
                  rows={3}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="badge">Badge Text</Label>
                <Input
                  id="badge"
                  name="badge"
                  value={formData.badge}
                  onChange={handleInputChange}
                  placeholder="e.g., Best Seller, New Arrival"
                  className="mt-1"
                />
              </div>
            </div>

            {/* Button Settings */}
            <div className="bg-card rounded-xl p-6 border border-border space-y-4">
              <h2 className="text-lg font-semibold">Button Settings</h2>

              <div>
                <Label htmlFor="buttonText">Button Text</Label>
                <Input
                  id="buttonText"
                  name="buttonText"
                  value={formData.buttonText}
                  onChange={handleInputChange}
                  placeholder="e.g., Shop Now"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="buttonLink">Button Link</Label>
                <Input
                  id="buttonLink"
                  name="buttonLink"
                  value={formData.buttonLink}
                  onChange={handleInputChange}
                  placeholder="e.g., /products"
                  className="mt-1"
                />
              </div>
            </div>

            {/* Settings */}
            <div className="bg-card rounded-xl p-6 border border-border space-y-4">
              <h2 className="text-lg font-semibold">Settings</h2>

              <div>
                <Label htmlFor="order">Display Order</Label>
                <Input
                  id="order"
                  name="order"
                  type="number"
                  value={formData.order}
                  onChange={handleInputChange}
                  min="1"
                  className="mt-1"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Active</p>
                  <p className="text-sm text-muted-foreground">
                    Banner is visible on the website
                  </p>
                </div>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, isActive: checked }))
                  }
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <Button type="submit" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : isEditing ? (
                  'Update Banner'
                ) : (
                  'Create Banner'
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        </div>
      </form>
    </div>
  );
};

export default BannerForm;
