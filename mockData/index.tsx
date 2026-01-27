import {
  Chat,
  Message,
  Notification,
  ServiceProvider,
  Transaction,
} from "../tsx-types";

export const notifications: Notification[] = [
  {
    id: "1",
    type: "booking",
    title: "New Service Request",
    message: "John Doe requested your plumbing service for tomorrow at 2 PM",
    time: "5 min ago",
    read: false,
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
  },
  {
    id: "2",
    type: "payment",
    title: "Payment Received",
    message: "You received ₦150 for electrical work completion",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "3",
    type: "review",
    title: "New Review",
    message: "Sarah left you a 5-star review for your cleaning service",
    time: "2 hours ago",
    read: true,
  },
  {
    id: "4",
    type: "message",
    title: "New Message",
    message: "Mike sent you a message about the garden maintenance",
    time: "3 hours ago",
    read: true,
  },
];

export const transactions: Transaction[] = [
  {
    id: "1",
    type: "credit",
    amount: 150,
    description: "Electrical repair service - John Smith",
    date: "2024-01-15",
    status: "completed",
  },
  {
    id: "2",
    type: "debit",
    amount: 25,
    description: "Platform fee",
    date: "2024-01-15",
    status: "completed",
  },
  {
    id: "3",
    type: "credit",
    amount: 200,
    description: "Plumbing installation - Emma Wilson",
    date: "2024-01-14",
    status: "pending",
  },
  {
    id: "4",
    type: "credit",
    amount: 80,
    description: "House cleaning - David Brown",
    date: "2024-01-13",
    status: "completed",
  },
];

export const chats: Chat[] = [
  {
    id: "1",
    name: "John Smith",
    lastMessage: "When can you start the electrical work?",
    timestamp: "2 min ago",
    unread: 2,
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
    online: true,
    role: "user",
  },
  {
    id: "2",
    name: "Emma Wilson",
    lastMessage: "Thank you for the excellent plumbing service!",
    timestamp: "1 hour ago",
    unread: 0,
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face",
    online: false,
    role: "user",
  },
  {
    id: "3",
    name: "David Brown",
    lastMessage: "The cleaning was perfect, highly recommend!",
    timestamp: "3 hours ago",
    unread: 0,
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    online: true,
    role: "user",
  },
];

export const chatMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "1",
      senderId: "john",
      text: "Hi, I need help with electrical wiring in my kitchen.",
      timestamp: "10:30 AM",
      type: "text",
    },
    {
      id: "2",
      senderId: "me",
      text: "I can help you with that! What specific issues are you experiencing?",
      timestamp: "10:32 AM",
      type: "text",
    },
    {
      id: "3",
      senderId: "john",
      text: "When can you start the electrical work?",
      timestamp: "10:35 AM",
      type: "text",
    },
  ],
};

// mockData.ts
import { OSBookingOrder } from "@/tsx-types";

export const recentBookings: OSBookingOrder[] = [
  {
    id: "1",
    clientName: "James Carter",
    clientImage: require("@/assets/images/2.jpg"),
    date: "2025-10-01",
    time: "10:30 AM",
    location: "Lagos, Nigeria",
    amount: 7500,
    duration: 2,
    status: "pending",
  },
  {
    id: "2",
    clientName: "Amelia Brown",
    clientImage: require("@/assets/images/3.jpg"),
    date: "2025-09-30",
    time: "3:00 PM",
    location: "Abuja, Nigeria",
    amount: 12000,
    duration: 3,
    status: "accepted",
  },
  {
    id: "3",
    clientName: "Michael Johnson",
    clientImage: require("@/assets/images/4.jpg"),
    date: "2025-09-28",
    time: "1:00 PM",
    location: "Port Harcourt, Nigeria",
    amount: 5400,
    duration: 1,
    status: "completed",
  },
  {
    id: "4",
    clientName: "Sophia Williams",
    clientImage: require("@/assets/images/5.jpg"),
    date: "2025-09-25",
    time: "11:00 AM",
    location: "Enugu, Nigeria",
    amount: 8500,
    duration: 2,
    status: "cancelled",
  },
];

