import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/apiClient';

// --- Queries ---

export const useMasters = (search = '', reverse = false) => {
    return useInfiniteQuery({
        queryKey: ['masters', { search, reverse }],
        queryFn: async ({ pageParam = 1 }) => {
            const { data } = await apiClient.get(
                `/Master/GetAllPaged?page=${pageParam}&limit=15${search ? `&search=${search}` : ''}&reverse=${reverse}`
            );
            return data;
        },
        getNextPageParam: (lastPage, allPages) => {
            const nextPage = allPages.length + 1;
            return nextPage <= (lastPage.totalPages || 1) ? nextPage : undefined;
        },
        initialPageParam: 1,
    });
};

export const useMasterById = (masterId) => {
    return useQuery({
        queryKey: ['masters', masterId],
        queryFn: async () => {
            const { data } = await apiClient.get(`/Master/getbyid/${masterId}`);
            return data;
        },
        enabled: !!masterId,
    });
};

// --- Mutations ---

export const useCreateMaster = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newMaster) => {
            const { data } = await apiClient.post('Master/create', newMaster);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['masters'] });
        },
    });
};

export const useUpdateMaster = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, updatedMaster }) => {
            const { data } = await apiClient.put(`Master/update`, updatedMaster);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['masters'] });
        },
    });
};

export const useDeleteMaster = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            const { data } = await apiClient.delete(`Master/delete/${id}`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['masters'] });
        },
    });
};
