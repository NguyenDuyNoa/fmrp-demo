import { useRouter } from "next/router";
import { useEffect } from "react";

const Index = (props) => {
    const router = useRouter();
    useEffect(() => {
        router.replace('/report_statistical/production_manager/quota_materials');
    }, [])

    return null
};

export default Index;

