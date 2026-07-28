export interface UserProfile {
  id: string;
  name: string;
  username: string;
  avatar: string;
  cover_url?: string;
  bio?: string;
  gender?: string;
  pronouns?: string;
  date_of_birth?: string;

  // Academic
  college: string;
  department?: string;
  branch?: string;
  semester?: number;
  graduation_year?: number;
  student_id_private?: string;

  // Professional
  resume_url?: string;
  portfolio_url?: string;
  github_url?: string;
  linkedin_url?: string;
  website_url?: string;

  interests: string[];
  skills: string[];
  status?: 'online' | 'offline' | 'away';
  xp_points: number;
  daily_streak: number;
  is_ghost_mode: boolean;
  onboarding_completed: boolean;

  // Privacy
  is_profile_public: boolean;
  hide_email: boolean;
  hide_phone: boolean;
  hide_semester: boolean;

  created_at: string;
}

export interface FriendRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  sender?: UserProfile;
}

export interface Community {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  banner_url?: string;
  category: string;
  is_club: boolean;
  member_count: number;
  moderators?: string[];
  pinned_posts?: string[];
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  creator: UserProfile;
  category: 'Sports' | 'Music' | 'Coding' | 'Study' | 'Gaming' | 'Hangout';
  location: string;
  startTime: string;
  maxParticipants: number;
  currentParticipants: number;
  tags: string[];
  conversation_id?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  start_time: string;
  end_time?: string;
  image_url?: string;
  is_verified: boolean;
  qr_code_key?: string;
  organizer_id?: string;
  community_id?: string;
}

export interface Note {
  id: string;
  title: string;
  description: string;
  file_url: string;
  file_type: string;
  department: string;
  semester: number;
  subject: string;
  uploader: UserProfile;
  download_count: number;
}

export interface Message {
  id: string;
  senderId: string;
  text?: string;
  fileUrl?: string;
  fileType?: string;
  voiceUrl?: string;
  timestamp: string;
  reactions?: Record<string, string[]>; // emoji -> userIds[]
  isRead: boolean;
}

export interface Conversation {
  id: string;
  is_group: boolean;
  name?: string;
  image_url?: string;
  participants: UserProfile[];
  lastMessage?: Message;
  unreadCount: number;
  typingIndicator?: string[]; // userIds typing
}

export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price?: number;
  category: string;
  type: 'sell' | 'lost' | 'found';
  status: 'available' | 'sold' | 'resolved';
  image_urls: string[];
  user: UserProfile;
  created_at: string;
}

export interface PlacementListing {
  id: string;
  company_name: string;
  role: string;
  description: string;
  location: string;
  package_info: string;
  deadline: string;
  apply_url: string;
  category: 'internship' | 'full-time';
  created_at: string;
}

export interface CampusNews {
  id: string;
  title: string;
  content: string;
  category: 'holiday' | 'exam' | 'result' | 'circular' | 'sports' | 'festival';
  image_url?: string;
  created_at: string;
}

export interface ScheduleItem {
  id: string;
  title: string;
  time: string;
  location: string;
  type: 'class' | 'event' | 'meeting';
  color: string;
}

export interface MeetSpot {
  id: string;
  name: string;
  description: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  liveCount: number;
}

export interface Club {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  banner_url?: string;
  category: string;
  membersCount: number;
}
