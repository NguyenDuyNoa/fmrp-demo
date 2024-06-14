import Head from "next/head";
import React, { useMemo } from "react";
import useStatusExprired from "@/hooks/useStatusExprired";
import "moment/locale/vi";

const Index = (props) => {
    // BigCalendar.momentLocalizer(moment);
    const statusExprired = useStatusExprired();

    return (
        <>
            <Head>
                <title>{"Lịch sản xuất"}</title>
            </Head>
            <div className="relative  3xl:pt-[88px] xxl:pt-[80px] 2xl:pt-[78px] xl:pt-[75px] lg:pt-[70px] pt-70 3xl:px-10 3xl:pb-10 2xl:px-10 2xl:pb-8 xl:px-10 xl:pb-10 lg:px-5 lg:pb-10 space-y-1 overflow-hidden h-screen">
                {statusExprired ? <div className="p-4"></div> : <></>}
                <div>

                </div>
            </div>
        </>
    );
};

export default Index;
