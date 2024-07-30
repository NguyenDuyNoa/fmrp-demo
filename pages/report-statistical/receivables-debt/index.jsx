import { useRouter } from "next/router";
import { useEffect } from "react";

const Index = (props) => {
    const router = useRouter();
    useEffect(() => {
        router.replace('/report-statistical/receivables-debt/aggregate-debt');
    }, [])

    return null
};

export default Index;
