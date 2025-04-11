import apiVersionApplication from "@/Api/apiVersion/apiNewVersion";
import { useQuery } from "@tanstack/react-query";

export const useVersionApplication = ({ enabled }) => {
  const fetchNewVersion = async () => {
    try {
      const response = await apiVersionApplication.apiGetNewVersion();
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  };

  return useQuery({
    queryKey: ["versionApplication"],
    queryFn: fetchNewVersion,
    enabled: enabled
  });
};
