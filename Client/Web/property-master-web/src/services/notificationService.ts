// src/services/notificationService.ts
import api from './api';

export interface NotificationSettings {
  leaseExpirationReminders: boolean;
  rentDueReminders: boolean;
  maintenanceReminders: boolean;
  advanceNoticeDays: number;
}

export interface EmailTemplate {
  type: 'LEASE_EXPIRATION' | 'RENT_DUE' | 'MAINTENANCE';
  subject: string;
  body: string;
}

const NotificationService = {
  // Get user's notification settings
  getNotificationSettings: async (): Promise<NotificationSettings> => {
    const response = await api.get('/notifications/settings');
    return response.data;
  },

  // Update user's notification settings
  updateNotificationSettings: async (settings: NotificationSettings): Promise<NotificationSettings> => {
    const response = await api.put('/notifications/settings', settings);
    return response.data;
  },

  // Send test notification
  sendTestNotification: async (email: string, type: string): Promise<boolean> => {
    const response = await api.post('/notifications/test', { email, type });
    return response.data.success;
  },

  // Get email templates
  getEmailTemplates: async (): Promise<EmailTemplate[]> => {
    const response = await api.get('/notifications/templates');
    return response.data;
  },

  // Update email template
  updateEmailTemplate: async (templateId: string, template: EmailTemplate): Promise<EmailTemplate> => {
    const response = await api.put(`/notifications/templates/${templateId}`, template);
    return response.data;
  }
};

export default NotificationService;