import { toast } from "@/components/app/toast";
import {QueryCache, QueryClient} from "@tanstack/react-query";

function errorHandler(errorMsg: string) {
  // https://chakra-ui.com/docs/components/toast#preventing-duplicate-toast
  // one message per page load, not one message per query
  // the user doesn't care that there were three failed queries on the staff page
  //    (staff, treatments, user)
  const id = "react-query-toast";

  if (!toast.isActive(id)) {
    const action = "fetch";
    const title = `could not ${action} data: ${
      errorMsg ?? "error connecting to server"
    }`;
    toast({ id, title, status: "error", variant: "subtle", isClosable: true });
  }
}


export const queryClient = new QueryClient({
    //Configure refetch options globally here
    defaultOptions:{
        queries:{
            staleTime:600000, //10 minutes
            gcTime: 900000, //15 minutes
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
        }
    },

    //Add the query cache for the global error handler
    queryCache: new QueryCache({
        onError: (error) => {
            errorHandler(error.message);
        },
    })
});
