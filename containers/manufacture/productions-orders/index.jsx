import React from "react";

import { Container } from "@/components/UI/common/layout";
import Head from "next/head";
import MainTable from "./components/table/mainTable";

import { ProductionsOrdersProvider } from "./context/productionsOrders";

const ProductionsOrders = (props) => {
    const dataLang = props.dataLang;

    const propsDefault = { dataLang, typeScreen: props.type };

    return (
        <React.Fragment>
            <Head>
                <title>{dataLang?.productions_orders || 'productions_orders'}</title>
            </Head>
            <Container className={'relative'}>
                <ProductionsOrdersProvider>
                    <MainTable {...propsDefault} />
                </ProductionsOrdersProvider>
            </Container>
        </React.Fragment>
    );
};
export default ProductionsOrders;
