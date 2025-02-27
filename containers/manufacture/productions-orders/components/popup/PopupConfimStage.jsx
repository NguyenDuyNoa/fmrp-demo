import ButtonCancel from "@/components/UI/button/buttonCancel";
import ButtonSubmit from "@/components/UI/button/buttonSubmit";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import SelectComponent from "@/components/UI/filterComponents/selectComponent";
import InPutNumericFormat from "@/components/UI/inputNumericFormat/inputNumericFormat";
import Loading from "@/components/UI/loading/loading";
import MultiValue from "@/components/UI/mutiValue/multiValue";
import NoData from "@/components/UI/noData/nodata";
import PopupCustom from "@/components/UI/popup";
import useFeature from "@/hooks/useConfigFeature";
import useSetingServer from "@/hooks/useConfigNumber";
import useToast from "@/hooks/useToast";
import { isAllowedNumber } from "@/utils/helpers/common";
import formatNumberConfig from "@/utils/helpers/formatnumber";
import { SelectCore } from "@/utils/lib/Select";
import { Calendar, Trash } from "iconsax-react";
import { debounce } from "lodash";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import { FaCheckCircle } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import { useActiveStages } from "../../hooks/useActiveStages";
import { useHandingFinishedStages } from "../../hooks/useHandingFinishedStages";
import { useListFinishedStages } from "../../hooks/useListFinishedStages";
import { useLoadOutOfStock } from "../../hooks/useLoadOutOfStock";


const initialState = {
    open: false,
    objectWareHouse: null,
    dataTableProducts: null,
    dataTableBom: null,
    arrayMoveBom: []
}

