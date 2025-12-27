import { ImageSourcePropType } from "react-native";

export interface Notification {
  id: string;
  type: "booking" | "payment" | "message" | "review";
  title: string;
  message: string;
  time: string;
  read: boolean;
  avatar?: string;
}

export interface ProfileData {
  name: string;
  nickname: string;
  description: string;
  // profileImage: any;
  age: number;
  location: string;
  specificAddress: string;
  country: string;
  phone: string;
  email: string;
  languages: string[];
  isVerified: boolean;
  emergencyContact: string;
}

export interface MediaGallery {
  mainImages: any[];
  videoSource: string;
}

export interface PrivacySettings {
  showLocation: true;
  showAge: true;
  showPhone: false;
}

export type EarningsData = {
  thisMonth: number;
  lastMonth: number;
  totalBookings: number;
  pendingBookings: number;
  completedBookings: number;
};

export type OSBookingOrder = {
  id: string;
  clientName: string;
  clientImage: ImageSourcePropType; // because React Native <Image> needs ImageSourcePropType
  date: string; // ISO string like "2025-10-02"
  time: string; // e.g. "2:30 PM"
  location: string;
  amount: number;
  duration: number; // hours
  status: "pending" | "accepted" | "completed" | "cancelled";
};

export interface Transaction {
  id: string;
  type: "credit" | "debit";
  amount: number;
  description: string;
  date: string;
  status: "completed" | "pending" | "failed";
}

export interface TimeSlot {
  id: number;
  start: string;
  end: string;
  isAvailable?: boolean;
}

export interface DateTimeSlot {
  date: string;
  timeSlots: TimeSlot[]; // ✅ fixed to array
  isAvailable?: boolean;
}

export interface CalendarPickerProps {
  visible: boolean;
  onClose: () => void;
  onDateTimeSelect: (date: string, time: TimeSlot) => void;
  selectedDate?: string;
  selectedTime?: TimeSlot;
}

export interface Ospricesettings {
  pricePerNight: number;
}

export interface ServiceProvider {
  id: number;
  name: string;
  image: string;
  description: string;
  rating: number;
  reviews: number;
  price: number;
  availability: "available" | "busy" | "offline";
  category?: string;
  gender: "male" | "female" | "other";
  featured: boolean;
  trending: boolean;
  verified: boolean;
  responseTime: string;
  distance: string;
  tags: string[];
}

export interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  avatar: string;
  online: boolean;
  role: "provider" | "user";
}

export interface Message {
  id: string;
  senderId: string; // "me" or other user id
  text: string;
  timestamp: string;
  type: "text" | "image";
}

export interface availability_slots {
  available_date: string;
  timeSlot: TimeSlot[];
}

export interface OsProfileType{
  bio: string;
  featured: boolean;
  full_name: string;
  image_url: string[]; // ✅ backend sends string[]
  videos_urls: string[]; // ✅ backend sends string[]
  is_available: boolean;
  nickname: string;
}

export interface AvailabilitySlot {
  id?: number;
  profile_id?: number;
  available_date?: string;
  time_slots?: {
    start?: string;
    end?: string;
    is_available?: boolean;
    is_booked?: boolean;
  }[];
  instant_booking?: boolean;
}

export interface PricingSettings {
  price_per_night: number;
}

export interface OsProviders {
  id: number;
  user_id: string;
  email: string;
  role: string;
  osprofile: OsProfileType; // ✅ match backend key
  pricing_settings: PricingSettings;
  availability_slots: AvailabilitySlot[];
}

export interface ProviderCard {
  id: number;
  name: string;
  bio: string;
  image: { uri: string } | null; //
  is_available: boolean;
  featured: boolean;
  price_per_night: number;
}

type BookerProfile = {
  full_name?: string;
  nickname?: string;
  bio?: string;
  age?: number;
  profile_image_url?: string;
};

export type BookingItem = {
  id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  night_rate: number;
  total_amount: number;
  status: string;
  created_at: string;
  os_id: number;
  booker_id?: {
    bookerprofile?: BookerProfile[];
  };
};
