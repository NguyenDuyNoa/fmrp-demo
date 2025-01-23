import ButtonCancel from "@/components/UI/button/buttonCancel";
import ButtonSubmit from "@/components/UI/button/buttonSubmit";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import InPutNumericFormat from "@/components/UI/inputNumericFormat/inputNumericFormat";
import Loading from "@/components/UI/loading/loading";
import NoData from "@/components/UI/noData/nodata";
import PopupCustom from "@/components/UI/popup";
import useSetingServer from "@/hooks/useConfigNumber";
import { isAllowedNumber } from "@/utils/helpers/common";
import formatNumberConfig from "@/utils/helpers/formatnumber";
import { SelectCore } from "@/utils/lib/Select";
import { Trash } from "iconsax-react";
import { debounce } from "lodash";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useActiveStages } from "../../hooks/useActiveStages";
import { useListFinishedStages } from "../../hooks/useListFinishedStages";
import { useLoadOutOfStock } from "../../hooks/useLoadOutOfStock";


const initialState = {
    open: false,
    objectWareHouse: null,
    errWareHouse: false,
    dataTableProducts: null,
    dataTableBom: null
}

const PopupConfimStage = ({ dataLang, dataRight }) => {
    const tableRef = useRef(null)

    const tableRefTotal = useRef(null)

    const dataSeting = useSetingServer();

    const formatNumber = (number) => {
        return formatNumberConfig(+number, dataSeting);
    };

    const [isState, setState] = useState(initialState);

    const queryState = (data) => setState((prev) => ({ ...prev, ...data }));

    const [activeStep, setActiveStep] = useState({ type: null, item: null });

    const { onGetData, isLoading: isLoadingActiveStages } = useActiveStages()

    const { data, isLoading } = useListFinishedStages({ id: dataRight?.idDetailProductionOrder, open: isState.open })

    const { data: dataLoadOutOfStock, isLoading: isLoadingLoadOutOfStock, onGetData: onGetDataLoadOutOfStock } = useLoadOutOfStock()

    const handleSelectStep = async (type, e) => {
        if (e?.stage_id == activeStep?.item?.stage_id) return

        setActiveStep({ type, item: e });

        const payload = {
            id: dataRight?.idDetailProductionOrder,
            is_product: type == "TP" ? 1 : 0,
            stage_id: e?.stage_id
        }

        const r = await onGetData(payload)

        queryState({ dataTableProducts: r });

    };

    const handleSubmit = () => { };

    useEffect(() => {
        if (!tableRef?.current || !tableRefTotal?.current) return;
        const handleScroll = () => {
            if (tableRef.current && tableRefTotal.current) {
                tableRefTotal.current.scrollLeft = tableRef.current.scrollLeft;
            }
        };

        const table = tableRef.current;

        table.addEventListener("scroll", handleScroll);

        // Cleanup
        return () => {
            table.removeEventListener("scroll", handleScroll);
        };
    }, [tableRef.current, tableRefTotal.current]);

    const { totalQuantity, totalQuantityError } = useMemo(() => {
        const result = isState.dataTableProducts?.data?.items?.reduce((totals, item) => {
            totals.totalQuantity += +item?.quantity || 0;
            totals.totalQuantityError += item?.quantityError || 0;
            return totals;
        },
            { totalQuantity: 0, totalQuantityError: 0 }
        );

        return result || { totalQuantity: 0, totalQuantityError: 0 };
    }, [isState.dataTableProducts]);


    const handleChange = (table, type, value, row) => {
        if (table == 'product') {
            const newData = isState.dataTableProducts?.data?.items?.map((item) =>
                item?.item_id === row?.item_id ? { ...item, [type]: value?.floatValue } : item
            );
            queryState({
                dataTableProducts: {
                    ...isState.dataTableProducts,
                    data: {
                        ...isState.dataTableProducts?.data,
                        items: newData
                    }
                }
            });
        }

        if (table == 'bom') {
            console.log("value", value);

        }
    }

    const handleRemove = (type, row) => {
        const stateKey = type === 'product' ? 'dataTableProducts' : 'dataTableBom';

        const newData = isState[stateKey]?.data?.items?.filter((item) => item?.item_id !== row?.item_id);

        queryState({
            [stateKey]: {
                ...isState[stateKey],
                data: {
                    ...isState[stateKey]?.data,
                    items: newData,
                },
            },
        });
    };


    const onGetBom = useCallback(
        debounce(async (is_product, items) => {
            try {
                const r = await onGetDataLoadOutOfStock({ is_product, items });
                queryState({ dataTableBom: r });
            } catch (error) {
                console.error('Error in onGetBom:', error);
            }
        }, 500),
        []
    );

    useEffect(() => {
        if (isState.dataTableProducts?.data?.items?.length == 0) return
        onGetBom(activeStep.type === 'TP' ? 1 : 0, isState.dataTableProducts?.data?.items)
    }, [isState.dataTableProducts, activeStep])



    return (
        <PopupCustom
            title={<p>Hoàn thành công đoạn <span className="text-blue-500">(Số lệnh sản xuất: {data?.po?.reference_no})</span></p>}
            button={<button className="py-1.5 px-4 transition-all duration-150 ease-in-out border border-blue-500 rounded-lg text-blue-500 text-sm hover:bg-blue-500 hover:text-white">Hoàn thành công đoạn</button>}
            onClickOpen={() => {
                queryState({ open: true });
            }}
            lockScroll={true}
            open={isState.open}
            onClose={() => {
                queryState({ open: false });
            }}
            classNameBtn={``}
        >
            <div className="flex items-center space-x-4 my-2 border-[#E7EAEE] border-opacity-70 border-b-[1px]" />
            <div className={`w-[85vw] xl:h-[80vh] h-[575px] overflow-hidden `}>
                <div className="grid h-full grid-cols-12 gap-4 overflow-hidden">
                    {/* Left Panels */}
                    <div className="grid h-full grid-cols-2 col-span-4 border-b divide-x bg-gray-50">
                        {/* Công đoạn TP */}
                        <div className="col-span-1 !border-l ">
                            <div className="p-3 font-semibold border-y">Công đoạn TP</div>
                            <Customscrollbar className="h-full hover:overflow-y-auto overflow-y-hidden max-h-[calc(80vh_-_60px)]">
                                {
                                    data?.stage_products?.length > 0
                                        ?
                                        data?.stage_products?.map((e) => (
                                            <li
                                                key={e?.stage_id}
                                                onClick={() => handleSelectStep("TP", e)}
                                                className={`p-3 cursor-pointer ${activeStep.type == "TP" && activeStep?.item?.stage_id == e?.stage_id
                                                    ? "bg-green-100 border-l-4 border-green-500" : "hover:bg-gray-100"
                                                    } ${e?.avtive ? "text-green-500" : "text-gray-500"} text-sm list-none flex items-center gap-2 transition-all duration-150 ease-linear select-none`}
                                            >
                                                <div className="min-w-[16px] flex items-center justify-center">
                                                    {
                                                        e?.avtive
                                                            ?
                                                            <FaCheckCircle
                                                                size="16"
                                                                className="text-green-500"
                                                            />
                                                            :
                                                            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                                                    }
                                                </div>
                                                <p>{e?.name_stage}</p>
                                            </li>
                                        ))
                                        :
                                        <NoData classNameTitle='!text-[13px]' />
                                }
                            </Customscrollbar>
                        </div>

                        {/* Công đoạn BTP */}
                        <div className="col-span-1 !border-r ">
                            <div className="p-3 font-semibold border-y">Công đoạn BTP</div>
                            <Customscrollbar className="h-full hover:overflow-y-auto overflow-y-hidden  max-h-[calc(80vh_-_60px)]">
                                {
                                    data?.stage_semi_products?.length > 0
                                        ?
                                        data?.stage_semi_products?.map((e) => (
                                            <li
                                                key={e?.stage_id}
                                                onClick={() => handleSelectStep("BTP", e)}
                                                className={`p-3 cursor-pointer ${activeStep.type == "BTP" && activeStep?.item?.stage_id == e?.stage_id
                                                    ? "bg-green-100 border-l-4 border-green-500" : "hover:bg-gray-100"
                                                    } ${e?.avtive ? "text-green-500" : "text-gray-500"} text-sm list-none flex items-center gap-2 transition-all duration-200 ease-linear select-none`}
                                            >
                                                <div className="min-w-[16px] flex items-center justify-center">
                                                    {
                                                        e?.avtive
                                                            ?
                                                            <FaCheckCircle
                                                                size="16"
                                                                className="text-green-500"
                                                            />
                                                            :
                                                            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                                                    }
                                                </div>
                                                <p>{e?.name_stage}</p>
                                            </li>
                                        ))
                                        :
                                        <NoData classNameTitle='!text-[13px]' />
                                }
                            </Customscrollbar>
                        </div>
                    </div>

                    {/* Right Panel */}
                    {/* Right Panel */}
                    <div className="flex flex-col col-span-8 gap-6">
                        {/* Nhập thành phẩm */}
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <div className="text-lg font-semibold">Nhập thành phẩm</div>
                                <SelectCore
                                    options={data?.warehouses || []}
                                    onChange={(e) => queryState({ objectWareHouse: e })}
                                    value={isState.objectWareHouse}
                                    isClearable={true}
                                    closeMenuOnSelect={true}
                                    hideSelectedOptions={false}
                                    placeholder={'Kho thành phẩm'}
                                    className={`${isState.errWareHouse ? 'border-red-500' : 'border-transparent'} placeholder:text-slate-300 w-1/3 z-30 bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `}
                                    isSearchable={true}
                                    style={{
                                        border: "none",
                                        boxShadow: "none",
                                        outline: "none",
                                    }}
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
                                        menu: (provided) => ({
                                            ...provided,
                                            // zIndex: 9999, // Giá trị z-index tùy chỉnh
                                        }),
                                        control: (base, state) => ({
                                            ...base,
                                            boxShadow: "none",
                                            padding: "2.7px",
                                            ...(state.isFocused && {
                                                border: "0 0 0 1px #92BFF7",
                                            }),
                                        }),
                                    }}
                                />
                                {isState.errWareHouse && (
                                    <label className="text-sm text-red-500">
                                        {'Vui lòng chọn kho'}
                                    </label>
                                )}
                            </div>
                            <div className="">
                                <Customscrollbar ref={tableRef} className="h-[calc(80vh_/_2_-_115px)] overflow-x-hidden overflow-y-hidden bg-white hover:overflow-x-auto hover:overflow-y-auto">
                                    <table className=" w-full text-sm [&>thead>tr>th]:font-medium border border-separate border-spacing-0 border-gray-200 table-auto">
                                        <thead className="sticky top-0 z-10 bg-gray-100">
                                            <tr>
                                                <th className="border p-2 min-w-[200px]">Số lệnh sản xuất chi tiết</th>
                                                <th className="border p-2 min-w-[100px]">Hình ảnh</th>
                                                <th className="border p-2 min-w-[250px]">Mặt hàng</th>
                                                <th className="border p-2 min-w-[150px]">Đơn vị sản xuất</th>
                                                <th className="border p-2 min-w-[120px]">SL cần nhập</th>
                                                <th className="border p-2 min-w-[120px]">SL đã nhập</th>
                                                <th className="border p-2 min-w-[196px]">Số lượng</th>
                                                <th className="border p-2 min-w-[196px]">Số lượng lỗi</th>
                                                <th className="border p-2 min-w-[100px]">Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody className="h-[calc(80vh_/_2_-_155px)]">
                                            {
                                                (isLoadingActiveStages && activeStep.type == "TP")
                                                    ?
                                                    <tr>
                                                        <td colSpan={9}>
                                                            <Loading className='!h-[100px] w-full mx-auto' />
                                                        </td>
                                                    </tr>
                                                    :
                                                    isState.dataTableProducts?.data?.items?.length > 0
                                                        ?
                                                        isState.dataTableProducts?.data?.items?.map((row, index) => (
                                                            <tr key={index} >
                                                                <td className="p-2 text-sm text-center border">
                                                                    {row?.reference_no_detail}
                                                                </td>
                                                                <td className="p-2 border">
                                                                    <div className="flex items-center justify-center ">
                                                                        <Image
                                                                            height={1024}
                                                                            width={1280}
                                                                            alt="img"
                                                                            src={row?.images}
                                                                            className="object-cover rounded-md min-w-[48px] min-h-[48px] w-[48px] h-[48px] max-w-[48px] max-h-[48px]"
                                                                        />
                                                                    </div>
                                                                </td>
                                                                <td className="p-2 text-sm border">
                                                                    <p>
                                                                        {row?.item_name}
                                                                    </p>
                                                                    <p className="text-xs italic">
                                                                        {row?.product_variation}
                                                                    </p>
                                                                </td>
                                                                <td className="p-2 text-sm text-center border">
                                                                    {row?.unit_name}
                                                                </td>
                                                                <td className="p-2 text-sm text-center border">
                                                                    {formatNumber(row?.quantity_enter)}
                                                                </td>
                                                                <td className="p-2 text-sm text-center border">
                                                                    {formatNumber(row?.quantity_entered)}
                                                                </td>
                                                                <td className="p-2 text-sm border">
                                                                    <InPutNumericFormat
                                                                        onValueChange={(e) => handleChange('product', "quantity", e, row)}
                                                                        value={row?.quantity || null}
                                                                        className={`${(!row?.quantity || row?.quantity == 0) ? "border-b border-red-500" : "border-b border-gray-200"}
                                                                        ${(!row?.quantity || row?.quantity == 0) ? "border-b border-red-500" : "border-b border-gray-200"}
                                                                        appearance-none text-center text-sm 3xl:px-1 2xl:px-0.5 xl:px-0.5 p-0 font-normal   focus:outline-none `}
                                                                        isAllowed={isAllowedNumber}
                                                                    />
                                                                </td>
                                                                <td className="p-2 border">
                                                                    <InPutNumericFormat
                                                                        onValueChange={(e) => handleChange('product', "quantityError", e, row)}
                                                                        value={row?.quantityError || null}
                                                                        className={`${(!row?.quantityError || row?.quantityError == 0) ? "border-b border-red-500" : "border-b border-gray-200"}
                                                                        ${(!row?.quantityError || row?.quantityError == 0) ? "border-b border-red-500" : "border-b border-gray-200"}
                                                                        appearance-none text-center text-sm 3xl:px-1 2xl:px-0.5 xl:px-0.5 p-0 font-normal   focus:outline-none `}
                                                                        isAllowed={isAllowedNumber}
                                                                    />
                                                                </td>
                                                                <td className="p-2 text-center border">
                                                                    <button
                                                                        title="Xóa"
                                                                        onClick={() => handleRemove("product", row)}
                                                                        className="p-1 text-red-500 transition-all ease-linear rounded-md hover:scale-110 bg-red-50 hover:bg-red-200 animate-bounce-custom"
                                                                    >
                                                                        <Trash size={24} />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))
                                                        : (
                                                            <tr>
                                                                <td colSpan="9" className="p-2 text-center text-red-500 border">
                                                                    Không có mặt hàng để hoàn thành
                                                                </td>
                                                            </tr>
                                                        )}
                                        </tbody>
                                    </table>
                                </Customscrollbar>
                                <div ref={tableRefTotal} className="overflow-x-hidden">
                                    <table >
                                        <tfoot className="sticky bottom-0 z-10">
                                            <tr className="bg-gray-100 font-font-medium">
                                                <td className="p-2 text-center border font-font-medium min-w-[940px]">
                                                    TỔNG CỘNG
                                                </td>
                                                <td className="p-2 text-center border font-font-medium min-w-[196px]">
                                                    {formatNumber(totalQuantity)}
                                                </td>
                                                <td className="p-2 text-center border font-font-medium  min-w-[196px]">
                                                    {formatNumber(totalQuantityError)}
                                                </td>
                                                <td className="p-2 text-center border font-font-medium  min-w-[100px]"></td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Xuất kho sản xuất */}
                        <div>
                            <div className="mb-4 text-lg font-semibold">Xuất kho sản xuất</div>
                            <Customscrollbar className="h-[calc(80vh_/_2_-_115px)] overflow-x-hidden bg-white hover:overflow-x-auto overflow-y-hidden hover:overflow-y-auto">
                                <table className="w-full text-sm [&>thead>tr>th]:font-medium border border-separate border-spacing-0 border-gray-200 table-auto">
                                    <thead className="sticky top-0 z-10 bg-gray-100">
                                        <tr>
                                            <th className="border p-2 min-w-[100px]">Hình ảnh</th>
                                            <th className="border p-2 min-w-[150px]">Mặt hàng</th>
                                            <th className="border p-2 min-w-[120px]">SL sản xuất</th>
                                            <th className="border p-2 min-w-[120px]">SL xuất kho</th>
                                            <th className="border p-2 min-w-[120px]">Tồn kho</th>
                                            <th className="border p-2 min-w-[150px]">Kho hàng</th>
                                            <th className="border p-2 min-w-[100px]">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="h-[calc(80vh_/_2_-_155px)]">
                                        {
                                            (isLoadingLoadOutOfStock)
                                                ?
                                                <tr>
                                                    <td colSpan="7" >
                                                        <Loading className='!h-[100px] w-full mx-auto' />
                                                    </td>
                                                </tr>
                                                :
                                                isState.dataTableBom?.data?.items?.length > 0 ? (
                                                    isState.dataTableBom?.data?.items?.map((row, index) => (
                                                        <tr key={index}>
                                                            <td className="p-2 border">{row.image}</td>
                                                            <td className="p-2 border">{row.item}</td>
                                                            <td className="p-2 border">{row.produced}</td>
                                                            <td className="p-2 border">{row.exported}</td>
                                                            <td className="p-2 border">{row.remaining}</td>
                                                            <td className="p-2 border">{row.warehouse}</td>
                                                            <td className="p-2 text-center border">
                                                                <button
                                                                    title="Xóa"
                                                                    onClick={() => handleRemove("bom", row)}
                                                                    className="p-1 text-red-500 transition-all ease-linear rounded-md hover:scale-110 bg-red-50 hover:bg-red-200 animate-bounce-custom"
                                                                >
                                                                    <Trash size={24} />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="7" className="p-2 text-center text-red-500 border">
                                                            Không có mặt hàng
                                                        </td>
                                                    </tr>
                                                )}
                                    </tbody>
                                </table>
                            </Customscrollbar>
                        </div>
                        <div className="flex items-center justify-end gap-2">
                            <ButtonCancel
                                onClick={() => { queryState({ open: false }) }}
                                dataLang={dataLang}
                            />
                            <ButtonSubmit
                                loading={false}
                                dataLang={dataLang}
                                onClick={handleSubmit.bind(this)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </PopupCustom>
    );
};

export default PopupConfimStage;
