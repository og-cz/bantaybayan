import { useState, useMemo } from 'react';
import { useGetRecentProjects, useGetAllDistricts } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from '@tanstack/react-router';
import { Search, MapPin, ArrowRight, DollarSign, Building2, Shield } from 'lucide-react';
import { ProjectStatus } from '../backend';
import BookmarkButton from '../components/BookmarkButton';

export default function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { data: recentProjects = [], isLoading: projectsLoading } = useGetRecentProjects();
  const { data: districts = [], isLoading: districtsLoading } = useGetAllDistricts();

  const filteredProjects = useMemo(() => {
    return recentProjects.filter((project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [recentProjects, searchQuery]);

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.active:
        return 'bg-success/10 text-success border-success/20';
      case ProjectStatus.completed:
        return 'bg-accent/10 text-accent border-accent/20';
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

  return (
    <div className="min-h-screen">
      {/* Hero Section with Philippine flag-inspired gradient */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/10 border-b">
        <div className="absolute inset-0 bg-[url('/assets/generated/bantay-bayan-hero-banner.dim_1200x400.png')] bg-cover bg-center opacity-10" />
        <div className="container relative py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="flex justify-center mb-6">
              <img 
                src="/assets/generated/bantay-bayan-logo.dim_200x200.png" 
                alt="Bantay Bayan" 
                className="h-24 w-24 md:h-32 md:w-32 object-contain"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary via-foreground to-accent bg-clip-text text-transparent">
              Bantay Bayan
            </h1>
            <div className="flex items-center justify-center gap-2 text-lg md:text-xl text-muted-foreground">
              <Shield className="h-5 w-5 text-primary" />
              <span>Philippine Public Transparency Platform</span>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Exposing ghost projects and promoting government accountability. Track municipal projects, monitor budgets, and ensure transparency in Quezon City's development initiatives.
            </p>
            
            {/* Large Centered Search Bar with red/blue accent */}
            <div className="max-w-2xl mx-auto pt-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary" />
                <Input
                  placeholder="Search projects, municipalities, or categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 text-lg shadow-lg border-2 focus-visible:ring-primary focus-visible:border-primary"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-12 space-y-12">
        {/* Recent Projects Feed */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Recent Projects
              </h2>
              <p className="text-muted-foreground mt-1">Latest updates from across all municipalities</p>
            </div>
          </div>

          {projectsLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(15)].map((_, i) => (
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
          ) : filteredProjects.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                {searchQuery ? 'No projects match your search' : 'No projects available yet'}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => (
                <Card
                  key={project.id}
                  className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/30"
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
                        <MapPin className="h-3.5 w-3.5 text-accent" />
                        <span>{project.district}</span>
                        <span className="text-xs">•</span>
                        <span className="text-xs">{project.category}</span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Progress Bar with red gradient */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-semibold text-primary">{project.progress.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-primary to-accent h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(project.progress, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Budget */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <DollarSign className="h-4 w-4 text-accent" />
                        <span>Budget</span>
                      </div>
                      <span className="font-semibold text-sm">
                        {formatCurrency(project.budget.total)}
                      </span>
                    </div>

                    {/* View Details Button */}
                    <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors border-primary/20">
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Municipality Explorer Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                Explore Municipalities
              </h2>
              <p className="text-muted-foreground mt-1">Browse projects by municipality</p>
            </div>
            <Button variant="outline" onClick={() => navigate({ to: '/districts' })} className="border-accent/30 hover:bg-accent hover:text-accent-foreground">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {districtsLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2 mt-2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-24 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : districts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No municipalities available yet
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {districts.map((district) => (
                <Card
                  key={district.id}
                  className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-accent/30"
                  onClick={() => navigate({ to: '/district/$districtId', params: { districtId: district.id } })}
                >
                  <CardHeader className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                          <CardTitle className="text-xl group-hover:text-accent transition-colors">
                            {district.name}
                          </CardTitle>
                          <CardDescription className="text-sm">
                            {Number(district.activeProjects) + Number(district.completedProjects)} projects
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Budget Summary */}
                    <div className="space-y-2 p-4 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg border border-primary/10">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Budget</span>
                        <span className="font-semibold">
                          {formatCurrency(district.budgetSummary.totalBudget)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Spent</span>
                        <span className="font-semibold text-primary">
                          {formatCurrency(district.budgetSummary.spent)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Remaining</span>
                        <span className="font-semibold text-success">
                          {formatCurrency(district.budgetSummary.remaining)}
                        </span>
                      </div>
                    </div>

                    {/* Stats with red and blue accents */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="text-center p-3 bg-primary/10 rounded-lg border border-primary/20">
                        <div className="text-2xl font-bold text-primary">{district.activeProjects.toString()}</div>
                        <div className="text-xs text-muted-foreground">Active</div>
                      </div>
                      <div className="text-center p-3 bg-accent/10 rounded-lg border border-accent/20">
                        <div className="text-2xl font-bold text-accent">{district.completedProjects.toString()}</div>
                        <div className="text-xs text-muted-foreground">Completed</div>
                      </div>
                    </div>

                    {/* View Button */}
                    <Button variant="outline" className="w-full group-hover:bg-accent group-hover:text-accent-foreground transition-colors border-accent/20">
                      View District Page
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
