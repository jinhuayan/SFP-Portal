import { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@/contexts/authContext';
import { toast } from 'sonner';
import { z } from 'zod';

// Define the animal form schema using Zod
const animalFormSchema = z.object({
  name: z.string().min(2, "Name is required").max(100),
  species: z.enum(['Dog', 'Cat', 'Other'], { required_error: "Species is required" }),
  breed: z.string().min(2, "Breed is required").max(100),
  age: z.string().min(1, "Age is required").max(50),
  sex: z.enum(['Male', 'Female'], { required_error: "Sex is required" }),
  size: z.enum(['Small', 'Medium', 'Large'], { required_error: "Size is required" }),
  color: z.string().min(2, "Color is required").max(100),
  description: z.string().min(10, "Description is required").max(1000),
  personality: z.string().min(1, "At least one personality trait is required"),
  location: z.string().min(2, "Location is required").max(100),
  adoptionFee: z.number().min(0, "Adoption fee cannot be negative").max(10000),
  vaccinated: z.boolean(),
  neutered: z.boolean(),
  goodWithChildren: z.boolean(),
  goodWithDogs: z.boolean(),
  goodWithCats: z.boolean(),
  microchipNumber: z.string().max(50).optional(),
  medicalHistory: z.string().max(1000).optional(),
  behaviorNotes: z.string().max(1000).optional(),
  intakeSource: z.string().max(100).optional(),
  internalNotes: z.string().max(1000).optional(),
});

type AnimalFormData = z.infer<typeof animalFormSchema>;

export default function AddAnimal() {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState<AnimalFormData>({
    name: '',
    species: 'Dog',
    breed: '',
    age: '',
    sex: 'Male',
    size: 'Medium',
    color: '',
    description: '',
    personality: '',
    location: '',
    adoptionFee: 0,
    vaccinated: false,
    neutered: false,
    goodWithChildren: false,
    goodWithDogs: false,
    goodWithCats: false,
    microchipNumber: '',
    medicalHistory: '',
    behaviorNotes: '',
    intakeSource: '',
    internalNotes: '',
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof AnimalFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  
  // Check if user has permission to access this page
  if (!currentUser || (!currentUser.role.includes('admin') && !currentUser.role.includes('foster') && !currentUser.role.includes('super foster'))) {
    navigate('/dashboard');
    toast.error('You do not have permission to access this page.');
    return null;
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'adoptionFee' ? parseFloat(value) || 0 : value 
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof AnimalFormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
    
    // Clear error when user toggles checkbox
    if (errors[name as keyof AnimalFormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedImages(files);
      
      // Create preview URLs for the selected images
      const previews = files.map(file => URL.createObjectURL(file));
      setPreviewImages(previews);
    }
  };
  
  const removeImage = (index: number) => {
    const newImages = [...selectedImages];
    const newPreviews = [...previewImages];
    
    // Revoke the object URL to free up memory
    URL.revokeObjectURL(previewImages[index]);
    
    // Remove the image from both arrays
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setSelectedImages(newImages);
    setPreviewImages(newPreviews);
  };
  
  const validateForm = () => {
    try {
      // Check if at least one image is uploaded
      if (selectedImages.length === 0) {
        toast.error('Please upload at least one photo of the animal');
        return false;
      }
      
      // Check if personality traits are provided
      if (!formData.personality.trim()) {
        setErrors(prev => ({ ...prev, personality: "At least one personality trait is required" }));
        return false;
      }
      
      animalFormSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof AnimalFormData, string>> = {};
        error.errors.forEach(err => {
          newErrors[err.path[0] as keyof AnimalFormData] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorField = document.querySelector('[aria-invalid="true"]');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare form data for submission
      const formToSubmit = {
        ...formData,
        personality: formData.personality.split(',').map(trait => trait.trim()),
        goodWith: {
          children: formData.goodWithChildren,
          dogs: formData.goodWithDogs,
          cats: formData.goodWithCats
        },
        // Generate a unique ID in SFP-xxx format
        uniqueId: `SFP-${Math.floor(100 + Math.random() * 900)}`,
        intakeDate: new Date().toISOString().split('T')[0],
           status: 'Fostering',
            imageUrls: previewImages // In a real app, these would be uploaded to a server
          };
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`${formData.name} has been added successfully!`, {
        description: "The animal has been saved as a draft.",
        duration: 5001,
        onAutoClose: () => navigate('/animals/manage')
      });
    } catch (error) {
      toast.error('Failed to add animal. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen py-12 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center">
            <button 
              onClick={() => navigate(-1)}
              className="mr-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              aria-label="Back"
            >
              <i className="fa-solid fa-arrow-left text-xl"></i>
            </button>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Add New Animal</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Create a new animal profile for adoption</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto"
        >
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Basic Information Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white pb-2 border-b border-gray-200 dark:border-gray-800">
                Basic Information
              </h2>
              
              {/* Animal Images */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Animal Photos
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    <i className="fa-solid fa-cloud-arrow-up text-gray-400 text-3xl"></i>
                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-[#4C51A4] hover:text-[#383C80]">
                        <span>Upload photos</span>
                        <input 
                          id="file-upload" 
                          name="file-upload" 
                          type="file" 
                          multiple
                          accept="image/*"
                          className="sr-only" 
                          onChange={handleFileChange} 
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PNG, JPG, GIF up to 10MB (at least 1 photo required)
                    </p>
                  </div>
                </div>
                
                {/* Image Preview */}
                {previewImages.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {previewImages.map((preview, index) => (
                      <div key={index} className="relative">
                        <img 
                          src={preview} 
                          alt={`Preview ${index + 1}`} 
                          className="w-full h-32 object-cover rounded-lg" 
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-white/80 dark:bg-gray-900/80 text-gray-800 dark:text-white p-1 rounded-full shadow-md hover:bg-white dark:hover:bg-gray-900"
                          aria-label="Remove image"
                        >
                          <i className="fa-solid fa-times"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.name 
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                        : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800'
                    } text-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all`}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    placeholder="Animal's name"
                  />
                  {errors.name && (
                    <p id="name-error" className="mt-1 text-sm text-red-500">{errors.name}</p>
                  )}
                </div>
                
                {/* Species */}
                <div>
                  <label htmlFor="species" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Species
                  </label>
                  <select
                    id="species"
                    name="species"
                    value={formData.species}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.species 
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                        : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800'
                    } text-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all appearance-none`}
                    aria-invalid={!!errors.species}
                    aria-describedby={errors.species ? "species-error" : undefined}
                  >
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.species && (
                    <p id="species-error" className="mt-1 text-sm text-red-500">{errors.species}</p>
                  )}
                </div>
                
                {/* Breed */}
                <div>
                  <label htmlFor="breed" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Breed
                  </label>
                  <input
                    type="text"
                    id="breed"
                    name="breed"
                    value={formData.breed}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.breed 
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                        : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800'
                    } text-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all`}
                    aria-invalid={!!errors.breed}
                    aria-describedby={errors.breed ? "breed-error" : undefined}
                    placeholder="Breed or mix"
                  />
                  {errors.breed && (
                    <p id="breed-error" className="mt-1 text-sm text-red-500">{errors.breed}</p>
                  )}
                </div>
                
                {/* Age */}
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Age
                  </label>
                  <input
                    type="text"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.age 
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                        : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800'
                    } text-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all`}
                    aria-invalid={!!errors.age}
                    aria-describedby={errors.age ? "age-error" : undefined}
                    placeholder="e.g., 2 years, 6 months"
                  />
                  {errors.age && (
                    <p id="age-error" className="mt-1 text-sm text-red-500">{errors.age}</p>
                  )}
                </div>
                
                {/* Sex */}
                <div>
                  <label htmlFor="sex" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Sex
                  </label>
                  <select
                    id="sex"
                    name="sex"
                    value={formData.sex}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.sex 
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                        : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800'
                    } text-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all appearance-none`}
                    aria-invalid={!!errors.sex}
                    aria-describedby={errors.sex ? "sex-error" : undefined}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  {errors.sex && (
                    <p id="sex-error" className="mt-1 text-sm text-red-500">{errors.sex}</p>
                  )}
                </div>
                
                {/* Size */}
                <div>
                  <label htmlFor="size" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Size
                  </label>
                  <select
                    id="size"
                    name="size"
                    value={formData.size}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.size 
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                        : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800'
                    } text-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all appearance-none`}
                    aria-invalid={!!errors.size}
                    aria-describedby={errors.size ? "size-error" : undefined}
                  >
                    <option value="Small">Small</option>
                    <option value="Medium">Medium</option>
                    <option value="Large">Large</option>
                  </select>
                  {errors.size && (
                    <p id="size-error" className="mt-1 text-sm text-red-500">{errors.size}</p>
                  )}
                </div>
                
                {/* Color */}
                <div>
                  <label htmlFor="color" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Color
                  </label>
                  <input
                    type="text"
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.color 
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                        : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800'
                    } text-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all`}
                    aria-invalid={!!errors.color}
                    aria-describedby={errors.color ? "color-error" : undefined}
                    placeholder="Animal's color"
                  />
                  {errors.color && (
                    <p id="color-error" className="mt-1 text-sm text-red-500">{errors.color}</p>
                  )}
                </div>
                
                {/* Location */}
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.location 
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                        : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800'
                    } text-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all`}
                    aria-invalid={!!errors.location}
                    aria-describedby={errors.location ? "location-error" : undefined}
                    placeholder="Where the animal is located"
                  />
                  {errors.location && (
                    <p id="location-error" className="mt-1 text-sm text-red-500">{errors.location}</p>
                  )}
                </div>
                
                {/* Adoption Fee */}
                <div>
                  <label htmlFor="adoptionFee" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Adoption Fee ($)
                  </label>
                  <input
                    type="number"
                    id="adoptionFee"
                    name="adoptionFee"
                    value={formData.adoptionFee}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.adoptionFee 
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                        : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800'
                    } text-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all`}
                    aria-invalid={!!errors.adoptionFee}
                    aria-describedby={errors.adoptionFee ? "adoptionFee-error" : undefined}
                    placeholder="Adoption fee amount"
                    min="0"
                  />
                  {errors.adoptionFee && (
                    <p id="adoptionFee-error" className="mt-1 text-sm text-red-500">{errors.adoptionFee}</p>
                  )}
                </div>
              </div>
              
              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.description 
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                      : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800'
                  } text-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all`}
                  aria-invalid={!!errors.description}
                  aria-describedby={errors.description ? "description-error" : undefined}
                  placeholder="Describe the animal's personality, temperament, and any special needs"
                ></textarea>
                {errors.description && (
                  <p id="description-error" className="mt-1 text-sm text-red-500">{errors.description}</p>
                )}
              </div>
              
              {/* Personality Traits */}
              <div>
                <label htmlFor="personality" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Personality Traits (separated by commas)
                </label>
                <input
                  type="text"
                  id="personality"
                  name="personality"
                  value={formData.personality}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.personality 
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                      : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800'
                  } text-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all`}
                  aria-invalid={!!errors.personality}
                  aria-describedby={errors.personality ? "personality-error" : undefined}
                  placeholder="e.g., Friendly, Energetic, Playful"
                />
                {errors.personality && (
                  <p id="personality-error" className="mt-1 text-sm text-red-500">{errors.personality}</p>
                )}
              </div>
              
              {/* Compatibility */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="goodWithChildren"
                    name="goodWithChildren"
                    checked={formData.goodWithChildren}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-700 rounded"
                  />
                  <label htmlFor="goodWithChildren" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Good with children
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="goodWithDogs"
                    name="goodWithDogs"
                    checked={formData.goodWithDogs}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-700 rounded"
                  />
                  <label htmlFor="goodWithDogs" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Good with other dogs
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="goodWithCats"
                    name="goodWithCats"
                    checked={formData.goodWithCats}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-700 rounded"
                  />
                  <label htmlFor="goodWithCats" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Good with cats
                  </label>
                </div>
              </div>
              
              {/* Health Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="vaccinated"
                    name="vaccinated"
                    checked={formData.vaccinated}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-700 rounded"
                  />
                  <label htmlFor="vaccinated" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Vaccinated
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="neutered"
                    name="neutered"
                    checked={formData.neutered}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-700 rounded"
                  />
                  <label htmlFor="neutered" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Neutered/Spayed
                  </label>
                </div>
              </div>
            </div>
            
            {/* Internal Notes Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white pb-2 border-b border-gray-200 dark:border-gray-800">
                Internal Notes (Private)
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Microchip Number */}
                <div>
                  <label htmlFor="microchipNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Microchip Number
                  </label>
                  <input
                    type="text"
                    id="microchipNumber"
                    name="microchipNumber"
                    value={formData.microchipNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    placeholder="Microchip ID number"
                  />
                </div>
                
                {/* Intake Source */}
                <div>
                  <label htmlFor="intakeSource" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Intake Source
                  </label>
                  <input
                    type="text"
                    id="intakeSource"
                    name="intakeSource"
                    value={formData.intakeSource}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    placeholder="Where the animal was rescued from"
                  />
                </div>
              </div>
              
              {/* Medical History */}
              <div>
                <label htmlFor="medicalHistory" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Medical History
                </label>
                <textarea
                  id="medicalHistory"
                  name="medicalHistory"
                  value={formData.medicalHistory}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  placeholder="Any known medical conditions or treatments"
                ></textarea>
              </div>
              
              {/* Behavior Notes */}
              <div>
                <label htmlFor="behaviorNotes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Behavior Notes
                </label>
                <textarea
                  id="behaviorNotes"
                  name="behaviorNotes"
                  value={formData.behaviorNotes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  placeholder="Any specific behaviors, training needs, or concerns"
                ></textarea>
              </div>
              
              {/* Internal Notes */}
              <div>
                <label htmlFor="internalNotes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Additional Internal Notes
                </label>
                <textarea
                  id="internalNotes"
                  name="internalNotes"
                  value={formData.internalNotes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  placeholder="Any other information for internal use only"
                ></textarea>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-end">
              <button
                type="button"
                onClick={() => navigate('/animals/manage')}
                className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-3 bg-[#4C51A4] hover:bg-[#383C80] text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                    Saving Animal...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-save mr-2"></i>
                    Save as Draft
                  </>
                )}
              </button>
              {currentUser.role.includes('admin') || currentUser.role.includes('super foster') ? (
                <button
                  type="button"
                  disabled={isSubmitting}
                  className={`px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                      Publishing...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-paper-plane mr-2"></i>
                      Publish Now
                    </>
                  )}
                </button>
              ) : null}
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}