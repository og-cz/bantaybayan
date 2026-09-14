import { useGetBookmarkedProjects } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from '@tanstack/react-router';
import { Bookmark, MapPin, ArrowRight, DollarSign, Heart } from 'lucide-react';
import { ProjectStatus } from '../backend';
import BookmarkButton from '../components/BookmarkButton';

export default function BookmarkedProjectsPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: bookmarkedProjects = [], isLoading } = useGetBookmarkedProjects();

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.active:
        return 'bg-success/10 text-success border-success/20';
      case ProjectStatus.completed:
        return 'bg-primary/10 text-primary border-primary/20';
      case ProjectStatus.planned:
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!identity) {
    return (
      <div className="container py-16">
        <Card>
          <CardContent className="py-16 text-center">
            <Bookmark className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
            <h2 className="text-2xl font-bold mb-2">Login Required</h2>
            <p className="text-muted-foreground mb-6">
              Please log in to view your bookmarked projects
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Bookmark className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">My Bookmarked Projects</h1>
          <p className="text-muted-foreground">
            {bookmarkedProjects.length} {bookmarkedProjects.length === 1 ? 'project' : 'projects'} saved
          </p>
        </div>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardHeader>
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : bookmarkedProjects.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
            <h2 className="text-xl font-semibold mb-2">No Bookmarked Projects</h2>
            <p className="text-muted-foreground mb-6">
              Start bookmarking projects to keep track of the ones you're interested in
            </p>
            <Button onClick={() => navigate({ to: '/' })}>
              Browse Projects
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {bookmarkedProjects.map((project) => (
            <Card
              key={project.id}
              className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/20"
              onClick={() => navigate({ to: '/project/$projectId', params: { projectId: project.id } })}
            >
              {/* Project Thumbnail */}
              <div className="relative h-48 bg-muted overflow-hidden">
                <img
                  src={project.thumbnail || '/assets/generated/project-default-thumbnail.dim_300x200.jpg'}
                  alt={project.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 flex gap-2">
                  <Badge className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                </div>
                <div className="absolute top-3 left-3">
                  <BookmarkButton projectId={project.id} variant="default" />
                </div>
              </div>

              <CardHeader className="space-y-3">
                <div className="space-y-2">
                  <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                    {project.name}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{project.district}</span>
                    <span className="text-xs">•</span>
                    <span className="text-xs">{project.category}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-semibold">{project.progress.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(project.progress, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Budget */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    <span>Budget</span>
                  </div>
                  <span className="font-semibold text-sm">
                    {formatCurrency(project.budget.total)}
                  </span>
                </div>

                {/* View Details Button */}
                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  View Details
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
