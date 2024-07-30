import { useRouter } from "next/router";
import { useEffect } from "react";

const Index = (props) => {
    const router = useRouter();
    useEffect(() => {
        router.replace('/report-statistical/production-manager/quota-materials');
    }, [])

    return null
};

export default Index;