const PopupConfimStage = ({ dataLang, dataRight, refetch: refetchMainTable }) => {
    const tableRef = useRef(null)

    const isToast = useToast();

    const tableRefTotal = useRef(null)

    const dataSeting = useSetingServer();

    const formatNumber = (number) => {
        return formatNumberConfig(+number, dataSeting);
    };

    const stateRef = useRef(initialState);

    const [isState, setState] = useState(initialState);

    const queryState = (data) => setState((prev) => ({ ...prev, ...data }));

    const [activeStep, setActiveStep] = useState({ type: null, item: null });

    const { onGetData, isLoading: isLoadingActiveStages } = useActiveStages()

    const { isLoading: isLoadingSubmit, onSubmit } = useHandingFinishedStages()

    const { dataProductExpiry, dataMaterialExpiry, dataProductSerial } = useFeature();

    const { data, isLoading, refetch } = useListFinishedStages({ id: dataRight?.idDetailProductionOrder, open: isState.open })

    const { data: dataLoadOutOfStock, isLoading: isLoadingLoadOutOfStock, onGetData: onGetDataLoadOutOfStock } = useLoadOutOfStock()

    const handleSelectStep = async (type, e, action) => {
        if (action == 'click' && e?.stage_id == activeStep?.item?.stage_id && type == activeStep?.type) return

        setActiveStep({ type, item: e });

        const payload = {
            id: dataRight?.idDetailProductionOrder,
            is_product: type == "TP" ? 1 : 0,
            stage_id: e?.stage_id
        }

        const r = await onGetData(payload)

        queryState({ dataTableProducts: r, arrayMoveBom: [] });

        onGetBom({
            isProduct: type === 'TP' ? 1 : 0,
            activeStep: {
                type,
                item: e
            },
            poId: dataRight?.idDetailProductionOrder,
            arrayMoveBom: []
        }, r?.data?.items)

    };

    const handleSubmit = async () => {
        if (!isState.objectWareHouse) {
            isToast("error", "Vui lòng kiểm tra dữ liệu")
            return
        }

        const r = await onSubmit({
            poId: dataRight?.idDetailProductionOrder,
            objectData: isState
        })

        if (r?.isSuccess == 1) {
            refetch()
            refetchMainTable()
            handleSelectStep(activeStep?.type, activeStep?.item, 'auto')
        }

    };

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

    const { totalQuantity, totalQuantityError, totalQuantityEntered, totalQuantityEnter } = useMemo(() => {
        const result = isState.dataTableProducts?.data?.items?.reduce((totals, item) => {
            totals.totalQuantity += +item?.quantityEnterClient || 0;
            totals.totalQuantityError += item?.quantityError || 0;
            totals.totalQuantityEnter += +item?.quantity_enter || 0;
            totals.totalQuantityEntered += +item?.quantity_entered || 0;
            return totals;
        },
            { totalQuantity: 0, totalQuantityError: 0, totalQuantityEntered: 0, totalQuantityEnter: 0 }
        );

        return result || { totalQuantity: 0, totalQuantityError: 0, totalQuantityEntered: 0, totalQuantityEnter: 0 };
    }, [isState.dataTableProducts]);


    const updateQuantityAndSerial = (item, type, value, serialType) => {
        const newQuantity = value?.floatValue || 0;
        const currentSerials = Array.isArray(item[serialType]) ? [...item[serialType]] : [];

        // Điều chỉnh số lượng serial theo `newQuantity` và reset `isDuplicate`
        const updatedSerials =
            currentSerials.length < newQuantity
                ? [
                    ...currentSerials.map(s => ({ ...s, isDuplicate: false })), // Reset isDuplicate
                    ...Array(newQuantity - currentSerials.length).fill({ value: "", isDuplicate: false })
                ]
                : currentSerials.slice(0, newQuantity).map(s => ({ ...s, isDuplicate: false })); // Reset isDuplicate

        return { ...item, [type]: newQuantity, [serialType]: updatedSerials };
    };


    const handleChange = ({ table, type, value, row, index }) => {

        if (table == 'product') {
            const checkType = ['quantityEnterClient', 'quantityError'].includes(type)

            const newData = isState.dataTableProducts?.data?.items?.map((item) => {
                if (item?.poi_id === row?.poi_id) {
                    if (type === 'serial' || type === 'serialError') {
                        let updatedArray = Array.isArray(item[type]) ? [...item[type]] : [];

                        // Cập nhật giá trị mới trong mảng
                        updatedArray[index] = { value, isDuplicate: false };

                        // Kiểm tra trùng lặp trong cùng một hàng
                        const valuesList = updatedArray.map(s => s?.value).filter(Boolean);
                        updatedArray = updatedArray.map((s, i) => ({
                            ...s,
                            isDuplicate: valuesList.indexOf(s?.value) !== valuesList.lastIndexOf(s?.value)
                        }));

                        // Hiển thị cảnh báo nếu trùng
                        if (updatedArray[index].isDuplicate) {
                            isToast("error", `${type === 'serial' ? "Serial" : "Serial lỗi"} đã tồn tại!`);
                        }

                        return { ...item, [type]: updatedArray };
                    }
                    if (checkType) {
                        return updateQuantityAndSerial(item, type, value, type === 'quantityEnterClient' ? 'serial' : 'serialError');
                    }
                    return { ...item, [type]: checkType ? value?.floatValue : value }
                }
                return item
            });

            queryState({
                dataTableProducts: {
                    ...isState.dataTableProducts,
                    data: {
                        ...isState.dataTableProducts?.data,
                        items: newData
                    }
                },
            });

            if (checkType)
                onGetBom({
                    isProduct: type === 'TP' ? 1 : 0,
                    activeStep: {
                        type,
                        item: activeStep.item
                    },
                    poId: dataRight?.idDetailProductionOrder,
                    arrayMoveBom: isState.arrayMoveBom,
                }, newData)
        }

        if (table == 'bom') {
            const newData = isState.dataTableBom.data?.boms?.map((item) => {
                if (item?._id === row?._id) {
                    return { ...item, [type]: value }
                }
                return item
            });

            queryState({
                dataTableBom: {
                    ...isState.dataTableBom,
                    data: {
                        ...isState.dataTableBom?.data,
                        boms: newData,
                        bomsClientHistory: newData
                    }
                },
            });
        }
    }

    const handleRemove = (type, row) => {
        if (type == 'bom' && row?.type_bom == "product_before") {
            isToast('error', "Đây là thành phẩm công đoạn bước trước, không thể xóa")
            return
        }

        const stateKey = type === 'product' ? 'dataTableProducts' : 'dataTableBom';

        const stateData = type === 'product' ? 'items' : 'boms';

        const newData = isState[stateKey]?.data[stateData]?.filter((item) => (item?.poi_id || item?._id) !== (row?.poi_id || row?._id));

        queryState({
            [stateKey]: {
                ...isState[stateKey],
                data: {
                    ...isState[stateKey]?.data,
                    [stateData]: newData,
                },
            },
        });


        queryState({ arrayMoveBom: [...isState.arrayMoveBom, row] })

        onGetBom({
            isProduct: type === 'product' ? 1 : 0,
            activeStep: {
                type,
                item: activeStep.item
            },
            arrayMoveBom: [...isState.arrayMoveBom, row],
            poId: dataRight?.idDetailProductionOrder,
        }, type === 'product' ? newData : isState.dataTableProducts?.data?.items)

    };


    const onGetBom = useCallback(debounce(async (object, items) => {
        try {
            const r = await onGetDataLoadOutOfStock({ object, items });

            const check = r?.data?.boms?.map((e) => {
                const object = isState.dataTableBom?.data?.bomsClientHistory?.find((item) => item?.item_id == e?.item_id);
                if (e?.item_id == object?.item_id) {
                    return {
                        ...e,
                        warehouseId: object?.warehouseId
                    }
                }
                return {
                    ...e,
                    warehouseId: e?.list_warehouse_bom
                }

            })

            queryState({
                dataTableBom: {
                    ...r,
                    data: {
                        ...r?.data,
                        boms: check,
                        bomsClientHistory: check
                    }
                }
            });

        } catch (error) {
            console.error('Error in onGetBom:', error);
        }
    }, 500), [isState.dataTableProducts, isState.dataTableBom]);

    const getPriorityItem = (semi, products) => {
        const semiItem = semi.find(item => item.active == "0");
        if (semiItem) return { object: semiItem, type: "BTP" };

        const productItem = products.find(item => item.active == "0");
        if (productItem) return { object: productItem, type: "TP" };

        return null;
    };

    useEffect(() => {
        if (isState.open) {
            const s = getPriorityItem(data?.stage_semi_products || [], data?.stage_products || []);
            console.log("s", s);

            if (s) {
                handleSelectStep(s?.type, s?.object, 'auto');
            }
        }
    }, [isState.open, data])

    useEffect(() => {
        if (isState.open) {
            setState({ ...initialState, open: true })
            return
        }
        setState({ ...initialState })

    }, [isState.open])

    const checkItemFinalStage = isState.dataTableProducts?.data?.items?.some(e => e.final_stage == 1)

    return (
        <PopupCustom
            title={<p>Hoàn thành công đoạn <span className="text-blue-500">(Số lệnh sản xuất: {data?.po?.reference_no})</span></p>}
            button={

                <div className="flex items-center gap-2 px-3 py-2 ">
                    <FaCheck className="text-base text-white" />
                    <h3 className="text-xs font-medium text-white 3xl:text-base">
                        Hoàn thành công đoạn
                    </h3>
                </div>

            }
            onClickOpen={() => {
                queryState({ open: true });
            }}
            lockScroll={true}
            open={isState.open}
            onClose={() => {
                queryState({ open: false });
            }}
            classNameBtn={`rounded-lg bg-blue-500`}
        >
            <div className="flex items-center space-x-4 my-2 border-[#E7EAEE] border-opacity-70 border-b-[1px]" />
            <div className={`w-[85vw] xl:h-[80vh] h-[575px] overflow-hidden `}>
                <div className="grid h-full grid-cols-12 gap-4 overflow-hidden">
                    {/* Left Panels */}
                    <div className="grid h-full grid-cols-2 col-span-4 border-b divide-x bg-gray-50">
                        {/* Công đoạn TP */}
                        <div className="col-span-1 !border-l ">
                            <div className="p-3 font-normal border-y">Công đoạn TP</div>
                            <Customscrollbar className="h-full hover:overflow-y-auto overflow-y-hidden max-h-[calc(80vh_-_60px)]">
                                {
                                    data?.stage_products?.length > 0
                                        ?
                                        data?.stage_products?.map((e) => (
                                            <li
                                                key={e?.stage_id}
                                                onClick={() => handleSelectStep("TP", e, 'click')}
                                                className={`p-3 cursor-pointer ${activeStep.type == "TP" && activeStep?.item?.stage_id == e?.stage_id
                                                    ? "bg-green-100 border-l-4 border-green-500" : "hover:bg-gray-100"
                                                    } ${e?.active == "1" ? "text-green-500" : "text-gray-500"} text-sm list-none flex items-center gap-2 transition-all duration-150 ease-linear select-none`}
                                            >
                                                <div className="min-w-[16px] flex items-center justify-center">
                                                    {
                                                        e?.active == "1"
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
                            <div className="p-3 font-normal border-y">Công đoạn BTP</div>
                            <Customscrollbar className="h-full hover:overflow-y-auto overflow-y-hidden  max-h-[calc(80vh_-_60px)]">
                                {
                                    data?.stage_semi_products?.length > 0
                                        ?
                                        data?.stage_semi_products?.map((e) => (
                                            <li
                                                key={e?.stage_id}
                                                onClick={() => handleSelectStep("BTP", e, 'click')}
                                                className={`p-3 cursor-pointer ${activeStep.type == "BTP" && activeStep?.item?.stage_id == e?.stage_id
                                                    ? "bg-green-100 border-l-4 border-green-500" : "hover:bg-gray-100"
                                                    } ${e?.active == "1" ? "text-green-500" : "text-gray-500"} text-sm list-none flex items-center gap-2 transition-all duration-200 ease-linear select-none`}
                                            >
                                                <div className="min-w-[16px] flex items-center justify-center">
                                                    {
                                                        e?.active == "1"
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
                                <div className="text-lg font-normal">Nhập thành phẩm</div>
                                <SelectCore
                                    options={data?.warehouses || []}
                                    onChange={(e) => queryState({ objectWareHouse: e })}
                                    value={isState.objectWareHouse}
                                    isClearable={true}
                                    closeMenuOnSelect={true}
                                    hideSelectedOptions={false}
                                    placeholder={'Kho thành phẩm'}
                                    className={`${!isState.objectWareHouse ? 'border-red-500' : 'border-transparent'} placeholder:text-slate-300 w-1/3 z-30 bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `}
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
                                        // control: (base, state) => ({
                                        //     ...base,
                                        //     boxShadow: "none",
                                        //     padding: "2.7px",
                                        //     ...(state.isFocused && {
                                        //         // border: "0 0 0 1px #92BFF7",
                                        //     }),
                                        // }),
                                    }}
                                />
                            </div>
                            <div className="">
                                <Customscrollbar
                                    ref={tableRef}
                                    className="h-[calc(80vh_/_2_-_115px)] overflow-auto bg-white"
                                >
                                    <table className="w-full text-sm font-normal border border-separate border-gray-200 table-auto border-spacing-0">
                                        <thead className="sticky top-0 z-10 bg-gray-100">
                                            <tr>
                                                {/* <th className="border p-2 font-normal min-w-[150px] sticky left-0 z-20 bg-gray-100">Lệnh SXCT</th> */}
                                                <th className="border p-2 font-normal min-w-[100px] sticky left-[0px] z-20 bg-gray-100">Hình ảnh</th>
                                                <th className="border p-2 font-normal min-w-[250px] sticky left-[100px] z-20 bg-gray-100">Mặt hàng</th>
                                                <th className="border p-2 font-normal min-w-[150px]">Đơn vị sản xuất</th>
                                                <th className="border p-2 font-normal min-w-[120px]">SL hoàn thành</th>
                                                {
                                                    (checkItemFinalStage && dataProductSerial.is_enable === "1") ? (
                                                        <th className="border p-2 font-normal min-w-[120px]">
                                                            Serial hoàn thành
                                                        </th>
                                                    )
                                                        : null
                                                }
                                                <th className="border p-2 font-normal min-w-[120px]">SL lỗi</th>
                                                {
                                                    (checkItemFinalStage && dataProductSerial.is_enable === "1") ? (
                                                        <th className="border p-2 font-normal min-w-[120px]">
                                                            Serial lỗi
                                                        </th>
                                                    ) : null
                                                }
                                                {
                                                    (checkItemFinalStage && (dataMaterialExpiry.is_enable === "1" || dataProductExpiry.is_enable === "1")) ?
                                                        <>
                                                            <th className="border p-2 font-normal min-w-[120px]">
                                                                {'Lot'}
                                                            </th>
                                                            <th className="border p-2 font-normal min-w-[150px]">
                                                                {dataLang?.warehouses_detail_date ?? "warehouses_detail_date"}
                                                            </th>
                                                        </>
                                                        : null
                                                }
                                                <th className="border p-2 font-normal min-w-[120px]">SL cần nhập</th>
                                                <th className="border p-2 font-normal min-w-[120px]">SL đã nhập</th>
                                                <th className="border p-2 font-normal min-w-[100px]">Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody className="h-[calc(80vh_/_2_-_155px)]">
                                            {isLoadingActiveStages && activeStep.type == "TP" ? (
                                                <tr>
                                                    <td colSpan={9}>
                                                        <Loading className="!h-[100px] w-full mx-auto" />
                                                    </td>
                                                </tr>
                                            ) : isState.dataTableProducts?.data?.items?.length > 0 ? (
                                                isState.dataTableProducts?.data?.items?.map((row, index) => (
                                                    <tr key={index}>
                                                        {/* <td className="sticky z-[1] left-0 p-2 text-sm text-center text-blue-500 bg-white border">
                                                            {row?.reference_no_detail}
                                                        </td> */}
                                                        <td className="p-2 border sticky z-[1] left-[0px] bg-white">
                                                            <div className="flex items-center justify-center">
                                                                <Image
                                                                    src={row?.images ? row?.images : "/nodata.png"}
                                                                    // large={row?.images ? row?.images : "/nodata.png"}
                                                                    width={36}
                                                                    height={36}
                                                                    alt={row?.images ? row?.images : "/nodata.png"}
                                                                    className="object-cover rounded-md min-w-[48px] min-h-[48px] w-[48px] h-[48px] max-w-[48px] max-h-[48px]"
                                                                />
                                                            </div>
                                                        </td>
                                                        <td className="p-2 text-sm border sticky z-[1] left-[100px] bg-white">
                                                            <p>{row?.item_name}</p>
                                                            <p className="text-xs italic">{row?.product_variation}</p>
                                                            <p className="text-xs text-blue-500">{row?.reference_no_detail}</p>
                                                        </td>
                                                        <td className="p-2 text-sm text-center border">{row?.unit_name}</td>
                                                        <td className="p-2 text-sm border  w-[120px]">
                                                            <InPutNumericFormat
                                                                onValueChange={(e) =>
                                                                    handleChange({
                                                                        table: "product",
                                                                        type: 'quantityEnterClient',
                                                                        row,
                                                                        value: e
                                                                    })}
                                                                value={row?.quantityEnterClient || ''}
                                                                className={`${(!row?.quantityEnterClient && !row?.quantityError) ? "border-red-500" : "border-gray-200"} w-full appearance-none text-center text-sm 3xl:px-1 2xl:px-0.5 xl:px-0.5 p-0 font-normal focus:outline-none border-b-2`}
                                                                isAllowed={isAllowedNumber}
                                                            />
                                                        </td>
                                                        {
                                                            (checkItemFinalStage && dataProductSerial.is_enable === "1") ? (
                                                                <td className="p-2 text-sm border  w-[120px]">
                                                                    <div className="flex flex-col gap-1">
                                                                        {
                                                                            Array(row?.quantityEnterClient || 0).fill(0).map((_, sIndex) => {
                                                                                return (
                                                                                    <input
                                                                                        key={sIndex}
                                                                                        value={row.serial?.[sIndex]?.value || ""}
                                                                                        onChange={(e) => {
                                                                                            handleChange({
                                                                                                table: "product",
                                                                                                type: "serial",
                                                                                                value: e.target.value.trim(),
                                                                                                row,
                                                                                                index: sIndex
                                                                                            });
                                                                                        }}
                                                                                        className={`
                                                                                            border text-center py-1 px-1 font-medium w-full focus:outline-none 
                                                                                            ${row.serial?.[sIndex]?.isDuplicate ? "border-red-500" : "border-gray-200 border-b-2"}
                                                                                        `}
                                                                                    />

                                                                                )
                                                                            })
                                                                        }
                                                                    </div>
                                                                </td>
                                                            )
                                                                : null
                                                        }

                                                        <td className="p-2 border w-[120px]">
                                                            <InPutNumericFormat
                                                                onValueChange={(e) =>
                                                                    handleChange({
                                                                        table: "product",
                                                                        type: 'quantityError',
                                                                        row,
                                                                        value: e
                                                                    })}
                                                                value={row?.quantityError ? row?.quantityError : ""}
                                                                className={`${(!row?.quantityEnterClient && !row?.quantityError) ? "border-red-500" : "border-gray-200"} appearance-none text-center text-sm 3xl:px-1 2xl:px-0.5 xl:px-0.5 p-0 font-normal focus:outline-none w-full border-b-2`}
                                                                isAllowed={isAllowedNumber}
                                                            />
                                                        </td>
                                                        {
                                                            (checkItemFinalStage && dataProductSerial.is_enable === "1") ? (
                                                                <td className="p-2 text-sm border  w-[120px]">
                                                                    <div className="flex flex-col gap-1">
                                                                        {
                                                                            Array(row?.quantityError || 0).fill(0).map((_, sIndex) => {
                                                                                return (
                                                                                    <input
                                                                                        key={sIndex}
                                                                                        value={row.serialError?.[sIndex]?.value || ""}
                                                                                        onChange={(e) => {
                                                                                            handleChange({
                                                                                                table: "product",
                                                                                                type: "serialError",
                                                                                                value: e.target.value.trim(),
                                                                                                row,
                                                                                                index: sIndex
                                                                                            });
                                                                                        }}
                                                                                        className={`
                                                                                            border text-center py-1 px-1 font-medium w-full focus:outline-none 
                                                                                            ${row.serialError?.[sIndex]?.isDuplicate ? "border-red-500" : "border-gray-200 border-b-2"}
                                                                                        `}
                                                                                    />

                                                                                )
                                                                            })
                                                                        }
                                                                    </div>
                                                                </td>
                                                            ) :
                                                                null
                                                        }
                                                        {
                                                            (checkItemFinalStage && (dataMaterialExpiry.is_enable === "1" || dataProductExpiry.is_enable === "1")) &&
                                                            <>
                                                                <td className="p-2 text-sm border  w-[120px]">
                                                                    <input
                                                                        value={row?.lot || ""}
                                                                        disabled={(dataProductExpiry?.is_enable == "1" && false) ||
                                                                            (dataProductExpiry?.is_enable == "0" && true)}
                                                                        onChange={(e) => {
                                                                            handleChange({
                                                                                table: "product",
                                                                                type: "lot",
                                                                                value: e.target.value,
                                                                                row,
                                                                            });
                                                                        }}
                                                                        className={`border text-center py-1 px-1 font-medium w-full focus:outline-none border-gray-200 border-b-2} `}
                                                                    />
                                                                </td>
                                                                <td className="p-2 text-sm border w-[150px]">
                                                                    <div className="relative">
                                                                        <DatePicker
                                                                            dateFormat="dd/MM/yyyy"
                                                                            placeholderText={dataLang?.warehouses_detail_date ?? "warehouses_detail_date"}
                                                                            selected={row?.date}
                                                                            disabled={(dataProductExpiry?.is_enable == "1" && false) ||
                                                                                (dataProductExpiry?.is_enable == "0" && true)}
                                                                            onChange={(e) => {
                                                                                handleChange({
                                                                                    table: "product",
                                                                                    type: "date",
                                                                                    value: e,
                                                                                    row,
                                                                                });
                                                                            }}
                                                                            className={`border-gray-200 bg-transparent disabled:bg-gray-100 relative z-1  placeholder:text-slate-300 w-full  rounded text-[#52575E] p-2 border outline-none text-xs `}
                                                                        />
                                                                        <Calendar
                                                                            size={14}
                                                                            className="absolute top-1/2 -translate-y-1/2 right-1 text-[#cccccc]"
                                                                        />
                                                                    </div>
                                                                </td>
                                                            </>
                                                        }
                                                        <td className="p-2 text-sm text-center border">{formatNumber(row?.quantity_enter)}</td>
                                                        <td className="p-2 text-sm text-center border">{formatNumber(row?.quantity_entered)}</td>
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
                                            ) : (
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
                                    <table className="w-full">
                                        <tfoot className="sticky bottom-0 z-10">
                                            <tr className="font-normal bg-gray-100">
                                                <td
                                                    className="sticky left-0 z-20 p-2 font-normal text-center bg-gray-100 border"
                                                    colSpan={3}
                                                    style={{
                                                        minWidth: "calc(100px + 100px + 150px)",
                                                        width: "calc(100px + 100px + 150px)",
                                                    }}
                                                >
                                                    TỔNG CỘNG
                                                </td>
                                                <td className="p-2 text-center border font-normal min-w-[150px]"></td>
                                                <td className="p-2 text-center border font-normal min-w-[120px]">{formatNumber(totalQuantity)}</td>
                                                {
                                                    (checkItemFinalStage && dataProductSerial.is_enable === "1") && (
                                                        <th className="border p-2 font-normal min-w-[120px]">
                                                        </th>
                                                    )
                                                }
                                                <td className="p-2 text-center border font-normal min-w-[120px]">{formatNumber(totalQuantityError)}</td>
                                                {
                                                    (checkItemFinalStage && (dataMaterialExpiry.is_enable === "1" || dataProductExpiry.is_enable === "1")) && (
                                                        <>
                                                            <th className="border p-2 font-normal min-w-[120px]">
                                                            </th>
                                                            <th className="border p-2 font-normal min-w-[120px]">
                                                            </th>
                                                        </>
                                                    )
                                                }
                                                <td className="p-2 text-center border font-normal min-w-[120px]">{formatNumber(totalQuantityEnter)}</td>
                                                <td className="p-2 text-center border font-normal min-w-[120px]">{formatNumber(totalQuantityEntered)}</td>
                                                <td className="p-2 text-center border font-normal min-w-[100px]"></td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Xuất kho sản xuất */}
                        <div>
                            <div className="mb-4 text-lg font-normal">Xuất kho sản xuất</div>
                            <Customscrollbar className="h-[calc(80vh_/_2_-_115px)] overflow-auto bg-white ">
                                <table className="w-full text-sm [&>thead>tr>th]:font-normal border border-separate border-spacing-0 border-gray-200 table-auto">
                                    <thead className="sticky top-0 z-10 bg-gray-100">
                                        <tr>
                                            <th className="border p-2 font-normal min-w-[100px]">Hình ảnh</th>
                                            <th className="border p-2 font-normal min-w-[250px]">Mặt hàng</th>
                                            <th className="border p-2 font-normal min-w-[120px]">SL sản xuất</th>
                                            <th className="border p-2 font-normal min-w-[120px]">SL xuất kho</th>
                                            <th className="border p-2 font-normal min-w-[120px]">Tồn kho</th>
                                            <th className="border p-2 font-normal min-w-[290px]">Kho hàng</th>
                                            <th className="border p-2 font-normal min-w-[100px]">Thao tác</th>
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
                                                isState.dataTableBom?.data?.boms?.length > 0 ? (
                                                    isState.dataTableBom?.data?.boms?.map((row, index) => (
                                                        <tr key={index}>
                                                            <td className="p-2 border">
                                                                <div className="flex items-center justify-center ">
                                                                    <Image
                                                                        src={row?.images ? row?.images : "/nodata.png"}
                                                                        // large={row?.images ? row?.images : "/nodata.png"}
                                                                        width={36}
                                                                        height={36}
                                                                        alt={row?.images ? row?.images : "/nodata.png"}
                                                                        className="object-cover rounded-md min-w-[48px] min-h-[48px] w-[48px] h-[48px] max-w-[48px] max-h-[48px]"
                                                                    />
                                                                </div>
                                                            </td>
                                                            <td className="p-2 text-sm border">
                                                                <div className="flex flex-col gap-0.5 h-full">
                                                                    <p>
                                                                        {row?.item_name}
                                                                    </p>
                                                                    <p className="text-xs italic">
                                                                        {row?.product_variation}
                                                                    </p>
                                                                    {
                                                                        row?.reference_no_detail && (
                                                                            <p className="text-xs text-blue-500">{row?.reference_no_detail}</p>
                                                                        )
                                                                    }
                                                                    {/* type_item */}
                                                                    <div className="flex items-center gap-1">
                                                                        <span className={`py-[1px] px-1 rounded border h-fit w-fit font-[300] break-words leading-relaxed text-xs
                                                                     ${(row?.type_products === "products" && "text-lime-500 border-lime-500") ||
                                                                            (row?.type_products == "semi_products" && "text-orange-500 border-orange-500") ||
                                                                            (row?.type_products == "out_side" && "text-sky-500 border-sky-500") ||
                                                                            (row?.type_products == "materials" && "text-purple-500 border-purple-500") ||
                                                                            (row?.type_products == "material" && "text-purple-500 border-purple-500") ||
                                                                            (row?.type_products == "semi_products_outside" && "text-green-500 border-green-500")
                                                                            }`}
                                                                        >
                                                                            {dataLang[row?.type_products] ?? row?.type_products}
                                                                        </span>
                                                                        {
                                                                            row?.stage_name && (
                                                                                <span className="py-[1px] px-1 rounded border h-fit w-fit font-[300] break-words leading-relaxed text-teal-500 border-teal-500 text-xs">
                                                                                    {row?.stage_name}
                                                                                </span>
                                                                            )
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="p-2 text-sm text-center border">
                                                                {formatNumber(row?.quantity_total_quota)}/ <span className="relative text-xs top-1">{row?.unit_name}</span>
                                                            </td>
                                                            <td className="p-2 text-sm text-center border">
                                                                {formatNumber(row?.quantity_quota_primary)}/ <span className="relative text-xs top-1">{row?.unit_name_primary}</span>
                                                            </td>
                                                            <td className="p-2 text-sm text-center border">
                                                                {formatNumber(row?.quantity_warehouse)}
                                                            </td>
                                                            <td className="p-2 text-sm border w-[290px]">
                                                                <SelectComponent
                                                                    options={row?.list_warehouse_bom || []}
                                                                    value={row?.warehouseId}
                                                                    maxShowMuti={1}
                                                                    isClearable={false}
                                                                    isMulti={true}
                                                                    components={{ MultiValue }}
                                                                    onChange={(e) =>
                                                                        handleChange({
                                                                            table: "bom",
                                                                            type: 'warehouseId',
                                                                            row,
                                                                            value: e
                                                                        })}
                                                                    className={`${row?.warehouseId?.length == 0 ? "border-red-500 border" : ""}  my-1  text-xs placeholder:text-slate-300 w-full  rounded text-[#52575E] font-normal`}
                                                                    noOptionsMessage={() => dataLang?.returns_nodata || "returns_nodata"}
                                                                    menuPortalTarget={document.body}
                                                                    placeholder={"Kho xuất - Vị trí xuất"}
                                                                    formatOptionLabel={(option) => {
                                                                        return (
                                                                            <>
                                                                                <h2 className="text-xs">
                                                                                    {dataLang?.import_Warehouse || "import_Warehouse"}  : {option?.label}
                                                                                </h2>
                                                                                <h2 className="text-xs">
                                                                                    {option?.name_location}
                                                                                </h2>

                                                                                <div className="">
                                                                                    <div className="flex items-center">
                                                                                        <h4 className="text-[10px]">
                                                                                            {dataLang?.returns_survive}:
                                                                                        </h4>
                                                                                        <h4 className="pl-1 text-[10px]">
                                                                                            {formatNumber(option?.quantity_warehouse)}
                                                                                        </h4>
                                                                                    </div>
                                                                                    {dataProductSerial?.is_enable === "1" && (
                                                                                        <div className="flex items-center">
                                                                                            <h4 className="text-[10px] italic">
                                                                                                {"Serial"}:
                                                                                            </h4>
                                                                                            <h4 className="pl-1 text-[10px] italic">
                                                                                                {option?.serial}
                                                                                            </h4>
                                                                                        </div>
                                                                                    )}
                                                                                    {
                                                                                        (dataMaterialExpiry.is_enable === "1" || dataProductExpiry?.is_enable === "1") && (
                                                                                            <>
                                                                                                <div className="flex items-center justify-start">
                                                                                                    <h4 className="text-[10px] italic">
                                                                                                        {"Lot"}:
                                                                                                    </h4>
                                                                                                    <h4 className="pl-1 text-[10px] italic">
                                                                                                        {option?.lot}
                                                                                                    </h4>
                                                                                                </div>
                                                                                                <div className="flex items-center">
                                                                                                    <h4 className="text-[10px] italic">
                                                                                                        {dataLang?.warehouses_detail_date || "warehouses_detail_date"}:
                                                                                                    </h4>
                                                                                                    <h4 className="pl-1 text-[10px] italic">
                                                                                                        {option?.expiration_date}
                                                                                                    </h4>
                                                                                                </div>
                                                                                            </>
                                                                                        )
                                                                                    }
                                                                                </div>
                                                                            </>
                                                                        );
                                                                    }}
                                                                    style={{
                                                                        border: "none",
                                                                        boxShadow: "none",
                                                                        outline: "none",
                                                                    }}
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
                                                                        menu: (provided, state) => ({
                                                                            ...provided,
                                                                            width: "100%",
                                                                        }),


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
                                                                    classNamePrefix="customDropdow classNamePrefixLotDateSerial"
                                                                />
                                                            </td>
                                                            <td className="p-2 text-sm text-center border">
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
                                loading={isLoadingSubmit}
                                dataLang={dataLang}
                                onClick={handleSubmit.bind(this)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </PopupCustom >
    );
};

export default PopupConfimStage;
