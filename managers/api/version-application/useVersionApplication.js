import apiVersionApplication from "@/Api/apiVersion/apiNewVersion";
import { useQuery } from "@tanstack/react-query";

export const useVersionApplication = ({ stateOpenUpdatePopUp, enabled }) => {
  const fetchNewVersion = async () => {
    try {
      const response = await apiVersionApplication.apiGetNewVersion();
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  };

  return useQuery({
    queryKey: ["versionApplication", stateOpenUpdatePopUp],
    queryFn: fetchNewVersion,
    enabled: enabled
  });
};
