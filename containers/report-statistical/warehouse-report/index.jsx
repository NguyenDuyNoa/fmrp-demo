import { useRouter } from "next/router";
import { useEffect } from "react";

const WarehouseReport = (props) => {
    const router = useRouter();
    useEffect(() => {
        router.replace('/report-statistical/warehouse-report/card');
    }, [])

    return null
};

export default WarehouseReport;
