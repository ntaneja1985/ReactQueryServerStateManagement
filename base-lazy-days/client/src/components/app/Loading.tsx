import { Spinner, Text } from "@chakra-ui/react";
import {useIsFetching, useIsMutating} from "@tanstack/react-query";

export function Loading() {
  // will use React Query `useIsFetching` to determine whether or not to display
  const isFetching = useIsFetching(); // returns an integer, if > 0, then query calls are still pending, if 0, then it will give false
  const isMutating = useIsMutating();
  const display = isFetching || isMutating ? "inherit" : "none";

  return (
    <Spinner
      thickness="4px"
      speed="0.65s"
      emptyColor="olive.200"
      color="olive.800"
      role="status"
      position="fixed"
      zIndex="9999"
      top="50%"
      left="50%"
      transform="translate(-50%, -50%)"
      display={display}
    >
      <Text display="none">Loading...</Text>
    </Spinner>
  );
}
