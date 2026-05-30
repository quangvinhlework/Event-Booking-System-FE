import HomePage from '../screens/Home/HomePage';
import LoginPage from '../screens/Authentication/Login/LoginPage';
import RegisterPage from '../screens/Authentication/Register/RegisterPage';
import EventDetailPage from '../screens/Event/EventDetailPage';
import EventComparisonPage from '../screens/Event/EventComparison';
import OrganizerApplicationPage from '../screens/OrganizerApplication/OrganizerApplicationPage';
import MyAccountPage from '../screens/User/MyAccountPage';
import OrganizerDashboardPage from '../screens/Organizer/Dashboard';
import OrganizerEventsPage from '../screens/Organizer/EventManagementPage';
import OrganizerAnalyticsPage from '../screens/Organizer/AnalyticsPage';
import OrganizerTicketsPage from '../screens/Organizer/TicketManagementPage';
import OrganizerChatPage from '../screens/Organizer/OrganizerChatPage';
import NotFoundPage from '../screens/NotFound/NotFoundPage';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  EVENT_COMPARISON: '/events/comparison',
  EVENT_DETAIL: '/event/:id',
  EVENT_DETAIL_ALT: '/events/:id',
  BECOME_ORGANIZER: '/become-organizer',
  ACCOUNT: '/account',
  ORGANIZER_DASHBOARD: '/organizer/dashboard',
  ORGANIZER_EVENTS: '/organizer/events',
  ORGANIZER_ANALYTICS: '/organizer/analytics',
  ORGANIZER_TICKETS: '/organizer/tickets',
  ORGANIZER_CHAT: '/organizer/chat',
};

/** guard: 'public' | 'protected' | 'organizer' */
export const APP_ROUTES = [
  { path: ROUTES.HOME, page: HomePage, guard: 'public' },
  { path: ROUTES.LOGIN, page: LoginPage, guard: 'public' },
  { path: ROUTES.REGISTER, page: RegisterPage, guard: 'public' },
  { path: ROUTES.EVENT_COMPARISON, page: EventComparisonPage, guard: 'public' },
  { path: ROUTES.EVENT_DETAIL, page: EventDetailPage, guard: 'public' },
  { path: ROUTES.EVENT_DETAIL_ALT, page: EventDetailPage, guard: 'public' },
  { path: ROUTES.BECOME_ORGANIZER, page: OrganizerApplicationPage, guard: 'protected' },
  { path: ROUTES.ACCOUNT, page: MyAccountPage, guard: 'protected' },
  { path: ROUTES.ORGANIZER_DASHBOARD, page: OrganizerDashboardPage, guard: 'organizer' },
  { path: ROUTES.ORGANIZER_EVENTS, page: OrganizerEventsPage, guard: 'organizer' },
  { path: ROUTES.ORGANIZER_ANALYTICS, page: OrganizerAnalyticsPage, guard: 'organizer' },
  { path: ROUTES.ORGANIZER_TICKETS, page: OrganizerTicketsPage, guard: 'organizer' },
  { path: ROUTES.ORGANIZER_CHAT, page: OrganizerChatPage, guard: 'organizer' },
  { path: '*', page: NotFoundPage, guard: 'public' },
];
