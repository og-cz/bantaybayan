import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetDistrict, useGetAllProjects } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { MapPin, DollarSign, TrendingUp, Calendar, ArrowRight, Building2, CheckCircle2, Clock, Map } from 'lucide-react';
import { ProjectStatus } from '../backend';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function DistrictPage() {
  const { districtId } = useParams({ from: '/district/$districtId' });
  const navigate = useNavigate();
  const { data: district, isLoading: districtLoading } = useGetDistrict(districtId);
  const { data: allProjects = [], isLoading: projectsLoading } = useGetAllProjects();

  const districtProjects = district ? allProjects.filter((p) => p.district === district.name) : [];
  const activeProjects = districtProjects.filter((p) => p.status === ProjectStatus.active);
  const completedProjects = districtProjects.filter((p) => p.status === ProjectStatus.completed);
  const plannedProjects = districtProjects.filter((p) => p.status === ProjectStatus.planned);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) / 1000000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

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

  const isLoading = districtLoading || projectsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Skeleton className="h-64 w-full" />
        <div className="container py-8 space-y-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!district) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">District not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const ProjectCard = ({ project }: { project: typeof districtProjects[0] }) => (
    <Card
      className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/20"
      onClick={() => navigate({ to: '/project/$projectId', params: { projectId: project.id } })}
    >
      <div className="relative h-40 bg-muted overflow-hidden">
        <img
          src={project.thumbnail || '/assets/generated/project-default-thumbnail.dim_300x200.jpg'}
          alt={project.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
        </div>
      </div>

      <CardHeader>
        <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
          {project.name}
        </CardTitle>
        <CardDescription className="line-clamp-2">{project.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold">{project.progress.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2.5">
            <div
              className="bg-primary h-full rounded-full transition-all"
              style={{ width: `${Math.min(project.progress, 100)}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            <span>Budget</span>
          </div>
          <span className="font-semibold">{formatCurrency(project.budget.total)}</span>
        </div>

        <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          View Details
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen">
      {/* Cover Banner */}
      <div className="relative h-64 bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden">
        <img
          src={district.coverImage || '/assets/generated/default-district-cover.dim_1200x300.png'}
          alt={district.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      </div>

      {/* District Profile Header */}
      <div className="container -mt-20 relative z-10">
        <Card className="shadow-xl">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Logo */}
              <div className="h-24 w-24 rounded-xl bg-background shadow-lg border-4 border-background flex items-center justify-center overflow-hidden flex-shrink-0">
                {district.logo ? (
                  <img src={district.logo} alt={district.name} className="w-full h-full object-cover" />
                ) : (
                  <Building2 className="h-12 w-12 text-primary" />
                )}
              </div>

              {/* District Info */}
              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">{district.name}</h1>
                  <p className="text-muted-foreground">{district.overview || 'Congressional District in Quezon City'}</p>
                </div>

                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>Quezon City</span>
                  </div>
                  <Separator orientation="vertical" className="h-5" />
                  <div className="flex items-center gap-2 text-sm">
                    <Map className="h-4 w-4 text-muted-foreground" />
                    <span>{district.barangays.length} Barangays</span>
                  </div>
                  <Separator orientation="vertical" className="h-5" />
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{activeProjects.length} Active Projects</span>
                  </div>
                  <Separator orientation="vertical" className="h-5" />
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    <span>{completedProjects.length} Completed</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="container py-8 space-y-8">
        {/* Budget Summary */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(district.budgetSummary.totalBudget)}</div>
              <p className="text-xs text-muted-foreground mt-1">Allocated funds</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Budget Spent</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{formatCurrency(district.budgetSummary.spent)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {district.budgetSummary.totalBudget > 0
                  ? `${((district.budgetSummary.spent / district.budgetSummary.totalBudget) * 100).toFixed(1)}% utilized`
                  : 'No budget allocated'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Remaining</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{formatCurrency(district.budgetSummary.remaining)}</div>
              <p className="text-xs text-muted-foreground mt-1">Available funds</p>
            </CardContent>
          </Card>
        </div>

        {/* Barangays List */}
        {district.barangays.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5" />
                Barangays in {district.name}
              </CardTitle>
              <CardDescription>
                Complete list of {district.barangays.length} barangays with landmark information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="grid gap-3 md:grid-cols-2">
                  {district.barangays.map((barangay, index) => (
                    <div
                      key={index}
                      className="p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="font-medium">{barangay.name}</div>
                      {barangay.landmarkNotes && (
                        <div className="text-sm text-muted-foreground mt-1">
                          {barangay.landmarkNotes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}

        {/* Project History Timeline */}
        {districtProjects.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Project History & Timeline</CardTitle>
              <CardDescription>Timeline of all projects in {district.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {districtProjects
                  .sort((a, b) => Number(b.createdAt - a.createdAt))
                  .map((project, index) => (
                    <div key={project.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`h-3 w-3 rounded-full ${project.status === ProjectStatus.completed ? 'bg-primary' : project.status === ProjectStatus.active ? 'bg-success' : 'bg-warning'}`} />
                        {index < districtProjects.length - 1 && <div className="w-px h-full bg-border mt-2" />}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <p className="font-medium">{project.name}</p>
                            <p className="text-sm text-muted-foreground mt-1">{project.category}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <div className="text-xs text-muted-foreground">Progress: {project.progress.toFixed(0)}%</div>
                              <div className="flex-1 max-w-[200px] bg-secondary rounded-full h-1.5">
                                <div
                                  className="bg-primary h-full rounded-full"
                                  style={{ width: `${Math.min(project.progress, 100)}%` }}
                                />
                              </div>
                            </div>
                          </div>
                          <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Started: {formatDate(project.startDate)} • Target: {formatDate(project.endDate)}
                        </p>
                        {project.milestones.length > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Milestones: {project.milestones.filter(m => m.completed).length}/{project.milestones.length} completed
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Projects Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-4">
            <TabsTrigger value="all">
              All ({districtProjects.length})
            </TabsTrigger>
            <TabsTrigger value="active">
              Active ({activeProjects.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedProjects.length})
            </TabsTrigger>
            <TabsTrigger value="planned">
              Planned ({plannedProjects.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {districtProjects.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  No projects found for this district
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {districtProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="active" className="space-y-6">
            {activeProjects.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  No active projects
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {activeProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            {completedProjects.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  No completed projects
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {completedProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="planned" className="space-y-6">
            {plannedProjects.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  No planned projects
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {plannedProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
