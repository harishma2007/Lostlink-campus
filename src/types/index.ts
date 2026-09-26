export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  studentId: string;
  department: string;
  year: string;
  role: UserRole;
  createdAt: string;
}

export type ItemType = 'lost' | 'found';

export type ItemCategory =
  | 'Electronics'
  | 'ID Cards'
  | 'Books'
  | 'Bags'
  | 'Wallets'
  | 'Keys'
  | 'Accessories'
  | 'Clothing'
  | 'Other';

export type ItemStatus = 'Lost' | 'Found' | 'Claim Pending' | 'Verified' | 'Returned';

export interface Item {
  id: string;
  reportId: string;
  type: ItemType;
  name: string;
  category: ItemCategory;
  description: string;
  image: string;
  location: string;
  date: string;
  time: string;
  currentLocation?: string;
  additionalDetails?: string;
  contactPreference?: string;
  status: ItemStatus;
  reporterId: string;
  reporterName: string;
  reporterDepartment: string;
  isSuspicious?: boolean;
  suspiciousReason?: string;
  createdAt: string;
  updatedAt?: string;
}

export type ClaimStatus = 'Pending' | 'Under Review' | 'Approved' | 'Rejected' | 'Completed';

export interface ClaimAnswers {
  uniqueFeature: string;
  contentsInside: string;
  locationLost: string;
  dateLost: string;
}

export interface Claim {
  id: string;
  itemId: string;
  item?: Item;
  claimantId: string;
  claimantName: string;
  claimantEmail: string;
  claimantStudentId: string;
  claimantDepartment: string;
  answers: ClaimAnswers;
  proofImage?: string;
  status: ClaimStatus;
  adminComment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'claim_submitted' | 'claim_update' | 'match_found' | 'item_returned' | 'qr_found' | 'system';
  link?: string;
  read: boolean;
  createdAt: string;
}

export interface QRRecoveryLog {
  id: string;
  finderName?: string;
  finderContact?: string;
  location: string;
  date: string;
  time?: string;
  message: string;
  photo?: string;
  createdAt: string;
}

export interface QRTag {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  itemName: string;
  category: ItemCategory;
  tagCode: string;
  active: boolean;
  createdAt: string;
  recoveries: QRRecoveryLog[];
}

export interface MatchScore {
  item: Item;
  score: number;
  matchReasons: string[];
}

export interface AdminStats {
  totalUsers: number;
  totalStudents: number;
  totalLost: number;
  totalFound: number;
  pendingClaims: number;
  returnedItems: number;
  suspiciousReports: number;
  itemsByCategory: { category: string; count: number }[];
  reportsByLocation: { location: string; count: number }[];
  monthlyRecovery: { month: string; lost: number; found: number; returned: number }[];
}
