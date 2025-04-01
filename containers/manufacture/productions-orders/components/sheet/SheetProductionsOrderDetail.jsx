import { memo, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import { useSheet } from "@/context/ui/SheetContext";
import CloseXIcon from "@/components/icons/common/CloseXIcon";
import ButtonAnimationNew from "@/components/common/button/ButtonAnimationNew";
import CheckThinIcon from "@/components/icons/common/CheckThinIcon";
import FileIcon from "@/components/icons/common/FileIcon";
import ArrowBendUpRightIcon from "@/components/icons/common/ArrowBendUpRightIcon";
import { useMultiAvailableHeightRef } from "@/hooks/custom/availableHeight/useMultiAvailableHeightRef";
import { useItemOrderDetail } from "@/managers/api/productions-order/useItemOrderDetail";

import { motion } from 'framer-motion'
import { StateContext } from "@/context/_state/productions-orders/StateContext";
import { useRouter } from "next/router";
import CostCard from "../ui/CostCard";

import formatMoneyConfig from "@/utils/helpers/formatMoney";
import formatNumberConfig from "@/utils/helpers/formatnumber";
import useSetingServer from "@/hooks/useConfigNumber";
import TabSwitcherWithUnderline from "@/components/common/tab/TabSwitcherWithUnderline";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { PiImage, PiPaperclip, PiPaperPlaneRightFill, PiSmiley, PiTextAa } from "react-icons/pi";
import { variantButtonScaleZoom } from "@/utils/animations/variantsAnimation";
import TabInformation from "../tab/TabInformation";
import TabMaterialIssueHistory from "../tab/TabMaterialIssueHistory";
import TabFGReceiptHistory from "../tab/TabFGReceiptHistory";
import TabMaterialReturn from "../tab/TabMaterialReturn";
import TabMaterialCost from "../tab/TabMaterialCost";

const initialState = {
    isTab: 1,
    dataDetail: {},
};

const SheetProductionsOrderDetail = memo(({ dataLang, ...props }) => {
    const router = useRouter()

    const poiId = useMemo(() => router.query.poi_id, [router.query.poi_id])

    const [scrollHeight, setScrollHeight] = useState(0);

    const { isStateProvider, queryStateProvider } = useContext(StateContext);

    const dataSeting = useSetingServer();

    const titleSheetRef = useRef(null);
    const commentSheetRef = useRef(null);
    const { isOpen: isOpenSheet, closeSheet } = useSheet()

    const { heightMapRef, calcHeights } = useMultiAvailableHeightRef();
    const { data: dataItemOrderDetail, isLoading: isLoadingItemOrderDetail } = useItemOrderDetail({ poi_id: isStateProvider?.productionsOrders?.poiId, enabled: isOpenSheet && !!isStateProvider?.productionsOrders?.poiId })

    const listTab = [
        {
            id: 1,
            name: dataLang?.productions_orders_modal_information || 'productions_orders_modal_information',
            count: 0,
        },
        {
            id: 2,
            name: dataLang?.productions_orders_modal_appeared || 'productions_orders_modal_appeared',
            count: dataItemOrderDetail?.count_bom ?? 0,
        },
        {
            id: 3,
            name: dataLang?.productions_orders_modal_history_exporting_materials || 'productions_orders_modal_history_exporting_materials',
            count: dataItemOrderDetail?.count_suggest_exporting ?? 0,
        },
        {
            id: 4,
            name: dataLang?.productions_orders_modal_history_import_product || 'productions_orders_modal_history_import_product',
            count: dataItemOrderDetail?.count_purchase_products ?? 0,
        },
        {
            id: 5,
            name: dataLang?.productions_orders_modal_recovery_materials || 'productions_orders_modal_recovery_materials',
            count: dataItemOrderDetail?.count_purchase_internal ?? 0,
        },
        {
            id: 6,
            name: dataLang?.productions_orders_modal_costs_processing_new || 'productions_orders_modal_costs_processing_new',
            // name: dataLang?.productions_orders_modal_costs_processing_new || 'productions_orders_modal_costs_processing_new',
            count: 0,
        },
    ];

    // useEffect(() => {
    //     const handleResize = () => {
    //         calcHeights({
    //             main: {
    //                 refs: [titleSheetRef, commentSheetRef],
    //                 subtract: 84 + 24,
    //             },
    //             submain: {
    //                 refs: [titleSheetRef],
    //                 subtract: 84 + 34,
    //             },
    //         });
    //     };

    //     handleResize();
    //     window.addEventListener('resize', handleResize);
    //     return () => window.removeEventListener('resize', handleResize);
    // }, [isOpenSheet, calcHeights, isStateProvider?.productionsOrders?.isTabSheet?.id]);

    // useEffect(() => {
    //     const handleResize = () => {
    //         calcHeights({
    //             main: {
    //                 refs: [titleSheetRef, commentSheetRef],
    //                 subtract: 84 + 24,
    //             },
    //             submain: {
    //                 refs: [titleSheetRef],
    //                 subtract: 84 + 34,
    //             },
    //         });
    //     };

    //     // delay 1 frame để chờ DOM cập nhật xong khi chuyển tab
    //     const animationFrame = requestAnimationFrame(() => {
    //         handleResize();
    //     });

    //     window.addEventListener('resize', handleResize);

    //     return () => {
    //         cancelAnimationFrame(animationFrame);
    //         window.removeEventListener('resize', handleResize);
    //     };
    // }, [isOpenSheet, calcHeights, isStateProvider?.productionsOrders?.isTabSheet?.id]);

    useEffect(() => {
        const handleResize = () => {
            calcHeights({
                main: {
                    refs: [titleSheetRef, commentSheetRef],
                    subtract: 84 + 24,
                },
                submain: {
                    refs: [titleSheetRef],
                    subtract: 84 + 34,
                },
            });

            // cập nhật scrollHeight sau 1 frame (DOM đã render)
            requestAnimationFrame(() => {
                const isTab1 = isStateProvider?.productionsOrders?.isTabSheet?.id === 1;
                const newHeight = isTab1 ? heightMapRef.current.main : heightMapRef.current.submain;
                setScrollHeight(newHeight);
            });
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [isOpenSheet, calcHeights, isStateProvider?.productionsOrders?.isTabSheet?.id]);

    const components = {
        1: <TabInformation dataLang={dataLang} {...props} />,
        2: <>Hello</>,
        3: <TabMaterialIssueHistory dataLang={dataLang} {...props} />,
        4: <TabFGReceiptHistory dataLang={dataLang} {...props} />,
        5: <TabMaterialReturn dataLang={dataLang} {...props} />,
        6: <TabMaterialCost dataLang={dataLang} {...props} />,
    };
    // 2: <TabExportSituation {...shareProps} />,
    // 3: <TabExportHistory {...shareProps} />,
    // 4: <TabWarehouseHistory {...shareProps} />,
    // 5: <TabRecallMaterials {...shareProps} />,
    // 6: <TabProcessingCost {...shareProps} />,

    console.log('dataItemOrderDetail', dataItemOrderDetail);
    console.log('isLoadingItemOrderDetail', isLoadingItemOrderDetail);

    const formatMoney = (number) => {
        if (typeof number == "string") {
            return formatMoneyConfig(+number ? +number : 0, dataSeting);
        } else if (typeof number == "undefined") {
            return formatMoneyConfig(0, dataSeting);
        }
        return formatMoneyConfig(+number ? +number : 0, dataSeting);
    };

    const handleCloseSheet = () => {
        closeSheet(false)

        router.push("/manufacture/productions-orders")
    }

    const handleActiveTab = (value, type) => {
        if (type !== "detail_sheet") return;

        const currentTabId = isStateProvider?.productionsOrders?.isTabSheet?.id;
        const newTabId = value?.id;

        // Nếu đang ở đúng tab → không làm gì cả
        if (currentTabId === newTabId) return;

        // Cập nhật state
        queryStateProvider({
            productionsOrders: {
                ...isStateProvider?.productionsOrders,
                isTabSheet: value,
            }
        });
    };

    return (
        <div className="flex flex-col gap-2 pl-6 pr-2 py-3 overflow-hidden">
            <div
                ref={titleSheetRef}
                className='pr-4 flex items-center justify-between'
            // style={{
            //     WebkitMaskImage: "linear-gradient(0deg, rgba(249, 251, 252, 0.00) 1%, #F9FBFC 10%)"
            // }}
            >
                <h1 className='text-title-default font-bold text-[#11315B]'>
                    Chi tiết lệnh sản xuất
                </h1>

                <div className='flex items-center gap-2'>
                    {/* 
                    <ButtonAnimationNew
                        icon={
                            <CheckThinIcon className={`xl:size-4 size-3.5 shrink-0`} />
                        }
                        title="Hoàn thành công đoạn"
                        className="w-fit 3xl:h-10 h-9 xl:px-4 px-2 flex items-center gap-2 xl:text-sm text-xs font-medium text-white border border-[#0375F3] bg-[#0375F3] hover:shadow-hover-button rounded-lg"
                    /> */}

                    <ButtonAnimationNew
                        icon={
                            <ArrowBendUpRightIcon className='xl:size-4 size-3.5' />
                        }
                        title="Chia sẻ LSX"
                        className="3xl:h-10 h-9 xl:px-4 px-2 flex items-center gap-2 xl:text-sm text-xs font-medium text-[#11315B] border border-[#D0D5DD] hover:bg-[#F7F8F9] hover:shadow-hover-button rounded-lg"
                    />

                    {/* <ButtonAnimationNew
                        icon={
                            <FileIcon className='xl:size-4 size-3.5' />
                        }
                        title="In PDF"
                        className="3xl:h-10 h-9 xl:px-4 px-2 flex items-center gap-2 xl:text-sm text-xs font-medium text-[#11315B] border border-[#D0D5DD] hover:bg-[#F7F8F9] hover:shadow-hover-button rounded-lg"
                    /> */}

                    {/* <div
                        onClick={() => closeSheet(false)}
                        className='size-8 shrink-0 text-[#9295A4] cursor-pointer'
                    >
                        <CloseXIcon className='size-full' />
                    </div> */}
                    <motion.div
                        whileHover={{ scale: 1.2, rotate: 90 }}
                        whileTap={{ scale: 0.9, rotate: -90 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        className='size-6 shrink-0 text-[#9295A4] cursor-pointer'
                        onClick={handleCloseSheet}
                    >
                        <CloseXIcon className='size-full' />
                    </motion.div>
                </div>
            </div>

            <Customscrollbar
                className='overflow-auto'
                // style={{
                //     height: `${isStateProvider?.productionsOrders?.isTabSheet?.id == 1 ? heightMapRef.current.main : heightMapRef.current?.submain}px`,
                //     maxHeight: `${isStateProvider?.productionsOrders?.isTabSheet?.id == 1 ? heightMapRef.current.main : heightMapRef.current?.submain}px`
                // }}
                style={{
                    height: `${scrollHeight}px`,
                    maxHeight: `${scrollHeight}px`,
                }}

            >
                <div className='flex flex-col 3xl:gap-6 gap-4 pr-4'>
                    {/* Information */}
                    <div className="flex flex-col gap-6 w-full border border-[#D0D5DD] rounded-2xl bg-white px-8 py-6">
                        <h2 className="text-title-small text-[#11315B] font-medium capitalize">
                            Thông tin chung
                        </h2>

                        <div className={`grid grid-cols-2`}>
                            <div className="flex flex-col col-span-1 w-full gap-1">
                                <div className={`flex items-center gap-1`}>
                                    <h3 className={`text-base-default text-[#3A3E4C] font-light min-w-[170px]`}>
                                        {dataLang?.productions_orders_details_lxs_number || 'productions_orders_details_lxs_number'}:
                                    </h3>
                                    <h3 className={`text-base-default font-medium text-[#0375F3]`}>
                                        {dataItemOrderDetail?.poi?.reference_no_detail ?? ""}
                                    </h3>
                                </div>

                                <div className={`flex items-center gap-1`}>
                                    <h3 className={`text-base-default text-[#3A3E4C] font-light min-w-[170px]`}>
                                        {dataLang?.productions_orders_details_number || 'productions_orders_details_number'}:
                                    </h3>
                                    <h3 className={`text-base-default font-medium text-[#141522]`}>
                                        {dataItemOrderDetail?.poi?.reference_no_po ?? ""}
                                    </h3>
                                </div>

                                <div className={`flex items-center col-span-3 gap-1`}>
                                    <h3 className={`text-base-default text-[#3A3E4C] font-light min-w-[170px]`}>
                                        {dataLang?.productions_orders_details_plan || 'productions_orders_details_plan'}:
                                    </h3>
                                    <h3 className={`text-base-default font-medium text-[#141522]`}>
                                        {dataItemOrderDetail?.poi?.reference_no_pp ?? ""}
                                    </h3>
                                </div>

                            </div>

                            <div className="flex flex-col col-span-1 gap-1">
                                <div className={`flex items-center col-span-3 gap-1`}>
                                    <h3 className={`text-base-default text-[#3A3E4C] font-light min-w-[170px]`}>{dataLang?.productions_orders_details_orders || 'productions_orders_details_orders'}:</h3>
                                    <h3 className={`text-base-default font-medium text-[#141522]`}>
                                        {dataItemOrderDetail?.poi?.object?.reference_no}
                                    </h3>
                                </div>

                                <div className={`flex items-center col-span-3 gap-1`}>
                                    <h3 className={`text-base-default text-[#3A3E4C] font-light min-w-[170px]`}>
                                        {dataLang?.productions_orders_details_client || 'productions_orders_details_client'}:
                                    </h3>
                                    <h3 className={`text-base-default font-medium text-[#141522]`}>
                                        {dataItemOrderDetail?.poi?.object?.company ?? ""}
                                    </h3>
                                </div>

                                <div className={`flex items-center gap-1`}>
                                    <h3 className={`text-base-default text-[#3A3E4C] font-light min-w-[170px]`}>
                                        {dataLang?.productions_orders_details_branch || 'productions_orders_details_branch'}:
                                    </h3>
                                    {/* <TagBranch className="w-fit">
                                    {dataItemOrderDetail?.poi?.branch_name}
                                    </TagBranch> */}
                                    <h3 className={`text-base-default font-medium text-[#141522]`}>
                                        {dataItemOrderDetail?.poi?.branch_name}
                                    </h3>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <CostCard
                                className="col-span-1 w-full"
                                title="Chi phí vật tư"
                                amount={formatMoney(dataItemOrderDetail?.cost?.cost_material)}
                                color="text-[#25387A]"
                                percent={Math.abs(dataItemOrderDetail?.cost?.percent_cost_material ?? 0)}
                                isUp={(dataItemOrderDetail?.cost?.percent_cost_material ?? 0) >= 0}
                            />
                            <CostCard
                                className="col-span-1 w-full"
                                title="Chi phí khác"
                                amount={formatMoney(dataItemOrderDetail?.cost?.cost_other)}
                                color="text-[#DC6803]"
                                percent={Math.abs(dataItemOrderDetail?.cost?.percent_cost_other ?? 0)}
                                isUp={(dataItemOrderDetail?.cost?.percent_cost_other ?? 0) >= 0}
                            />
                            <CostCard
                                className="col-span-1 w-full"
                                title="Tổng chi phí"
                                amount={formatMoney(dataItemOrderDetail?.cost?.total_cost)}
                                color="text-[#991B1B]"
                                percent={Math.abs(dataItemOrderDetail?.cost?.percent_total_cost ?? 0)}
                                isUp={(dataItemOrderDetail?.cost?.percent_total_cost ?? 0) >= 0}
                            />
                        </div>
                    </div>

                    <div className='flex flex-col gap-2'>
                        {/* tab */}
                        <TabSwitcherWithUnderline
                            tabs={listTab}
                            activeTab={isStateProvider?.productionsOrders?.isTabSheet}
                            onChange={(tab) => handleActiveTab(tab, "detail_sheet")}
                            className={"flex items-center justify-between w-full"}
                            renderLabel={(tab, activeTab) => (
                                <h3 className={`${isStateProvider?.productionsOrders?.isTabSheet?.id === tab.id ? "text-[#0375F3] scale-[1.02]" : "text-[#9295A4] scale-[1]"} flex items-center gap-2 col-span-1 font-medium group-hover:text-[#0375F3] transition-all duration-100 ease-linear origin-left`}>
                                    <span>
                                        {tab.name}
                                    </span>
                                    {
                                        tab.count > 0 && (
                                            <span className={`${isStateProvider?.productionsOrders?.isTabSheet?.id === tab.id ? "bg-[#0375F3]" : "bg-[#9295A4]"} 3xl:size-5 size-4 3xl:text-[11px] text-[10px] text-white rounded-full flex items-center justify-center`}>
                                                {tab.count}
                                            </span>
                                        )
                                    }
                                </h3>
                            )}
                        />

                        {/* content tab */}
                        <div className="w-full my-2">{components[isStateProvider?.productionsOrders?.isTabSheet?.id]}</div>
                    </div>
                </div>
            </Customscrollbar>

            {
                isStateProvider?.productionsOrders?.isTabSheet?.id == 1 &&
                <div ref={commentSheetRef} className="mt-1 w-full border border-[#9295A4] rounded-xl flex items-center px-4 py-3 gap-3">
                    <input
                        className="flex-1 text-sm-default text-[#344054] placeholder:!text-[#667085] focus:outline-none"
                        placeholder="Thêm bình luận"
                    // value={comment}
                    // onChange={(e) => setComment(e.target.value)}
                    />
                    <div className="flex items-center gap-3 text-[#3A3E4C]">
                        <PiSmiley className='size-5 shrink-0 cursor-pointer' />
                        <PiTextAa className='size-5 shrink-0 cursor-pointer' />
                        <PiPaperclip className='size-5 shrink-0 cursor-pointer' />
                        <PiImage className='size-5 shrink-0 cursor-pointer' />
                    </div>

                    <div className='w-[1px] h-4 bg-[#1F2329]/15' />

                    <ButtonAnimationNew
                        icon={
                            <PiPaperPlaneRightFill className='size-5 shrink-0' />
                        }
                        hideTitle={true}
                        disabled={false}
                        variant={variantButtonScaleZoom}
                        className='text-[#0375F3] hover:text-[#0375F3]/90 disabled:!text-[#667085] disabled:bg-transparent'
                    />
                </div>
            }
        </div >
    );
});

export default SheetProductionsOrderDetail;
