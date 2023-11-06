import Image from "next/image";
import dynamic from "next/dynamic";
import Loading from "@/components/UI/loading";
import { NumericFormat } from "react-number-format";
import NoData from "@/components/UI/noData/nodata";
import PopupEditer from "./popup";
import SelectComponent from "@/components/UI/filterComponents/selectComponent";
import Zoom from "@/components/UI/zoomElement/zoomElement";
const Table = ({ data, isLoading, handleRemoveItem }) => {
    const dataNew = data
        .map((e) => {
            const newData = e.listProducts?.map((i) => {
                return {
                    idParen: e.id,
                    ...e,
                    ...i,
                };
            });
            return newData;
        })
        .flat();
    return (
        <>
            <div>
                <div className="grid grid-cols-12 items-center bg-[#F7F8F9] rounded sticky top-0 z-[200]">
                    <h3 className="text-[#64748B] col-span-2 py-2 text-center font-medium 3xl:text-sm text-xs uppercase flex items-center">
                        <h3 className="text-[#64748B] w-fit py-2 px-6 font-medium 3xl:text-sm text-xs uppercase">
                            Stt
                        </h3>
                        <h3 className="text-[#64748B] w-full py-2 px-4 font-medium 3xl:text-sm text-xs uppercase whitespace-nowrap">
                            ĐƠN HÀNG/KHNB
                        </h3>
                    </h3>
                    <h3 className="text-[#64748B] col-span-2 py-2 text-center font-medium 3xl:text-sm text-xs uppercase">
                        THÀNH PHẨM
                    </h3>
                    <h3 className="text-[#64748B] py-2 text-center font-medium 3xl:text-sm text-xs uppercase">
                        ĐỊNH MỨC BOM
                    </h3>
                    <h3 className="text-[#64748B] py-2 text-center font-medium 3xl:text-sm text-xs uppercase">
                        ĐƠN VỊ
                    </h3>
                    <h3 className="text-[#64748B] py-2 text-center font-medium 3xl:text-sm text-xs uppercase">
                        CÔNG ĐOẠN
                    </h3>
                    <h3 className="text-[#64748B] py-2 text-center font-medium 3xl:text-sm text-xs uppercase">
                        SL TRONG KHO
                    </h3>
                    <h3 className="text-[#64748B] py-2 text-center font-medium 3xl:text-sm text-xs uppercase">
                        SL CẦN
                    </h3>
                    <h3 className="text-[#64748B] py-2 text-center font-medium 3xl:text-sm text-xs uppercase">
                        SL DỰ PHÒNG
                    </h3>
                    <h3 className="text-[#64748B] py-2 text-center font-medium 3xl:text-sm text-xs uppercase">
                        DỰ KIẾN GIAO
                    </h3>
                    <h3 className="text-[#64748B] py-2 text-center font-medium 3xl:text-sm text-xs uppercase">
                        TÁC VỤ
                    </h3>
                </div>
            </div>
            <div className="3xl:h-[34vh] xxl:h-[24vh] 2xl:h-[26vh] xl:h-[22vh] lg:h-[22vh] h-[30vh] overflow-y-auto overflow-hidden  scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 ">
                {isLoading ? (
                    <Loading className="h-80" color="#0f4f9e" />
                ) : dataNew?.length > 0 ? (
                    dataNew?.map((i, _) => {
                        return (
                            <div key={i?.id} className="grid grid-cols-12 items-center border-b border-[#E7EAEE] ">
                                <h3 className="text-[#64748B] col-span-2 py-2 text-center font-medium 3xl:text-sm text-xs capitalize flex items-center">
                                    <h3 className="text-[#64748B] text-center w-fit py-2 px-8 font-medium 3xl:text-sm text-xs capitalize">
                                        {_ + 1}
                                    </h3>
                                    <h3 className="text-[#64748B] w-full py-2 px-1 font-medium 3xl:text-sm text-xs capitalize">
                                        {i?.nameOrder}
                                    </h3>
                                </h3>
                                <h3 className="text-[#64748B] col-span-2 py-2 text-center font-medium 3xl:text-sm text-xs capitalize flex items-center gap-2">
                                    <Image
                                        src={i?.images}
                                        width={36}
                                        height={36}
                                        alt=""
                                        className="object-cover rounded-md"
                                    />

                                    <div className="flex flex-col items-start">
                                        <h2 className="text-[#000000] 3xl:text-base text-sm font-medium">{i?.name}</h2>
                                        <h3 className="text-[#9295A4] text-[10px] font-normal">{i?.desription}</h3>
                                    </div>
                                </h3>
                                <h3 className="z-[21] text-[#64748B] py-2 text-center font-medium 3xl:text-sm text-xs capitalize ">
                                    <SelectComponent
                                        classNamePrefix={"productionSmoothing"}
                                        placeholder={"BOM"}
                                        menuPortalTarget={document.body}
                                        options={[{ label: "test", value: 1 }]}
                                        formatOptionLabel={(options) => {
                                            return <div className="3xl:text-sm text-xs">{options.label}</div>;
                                        }}
                                        noOptionsMessage={() => {
                                            return <div className="3xl:text-sm text-xs">Không có dữ liệu</div>;
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
                                </h3>
                                <h3 className="text-[#64748B] py-2 text-center font-medium 3xl:text-sm text-xs capitalize ">
                                    Đôi
                                </h3>
                                <h3 className="text-[#64748B] py-2 text-center font-medium 3xl:text-sm text-xs capitalize ">
                                    <SelectComponent
                                        classNamePrefix={"productionSmoothing"}
                                        placeholder={"Công đoạn"}
                                        options={[{ label: "test", value: 1 }]}
                                        menuPortalTarget={document.body}
                                        formatOptionLabel={(options) => {
                                            return <div className="3xl:text-sm text-xs">{options.label}</div>;
                                        }}
                                        noOptionsMessage={() => {
                                            return <div className="3xl:text-sm text-xs">Không có dữ liệu</div>;
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
                                </h3>
                                <h3 className="text-[#64748B] py-2 text-right font-medium 3xl:text-sm text-xs capitalize">
                                    0
                                </h3>
                                <h3 className="text-[#64748B] py-2 text-center font-medium 3xl:text-sm text-xs capitalize">
                                    <NumericFormat
                                        className="appearance-none text-center 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px]  text-[9px] 2xl:px-2 xl:px-1 p-0 font-normal 2xl:w-24 xl:w-[70px] w-[60px]
                                 focus:outline-none border border-[#D8DAE5] px-3 py-[7px] rounded-md"
                                        onValueChange={""}
                                        // value={ce?.price}
                                        allowNegative={false}
                                        decimalScale={0}
                                        isNumericString={true}
                                        thousandSeparator=","
                                        isAllowed={(values) => {
                                            const { floatValue } = values;
                                            return floatValue > 0;
                                        }}
                                    />
                                </h3>
                                <h3 className="text-[#64748B] py-2 text-center font-medium 3xl:text-sm text-xs capitalize">
                                    <NumericFormat
                                        className="appearance-none text-center 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px]  text-[9px] 2xl:px-2 xl:px-1 p-0 font-normal 2xl:w-24 xl:w-[70px] w-[60px]
                                 focus:outline-none border border-[#D8DAE5] px-3 py-[7px] rounded-md"
                                        onValueChange={""}
                                        // value={ce?.price}
                                        allowNegative={false}
                                        decimalScale={0}
                                        isNumericString={true}
                                        thousandSeparator=","
                                        isAllowed={(values) => {
                                            const { floatValue } = values;
                                            return floatValue > 0;
                                        }}
                                    />
                                </h3>
                                <h3 className="text-[#64748B] py-2 text-center font-medium 3xl:text-sm text-xs capitalize">
                                    <div className="flex flex-col items-start">
                                        <h2 className="text-[#141522] font-medium 3xl:text-sm text-xs">22/11/2023</h2>
                                        <h3 className="tex-[#9295A4] font-normal 3xl:text-xs text-[10px]">09:10:23</h3>
                                    </div>
                                </h3>
                                <h3 className="py-2 flex items-center gap-6 justify-center">
                                    {/* <Image
                                            src={"/productionPlan/edit-3.png"}
                                            width={24}
                                            height={24}
                                            alt=""
                                            className="object-cover rounded-md cursor-pointer"
                                        /> */}
                                    <PopupEditer isLoading={isLoading} />
                                    <Zoom className="w-fit h-full">
                                        <Image
                                            onClick={() => handleRemoveItem(i.idParen, i.id)}
                                            src={"/productionPlan/trash-2.png"}
                                            width={24}
                                            height={24}
                                            alt=""
                                            className="object-cover rounded-md  cursor-pointer"
                                        />
                                    </Zoom>
                                </h3>
                            </div>
                        );
                    })
                ) : (
                    <NoData />
                )}
            </div>
        </>
    );
};
export default Table;
