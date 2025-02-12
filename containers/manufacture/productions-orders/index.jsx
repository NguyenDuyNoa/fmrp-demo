import { EmptyExprired } from "@/components/UI/common/EmptyExprired";
import { Container } from "@/components/UI/common/layout";
import useStatusExprired from "@/hooks/useStatusExprired";
import Head from "next/head";
import Header from "./components/header/header";
import MainTable from "./components/table/mainTable";
import { ProductionsOrdersProvider } from "./context/productionsOrders";

const ProductionsOrders = (props) => {
    const dataLang = props.dataLang;

    const propsDefault = { dataLang };

    const statusExprired = useStatusExprired();
    return (
        <>
            <Head>
                <title>{dataLang?.productions_orders || 'productions_orders'}</title>
            </Head>
            <Container className={'relative'}>
                {statusExprired ? <EmptyExprired /> : <Header {...propsDefault} />}
                <ProductionsOrdersProvider>
                    <MainTable {...propsDefault} />
                </ProductionsOrdersProvider>
            </Container>
        </>
    );
};
export default ProductionsOrders;
