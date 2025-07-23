import type { Treatment } from "@shared/types";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import { axiosInstance } from "@/axiosInstance";
import { queryKeys } from "@/react-query/constants";

// for when we need a query function for useQuery
async function getTreatments(): Promise<Treatment[]> {
  const { data } = await axiosInstance.get('/treatments');
  return data;
}

export function useTreatments(): Treatment[] {
  const fallback : Treatment[] = []
  const {data = fallback} = useQuery({
   queryKey: [queryKeys.treatments],
   queryFn: getTreatments,
      staleTime:600000, //10 minutes
      gcTime: 900000, //15 minutes
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
 });
  return data;
}

export function usePrefetchTreatments(): void {
    //Get the queryClient instance passed to the QueryProvider
    const queryClient = useQueryClient();
    queryClient.prefetchQuery({
        queryKey:[queryKeys.treatments],
        queryFn: getTreatments
    });
}
