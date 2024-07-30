import { useEffect, useState } from "react";
import { _ServerInstance as Axios } from "/services/axios";

import DropdowLimit from "@/components/UI/dropdowLimit/dropdowLimit";
import Loading from "@/components/UI/loading";
import ExpandableContent from "@/components/UI/more";
import NoData from "@/components/UI/noData/nodata";
import Pagination from "@/components/UI/pagination";
import PopupCustom from "@/components/UI/popup";

import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import { ColumnTablePopup, HeaderTablePopup } from "@/components/UI/common/TablePopup";
import { FORMAT_MOMENT } from "@/constants/formatDate/formatDate";
import useSetingServer from "@/hooks/useConfigNumber";
import { useLimitAndTotalItems } from "@/hooks/useLimitAndTotalItems";
import { formatMoment } from "@/utils/helpers/formatMoment";
import formatMoneyConfig from "@/utils/helpers/formatMoney";
const Popup_chitietPhatsinh = (props) => {
    const dataLang = props?.dataLang;
    const dataSeting = useSetingServer()
    const [data, sData] = useState();
    const _ToggleModal = (e) => sOpen(e);
    const [open, sOpen] = useState(false);
    const [total, sTotal] = useState(null);
    const [onFetching, sOnFetching] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const { limit, updateLimit: sLimit, totalItems, updateTotalItems: sTotalItems } = useLimitAndTotalItems()


    useEffect(() => {
        open && props?.id && sOnFetching(true);
        open && currentPage && sOnFetching(true);
        open && limit && sOnFetching(true);
    }, [open, limit, currentPage]);

    const formatNumber = (number) => {
        return formatMoneyConfig(+number, dataSeting)
    };
    const _ServerFetching_detail = async () => {
        await Axios(
            "GET",
            `/api_web/Api_debt_supplier/debtDetail/${props?.id}/${props?.type}?csrf_protection=true`,
            {
                params: {
                    limit: limit,
                    page: currentPage,
                    "filter[branch_id]": props?.idBranch != null ? props?.idBranch.value : null,
                    "filter[supplier_id]": props?.idSupplier ? props?.idSupplier.value : null,
                    "filter[start_date]": props?.date?.startDate ? formatMoment(props?.date?.startDate, FORMAT_MOMENT.DATE_LONG) : "",
                    "filter[end_date]": props?.date?.endDate ? formatMoment(props?.date?.endDate, FORMAT_MOMENT.DATE_LONG) : "",
                },
            },
            (err, response) => {
                if (!err) {
                    var { rResult, rTotal, output } = response.data;
                    sData(rResult);
                    sTotal(rTotal?.total_amount);
                    sTotalItems(output);
                }
                sOnFetching(false);
            }
        );
    };

    useEffect(() => {
        onFetching && _ServerFetching_detail();
    }, [onFetching]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    return (
        <>
            <PopupCustom
                title={
                    (props?.type == "no_debt" && dataLang?.debt_suppliers_detail_ps) ||
                    (props?.type == "chi_debt" && dataLang?.debt_suppliers_detail_c)
                }
                button={props?.name}
                onClickOpen={_ToggleModal.bind(this, true)}
                open={open}
                onClose={_ToggleModal.bind(this, false)}
                classNameBtn={props?.className}
            >
                <div className="flex items-center space-x-4 my-2 border-[#E7EAEE] border-opacity-70 border-b-[1px]"></div>
                <div className=" space-x-5 3xl:w-[1200px] 2xl:w-[1150px] xl:w-[w-[900px] lg:w-[900px] w-[1200px] 3xl:h-auto  2xl:h-auto xl:h-auto lg:h-[400px] h-[500px] ">
                    <div>
                        <div className="bg-slate-100">
                            <div className=" flex gap-2 justify-between p-2">
                                <h2 className="flex gap-2 font-semibold 3xl:text-base 2xl:text-[12.5px] xl:text-[11px]">
                                    {dataLang?.debt_suppliers_name_Detail || "debt_suppliers_name_Detail"}
                                    <h2 className="font-semibold capitalize text-blue-700 3xl:text-base 2xl:text-[12.5px] xl:text-[11px]">
                                        {props?.supplier_name}
                                    </h2>
                                </h2>
                                <h2 className="font-medium flex gap-2 3xl:text-base 2xl:text-[12.5px] xl:text-[11px]">
                                    <h2>{dataLang?.debt_suppliers_filter_Detail || "debt_suppliers_filter_Detail"}</h2>
                                    <h2 className="text-blue-600">
                                        {props?.date?.startDate ? formatMoment(props?.date?.startDate, FORMAT_MOMENT.DATE_SLASH_LONG) : "-"}
                                    </h2>
                                    <h2>{dataLang?.debt_suppliers_todate_Detail || "debt_suppliers_todate_Detail"}</h2>
                                    <h2 className="text-blue-600 3xl:text-base 2xl:text-[12.5px] xl:text-[11px]">
                                        {props?.date?.endDate ? formatMoment(props?.date?.endDate, FORMAT_MOMENT.DATE_SLASH_LONG) : "-"}
                                    </h2>
                                </h2>
                            </div>
                        </div>
                        <div className="3xl:w-[1200px] 2xl:w-[1150px] xl:w-[w-[900px] lg:w-[900px] w-[1200px]">
                            <Customscrollbar className="min:h-[170px] h-[72%] max:h-[100px]  customsroll overflow-auto pb-1">
                                <div className=" w-[100%]">
                                    <HeaderTablePopup gridCols={12}
                                    >
                                        <ColumnTablePopup colSpan={2}>
                                            {dataLang?.debt_suppliers_day_vouchers || "debt_suppliers_day_vouchers"}
                                        </ColumnTablePopup>
                                        <ColumnTablePopup colSpan={2}>
                                            {dataLang?.debt_suppliers_code_vouchers || "debt_suppliers_code_vouchers"}
                                        </ColumnTablePopup>
                                        <ColumnTablePopup colSpan={2}>
                                            {dataLang?.debt_suppliers_type || "debt_suppliers_type"}
                                        </ColumnTablePopup>
                                        <ColumnTablePopup colSpan={2}>
                                            {dataLang?.debt_suppliers_into_money || "debt_suppliers_into_money"}
                                        </ColumnTablePopup>
                                        <ColumnTablePopup colSpan={2}>
                                            {dataLang?.debt_suppliers_note || "debt_suppliers_note"}
                                        </ColumnTablePopup>
                                        <ColumnTablePopup colSpan={2}>
                                            {dataLang?.import_branch || "import_branch"}
                                        </ColumnTablePopup>
                                    </HeaderTablePopup>
                                    {onFetching ? (
                                        <Loading
                                            className="3xl:max-h-auto  2xl:max-h-auto xl:max-h-auto lg:max-h-[400px] max-h-[500px]"
                                            color="#0f4f9e"
                                        />
                                    ) : data?.length > 0 ? (
                                        <>
                                            <Customscrollbar
                                                className="min-h-[90px] max-h-[170px] 3xl:max-h-[364px] 2xl:max-h-[250px] xl:max-h-[350px] lg:max-h-[186px]"
                                            >
                                                <div className="divide-y divide-slate-100 min:h-[170px]  max:h-[170px]">
                                                    {data?.map((e) => (
                                                        <div
                                                            className="grid grid-cols-12 hover:bg-slate-50 items-center border-b"
                                                            key={e.id?.toString()}
                                                        >
                                                            <h6 className="text-[13px]   py-2.5 px-2 col-span-2 font-medium text-center ">
                                                                {formatMoment(e?.date, FORMAT_MOMENT.DATE_SLASH_LONG)}
                                                            </h6>
                                                            <h6 className="text-[13px]   py-2.5 px-2 col-span-2 font-medium text-center ">
                                                                {e?.code}
                                                            </h6>
                                                            <h6 className="text-[13px] flex items-center w-fit mx-auto  py-2.5 px-2 col-span-2 font-medium ">
                                                                <div className="mx-auto">
                                                                    {(e?.type === "import_title" && (
                                                                        <span className="flex items-center justify-center font-normal text-purple-500  rounded-xl py-1 px-2 xl:min-w-[100px] min-w-[70px]  bg-purple-200 text-center 3xl:items-center 3xl-text-[18px] 2xl:text-[13px] xl:text-xs text-[8px]">
                                                                            {dataLang[e?.type] || e?.type}
                                                                        </span>
                                                                    )) ||
                                                                        (e?.type === "service" && (
                                                                            <span className=" flex items-center justify-center font-normal text-cyan-500 rounded-xl py-1 px-2 xl:min-w-[100px] min-w-[70px]  bg-cyan-200 text-center 3xl:items-center 3xl-text-[18px] 2xl:text-[13px] xl:text-xs text-[8px]">
                                                                                {dataLang[e?.type] || e?.type}
                                                                            </span>
                                                                        )) ||
                                                                        (e?.type === "returns_title" && (
                                                                            <span className="flex items-center justify-center gap-1 font-normal text-red-500  rounded-xl py-1 px-2 xl:min-w-[100px] min-w-[70px]  bg-rose-200 text-center 3xl:items-center 3xl-text-[18px] 2xl:text-[13px] xl:text-xs text-[8px]">
                                                                                {dataLang[e?.type] || e?.type}
                                                                            </span>
                                                                        )) ||
                                                                        (e?.type === "payment_title" && (
                                                                            <span className="flex items-center justify-center gap-1 font-normal text-orange-500  rounded-xl py-1 px-2 xl:min-w-[100px] min-w-[70px]  bg-orange-200 text-center 3xl:items-center 3xl-text-[18px] 2xl:text-[13px] xl:text-xs text-[8px]">
                                                                                {dataLang[e?.type] || e?.type}
                                                                            </span>
                                                                        ))}
                                                                </div>
                                                            </h6>
                                                            <h6 className="text-[13px]   py-2.5 px-2 col-span-2 font-medium text-right ">
                                                                {formatNumber(e?.total_amount)}
                                                            </h6>
                                                            <h6 className="text-[13px]   py-2.5 px-2 col-span-2 font-medium text-left">
                                                                <ExpandableContent content={e?.note} />
                                                            </h6>
                                                            <h6 className="col-span-2 w-fit mx-auto">
                                                                <div className="cursor-default 3xl:text-[13px] 2xl:text-[10px] xl:text-[9px] text-[8px] text-[#0F4F9E] font-[300] px-1.5 py-0.5 border border-[#0F4F9E] bg-white rounded-[5.5px] uppercase">
                                                                    {e?.branch_name}
                                                                </div>
                                                            </h6>
                                                        </div>
                                                    ))}
                                                </div>
                                            </Customscrollbar>
                                        </>
                                    ) : <NoData />}
                                </div>
                                <div className="flex space-x-5 items-center justify-between">
                                    <Pagination
                                        postsPerPage={limit}
                                        totalPosts={Number(totalItems?.iTotalDisplayRecords)}
                                        paginate={handlePageChange}
                                        currentPage={currentPage}
                                    />
                                    <div className="flex items-center gap-2">
                                        <DropdowLimit sLimit={sLimit} limit={limit} dataLang={dataLang} />
                                    </div>
                                </div>
                                <div className="grid-cols-12 grid items-center border-b-gray-200 border-b  border-t z-10 border-t-gray-200 bg-slate-100 rounded">
                                    <h2 className="font-semibold p-2 text-[13px] col-span-6 text-center border-l border-r uppercase">
                                        {dataLang?.debt_suppliers_totalAmount || "debt_suppliers_totalAmount"}
                                    </h2>
                                    <h2 className="font-medium p-2 text-[13px]   col-span-2 text-right border-r">
                                        {formatNumber(total)}
                                    </h2>
                                    <h2 className="font-medium p-[17px] text-[13px]   col-span-2 text-right border-r"></h2>
                                    <h2 className="font-medium p-[17px] text-[13px]   col-span-2 text-right border-r"></h2>
                                </div>
                            </Customscrollbar>
                        </div>
                    </div>
                </div>
            </PopupCustom>
        </>
    );
};
export default Popup_chitietPhatsinh;
