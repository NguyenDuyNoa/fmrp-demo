import { useRouter } from "next/router";

const usePagination = () => {

    const router = useRouter();

    const paginate = (pageNumber) => {
        const { tab, slug } = router.query;

        const query = { page: pageNumber };

        if (tab) {
            query.tab = tab;
        }

        if (slug) {
            query.slug = slug;
        }

        router.push({
            pathname: router.route,
            query: query,
        });
    };

    return { paginate };
};

export default usePagination;
