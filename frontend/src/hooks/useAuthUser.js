import { useQuery } from "@tanstack/react-query";
import { getAuthUser } from "../lib/api";

const useAuthUser = () => {
  const authUserQuery = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    retry: false,
  });

  return {
    isLoading: authUserQuery.isLoading,
    authUser: authUserQuery.data?.user, // karena dari backend => { success: true, user: {...} }
    error: authUserQuery.error,
  };
};

export default useAuthUser;
