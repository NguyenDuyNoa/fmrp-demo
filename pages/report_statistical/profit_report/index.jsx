import { useRouter } from "next/router";
import { useEffect } from "react";

const Index = (props) => {
    const router = useRouter();
    useEffect(() => {
        router.replace("/report_statistical/profit_report/profit");
    }, []);

    return null;
};

export default Index;
