import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/apiClient';

// --- Queries ---

export const useChildren = (masterId, detailId, search = '', reverse = false) => {
    return useInfiniteQuery({
        queryKey: ['children', masterId, detailId, { search, reverse }],
        queryFn: async ({ pageParam = 1 }) => {
            const { data } = await apiClient.get(
                `/Child/GetAllPaged/${masterId}/${detailId}?page=${pageParam}&limit=15${search ? `&search=${search}` : ''}&reverse=${reverse}`
            );
            return data;
        },
        getNextPageParam: (lastPage, allPages) => {
            const nextPage = allPages.length + 1;
            return nextPage <= (lastPage.totalPages || 1) ? nextPage : undefined;
        },
        initialPageParam: 1,
        enabled: !!masterId && !!detailId,
    });
};

// --- Mutations ---

export const useCreateChild = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newChild) => {
            const { data } = await apiClient.post('Child/create', newChild);
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['children', String(variables.masterId), String(variables.detailId)] });
        },
    });
};

export const useUpdateChild = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, updatedChild }) => {
            const { data } = await apiClient.put(`Child/update`, updatedChild);
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['children', String(variables.updatedChild.masterId), String(variables.updatedChild.detailId)] });
        },
    });
};

export const useDeleteChild = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            const { data } = await apiClient.delete(`Child/delete/${id}`);
            return data;
        },
        // Just invalidate all children queries since we only have the ID
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['children'] });
        },
    });
};
