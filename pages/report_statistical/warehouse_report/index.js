import { useRouter } from "next/router";
import { useEffect } from "react";

const Index = (props) => {
    const router = useRouter();
    useEffect(() => {
        router.replace('/report_statistical/warehouse_report/card');
    }, [])

    return null
};

export default Index;
