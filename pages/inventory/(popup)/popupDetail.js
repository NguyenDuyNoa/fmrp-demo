import React, { useEffect, useState } from "react";
import PopupEdit from "/components/UI/popup";
import Loading from "components/UI/loading";
import Popup from "reactjs-popup";
import { SearchNormal1 as IconSearch } from "iconsax-react";
import { _ServerInstance as Axios } from "/services/axios";
import dynamic from "next/dynamic";
import moment from "moment";
import ModalImage from "react-modal-image";
const ScrollArea = dynamic(() => import("react-scrollbar"), {
    ssr: false,
});

const Popup_chitiet = (props) => {
    const [open, sOpen] = useState(false);
    const _ToggleModal = (e) => sOpen(e);
    const [data, sData] = useState();
    const [onFetching, sOnFetching] = useState(false);

    const [dataMaterialExpiry, sDataMaterialExpiry] = useState({});
    const [dataProductExpiry, sDataProductExpiry] = useState({});
    const [dataProductSerial, sDataProductSerial] = useState({});

    useEffect(() => {
        props?.id && sOnFetching(true);
    }, [open]);

    const _ServerFetching = () => {
        Axios(
            "GET",
            "/api_web/api_setting/feature/?csrf_protection=true",
            {},
            (err, response) => {
                if (!err) {
                    var data = response.data;
                    sDataMaterialExpiry(
                        data.find((x) => x.code == "material_expiry")
                    );
                    sDataProductExpiry(
                        data.find((x) => x.code == "product_expiry")
                    );
                    sDataProductSerial(
                        data.find((x) => x.code == "product_serial")
                    );
                }
                sOnFetching(false);
            }
        );
    };

    const _ServerFetching_detailUser = () => {
        Axios(
            "GET",
            `/api_web/api_inventory/inventory/${props?.id}`,
            {},
            (err, response) => {
                if (!err) {
                    var db = response.data;
                    sData(db);
                }
                sOnFetching(false);
            }
        );
    };

    useEffect(() => {
        (onFetching && _ServerFetching_detailUser()) ||
            (onFetching && _ServerFetching());
    }, [open]);

    //copy arr
    let listQty = data?.items || [];
    //Tổng số lượng trong kho lúc kiểm kê
    let totalQuantity = listQty?.reduce(
        (acc, item) => acc + parseInt(item?.quantity),
        0
    );
    //Tổng số lượng thực
    let quantity_net = listQty?.reduce(
        (acc, item) => acc + parseInt(item?.quantity_net),
        0
    );
    //Tổng số lượng chênh lệch
    let quantity_diff = listQty?.reduce(
        (acc, item) => acc + parseInt(item?.quantity_diff),
        0
    );
    //Thành tiền
    let amount = listQty?.reduce(
        (acc, item) => acc + parseInt(item?.amount),
        0
    );

    const formatNumber = (number) => {
        if (!number && number !== 0) return 0;
        const integerPart = Math.floor(number);
        const decimalPart = number - integerPart;
        const roundedDecimalPart = decimalPart >= 0.05 ? 1 : 0;
        const roundedNumber = integerPart + roundedDecimalPart;
        return roundedNumber.toLocaleString("en");
    };
    return (
        <>
            <PopupEdit
                title={
                    props.dataLang?.inventory_title_detail ||
                    "inventory_title_detail"
                }
                button={props?.name}
                onClickOpen={_ToggleModal.bind(this, true)}
                open={open}
                onClose={_ToggleModal.bind(this, false)}
                classNameBtn={props?.className}
            >
                {/* <div className="mt-4 space-x-5 3xl:w-[1250px] 2xl:w-[1100px] w-[1050px] h-auto"> */}
                <div className=" space-x-5 3xl:w-[1250px] 2xl:w-[1100px] w-[1050px] 3xl:h-auto  2xl:h-auto xl:h-[540px] h-[500px] ">
                    <div>
                        <div className="3xl:w-[1250px] 2xl:w-[1100px] w-[1050px]">
                            <div className="min:h-[170px] h-[72%] max:h-[100px]  overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                <h2 className="font-medium bg-[#ECF0F4] p-2">
                                    {props?.dataLang?.purchase_general ||
                                        "purchase_general"}
                                </h2>
                                <div className="grid grid-cols-13 gap-2  min-h-[110px] p-2">
                                    <div className="col-span-3">
                                        <div className="my-4 font-medium grid grid-cols-2">
                                            <h3 className="col-span-1 text-[13px]">
                                                {props.dataLang
                                                    ?.inventory_dayvouchers ||
                                                    "inventory_dayvouchers"}
                                            </h3>
                                            <h3 className="col-span-1 text-[13px] font-medium">
                                                {data?.date != null
                                                    ? moment(data?.date).format(
                                                          "DD/MM/YYYY"
                                                      )
                                                    : ""}
                                            </h3>
                                        </div>
                                        <div className="my-4 font-medium grid grid-cols-2">
                                            <h3 className="col-span-1 text-[13px]">
                                                {props.dataLang
                                                    ?.inventory_vouchercode ||
                                                    "inventory_vouchercode"}
                                            </h3>
                                            <h3 className="col-span-1 text-[13px] font-medium">
                                                {data?.code}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="col-span-3 ">
                                        <div className="my-4 font-medium grid grid-cols-2">
                                            <h3 className="col-span-1 text-[13px]">
                                                {props.dataLang
                                                    ?.inventory_warehouse ||
                                                    "inventory_warehouse"}
                                            </h3>
                                            <h3 className="col-span-1 font-medium text-[13px]">
                                                {data?.warehouse_name}
                                            </h3>
                                        </div>
                                        <div className="my-4 font-medium grid grid-cols-2">
                                            <h3 className="col-span-1 text-[13px]">
                                                {props.dataLang
                                                    ?.inventory_total_item ||
                                                    "inventory_total_item"}
                                            </h3>
                                            <h3 className="col-span-1 font-medium text-[13px]">
                                                {formatNumber(data?.total_item)}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="col-span-3">
                                        <div className="my-4 font-medium grid grid-cols-2">
                                            <h3 className="col-span-1 text-[13px]">
                                                {props.dataLang
                                                    ?.inventory_creator ||
                                                    "inventory_creator"}
                                            </h3>
                                            <h3 className="flex items-center gap-1 col-span-1 text-[13px]">
                                                <img
                                                    src={
                                                        data?.staff_create_image
                                                    }
                                                    className="object-cover rounded-[100%] w-6 h-6 text-left"
                                                ></img>{" "}
                                                <span className="font-medium">
                                                    {data?.staff_create_name}{" "}
                                                </span>
                                            </h3>
                                        </div>
                                        <div className="my-4 font-medium grid grid-cols-2">
                                            <h3 className="col-span-1 text-[13px]">
                                                {props.dataLang
                                                    ?.inventory_status ||
                                                    "inventory_status"}
                                            </h3>
                                            <h3 className="col-span-1 cursor-pointer">
                                                <Popup
                                                    className="dropdown-avt "
                                                    key={data?.staff_create_id}
                                                    trigger={(open) => (
                                                        <span className="border border-orange-500 text-orange-500 p-1 rounded-md text-[13px]">
                                                            {" "}
                                                            {data?.adjusted
                                                                ? data?.adjusted.split(
                                                                      "|||"
                                                                  ).length +
                                                                  " " +
                                                                  " Điều chỉnh"
                                                                : ""}
                                                        </span>
                                                    )}
                                                    position="top center"
                                                    on={["hover"]}
                                                    arrow={false}
                                                >
                                                    <span className="bg-[#0f4f9e] text-white rounded p-1.5 text-[13px]">
                                                        {data?.adjusted
                                                            ?.split("|||")
                                                            ?.map(
                                                                (item) =>
                                                                    item?.split(
                                                                        "--"
                                                                    )[1]
                                                            )
                                                            ?.map((e) => e)
                                                            .join(", ")}{" "}
                                                    </span>
                                                </Popup>
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="col-span-3 ">
                                        {/* <div className='my-4 font-medium grid grid-cols-2'><h3 className='col-span-1 text-[13px]'>{props.dataLang?.inventory_note || "inventory_note"}</h3><h3 className='col-span-1 font-normal text-[13px]'>{data?.note}</h3></div> */}
                                        <div className="my-4 font-medium grid grid-cols-2">
                                            <h3 className="col-span-1 text-[13px]">
                                                {props.dataLang
                                                    ?.inventory_branch ||
                                                    "inventory_branch"}
                                            </h3>
                                            <h3 className="w-fit 3xl:items-center 3xl-text-[18px] 2xl:text-[13px] xl:text-xs text-[8px] text-[#0F4F9E] font-[300] px-2 py-0.5 border border-[#0F4F9E] bg-white rounded-[5.5px] uppercase">
                                                {data?.branch_name}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                                <div className="pr-2 w-[100%] lx:w-[110%] ">
                                    {/* <div
                                        className={`${
                                            dataProductSerial.is_enable == "1"
                                                ? dataMaterialExpiry.is_enable !=
                                                  dataProductExpiry.is_enable
                                                    ? "grid-cols-13"
                                                    : dataMaterialExpiry.is_enable ==
                                                      "1"
                                                    ? "grid-cols-13"
                                                    : "grid-cols-11"
                                                : dataMaterialExpiry.is_enable !=
                                                  dataProductExpiry.is_enable
                                                ? "grid-cols-12"
                                                : dataMaterialExpiry.is_enable ==
                                                  "1"
                                                ? "grid-cols-12"
                                                : "grid-cols-10"
                                        }  grid sticky top-0 bg-white shadow  z-10`}
                                    >
                                        <h4 className="ext-[13px] px-2 py-1.5 text-gray-600 uppercase  font-semibold col-span-2 text-center">
                                            {props.dataLang?.inventory_items ||
                                                "inventory_items"}
                                        </h4>
                                        <h4 className="ext-[13px] px-2 py-1.5 text-gray-600 uppercase  font-semibold col-span-1 text-center">
                                            {props.dataLang?.inventory_unit ||
                                                "inventory_unit"}
                                        </h4>
                                        <h4 className="ext-[13px] px-2 py-1.5 text-gray-600 uppercase  font-semibold col-span-1 text-center">
                                            {props.dataLang
                                                ?.inventory_unit_price ||
                                                "inventory_unit_price"}
                                        </h4>
                                        {dataProductSerial.is_enable ===
                                            "1" && (
                                            <h4 className="ext-[13px] px-2 py-1.5 text-gray-600 uppercase  font-semibold text-center">
                                                {"Serial"}
                                            </h4>
                                        )}
                                        {dataMaterialExpiry.is_enable === "1" ||
                                        dataProductExpiry.is_enable === "1" ? (
                                            <>
                                                <h4 className="ext-[13px] px-2 py-1.5 text-gray-600 uppercase  font-semibold text-center">
                                                    {"Lot"}
                                                </h4>
                                                <h4 className="ext-[13px] px-2 py-1.5 text-gray-600 uppercase  font-semibold text-center">
                                                    {props.dataLang
                                                        ?.warehouses_detail_date ||
                                                        "warehouses_detail_date"}
                                                </h4>
                                            </>
                                        ) : (
                                            ""
                                        )}
                                        <h4 className="ext-[13px] px-2 py-1.5 text-gray-600 uppercase  font-semibold col-span-1 text-center">
                                            {props.dataLang
                                                ?.inventory_warehouse_location ||
                                                "inventory_warehouse_location"}
                                        </h4>
                                        <h4 className="ext-[13px] px-2 py-1.5 text-gray-600 uppercase  font-semibold col-span-1 text-center">
                                            {props.dataLang
                                                ?.inventory_qty_inventory ||
                                                "inventory_qty_inventory"}
                                        </h4>
                                        <h4 className="ext-[13px] px-2 py-1.5 text-gray-600 uppercase  font-semibold col-span-1 text-center">
                                            {props.dataLang
                                                ?.inventory_actual_quantity ||
                                                "inventory_actual_quantity"}
                                        </h4>
                                        <h4 className="ext-[13px] px-2 py-1.5 text-gray-600 uppercase  font-semibold col-span-1 text-center">
                                            {props.dataLang
                                                ?.inventory_qty_difference ||
                                                "inventory_qty_difference"}
                                        </h4>
                                        <h4 className="ext-[13px] px-2 py-1.5 text-gray-600 uppercase  font-semibold col-span-1 text-center">
                                            {props.dataLang
                                                ?.inventory_qty_into_money ||
                                                "inventory_qty_into_money"}
                                        </h4>
                                        <h4 className="ext-[13px] px-2 py-1.5 text-gray-600 uppercase  font-semibold col-span-1 text-center">
                                            {props.dataLang?.inventory_handle ||
                                                "inventory_handle"}
                                        </h4>
                                    </div> */}
                                    <div
                                        className={`grid-cols-13  grid sticky top-0 bg-white shadow-lg  z-10 items-center`}
                                    >
                                        <h4 className="text-[13px] px-2 py-1.5 text-gray-600 uppercase  font-semibold col-span-3 text-center whitespace-nowrap">
                                            {props.dataLang?.inventory_items ||
                                                "inventory_items"}
                                        </h4>

                                        <h4 className="text-[13px] px-2 py-1.5 text-gray-600 uppercase  font-semibold col-span-1 text-center whitespace-nowrap">
                                            {"Kho - VTK"}
                                        </h4>
                                        <h4 className="text-[13px] px-2 py-1.5 text-gray-600 uppercase  font-semibold col-span-1 text-center whitespace-nowrap">
                                            {props.dataLang?.inventory_unit ||
                                                "inventory_unit"}
                                        </h4>
                                        <h4 className="text-[13px] px-2 py-1.5 text-gray-600 uppercase  font-semibold col-span-1 text-center whitespace-nowrap">
                                            {props.dataLang
                                                ?.inventory_unit_price ||
                                                "inventory_unit_price"}
                                        </h4>
                                        {/* <h4 className="text-[13px] px-2 py-1.5 text-gray-600 uppercase  font-semibold col-span-1 text-center whitespace-nowrap">
                                            {props.dataLang
                                                ?.inventory_warehouse_location ||
                                                "inventory_warehouse_location"}
                                        </h4> */}
                                        <h4 className="text-[13px] px-2 py-1.5 text-gray-600 uppercase  font-semibold col-span-1 text-center">
                                            {props.dataLang
                                                ?.inventory_qty_inventory ||
                                                "inventory_qty_inventory"}
                                        </h4>
                                        <h4 className="text-[13px] px-2 py-1.5 text-gray-600 uppercase  font-semibold col-span-2 text-center whitespace-nowrap">
                                            {props.dataLang
                                                ?.inventory_actual_quantity ||
                                                "inventory_actual_quantity"}
                                        </h4>
                                        <h4 className="text-[13px] px-2 py-1.5 text-gray-600 uppercase  font-semibold col-span-1 text-center whitespace-nowrap">
                                            {props.dataLang
                                                ?.inventory_qty_difference ||
                                                "inventory_qty_difference"}
                                        </h4>
                                        <h4 className="text-[13px] px-2 py-1.5 text-gray-600 uppercase  font-semibold col-span-2 text-center whitespace-nowrap">
                                            {props.dataLang
                                                ?.inventory_qty_into_money ||
                                                "inventory_qty_into_money"}
                                        </h4>
                                        <h4 className="text-[13px] px-2 py-1.5 text-gray-600 uppercase  font-semibold col-span-1 text-center whitespace-nowrap">
                                            {props.dataLang?.inventory_handle ||
                                                "inventory_handle"}
                                        </h4>
                                    </div>
                                    {onFetching ? (
                                        <Loading
                                            className="max-h-28"
                                            color="#0f4f9e"
                                        />
                                    ) : data?.items?.length > 0 ? (
                                        <>
                                            <ScrollArea
                                                className="min-h-[90px] max-h-[200px] 2xl:max-h-[250px] overflow-hidden"
                                                speed={1}
                                                smoothScrolling={true}
                                            >
                                                {/* <div className="divide-y divide-slate-200 min:h-[200px] h-[100%] max:h-[300px]">
                                                    {data?.items?.map((e) => (
                                                        <div
                                                            className={`${
                                                                dataProductSerial.is_enable ==
                                                                "1"
                                                                    ? dataMaterialExpiry.is_enable !=
                                                                      dataProductExpiry.is_enable
                                                                        ? "grid-cols-13"
                                                                        : dataMaterialExpiry.is_enable ==
                                                                          "1"
                                                                        ? "grid-cols-13"
                                                                        : "grid-cols-11"
                                                                    : dataMaterialExpiry.is_enable !=
                                                                      dataProductExpiry.is_enable
                                                                    ? "grid-cols-12"
                                                                    : dataMaterialExpiry.is_enable ==
                                                                      "1"
                                                                    ? "grid-cols-12"
                                                                    : "grid-cols-10"
                                                            } items-center  grid hover:bg-slate-50`}
                                                            key={e.id.toString()}
                                                        >
                                                            <h6 className="text-[13px]   py-1 col-span-2  rounded-md text-left">
                                                                <div className="flex items-center">
                                                                    <div className="">
                                                                        {e?.item
                                                                            ?.images !=
                                                                        null ? (
                                                                            <ModalImage
                                                                                small={
                                                                                    e
                                                                                        ?.item
                                                                                        ?.images
                                                                                }
                                                                                large={
                                                                                    e
                                                                                        ?.item
                                                                                        ?.images
                                                                                }
                                                                                alt="Product Image"
                                                                                style={{
                                                                                    width: "50px",
                                                                                    height: "60px",
                                                                                }}
                                                                                className="object-cover rounded"
                                                                            />
                                                                        ) : (
                                                                            <div className="w-[50px] h-[60px] object-cover  flex items-center justify-center rounded">
                                                                                <ModalImage
                                                                                    small="/no_img.png"
                                                                                    large="/no_img.png"
                                                                                    className="w-full h-full rounded object-contain p-1"
                                                                                >
                                                                                    {" "}
                                                                                </ModalImage>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div>
                                                                        <h6 className="text-[13px]   px-2 py-0.5  text-left">
                                                                            {
                                                                                e
                                                                                    ?.item
                                                                                    ?.name
                                                                            }
                                                                        </h6>
                                                                        <h6 className="text-[13px]   px-2 py-0.5  text-left break-words w-full">
                                                                            {
                                                                                e
                                                                                    ?.item
                                                                                    ?.product_variation
                                                                            }
                                                                        </h6>
                                                                        <h6 className="text-[13px]   px-2 py-0.5  text-left break-words italic">
                                                                            {
                                                                                props
                                                                                    .dataLang[
                                                                                    e
                                                                                        ?.item
                                                                                        ?.text_type
                                                                                ]
                                                                            }
                                                                        </h6>
                                                                    </div>
                                                                </div>
                                                            </h6>
                                                            <h6 className="text-[13px]  px-2 py-1  text-center break-words">
                                                                {
                                                                    e?.item
                                                                        ?.unit_name
                                                                }
                                                            </h6>
                                                            <h6 className="text-[13px]  px-2 py-1 col-span-1 text-center">
                                                                {formatNumber(
                                                                    e?.price
                                                                )}
                                                            </h6>
                                                            {dataProductSerial.is_enable ===
                                                            "1" ? (
                                                                <div className=" col-span-1 py-1">
                                                                    <h6 className="text-[13px]  px-2  w-[full] text-center">
                                                                        {e.serial ==
                                                                            null ||
                                                                        e.serial ==
                                                                            ""
                                                                            ? "-"
                                                                            : e.serial}
                                                                    </h6>
                                                                </div>
                                                            ) : (
                                                                ""
                                                            )}
                                                            {dataMaterialExpiry.is_enable ===
                                                                "1" ||
                                                            dataProductExpiry.is_enable ===
                                                                "1" ? (
                                                                <>
                                                                    <div className=" col-span-1 py-1 ">
                                                                        <h6 className="text-[13px]  px-2  w-[full] text-center">
                                                                            {e.lot ==
                                                                                null ||
                                                                            e.lot ==
                                                                                ""
                                                                                ? "-"
                                                                                : e.lot}
                                                                        </h6>
                                                                    </div>
                                                                    <div className=" col-span-1  py-1">
                                                                        <h6 className="text-[13px]  px-2  w-[full] text-center">
                                                                            {e.expiration_date
                                                                                ? moment(
                                                                                      e.expiration_date
                                                                                  ).format(
                                                                                      "DD-MM-YYYY"
                                                                                  )
                                                                                : "-"}
                                                                        </h6>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                ""
                                                            )}
                                                            <h6 className="text-[13px]  px-2 py-1 col-span-1 text-center ">
                                                                {
                                                                    e?.name_location
                                                                }
                                                            </h6>
                                                            <h6 className="text-[13px]  px-2 py-1 col-span-1 text-center">
                                                                {formatNumber(
                                                                    e?.quantity
                                                                )}
                                                            </h6>
                                                            <h6 className="text-[13px]  px-2 py-1 col-span-1 text-center">
                                                                {formatNumber(
                                                                    e?.quantity_net
                                                                )}
                                                            </h6>
                                                            <h6 className="text-[13px]  px-2 py-1 col-span-1 text-center">
                                                                {formatNumber(
                                                                    e?.quantity_diff
                                                                )}
                                                            </h6>
                                                            <h6 className="text-[13px]  px-2 py-1 col-span-1 text-right">
                                                                {formatNumber(
                                                                    e?.amount
                                                                )}
                                                            </h6>
                                                            <h6
                                                                className={`${
                                                                    e?.handling !=
                                                                    ""
                                                                        ? "text-left text-[13px] px-2 py-1 col-span-1"
                                                                        : "text-right 2xl:text-[12px] xl:text-[13px] text-[12px]  px-2 py-0.5 col-span-1"
                                                                }`}
                                                            >
                                                                {e?.handling !=
                                                                    "" &&
                                                                    props
                                                                        .dataLang[
                                                                        e
                                                                            ?.handling
                                                                    ]}{" "}
                                                                {formatNumber(
                                                                    Math.abs(
                                                                        e?.quantity_diff
                                                                    )
                                                                )}
                                                            </h6>
                                                        </div>
                                                    ))}
                                                </div> */}
                                                <div className="divide-y divide-slate-200 min:h-[170px]  max:h-[170px]">
                                                    {data?.items?.map((e) => (
                                                        <div
                                                            className="grid grid-cols-13 hover:bg-slate-50 items-center border-b"
                                                            key={e.id?.toString()}
                                                        >
                                                            <h6 className="text-[13px]  px-2 py-2 col-span-3 text-left ">
                                                                <div className="flex items-center gap-2">
                                                                    <div>
                                                                        {e?.item
                                                                            ?.images !=
                                                                        null ? (
                                                                            <ModalImage
                                                                                small={
                                                                                    e
                                                                                        ?.item
                                                                                        ?.images
                                                                                }
                                                                                large={
                                                                                    e
                                                                                        ?.item
                                                                                        ?.images
                                                                                }
                                                                                alt="Product Image"
                                                                                className="custom-modal-image object-cover rounded w-[40px] h-[50px] mx-auto"
                                                                            />
                                                                        ) : (
                                                                            <div className="w-[40px] h-[50px] object-cover  mx-auto">
                                                                                <ModalImage
                                                                                    small="/no_img.png"
                                                                                    large="/no_img.png"
                                                                                    className="w-full h-full rounded object-contain p-1"
                                                                                >
                                                                                    {" "}
                                                                                </ModalImage>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div>
                                                                        <h6 className="text-[13px] text-left font-medium capitalize">
                                                                            {
                                                                                e
                                                                                    ?.item
                                                                                    ?.name
                                                                            }
                                                                        </h6>
                                                                        <h6 className="text-[13px] text-left font-medium capitalize">
                                                                            {
                                                                                e
                                                                                    ?.item
                                                                                    ?.product_variation
                                                                            }
                                                                        </h6>
                                                                        <div className="flex items-center font-oblique flex-wrap">
                                                                            {dataProductSerial.is_enable ===
                                                                            "1" ? (
                                                                                <div className="flex gap-0.5">
                                                                                    {/* <h6 className="text-[12px]">Serial:</h6><h6 className="text-[12px]  px-2   w-[full] text-left ">{e.serial == null || e.serial == "" ? "-" : e.serial}</h6>                               */}
                                                                                    <h6 className="text-[12px]">
                                                                                        Serial:
                                                                                    </h6>
                                                                                    <h6 className="text-[12px]  px-2   w-[full] text-left ">
                                                                                        {e
                                                                                            ?.item
                                                                                            ?.serial ==
                                                                                            null ||
                                                                                        e
                                                                                            ?.item
                                                                                            ?.serial ==
                                                                                            ""
                                                                                            ? "-"
                                                                                            : e
                                                                                                  ?.item
                                                                                                  ?.serial}
                                                                                    </h6>
                                                                                </div>
                                                                            ) : (
                                                                                ""
                                                                            )}
                                                                            {dataMaterialExpiry.is_enable ===
                                                                                "1" ||
                                                                            dataProductExpiry.is_enable ===
                                                                                "1" ? (
                                                                                <>
                                                                                    <div className="flex gap-0.5">
                                                                                        <h6 className="text-[12px]">
                                                                                            Lot:
                                                                                        </h6>{" "}
                                                                                        <h6 className="text-[12px]  px-2   w-[full] text-left ">
                                                                                            {e
                                                                                                ?.item
                                                                                                ?.lot ==
                                                                                                null ||
                                                                                            e
                                                                                                ?.item
                                                                                                ?.lot ==
                                                                                                ""
                                                                                                ? "-"
                                                                                                : e
                                                                                                      ?.item
                                                                                                      ?.lot}
                                                                                        </h6>
                                                                                    </div>
                                                                                    <div className="flex gap-0.5">
                                                                                        <h6 className="text-[12px]">
                                                                                            Date:
                                                                                        </h6>{" "}
                                                                                        <h6 className="text-[12px]  px-2   w-[full] text-center ">
                                                                                            {e
                                                                                                ?.item
                                                                                                ?.expiration_date
                                                                                                ? moment(
                                                                                                      e
                                                                                                          ?.item
                                                                                                          ?.expiration_date
                                                                                                  ).format(
                                                                                                      "DD/MM/YYYY"
                                                                                                  )
                                                                                                : "-"}
                                                                                        </h6>
                                                                                    </div>
                                                                                </>
                                                                            ) : (
                                                                                ""
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </h6>
                                                            <h6 className="text-[13px]   px-2 py-2 col-span-1 text-left break-words">
                                                                <h6 className="font-medium">
                                                                    {
                                                                        e?.name_location
                                                                    }
                                                                </h6>
                                                                {/* <h6 className="font-medium">
                                                                    {
                                                                        e.location_name
                                                                    }
                                                                </h6> */}
                                                            </h6>
                                                            <h6 className="text-[13px]   py-2 col-span-1 font-medium text-center break-words">
                                                                {
                                                                    e?.item
                                                                        ?.unit_name
                                                                }
                                                            </h6>
                                                            <h6 className="text-[13px]   py-2 col-span-1 font-medium text-center break-words">
                                                                {formatNumber(
                                                                    e?.price
                                                                )}
                                                            </h6>
                                                            {/* <h6 className="text-[13px]   px-2 py-2 col-span-1 text-center break-words">{e?.item?.product_variation}</h6>                 */}

                                                            <h6 className="text-[13px]   py-2 col-span-1 font-medium text-center break-words">
                                                                {formatNumber(
                                                                    e?.quantity
                                                                )}
                                                            </h6>
                                                            <h6 className="text-[13px]   py-2 col-span-2 font-medium text-center break-words">
                                                                {formatNumber(
                                                                    e?.quantity_net
                                                                )}
                                                            </h6>
                                                            <h6 className="text-[13px]   py-2 col-span-1 font-medium text-center mr-1">
                                                                {formatNumber(
                                                                    e?.quantity_diff
                                                                )}
                                                            </h6>
                                                            <h6 className="text-[13px]   py-2 col-span-2 font-medium text-center">
                                                                {formatNumber(
                                                                    e?.amount
                                                                )}
                                                            </h6>
                                                            <h6
                                                                className={`${
                                                                    e?.handling !=
                                                                    ""
                                                                        ? "text-left text-[13px] px-2 py-1 col-span-1"
                                                                        : "text-right 2xl:text-[12px] xl:text-[13px] text-[12px]  px-2 py-0.5 col-span-1"
                                                                }`}
                                                            >
                                                                {e?.handling !=
                                                                    "" &&
                                                                    props
                                                                        .dataLang[
                                                                        e
                                                                            ?.handling
                                                                    ]}{" "}
                                                                {formatNumber(
                                                                    Math.abs(
                                                                        e?.quantity_diff
                                                                    )
                                                                )}
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
                                                    {props.dataLang
                                                        ?.inventory_notfound ||
                                                        "inventory_notfound"}
                                                </h1>
                                                <div className="flex items-center justify-around mt-6 ">
                                                    {/* <Popup_dskh onRefresh={_ServerFetching.bind(this)} dataLang={dataLang} className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105" />     */}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <h2 className="font-medium p-2  border-b border-b-[#a9b5c5]  border-t z-10 border-t-[#a9b5c5] text-[13px]">
                                    {props.dataLang?.purchase_total ||
                                        "purchase_total"}
                                </h2>
                                {/* <div className="text-right mt-5  grid grid-cols-12 flex-col justify-between sticky bottom-0  z-10">
                  <div className='col-span-7'>
                  </div>
                <div className='col-span-5 space-y-2'>
                  <div className='flex justify-between '>
                      <div className='font-normal'><h3 className='text-left text-[13px]'>{props.dataLang?.inventory_total_quantity_inventory || "inventory_total_quantity_inventory"}</h3></div>
                      <div className='font-normal'><h3 className='text-blue-600 text-right text-[13px]'>{formatNumber(totalQuantity)}</h3></div>
                    </div>
                    <div className='flex justify-between '>
                      <div className='font-normal'><h3 className='text-left text-[13px]'>{props.dataLang?.inventory_actual_total_amount || "inventory_actual_total_amount"}</h3></div>
                      <div className='font-normal'><h3 className='text-blue-600 text-right text-[13px]'>{formatNumber(quantity_net)}</h3></div>
                    </div>  
                    <div className='flex justify-between '>
                      <div className='font-normal'><h3 className='text-left text-[13px]'>{props.dataLang?.inventory_total_amount_difference || "inventory_total_amount_difference"}</h3></div>
                      <div className='font-normal'><h3 className='text-blue-600 text-right text-[13px]'>{formatNumber(quantity_diff)}</h3></div>
                    </div>  
                    <div className='flex justify-between '>
                      <div className='font-normal'><h3 className='text-left text-[13px]'>{props.dataLang?.inventory_qty_into_money || "inventory_qty_into_money"}</h3></div>
                      <div className='font-normal'><h3 className='text-blue-600 text-right text-[13px]'>{formatNumber(amount)}</h3></div>
                    </div>  
                </div>
              </div>    */}
                                <div className=" mt-2  grid grid-cols-12 flex-col justify-between sticky bottom-0  z-10 ">
                                    <div className="col-span-7">
                                        <h3 className="text-[13px] font-medium p-1">
                                            {props.dataLang?.import_from_note ||
                                                "import_from_note"}
                                        </h3>
                                        <textarea
                                            className="resize-none text-[13px]  scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 placeholder:text-slate-300 w-[90%] min-h-[90px] max-h-[90px] bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1 outline-none "
                                            disabled
                                            value={data?.note}
                                        />
                                    </div>
                                    <div className="col-span-3 space-y-1 text-right">
                                        <div className=" text-left text-[13px] font-medium">
                                            <h3>
                                                {props.dataLang
                                                    ?.inventory_total_quantity_inventory ||
                                                    "inventory_total_quantity_inventory"}
                                            </h3>
                                        </div>
                                        <div className=" text-left text-[13px] font-medium">
                                            <h3>
                                                {props.dataLang
                                                    ?.inventory_actual_total_amount ||
                                                    "inventory_actual_total_amount"}
                                            </h3>
                                        </div>
                                        <div className=" text-left text-[13px] font-medium">
                                            <h3>
                                                {props.dataLang
                                                    ?.inventory_total_amount_difference ||
                                                    "inventory_total_amount_difference"}
                                            </h3>
                                        </div>
                                        <div className=" text-left text-[13px] font-medium">
                                            <h3>
                                                {props.dataLang
                                                    ?.inventory_qty_into_money ||
                                                    "inventory_qty_into_money"}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="col-span-2 space-y-1 text-right">
                                        <div className="font-normal mr-2.5">
                                            <h3 className="text-right text-blue-600 text-[13px]">
                                                {formatNumber(totalQuantity)}
                                            </h3>
                                        </div>
                                        <div className="font-normal mr-2.5">
                                            <h3 className="text-right text-blue-600 text-[13px]">
                                                {formatNumber(quantity_net)}
                                            </h3>
                                        </div>
                                        <div className="font-normal mr-2.5">
                                            <h3 className="text-right text-blue-600 text-[13px]">
                                                {formatNumber(quantity_diff)}
                                            </h3>
                                        </div>
                                        <div className="font-normal mr-2.5">
                                            <h3 className="text-right text-blue-600 text-[13px]">
                                                {formatNumber(amount)}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </PopupEdit>
        </>
    );
};
export default Popup_chitiet;
