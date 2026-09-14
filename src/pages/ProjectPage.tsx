import { useParams } from '@tanstack/react-router';
import { useGetProject } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, User, CheckCircle2, Circle, Clock, TrendingUp, Download } from 'lucide-react';
import { ProjectStatus } from '../backend';
import BookmarkButton from '../components/BookmarkButton';
import CommentSection from '../components/CommentSection';
import { toast } from 'sonner';

export default function ProjectPage() {
  const { projectId } = useParams({ from: '/project/$projectId' });
  const { data: project, isLoading } = useGetProject(projectId);

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) / 1000000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.active:
        return 'bg-green-500/10 text-green-700 dark:text-green-400';
      case ProjectStatus.completed:
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
      case ProjectStatus.planned:
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
      default:
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
    }
  };

  const calculateDaysRemaining = (endDate: bigint) => {
    const end = new Date(Number(endDate) / 1000000);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  const exportProjectPDF = () => {
    if (!project) return;
    
    const content = `
PROJECT DETAILS REPORT
Generated: ${new Date().toLocaleString()}

PROJECT: ${project.name}
Status: ${project.status}
Progress: ${project.progress.toFixed(2)}%

LOCATION:
District: ${project.district}
Municipality: ${project.municipality}

TIMELINE:
Start Date: ${formatDate(project.startDate)}
End Date: ${formatDate(project.endDate)}

DESCRIPTION:
${project.description}

OFFICIAL IN CHARGE:
${project.officialInCharge || 'Not assigned'}

CATEGORY: ${project.category}

MILESTONES:
${project.milestones.map((m, i) => `${i + 1}. ${m.name} - ${m.completed ? 'Completed' : 'Pending'}`).join('\n')}

BUDGET:
Total: ₱${project.budget.total.toLocaleString()}
Breakdown:
${project.budget.breakdown.map(b => `- ${b.category}: ₱${b.amount.toLocaleString()}`).join('\n')}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `project-${project.id}-report.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Project report downloaded!');
  };

  if (isLoading) {
    return (
      <div className="container py-8 space-y-6">
        <Skeleton className="h-10 w-3/4" />
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Project not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const daysRemaining = calculateDaysRemaining(project.endDate);
  const completedMilestones = project.milestones.filter(m => m.completed).length;

  return (
    <div className="container py-8 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-4 mb-2">
          <h1 className="text-3xl font-bold flex-1">{project.name}</h1>
          <div className="flex items-center gap-2">
            <BookmarkButton projectId={project.id} size="default" variant="outline" />
            <Button variant="outline" onClick={exportProjectPDF}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
          </div>
        </div>
        <p className="text-muted-foreground">{project.description}</p>
      </div>

      {/* Key Information */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.progress.toFixed(0)}%</div>
            <Progress value={project.progress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Milestones</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedMilestones}/{project.milestones.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {project.milestones.length > 0 ? `${((completedMilestones / project.milestones.length) * 100).toFixed(0)}% complete` : 'No milestones'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Timeline</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {daysRemaining > 0 ? `${daysRemaining}d` : 'Overdue'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {daysRemaining > 0 ? 'Days remaining' : `${Math.abs(daysRemaining)} days overdue`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <Circle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{project.status}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Current phase
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Details */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Location</p>
                <p className="text-sm text-muted-foreground">{project.district}, {project.municipality}</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Official in Charge</p>
                <p className="text-sm text-muted-foreground">{project.officialInCharge || 'Not assigned'}</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Timeline</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(project.startDate)} - {formatDate(project.endDate)}
                </p>
              </div>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium mb-2">Category</p>
              <Badge variant="outline">{project.category}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Progress Overview</CardTitle>
            <CardDescription>Current completion status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Overall Progress</span>
                <span className="font-semibold">{project.progress.toFixed(1)}%</span>
              </div>
              <Progress value={project.progress} className="h-3" />
            </div>
            <Separator />
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Milestones Completed</span>
                <span className="font-semibold">{completedMilestones} of {project.milestones.length}</span>
              </div>
              <Progress 
                value={project.milestones.length > 0 ? (completedMilestones / project.milestones.length) * 100 : 0} 
                className="h-3" 
              />
            </div>
            <Separator />
            <div className="pt-2">
              <p className="text-sm font-medium mb-2">Project Phase</p>
              <Badge className={getStatusColor(project.status)} variant="outline">
                {project.status === ProjectStatus.active && 'In Progress'}
                {project.status === ProjectStatus.completed && 'Completed'}
                {project.status === ProjectStatus.planned && 'Planning Phase'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Milestones */}
      <Card>
        <CardHeader>
          <CardTitle>Project Milestones</CardTitle>
          <CardDescription>Track progress through key project phases</CardDescription>
        </CardHeader>
        <CardContent>
          {project.milestones.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No milestones defined yet
            </p>
          ) : (
            <div className="space-y-4">
              {project.milestones.map((milestone, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    {milestone.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                    {index < project.milestones.length - 1 && (
                      <div className="w-px h-full bg-border mt-2" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium">{milestone.name}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {milestone.description}
                        </p>
                      </div>
                      <Badge variant={milestone.completed ? 'default' : 'outline'}>
                        {milestone.completed ? 'Completed' : 'Pending'}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Target: {formatDate(milestone.targetDate)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comments Section */}
      <CommentSection projectId={projectId} />
    </div>
  );
}
