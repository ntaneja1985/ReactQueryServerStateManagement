import { AxiosResponse } from "axios";

import type { User } from "@shared/types";

import { useLoginData } from "@/auth/AuthContext";
import { axiosInstance, getJWTHeader } from "@/axiosInstance";
import { queryKeys } from "@/react-query/constants";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {generateUserKey} from "@/react-query/key-factories";

// query function
async function getUser(userId: number, userToken: string) {
  const { data }: AxiosResponse<{ user: User }> = await axiosInstance.get(
    `/user/${userId}`,
    {
      headers: getJWTHeader(userToken),
    }
  );

  return data.user;
}

export function useUser() {
  const queryClient = useQueryClient();

  //get details on the UserId
  const {userId, userToken} = useLoginData();

  // call useQuery to update user data from server
  //const user: User = null;
  const {data:user} = useQuery({
    //queryFn will run only if enabled is true, if false then queryFn will not run
    enabled: !!userId,
    queryKey:generateUserKey(userId, userToken),
    queryFn:()=>getUser(userId, userToken),
    staleTime: Infinity
  });

  // meant to be called from useAuth
  function updateUser(newUser: User): void {
    // update the user in the query cache
    queryClient.setQueryData(
        generateUserKey(newUser.id, newUser.token),
        newUser
    )
  }

  // meant to be called from useAuth
  function clearUser() {
    //reset user to null in query cache
    queryClient.removeQueries(
        {queryKey: [queryKeys.user]}
    );

    //remove user appointments data
    queryClient.removeQueries(
        {queryKey: [queryKeys.appointments,queryKeys.user]}
    )
  }

  return { user, updateUser, clearUser };
}