export const providers: ServiceProvider[] = [
  {
    id: 1,
    name: "Sarah Mitchell",
    image: require("../assets/images/1.jpg"),
    description: "OS wey no get yansh",
    rating: 4.9,
    reviews: 124,
    price: 120,
    availability: "available",
    gender: "female",
    featured: true,
    trending: true,
    verified: true,
    responseTime: "~10 mins",
    distance: "1.2 km",
    tags: ["Massage", "Wellness", "Deep Tissue"],
  },
  {
    id: 2,
    name: "Marcus Chen",
    image: require("../assets/images/2.jpg"),
    description: "My name is Faith onyemachi",
    rating: 4.8,
    reviews: 89,
    price: 120,
    availability: "available",
    gender: "male",
    featured: true,
    trending: false,
    verified: true,
    responseTime: "~5 mins",
    distance: "2.1 km",
    tags: ["Fitness", "Strength", "Transformation"],
  },
  {
    id: 3,
    name: "Clara mara",
    image: require("../assets/images/3.jpg"),
    description: "My name is Faith Clara",
    rating: 4.8,
    reviews: 89,
    price: 120,
    availability: "available",
    gender: "male",
    featured: false,
    trending: false,
    verified: true,
    responseTime: "~5 mins",
    distance: "2.1 km",
    tags: ["Fitness", "Strength", "Transformation"],
  },
];

export const userData = [
  {
    id: 1,
    profile: {
      name: "Sarah Mitchell",
      subtitle: "Number 4 baddie in town",
      description:
        "I am a very big baddie with lots of properties, no looseguard ooo, better book me on time",
      rating: 4.9,
      reviewCount: 127,
      isVerified: true,
      isSuperhost: true,
      profileImage: require("../assets/images/1.jpg"),
    },
    media: {
      mainImages: [
        require("../assets/images/1.jpg"),
        require("../assets/images/2.jpg"),
        require("../assets/images/3.jpg"),
        require("../assets/images/4.jpg"),
        require("../assets/images/5.jpg"),
      ],
      videoSource:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      galleryImages: [
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=400&fit=crop",
      ],
    },
    pricing: {
      pricePerHour: 120, // N120,000
      serviceFee: 15,
      nights: 2, // Default nights for calculation
    },
    verification: {
      identityVerified: true,
      phoneVerified: true,
      emailVerified: true,
    },
  },
  {
    id: 2,
    profile: {
      name: "mary santa",
      subtitle: "Number 4 ogbonte in town",
      description:
        "I am a very big baddie with lots of properties, no looseguard ooo, better book me on time",
      rating: 4.9,
      reviewCount: 127,
      isVerified: true,
      isSuperhost: true,
      profileImage: require("../assets/images/1.jpg"),
    },
    media: {
      mainImages: [
        require("../assets/images/1.jpg"),
        require("../assets/images/2.jpg"),
        require("../assets/images/3.jpg"),
        require("../assets/images/4.jpg"),
        require("../assets/images/5.jpg"),
      ],
      videoSource:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      galleryImages: [
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=400&fit=crop",
      ],
    },
    pricing: {
      pricePerHour: 120, // N120,000
      serviceFee: 15,
      nights: 2, // Default nights for calculation
    },
    booking: {
      defaultGuests: "2 adults",
      maxGuests: 8,
      minNights: 1,
      maxNights: 30,
    },
    verification: {
      identityVerified: true,
      phoneVerified: true,
      emailVerified: true,
    },
  },
];

export const users = [
  {
    id: "4c9200c6-e178-4569-8777-cb64068febf8",
    name: "Franca",
    emoji: "💛",
    rate: "60/min",
    status: "offline",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&h=400&fit=crop&crop=face",
    hasRecharge: false,
  },
  {
    id: 2,
    name: "Love Love",
    rate: "60/min",
    status: "online",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&h=400&fit=crop&crop=face",
    hasRecharge: false,
  },
  {
    id: 3,
    name: "sweetchery",
    rate: "60/min",
    status: "offline",
    image:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=300&h=400&fit=crop&crop=face",
    hasRecharge: true,
  },
  {
    id: 4,
    name: "Tyler",
    rate: "60/min",
    status: "online",
    image:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=300&h=400&fit=crop&crop=face",
    hasRecharge: false,
  },
  {
    id: 5,
    name: "User5",
    rate: "60/min",
    status: "online",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=400&fit=crop&crop=face",
    hasRecharge: false,
  },
  {
    id: 6,
    name: "User6",
    rate: "60/min",
    status: "online",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=face",
    hasRecharge: false,
  },
];
