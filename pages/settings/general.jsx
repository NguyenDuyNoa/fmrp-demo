import apiDashboard from "@/Api/apiDashboard/apiDashboard";
import apiGeneral from "@/Api/apiSettings/apiGeneral";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import { EmptyExprired } from "@/components/UI/common/EmptyExprired";
import { Container, ContainerBody } from "@/components/UI/common/layout";
import useStatusExprired from "@/hooks/useStatusExprired";
import useToast from "@/hooks/useToast";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { ListBtn_Setting } from "./information";

const Index = (props) => {
    const dataLang = props.dataLang;

    const isShow = useToast();

    const [onFetching, sOnFetching] = useState(false);

    const statusExprired = useStatusExprired();

    const [onSending, sOnSending] = useState(false);

    const [dataMaterialExpiry, sDataMaterialExpiry] = useState({});

    const [dataProductExpiry, sDataProductExpiry] = useState({});

    const [dataProductSerial, sDataProductSerial] = useState({});

    const [data, sData] = useState([]);

    const _ServerFetching = async () => {
        try {
            const data = await apiDashboard.apiFeature();
            sDataMaterialExpiry(data.find((x) => x.code == "material_expiry"));
            sDataProductExpiry(data.find((x) => x.code == "product_expiry"));
            sDataProductSerial(data.find((x) => x.code == "product_serial"));
        } catch (error) {

        }
    };

    useEffect(() => {
        onFetching && _ServerFetching();
    }, [onFetching]);

    useEffect(() => {
        sOnFetching(true);
    }, []);

    const _ToggleStatus = (code) => {
        if (code == "material_expiry") {
            if (dataMaterialExpiry?.is_enable == "0") {
                sDataMaterialExpiry({ ...dataMaterialExpiry, is_enable: "1" });
            } else if (dataMaterialExpiry?.is_enable == "1") {
                sDataMaterialExpiry({ ...dataMaterialExpiry, is_enable: "0" });
            }
        } else if (code == "product_expiry") {
            if (dataProductExpiry?.is_enable == "0") {
                if (dataProductSerial?.is_enable == "0") {
                    sDataProductExpiry({ ...dataProductExpiry, is_enable: "1", });
                } else {
                    sDataProductExpiry({ ...dataProductExpiry, is_enable: "1", });
                    sDataProductSerial({ ...dataProductSerial, is_enable: "0", });
                }
            } else if (dataProductExpiry?.is_enable == "1") {
                sDataProductExpiry({ ...dataProductExpiry, is_enable: "0" });
            }
        } else if (code == "product_serial") {
            if (dataProductSerial?.is_enable == "0") {
                if (dataProductExpiry?.is_enable == "0") {
                    sDataProductSerial({ ...dataProductSerial, is_enable: "1", });
                } else {
                    sDataProductSerial({ ...dataProductSerial, is_enable: "1", });
                    sDataProductExpiry({ ...dataProductExpiry, is_enable: "0", });
                }
            } else if (dataProductSerial?.is_enable == "1") {
                sDataProductSerial({ ...dataProductSerial, is_enable: "0" });
            }
        }
    };

    const _ServerSending = async () => {
        let formData = new FormData();

        data.forEach((item, index) => {
            formData.append(`feature[${index}][code]`, item.code);
            formData.append(`feature[${index}][is_enable]`, item.is_enable);
        });
        try {
            const { isSuccess, message } = await apiGeneral.apiHanding(formData);
            if (isSuccess) {
                isShow("success", props.dataLang[message]);
            } else {
                isShow("error", props.dataLang[message]);
            }
        } catch (error) {

        }
        sOnSending(false);
    };

    useEffect(() => {
        onSending && _ServerSending();
    }, [onSending]);

    const _HandleSubmit = (e) => {
        e.preventDefault();
        sData([{ ...dataMaterialExpiry }, { ...dataProductExpiry }, { ...dataProductSerial }]);
        sOnSending(true);
    };

    return (
        <React.Fragment>
            <Head>
                <title>Thiết lập chung</title>
            </Head>
            <Container>
                {statusExprired ? (
                    <EmptyExprired />
                ) : (
                    <div className="flex space-x-1 mt-4 3xl:text-sm 2xl:text-[11px] xl:text-[10px] lg:text-[10px]">
                        <h6 className="text-[#141522]/40">
                            {dataLang?.branch_seting || "branch_seting"}
                        </h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>Thiết lập chung</h6>
                    </div>
                )}
                <div className="grid grid-cols-9 gap-5 h-[99%]">
                    <div className="col-span-2 h-fit p-5 rounded bg-[#E2F0FE] space-y-3 sticky ">
                        <ListBtn_Setting dataLang={dataLang} />
                    </div>
                    <ContainerBody className="col-span-7 h-[100%] flex flex-col justify-between overflow-hidden">
                        <div className="space-y-5 h-[96%] overflow-hidden">
                            <h2 className="3xl:text-2xl 2xl:text-xl xl:text-lg text-base text-[#52575E] capitalize">
                                Thiết Lập Chung
                            </h2>
                            <Customscrollbar
                                className="max-h-[600px] min:h-[500px] h-[90%] max:h-[800px]"
                            >
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <h1 className="text-[15px] uppercase w-full p-3 rounded bg-[#ECF0F4]">
                                            nguyên vật liệu
                                        </h1>
                                        <div className="divide-y divide-[#ECF0F4]">
                                            <div className="space-y-2 py-1.5">
                                                <h6>Quản lý thời hạn sử dụng</h6>
                                                <label
                                                    htmlFor={dataMaterialExpiry.code}
                                                    className="relative inline-flex items-center cursor-pointer ml-1"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        className="sr-only peer"
                                                        value={dataMaterialExpiry.is_enable}
                                                        id={dataMaterialExpiry.code}
                                                        checked={dataMaterialExpiry.is_enable == "0" ? false : true}
                                                        onChange={_ToggleStatus.bind(this, dataMaterialExpiry.code)}
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <h1 className="text-[15px] uppercase w-full p-3 rounded bg-[#ECF0F4]">
                                            thành phẩm
                                        </h1>
                                        <div className="divide-y divide-[#ECF0F4]">
                                            <div className="space-y-2 py-1.5">
                                                <h6>Quản lý thời hạn sử dụng</h6>
                                                <label
                                                    htmlFor={dataProductExpiry.code}
                                                    className="relative inline-flex items-center cursor-pointer ml-1"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        className="sr-only peer"
                                                        value={dataProductExpiry.is_enable}
                                                        id={dataProductExpiry.code}
                                                        checked={dataProductExpiry.is_enable == "0" ? false : true}
                                                        onChange={_ToggleStatus.bind(this, dataProductExpiry.code)}
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                                </label>
                                            </div>
                                            <div className="space-y-2 py-1.5">
                                                <h6>Quản lý serial</h6>
                                                <label
                                                    htmlFor={dataProductSerial.code}
                                                    className="relative inline-flex items-center cursor-pointer ml-1"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        className="sr-only peer"
                                                        value={dataProductSerial.is_enable}
                                                        id={dataProductSerial.code}
                                                        checked={dataProductSerial.is_enable == "0" ? false : true}
                                                        onChange={_ToggleStatus.bind(this, dataProductSerial.code)}
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Customscrollbar>
                        </div>
                        <div className="flex space-x-5 py-5 ml-1">
                            <button
                                onClick={_HandleSubmit.bind(this)}
                                className="px-8 py-2.5 rounded transition hover:scale-105 bg-[#0F4F9E] text-white"
                            >
                                Lưu
                            </button>
                        </div>
                    </ContainerBody>
                </div>
            </Container>
        </React.Fragment>
    );
};

export default Index;
