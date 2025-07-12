import React, { createContext, useContext, useState } from 'react';

interface Skill {
  id: string;
  name: string;
  icon: string;
}

interface SkillProfile {
  id: string;
  name: string;
  location: string;
  profilePhoto: string;
  skillsOffered: string[];
  skillsWanted: string[];
  availability: 'Weekdays' | 'Weekends' | 'Evenings' | 'Anytime';
  isPublic: boolean;
  userId: string;
  bio?: string;
  projects?: string[];
  events?: string[];
  rating: number;
}

interface SwapRequest {
  id: string;
  requesterId: string;
  recipientId: string;
  skillOffered: string;
  skillWanted: string;
  message: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
  feedback?: string;
  rating?: number;
  createdAt: string;
}

interface DataContextType {
  skills: Skill[];
  profiles: SkillProfile[];
  swapRequests: SwapRequest[];
  createProfile: (profile: Omit<SkillProfile, 'id'>) => void;
  updateProfile: (id: string, updates: Partial<SkillProfile>) => void;
  createSwapRequest: (request: Omit<SwapRequest, 'id' | 'createdAt'>) => void;
  updateSwapRequest: (id: string, updates: Partial<SwapRequest>) => void;
  deleteSwapRequest: (id: string) => void;
  getProfileByUserId: (userId: string) => SkillProfile | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Mock data
const mockSkills: Skill[] = [
  { id: '1', name: 'JavaScript', icon: '💻' },
  { id: '2', name: 'React', icon: '⚛️' },
  { id: '3', name: 'Python', icon: '🐍' },
  { id: '4', name: 'Design', icon: '🎨' },
  { id: '5', name: 'Photography', icon: '📸' },
  { id: '6', name: 'Writing', icon: '✍️' },
  { id: '7', name: 'Marketing', icon: '📈' },
  { id: '8', name: 'Music', icon: '🎵' },
  { id: '9', name: 'Cooking', icon: '👨‍🍳' },
  { id: '10', name: 'Languages', icon: '🗣️' },
  { id: '11', name: 'Data Science', icon: '📊' },
  { id: '12', name: 'Mobile Development', icon: '📱' },
];

const mockProfiles: SkillProfile[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    location: 'San Francisco, CA',
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    skillsOffered: ['JavaScript', 'React'],
    skillsWanted: ['Python', 'Design'],
    availability: 'Weekdays',
    isPublic: true,
    userId: 'user1',
    bio: 'Full-stack developer passionate about creating amazing user experiences.',
    projects: ['E-commerce Platform', 'Social Media App', 'Portfolio Website'],
    events: ['React Conference 2023', 'TechCrunch Disrupt', 'Local Dev Meetup'],
    rating: 4.8
  },
  {
    id: '2',
    name: 'Sarah Chen',
    location: 'New York, NY',
    profilePhoto: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
    skillsOffered: ['Design', 'Photography'],
    skillsWanted: ['JavaScript', 'Marketing'],
    availability: 'Evenings',
    isPublic: true,
    userId: 'user2',
    bio: 'Creative designer with 5+ years experience in digital design and photography.',
    projects: ['Brand Identity Design', 'Wedding Photography', 'Mobile App UI'],
    events: ['Design Week 2023', 'Photography Workshop', 'Creative Summit'],
    rating: 4.9
  },
  {
    id: '3',
    name: 'Mike Rodriguez',
    location: 'Austin, TX',
    profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    skillsOffered: ['Python', 'Data Science'],
    skillsWanted: ['Music', 'Writing'],
    availability: 'Weekends',
    isPublic: true,
    userId: 'user3',
    bio: 'Data scientist and machine learning enthusiast. Love exploring new technologies.',
    projects: ['Predictive Analytics Tool', 'ML Research Project', 'Data Visualization Dashboard'],
    events: ['Data Science Conference', 'AI Workshop', 'Python Meetup'],
    rating: 4.7
  }
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [skills] = useState<Skill[]>(mockSkills);
  const [profiles, setProfiles] = useState<SkillProfile[]>(mockProfiles);
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([]);

  const createProfile = (profile: Omit<SkillProfile, 'id'>) => {
    const newProfile = {
      ...profile,
      id: Math.random().toString(36).substr(2, 9)
    };
    setProfiles(prev => [...prev, newProfile]);
  };

  const updateProfile = (id: string, updates: Partial<SkillProfile>) => {
    setProfiles(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const createSwapRequest = (request: Omit<SwapRequest, 'id' | 'createdAt'>) => {
    const newRequest = {
      ...request,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    setSwapRequests(prev => [...prev, newRequest]);
  };

  const updateSwapRequest = (id: string, updates: Partial<SwapRequest>) => {
    setSwapRequests(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const deleteSwapRequest = (id: string) => {
    setSwapRequests(prev => prev.filter(r => r.id !== id));
  };

  const getProfileByUserId = (userId: string) => {
    return profiles.find(p => p.userId === userId);
  };

  return (
    <DataContext.Provider value={{
      skills,
      profiles,
      swapRequests,
      createProfile,
      updateProfile,
      createSwapRequest,
      updateSwapRequest,
      deleteSwapRequest,
      getProfileByUserId
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};