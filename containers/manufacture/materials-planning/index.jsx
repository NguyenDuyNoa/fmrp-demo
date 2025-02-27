import { EmptyExprired } from "@/components/UI/common/EmptyExprired";
import { Container } from "@/components/UI/common/layout";
import useStatusExprired from "@/hooks/useStatusExprired";
import Head from "next/head";
import Header from "./components/header/header";
import MainTable from "./components/table/mainTable";
import { ProductionsOrdersProvider } from "../productions-orders/context/productionsOrders";

const MaterialsPlanning = (props) => {
    const dataLang = props.dataLang;

    const statusExprired = useStatusExprired();

    const propsDefault = { dataLang };

    return (
        <>
            <Head>
                <title>{dataLang?.materials_planning || 'materials_planning'}</title>
            </Head>
            <Container>
                {statusExprired ? <EmptyExprired /> : <Header {...propsDefault} />}
                <ProductionsOrdersProvider>
                    <MainTable {...propsDefault} />
                </ProductionsOrdersProvider>
            </Container>
        </>
    );
};
export default MaterialsPlanning;
