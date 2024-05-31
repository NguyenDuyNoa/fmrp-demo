import { useRouter } from "next/router";
import { useEffect } from "react";

const Index = (props) => {
    const router = useRouter();
    useEffect(() => {
        router.replace('/report_statistical/purchase_report/purchases');
    }, [])

    return null
};

export default Index;
