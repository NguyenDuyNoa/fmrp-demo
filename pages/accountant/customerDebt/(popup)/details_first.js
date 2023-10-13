import React, { useState, useEffect, useMemo } from "react";
import PopupEdit from "/components/UI/popup";
import { SearchNormal1 as IconSearch } from "iconsax-react";
import Loading from "components/UI/loading";
import { _ServerInstance as Axios } from "/services/axios";
const ScrollArea = dynamic(() => import("react-scrollbar"), {
    ssr: false,
});
import dynamic from "next/dynamic";
import moment from "moment";
import Pagination from "/components/UI/pagination";
import ExpandableContent from "/components/UI/more";
import { data } from "autoprefixer";
const Popup_chitietDauki = (props) => {
    const dataLang = props?.dataLang;
    const initialState = {
        open: false,
        data: [],
        onFetching: false,
        total: null,
        totalItems: { output: null, data: null },
        currentPage: 1,
        limit: 15,
    };
    const _ToggleModal = (e) => sIsState((pver) => ({ ...pver, open: e }));
    const [isState, sIsState] = useState(initialState);
    useEffect(() => {
        isState.open && props?.id && sIsState((pver) => ({ ...pver, onFetching: true }));
        isState.open && isState.currentPage && sIsState((pver) => ({ ...pver, onFetching: true }));
        isState.open && isState.limit && sIsState((pver) => ({ ...pver, onFetching: true }));
    }, [isState.open, isState.limit, isState.currentPage]);

    const formatNumber = (number) => {
        if (!number && number !== 0) return 0;
        const integerPart = Math.floor(number);
        const decimalPart = number - integerPart;
        const roundedDecimalPart = decimalPart >= 0.05 ? 1 : 0;
        const roundedNumber = integerPart + roundedDecimalPart;
        return roundedNumber.toLocaleString("en");
    };

    useEffect(() => {
        isState.onFetching && _ServerFetching_detailFrirst();
    }, [isState.onFetching]);

    const _ServerFetching_detailFrirst = async () => {
        await Axios(
            "GET",
            `/api_web/Api_debt_client/debtDetail/${props?.id}/no_thu_start?csrf_protection=true`,
            {
                params: {
                    limit: isState.limit,
                    page: isState.currentPage,
                    "filter[branch_id]": props?.idBranch != null ? props?.idBranch.value : null,
                    "filter[supplier_id]": props?.idSupplier ? props?.idSupplier.value : null,
                    "filter[start_date]": props?.date?.startDate
                        ? moment(props?.date?.startDate).format("YYYY-MM-DD")
                        : "",
                    "filter[end_date]": props?.date?.endDate ? moment(props?.date?.endDate).format("YYYY-MM-DD") : "",
                },
            },
            (err, response) => {
                if (!err) {
                    var { rResult, rTotal, data, output } = response.data;
                    sIsState((pver) => ({
                        ...pver,
                        total: { rTotal: rTotal },
                        data: rResult,
                        totalItems: { output: output, data: data },
                    }));
                }
                sIsState((pver) => ({ ...pver, onFetching: false }));
            }
        );
    };

    const getRandomColors = () => {
        const colors = [
            ["#f0f9ff", "#0ea5e9"],
            ["#f0f9ff", "#3b82f6"],
            ["#fff7ed", "#ea580c"],
            ["#faf5ff", "#a855f7"],
            ["#fdf2f8", "#ec4899"],
            ["#f0fdf4", "#22c55e"],
            ["#fff1f2", "#f43f5e"],
            ["#ecfdf5", "#10b981"],
            ["#fefce8", "#eab308"],
            ["#f8fafc", "#64748b"],
            ["#fdf4ff", "#d946ef"],
        ];

        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
    };

    const updatedData = useMemo(() => {
        const typeToColors = {};

        return isState.data.map((item) => {
            if (!typeToColors[item.type]) {
                typeToColors[item.type] = getRandomColors();
            }
            const randomColors = typeToColors[item.type];

            return {
                ...item,
                text: randomColors[1],
                bg: randomColors[0],
            };
        });
    }, [isState.data]);

    // Hàm để xử lý sự kiện chuyển trang
    const handlePageChange = (pageNumber) => sIsState((pver) => ({ ...pver, currentPage: pageNumber }));
    return (
        <>
            <PopupEdit
                title={
                    (props?.type == "no_start" && dataLang?.debt_suppliers_detail_dk) ||
                    (props?.type == "thu_start" && dataLang?.debt_suppliers_detail_dkc)
                }
                button={props?.name}
                onClickOpen={_ToggleModal.bind(this, true)}
                open={isState.open}
                onClose={_ToggleModal.bind(this, false)}
                classNameBtn={props?.className}
            >
                <div className="flex items-center space-x-4 my-2 border-[#E7EAEE] border-opacity-70 border-b-[1px]"></div>
                <div className=" space-x-5 3xl:w-[1200px] 2xl:w-[1150px] xl:w-[w-[900px] lg:w-[900px] w-[1200px] 3xl:h-auto  2xl:h-auto xl:h-auto lg:h-[400px] h-[500px] ">
                    <div>
                        <div className="bg-blue-400 rounded flex justify-between">
                            <h2 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-semibold p-2 text-white">
                                {dataLang?.debt_suppliers_balance || "debt_suppliers_balance"}
                            </h2>
                            <h2 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-semibold p-2 text-white">
                                {formatNumber(isState.totalItems?.data?.debt_begin)}
                            </h2>
                        </div>
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
                                        {props?.date?.startDate
                                            ? moment(props?.date?.startDate).format("DD/MM/YYYY")
                                            : "-"}
                                    </h2>
                                    <h2>{dataLang?.debt_suppliers_todate_Detail || "debt_suppliers_todate_Detail"}</h2>
                                    <h2 className="text-blue-600 3xl:text-base 2xl:text-[12.5px] xl:text-[11px]">
                                        {props?.date?.endDate ? moment(props?.date?.endDate).format("DD/MM/YYYY") : "-"}
                                    </h2>
                                </h2>
                            </div>
                        </div>
                        <div className="3xl:w-[1200px] 2xl:w-[1150px] xl:w-[w-[900px] lg:w-[900px] w-[1200px]">
                            <div className="min:h-[170px] h-[72%] max:h-[100px]  customsroll overflow-auto pb-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                <div className=" w-[100%]">
                                    <div
                                        className={`grid-cols-14  grid sticky top-0 rounded-xl shadow-md bg-white   z-10  divide-x`}
                                    >
                                        <h4 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-2 text-center whitespace-nowrap">
                                            {dataLang?.debt_suppliers_day_vouchers || "debt_suppliers_day_vouchers"}
                                        </h4>
                                        <h4 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-2 text-center whitespace-nowrap">
                                            {dataLang?.debt_suppliers_code_vouchers || "debt_suppliers_code_vouchers"}
                                        </h4>
                                        <h4 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-2 text-center whitespace-nowrap">
                                            {dataLang?.debt_suppliers_type || "debt_suppliers_type"}
                                        </h4>
                                        <h4 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-2 text-center whitespace-nowrap">
                                            {dataLang?.debt_suppliers_detail_owed || "debt_suppliers_detail_owed"}
                                        </h4>
                                        <h4 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-2 text-center whitespace-nowrap">
                                            {dataLang?.customerDebt || "customerDebt"}
                                        </h4>
                                        <h4 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-2 text-center whitespace-nowrap">
                                            {dataLang?.debt_suppliers_note || "debt_suppliers_note"}
                                        </h4>
                                        <h4 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-2 text-center whitespace-nowrap">
                                            {dataLang?.import_branch || "import_branch"}
                                        </h4>
                                    </div>
                                    {isState.onFetching ? (
                                        <Loading
                                            className="3xl:max-h-auto  2xl:max-h-auto xl:max-h-auto lg:max-h-[400px] max-h-[500px]"
                                            color="#0f4f9e"
                                        />
                                    ) : updatedData.length > 0 ? (
                                        <>
                                            <ScrollArea
                                                className="min-h-[90px] max-h-[170px] 3xl:max-h-[364px] 2xl:max-h-[250px] xl:max-h-[350px] lg:max-h-[186px] overflow-hidden"
                                                speed={1}
                                                smoothScrolling={true}
                                            >
                                                <div className="divide-y divide-slate-100 min:h-[170px]  max:h-[170px]">
                                                    {updatedData?.map((e) => (
                                                        <div
                                                            className="grid grid-cols-14 hover:bg-slate-50 items-center border-b"
                                                            key={e.id?.toString()}
                                                        >
                                                            <h6 className="text-[13px]   py-2 px-2 col-span-2 font-medium text-center ">
                                                                {moment(e?.date).format("DD/MM/YYYY")}
                                                            </h6>
                                                            <h6 className="text-[13px]   py-2 px-2 col-span-2 font-medium text-center ">
                                                                {e?.code}
                                                            </h6>
                                                            <h6 className="text-[13px] flex items-center w-fit mx-auto  py-2 px-2 col-span-2 font-medium ">
                                                                <div className="mx-auto">
                                                                    <span
                                                                        style={{
                                                                            color: `${e?.text}`,
                                                                            backgroundColor: `${e?.bg}`,
                                                                        }}
                                                                        className="flex items-center justify-center gap-1 font-normal   rounded-xl py-1 px-2 xl:min-w-[100px] min-w-[70px]   text-center 3xl:items-center 3xl-text-[18px] 2xl:text-[13px] xl:text-xs text-[8px]"
                                                                    >
                                                                        {dataLang[e?.type] || e?.type}
                                                                    </span>
                                                                </div>
                                                            </h6>
                                                            <h6 className="text-[13px]   py-2 px-2 col-span-2 font-medium text-right ">
                                                                {formatNumber(e?.no_amount)}
                                                            </h6>
                                                            <h6 className="text-[13px]   py-2 px-2 col-span-2 font-medium text-right ">
                                                                {formatNumber(e?.chi_amount)}
                                                            </h6>
                                                            <h6 className="text-[13px]   py-2 px-2 col-span-2 font-medium text-left">
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
                                            </ScrollArea>
                                        </>
                                    ) : (
                                        <div className=" max-w-[352px] mt-24 mx-auto">
                                            <div className="text-center">
                                                <div className="bg-[#EBF4FF] rounded-[100%] inline-block ">
                                                    <IconSearch />
                                                </div>
                                                <h1 className="textx-[#141522] text-base opacity-90 font-medium">
                                                    {props.dataLang?.purchase_order_table_item_not_found ||
                                                        "purchase_order_table_item_not_found"}
                                                </h1>
                                                <div className="flex items-center justify-around mt-6 ">
                                                    {/* <Popup_dskh onRefresh={_ServerFetching.bind(this)} dataLang={dataLang} className="xl:text-xs text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105" />     */}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex space-x-5 items-center justify-between">
                                    <Pagination
                                        postsPerPage={isState.limit}
                                        totalPosts={Number(isState.totalItems?.output?.iTotalDisplayRecords)}
                                        paginate={handlePageChange}
                                        currentPage={isState.currentPage}
                                    />
                                    <div className="flex items-center gap-2">
                                        <div className="relative">
                                            <select
                                                id="select-2"
                                                onChange={(e) =>
                                                    sIsState((prev) => ({ ...prev, limit: e?.target.value }))
                                                }
                                                value={isState.limit}
                                                className="py-1 px-4 pr-9 block  border-green-500 border rounded-md text-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                                            >
                                                <option selected value={15}>
                                                    15
                                                </option>
                                                <option value={20}>20</option>
                                                <option value={40}>40</option>
                                                <option value={60}>60</option>
                                            </select>
                                            <div className="absolute inset-y-0 -right-3 flex items-center pointer-events-none pr-8">
                                                <svg
                                                    className="h-4 w-4 text-green-500"
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 16 16"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M13.6091 3.41829C13.8594 3.68621 14 4.04952 14 4.42835C14 4.80718 13.8594 5.1705 13.6091 5.43841L6.93313 12.5817C6.68275 12.8495 6.3432 13 5.98916 13C5.63511 13 5.29556 12.8495 5.04518 12.5817L2.3748 9.72439C2.13159 9.45494 1.99701 9.09406 2.00005 8.71947C2.00309 8.34488 2.14351 7.98656 2.39107 7.72167C2.63862 7.45679 2.9735 7.30654 3.32359 7.30328C3.67367 7.30002 4.01094 7.44403 4.26276 7.70427L5.98916 9.55152L11.7211 3.41829C11.9715 3.15046 12.3111 3 12.6651 3C13.0191 3 13.3587 3.15046 13.6091 3.41829Z"
                                                        fill="currentColor"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                        <p className="text-sm text-green-600 mt-2">Hiển thị</p>
                                    </div>
                                </div>
                                <div className="grid-cols-14 grid items-center  border-b-gray-200 border-b  border-t   border-t-gray-200  z-10 bg-slate-100  rounded">
                                    <h2 className="border-l font-semibold p-2 text-[13px] border-r border-b  col-span-6 text-center uppercase">
                                        {dataLang?.debt_suppliers_totalAmount || "debt_suppliers_totalAmount"}
                                    </h2>
                                    <h2 className="font-medium p-2 text-[13px] border-r border-b    col-span-2 text-right">
                                        {formatNumber(isState.total?.rTotal?.no_amount)}
                                    </h2>
                                    <h2 className="font-medium p-2 text-[13px] border-r border-b   col-span-2 text-right">
                                        {formatNumber(isState.total?.rTotal?.thu_amount)}
                                    </h2>
                                    <h2 className="font-medium p-[17px] text-[13px] border-r border-b  col-span-2 text-right"></h2>
                                    <h2 className="font-medium p-[17px] text-[13px] border-r border-b  col-span-2 text-right"></h2>
                                    <h2 className="border-l font-semibold p-2  text-[13px] border-r col-span-6 text-center uppercase">
                                        {dataLang?.debt_suppliers_detail_Surplus || "debt_suppliers_detail_Surplus"}
                                    </h2>
                                    <h2 className="col-span-2 p-[17px]  "></h2>
                                    <h2 className=" font-medium p-2 text-[13px] border-r   col-span-2 text-right">
                                        {formatNumber(isState.total?.rTotal?.total_amount)}
                                    </h2>
                                    <h2 className="col-span-2 p-[17px] border-r "></h2>
                                    <h2 className="col-span-2 p-[17px] border-r "></h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </PopupEdit>
        </>
    );
};

export default Popup_chitietDauki;
