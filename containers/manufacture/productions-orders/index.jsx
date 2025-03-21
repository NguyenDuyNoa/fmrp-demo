import { EmptyExprired } from "@/components/UI/common/EmptyExprired";
import { Container } from "@/components/UI/common/layout";
import useStatusExprired from "@/hooks/useStatusExprired";
import Head from "next/head";
import Header from "./components/header/header";
import MainTable from "./components/table/mainTable";
import { ProductionsOrdersProvider } from "./context/productionsOrders";
import React from "react";
import BreadcrumbCustom from "@/components/UI/breadcrumb/BreadcrumbCustom";
import ButtonAnimationNew from "@/components/UI/button/ButtonAnimationNew";
import FilterDropdown from "@/pages/dropdown/FilterDropdown";
import CaretDownIcon from "@/components/icons/common/CaretDownIcon";
import FunnelIcon from "@/components/icons/common/FunnelIcon";
import { useSelector } from "react-redux";


const ProductionsOrders = (props) => {
    const dataLang = props.dataLang;

    const propsDefault = { dataLang, typeScreen: props.type };

    const breadcrumbItems = [
        {
            label: `${dataLang?.materials_planning_manufacture || "materials_planning_manufacture"}`,
            href: "/"
        },
        {
            label: `${dataLang?.productions_orders || 'productions_orders'}`,
        }
    ];

    console.log('props', props);
    console.log('propsDefault', propsDefault);


    const typePageMoblie = props.type == 'mobile'

    const statusExprired = useStatusExprired();

    return (
        <React.Fragment>
            <Head>
                <title>{dataLang?.productions_orders || 'productions_orders'}</title>
            </Head>
            <Container className={'relative'}>
                {
                    typePageMoblie ?
                        (null)
                        :
                        (
                            statusExprired
                                ?
                                <EmptyExprired />
                                :
                                <React.Fragment>
                                    <BreadcrumbCustom items={breadcrumbItems} className="3xl:text-sm 2xl:text-[11px] xl:text-[10px] lg:text-[10px]" />
                                </React.Fragment>
                        )
                }
                <ProductionsOrdersProvider>
                    <MainTable {...propsDefault} />
                </ProductionsOrdersProvider>
            </Container>
        </React.Fragment>
    );
};
export default ProductionsOrders;
