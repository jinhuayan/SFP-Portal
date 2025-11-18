// Mock data for animals available for adoption
export interface Animal {
  id: string;
  uniqueId: string; // SFP-xxx format
  name: string;
  species: 'Dog' | 'Cat' | 'Other';
  breed: string;
  age: string;
  sex: 'Male' | 'Female';
  size: 'Small' | 'Medium' | 'Large';
  color: string;
  description: string;
  personality: string[];
  imageUrls: string[];
  vaccinated: boolean;
  neutered: boolean;
  goodWith: {
    children: boolean;
    dogs: boolean;
    cats: boolean;
  };
  location: string;
  adoptionFee: number;
  intakeDate: string;
  postedDate: string;
  status: 'draft' | 'fostering' | 'ready for adoption' | 'published' | 'interviewing' | 'reserved' | 'adopted' | 'archived ';
  // Internal only fields
  microchipNumber: string;
  medicalHistory: string;
  behaviorNotes: string;
  intakeSource: string;
  internalNotes: string;
  // Interviewer assignments
  assignedInterviewers?: string[]; // Array of interviewer user IDs
  // Additional fields for adopted animals
  adoptionDate?: string;
  adoptionStory?: string;
}

export const mockAnimals: Animal[] = [
  {
    id: '1',
    uniqueId: 'SFP-123',
    name: 'Max',
    species: 'Dog',
    breed: 'Golden Retriever',
    age: '2 years',
    sex: 'Male',
    size: 'Large',
    color: 'Golden',
    description: 'Max is a friendly and energetic Golden Retriever who loves to play fetch and go for long walks. He\'s great with children and other pets.',
    personality: ['Friendly', 'Energetic', 'Loyal'],
    imageUrls: [
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Golden%20Retriever%20smiling%20in%20a%20park%2C%20sunny%20day&sign=0a8096e4ed11398eb700ce8d02b38e6b',
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Golden%20Retriever%20playing%20with%20a%20ball%20in%20grass&sign=f8d50a0de449e150671bcccfb9f3ae46'
    ],
    vaccinated: true,
    neutered: true,
    goodWith: {
      children: true,
      dogs: true,
      cats: true
    },
    location: 'PetSmart Downtown',
    adoptionFee: 250,
    intakeDate: '2025-10-15',
    postedDate: '2025-11-01',
    status: 'published',
    microchipNumber: '981020012345678',
    medicalHistory: 'Up to date on all vaccinations, regular check-ups.',
    behaviorNotes: 'Well-trained, responds to basic commands.',
    intakeSource: 'Stray, found near city park',
    internalNotes: 'Needs daily exercise and mental stimulation.'
  },
  {
    id: '2',
    uniqueId: 'SFP-124',
    name: 'Luna',
    species: 'Cat',
    breed: 'Siamese',
    age: '1 year',
    sex: 'Female',
    size: 'Small',
    color: 'Seal Point',
    description: 'Luna is a graceful Siamese cat with striking blue eyes. She\'s affectionate and enjoys lounging in sunny spots around the house.',
    personality: ['Affectionate', 'Playful', 'Independent'],
    imageUrls: [
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Siamese%20cat%20with%20blue%20eyes%20sitting%20on%20a%20windowsill&sign=b6ffb648b9daa01fdc8362ee1ff460df',
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Siamese%20cat%20playing%20with%20a%20feather%20toy&sign=d9d3f77c287bf27bdc19473f266ffaa4'
    ],
    vaccinated: true,
    neutered: true,
    goodWith: {
      children: true,
      dogs: false,
      cats: true
    },
    location: 'PetValu Uptown',
    adoptionFee: 150,
    intakeDate: '2025-10-20',
    postedDate: '2025-11-05',
    status: 'published',
    microchipNumber: '981020012345679',
    medicalHistory: 'All vaccinations up to date, spayed.',
    behaviorNotes: 'Vocal, likes to communicate with humans.',
    intakeSource: 'Owner surrender, moving abroad',
    internalNotes: 'Prefers to be the only dog in the household.'
  },
  {
    id: '3',
    uniqueId: 'SFP-125',
    name: 'Rocky',
    species: 'Dog',
    breed: 'Pit Bull Mix',
    age: '3 years',
    sex: 'Male',
    size: 'Medium',
    color: 'Brindle',
    description: 'Rocky is a gentle soul who loves cuddles and belly rubs. Despite his tough appearance, he\'s a total sweetheart.',
    personality: ['Gentle', 'Calm', 'Loving'],
    imageUrls: [
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Brindle%20Pit%20Bull%20lying%20on%20a%20couch%20smiling&sign=5fe9b6db65686d0d1c0c473bc5d137ea',
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Pit%20Bull%20playing%20with%20children%20in%20a%20yard&sign=3a56d2aadcbd2c855452bb890c1631d9'
    ],
    vaccinated: true,
    neutered: true,
    goodWith: {
      children: true,
      dogs: true,
      cats: false
    },
    location: 'Downtown Foster Home',
    adoptionFee: 200,
    intakeDate: '2025-10-25',
    postedDate: '2025-11-10',
    status: 'published',
    microchipNumber: '981020012345680',
    medicalHistory: 'Vaccinations up to date, neutered.',
    behaviorNotes: 'Gentle with people, needs socialization with other animals.',
    intakeSource: 'Rescued from neglect situation',
    internalNotes: 'Responding well to training, making great progress.'
  },
  {
    id: '4',
    uniqueId: 'SFP-101',
    name: 'Daisy',
    species: 'Dog',
    breed: 'Labrador Retriever',
    age: '5 years',
    sex: 'Female',
    size: 'Large',
    color: 'Yellow',
    description: 'Daisy is a sweet and gentle Labrador who loves to be around people. She\'s great with children and other pets.',
    personality: ['Sweet', 'Gentle', 'Friendly'],
    imageUrls: [
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Yellow%20Labrador%20Retriever%20smiling%20outdoors&sign=89282999494baa69bb149d7db937ff4a'
    ],
    vaccinated: true,
    neutered: true,
    goodWith: {
      children: true,
      dogs: true,
      cats: true
    },
    location: 'N/A',
    adoptionFee: 0,
    intakeDate: '2025-08-15',
    postedDate: '2025-09-01',
    status: 'Adopted',
    microchipNumber: '981020012345601',
    medicalHistory: 'All vaccinations up to date, spayed.',
    behaviorNotes: 'Well-trained, housebroken.',
    intakeSource: 'Shelter transfer',
    internalNotes: 'Adopted by the Smith family on 2025-10-15.',
    adoptionDate: '2025-10-15',
    adoptionStory: 'Daisy has found her forever home with the Smith family. She loves playing with their two children and going for long walks in the park.'
  },
  {
    id: '5',
    uniqueId: 'SFP-102',
    name: 'Whiskers',
    species: 'Cat',
    breed: 'Domestic Longhair',
    age: '2 years',
    sex: 'Male',
    size: 'Medium',
    color: 'Orange Tabby',
    description: 'Whiskers is a friendly and playful cat who loves to cuddle and play with toys.',
    personality: ['Playful', 'Affectionate', 'Curious'],
    imageUrls: [
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Orange%20tabby%20cat%20sitting%20on%20a%20chair&sign=56d399d39b153765bc06ce47a6c08bbf'
    ],
    vaccinated: true,
    neutered: true,
    goodWith: {
      children: true,
      dogs: true,
      cats: true
    },
    location: 'N/A',
    adoptionFee: 0,
    intakeDate: '2025-09-01',
    postedDate: '2025-09-15',
    status: 'Adopted',
    microchipNumber: '981020012345602',
    medicalHistory: 'Vaccinations up to date, neutered.',
    behaviorNotes: 'Litter trained, uses scratching post.',
    intakeSource: 'Stray',
    internalNotes: 'Adopted by the Johnson family on 2025-10-20.',
    adoptionDate: '2025-10-20',
    adoptionStory: 'Whiskers has settled into his new home with the Johnsons. He enjoys watching birds from the window and taking afternoon naps.'
  }
];

