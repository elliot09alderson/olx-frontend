/** @format */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { api } from "../utils/api.js";
import { Upload, X, Plus, Camera } from "lucide-react";

const categories = [
  'Electronics',
  'Vehicles', 
  'Home & Furniture',
  'Fashion',
  'Books, Sports & Hobbies',
  'Jobs',
  'Services', 
  'Real Estate',
  'Pets',
  'Other'
];

const conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

export const UploadAd = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    condition: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user selects
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;
    
    // Check total images limit
    if (selectedImages.length + files.length > 4) {
      toast({
        variant: "destructive",
        title: "Too many images",
        description: "You can upload maximum 4 images",
      });
      return;
    }

    // Validate file types and sizes
    const validFiles: File[] = [];
    const validUrls: string[] = [];

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please select only image files",
        });
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive", 
          title: "File too large",
          description: "Each image must be less than 5MB",
        });
        continue;
      }

      validFiles.push(file);
      validUrls.push(URL.createObjectURL(file));
    }

    setSelectedImages(prev => [...prev, ...validFiles]);
    setImagePreviewUrls(prev => [...prev, ...validUrls]);
  };

  const removeImage = (index: number) => {
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviewUrls[index]);
    
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    if (!formData.price) {
      newErrors.price = "Price is required";
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "Please enter a valid price";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.condition) {
      newErrors.condition = "Condition is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(formData.pincode.trim())) {
      newErrors.pincode = "Pincode must be a 6-digit number";
    }

    if (selectedImages.length === 0) {
      newErrors.images = "At least one image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Append form fields
      formDataToSend.append('title', formData.title.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('price', formData.price);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('condition', formData.condition);
      formDataToSend.append('city', formData.city.trim());
      formDataToSend.append('state', formData.state.trim());
      formDataToSend.append('pincode', formData.pincode.trim());

      // Append images
      selectedImages.forEach((image) => {
        formDataToSend.append('images', image);
      });

      const response = await api.post('/ads', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        toast({
          title: "Ad posted successfully!",
          description: "Your ad is now live and visible to buyers",
        });
        
        // Clean up image URLs
        imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
        
        navigate(`/ad/${response.data.ad.slug}`);
      } else {
        toast({
          variant: "destructive",
          title: "Failed to post ad",
          description: response.data.message || "Something went wrong",
        });
      }
    } catch (error: any) {
      console.error('Upload ad error:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.errors?.[0]?.message ||
                          "Failed to post ad. Please try again.";
                          
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-surface p-4">
      <div className="container mx-auto max-w-4xl">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Camera className="h-6 w-6" />
              Post Your Ad
            </CardTitle>
            <CardDescription>
              Fill in the details to create your listing
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Images Upload */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">
                  Images <span className="text-destructive">*</span>
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imagePreviewUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  
                  {selectedImages.length < 4 && (
                    <Label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:border-muted-foreground/50 transition-colors">
                      <Plus className="h-8 w-8 mb-2 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Add Image</span>
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                    </Label>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Upload up to 4 images (Max 5MB each)
                </p>
                {errors.images && (
                  <p className="text-sm text-destructive">{errors.images}</p>
                )}
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="title">
                    Ad Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="e.g. iPhone 13 Pro - Excellent condition"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={errors.title ? "border-destructive" : ""}
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive">{errors.title}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">
                    Price (₹) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    placeholder="0"
                    value={formData.price}
                    onChange={handleInputChange}
                    className={errors.price ? "border-destructive" : ""}
                  />
                  {errors.price && (
                    <p className="text-sm text-destructive">{errors.price}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>
                    Category <span className="text-destructive">*</span>
                  </Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => handleSelectChange('category', value)}
                  >
                    <SelectTrigger className={errors.category ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-destructive">{errors.category}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>
                    Condition <span className="text-destructive">*</span>
                  </Label>
                  <Select 
                    value={formData.condition} 
                    onValueChange={(value) => handleSelectChange('condition', value)}
                  >
                    <SelectTrigger className={errors.condition ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map((condition) => (
                        <SelectItem key={condition} value={condition}>
                          {condition}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.condition && (
                    <p className="text-sm text-destructive">{errors.condition}</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">
                  Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your item in detail..."
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  className={errors.description ? "border-destructive" : ""}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description}</p>
                )}
              </div>

              {/* Location */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Location</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">
                      City <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="city"
                      name="city"
                      placeholder="e.g. Mumbai"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={errors.city ? "border-destructive" : ""}
                    />
                    {errors.city && (
                      <p className="text-sm text-destructive">{errors.city}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">
                      State <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="state"
                      name="state"
                      placeholder="e.g. Maharashtra"
                      value={formData.state}
                      onChange={handleInputChange}
                      className={errors.state ? "border-destructive" : ""}
                    />
                    {errors.state && (
                      <p className="text-sm text-destructive">{errors.state}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pincode">
                      Pincode <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      placeholder="400001"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className={errors.pincode ? "border-destructive" : ""}
                    />
                    {errors.pincode && (
                      <p className="text-sm text-destructive">{errors.pincode}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  disabled={loading}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? (
                    <>
                      <Upload className="mr-2 h-4 w-4 animate-spin" />
                      Posting Ad...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Post Ad
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};