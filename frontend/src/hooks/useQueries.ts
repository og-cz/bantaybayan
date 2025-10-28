import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Project, District, Announcement, UserProfile, Comment, Notification } from '../backend';
import { Principal } from '@icp-sdk/core/principal';
import { mockProjects, mockDistricts } from '../data/mockData';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetAllProjects() {
  const { actor, isFetching } = useActor();

  return useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      if (!actor) {
        return mockProjects;
      }
      try {
        const backendProjects = await actor.getAllProjects();
        return backendProjects.length > 0 ? backendProjects : mockProjects;
      } catch (error) {
        console.error('Error fetching projects from backend, using mock data:', error);
        return mockProjects;
      }
    },
    enabled: true,
    staleTime: 30000,
  });
}

export function useGetRecentProjects() {
  const { actor, isFetching } = useActor();

  return useQuery<Project[]>({
    queryKey: ['recentProjects'],
    queryFn: async () => {
      if (!actor) {
        return [...mockProjects]
          .sort((a, b) => Number(b.createdAt - a.createdAt))
          .slice(0, 15);
      }
      try {
        const backendProjects = await actor.getRecentProjects(BigInt(15));
        if (backendProjects.length === 0) {
          return [...mockProjects]
            .sort((a, b) => Number(b.createdAt - a.createdAt))
            .slice(0, 15);
        }
        return backendProjects;
      } catch (error) {
        console.error('Error fetching recent projects from backend, using mock data:', error);
        return [...mockProjects]
          .sort((a, b) => Number(b.createdAt - a.createdAt))
          .slice(0, 15);
      }
    },
    enabled: true,
    staleTime: 30000,
  });
}

export function useGetProject(projectId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Project | null>({
    queryKey: ['project', projectId],
    queryFn: async () => {
      if (!actor) {
        return mockProjects.find(p => p.id === projectId) || null;
      }
      try {
        const backendProject = await actor.getProject(projectId);
        if (!backendProject) {
          return mockProjects.find(p => p.id === projectId) || null;
        }
        return backendProject;
      } catch (error) {
        console.error('Error fetching project from backend, using mock data:', error);
        return mockProjects.find(p => p.id === projectId) || null;
      }
    },
    enabled: !!projectId,
    staleTime: 30000,
  });
}

export function useAddProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (project: Project) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addProject(project);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['recentProjects'] });
      queryClient.invalidateQueries({ queryKey: ['districts'] });
    },
  });
}

export function useUpdateProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (project: Project) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateProject(project);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['recentProjects'] });
      queryClient.invalidateQueries({ queryKey: ['project', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['districts'] });
    },
  });
}

export function useGetAllDistricts() {
  const { actor, isFetching } = useActor();

  return useQuery<District[]>({
    queryKey: ['districts'],
    queryFn: async () => {
      if (!actor) {
        return mockDistricts;
      }
      try {
        const backendDistricts = await actor.getAllDistricts();
        return backendDistricts.length > 0 ? backendDistricts : mockDistricts;
      } catch (error) {
        console.error('Error fetching districts from backend, using mock data:', error);
        return mockDistricts;
      }
    },
    enabled: true,
    staleTime: 30000,
  });
}

export function useGetDistrict(districtId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<District | null>({
    queryKey: ['district', districtId],
    queryFn: async () => {
      if (!actor) {
        return mockDistricts.find(d => d.id === districtId) || null;
      }
      try {
        const backendDistrict = await actor.getDistrict(districtId);
        if (!backendDistrict) {
          return mockDistricts.find(d => d.id === districtId) || null;
        }
        return backendDistrict;
      } catch (error) {
        console.error('Error fetching district from backend, using mock data:', error);
        return mockDistricts.find(d => d.id === districtId) || null;
      }
    },
    enabled: !!districtId,
    staleTime: 30000,
  });
}

export function useAddDistrict() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (district: District) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addDistrict(district);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['districts'] });
    },
  });
}

export function useGetAllAnnouncements() {
  const { actor, isFetching } = useActor();

  return useQuery<Announcement[]>({
    queryKey: ['announcements'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllAnnouncements();
      } catch (error) {
        console.error('Error fetching announcements:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 30000,
  });
}

export function useAddAnnouncement() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (announcement: Announcement) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addAnnouncement(announcement);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCallerAdmin();
      } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 60000,
  });
}

export function useGetUserProfile(principal: Principal | null) {
  const { actor, isFetching } = useActor();

  return useQuery<UserProfile | null>({
    queryKey: ['userProfile', principal?.toString()],
    queryFn: async () => {
      if (!actor || !principal) return null;
      try {
        return await actor.getUserProfile(principal);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!principal,
    staleTime: 30000,
  });
}

export function useBookmarkProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.bookmarkProject(projectId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['bookmarkedProjects'] });
    },
  });
}

export function useRemoveBookmark() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeBookmark(projectId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['bookmarkedProjects'] });
    },
  });
}

export function useGetBookmarkedProjects() {
  const { actor, isFetching } = useActor();

  return useQuery<Project[]>({
    queryKey: ['bookmarkedProjects'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getBookmarkedProjects();
      } catch (error) {
        console.error('Error fetching bookmarked projects:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 30000,
  });
}

export function useGetCommentsByProject(projectId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Comment[]>({
    queryKey: ['comments', projectId],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getCommentsByProject(projectId);
      } catch (error) {
        console.error('Error fetching comments:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching && !!projectId,
    staleTime: 10000,
  });
}

export function useAddComment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (comment: Comment) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addComment(comment);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.projectId] });
    },
  });
}

export function useDeleteComment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ commentId, projectId }: { commentId: string; projectId: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteComment(commentId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.projectId] });
    },
  });
}

export function useGetNotificationsByUser(userId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Notification[]>({
    queryKey: ['notifications', userId],
    queryFn: async () => {
      if (!actor || !userId) return [];
      try {
        return await actor.getNotificationsByUser(userId);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching && !!userId,
    staleTime: 30000,
  });
}
