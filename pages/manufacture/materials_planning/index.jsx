import Head from "next/head";
import dynamic from "next/dynamic";

import useStatusExprired from "@/hooks/useStatusExprired";
import { Container } from "@/components/UI/common/layout";
import { EmptyExprired } from "@/components/UI/common/emptyExprired";

// const Header = dynamic(() => import("./components/header/header"), { ssr: false });
import Header from "./components/header/header";


// const MainTable = dynamic(() => import("./components/table/mainTable"), { ssr: false });
import MainTable from "./components/table/mainTable";

const Index = (props) => {
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
                <MainTable {...propsDefault} />
            </Container>
        </>
    );
};
export default Index;
