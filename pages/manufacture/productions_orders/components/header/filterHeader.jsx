import DatePicker from "react-datepicker";
import SelectComponent from "@/components/UI/filterComponents/selectComponent";
import { ArrowDown2 } from "iconsax-react";
import { memo } from "react";
import MultiValue from "@/components/UI/mutiValue/multiValue";

const FilterHeader = memo(
    ({
        dataLang,
        isState,
        queryState,
        handleFilter,
        fetchComboboxProductionOrders,
        fetDataOrder,
        fetchDataPlan,
        fetchDataItems,
    }) => {
        return (
            <>
                <div className="grid grid-cols-14 items-center gap-2">
                    <div className="col-span-2">
                        <h3 className="text-sm text-[#051B44] font-medium ml-1">{dataLang?.productions_orders_details_number || 'productions_orders_details_number'}</h3>
                        <SelectComponent
                            isClearable={true}
                            value={isState.valueProductionOrders}
                            onInputChange={(e) => {
                                fetchComboboxProductionOrders(e);
                            }}
                            onChange={(e) => handleFilter("valueProductionOrders", e)}
                            options={isState.comboboxProductionOrders}
                            classNamePrefix={"productionSmoothing"}
                            placeholder={dataLang?.productions_orders_details_number || 'productions_orders_details_number'}
                        />
                    </div>
                    <div className="col-span-2">
                        <h3 className="text-sm text-[#051B44] font-medium ml-1">{dataLang?.productions_orders_details_branch || 'productions_orders_details_branch'}</h3>
                        <SelectComponent
                            isClearable={true}
                            value={isState.valueBr}
                            onChange={(e) => handleFilter("valueBr", e)}
                            options={isState.listBr}
                            classNamePrefix={"productionSmoothing"}
                            placeholder={dataLang?.productions_orders_details_branch || 'productions_orders_details_branch'}
                        />
                    </div>
                    <div className="col-span-2">
                        <h3 className="text-sm text-[#051B44] font-medium ml-1">{dataLang?.productions_orders_details_lxs_number || 'productions_orders_details_lxs_number'}</h3>
                        <SelectComponent
                            isClearable={true}
                            value={isState.valueProductionOrdersDetail}
                            onChange={(e) => handleFilter("valueProductionOrdersDetail", e)}
                            options={isState.comboboxProductionOrdersDetail}
                            classNamePrefix={"productionSmoothing"}
                            placeholder={dataLang?.productions_orders_details_lxs_number || 'productions_orders_details_lxs_number'}
                        />
                    </div>
                    <div className="col-span-2">
                        <h3 className="text-sm text-[#051B44] font-medium ml-1">{dataLang?.productions_orders_item || 'productions_orders_item'}</h3>
                        <SelectComponent
                            isClearable={true}
                            value={isState.valueProducts}
                            options={[{ label: "Mặt hàng", value: "", isDisabled: true }, ...isState.listProducts]}
                            onChange={(e) => handleFilter("valueProducts", e)}
                            classNamePrefix={"productionSmoothing"}
                            placeholder={dataLang?.productions_orders_item || 'productions_orders_item'}
                            onInputChange={(e) => {
                                fetchDataItems(e);
                            }}
                            isMulti={true}
                            components={{ MultiValue }}
                            maxShowMuti={1}
                            formatOptionLabel={(option) => {
                                return (
                                    <div className="">
                                        {option?.isDisabled ? (
                                            <div className="custom-text">
                                                <h3 className="font-medium text-base">{option.label}</h3>
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
                                                                src="/no_img.png"
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
                                    width: "200%",
                                }),
                            }}
                        />
                    </div>
                    <div className="col-span-2">
                        <h3 className="text-sm text-[#051B44] font-medium ml-1">{dataLang?.productions_orders_sales_order || 'productions_orders_sales_order'}</h3>
                        <SelectComponent
                            isClearable={true}
                            value={isState.valueOrders}
                            options={isState.listOrders}
                            onInputChange={(e) => {
                                fetDataOrder(e);
                            }}
                            onChange={(e) => handleFilter("valueOrders", e)}
                            classNamePrefix={"productionSmoothing"}
                            placeholder={dataLang?.productions_orders_sales_order || 'productions_orders_sales_order'}
                        />
                    </div>
                    <div className="col-span-2">
                        <h3 className="text-sm text-[#051B44] font-medium ml-1">{dataLang?.productions_orders_internal_plan || 'productions_orders_internal_plan'}</h3>
                        <SelectComponent
                            isClearable={true}
                            value={isState.valuePlan}
                            options={isState.listPlan}
                            onInputChange={(e) => {
                                fetchDataPlan(e);
                            }}
                            onChange={(e) => handleFilter("valuePlan", e)}
                            classNamePrefix={"productionSmoothing"}
                            placeholder={dataLang?.productions_orders_internal_plan || 'productions_orders_internal_plan'}
                        />
                    </div>
                    <div className="w-full col-span-2 relative">
                        <h3 className="text-sm text-[#051B44] font-medium ml-1">{dataLang?.productions_orders_day_to_day || 'productions_orders_day_to_day'}</h3>
                        <DatePicker
                            id="start"
                            portalId="menu-time"
                            calendarClassName="rasta-stripes"
                            clearButtonClassName="text"
                            selected={isState.date.dateStart}
                            startDate={isState.date.dateStart}
                            endDate={isState.date.dateEnd}
                            selectsRange
                            onChange={(date) => {
                                const [start, end] = date;
                                queryState({
                                    date: {
                                        dateStart: start,
                                        dateEnd: end,
                                    },
                                });
                            }}
                            isClearable
                            placeholderText={dataLang?.productions_orders_day_to_day || 'productions_orders_day_to_day'}
                            className="p-2 placeholder:text-[12px] placeholder:text-[#6b7280] text-[14px] w-full outline-none focus:outline-none border-[#d8dae5] focus:border-[#0F4F9E] focus:border-2 border  rounded-md"
                        />
                        <ArrowDown2
                            size="11"
                            color="#6b7280"
                            className="absolute top-1/2 right-0 -translate-x-1/2 translate-y-1/2"
                        />
                    </div>
                </div>
            </>
        );
    }
);
export default FilterHeader;
