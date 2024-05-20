import { useRouter } from "next/router";
import { useEffect } from "react";

const Index = (props) => {
    const router = useRouter();
    useEffect(() => {
        router.replace('/report_statistical/fund_balance/autumn_diary');
    }, [])

    return null
};

export default Index;
