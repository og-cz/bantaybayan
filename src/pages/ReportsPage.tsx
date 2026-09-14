import { useState, useMemo } from 'react';
import { useGetAllProjects, useGetAllDistricts } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, FileText, TrendingUp } from 'lucide-react';
import { ProjectStatus } from '../backend';
import { toast } from 'sonner';

export default function ReportsPage() {
  const { data: projects = [], isLoading: projectsLoading } = useGetAllProjects();
  const { data: districts = [], isLoading: districtsLoading } = useGetAllDistricts();

  const [districtFilter, setDistrictFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [yearFilter, setYearFilter] = useState<string>('all');

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesDistrict = districtFilter === 'all' || project.district === districtFilter;
      const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
      
      if (yearFilter !== 'all') {
        const projectYear = new Date(Number(project.startDate) / 1000000).getFullYear();
        const matchesYear = projectYear.toString() === yearFilter;
        return matchesDistrict && matchesStatus && matchesYear;
      }
      
      return matchesDistrict && matchesStatus;
    });
  }, [projects, districtFilter, statusFilter, yearFilter]);

  const years = useMemo(() => {
    const uniqueYears = [...new Set(projects.map((p) => {
      return new Date(Number(p.startDate) / 1000000).getFullYear().toString();
    }))];
    return uniqueYears.sort().reverse();
  }, [projects]);

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) / 1000000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const generateCSV = () => {
    const headers = ['Project Name', 'District', 'Category', 'Status', 'Progress', 'Milestones Completed', 'Start Date', 'End Date', 'Official in Charge'];
    const rows = filteredProjects.map((project) => [
      project.name,
      project.district,
      project.category,
      project.status,
      `${project.progress.toFixed(2)}%`,
      `${project.milestones.filter(m => m.completed).length}/${project.milestones.length}`,
      formatDate(project.startDate),
      formatDate(project.endDate),
      project.officialInCharge || 'Not assigned',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `municipal-projects-report-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Report downloaded successfully!');
  };

  const generateSummary = () => {
    const totalProjects = filteredProjects.length;
    const activeProjects = filteredProjects.filter((p) => p.status === ProjectStatus.active).length;
    const completedProjects = filteredProjects.filter((p) => p.status === ProjectStatus.completed).length;
    const avgProgress = totalProjects > 0 
      ? filteredProjects.reduce((sum, p) => sum + p.progress, 0) / totalProjects 
      : 0;

    const summary = `
MUNICIPAL PROJECT TRACKER
SUMMARY REPORT
Generated: ${new Date().toLocaleString()}

FILTERS APPLIED:
- District: ${districtFilter === 'all' ? 'All Districts' : districtFilter}
- Status: ${statusFilter === 'all' ? 'All Status' : statusFilter}
- Year: ${yearFilter === 'all' ? 'All Years' : yearFilter}

OVERVIEW:
- Total Projects: ${totalProjects}
- Active Projects: ${activeProjects}
- Completed Projects: ${completedProjects}
- Planned Projects: ${filteredProjects.filter((p) => p.status === ProjectStatus.planned).length}
- Average Progress: ${avgProgress.toFixed(2)}%
- Completion Rate: ${totalProjects > 0 ? ((completedProjects / totalProjects) * 100).toFixed(2) : 0}%

PROJECT BREAKDOWN BY STATUS:
- Active: ${activeProjects} (${totalProjects > 0 ? ((activeProjects / totalProjects) * 100).toFixed(1) : 0}%)
- Completed: ${completedProjects} (${totalProjects > 0 ? ((completedProjects / totalProjects) * 100).toFixed(1) : 0}%)
- Planned: ${filteredProjects.filter((p) => p.status === ProjectStatus.planned).length} (${totalProjects > 0 ? ((filteredProjects.filter((p) => p.status === ProjectStatus.planned).length / totalProjects) * 100).toFixed(1) : 0}%)

DETAILED PROJECT LIST:
${filteredProjects.map((project, index) => `
${index + 1}. ${project.name}
   District: ${project.district}
   Category: ${project.category}
   Status: ${project.status}
   Progress: ${project.progress.toFixed(2)}%
   Milestones: ${project.milestones.filter(m => m.completed).length}/${project.milestones.length} completed
   Timeline: ${formatDate(project.startDate)} - ${formatDate(project.endDate)}
   Official: ${project.officialInCharge || 'Not assigned'}
`).join('\n')}
    `.trim();

    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `municipal-summary-report-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Summary report downloaded successfully!');
  };

  const isLoading = projectsLoading || districtsLoading;

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Reports & Downloads</h1>
        <p className="text-muted-foreground">
          Generate and download project progress reports and summaries
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Select value={districtFilter} onValueChange={setDistrictFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Districts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Districts</SelectItem>
                {districts.map((district) => (
                  <SelectItem key={district.id} value={district.name}>
                    {district.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value={ProjectStatus.active}>Active</SelectItem>
                <SelectItem value={ProjectStatus.completed}>Completed</SelectItem>
                <SelectItem value={ProjectStatus.planned}>Planned</SelectItem>
              </SelectContent>
            </Select>

            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Years" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Download Options */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Detailed CSV Report
            </CardTitle>
            <CardDescription>
              Download a comprehensive spreadsheet with all project details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={generateCSV} disabled={isLoading || filteredProjects.length === 0}>
              <Download className="mr-2 h-4 w-4" />
              Download CSV
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Summary Report
            </CardTitle>
            <CardDescription>
              Download a text summary with key statistics and insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={generateSummary} disabled={isLoading || filteredProjects.length === 0}>
              <Download className="mr-2 h-4 w-4" />
              Download Summary
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Preview Table */}
      <Card>
        <CardHeader>
          <CardTitle>Report Preview</CardTitle>
          <CardDescription>
            {filteredProjects.length} projects matching your filters
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No projects match your filters
            </p>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project Name</TableHead>
                    <TableHead>District</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Progress</TableHead>
                    <TableHead className="text-right">Milestones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">{project.name}</TableCell>
                      <TableCell>{project.district}</TableCell>
                      <TableCell>
                        <span className="capitalize">{project.status}</span>
                      </TableCell>
                      <TableCell className="text-right">{project.progress.toFixed(0)}%</TableCell>
                      <TableCell className="text-right">
                        {project.milestones.filter(m => m.completed).length}/{project.milestones.length}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
