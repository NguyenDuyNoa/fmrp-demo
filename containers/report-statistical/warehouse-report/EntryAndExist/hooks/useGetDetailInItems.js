import apiReport from '@/Api/apiReport-Statistical/apiReport'
import { useQuery } from '@tanstack/react-query'

export const useGetDetailInItems = (data) => {
  return useQuery({
    queryKey: ['api_get_detail_in_items', data],
    queryFn: () => apiReport.apiGetDetailInItems({ params: data }),
    enabled: !!data,
  })
}

export const useGetDetailOutItems = (data) => {
  return useQuery({
    queryKey: ['api_get_detail_out_items', data],
    queryFn: () => apiReport.apiGetDetailOutItems({ params: data }),
    enabled: !!data,
  })
}