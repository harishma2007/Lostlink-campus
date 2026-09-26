import {
  User,
  Item,
  Claim,
  NotificationItem,
  QRTag,
  AdminStats,
  MatchScore,
  ItemCategory,
  ItemType,
  ItemStatus,
  ClaimStatus,
} from '../types/index';

const TOKEN_KEY = 'lostlink_token';

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'An unexpected server error occurred.');
  }

  return data as T;
}

export const api = {
  // Auth
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const res = await request<{ user: User; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setToken(res.token);
    return res;
  },

  async register(formData: {
    name: string;
    email: string;
    studentId: string;
    department: string;
    year: string;
    password: string;
    confirmPassword: string;
  }): Promise<{ user: User; token: string }> {
    const res = await request<{ user: User; token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
    setToken(res.token);
    return res;
  },

  async getMe(): Promise<{ user: User }> {
    return request<{ user: User }>('/api/auth/me');
  },

  async updateProfile(updates: Partial<User>): Promise<{ user: User }> {
    return request<{ user: User }>('/api/auth/update-profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  logout(): void {
    removeToken();
  },

  // Items
  async getItems(params: {
    type?: ItemType | string;
    category?: string;
    status?: string;
    location?: string;
    search?: string;
    reporterId?: string;
  } = {}): Promise<{ items: Item[] }> {
    const query = new URLSearchParams();
    if (params.type) query.append('type', params.type);
    if (params.category) query.append('category', params.category);
    if (params.status) query.append('status', params.status);
    if (params.location) query.append('location', params.location);
    if (params.search) query.append('search', params.search);
    if (params.reporterId) query.append('reporterId', params.reporterId);

    const qs = query.toString();
    return request<{ items: Item[] }>(`/api/items${qs ? `?${qs}` : ''}`);
  },

  async getRecentItems(): Promise<{ recentLost: Item[]; recentFound: Item[] }> {
    return request<{ recentLost: Item[]; recentFound: Item[] }>('/api/items/recent');
  },

  async getItem(id: string): Promise<{ item: Item }> {
    return request<{ item: Item }>(`/api/items/${id}`);
  },

  async getItemMatches(id: string): Promise<{ matches: MatchScore[] }> {
    return request<{ matches: MatchScore[] }>(`/api/items/${id}/matches`);
  },

  async createItem(data: {
    type: ItemType;
    name: string;
    category: ItemCategory;
    description: string;
    image?: string;
    location: string;
    date: string;
    time: string;
    currentLocation?: string;
    additionalDetails?: string;
    contactPreference?: string;
  }): Promise<{ item: Item; matchedCount: number; matches: MatchScore[] }> {
    return request<{ item: Item; matchedCount: number; matches: MatchScore[] }>('/api/items', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateItem(id: string, updates: Partial<Item>): Promise<{ item: Item }> {
    return request<{ item: Item }>(`/api/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async deleteItem(id: string): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(`/api/items/${id}`, {
      method: 'DELETE',
    });
  },

  async flagSuspicious(id: string, reason: string): Promise<{ success: boolean; item: Item }> {
    return request<{ success: boolean; item: Item }>(`/api/items/${id}/flag-suspicious`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },

  // Claims
  async getClaims(): Promise<{ claims: Claim[] }> {
    return request<{ claims: Claim[] }>('/api/claims');
  },

  async submitClaim(data: {
    itemId: string;
    answers: {
      uniqueFeature: string;
      contentsInside: string;
      locationLost: string;
      dateLost: string;
    };
    proofImage?: string;
  }): Promise<{ claim: Claim }> {
    return request<{ claim: Claim }>('/api/claims', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateClaimStatus(
    id: string,
    status: ClaimStatus,
    adminComment?: string
  ): Promise<{ claim: Claim }> {
    return request<{ claim: Claim }>(`/api/claims/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, adminComment }),
    });
  },

  // QR Tags
  async getQRTags(): Promise<{ tags: QRTag[] }> {
    return request<{ tags: QRTag[] }>('/api/qr-tags');
  },

  async createQRTag(data: { itemName: string; category: ItemCategory }): Promise<{ tag: QRTag }> {
    return request<{ tag: QRTag }>('/api/qr-tags', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async lookupQRTag(tagCode: string): Promise<{ tag: { tagCode: string; itemName: string; category: ItemCategory; active: boolean } }> {
    return request<{ tag: { tagCode: string; itemName: string; category: ItemCategory; active: boolean } }>(
      `/api/qr-tags/lookup/${encodeURIComponent(tagCode)}`
    );
  },

  async recoverQRTag(
    tagCode: string,
    data: {
      finderName?: string;
      finderContact?: string;
      location: string;
      date?: string;
      time?: string;
      message: string;
      photo?: string;
    }
  ): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(
      `/api/qr-tags/recover/${encodeURIComponent(tagCode)}`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  },

  // Notifications
  async getNotifications(): Promise<{ notifications: NotificationItem[]; unreadCount: number }> {
    return request<{ notifications: NotificationItem[]; unreadCount: number }>('/api/notifications');
  },

  async markNotificationRead(id: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>(`/api/notifications/${id}/read`, {
      method: 'PUT',
    });
  },

  async markAllNotificationsRead(): Promise<{ success: boolean }> {
    return request<{ success: boolean }>('/api/notifications/read-all', {
      method: 'PUT',
    });
  },

  // Admin
  async getAdminStats(): Promise<{ stats: AdminStats }> {
    return request<{ stats: AdminStats }>('/api/admin/stats');
  },

  async getAdminUsers(): Promise<{ users: User[] }> {
    return request<{ users: User[] }>('/api/admin/users');
  },

  async deleteUser(id: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>(`/api/admin/users/${id}`, {
      method: 'DELETE',
    });
  },
};
