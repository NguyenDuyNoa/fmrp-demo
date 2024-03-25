import React, { useEffect, useState, useRef } from "react";
import Select from "react-select";
import { TiArrowRight, TiTick, TiTickOutline, TiTimes } from "react-icons/ti";
import Zoom from "../(zoomElement)/zoomElement";

const FormClient = (props) => {
const { dataLang, dataColumn, sDataColumn, sDataClientAffter, dataClientAffter } = props;

    const [dataColumnNew, sDataColumnNew] = useState([]);
    useEffect(() => {
        sDataColumnNew(dataColumn);
    }, [dataColumn]);

    const HandlePushItem = (value, type) => {
        const foundClientAffter = dataClientAffter[type].find((item) => item.value === value);

        if (!foundClientAffter) {
            const newData = dataColumnNew[type].filter((e) => value === e.value);
            sDataClientAffter((preve) => ({ ...preve, [type]: [...dataClientAffter[type], ...newData] }));
            sDataColumnNew((prevData) => ({
                ...prevData,
                [type]: prevData[type].filter((e) => value !== e.value),
            }));
        } else {
            const updatedDataClientAffter = dataClientAffter[type].filter((item) => item.value !== value);
            sDataClientAffter((pver) => ({ ...pver, [type]: updatedDataClientAffter }));
            // Thêm lại phần tử vào dataColumnNew
            sDataColumnNew((prevData) => ({ ...prevData, [type]: [...prevData[type], foundClientAffter] }));
        }
    };

    const HandleCheckAll = (type, parent) => {
        if (type === "addAll") {
            sDataClientAffter((preve) => ({
                ...preve,
                [parent]: [...dataClientAffter[parent], ...dataColumnNew[parent]],
            }));
            sDataColumnNew((dataColumn) => ({ ...dataColumn, [parent]: [] }));
        } else if (type === "deleteAll") {
            sDataClientAffter((pver) => ({ ...pver, [parent]: [] }));
            sDataColumnNew((call) => ({ ...call, [parent]: dataColumn[parent] }));
        }
    };

    // deleteAll

    return (
        <div>
            <div className="grid grid-cols-12 gap-2 divide-x">
                <div className="col-span-12 grid grid-cols-12 bg-gray-100 divide-x  rounded-lg transition-all duration-200">
                    <div className="col-span-4">
                        <h1 className="text-center font-semibold text-base text-zinc-600 capitalize py-2">
                            Khách hàng
                        </h1>
                    </div>
                    <div className="col-span-4">
                        <h1 className="text-center font-semibold text-base text-zinc-600 capitalize py-2">
                            Thông tin liên hệ
                        </h1>
                    </div>
                    <div className="col-span-4">
                        <h1 className="text-center font-semibold text-base text-zinc-600 capitalize py-2">
                            Địa chỉ giao hàng
                        </h1>
                    </div>
                </div>
                <div className="col-span-4 bg-zinc-50 rounded-xl my-2">
                    <div className="grid grid-cols-2 gap-2 divide-x  rounded-lg">
                        <div className="">
                            <h1 className="p-2 my-1 shadow font-medium text-white bg-sky-600 rounded-lg text-center">
                                Trường dữ liệu
                            </h1>
                            {dataColumnNew.clients?.length > 0 && (
                                <div className="mx-0.5">
                                    <button
                                        onClick={() => HandleCheckAll("addAll", "clients")}
                                        class="focus:outline-green-500 outline outline-1 outline-gray-50 hover:bg-gray-100 border w-full transition-all duration-200 ease-in-out p-2 rounded text-sm font-medium hover:border-gray-200"
                                    >
                                        Chọn tất cả
                                    </button>
                                </div>
                            )}
                            <div className="scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 overflow-auto h-[50vh]">
                                {dataColumnNew.clients &&
                                    dataColumnNew.clients.map((e, index) => {
                                        return (
                                            <div key={index} className="my-2 mx-2">
                                                <Zoom>
                                                    <button
                                                        onClick={() => HandlePushItem(e.value, "clients")}
                                                        class=" hover:bg-gray-100 border w-full transition-all duration-200 ease-in-out p-2 rounded-xl inline-flex justify-between gap-2 items-center text-sm font-medium hover:border-gray-200"
                                                    >
                                                        <span>{dataLang[e.label] || e.label}</span>
                                                        <TiArrowRight size="20" color="gray" className="" />
                                                    </button>
                                                </Zoom>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                        <div>
                            <h1 className="p-2 my-1 shadow font-mem text-white bg-green-600 rounded-lg text-center">
                                Trường dữ liệu xuất
                            </h1>
                            {dataClientAffter?.clients?.length > 0 && (
                                <div className="mx-0.5">
                                    <button
                                        onClick={() => HandleCheckAll("deleteAll", "clients")}
                                        class="focus:outline-red-500 outline outline-1 outline-gray-50 hover:bg-gray-100 border w-full transition-all duration-200 ease-in-out p-2 rounded text-sm font-medium hover:border-gray-200"
                                    >
                                        Bỏ chọn tất cả
                                    </button>
                                </div>
                            )}
                            <div className="scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 overflow-auto h-[50vh]">
                                {dataClientAffter?.clients.map((e, index) => {
                                    return (
                                        <div key={index} className="my-2 mx-2">
                                            <Zoom>
                                                <button
                                                    onClick={() => HandlePushItem(e.value, "clients")}
                                                    class="group hover:bg-gray-100 border w-full transition-all duration-200 ease-in-out p-2 rounded-xl inline-flex justify-between gap-2 items-center text-sm font-medium hover:border-gray-200"
                                                >
                                                    <span>{dataLang[e.label]}</span>
                                                    <TiTick
                                                        size="20"
                                                        color="green"
                                                        className="group-hover:hidden transition-all duration-200 ease-in-out"
                                                    />
                                                    <TiTimes
                                                        size="20"
                                                        color="red"
                                                        className="group-hover:block hidden transition-all duration-200 ease-in-out"
                                                    />
                                                </button>
                                            </Zoom>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-span-4 bg-zinc-50 rounded-xl my-2">
                    <div className="grid grid-cols-2 gap-2 divide-x  rounded-lg">
                        <div className="">
                            <h1 className="p-2 my-1 shadow font-mem text-white bg-sky-600 rounded-lg text-center">
                                Trường dữ liệu
                            </h1>
                            {dataColumnNew?.contacts?.length > 0 && (
                                <div className="mx-0.5">
                                    <button
                                        onClick={() => HandleCheckAll("addAll", "contacts")}
                                        class="focus:outline-green-500 outline outline-1 outline-gray-50 hover:bg-gray-100 border w-full transition-all duration-200 ease-in-out p-2 rounded text-sm font-medium hover:border-gray-200"
                                    >
                                        Chọn tất cả
                                    </button>
                                </div>
                            )}
                            <div className="scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 overflow-auto h-[50vh]">
                                {dataColumnNew.contacts &&
                                    dataColumnNew.contacts.map((e, index) => {
                                        return (
                                            <div key={index} className="my-2 mx-2">
                                                <Zoom>
                                                    <button
                                                        onClick={() => HandlePushItem(e.value, "contacts")}
                                                        class=" hover:bg-gray-100 border w-full transition-all duration-200 ease-in-out p-2 rounded-xl inline-flex justify-between gap-2 items-center text-sm font-medium hover:border-gray-200"
                                                    >
                                                        <span>{dataLang[e.label] || e.label}</span>
                                                        <TiArrowRight size="20" color="gray" className="" />
                                                    </button>
                                                </Zoom>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                        <div>
                            <h1 className="p-2 my-1 shadow font-mem text-white bg-green-600 rounded-lg text-center">
                                Trường dữ liệu xuất
                            </h1>
                            {dataClientAffter?.contacts?.length > 0 && (
                                <div className="mx-0.5">
                                    <button
                                        onClick={() => HandleCheckAll("deleteAll", "contacts")}
                                        class="focus:outline-red-500 outline outline-1 outline-gray-50 hover:bg-gray-100 border w-full transition-all duration-200 ease-in-out p-2 rounded text-sm font-medium hover:border-gray-200"
                                    >
                                        Bỏ chọn tất cả
                                    </button>
                                </div>
                            )}
                            <div className="scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 overflow-auto h-[50vh]">
                                {dataClientAffter?.contacts.map((e, index) => {
                                    return (
                                        <div key={index} className="my-2 mx-2">
                                            <Zoom>
                                                <button
                                                    onClick={() => HandlePushItem(e.value, "contacts")}
                                                    class="group hover:bg-gray-100 border w-full transition-all duration-200 ease-in-out p-2 rounded-xl inline-flex justify-between gap-2 items-center text-sm font-medium hover:border-gray-200"
                                                >
                                                    <span>{dataLang[e.label] || e.label}</span>
                                                    <TiTick
                                                        size="20"
                                                        color="green"
                                                        className="group-hover:hidden transition-all duration-200 ease-in-out"
                                                    />
                                                    <TiTimes
                                                        size="20"
                                                        color="red"
                                                        className="group-hover:block hidden transition-all duration-200 ease-in-out"
                                                    />
                                                </button>
                                            </Zoom>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-span-4 bg-zinc-50 rounded-xl my-2">
                    <div className="grid grid-cols-2 gap-2 divide-x  rounded-lg">
                        <div className="">
                            <h1 className="p-2 my-1 shadow font-mem text-white bg-sky-600 rounded-lg text-center">
                                Trường dữ liệu
                            </h1>
                            {dataColumnNew?.address?.length > 0 && (
                                <div className="mx-0.5">
                                    <button
                                        onClick={() => HandleCheckAll("addAll", "address")}
                                        class="focus:outline-green-500 outline outline-1 outline-gray-50 hover:bg-gray-100 border w-full transition-all duration-200 ease-in-out p-2 rounded text-sm font-medium hover:border-gray-200"
                                    >
                                        Chọn tất cả
                                    </button>
                                </div>
                            )}
                            <ListItem
                                dataLang={dataLang}
                                type={"address"}
                                dataColumnNew={dataColumnNew.address}
                                HandlePushItem={HandlePushItem}
                            />
                            {/* <div className="scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 overflow-auto h-[50vh]">
                                {dataColumnNew.address &&
                                    dataColumnNew.address.map((e, index) => {
                                        return (
                                            <div key={index} className="my-2 mx-2">
                                                <Zoom>
                                                    <button
                                                        onClick={() => HandlePushItem(e.value, "address")}
                                                        class=" hover:bg-gray-100 border w-full transition-all duration-200 ease-in-out p-2 rounded-xl inline-flex justify-between gap-2 items-center text-sm font-medium hover:border-gray-200"
                                                    >
                                                        <span>{dataLang[e.label] || e.label}</span>
                                                        <TiArrowRight size="20" color="gray" className="" />
                                                    </button>
                                                </Zoom>
                                            </div>
                                        );
                                    })}
                            </div> */}
                        </div>
                        <div>
                            <h1 className="p-2 my-1 shadow font-mem text-white bg-green-600 rounded-lg text-center">
                                Trường dữ liệu xuất
                            </h1>
                            {dataClientAffter?.address?.length > 0 && (
                                <div className="mx-0.5">
                                    <button
                                        onClick={() => HandleCheckAll("deleteAll", "address")}
                                        class="focus:outline-red-500 outline outline-1 outline-gray-50 hover:bg-gray-100 border w-full transition-all duration-200 ease-in-out p-2 rounded text-sm font-medium hover:border-gray-200"
                                    >
                                        Bỏ chọn tất cả
                                    </button>
                                </div>
                            )}
                            <ListItem
                                dataLang={dataLang}
                                type={"address"}
                                dataColumnNew={dataClientAffter?.address}
                                HandlePushItem={HandlePushItem}
                            />
                            {/* <div className="scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 overflow-auto h-[50vh]">
                                {dataClientAffter?.address.map((e, index) => {
                                    return (
                                        <div key={index} className="my-2 mx-2">
                                            <Zoom>
                                                <button
                                                    onClick={() => HandlePushItem(e.value, "address")}
                                                    class="group hover:bg-gray-100 border w-full transition-all duration-200 ease-in-out p-2 rounded-xl inline-flex justify-between gap-2 items-center text-sm font-medium hover:border-gray-200"
                                                >
                                                    <span>{dataLang[e.label] || e.label}</span>
                                                    <TiTick
                                                        size="20"
                                                        color="green"
                                                        className="group-hover:hidden transition-all duration-200 ease-in-out"
                                                    />
                                                    <TiTimes
                                                        size="20"
                                                        color="red"
                                                        className="group-hover:block hidden transition-all duration-200 ease-in-out"
                                                    />
                                                </button>
                                            </Zoom>
                                        </div>
                                    );
                                })}
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

};
const ListItem = ({ dataColumnNew, type, dataLang, HandlePushItem }) => {
return (
<div className="scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 overflow-auto h-[50vh]">
{dataColumnNew.map((e, index) => {
return (
<div key={index} className="my-2 mx-2">
<Zoom>
<button
onClick={() => HandlePushItem(e.value, type)}
class=" hover:bg-gray-100 border w-full transition-all duration-200 ease-in-out p-2 rounded-xl inline-flex justify-between gap-2 items-center text-sm font-medium hover:border-gray-200" >
<span>{dataLang[e.label] || e.label}</span>
<TiArrowRight size="20" color="gray" className="" />
</button>
</Zoom>
</div>
);
})}
</div>
);
};
export default FormClient;
