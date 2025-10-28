import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bookmark } from 'lucide-react';
import { useBookmarkProject, useRemoveBookmark, useGetCallerUserProfile } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { List } from '../backend';

interface BookmarkButtonProps {
  projectId: string;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

// Helper function to convert List to array
function listToArray(list: List): string[] {
  const result: string[] = [];
  let current = list;
  
  while (current !== null && Array.isArray(current) && current.length === 2) {
    result.push(current[0]);
    current = current[1];
  }
  
  return result;
}

export default function BookmarkButton({ projectId, variant = 'ghost', size = 'icon', className }: BookmarkButtonProps) {
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const bookmarkMutation = useBookmarkProject();
  const removeMutation = useRemoveBookmark();
  const [isAnimating, setIsAnimating] = useState(false);

  const isBookmarked = userProfile?.bookmarkedProjects 
    ? listToArray(userProfile.bookmarkedProjects).includes(projectId)
    : false;

  const handleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!identity) {
      toast.error('Please log in to bookmark projects');
      return;
    }

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    try {
      if (isBookmarked) {
        await removeMutation.mutateAsync(projectId);
        toast.success('Bookmark removed');
      } else {
        await bookmarkMutation.mutateAsync(projectId);
        toast.success('Project bookmarked!');
      }
    } catch (error) {
      toast.error('Failed to update bookmark');
      console.error('Bookmark error:', error);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleBookmark}
      disabled={bookmarkMutation.isPending || removeMutation.isPending}
      className={cn(
        'transition-all',
        isAnimating && 'scale-125',
        className
      )}
    >
      <Bookmark
        className={cn(
          'h-4 w-4',
          isBookmarked && 'fill-current text-primary'
        )}
      />
    </Button>
  );
}
