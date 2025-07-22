import { useState } from "react";

import type { Staff } from "@shared/types";

import { filterByTreatment } from "../utils";

import { axiosInstance } from "@/axiosInstance";
import { queryKeys } from "@/react-query/constants";
import {useQuery} from "@tanstack/react-query";

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

  //fallback data
  const fallback: Staff[] = [];
  // TODO: get data from server via useQuery
  const {data:staff = fallback} = useQuery({
    queryKey: [queryKeys.staff],
    queryFn: getStaff,
  });
  return { staff, filter, setFilter };
}
