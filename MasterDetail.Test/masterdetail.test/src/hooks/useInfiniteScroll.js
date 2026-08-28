import { useRef, useCallback } from 'react';

/**
 * Custom hook for managing intersection observer logic for infinite scrolling.
 * 
 * @param {boolean} isFetchingNextPage - Whether the next page is currently being fetched
 * @param {boolean} hasNextPage - Whether there is a next page to fetch
 * @param {function} fetchNextPage - Function to call to fetch the next page
 * @returns {React.MutableRefObject} Callback ref to attach to the last element in the list
 */
export function useInfiniteScroll(isFetchingNextPage, hasNextPage, fetchNextPage) {
    const observer = useRef();

    const lastElementRef = useCallback((node) => {
        if (isFetchingNextPage) return;

        if (observer.current) {
            observer.current.disconnect();
        }

        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasNextPage) {
                fetchNextPage();
            }
        });

        if (node) {
            observer.current.observe(node);
        }
    }, [isFetchingNextPage, hasNextPage, fetchNextPage]);

    return lastElementRef;
}
