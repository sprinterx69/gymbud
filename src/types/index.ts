export interface Gym {
  id: string;
  name: string;
  city: string;
}

export interface ScheduleEntry {
  day: string;
  time: string;
  focus: string | null;
}

export interface Host {
  id: string;
  name: string;
  age: number;
  avatar: string | null;
  initials: string;
  bio: string;
  workoutType: string;
  gym: Gym;
  experience: string;
  schedule: ScheduleEntry[];
  pricePerSession: number;
  weeklyPrice: number;
  rating: number;
  reviewCount: number;
  verified: boolean;
  tags: string[];
  joinedDate: string;
  sessionsHosted: number;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
}

export type BookingStatus = 'confirmed' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  hostId: string;
  date: string;
  day: string;
  time: string;
  focus: string;
  status: BookingStatus;
  price: number;
}

export interface UserProfile {
  name: string;
  age: number;
  role: 'client' | 'host';
  gym: Gym | null;
  workoutType: string | null;
  bio: string;
  initials: string;
  createdAt: string;
}

export type MainTabParamList = {
  Browse: undefined;
  Sessions: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Welcome: undefined;
  RoleSelect: undefined;
  ProfileSetup: { role: 'client' | 'host' };
  MainTabs: { screen?: keyof MainTabParamList } | undefined;
  HostProfile: { hostId: string };
};
