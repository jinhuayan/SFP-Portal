import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimalDetail from '@/components/animals/AnimalDetail';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AnimalDetailPage() {
  const { id } = useParams();
  const [animal, setAnimal] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      setLoading(true);
      setError('');
      fetch(`${API_BASE_URL}/api/animals/${id}`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch animal');
          return res.json();
        })
        .then(data => {
          setAnimal({
            id: data.id,
            uniqueId: data.unique_id || data.uniqueId,
            name: data.name,
            species: data.species,
            breed: data.breed,
            age: data.age,
            sex: data.sex,
            size: data.size,
            color: data.color,
            description: data.description,
            personality: Array.isArray(data.personality) ? data.personality : [],
            imageUrls: data.image_urls || data.imageUrls || [],
            adoptionFee: data.adoption_fee || data.adoptionFee,
            intakeDate: data.intake_date || data.intakeDate,
            postedDate: data.posted_date || data.postedDate,
            status: data.status,
            adoptionDate: data.adoption_date || data.adoptionDate,
            adoptionStory: data.adoption_story || data.adoptionStory,
            goodWith: {
              children: data.good_with_children ?? false,
              dogs: data.good_with_dogs ?? false,
              cats: data.good_with_cats ?? false,
            },
            location: data.location,
            vaccinated: data.vaccinated ?? false,
            neutered: data.neutered ?? false,
          });
        })
        .catch(() => setError('Could not load animal details.'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return <div className="min-h-screen py-12 bg-white dark:bg-gray-900 text-center text-lg text-gray-500">Loading animal details...</div>;
  }
  if (error || !animal) {
    return (
      <div className="min-h-screen py-12 bg-[#FFDF4] dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-12 text-center">
            <div className="flex flex-col items-center justify-center">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                <i className="fa-solid fa-search text-gray-400 text-4xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Animal Not Found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                We couldn't find the animal you're looking for. It might have been adopted or removed from our system.
              </p>
              <a 
                href="/adoptables" className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Browse Available Animals
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AnimalDetail animal={animal} />
        </motion.div>
      </div>
    </div>
  );
}