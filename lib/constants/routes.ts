export const ROUTES = {
  // Auth
  LOGIN: '/login',
  REGISTER: '/register',
  LOGOUT: '/logout',

  // Main modules
  DASHBOARD: '/dashboard',
  MEMBERS: '/members',
  FINANCIAL: '/financial',
  INVOICES: '/financial/invoices',
  DOCUMENTS: '/documents',
  ANNOUNCEMENTS: '/announcements',
  SETTINGS: '/settings',

  // Admin/Settings sub-pages
  USERS: '/settings/users',
  ROLES: '/settings/roles',
  PREFERENCES: '/settings/preferences',
  INTEGRATIONS: '/settings/integrations',
  PROFILE: '/settings/profile',

  // Not Found
  NOT_FOUND: '/404',
  UNAUTHORIZED: '/401',
};

export const PUBLIC_ROUTES = [ROUTES.LOGIN, ROUTES.REGISTER];

export const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.MEMBERS,
  ROUTES.FINANCIAL,
  ROUTES.DOCUMENTS,
  ROUTES.ANNOUNCEMENTS,
  ROUTES.SETTINGS,
];
