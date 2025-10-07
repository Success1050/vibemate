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

export interface PricingSettings {
  pricePerHour: number;
  serviceFee: number;
  minimumBookingHours: number;
  maximumBookingHours: number;
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
