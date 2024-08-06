import { Injectable } from '@angular/core';

export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  function?: any;
  children?: Navigation[];
}

export interface Navigation extends NavigationItem {
  children?: NavigationItem[];
}

const NavigationItems = [
  {
    id: 'navigation',
    title: '',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'item',
        url: '/dashboard',
        icon: 'feather icon-home',
        classes: 'nav-item'
      },
      {
        id: 'user',
        title: 'Users',
        type: 'item',
        url: '/users',
        icon: 'feather icon-user',
        classes: 'nav-item'
      },
      {
        id: 'bookings',
        title: 'Bookings',
        type: 'item',
        url: '/bookings',
        icon: 'feather icon-user',
        classes: 'nav-item'
      },
      {
        id: 'services',
        title: 'Services',
        type: 'item',
        url: '/services',
        icon: 'feather icon-user',
        classes: 'nav-item'
      },
      {
        id: 'manufacturer',
        title: 'Manufacturer',
        type: 'item',
        url: '/manufacturers',
        icon: 'feather icon-user',
        classes: 'nav-item'
      },
      {
        id: 'model',
        title: 'Model',
        type: 'item',
        url: '/models',
        icon: 'feather icon-user',
        classes: 'nav-item'
      },
      {
        id: 'engine',
        title: 'Engine',
        type: 'item',
        url: '/engines',
        icon: 'feather icon-user',
        classes: 'nav-item'
      }
    ]
  },
];

@Injectable()
export class NavigationItem {
  get() {
    return NavigationItems;
  }
}
