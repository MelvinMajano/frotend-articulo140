import { useQuery } from "@tanstack/react-query";
import { getDeletedActivities } from "@/articulo-140/admin/actions/getDeletedActivities";

export const useDeletedActivities = () => {
  const query = useQuery({
    queryKey: ["deletedActivities"],
    queryFn: () => getDeletedActivities(),
  });
  return { query };
};