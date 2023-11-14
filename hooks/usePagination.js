import { useRouter } from "next/router";

const usePagination = () => {
    const router = useRouter();

    const paginate = (pageNumber) => {
        router.push({
            pathname: router.route,
            query: {
                tab: router.query?.tab,
                page: pageNumber,
            },
        });
    };

    return { paginate };
};

export default usePagination;
