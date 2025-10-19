// Notification Templates for RentSight PWA

export interface NotificationTemplate {
  title: string;
  body: string;
  icon: string;
  badge: string;
  tag: string;
  data: Record<string, unknown>;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
  requireInteraction?: boolean;
  silent?: boolean;
}

export interface NotificationContext {
  propertyName?: string;
  amount?: number;
  currency?: string;
  date?: string;
  reportName?: string;
  userName?: string;
}

export class NotificationTemplates {
  private static readonly baseIcon = '/icons/icon-192x192.png';
  private static readonly baseBadge = '/icons/icon-72x72.png';

  /**
   * Property update notification
   */
  static propertyUpdate(context: NotificationContext = {}): NotificationTemplate {
    return {
      title: 'Property Updated',
      body: context.propertyName
        ? `${context.propertyName} has been updated`
        : 'A property in your portfolio has been updated',
      icon: this.baseIcon,
      badge: this.baseBadge,
      tag: 'property-update',
      data: {
        type: 'propertyUpdate',
        url: '/properties',
        propertyName: context.propertyName,
      },
      actions: [
        {
          action: 'view',
          title: 'View Property',
        },
      ],
    };
  }

  /**
   * New property added notification
   */
  static newProperty(context: NotificationContext = {}): NotificationTemplate {
    return {
      title: 'New Property Added',
      body: context.propertyName
        ? `New property "${context.propertyName}" has been added to your portfolio`
        : 'A new property has been added to your portfolio',
      icon: this.baseIcon,
      badge: this.baseBadge,
      tag: 'new-property',
      data: {
        type: 'newProperty',
        url: '/properties',
        propertyName: context.propertyName,
      },
      actions: [
        {
          action: 'view',
          title: 'View Properties',
        },
      ],
    };
  }

  /**
   * Rent payment reminder
   */
  static rentReminder(context: NotificationContext = {}): NotificationTemplate {
    return {
      title: 'Rent Payment Reminder',
      body: context.propertyName
        ? `Rent payment for ${context.propertyName} is due ${context.date || 'soon'}`
        : 'You have upcoming rent payments due',
      icon: this.baseIcon,
      badge: this.baseBadge,
      tag: 'rent-reminder',
      data: {
        type: 'rentReminder',
        url: '/dashboard',
        propertyName: context.propertyName,
        amount: context.amount,
        date: context.date,
      },
      actions: [
        {
          action: 'view',
          title: 'View Dashboard',
        },
      ],
    };
  }

  /**
   * High expense alert
   */
  static expenseAlert(context: NotificationContext = {}): NotificationTemplate {
    return {
      title: 'High Expense Alert',
      body: context.amount
        ? `High expense of ${context.currency || '$'}${context.amount} detected`
        : 'High expense detected in your portfolio',
      icon: this.baseIcon,
      badge: this.baseBadge,
      tag: 'expense-alert',
      data: {
        type: 'expenseAlert',
        url: '/expense-entries',
        amount: context.amount,
        currency: context.currency,
      },
      requireInteraction: true,
      actions: [
        {
          action: 'view',
          title: 'View Expenses',
        },
      ],
    };
  }

  /**
   * Budget warning
   */
  static budgetWarning(context: NotificationContext = {}): NotificationTemplate {
    return {
      title: 'Budget Warning',
      body: context.propertyName
        ? `${context.propertyName} expenses are approaching budget limit`
        : 'Expenses are approaching budget limit',
      icon: this.baseIcon,
      badge: this.baseBadge,
      tag: 'budget-warning',
      data: {
        type: 'budgetWarning',
        url: '/dashboard',
        propertyName: context.propertyName,
      },
      requireInteraction: true,
      actions: [
        {
          action: 'view',
          title: 'View Dashboard',
        },
      ],
    };
  }

  /**
   * Report ready notification
   */
  static reportReady(context: NotificationContext = {}): NotificationTemplate {
    return {
      title: 'Report Ready',
      body: context.reportName
        ? `Your ${context.reportName} report is ready for download`
        : 'Your monthly report is ready for download',
      icon: this.baseIcon,
      badge: this.baseBadge,
      tag: 'report-ready',
      data: {
        type: 'reportReady',
        url: '/reports',
        reportName: context.reportName,
      },
      actions: [
        {
          action: 'view',
          title: 'Download Report',
        },
      ],
    };
  }

