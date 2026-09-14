import { Outlet, useNavigate, useRouterState } from '@tanstack/react-router';
import { LayoutDashboard, MapPin, TrendingUp, FileText, Menu, Moon, Sun, Bookmark, Shield, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useTheme } from 'next-themes';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import LoginButton from './LoginButton';
import ProfileSetupModal from './ProfileSetupModal';
import { useState } from 'react';

export default function Layout() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { theme, setTheme } = useTheme();
  const { identity } = useInternetIdentity();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Home', icon: LayoutDashboard },
    { path: '/districts', label: 'Municipalities', icon: MapPin },
    { path: '/progress', label: 'Analytics', icon: TrendingUp },
    { path: '/reports', label: 'Reports', icon: FileText },
    ...(identity ? [{ path: '/bookmarks', label: 'Bookmarks', icon: Bookmark }] : []),
    { path: '/about', label: 'About', icon: Info },
    { path: '/admin', label: 'Admin', icon: Shield },
  ];

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentPath === item.path;
        return (
          <Button
            key={item.path}
            variant={isActive ? 'default' : 'ghost'}
            className={mobile ? 'w-full justify-start' : ''}
            onClick={() => {
              navigate({ to: item.path });
              if (mobile) setMobileMenuOpen(false);
            }}
          >
            <Icon className="mr-2 h-4 w-4" />
            {item.label}
          </Button>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ProfileSetupModal />
      
      {/* Header with Philippine flag-inspired colors */}
      <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-primary/5 via-background to-accent/5 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate({ to: '/' })}
              className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity"
            >
              <img 
                src="/assets/generated/bantay-bayan-header-logo.dim_150x150.png" 
                alt="Bantay Bayan" 
                className="h-10 w-10 object-contain"
              />
              <span className="hidden sm:inline bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Bantay Bayan
              </span>
              <span className="sm:hidden bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">BB</span>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <NavLinks />
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            <LoginButton />

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <nav className="flex flex-col gap-2 mt-8">
                  <NavLinks mobile />
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t bg-gradient-to-r from-primary/5 via-muted/20 to-accent/5">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <img 
                src="/assets/generated/bantay-bayan-logo.dim_200x200.png" 
                alt="Bantay Bayan" 
                className="h-8 w-8 object-contain"
              />
              <div className="flex flex-col">
                <span className="font-semibold text-foreground">Bantay Bayan</span>
                <span className="text-xs">Philippine Public Transparency Platform</span>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <Button
                variant="link"
                className="text-sm text-muted-foreground hover:text-primary p-0"
                onClick={() => navigate({ to: '/about' })}
              >
                About
              </Button>
              <div className="text-sm text-muted-foreground">
                © 2025. Built with{' '}
                <span className="text-primary">♥</span> using{' '}
                <a
                  href="https://caffeine.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline font-medium"
                >
                  caffeine.ai
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