export const getAnimalById = (id: string): Animal | undefined => {
  return mockAnimals.find(animal => animal.id === id);
};

export const filterAnimals = (
  species?: string,
  age?: string,
  size?: string,
  goodWith?: string,
  status?: string
): Animal[] => {
  return mockAnimals.filter(animal => {
    if (status && animal.status !== status) return false;
    if (species && animal.species !== species) return false;
    if (age) {
      const ageNumber = parseInt(age);
      const animalAgeNumber = parseInt(animal.age);
      if (age === 'baby' && animalAgeNumber >= 1) return false;
      if (age === 'young' && (animalAgeNumber < 1 || animalAgeNumber > 3)) return false;
      if (age === 'adult' && (animalAgeNumber < 3 || animalAgeNumber > 8)) return false;
      if (age === 'senior' && animalAgeNumber < 8) return false;
    }
    if (size && animal.size !== size) return false;
    if (goodWith) {
      if (goodWith === 'children' && !animal.goodWith.children) return false;
      if (goodWith === 'dogs' && !animal.goodWith.dogs) return false;
      if (goodWith === 'cats' && !animal.goodWith.cats) return false;
    }
    
    return true;
  });
};

// Calculate days in SFP
export const calculateDaysInSFP = (intakeDate: string): number => {
  const intake = new Date(intakeDate);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - intake.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};