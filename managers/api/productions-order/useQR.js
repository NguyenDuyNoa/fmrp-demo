import apiProducts from "@/Api/apiProducts/products/apiProducts";
import { useQuery } from "@tanstack/react-query";

export const useQRCodProductCompleted = (id) => {
  return useQuery({
    queryKey: ["api_qr_product_complete", id],
    queryFn: async () => {
      const response = await apiProducts.apiGetQRProductCompleted(id);
      return response;
    },
    enabled: !!id
  });
};
