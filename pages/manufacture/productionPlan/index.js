import Head from "next/head";
import { useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { v4 as uuid } from "uuid";
import Header from "./(header)/header";
import FilterHeader from "./(filterHeader)/filterHeader";

const Index = (props) => {
    const dataLang = props.dataLang;
    const trangthaiExprired = useSelector((state) => state?.trangthaiExprired);

    return (
        <>
            <Head>
                <title>{"Kế hoạch sản xuất"}</title>
            </Head>
            <div className="relative  3xl:pt-[88px] xxl:pt-[80px] 2xl:pt-[78px] xl:pt-[75px] lg:pt-[70px] pt-70 3xl:px-10 3xl:pb-10 2xl:px-10 2xl:pb-8 xl:px-10 xl:pb-10 lg:px-5 lg:pb-10 space-y-1 overflow-hidden h-screen">
                {trangthaiExprired ? <div className="p-4"></div> : <Header />}
                <FilterHeader />
            </div>
        </>
    );
};
export default Index;
