import React from "react";

import { Container } from "@/components/UI/common/layout";
import Head from "next/head";

import { ProductionsOrdersProvider } from "./context/productionsOrders";
import ProductionsOrderMain from "./components/main/ProductionsOrderMain";

const ProductionsOrders = (props) => {
    const propsDefault = { dataLang: props.dataLang, typeScreen: props.type };

    return (
        <React.Fragment>
            <Head>
                <title>{propsDefault?.dataLang?.productions_orders || 'productions_orders'}</title>
            </Head>
            <Container className={'relative 3xl:!space-y-3 !space-y-2'}>
                <ProductionsOrdersProvider>
                    <ProductionsOrderMain {...propsDefault} />
                </ProductionsOrdersProvider>
            </Container>
        </React.Fragment>
    );
};
export default ProductionsOrders;
