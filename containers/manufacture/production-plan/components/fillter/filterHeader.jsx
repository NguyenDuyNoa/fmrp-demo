import MultiValue from "@/components/UI/mutiValue/multiValue";
import SelectOptionLever from "@/components/UI/selectOptionLever/selectOptionLever";
import { FnlocalStorage } from "@/utils/helpers/localStorage";
import { ArrowDown2 } from "iconsax-react";
import dynamic from "next/dynamic";
import React, { useEffect } from "react";
import DatePicker from "react-datepicker";
const SelectComponent = dynamic(() => import("@/components/UI/filterComponents/selectComponent"), { ssr: false });

const FilterHeader = ({ onChangeValue, _HandleSeachApi, isValue, isData, options, dataLang }) => {
    const { setItem, removeItem, getItem } = FnlocalStorage();

    useEffect(() => {
        const dataFilter = getItem('planProductionStatusFilter') || '[]'
        if (JSON.parse(dataFilter).length > 0) {
            onChangeValue("planStatus")(JSON.parse(dataFilter))
        }
    }, [])


    return (
        <>
            <div className="grid items-center gap-2 grid-cols-14 ">
                <div className="col-span-2">
                    <h3 className="text-sm text-[#051B44] font-medium ml-1">{dataLang?.production_plan_form_materials_client || 'production_plan_form_materials_client'}</h3>
                    <SelectComponent
                        isClearable={true}
                        value={isValue.idClient}
                        onChange={onChangeValue("idClient")}
                        options={[{ label: dataLang?.production_plan_form_materials_client || 'production_plan_form_materials_client', value: "", isDisabled: true }, ...isData?.client]}
                        classNamePrefix={"productionSmoothing"}
                        placeholder={dataLang?.production_plan_form_materials_client || 'production_plan_form_materials_client'}
                    />
                </div>
                <div className="col-span-2">
                    <h3 className="text-sm text-[#051B44] font-medium ml-1">
                        {dataLang?.purchase_order_table_branch || "purchase_order_table_branch"}
                    </h3>
                    <SelectComponent
                        isClearable={true}
                        value={isValue.valueBr}
                        onChange={onChangeValue("valueBr")}
                        options={isData.listBr}
                        classNamePrefix={"productionSmoothing"}
                        placeholder={dataLang?.purchase_order_table_branch || "purchase_order_table_branch"}
                    />
                </div>
                <div className="col-span-2">
                    <h3 className="text-sm text-[#051B44] font-medium ml-1">{dataLang?.production_plan_form_materials_finished_product_group || 'production_plan_form_materials_finished_product_group'}</h3>
                    <SelectComponent
                        value={isValue.idProductGroup}
                        isClearable={true}
                        options={[{ label: dataLang?.production_plan_form_materials_finished_product_group || 'production_plan_form_materials_finished_product_group', value: "", isDisabled: true }, ...isData?.productGroup]}
                        formatOptionLabel={SelectOptionLever}
                        onChange={onChangeValue("idProductGroup")}
                        classNamePrefix={"productionSmoothing"}
                        // styles={{
                        //     menu: (provided) => ({
                        //         ...provided,
                        //         width: "170%",
                        //     }),
                        // }}
                        placeholder={dataLang?.production_plan_form_materials_finished_product_group || 'production_plan_form_materials_finished_product_group'}
                    />
                </div>
                <div className="col-span-2">
                    <h3 className="text-sm text-[#051B44] font-medium ml-1">{dataLang?.productions_orders_popup_finished_product || 'productions_orders_popup_finished_product'}</h3>
                    <SelectComponent
                        isClearable={true}
                        value={isValue.idProduct}
                        onChange={onChangeValue("idProduct")}
                        onInputChange={(event) => {
                            _HandleSeachApi(event);
                        }}
                        maxShowMuti={1}
                        components={{ MultiValue }}
                        isMulti={true}
                        options={[{ label: dataLang?.productions_orders_popup_finished_product || 'productions_orders_popup_finished_product', value: "", isDisabled: true }, ...options]}
                        closeMenuOnSelect={false}
                        formatOptionLabel={(option) => {
                            return (
                                <div className="">
                                    {option?.isDisabled ? (
                                        <div className="custom-text">
                                            <h3 className="text-base font-medium">{option.label}</h3>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <div className="custom-none max-w-[30px] w-[30px] h-[30px] max-h-[30px]">
                                                {option.e?.images != null ? (
                                                    <img
                                                        src={option.e?.images}
                                                        alt="Product Image"
                                                        className="max-max-w-[30px] w-[30px] h-[30px] max-h-[30px] text-[8px] object-cover rounded"
                                                    />
                                                ) : (
                                                    <div className=" max-w-[30px] w-[30px] h-[30px] max-h-[30px] object-cover  flex items-center justify-center rounded">
                                                        <img
                                                            src="/nodata.png"
                                                            alt="Product Image"
                                                            className="max-w-[30px] w-[30px] h-[30px] max-h-[30px] object-cover rounded"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="custom-text">
                                                <h3 className="font-medium 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                                                    {option.e?.item_name}
                                                </h3>
                                                <h5 className="font-medium 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] ">
                                                    {option.e?.product_variation}
                                                </h5>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        }}
                        styles={{
                            multiValueLabel: (provided) => ({
                                ...provided,
                                "& .custom-none": {
                                    display: "none",
                                },
                                "& .custom-text": {
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "5px",
                                    maxWidth: "50px",
                                },
                                "& .custom-text h5": {
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                },
                            }),

                            menu: (provided) => ({
                                ...provided,
                                width: "150%",
                            }),
                        }}
                        classNamePrefix={"productionSmoothing"}
                        placeholder={"Thành phẩm"}
                    />
                </div>
                <div className="col-span-2">
                    <h3 className="text-sm text-[#051B44] font-medium ml-1">{dataLang?.production_plan_form_materials_status_plan || 'production_plan_form_materials_status_plan'}</h3>
                    <SelectComponent
                        isClearable={true}
                        value={isValue.planStatus}
                        onChange={(e) => {
                            onChangeValue("planStatus")(e)
                            setItem("planProductionStatusFilter", JSON.stringify(e));

                        }}
                        options={[
                            {
                                label: dataLang?.production_plan_form_materials_status_plan || 'production_plan_form_materials_status_plan',
                                value: "", isDisabled: true
                            }, ...isData?.planStatus
                        ]}
                        isMulti={true}
                        maxShowMuti={1}
                        components={{ MultiValue }}
                        className={'[&>div>div]:flex-nowrap [&>div>div>div:nth-of-type(2)]:whitespace-nowrap z-20'}
                        classNamePrefix={"productionSmoothing"}
                        placeholder={dataLang?.production_plan_form_materials_status_plan || 'production_plan_form_materials_status_plan'}
                    />
                </div>
                <div className="col-span-2">
                    <label htmlFor="start" className="text-sm text-[#051B44] font-medium ml-1">
                        {dataLang?.production_plan_form_materials_start_date || 'production_plan_form_materials_start_date'}
                    </label>
                    <div className="relative w-full">
                        <DatePicker
                            id="start"
                            calendarClassName="rasta-stripes"
                            clearButtonClassName="text"
                            selected={isValue.startDate}
                            onChange={onChangeValue("startDate")}
                            dateFormat={"dd/MM/yyyy"}
                            isClearable
                            placeholderText={dataLang?.production_plan_form_materials_start_date || 'production_plan_form_materials_start_date'}
                            className="p-2 mb-[5px] placeholder:text-[12px] placeholder:text-[#6b7280] text-[14px] w-full outline-none focus:outline-none border-[#d8dae5] focus:border-[#0F4F9E] focus:border-2 border  rounded-md"
                        />
                        <ArrowDown2
                            size="11"
                            color="#6b7280"
                            className="absolute right-0 -translate-x-1/2 -translate-y-1/2 top-1/2"
                        />
                    </div>
                </div>
                <div className="col-span-2">
                    <label htmlFor="start" className="text-sm text-[#051B44] font-medium ml-1">
                        {dataLang?.production_plan_form_materials_end_date || 'production_plan_form_materials_end_date'}
                    </label>
                    <div className="relative w-full">
                        <DatePicker
                            id="start"
                            calendarClassName="rasta-stripes"
                            clearButtonClassName="text"
                            selected={isValue.endDate}
                            onChange={onChangeValue("endDate")}
                            isClearable
                            dateFormat={"dd/MM/yyyy"}
                            placeholderText={dataLang?.production_plan_form_materials_end_date || 'production_plan_form_materials_end_date'}
                            className="p-2 mb-[5px] placeholder:text-[12px] placeholder:text-[#6b7280] text-[14px] w-full outline-none focus:outline-none border-[#d8dae5] focus:border-[#0F4F9E] focus:border-2 border  rounded-md"
                        />
                        <ArrowDown2
                            size="11"
                            color="#6b7280"
                            className="absolute right-0 -translate-x-1/2 -translate-y-1/2 top-1/2"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};


export default React.memo(FilterHeader);
