import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { RouterProvider, createRouter, createRootRoute, createRoute } from '@tanstack/react-router';
import HomePage from './pages/HomePage';
import DistrictExplorerPage from './pages/DistrictExplorerPage';
import DistrictPage from './pages/DistrictPage';
import ProjectPage from './pages/ProjectPage';
import ProjectProgressPage from './pages/ProjectProgressPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ReportsPage from './pages/ReportsPage';
import BookmarkedProjectsPage from './pages/BookmarkedProjectsPage';
import AboutPage from './pages/AboutPage';
import Layout from './components/Layout';

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const districtExplorerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/districts',
  component: DistrictExplorerPage,
});

const districtRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/district/$districtId',
  component: DistrictPage,
});

const projectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/project/$projectId',
  component: ProjectPage,
});

const progressRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/progress',
  component: ProjectProgressPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminDashboardPage,
});

const reportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reports',
  component: ReportsPage,
});

const bookmarksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/bookmarks',
  component: BookmarkedProjectsPage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  districtExplorerRoute,
  districtRoute,
  projectRoute,
  progressRoute,
  adminRoute,
  reportsRoute,
  bookmarksRoute,
  aboutRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
