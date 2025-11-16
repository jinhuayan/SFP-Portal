import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimalDetail from '@/components/animals/AnimalDetail';
import { getAnimalById } from '@/data/mockAnimals';

export default function AnimalDetailPage() {
  const { id } = useParams();
  const animal = getAnimalById(id || '');
  
  if (!animal) {
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
                href="/adoptables"className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
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