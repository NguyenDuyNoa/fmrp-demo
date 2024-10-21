// Báo cáo lợi nhuận
import OnResetData from "@/components/UI/btnResetData/btnReset";
import ContainerPagination from "@/components/UI/common/ContainerPagination/ContainerPagination";
import TitlePagination from "@/components/UI/common/ContainerPagination/TitlePagination";
import { EmptyExprired } from "@/components/UI/common/EmptyExprired";
import { ColumnTable, RowItemTable, RowTable } from "@/components/UI/common/Table";
import { Container } from "@/components/UI/common/layout";
import DropdowLimit from "@/components/UI/dropdowLimit/dropdowLimit";
import SelectComponent from "@/components/UI/filterComponents/selectComponent";
import MultiValue from "@/components/UI/mutiValue/multiValue";
import Pagination from "@/components/UI/pagination";
import useSetingServer from "@/hooks/useConfigNumber";
import { useLimitAndTotalItems } from "@/hooks/useLimitAndTotalItems";
import useStatusExprired from "@/hooks/useStatusExprired";
import formatNumberConfig from "@/utils/helpers/formatnumber";
import { Grid6 } from "iconsax-react";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import TitleHeader from "../components/titleHeader";
import usePagination from "@/hooks/usePagination";
const ProfitReport = (props) => {
    const dataLang = props.dataLang;

    const dataSeting = useSetingServer();

    const router = useRouter();

    const refHeader = useRef(null);

    const refRow = useRef();

    const { paginate } = usePagination();

    const statusExprired = useStatusExprired();

    const { limit, updateLimit: sLimit, totalItems, updateTotalItems: sTotalItems } = useLimitAndTotalItems();
    const formatNumber = (number) => {
        return formatNumberConfig(+number, dataSeting);
    };

    const initialState = {
        total: {},
        data: [
            {
                id: uuidv4(),
                name: "Doanh thu bán hàng (1)",
            },
            {
                id: uuidv4(),
                name: "test 2",
            },
        ],
        onFetching: false,
        valueMonth: [],
        valueYear: [],
        columnTable: [],
    };

    const [isState, setState] = useState(initialState);

    const queryState = (key) => setState((prev) => ({ ...prev, ...key }));

    useEffect(() => {
        if (isState.valueYear.length === 0 || isState.valueMonth.length === 0) {
            queryState({ columnTable: [] });
        }

        const newData = isState.valueMonth
            .map((month) => {
                return isState.valueYear.map((year) => {
                    return {
                        month: month.label,
                        year: year.label,
                    };
                });
            })
            .flat();

        queryState({ columnTable: newData });
    }, [isState.valueMonth, isState.valueYear]);

    const handleScroll = (e) => {
        const container1Element = refRow.current;
        const container2Element = refHeader.current;
        container2Element.scrollLeft = container1Element.scrollLeft;
    };

    return (
        <React.Fragment>
            <Head>
                <title>Báo cáo lợi nhuận</title>
            </Head>
            <Container className={"!pb-0"}>
                {statusExprired ? <EmptyExprired /> : null}

                <div className="h-full">
                    <div className="space-y-3 h-[92%] overflow-hidden">
                        <TitleHeader title={"Quản lý sản xuất"} />
                        <div className="w-full">
                            <div className="3xl:space-y-3 space-y-2">
                                <div className="bg-slate-100 w-full rounded-t-lg items-center grid grid-cols-7 2xl:grid-cols-9 xl:col-span-8 lg:col-span-7 2xl:xl:p-2 xl:p-1.5 p-1.5">
                                    <div className="col-span-6 2xl:col-span-7 xl:col-span-5 lg:col-span-5">
                                        <div className="col-span-6 2xl:col-span-7 xl:col-span-5 lg:col-span-5">
                                            <div className="grid grid-cols-5 gap-2">
                                                {/* <SearchComponent
                                                        colSpan={1}
                                                        dataLang={dataLang}
                                                        placeholder={dataLang?.branch_search}
                                                        onChange={() => {}}
                                                    /> */}
                                                <SelectComponent
                                                    options={[
                                                        {
                                                            value: "",
                                                            label: "Chi nhánh",
                                                            isDisabled: true,
                                                        },
                                                    ]}
                                                    placeholder={"Chi nhánh"}
                                                    isSearchable={true}
                                                    colSpan={1}
                                                />
                                                <SelectComponent
                                                    options={[
                                                        {
                                                            value: "",
                                                            label: "Tháng",
                                                            isDisabled: true,
                                                        },
                                                        ...[...Array(12)].map((_, index) => ({
                                                            value: index + 1,
                                                            label: `Tháng ${index + 1}`,
                                                        })),
                                                    ]}
                                                    placeholder={"Tháng"}
                                                    isMulti={true}
                                                    isClearable={true}
                                                    isSearchable={true}
                                                    components={{ MultiValue }}
                                                    value={isState.valueMonth}
                                                    onChange={(e) => queryState({ valueMonth: e })}
                                                    closeMenuOnSelect={false}
                                                    colSpan={2}
                                                />
                                                <SelectComponent
                                                    options={[
                                                        {
                                                            value: "",
                                                            label: "Năm",
                                                            isDisabled: true,
                                                        },
                                                        ...[...Array(35)].map((_, index) => ({
                                                            value: index + 1,
                                                            label: `Năm ${2000 + index + 1}`,
                                                        })),
                                                    ]}
                                                    value={isState.valueYear}
                                                    onChange={(e) => queryState({ valueYear: e })}
                                                    closeMenuOnSelect={false}
                                                    placeholder={"Năm"}
                                                    isMulti={true}
                                                    isClearable={true}
                                                    isSearchable={true}
                                                    components={{ MultiValue }}
                                                    colSpan={2}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-1 xl:col-span-2 lg:col-span-2">
                                        <div className="flex justify-end gap-2 space-x-2 items-center">
                                            <OnResetData sOnFetching={() => { }} />
                                            <button
                                                onClick={() => { }}
                                                className={`xl:px-4 px-3 xl:py-2.5 py-1.5 2xl:text-xs xl:text-xs text-[7px] flex items-center space-x-2 bg-[#C7DFFB] rounded hover:scale-105 transition`}
                                            >
                                                <Grid6 className="2xl:scale-100 xl:scale-100 scale-75" size={18} />
                                                <span>{dataLang?.client_list_exportexcel}</span>
                                            </button>
                                            <div>
                                                <DropdowLimit sLimit={sLimit} limit={limit} dataLang={dataLang} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center sticky top-0 bg-white p-2 z-10 rounded-xl shadow-sm  divide-x">
                                    <div className="min-w-[30%]">
                                        <div className={"w-full flex items-center justify-center"}>
                                            <ColumnTable textAlign={"center"} className={"min-w-full"}>
                                                Nội dung
                                            </ColumnTable>
                                        </div>
                                    </div>
                                    <div
                                        ref={refHeader}
                                        className="min-w-[70%] overflow-hidden flex items-center sticky top-0 bg-white z-10 divide-x"
                                    >
                                        {isState.columnTable?.map((e) => (
                                            <ColumnTable textAlign={"center"} className={"min-w-[20%]"}>
                                                {e.month}, {e.year}
                                            </ColumnTable>
                                        ))}
                                        <ColumnTable textAlign={"center"} className={"min-w-[20%]"}>
                                            Tổng cộng
                                        </ColumnTable>
                                    </div>
                                </div>
                                <div className="flex divide-x">
                                    <div className="h-full  border-b 3xl:min-h-[595px] 3xl:max-h-[595px] xxl:min-h-[455px] xxl:max-h-[455px] 2xl:min-h-[420px] 2xl:max-h-[420px] min-h-[460px] max-h-[460px]  w-[30%]  flex flex-col ">
                                        <div className="flex flex-col">
                                            {isState.data?.map((e, eIndex) => (
                                                <RowItemTable
                                                    className={`w-full py-1.5 ${isState.data?.length - 1 == eIndex ? "" : "border-b"
                                                        }`}
                                                    textAlign={"left"}
                                                >
                                                    {e.name}
                                                </RowItemTable>
                                            ))}
                                        </div>
                                    </div>
                                    <div
                                        ref={refRow}
                                        onScroll={handleScroll}
                                        className="h-full 3xl:min-h-[595px] 3xl:max-h-[595px] xxl:min-h-[455px] xxl:max-h-[455px] 2xl:min-h-[420px] 2xl:max-h-[420px] min-h-[460px] max-h-[460px] w-[70%]  overflow-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100"
                                    >
                                        {isState.data?.map((e, eIndex) => (
                                            <RowTable
                                                key={e.id}
                                                display={"flex"}
                                                className={`w-full !py-0 ${isState.columnTable?.length == 0 &&
                                                    (isState.data?.length - 1 == eIndex ? "" : "border-b")
                                                    }`}
                                            >
                                                {isState.columnTable?.map((x, index) => (
                                                    <RowItemTable
                                                        textAlign={"right"}
                                                        className={`min-w-[20%]  py-1.5 ${isState.data?.length - 1 == eIndex ? "" : "border-b"
                                                            }`}
                                                    >
                                                        {index}
                                                    </RowItemTable>
                                                ))}
                                                <RowItemTable
                                                    className={`min-w-[20%]  py-1.5 ${isState.columnTable?.length > 0 &&
                                                        (isState.data?.length - 1 == eIndex ? "" : "border-b")
                                                        }`}
                                                    textAlign={"right"}
                                                >
                                                    0
                                                </RowItemTable>
                                            </RowTable>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {isState?.data?.length != 0 && (
                        <ContainerPagination className={"justify-start"}>
                            <TitlePagination dataLang={dataLang} totalItems={isState?.total?.iTotalDisplayRecords} />
                            <Pagination
                                postsPerPage={isState.limitItemWarehouseDetail}
                                totalPosts={Number(isState?.total?.iTotalDisplayRecords)}
                                paginate={paginate}
                                currentPage={router.query?.page || 1}
                                className="3xl:text-base text-sm"
                            />
                        </ContainerPagination>
                    )}
                </div>
            </Container>
        </React.Fragment>
    );
};

export default ProfitReport;
