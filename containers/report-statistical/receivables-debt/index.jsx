import { useRouter } from "next/router";
import { useEffect } from "react";

const ReceivablesDebt = (props) => {
    const router = useRouter();
    useEffect(() => {
        router.replace('/report-statistical/receivables-debt/aggregate-debt');
    }, [])

    return null
};

export default ReceivablesDebt;
