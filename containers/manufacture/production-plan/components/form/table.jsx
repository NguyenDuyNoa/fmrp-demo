import React from "react";
import Image from "next/image";
import ModalImage from "react-modal-image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { TickCircle as IconTick } from "iconsax-react";
import formatNumber from "@/utils/helpers/formatnumber";
import { FnlocalStorage } from "@/utils/helpers/localStorage";
import useToast from "@/hooks/useToast";
import Loading from "@/components/UI/loading/loading";
import NoData from "@/components/UI/noData/nodata";
import Zoom from "@/components/UI/zoomElement/zoomElement";
import { TagColorRed } from "@/components/UI/common/Tag/TagStatus";
import InPutNumericFormat from "@/components/UI/inputNumericFormat/inputNumericFormat";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
const Table = ({ dataLang, data, isLoading, handleRemoveItem, handChangeTable }) => {
    const showToast = useToast();
    const { getItem } = FnlocalStorage();
    const getLocalStorageTab = getItem("tab");

    return (
        <>
            <div className="grid grid-cols-13 items-center bg-[#F7F8F9] rounded sticky top-0 z-[200]">
                <h3 className="text-[#64748B] col-span-2 py-2 text-center font-medium 3xl:text-sm text-xs capitalize flex items-center">
                    <h3 className="text-[#64748B] w-fit py-2 px-6 font-medium 3xl:text-sm text-xs capitalize">
                        Stt
                    </h3>
                    <h3 className="text-[#64748B] w-full py-2 px-4 font-medium 3xl:text-sm text-xs capitalize whitespace-nowrap">
                        {getLocalStorageTab == "order" ? "Đơn hàng" : "Kế hoạch nội bộ"}
                    </h3>
                </h3>
                <h3 className="text-[#64748B] col-span-2 py-2 text-center font-medium 3xl:text-sm text-xs capitalize">
                    Thành phẩm
                    {/* {dataLang?.production_plan_form_materials_finished_product || 'production_plan_form_materials_finished_product'} */}
                </h3>
                <h3 className="text-[#64748B] py-2 text-center font-medium 3xl:text-sm text-xs capitalize">
                    Định mức BOM
                    {/* {dataLang?.production_plan_form_materials_bom_rate || 'production_plan_form_materials_bom_rate'} */}
                </h3>
                <h3 className="text-[#64748B] py-2 text-center font-medium 3xl:text-sm text-xs capitalize">
                    Đơn vị
                    {/* {dataLang?.production_plan_form_materials_unit || 'production_plan_form_materials_unit'} */}
                </h3>
                <h3 className="text-[#64748B] py-2 text-center font-medium 3xl:text-sm text-xs capitalize">
                    Công đoạn
                    {/* {dataLang?.production_plan_form_materials_stage || 'production_plan_form_materials_stage'} */}
                </h3>
                <h3 className="text-[#64748B] py-2 text-center font-medium 3xl:text-sm text-xs capitalize">
                    SL Trong kho
                    {/* {dataLang?.production_plan_form_materials_in_stock || 'production_plan_form_materials_in_stock'} */}
                </h3>
                <h3 className="text-[#64748B] py-2 text-center font-medium 3xl:text-sm text-xs capitalize">
                    SL Cần
                    {/* {dataLang?.production_plan_form_materials_need || 'production_plan_form_materials_need'} */}
                </h3>
                <h3 className="text-[#64748B] col-span-2 py-2 text-center font-medium 3xl:text-sm text-xs capitalize">
                    {dataLang?.production_plan_form_materials_timeline || 'production_plan_form_materials_timeline'}
                </h3>
                <h3 className="text-[#64748B] py-2 text-center font-medium 3xl:text-sm text-xs capitalize">
                    {dataLang?.production_plan_form_materials_expected || 'production_plan_form_materials_expected'}
                </h3>
                <h3 className="text-[#64748B] py-2 text-center font-medium 3xl:text-sm text-xs capitalize">
                    {dataLang?.production_plan_form_materials_task || 'production_plan_form_materials_task'}
                </h3>
            </div>
            <Customscrollbar className="3xl:h-[44vh] xxl:h-[22vh] 2xl:h-[30vh] xl:h-[24vh] lg:h-[24vh] h-[30vh] overflow-y-auto overflow-hidden">
                {isLoading ? (
                    <Loading className="h-80" color="#0f4f9e" />
                ) : data.dataProduction?.length > 0 ? (
                    data.dataProduction?.map((i, index) => {
                        return (
                            <div key={i?.id} className="grid grid-cols-13 items-center border-b border-[#E7EAEE] ">
                                <h3 className="text-[#64748B] col-span-2 py-2 text-center font-medium 3xl:text-sm text-xs capitalize flex items-center">
                                    <h3 className="text-[#64748B] text-center w-fit py-2 px-8 font-medium text-[13px] capitalize">
                                        {index + 1}
                                    </h3>
                                    <h3 className="text-[#64748B] w-full py-2 px-1 font-medium text-[13px] capitalize">
                                        {i?.nameOrder}
                                    </h3>
                                </h3>
                                <h3 className="text-[#64748B] col-span-2 py-2 text-center font-medium 3xl:text-sm text-xs capitalize flex items-center gap-2">
                                    {i.images != null ? (
                                        <ModalImage
                                            small={i.images}
                                            large={i.images}
                                            width={36}
                                            height={36}
                                            alt={i.name}
                                            className="object-cover rounded-md min-w-[36px] max-w-[36px] w-[36px] max-h-[36px] min-h-[36px] h-[36px]"
                                        />
                                    ) : (
                                        <ModalImage
                                            width={36}
                                            height={36}
                                            small="/icon/noimagelogo.png"
                                            large="/icon/noimagelogo.png"
                                            className="object-cover rounded-md min-w-[36px] max-w-[36px] w-[36px] max-h-[36px] min-h-[36px] h-[36px]"
                                        ></ModalImage>
                                    )}

                                    <div className="flex flex-col items-start justify-start">
                                        <h2 className="text-[#000000] 3xl:text-base text-sm font-medium text-left">
                                            {i?.name}
                                        </h2>
                                        <h3 className="text-[#9295A4] text-[10px] font-normal text-left">
                                            {i?.desription} - {i?.productVariation}
                                        </h3>
                                    </div>
                                </h3>
                                {/* <h3 className="z-[21] text-[#64748B] py-2 text-center font-medium 3xl:text-sm text-xs capitalize ">
                                    <SelectComponent
                                        classNamePrefix={"productionSmoothing"}
                                        placeholder={"BOM"}
                                        isClearable={true}
                                        menuPortalTarget={document.body}
                                        options={[{ label: "test", value: 1 }]}
                                        value={i.bom}
                                        className={`${
                                            i.bom == null ? "border-red-500 " : "border-[#E1E1E1]"
                                        } border rounded-md`}
                                        formatOptionLabel={(options) => {
                                            return <div className="text-xs 3xl:text-sm">{options.label}</div>;
                                        }}
                                        onChange={(e) => {
                                            handChangeTable(i.idParent, i.id, e, "bom");
                                        }}
                                        noOptionsMessage={() => {
                                            return <div className="text-xs 3xl:text-sm">Không có dữ liệu</div>;
                                        }}
                                        styles={{
                                            placeholder: (base) => ({
                                                ...base,
                                                color: "#cbd5e1",
                                                fontSize: "12px !important",
                                                "@media screen and (max-width: 1600px)": {
                                                    fontSize: "12px !important",
                                                },
                                                "@media screen and (max-width: 1400px)": {
                                                    fontSize: "12px !important",
                                                },
                                                "@media screen and (max-width: 1536px)": {
                                                    fontSize: "10px !important",
                                                },
                                                "@media screen and (max-width: 1280px)": {
                                                    fontSize: "10px !important",
                                                },
                                                "@media screen and (max-width: 1024px)": {
                                                    fontSize: "7.5px !important",
                                                },
                                            }),
                                            menuPortal: (base) => ({
                                                ...base,
                                                zIndex: 100,
                                            }),
                                        }}
                                    />
                                </h3> */}
                                <h3 className={`py-2  font-medium mx-auto`}>
                                    {i?.bom == "1" ? (
                                        <IconTick className="text-green-500" />
                                    ) : (
                                        <TagColorRed name={'Biến thể không có BOM'} className={'w-fit truncate flex items-center'} />
                                    )}
                                </h3>
                                <h3 className="text-[#64748B] py-2 text-center font-medium text-[13px] capitalize ">
                                    {i.unitName}
                                </h3>
                                {/* <h3 className="text-[#64748B] py-2 text-center font-medium 3xl:text-sm text-xs capitalize ">
                                    <SelectComponent
                                        classNamePrefix={"productionSmoothing"}
                                        placeholder={"Công đoạn"}
                                        isClearable={true}
                                        className={`${
                                            i.stage == null ? "border-red-500 " : "border-[#E1E1E1]"
                                        }  border rounded-md`}
                                        value={i.stage}
                                        options={[{ label: "test", value: 1 }]}
                                        menuPortalTarget={document.body}
                                        formatOptionLabel={(options) => {
                                            return <div className="text-xs 3xl:text-sm">{options.label}</div>;
                                        }}
                                        onChange={(e) => {
                                            handChangeTable(i.idParent, i.id, e, "stage");
                                        }}
                                        noOptionsMessage={() => {
                                            return <div className="text-xs 3xl:text-sm">Không có dữ liệu</div>;
                                        }}
                                        styles={{
                                            placeholder: (base) => ({
                                                ...base,
                                                color: "#cbd5e1",
                                                fontSize: "13px !important",
                                                "@media screen and (max-width: 1600px)": {
                                                    fontSize: "14px !important",
                                                },
                                                "@media screen and (max-width: 1400px)": {
                                                    fontSize: "12px !important",
                                                },
                                                "@media screen and (max-width: 1536px)": {
                                                    fontSize: "10px !important",
                                                },
                                                "@media screen and (max-width: 1280px)": {
                                                    fontSize: "10px !important",
                                                },
                                                "@media screen and (max-width: 1024px)": {
                                                    fontSize: "7.5px !important",
                                                },
                                            }),

                                            menuPortal: (base) => ({
                                                ...base,
                                                zIndex: 100,
                                            }),
                                        }}
                                    />
                                </h3> */}
                                <h3 className={`py-2  font-medium mx-auto`}>
                                    {i?.stage == "1" ? (
                                        <IconTick className="text-green-500" />
                                    ) : (
                                        <TagColorRed name={'Không có CĐ'} className={'w-fit truncate flex items-center'} />
                                    )}
                                </h3>
                                <h3 className="text-[#64748B] py-2 text-center font-medium text-[13px] capitalize">
                                    {formatNumber(i?.quantityWarehouse)}
                                </h3>
                                <h3 className="text-[#64748B] py-2 text-center font-medium 3xl:text-sm text-xs capitalize">
                                    <InPutNumericFormat
                                        className={`appearance-none text-center text-[13px] 2xl:px-2 xl:px-1 p-0 font-normal 2xl:w-24 xl:w-[70px] w-[60px]
                                        focus:outline-none border ${i?.quantityRemaining == null || i?.quantityRemaining == "" || i?.quantityRemaining == 0
                                                ? "border-red-500"
                                                : "border-[#D8DAE5]"
                                            }  px-3 py-[7px] rounded-md`}
                                        value={i?.quantityRemaining}
                                        onValueChange={(e) => {
                                            handChangeTable(i.idParent, i.id, e?.value, "quantityRemaining");
                                        }}
                                        isAllowed={({ floatValue }) => {
                                            if (floatValue < 0) {
                                                showToast("error", dataLang?.production_plan_form_materials_qty_needs_to_be_greater || 'production_plan_form_materials_qty_needs_to_be_greater');
                                                return false;
                                            }
                                            return true;
                                        }}
                                    />
                                </h3>
                                <h3 className="text-[#64748B] col-span-2 py-2 text-center font-medium 3xl:text-sm text-xs capitalize">
                                    <div className="relative w-full">
                                        <DatePicker
                                            selected={i.date.startDate}
                                            onChange={(dates) => {
                                                const [start, end] = dates;
                                                handChangeTable(
                                                    i.idParent,
                                                    i.id,
                                                    { startDate: start, endDate: end },
                                                    "date"
                                                );
                                            }}
                                            startDate={i.date.startDate}
                                            endDate={i.date.endDate}
                                            selectsRange
                                            monthsShown={2}
                                            shouldCloseOnSelect={false}
                                            dateFormat={"dd/MM/yyyy"}
                                            portalId="menu-time"
                                            isClearable
                                            clearButtonClassName="mr-6 hover:scale-150 transition-all duration-150 ease-linear"
                                            placeholderText={dataLang?.production_plan_form_materials_date_to_date || 'production_plan_form_materials_date_to_date'}
                                            className={`py-[8px] px-4  text-[13px] placeholder:text-[#6b7280]  w-full outline-none focus:outline-none 
                                            ${(i.date.startDate == null || i.date.endDate == null) ? "border-red-500" : "border-[#E1E1E1]"}  focus:border-[#0F4F9E] focus:border-1 border  rounded-[6px] z-[999]`}
                                        />

                                        <Image
                                            alt=""
                                            src={"/productionPlan/Union.png"}
                                            width={12}
                                            height={12}
                                            className="absolute right-0 -translate-x-1/2 -translate-y-1/2 top-1/2 opacity-60"
                                        />
                                    </div>
                                </h3>
                                <h3 className="text-[#64748B] py-2 text-center font-medium 3xl:text-sm text-xs capitalize px-2">
                                    {/* <div className="flex flex-col items-start ml-6">
                                        <h2 className="text-[#141522] font-medium 3xl:text-sm text-xs">
                                            {i?.deliveryDate}
                                        </h2>
                                        <h3 className="text-[#9295A4]  font-normal 3xl:text-xs text-[10px]">
                                            09:10:23
                                        </h3>
                                    </div> */}
                                    <h2 className="text-[#141522] font-medium text-[13px]">
                                        {i?.deliveryDate}
                                    </h2>
                                </h3>
                                <h3 className="flex items-center justify-center gap-6 py-2">
                                    {/* <Image
                                            src={"/productionPlan/edit-3.png"}
                                            width={24}
                                            height={24}
                                            alt=""
                                            className="object-cover rounded-md cursor-pointer"
                                        /> */}
                                    {/* <PopupEditer isLoading={isLoading} /> */}
                                    <Zoom className="h-full w-fit">
                                        <Image
                                            onClick={() => handleRemoveItem(i.id)}
                                            src={"/productionPlan/trash-2.png"}
                                            width={24}
                                            height={24}
                                            alt=""
                                            className="object-cover rounded-md cursor-pointer"
                                        />
                                    </Zoom>
                                </h3>
                            </div>
                        );
                    })
                ) : (
                    <NoData />
                )}
            </Customscrollbar>
        </>
    );
};
export default React.memo(Table);
