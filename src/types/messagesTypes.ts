export type ConversationModule = 'rentals' | 'jobs' | 'services' | 'system';

export interface ChatMessage {
  id: string;
  sender: 'me' | 'them' | 'system';
  text: string;
  time: string;
  timestamp?: number;
  type?: 'text' | 'location' | 'contact' | 'image' | 'file' | 'job_application';
  isRead?: boolean;
  senderId?: string;
  senderRole?: string;
  isStaffSender?: boolean;
}

export interface ConversationParticipant {
  id: string;
  name: string;
  avatarUrl?: string;
  isVerified?: boolean;
  verified?: boolean;
  isOnline?: boolean;
  lastSeen?: string;
  memberSince?: string;
  location?: string;
  role?: string;
  phone?: string;
  isStaff?: boolean;
  isVerifiedAdmin?: boolean;
  avatarInitials?: string;
}

export interface ConversationListing {
  id: string;
  title: string;
  price?: string;
  location?: string;
  imageUrl?: string;
  badge?: string;
  badgeColor?: string;
  module?: ConversationModule;
}

export interface Conversation {
  id: string;
  type?: 'chat' | 'job_application';
  isJobApplication?: boolean;
  module: ConversationModule;
  badgeText?: string;
  badgeColor?: string;
  participant: ConversationParticipant;
  listing: ConversationListing;
  lastMessage: string;
  lastMessageTime: string;
  lastMessageTimestamp?: number;
  unreadCount: number;
  isPinned?: boolean;
  isMuted?: boolean;
  quickReplies?: string[];
  messages: ChatMessage[];
}
