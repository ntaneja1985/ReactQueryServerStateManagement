import { toast } from "@/components/app/toast";
import {MutationCache, QueryCache, QueryClient, QueryClientConfig} from "@tanstack/react-query";

function createTitle(errorMsg:string, actionType: "query" | "mutation")
{
    const action = actionType ==="query" ? "fetch":"update";
    const title = `could not ${action} data: ${
        errorMsg ?? "error connecting to server"
    }`;

    return title;
}

function errorHandler(title: string) {
  // https://chakra-ui.com/docs/components/toast#preventing-duplicate-toast
  // one message per page load, not one message per query
  // the user doesn't care that there were three failed queries on the staff page
  //    (staff, treatments, user)
  const id = "react-query-toast";

  if (!toast.isActive(id)) {

    toast({ id, title, status: "error", variant: "subtle", isClosable: true });
  }
}

export const queryClientOptions: QueryClientConfig = {
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
            const title = createTitle(error.message,"query")
            errorHandler(title);
        },
    }),
    mutationCache: new MutationCache({
        onError: (error) => {
            const title = createTitle(error.message,"mutation")
            errorHandler(title);
        },
    })
}

export const queryClient = new QueryClient(queryClientOptions);
