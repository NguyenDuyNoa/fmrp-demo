import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useGetNumberOfWordsList = () => {
    const data = [
        {
            "id": 1,
            "name": "50 Từ",
            "content": "tối đa 50 từ"
        },
        {
            "id": 2,
            "name": "100 Từ",
            "content": "tối đa 100 từ"
        },
        {
            "id": 3,
            "name": "150 Từ",
            "content": "tối đa 150 từ"
        },
        {
            "id": 4,
            "name": "200 Từ",
            "content": "tối đa 200 từ"
        }
    ]
    const fetchNumberOfWordsList = async () => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(data), 1000);
        });
    };

    return useQuery({
        queryKey: ["getNumberOfWordsList"],
        queryFn: fetchNumberOfWordsList,
        placeholderData: keepPreviousData,
    });
};
