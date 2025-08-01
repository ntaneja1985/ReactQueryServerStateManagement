import type { Appointment } from "@shared/types";

import { axiosInstance, getJWTHeader } from "../../../axiosInstance";

import { useLoginData } from "@/auth/AuthContext";
import {useQuery} from "@tanstack/react-query";
import {generateUserKey} from "@/react-query/key-factories";
import {generateUserAppointmentKey} from "@/react-query/key-factories";

// for when we need a query function for useQuery
async function getUserAppointments(
  userId: number,
  userToken: string
): Promise<Appointment[] | null> {
  const { data } = await axiosInstance.get(`/user/${userId}/appointments`, {
    headers: getJWTHeader(userToken),
  });
  return data.appointments;
}

export function useUserAppointments(): Appointment[] {
  const {userId, userToken} = useLoginData();

  // replace with React Query
  const fallback: Appointment[] = [];
  const {data:userAppointments = fallback} = useQuery({
    //queryFn will run only if enabled is true, if false then queryFn will not run
    enabled: !!userId,
    queryKey:generateUserAppointmentKey(userId, userToken),
    queryFn:()=>getUserAppointments(userId, userToken),
    staleTime: Infinity
  });
  return userAppointments;
}
