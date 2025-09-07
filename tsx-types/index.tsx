export interface Notification {
  id: string;
  type: "booking" | "payment" | "message" | "review";
  title: string;
  message: string;
  time: string;
  read: boolean;
  avatar?: string;
}

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
}

export interface CalendarPickerProps {
  visible: boolean;
  onClose: () => void;
  onDateTimeSelect: (date: string, time: TimeSlot) => void;
  selectedDate?: string;
  selectedTime?: TimeSlot;
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
  category: string;
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
