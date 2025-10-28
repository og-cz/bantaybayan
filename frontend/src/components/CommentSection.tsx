import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageSquare, Send, Trash2, AlertTriangle } from 'lucide-react';
import { useGetCommentsByProject, useAddComment, useDeleteComment, useIsCallerAdmin } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';
import { Comment, CommentStatus } from '../backend';

interface CommentSectionProps {
  projectId: string;
}

export default function CommentSection({ projectId }: CommentSectionProps) {
  const { identity } = useInternetIdentity();
  const { data: comments = [], isLoading } = useGetCommentsByProject(projectId);
  const { data: isAdmin = false } = useIsCallerAdmin();
  const addCommentMutation = useAddComment();
  const deleteCommentMutation = useDeleteComment();
  const [commentText, setCommentText] = useState('');

  const handleSubmitComment = async () => {
    if (!identity) {
      toast.error('Please log in to comment');
      return;
    }

    if (!commentText.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    const newComment: Comment = {
      id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      projectId,
      userId: identity.getPrincipal().toString(),
      content: commentText,
      timestamp: BigInt(Date.now() * 1000000),
      replies: [],
      status: CommentStatus.active,
    };

    try {
      await addCommentMutation.mutateAsync(newComment);
      setCommentText('');
      toast.success('Comment posted!');
    } catch (error) {
      toast.error('Failed to post comment');
      console.error('Comment error:', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteCommentMutation.mutateAsync({ commentId, projectId });
      toast.success('Comment deleted');
    } catch (error) {
      toast.error('Failed to delete comment');
      console.error('Delete error:', error);
    }
  };

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) / 1000000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const activeComments = comments.filter(c => c.status === CommentStatus.active);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Comments ({activeComments.length})
        </CardTitle>
        <CardDescription>Share your thoughts and feedback on this project</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Comment Input */}
        <div className="space-y-3">
          <Textarea
            placeholder={identity ? "Write a comment..." : "Please log in to comment"}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            disabled={!identity || addCommentMutation.isPending}
            rows={3}
            className="resize-none"
          />
          <div className="flex justify-end">
            <Button
              onClick={handleSubmitComment}
              disabled={!identity || !commentText.trim() || addCommentMutation.isPending}
            >
              <Send className="mr-2 h-4 w-4" />
              {addCommentMutation.isPending ? 'Posting...' : 'Post Comment'}
            </Button>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          {isLoading ? (
            <>
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                </div>
              ))}
            </>
          ) : activeComments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>No comments yet. Be the first to share your thoughts!</p>
            </div>
          ) : (
            activeComments.map((comment) => (
              <div key={comment.id} className="flex gap-3 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    {comment.userId.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-sm">
                        {comment.userId.slice(0, 8)}...{comment.userId.slice(-6)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(comment.timestamp)}
                      </p>
                    </div>
                    {isAdmin && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this comment? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteComment(comment.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                  <p className="text-sm">{comment.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
