import { useRouter } from "next/router";
import { useEffect } from "react";

const Index = (props) => {
    const router = useRouter();
    useEffect(() => {
        router.replace('/report-statistical/sales-report/quote');
    }, [])

    return null
};

export default Index;
