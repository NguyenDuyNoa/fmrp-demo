import { useRouter } from "next/router";
import { useEffect } from "react";

const FundBalance = (props) => {
    const router = useRouter();
    useEffect(() => {
        router.replace('/report-statistical/fund-balance/autumn-diary');
    }, [])

    return null
};

export default FundBalance;
