import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/apiClient';

// --- Queries ---

export const useDetails = (masterId, search = '', reverse = false) => {
    return useInfiniteQuery({
        queryKey: ['details', masterId, { search, reverse }],
        queryFn: async ({ pageParam = 1 }) => {
            const { data } = await apiClient.get(
                `/Detail/GetAllPaged/${masterId}?page=${pageParam}&limit=15${search ? `&search=${search}` : ''}&reverse=${reverse}`
            );
            return data;
        },
        getNextPageParam: (lastPage, allPages) => {
            const nextPage = allPages.length + 1;
            return nextPage <= (lastPage.totalPages || 1) ? nextPage : undefined;
        },
        initialPageParam: 1,
        enabled: !!masterId, // Only fetch when masterId is provided
    });
};

export const useDetailById = (detailId) => {
    return useQuery({
        queryKey: ['details', detailId],
        queryFn: async () => {
            const { data } = await apiClient.get(`/Detail/getbyid/${detailId}`);
            return data;
        },
        enabled: !!detailId,
    });
};

// --- Mutations ---

export const useCreateDetail = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newDetail) => {
            const { data } = await apiClient.post('Detail/create', newDetail);
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['details', String(variables.masterId)] });
        },
    });
};

export const useUpdateDetail = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, updatedDetail }) => {
            const { data } = await apiClient.put(`Detail/update`, updatedDetail);
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['details', String(variables.updatedDetail.masterId)] });
        },
    });
};

export const useDeleteDetail = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            const { data } = await apiClient.delete(`Detail/delete/${id}`);
            return data;
        },
        // Wait, delete only gives ID, we might need masterId to invalidate specifically, or we invalidate all details
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['details'] });
        },
    });
};
