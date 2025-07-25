import { act, renderHook, waitFor } from "@testing-library/react";

import { useAppointments } from "../hooks/useAppointments";
import { AppointmentDateMap } from "../types";

import { createQueryClientWrapper } from "@/test-utils";
import {Appointment} from "@shared/types";


//a helper function to get the total number of appointments from an Appointment Date
const getAppointmentCount = (appointments:AppointmentDateMap) => {
    return Object.values(appointments).reduce(
        (runningCount,appointmentsOnDate)=>
            runningCount + appointmentsOnDate.length,0
    );
}

test("filter appointments by availability", async () => {
  const {result} = renderHook(()=> useAppointments(),
      {wrapper: createQueryClientWrapper()});
    //This will show the return value of the useAppointments hook
    console.log(result);

    // wait for appointments to populate
    await waitFor(()=>
        expect(getAppointmentCount(result.current.appointments))
            .toBeGreaterThan(0) )

    // appointments start out filtered(show only available)
    const filteredAppointmentsCount =  getAppointmentCount(
        result.current.appointments);

    // Run the setShowAll function and set it to true, to get all appointments
    act(()=> result.current.setShowAll(true))

    //wait for count of current appointments after setShowAll=true to be greater than filteredAppointmentsCount
    await waitFor(()=>
        expect(getAppointmentCount(result.current.appointments))
            .toBeGreaterThan(filteredAppointmentsCount))
});
