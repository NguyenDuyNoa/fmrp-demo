import Head from "next/head";
import dynamic from "next/dynamic";

import useStatusExprired from "@/hooks/useStatusExprired";
import { Container } from "@/components/UI/common/layout";
import { EmptyExprired } from "@/components/UI/common/EmptyExprired";

const Header = dynamic(() => import("./components/header/header"), { ssr: false });


const MainTable = dynamic(() => import("./components/table/mainTable"), { ssr: false });

const Index = (props) => {
    const dataLang = props.dataLang;

    const trangthaiExprired = useStatusExprired();

    const propsDefault = { dataLang };

    return (
        <>
            <Head>
                <title>{"Kế hoạch nguyên vật liệu"}</title>
            </Head>
            <Container>
                {trangthaiExprired ? <EmptyExprired /> : <Header {...propsDefault} />}
                <MainTable {...propsDefault} />
            </Container>
        </>
    );
};
export default Index;
