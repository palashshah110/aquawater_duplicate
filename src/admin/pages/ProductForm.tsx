import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, X, Plus, Loader2, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { productsApi, categoriesApi } from '../services/api';

const defaultCategories = [
  'Overflow Protection',
  'Auto Cut-Off',
  'Sensors',
  'IoT Solutions',
];

interface ProductFormData {
  name: string;
  category: string;
  price: string;
  discountPrice: string;
  description: string;
  shortDescription: string;
  features: string[];
  warranty: string;
  power: string;
  compatibility: string;
  dimensions: string;
  weight: string;
  stock: string;
  sku: string;
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
}

interface ExistingImage {
  url: string;
  publicId: string;
}

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [categories, setCategories] = useState<string[]>(defaultCategories);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    category: '',
    price: '',
    discountPrice: '',
    description: '',
    shortDescription: '',
    features: [''],
    warranty: '1 Year',
    power: '',
    compatibility: '',
    dimensions: '',
    weight: '',
    stock: '',
    sku: '',
    isActive: true,
    isFeatured: false,
    tags: [],
  });

  // New category dialog state
  const [showNewCategoryDialog, setShowNewCategoryDialog] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [creatingCategory, setCreatingCategory] = useState(false);

  useEffect(() => {
    fetchCategories();
    if (isEditing && id) {
      fetchProduct(id);
    }
  }, [id, isEditing]);

  const fetchCategories = async () => {
    try {
      const response:any = await productsApi.getCategories();
      if (response.data.length > 0) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error('Category name is required');
      return;
    }

    setCreatingCategory(true);
    try {
      const response = await categoriesApi.create({
        name: newCategoryName.trim(),
        description: newCategoryDescription.trim(),
        isActive: true,
        order: categories.length,
      } as any);

      // Add new category to list and select it
      const newCategory = response.data;
      setCategories((prev: any) => [...prev, newCategory]);
      setFormData((prev) => ({ ...prev, category: newCategory._id }));

      // Reset and close dialog
      setNewCategoryName('');
      setNewCategoryDescription('');
      setShowNewCategoryDialog(false);
      toast.success('Category created successfully');
    } catch (error: any) {
      console.error('Error creating category:', error);
      toast.error(error.message || 'Failed to create category');
    } finally {
      setCreatingCategory(false);
    }
  };

  const fetchProduct = async (productId: string) => {
    try {
      setIsFetching(true);
      const response = await productsApi.getById(productId);
      const product = response.data;
      console.log(product)
      setFormData({
        name: product.name,
        category: (product.category as any)._id || product.category,
        price: product.price.toString(),
        discountPrice: product.discountPrice?.toString() || '',
        description: product.description || '',
        shortDescription: product.shortDescription || '',
        features: product.features.length > 0 ? product.features : [''],
        warranty: product.specs.warranty || '1 Year',
        power: product.specs.power || '',
        compatibility: product.specs.compatibility || '',
        dimensions: product.specs.dimensions || '',
        weight: product.specs.weight || '',
        stock: product.stock.toString(),
        sku: product.sku || '',
        isActive: product.isActive,
        isFeatured: product.isFeatured,
        tags: product.tags || [],
      });

      setExistingImages(product.images || []);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to fetch product');
      navigate('/admin/products');
    } finally {
      setIsFetching(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData((prev) => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setFormData((prev) => ({ ...prev, features: [...prev.features, ''] }));
  };
  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, features: newFeatures }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const totalImages = existingImages.length - imagesToDelete.length + newImages.length + files.length;
      if (totalImages > 5) {
        toast.error('Maximum 5 images allowed');
        return;
      }

      const newFilesArray = Array.from(files);
      setNewImages((prev) => [...prev, ...newFilesArray]);

      const newPreviews = newFilesArray.map((file) => URL.createObjectURL(file));
      setNewImagePreviews((prev) => [...prev, ...newPreviews]);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeNewImage = (index: number) => {
    URL.revokeObjectURL(newImagePreviews[index]);
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (publicId: string) => {
    setImagesToDelete((prev) => [...prev, publicId]);
  };

  const restoreExistingImage = (publicId: string) => {
    setImagesToDelete((prev) => prev.filter((id) => id !== publicId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    const totalImages = existingImages.length - imagesToDelete.length + newImages.length;
    if (totalImages === 0 && !isEditing) {
      toast.error('Please upload at least one image');
      return;
    }

    setIsLoading(true);

    try {
      const formDataToSend = new FormData();

      formDataToSend.append('name', formData.name);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('price', formData.price);
      if (formData.discountPrice) {
        formDataToSend.append('discountPrice', formData.discountPrice);
      }
      formDataToSend.append('description', formData.description);
      if (formData.shortDescription) {
        formDataToSend.append('shortDescription', formData.shortDescription);
      }

      const filteredFeatures = formData.features.filter((f) => f.trim() !== '');
      formDataToSend.append('features', JSON.stringify(filteredFeatures));
      
      const specs = {
        warranty: formData.warranty,
        power: formData.power,
        compatibility: formData.compatibility,
        dimensions: formData.dimensions,
        weight: formData.weight,
      };
      formDataToSend.append('specs', JSON.stringify(specs));

      formDataToSend.append('stock', formData.stock || '0');
      if (formData.sku) {
        formDataToSend.append('sku', formData.sku);
      }
      formDataToSend.append('isActive', formData.isActive.toString());
      formDataToSend.append('isFeatured', formData.isFeatured.toString());
      formDataToSend.append('tags', JSON.stringify(formData.tags));

      newImages.forEach((file) => {
        formDataToSend.append('images', file);
      });

      if (isEditing && imagesToDelete.length > 0) {
        formDataToSend.append('imagesToDelete', JSON.stringify(imagesToDelete));
      }

      if (isEditing && id) {
        await productsApi.update(id, formDataToSend);
        toast.success('Product updated successfully');
      } else {
        await productsApi.create(formDataToSend);
        toast.success('Product created successfully');
      }

      navigate('/admin/products');
    } catch (error: any) {
      console.error('Error saving product:', error);
      toast.error(error.message || 'Failed to save product');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const visibleExistingImages = existingImages.filter(
    (img) => !imagesToDelete.includes(img.publicId)
  );
  const totalVisibleImages = visibleExistingImages.length + newImages.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing
              ? 'Update product information'
              : 'Add a new product to your store'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-xl p-6 border border-border space-y-4"
            >
              <h2 className="text-lg font-semibold">Basic Information</h2>

              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <div className="flex gap-2 mt-1">
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, category: value }))
                      }
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat:any) => (
                          <SelectItem key={cat._id} value={cat._id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setShowNewCategoryDialog(true)}
                      title="Add new category"
                    >
                      <PlusCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    placeholder="e.g., SF-001"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="shortDescription">Short Description</Label>
                <Input
                  id="shortDescription"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  placeholder="Brief product description"
                  className="mt-1"
                />
              </div>

              {/* <div>
                <Label htmlFor="description">Full Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Detailed product description"
                  rows={4}
                  className="mt-1"
                />
              </div>
            */}
            </motion.div>

            {/* Images */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-xl p-6 border border-border space-y-4"
            >
              <h2 className="text-lg font-semibold">Product Images</h2>
              <p className="text-sm text-muted-foreground">
                Upload up to 5 images. First image will be the main image.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {/* Existing Images */}
                {existingImages.map((img, index) => {
                  const isDeleted = imagesToDelete.includes(img.publicId);
                  return (
                    <div
                      key={img.publicId}
                      className={`relative aspect-square bg-muted rounded-lg overflow-hidden group ${
                        isDeleted ? 'opacity-40' : ''
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={`Product ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {isDeleted ? (
                        <button
                          type="button"
                          onClick={() => restoreExistingImage(img.publicId)}
                          className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-sm"
                        >
                          Click to restore
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => removeExistingImage(img.publicId)}
                          className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                      {index === 0 && !isDeleted && (
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded">
                          Main
                        </span>
                      )}
                    </div>
                  );
                })}

                {/* New Image Previews */}
                {newImagePreviews.map((preview, index) => (
                  <div
                    key={`new-${index}`}
                    className="relative aspect-square bg-muted rounded-lg overflow-hidden group"
                  >
                    <img
                      src={preview}
                      alt={`New ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-green-500 text-white text-xs rounded">
                      New
                    </span>
                  </div>
                ))}

                {totalVisibleImages < 5 && (
                  <label className="aspect-square border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                    <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Upload</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-xl p-6 border border-border space-y-4"
            >
              <h2 className="text-lg font-semibold">Features</h2>

              <div className="space-y-3">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      placeholder={`Feature ${index + 1}`}
                    />
                    {formData.features.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeFeature(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <Button type="button" variant="outline" onClick={addFeature}>
                <Plus className="w-4 h-4 mr-2" />
                Add Feature
              </Button>
            </motion.div>

            {/* Specifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card rounded-xl p-6 border border-border space-y-4"
            >
              <h2 className="text-lg font-semibold">Specifications</h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="warranty">Warranty</Label>
                  <Input
                    id="warranty"
                    name="warranty"
                    value={formData.warranty}
                    onChange={handleInputChange}
                    placeholder="e.g., 2 Years"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="power">Power</Label>
                  <Input
                    id="power"
                    name="power"
                    value={formData.power}
                    onChange={handleInputChange}
                    placeholder="e.g., 220V AC"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="compatibility">Compatibility</Label>
                  <Input
                    id="compatibility"
                    name="compatibility"
                    value={formData.compatibility}
                    onChange={handleInputChange}
                    placeholder="e.g., All tank types"
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dimensions">Dimensions</Label>
                  <Input
                    id="dimensions"
                    name="dimensions"
                    value={formData.dimensions}
                    onChange={handleInputChange}
                    placeholder="e.g., 10x5x3 cm"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="weight">Weight</Label>
                  <Input
                    id="weight"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    placeholder="e.g., 200g"
                    className="mt-1"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-xl p-6 border border-border space-y-4"
            >
              <h2 className="text-lg font-semibold">Pricing</h2>

              <div>
                <Label htmlFor="price">Price (₹) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="discountPrice">Discount Price (₹)</Label>
                <Input
                  id="discountPrice"
                  name="discountPrice"
                  type="number"
                  value={formData.discountPrice}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="mt-1"
                />
              </div>
            </motion.div>

            {/* Inventory */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-xl p-6 border border-border space-y-4"
            >
              <h2 className="text-lg font-semibold">Inventory</h2>

              <div>
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="mt-1"
                />
              </div>
            </motion.div>

            {/* Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card rounded-xl p-6 border border-border space-y-4"
            >
              <h2 className="text-lg font-semibold">Status</h2>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Active</p>
                  <p className="text-sm text-muted-foreground">
                    Product is visible on store
                  </p>
                </div>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, isActive: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Featured</p>
                  <p className="text-sm text-muted-foreground">
                    Show on homepage
                  </p>
                </div>
                <Switch
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, isFeatured: checked }))
                  }
                />
              </div>
            </motion.div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <Button type="submit" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : isEditing ? (
                  'Update Product'
                ) : (
                  'Create Product'
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
          </div>
        </div>
      </form>

      {/* New Category Dialog */}
      <Dialog open={showNewCategoryDialog} onOpenChange={setShowNewCategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
            <DialogDescription>
              Add a new category for your products.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="newCategoryName">Category Name *</Label>
              <Input
                id="newCategoryName"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Enter category name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="newCategoryDescription">Description (Optional)</Label>
              <Textarea
                id="newCategoryDescription"
                value={newCategoryDescription}
                onChange={(e) => setNewCategoryDescription(e.target.value)}
                placeholder="Brief description of the category"
                rows={3}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowNewCategoryDialog(false);
                setNewCategoryName('');
                setNewCategoryDescription('');
              }}
              disabled={creatingCategory}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleCreateCategory}
              disabled={creatingCategory || !newCategoryName.trim()}
            >
              {creatingCategory ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Category'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductForm;
