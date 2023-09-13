import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import TabClient from "./(tab)/tabExport";
import FormClient from "./(formClient)/formClient";
import { useState } from "react";
import { _ServerInstance as Axios } from "/services/axios";

const Index = (props) => {
    const trangthaiExprired = useSelector((state) => state?.trangthaiExprired);
    const dataLang = props?.dataLang;
    const [onFetching, sOnFetching] = useState(false);
    const router = useRouter();
    const tabPage = router.query?.tab;
    const [dataColumn, sDataColumn] = useState([]);

    const dataTab = [
        {
            id: 1,
            name: "Khách hàng",
        },
        {
            id: 2,
            name: "Nhà cung cấp",
        },
        {
            id: 3,
            name: "Nguyên vật liệu",
        },
        {
            id: 4,
            name: "Thành phẩm",
        },
        {
            id: 5,
            name: "Công đoạn",
        },
        {
            id: 6,
            name: "Định mức BOM",
        },
    ];

    const _HandleSelectTab = (e) => {
        router.push({
            pathname: router.route,
            query: { tab: e },
        });
    };

    useEffect(() => {
        router.push({
            pathname: router.route,
            query: { tab: router.query?.tab ? router.query?.tab : 1 },
        });
    }, []);

    const _FetchDataColumn = () => {
        const apiDataComlumn = {
            1: "/api_web/Api_import_data/get_field_client?csrf_protection=true",
            2: "/api_web/Api_import_data/get_field_suppliers?csrf_protection=true",
            3: "/api_web/Api_import_data/get_field_materials?csrf_protection=true",
            4: "/api_web/Api_import_data/get_field_products?csrf_protection=true",
        };
        const apiUrlComLumn = apiDataComlumn[tabPage] || "";

        Axios("GET", `${apiUrlComLumn}`, {}, (err, response) => {
            if (!err) {
                var db = response.data;
                console.log("db", db);
            }
        });
        sOnFetching(false);
    };
    useEffect(() => {
        onFetching && _FetchDataColumn();
    }, [onFetching]);
    useEffect(() => {
        router.query.tab && sOnFetching(true);
    }, [router.query?.page, router.query?.tab]);

    return (
        <div>
            <Head>
                <title>{"Export dữ liệu"}</title>
            </Head>
            <div className="px-10 xl:pt-24 pt-[88px] pb-10">
                {trangthaiExprired ? (
                    <div className="p-2"></div>
                ) : (
                    <div className="flex space-x-3 xl:text-[14.5px] text-[12px]">
                        <h6 className="text-[#141522]/40">{"Export dữ liệu"}</h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>{dataLang?.import_category || "import_category"}</h6>
                    </div>
                )}
                <div className="mx-auto h-full overflow-hidden">
                    <h2 className="text-2xl text-[#52575E] capitalize">{"Export dữ liệu danh mục"}</h2>
                    <div className="grid grid-cols-6 items-center gap-1 justify-center mt-1">
                        {dataTab &&
                            dataTab.map((e) => {
                                return (
                                    <div>
                                        <TabClient
                                            key={e.id}
                                            onClick={_HandleSelectTab.bind(this, `${e.id}`)}
                                            active={e.id}
                                            className="text-[#0F4F9E] my-1 bg-[#e2f0fe] hover:bg-blue-400 hover:text-white transition-all ease-linear"
                                        >
                                            {e.name}
                                        </TabClient>
                                    </div>
                                );
                            })}
                    </div>
                    <div className="bg-gray-100">
                        <FormClient dataLang={dataLang} />
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Index;
