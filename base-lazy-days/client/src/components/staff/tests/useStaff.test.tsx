import { act, renderHook, waitFor } from "@testing-library/react";

import { useStaff } from "../hooks/useStaff";
import type { Staff } from "@shared/types";

import { createQueryClientWrapper } from "@/test-utils";
import {AppointmentDateMap} from "@/components/appointments/types";



test("filter staff", async () => {
    const {result} = renderHook(()=> useStaff(),
        {wrapper: createQueryClientWrapper()});
    //This will show the return value of the useAppointments hook
    console.log(result);

    // wait for appointments to populate
    await waitFor(()=>
        expect(result.current.staff.length)
            .toBeGreaterThan(0) )

    // get current Staff Length
    const allStaffLength =  result.current.staff.length;

    //update the filter state
    act(()=> result.current.setFilter("facial"))

    await waitFor(()=>
        expect(result.current.staff.length)
            .toBeLessThan(allStaffLength))
});
