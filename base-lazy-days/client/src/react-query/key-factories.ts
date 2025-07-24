import {queryKeys} from "@/react-query/constants";

export const generateUserKey = (userId: number, userToken:string) => {
    // return [queryKeys.user,userId,userToken];
    //Deliberately exclude the userToken from the dependency array
    // to keep key consistent for userId regardless of token changes
    return [queryKeys.user,userId];
}

export const generateUserAppointmentKey = (userId: number, userToken:string) => {
    return [queryKeys.appointments,queryKeys.user,userId,userToken];
}


