import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { mockAnimals } from '@/data/mockAnimals';

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Track scroll position to change hero section appearance
  window.addEventListener('scroll', () => {
    setIsScrolled(window.scrollY > 50);
  });
  
  // Get the first 3 published animals for featured section
  const featuredAnimals = mockAnimals
    .filter(animal => animal.status === 'Published')
    .slice(0, 3);
  
  // Get some success stories
  const successStories = mockAnimals
    .filter(animal => animal.status === 'Adopted' && animal.adoptionStory)
    .slice(0, 2);
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className={`relative h-[80vh] flex items-center justify-center overflow-hidden transition-all duration-700 ${
          isScrolled ? 'h-[60vh]' : 'h-[80vh]'
        }`}
      >
         <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#4C51A4]/70 to-[#DF696B]/70 mix-blend-multiply"></div>
          <img 
            src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Happy%20dog%20and%20cat%20together%20in%20a%20home%20environment%2C%20warm%20lighting%2C%20cozy%20atmosphere&sign=fdfd505943e2b6e2351470d0ffe23b3f" 
            alt="Happy pets in a loving home" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container mx-auto px-4 z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
                Find Your Perfect Furry Companion
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto drop-shadow-md">
                Save Fur Pets connects loving homes with animals in need. Browse our adoptable pets and start your journey together.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <Link 
                 to="/adoptables" 
                 className="bg-white text-[#4C51A4] hover:bg-blue-50 font-bold py-3 px-8 rounded-lg transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105"
               >
                 Find a Pet
               </Link>
               <Link 
                 to="/about" 
                 className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-bold py-3 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
               >
                 About Us
               </Link>
              </div>
          </motion.div>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white dark:from-gray-900 to-transparent"></div>
      </section>
      
       {/* Stats Section */}
       <section className="py-16 bg-[#FFDF4] dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-8 text-center"
            >
               <div className="w-16 h-16 bg-[#E4CCB4] dark:bg-[#4C51A4]/30 text-[#4C51A4] rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-paw text-2xl"></i>
              </div>
              <h3 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">200+</h3>
              <p className="text-gray-600 dark:text-gray-400">Animals Rescued</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-8 text-center"
            >
               <div className="w-16 h-16 bg-[#E4CCB4] dark:bg-[#4C51A4]/30 text-[#4C51A4] rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-home text-2xl"></i>
              </div>
              <h3 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">150+</h3>
              <p className="text-gray-600 dark:text-gray-400">Happy Homes</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-8 text-center"
            >
               <div className="w-16 h-16 bg-[#E4CCB4] dark:bg-[#4C51A4]/30 text-[#4C51A4] rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-users text-2xl"></i>
              </div>
              <h3 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">50+</h3>
              <p className="text-gray-600 dark:text-gray-400">Volunteers</p>
            </motion.div>
          </div>
        </div>
      </section>
      
       {/* Featured Animals Section */}
       <section className="py-16 bg-[#FFDF4] dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">Meet Our Adoptables</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                These animals are currently looking for their forever homes. Click on any pet to learn more about them.
              </p>
            </div>
             <Link 
               to="/adoptables" 
               className="mt-6 md:mt-0 inline-flex items-center text-[#4C51A4] hover:text-[#383C80] font-semibold"
             >
                View All Pets
               <i className="fa-solid fa-arrow-right ml-2 text-[#4C51A4]"></i>
             </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredAnimals.map((animal, index) => (
              <motion.div
                key={animal.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={animal.imageUrls[0]} 
                      alt={animal.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/70 to-transparent">
                      <h3 className="text-xl font-bold text-white">{animal.name}</h3>
                      <p className="text-white/80">{animal.breed} • {animal.age}</p>
                      <p className="text-white/80 text-xs mt-1">ID: {animal.uniqueId}</p>
                    </div>
                     <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm text-[#4C51A4] text-sm font-semibold px-2.5 py-1 rounded-full shadow">
                      ${animal.adoptionFee}
                    </div>
                  </div>
                  
                  <div className="p-4 flex-1 flex flex-col">
                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-3">{animal.description}</p>
                    
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {animal.personality.slice(0, 3).map((trait, traitIndex) => (
                        <span 
                          key={traitIndex} 
                          className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full"
                        >
                          {trait}
                        </span>
                      ))}
                      {animal.personality.length > 3 && (
                        <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full">
                          +{animal.personality.length - 3} more
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-auto pt-2">
                     <Link 
                       to={`/animal/${animal.id}`} 
                   className="block w-full text-center bg-[#4C51A4] hover:bg-[#383C80] text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                 >
                     View Details
                     </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
       {/* Success Stories Preview */}
       <section className="py-16 bg-[#FFDF4] dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">Success Stories</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                See how our rescued animals have found their forever homes and brought joy to their new families.
              </p>
            </div>
             <Link 
               to="/adopted" 
               className="mt-6 md:mt-0 inline-flex items-center text-[#4C51A4] hover:text-[#383C80] font-semibold"
             >
                View All Stories
               <i className="fa-solid fa-arrow-right ml-2 text-[#4C51A4]"></i>
             </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {successStories.map((animal, index) => (
              <motion.div
                key={animal.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={animal.imageUrls[0]} 
                      alt={animal.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/70 to-transparent">
                      <h3 className="text-xl font-bold text-white">{animal.name}</h3>
                      <p className="text-white/80">{animal.breed} • {animal.age}</p>
                      <p className="text-white/80 text-xs mt-1">Adopted on {animal.adoptionDate}</p>
                    </div>
                     <div className="absolute top-4 right-4 bg-green-500 text-white text-sm font-semibold px-2.5 py-1 rounded-full shadow">
                      Adopted
                    </div>
                  </div>
                  
                  <div className="p-4 flex-1 flex flex-col">
                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-3">{animal.adoptionStory}</p>
                    
                    <div className="mt-auto pt-2">
                     <Link 
                       to={`/animal/${animal.id}`} 
                   className="block w-full text-center bg-[#4C51A4] hover:bg-[#383C80] text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                 >
                     Read Story
                     </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
       {/* How It Works Section */}
       <section className="py-16 bg-[#FFDF4] dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">How Adoption Works</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Our simple four-step process makes finding your perfect companion easy and stress-free.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: 'fa-search',
                title: 'Browse & Select',
                description: 'Explore our available pets and find the one that matches your lifestyle.'
              },
              {
                icon: 'fa-file-signature',
                title: 'Apply',
                description: 'Submit an adoption application and our team will review it promptly.'
              },
              {
                icon: 'fa-calendar-check',
                title: 'Interview',
                description: 'Schedule an interview for your potential new family member.'
              },
              {
                icon: 'fa-home',
                title: 'Welcome Home',
                description: 'Complete the adoption process and welcome your new pet to their forever home.'
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 text-center relative"
              >
                 <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-[#4C51A4] text-white rounded-full flex items-center justify-center shadow-lg">
                  <i className={`fa-solid ${step.icon}`}></i>
                </div>
                 <div className="w-16 h-16 bg-[#E4CCB4] dark:bg-[#4C51A4]/30 text-[#4C51A4] rounded-full flex items-center justify-center mx-auto mb-4 mt-2">
                  <i className={`fa-solid ${step.icon} text-2xl`}></i>
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Step {index + 1}: {step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
  
    </div>
    </div>
  );
}