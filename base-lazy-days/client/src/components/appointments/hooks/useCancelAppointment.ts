import { Appointment } from "@shared/types";

import { axiosInstance } from "@/axiosInstance";
import { useCustomToast } from "@/components/app/hooks/useCustomToast";
import { queryKeys } from "@/react-query/constants";
import {useMutation, useQueryClient} from "@tanstack/react-query";

// for when server call is needed
async function removeAppointmentUser(appointment: Appointment): Promise<void> {
  const patchData = [{ op: 'remove', path: '/userId' }];
  await axiosInstance.patch(`/appointment/${appointment.id}`, {
    data: patchData,
  });
}

export function useCancelAppointment() {
  const toast = useCustomToast();
  const queryClient = useQueryClient();

  // TODO: replace with mutate function
  const {mutate} = useMutation({
    mutationFn: (appointment:Appointment)=> removeAppointmentUser(appointment),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [queryKeys.appointments]})
      toast({title:"You have cancelled an appointment(done by Nishant)!",status:"warning"});
    }
  })

  return mutate;
}
