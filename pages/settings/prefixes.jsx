import Head from "next/head";
import React, { useEffect, useState } from "react";

import { ListBtn_Setting } from "./information";
import { _ServerInstance as Axios } from "/services/axios";

import { Customscrollbar } from "@/components/UI/common/customscrollbar";
import { EmptyExprired } from "@/components/UI/common/emptyExprired";
import { Container, ContainerBody } from "@/components/UI/common/layout";
import useStatusExprired from "@/hooks/useStatusExprired";
import Swal from "sweetalert2";
import apiPrefix from "@/Api/apiSettings/apiPrefix";

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
});

const Index = (props) => {
    const dataLang = props.dataLang;
    const statusExprired = useStatusExprired()
    const [onFetching, sOnFetching] = useState(false);
    const [onSending, sOnSending] = useState(false);
    const [data, sData] = useState([]);
    const [err, sErr] = useState(false);

    const _ServerFetching = async () => {
        try {
            const { rResult } = await apiPrefix.apiListPrefix()
            sData(rResult);
        } catch (error) {

        }
    };

    useEffect(() => {
        onFetching && _ServerFetching();
    }, [onFetching]);

    useEffect(() => {
        sOnFetching(true);
    }, []);

    const _HandleChangeInput = (id, value) => {
        const index = data.findIndex((x) => x.id === id);
        data[index].prefix = value.target?.value;
        sData([...data]);
    };

    const _ServerSending = async () => {
        let formData = new FormData();

        data.forEach((item, index) => {
            formData.append(`data[${index}][id]`, item.id);
            formData.append(`data[${index}][type]`, item.type);
            formData.append(`data[${index}][prefix]`, item.prefix);
        });

        try {
            const { isSuccess, message } = await apiPrefix.apiHandingPrefix(formData)

            if (isSuccess) {
                Toast.fire({
                    icon: "success",
                    title: dataLang[message] || message,
                });
            } else {
                Toast.fire({
                    icon: "error",
                    title: dataLang[message] || message,
                });
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
        const hasEmptyName = data.some((item) => item.prefix === "");
        if (hasEmptyName) {
            sErr(true);
        } else {
            sErr(false);
            sOnSending(true);
        }
    };

    return (
        <React.Fragment>
            <Head>
                <title>Thiết lập tiếp đầu ngữ</title>
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
                        <h6>Thiết lập tiếp đầu ngữ</h6>
                    </div>
                )}
                <div className="grid grid-cols-9 gap-5 h-[99%]">
                    <div className="col-span-2 h-fit p-5 rounded bg-[#E2F0FE] space-y-3 sticky ">
                        <ListBtn_Setting dataLang={dataLang} />
                    </div>
                    <ContainerBody>
                        <div className="space-y-7 h-[96%] overflow-hidden">
                            <h2 className="3xl:text-2xl 2xl:text-xl xl:text-lg text-base text-[#52575E] capitalize">
                                Thiết Lập Tiếp Đầu Ngữ
                            </h2>
                            <Customscrollbar
                                className="max-h-[600px] min:h-[500px] h-[85%] max:h-[800px]"
                            >
                                <div className="grid grid-cols-2 gap-5">
                                    {data.map((e) => (
                                        <div>
                                            <div
                                                key={e.id?.toString()}
                                                className="flex items-center space-x-3 pr-10"
                                            >
                                                <label className="w-40">
                                                    {dataLang[e.type] || e.type}{" "}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </label>
                                                <input
                                                    value={e.prefix}
                                                    onChange={_HandleChangeInput.bind(
                                                        this,
                                                        e.id
                                                    )}
                                                    type="text"
                                                    placeholder={`Nhập ${dataLang[e.type] ||
                                                        e.type
                                                        }`}
                                                    className={`focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-60 bg-[#ffffff] rounded text-[#52575E] font-normal  p-2 border outline-none`}
                                                />
                                            </div>
                                            {err && e.prefix === "" && (
                                                <label className="text-sm text-red-500">
                                                    Vui lòng nhập{" "}
                                                    {dataLang[e.type] || e.type}
                                                </label>
                                            )}
                                        </div>
                                    ))}
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
