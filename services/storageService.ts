
import { User, CampaignResult } from '../types';

const USERS_KEY = 'socialmuse_users';
const CURRENT_USER_KEY = 'socialmuse_current_user';
const CAMPAIGNS_KEY = 'socialmuse_campaigns';

export const storageService = {
  // Auth
  getUsers: (): User[] => JSON.parse(localStorage.getItem(USERS_KEY) || '[]'),
  getCurrentUser: (): User | null => JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || 'null'),
  setCurrentUser: (user: User | null) => localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user)),
  saveUser: (user: User) => {
    const users = storageService.getUsers();
    users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  // Campaigns
  saveCampaign: (campaign: CampaignResult) => {
    const campaigns = JSON.parse(localStorage.getItem(CAMPAIGNS_KEY) || '[]') as CampaignResult[];
    campaigns.unshift(campaign);
    localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(campaigns));
  },
  getCampaigns: (userId: string | null): CampaignResult[] => {
    const campaigns = JSON.parse(localStorage.getItem(CAMPAIGNS_KEY) || '[]') as CampaignResult[];
    return userId ? campaigns.filter(c => c.userId === userId) : campaigns.filter(c => !c.userId);
  },
  deleteCampaign: (id: string) => {
    const campaigns = JSON.parse(localStorage.getItem(CAMPAIGNS_KEY) || '[]') as CampaignResult[];
    const filtered = campaigns.filter(c => c.id !== id);
    localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(filtered));
  }
};
