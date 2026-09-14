import { useState } from 'react';
import { useGetAllDistricts, useGetAllProjects } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { MapPin, Search, CheckCircle2, Clock, TrendingUp, ArrowRight } from 'lucide-react';
import { ProjectStatus } from '../backend';

export default function DistrictExplorerPage() {
  const navigate = useNavigate();
  const { data: districts = [], isLoading: districtsLoading } = useGetAllDistricts();
  const { data: projects = [], isLoading: projectsLoading } = useGetAllProjects();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getProjectsByDistrict = (districtName: string) => {
    return filteredProjects.filter((p) => p.district === districtName);
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

  const isLoading = districtsLoading || projectsLoading;

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">District Explorer</h1>
        <p className="text-muted-foreground">
          Browse projects across different districts in Quezon City
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects or districts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value={ProjectStatus.active}>Active</SelectItem>
                <SelectItem value={ProjectStatus.completed}>Completed</SelectItem>
                <SelectItem value={ProjectStatus.planned}>Planned</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Districts */}
      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : districts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No districts available yet
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {districts.map((district) => {
            const districtProjects = getProjectsByDistrict(district.name);
            const activeCount = districtProjects.filter((p) => p.status === ProjectStatus.active).length;
            const completedCount = districtProjects.filter((p) => p.status === ProjectStatus.completed).length;
            const avgProgress = districtProjects.length > 0 
              ? districtProjects.reduce((sum, p) => sum + p.progress, 0) / districtProjects.length 
              : 0;

            return (
              <Card key={district.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-2xl flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        {district.name}
                      </CardTitle>
                      <CardDescription className="mt-2 flex flex-wrap gap-4">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {activeCount} Active
                        </span>
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          {completedCount} Completed
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          {avgProgress.toFixed(0)}% Avg Progress
                        </span>
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => navigate({ to: '/district/$districtId', params: { districtId: district.id } })}
                    >
                      View District
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {districtProjects.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      {searchQuery || statusFilter !== 'all' 
                        ? 'No projects match your filters' 
                        : 'No projects in this district yet'}
                    </p>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {districtProjects.map((project) => (
                        <Card
                          key={project.id}
                          className="hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => navigate({ to: '/project/$projectId', params: { projectId: project.id } })}
                        >
                          <CardHeader>
                            <div className="flex items-start justify-between gap-2">
                              <CardTitle className="text-base line-clamp-2">{project.name}</CardTitle>
                              <Badge className={getStatusColor(project.status)}>
                                {project.status}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {project.description}
                            </p>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Progress:</span>
                              <span className="font-semibold">{project.progress.toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-secondary rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full transition-all"
                                style={{ width: `${Math.min(project.progress, 100)}%` }}
                              />
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground pt-1">
                              <span>{project.milestones.filter(m => m.completed).length}/{project.milestones.length} milestones</span>
                              <span>{project.category}</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
