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
        icon: 'fas fa-home',
        classes: 'nav-item'
      },
      {
        id: 'user',
        title: 'Users',
        type: 'item',
        url: '/users',
        icon: 'far fa-user',
        classes: 'nav-item'
      },
      {
        id: 'bookings',
        title: 'Bookings',
        type: 'item',
        url: '/bookings',
        icon: 'far fa-calendar-alt',
        classes: 'nav-item'
      },
      {
        id: 'services',
        title: 'Services',
        type: 'item',
        url: '/services',
        icon: 'fas fa-wrench',
        classes: 'nav-item'
      },
      {
        id: 'slots',
        title: 'Slots',
        type: 'item',
        url: '/slots',
        icon: 'far fa-calendar-alt',
        classes: 'nav-item'
      },
      // {
      //   id: 'manufacturer',
      //   title: 'Manufacturer',
      //   type: 'item',
      //   url: '/manufacturers',
      //   icon: 'fas fa-industry',
      //   classes: 'nav-item'
      // },
      // {
      //   id: 'model',
      //   title: 'Model',
      //   type: 'item',
      //   url: '/models',
      //   icon: 'fas fa-car',
      //   classes: 'nav-item'
      // },
      // {
      //   id: 'engine',
      //   title: 'Engine',
      //   type: 'item',
      //   url: '/engines',
      //   icon: 'fas fa-car-battery',
      //   classes: 'nav-item'
      // }
    ]
  },
];

@Injectable()
export class NavigationItem {
  get() {
    return NavigationItems;
  }
}
