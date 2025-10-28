import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, Shield } from 'lucide-react';
import { useActor } from '../hooks/useActor';
import { toast } from 'sonner';

interface AdminLoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoginSuccess: () => void;
}

export default function AdminLoginModal({ open, onOpenChange, onLoginSuccess }: AdminLoginModalProps) {
  const { actor, isFetching } = useActor();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('1234');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    setIsLoading(true);

    try {
      // Check credentials with backend if available, otherwise use hardcoded check
      let success = false;
      
      if (actor) {
        try {
          success = await actor.adminLogin(username, password);
        } catch (err) {
          console.error('Backend login error:', err);
          // Fallback to hardcoded check if backend fails
          success = username === 'admin' && password === '1234';
        }
      } else {
        // Fallback to hardcoded check if actor not available
        success = username === 'admin' && password === '1234';
      }
      
      if (success) {
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('adminLoginTime', Date.now().toString());
        toast.success('Login successful! Welcome to Bantay Bayan Admin Dashboard');
        onLoginSuccess();
        onOpenChange(false);
        setUsername('admin');
        setPassword('1234');
        setError('');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (!isLoading) {
      setUsername('admin');
      setPassword('1234');
      setError('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Bantay Bayan Admin Login</DialogTitle>
              <DialogDescription className="text-xs">
                Philippine Public Transparency Platform
              </DialogDescription>
            </div>
          </div>
          <DialogDescription>
            Enter your admin credentials to access the dashboard
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isFetching && (
            <Alert>
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertDescription>Initializing system...</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              disabled={isLoading}
              autoComplete="username"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </Button>
          </div>
        </form>

        <div className="text-xs text-muted-foreground text-center pt-2 border-t">
          Default credentials: <span className="font-mono font-semibold">admin</span> / <span className="font-mono font-semibold">1234</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
