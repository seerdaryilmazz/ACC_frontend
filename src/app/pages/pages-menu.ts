import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'DASHBOARD',
    icon: 'home-outline',
    link: '/pages/dashboard',
    home: true,
  },
  {
    title: 'CUSTOMERS',
    icon: 'people-outline',
    link: '/pages/customers/customers-page',
  },
  {
    title: 'TASKS',
    icon: 'checkmark-square-outline',
    link: '/pages/task/task-page',
  },
  {
    title: 'ORDERS',
    icon: 'navigation-2-outline',
    link: '/pages/orders/orders-page',
  },
  {
    title: 'CALENDAR',
    icon: 'calendar-outline',
    link: '/pages/calendar',
  },
  {
    title: 'DOCUMENTS',
    icon: 'file-text-outline',
    link: '/pages/documents',
  },
];
