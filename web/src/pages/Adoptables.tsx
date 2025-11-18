import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AnimalList from '@/components/animals/AnimalList';

export default function Adoptables() {
  const [activeTab, setActiveTab] = useState('all');
  const [animals, setAnimals] = useState<any[]>([]);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    async function fetchAnimals() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/animals/available`);
        if (!res.ok) throw new Error('Failed to fetch animals');
        const data = await res.json();
        setAnimals(data);
      } catch (err) {
      }
    }
    fetchAnimals();
  }, [API_BASE_URL]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
     <div className="min-h-screen py-12 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="text-3xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">Adopt a Pet</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Browse our available animals and find your perfect companion. All our pets are vaccinated, neutered, and ready to join their new families.
          </p>
        </motion.div>
        
        {/* Quick Filters / Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[
            { id: 'all', label: 'All Pets', icon: 'fa-paw' },
            { id: 'dogs', label: 'Dogs', icon: 'fa-dog' },
            { id: 'cats', label: 'Cats', icon: 'fa-cat' },
            { id: 'small', label: 'Small Pets', icon: 'fa-rabbit' },
            { id: 'petsmart', label: 'PetSmart', icon: 'fa-store' },
            { id: 'petvalu', label: 'PetValu', icon: 'fa-shopping-basket' },
            { id: 'senior', label: 'Senior Pets', icon: 'fa-heart' },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
                 onClick={() => handleTabChange(tab.id)}
                 className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all ${
                   activeTab === tab.id
                     ? 'bg-[#4C51A4] text-white shadow-md'
                     : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                 }`}
               >
              <i className={`fa-solid ${tab.icon} mr-2`}></i>
              {tab.label}
            </motion.button>
          ))}
        </div>
        
        {/* Animal List with Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AnimalList 
            animals={animals} 
          />
        </motion.div>
      </div>
    </div>
  );
}