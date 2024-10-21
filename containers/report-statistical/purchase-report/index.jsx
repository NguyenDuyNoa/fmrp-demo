import { useRouter } from "next/router";
import { useEffect } from "react";

const PurchaseReport = (props) => {
    const router = useRouter();
    useEffect(() => {
        router.replace('/report-statistical/purchase-report/purchases');
    }, [])

    return null
};

export default PurchaseReport;
