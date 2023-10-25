import Head from "next/head";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";

const Header = dynamic(() => import("./(header)/header"), { ssr: false });

const FilterHeader = dynamic(() => import("./(filterHeader)/filterHeader"), { ssr: false });

const BodyGantt = dynamic(() => import("./(gantt)"), { ssr: false });

const Index = (props) => {
    const dataLang = props.dataLang;
    const trangthaiExprired = useSelector((state) => state?.trangthaiExprired);
    const propss = {
        dataLang,
    };
    return (
        <>
            <Head>
                <title>{"Kế hoạch sản xuất"}</title>
            </Head>
            <div className="relative  3xl:pt-[88px] xxl:pt-[80px] 2xl:pt-[78px] xl:pt-[75px] lg:pt-[70px] pt-70 3xl:px-10 3xl:pb-10 2xl:px-10 2xl:pb-8 xl:px-10 xl:pb-10 lg:px-5 lg:pb-10 space-y-1 overflow-hidden h-screen">
                {trangthaiExprired ? <div className="p-4"></div> : <Header {...propss} />}
                <FilterHeader {...propss} />
                <BodyGantt {...propss} />
            </div>
        </>
    );
};
export default Index;
