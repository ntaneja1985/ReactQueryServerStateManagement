import {useCallback, useState} from "react";

import type { Staff } from "@shared/types";

import { filterByTreatment } from "../utils";

import { axiosInstance } from "@/axiosInstance";
import { queryKeys } from "@/react-query/constants";
import {useQuery} from "@tanstack/react-query";
import {AppointmentDateMap} from "@/components/appointments/types";
import {getAvailableAppointments} from "@/components/appointments/utils";

//query function for useQuery
async function getStaff(): Promise<Staff[]> {
  const { data } = await axiosInstance.get('/staff');
  return data;
}
interface UseStaffReturn {
  staff: Staff[];
  filter: string;
  setFilter: (filter: string) => void;
}

export function useStaff() {
  // for filtering staff by treatment
  const [filter, setFilter] = useState("all");

  const selectFn = useCallback((unfilteredStaff: Staff[]) => {
    if (filter === 'all') return unfilteredStaff;
    return filterByTreatment(unfilteredStaff, filter); // ✅ Return filtered data directly
  }, [filter]);

  //fallback data
  const fallback: Staff[] = [];
  // TODO: get data from server via useQuery
  const {data:staff = fallback} = useQuery({
    queryKey: [queryKeys.staff],
    queryFn: getStaff,
    //Apply transformation to the result returned from queryFn
    select: selectFn,
  });
  return { staff, filter, setFilter };
}
