import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import TabClient from "./(tab)/tabExport";
import FormClient from "./(client)/client";
import { useState } from "react";
import { _ServerInstance as Axios } from "/services/axios";
import Select from "react-select";
import { useRef } from "react";
import Loading from "components/UI/loading";

import ReactExport from "react-data-export";
import FormClientEndSuplier from "./(client)/client";
import ClientEndSuplier from "./(client)/client";
import ClientSuplier from "./(client)/client";
import Client from "./(client)/client";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const Index = (props) => {
    const trangthaiExprired = useSelector((state) => state?.trangthaiExprired);

    const scrollAreaRef = useRef(null);

    const handleMenuOpen = () => {
        const menuPortalTarget = scrollAreaRef.current;
        return { menuPortalTarget };
    };

    const dataLang = props?.dataLang;

    const [onFetching, sOnFetching] = useState(false);

    const router = useRouter();

    const tabPage = router.query?.tab;

    const [dataColumn, sDataColumn] = useState([]);

    const [clientAffter, sClientAffter] = useState({
        clients: [],
        contacts: [],
        address: [],
    });

    const [dataConditionColumn, sDataConditionColumn] = useState([
        { label: "hi1", value: 1 },
        { label: "hi2", value: 2 },
        { label: "hi3", value: 3 },
    ]);

    const [conditionColumn, sConditionColumn] = useState(null);

    const [sampleImport, sSampleImport] = useState(null);

    const [onFetchTemple, sOnFetchTemple] = useState(false);

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
                // const dataConcat = (arrays) => {
                //     return arrays.flat();
                // };
                // const resultArray = dataConcat([db.clients, db.address, db.contacts]);
                sDataColumn(db);
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

    const _HandleChange = (value, type) => {
        if (type == "conditionColumn" && value != conditionColumn) {
            sConditionColumn(value);
            sOnFetchTemple(true);
            setTimeout(() => {
                sOnFetchTemple(false);
            }, 500);
        } else if (type == "sampleImport") {
            sSampleImport(value);
        }
    };

    return (
        <div>
            <Head>
                <title>{"Export dữ liệu"}</title>
            </Head>
            <div className="px-10 xl:pt-24 pt-[88px] pb-10 h-screen overflow-hidden">
                {trangthaiExprired ? (
                    <div className="p-2"></div>
                ) : (
                    <div className="flex space-x-3 xl:text-[14.5px] text-[12px]">
                        <h6 className="text-[#141522]/40">{"Export dữ liệu"}</h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>{dataLang?.import_category || "import_category"}</h6>
                    </div>
                )}
                <div className="mx-auto flex-col flex gap-3">
                    <h2 className="text-2xl text-[#52575E] capitalize">{"Export dữ liệu danh mục"}</h2>

                    <div className="col-span-6 flex flex-nowrap gap-4 items-center ">
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
                    <div className="">
                        {onFetchTemple ? (
                            <Loading />
                        ) : (
                            tabPage == 1 && (
                                <Client
                                    dataColumn={dataColumn}
                                    sDataColumn={sDataColumn}
                                    dataLang={dataLang}
                                    sClientAffter={sClientAffter}
                                    clientAffter={clientAffter}
                                />
                            )
                        )}
                    </div>
                    {/* <div className="bg-gray-300 p-1.5 rounded-md relative">
                        <div className="absolute bg-sky-600 top-0 left-0 w-1/3 h-full rounded-md"></div>
                    </div> */}
                    <div className="w-full bg-gray-200 rounded-lg dark:bg-gray-700">
                        <div
                            className="bg-sky-600 text-xs font-medium text-sky-100 text-center leading-none rounded-lg"
                            style={{
                                width: "20%",
                            }}
                        >
                            20%
                        </div>
                    </div>
                    <div className="col-span-12 mt-2 grid-cols-12 grid gap-2.5 justify-center">
                        <div className="col-span-4">
                            <Select
                                closeMenuOnSelect={true}
                                placeholder={"Chọn mẫu Export dữ liệu"}
                                options={dataConditionColumn}
                                isSearchable={true}
                                onChange={(e) => _HandleChange(e, "conditionColumn")}
                                value={conditionColumn}
                                LoadingIndicator
                                noOptionsMessage={() => dataLang?.import_no_data || "import_no_data"}
                                maxMenuHeight="200px"
                                menuPosition="fixed"
                                isClearable={true}
                                menuPortalTarget={document.body}
                                onMenuOpen={handleMenuOpen}
                                theme={(theme) => ({
                                    ...theme,
                                    colors: {
                                        ...theme.colors,
                                        primary25: "#EBF5FF",
                                        primary50: "#92BFF7",
                                        primary: "#0F4F9E",
                                    },
                                })}
                                styles={{
                                    placeholder: (base) => ({
                                        ...base,
                                        color: "#cbd5e1",
                                    }),
                                    menuPortal: (base) => ({
                                        ...base,
                                        zIndex: 9999,
                                        position: "absolute",
                                    }),
                                }}
                                className={`placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] 2xl:text-[12px] xl:text-[13px] text-[12px] font-normal outline-none border `}
                            />
                        </div>
                        {tabPage != 5 && tabPage != 6 ? (
                            <div className="col-span-4 flex items-center  space-x-2 rounded p-2 hover:bg-gray-200 bg-gray-100 cursor-pointer btn-animation hover:scale-[1.02]">
                                <input
                                    type="checkbox"
                                    onChange={(e) => _HandleChange(e, "sampleImport")}
                                    checked={sampleImport}
                                    value={sampleImport}
                                    id="example12"
                                    name="checkGroup1"
                                    className="h-4 w-4 rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 focus:ring-offset-0 disabled:cursor-not-allowed disabled:text-gray-400"
                                />
                                <label htmlFor="example12" className=" space-x-2 text-sm cursor-pointer">
                                    {"Lưu mẫu export"}
                                </label>
                            </div>
                        ) : (
                            <div></div>
                        )}
                        <button
                            // onClick={_HandleSubmit.bind(this)}
                            type="button"
                            className="col-span-4 xl:text-sm text-xs p-2.5  bg-gradient-to-l hover:bg-blue-300 from-blue-500 via-blue-500  to-blue-500 text-white rounded btn-animation hover:scale-[1.02] flex items-center gap-1 justify-center z-0"
                        >
                            <div
                                className={
                                    "w-4 h-4 border-2 rounded-full border-pink-200 border-t-rose-500 animate-spin"
                                }
                            ></div>
                            <span>{"Export dữ liệu"}</span>
                        </button>
                        {/* <div className="col-span-2"></div> */}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Index;
