import Head from "next/head";

import { EmptyExprired } from "@/components/UI/common/EmptyExprired";
import { Container } from "@/components/UI/common/layout";
import useStatusExprired from "@/hooks/useStatusExprired";

import Header from "./components/header/header";

import MainTable from "./components/table/mainTable";

const Index = (props) => {
    const dataLang = props.dataLang;

    const statusExprired = useStatusExprired();

    const propsDefault = { dataLang };

    return (
        <>
            <Head>
                <title>{'Lệnh sản xuất'}</title>
            </Head>
            <Container className={'relative'}>
                {statusExprired ? <EmptyExprired /> : <Header {...propsDefault} />}
                <MainTable {...propsDefault} />
            </Container>
        </>
    );
};
export default Index;
