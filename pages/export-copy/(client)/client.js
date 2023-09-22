import React, { useEffect, useState } from "react";
import BtnClickAddItem from "../(children)/addDelete/btnAdd";
import BtnClickDeleteItem from "../(children)/addDelete/btnDelete";
import TitleForm from "../(children)/title/titleForm";
import ListItem from "../(children)/listItem/listItem";

const Client = (props) => {
    const { dataLang, dataColumn, sDataColumn, sClientAffter, clientAffter } = props;

    const [dataColumnNew, sDataColumnNew] = useState([]);
    useEffect(() => {
        sDataColumnNew(dataColumn);
    }, [dataColumn]);

    const HandlePushItem = (value, type) => {
        const foundClientAffter = clientAffter[type].find((item) => item.value === value);

        if (!foundClientAffter) {
            const newData = dataColumnNew[type].filter((e) => value === e.value);
            sClientAffter((preve) => ({ ...preve, [type]: [...clientAffter[type], ...newData] }));
            sDataColumnNew((preve) => ({
                ...preve,
                [type]: preve[type].filter((e) => value !== e.value),
            }));
        } else {
            const updatedDataClientAffter = clientAffter[type].filter((item) => item.value !== value);
            sClientAffter((preve) => ({ ...preve, [type]: updatedDataClientAffter }));
            // add dataColumnNew
            sDataColumnNew((preve) => ({ ...preve, [type]: [...preve[type], foundClientAffter] }));
        }
    };

    const HandleCheckAll = (type, parent) => {
        if (type === "addAll") {
            sClientAffter((preve) => ({
                ...preve,
                [parent]: [...clientAffter[parent], ...dataColumnNew[parent]],
            }));
            sDataColumnNew((dataColumn) => ({ ...dataColumn, [parent]: [] }));
        } else if (type === "deleteAll") {
            sClientAffter((preve) => ({ ...preve, [parent]: [] }));
            sDataColumnNew((preve) => ({ ...preve, [parent]: dataColumn[parent] }));
        }
    };

    return (
        <div>
            <div className="grid grid-cols-12 gap-2">
                <div className="col-span-12 divide-x divide-gray-300 grid grid-cols-12 bg-gray-100   rounded transition-all duration-200">
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
                <div className="col-span-4 bg-zinc-50 border-2 rounded my-2">
                    <div className="grid grid-cols-2  divide-x-2">
                        <div className="">
                            <TitleForm title={"Trường dữ liệu"} />
                            <BtnClickAddItem
                                dataClientBefore={dataColumnNew.clients}
                                HandleCheckAll={HandleCheckAll}
                                type="addAll"
                                parent="clients"
                            />
                            <ListItem
                                dataLang={dataLang}
                                type={"clients"}
                                dataColumnNew={dataColumnNew.clients}
                                HandlePushItem={HandlePushItem}
                            />
                        </div>
                        <div>
                            <TitleForm title={"Trường dữ liệu xuất"} />
                            <BtnClickDeleteItem
                                clientAffter={clientAffter?.clients}
                                type="deleteAll"
                                HandleCheckAll={HandleCheckAll}
                                parent="clients"
                            />
                            <ListItem
                                dataLang={dataLang}
                                type={"clients"}
                                isShow={true}
                                dataColumnNew={clientAffter.clients}
                                HandlePushItem={HandlePushItem}
                            />
                        </div>
                    </div>
                </div>
                <div className="col-span-4 bg-zinc-50 border-2 rounded my-2">
                    <div className="grid grid-cols-2  divide-x-2">
                        <div className="">
                            <TitleForm title={"Trường dữ liệu"} />
                            <BtnClickAddItem
                                dataClientBefore={dataColumnNew?.contacts}
                                HandleCheckAll={HandleCheckAll}
                                type="addAll"
                                parent="contacts"
                            />
                            <ListItem
                                dataLang={dataLang}
                                type={"contacts"}
                                dataColumnNew={dataColumnNew.contacts}
                                HandlePushItem={HandlePushItem}
                            />
                        </div>
                        <div>
                            <TitleForm title={"Trường dữ liệu xuất"} />
                            <BtnClickDeleteItem
                                clientAffter={clientAffter?.contacts}
                                type="deleteAll"
                                HandleCheckAll={HandleCheckAll}
                                parent="contacts"
                            />
                            <div className="scrollbar-thin  scrollbar-thumb-slate-300 scrollbar-track-slate-100 overflow-auto h-[50vh]">
                                <ListItem
                                    dataLang={dataLang}
                                    type={"contacts"}
                                    isShow={true}
                                    dataColumnNew={clientAffter.contacts}
                                    HandlePushItem={HandlePushItem}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-span-4 bg-zinc-50 border-2 rounded my-2">
                    <div className="grid grid-cols-2  divide-x-2">
                        <div className="">
                            <TitleForm title={"Trường dữ liệu"} />
                            <BtnClickAddItem
                                dataClientBefore={dataColumnNew?.address}
                                HandleCheckAll={HandleCheckAll}
                                type="addAll"
                                parent="address"
                            />
                            <ListItem
                                dataLang={dataLang}
                                type={"address"}
                                dataColumnNew={dataColumnNew.address}
                                HandlePushItem={HandlePushItem}
                            />
                        </div>
                        <div>
                            <TitleForm title={"Trường dữ liệu xuất"} />
                            <BtnClickDeleteItem
                                clientAffter={clientAffter?.address}
                                type="deleteAll"
                                HandleCheckAll={HandleCheckAll}
                                parent="address"
                            />
                            <ListItem
                                dataLang={dataLang}
                                type={"address"}
                                isShow={true}
                                dataColumnNew={clientAffter?.address}
                                HandlePushItem={HandlePushItem}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Client;
