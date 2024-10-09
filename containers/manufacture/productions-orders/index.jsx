import Head from "next/head";

import { EmptyExprired } from "@/components/UI/common/EmptyExprired";
import { Container } from "@/components/UI/common/layout";
import useStatusExprired from "@/hooks/useStatusExprired";

import Header from "./components/header/header";

import MainTable from "./components/table/mainTable";

const ProductionsOrders = (props) => {
    const dataLang = props.dataLang;

    const statusExprired = useStatusExprired();

    const propsDefault = { dataLang };

    return (
        <>
            <Head>
                <title>{dataLang?.productions_orders || 'productions_orders'}</title>
            </Head>
            <Container className={'relative'}>
                {statusExprired ? <EmptyExprired /> : <Header {...propsDefault} />}
                <MainTable {...propsDefault} />
            </Container>
        </>
    );
};
export default ProductionsOrders;
