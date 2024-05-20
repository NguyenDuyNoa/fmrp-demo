import { useRouter } from "next/router";
import { useEffect } from "react";

const Index = (props) => {
    const router = useRouter();
    useEffect(() => {
        router.replace('/report_statistical/receivables_debt/aggregate_debt');
    }, [])

    return null
};

export default Index;