  /**
   * System update notification
   */
  static systemUpdate(context: NotificationContext = {}): NotificationTemplate {
    return {
      title: 'RentSight Updated',
      body: 'RentSight has been updated with new features and improvements',
      icon: this.baseIcon,
      badge: this.baseBadge,
      tag: 'system-update',
      data: {
        type: 'systemUpdate',
        url: '/about',
      },
      actions: [
        {
          action: 'view',
          title: 'Learn More',
        },
      ],
    };
  }

  /**
   * Maintenance notification
   */
  static maintenance(context: NotificationContext = {}): NotificationTemplate {
    return {
      title: 'Scheduled Maintenance',
      body: context.date
        ? `RentSight will be under maintenance on ${context.date}`
        : 'RentSight will be under maintenance soon',
      icon: this.baseIcon,
      badge: this.baseBadge,
      tag: 'maintenance',
      data: {
        type: 'maintenance',
        url: '/about',
        date: context.date,
      },
      requireInteraction: true,
      actions: [
        {
          action: 'view',
          title: 'Learn More',
        },
      ],
    };
  }

  /**
   * Welcome notification for new users
   */
  static welcome(context: NotificationContext = {}): NotificationTemplate {
    return {
      title: 'Welcome to RentSight!',
      body: context.userName
        ? `Welcome ${context.userName}! Start by adding your first property.`
        : 'Welcome to RentSight! Start by adding your first property.',
      icon: this.baseIcon,
      badge: this.baseBadge,
      tag: 'welcome',
      data: {
        type: 'welcome',
        url: '/properties',
        userName: context.userName,
      },
      actions: [
        {
          action: 'view',
          title: 'Get Started',
        },
      ],
    };
  }

  /**
   * Achievement notification
   */
  static achievement(context: NotificationContext = {}): NotificationTemplate {
    return {
      title: 'Achievement Unlocked!',
      body: context.propertyName
        ? `You've reached a milestone with ${context.propertyName}`
        : "You've reached a new milestone!",
      icon: this.baseIcon,
      badge: this.baseBadge,
      tag: 'achievement',
      data: {
        type: 'achievement',
        url: '/dashboard',
        propertyName: context.propertyName,
      },
      actions: [
        {
          action: 'view',
          title: 'View Achievement',
        },
      ],
    };
  }

  /**
   * Get template by type
   */
  static getTemplate(type: string, context: NotificationContext = {}): NotificationTemplate {
    switch (type) {
      case 'propertyUpdate':
        return this.propertyUpdate(context);
      case 'newProperty':
        return this.newProperty(context);
      case 'rentReminder':
        return this.rentReminder(context);
      case 'expenseAlert':
        return this.expenseAlert(context);
      case 'budgetWarning':
        return this.budgetWarning(context);
      case 'reportReady':
        return this.reportReady(context);
      case 'systemUpdate':
        return this.systemUpdate(context);
      case 'maintenance':
        return this.maintenance(context);
      case 'welcome':
        return this.welcome(context);
      case 'achievement':
        return this.achievement(context);
      default:
        return this.propertyUpdate(context);
    }
  }

  /**
   * Get all available notification types
   */
  static getAvailableTypes(): string[] {
    return [
      'propertyUpdate',
      'newProperty',
      'rentReminder',
      'expenseAlert',
      'budgetWarning',
      'reportReady',
      'systemUpdate',
      'maintenance',
      'welcome',
      'achievement',
    ];
  }

  /**
   * Validate notification template
   */
  static validateTemplate(template: NotificationTemplate): boolean {
    return !!(template.title && template.body && template.icon && template.tag && template.data);
  }
}

// Export convenience functions
export const getNotificationTemplate = (type: string, context?: NotificationContext) =>
  NotificationTemplates.getTemplate(type, context);

export const getAvailableNotificationTypes = () => NotificationTemplates.getAvailableTypes();

export const validateNotificationTemplate = (template: NotificationTemplate) =>
  NotificationTemplates.validateTemplate(template);
