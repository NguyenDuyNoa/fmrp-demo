import React, { useEffect, useState } from "react";
import BtnClickAddItem from "../common/btnAdd";
import BtnClickDeleteItem from "../common/btnDelete";
import TitleForm from "../common/titleForm";
import ListItem from "../common/listItem";
import TitleHeader from "../common/titleHeader";

const Client = ({ dataColumnNew, HandleCheckAll, dataLang, HandlePushItem, dataEmty, sDataEmty }) => {
    return (
        <div>
            <div className="grid grid-cols-12 gap-2">
                <div className="col-span-4 bg-zinc-50 border-2 rounded my-2 3xl:h-auto xxl:h-[270px]  2xl:h-[375px] xl:h-[265px] lg:h-[270px] h-auto">
                    <div className="grid grid-cols-2  divide-x-2">
                        <div className="">
                            <TitleForm title={"Trường dữ liệu"} />
                            <BtnClickAddItem
                                dataEmty={dataEmty}
                                dataBe={dataColumnNew.clients}
                                HandleCheckAll={HandleCheckAll}
                                sDataEmty={sDataEmty}
                                type="addAll"
                                parent="clients"
                            />
                            <ListItem
                                dataEmty={dataEmty}
                                dataLang={dataLang}
                                sDataEmty={sDataEmty}
                                type={"clients"}
                                dataColumnNew={dataColumnNew.clients}
                                HandlePushItem={HandlePushItem}
                            />
                        </div>
                        <div>
                            <TitleForm title={"Trường dữ liệu xuất"} />
                            <BtnClickDeleteItem
                                sDataEmty={sDataEmty}
                                dataBe={dataEmty?.clients}
                                dataEmty={dataEmty}
                                type="deleteAll"
                                HandleCheckAll={HandleCheckAll}
                                parent="clients"
                            />
                            <ListItem
                                sDataEmty={sDataEmty}
                                dataEmty={dataEmty}
                                dataLang={dataLang}
                                type={"clients"}
                                isShow={true}
                                dataColumnNew={dataEmty.clients}
                                HandlePushItem={HandlePushItem}
                            />
                        </div>
                    </div>
                </div>
                <div className="col-span-4 bg-zinc-50 border-2 rounded my-2 3xl:h-auto xxl:h-[270px]  2xl:h-[375px] xl:h-[265px] lg:h-[270px] h-auto">
                    <div className="grid grid-cols-2  divide-x-2">
                        <div className="">
                            <TitleForm title={"Trường dữ liệu"} />
                            <BtnClickAddItem
                                sDataEmty={sDataEmty}
                                dataEmty={dataEmty}
                                dataBe={dataColumnNew?.contacts}
                                HandleCheckAll={HandleCheckAll}
                                type="addAll"
                                parent="contacts"
                            />
                            <ListItem
                                sDataEmty={sDataEmty}
                                dataEmty={dataEmty}
                                dataLang={dataLang}
                                type={"contacts"}
                                dataColumnNew={dataColumnNew.contacts}
                                HandlePushItem={HandlePushItem}
                            />
                        </div>
                        <div>
                            <TitleForm title={"Trường dữ liệu xuất"} />
                            <BtnClickDeleteItem
                                sDataEmty={sDataEmty}
                                dataBe={dataEmty?.contacts}
                                dataEmty={dataEmty}
                                type="deleteAll"
                                HandleCheckAll={HandleCheckAll}
                                parent="contacts"
                            />
                            <div className="scrollbar-thin  scrollbar-thumb-slate-300 scrollbar-track-slate-100 overflow-auto 3xl:h-[50vh] xxl:h-[26vh] 2xl:h-[40vh] xl:h-[26vh] lg:h-[28vh]">
                                <ListItem
                                    sDataEmty={sDataEmty}
                                    dataEmty={dataEmty}
                                    dataLang={dataLang}
                                    type={"contacts"}
                                    isShow={true}
                                    dataColumnNew={dataEmty.contacts}
                                    HandlePushItem={HandlePushItem}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-span-4 bg-zinc-50 border-2 rounded my-2 3xl:h-auto xxl:h-[270px]  2xl:h-[375px] xl:h-[265px] lg:h-[270px] h-auto">
                    <div className="grid grid-cols-2  divide-x-2">
                        <div className="">
                            <TitleForm title={"Trường dữ liệu"} />
                            <BtnClickAddItem
                                sDataEmty={sDataEmty}
                                dataEmty={dataEmty}
                                dataBe={dataColumnNew?.address}
                                HandleCheckAll={HandleCheckAll}
                                type="addAll"
                                parent="address"
                            />
                            <ListItem
                                sDataEmty={sDataEmty}
                                dataEmty={dataEmty}
                                dataLang={dataLang}
                                type={"address"}
                                dataColumnNew={dataColumnNew.address}
                                HandlePushItem={HandlePushItem}
                            />
                        </div>
                        <div>
                            <TitleForm title={"Trường dữ liệu xuất"} />
                            <BtnClickDeleteItem
                                sDataEmty={sDataEmty}
                                dataBe={dataEmty?.address}
                                dataEmty={dataEmty}
                                type="deleteAll"
                                HandleCheckAll={HandleCheckAll}
                                parent="address"
                            />
                            <ListItem
                                sDataEmty={sDataEmty}
                                dataEmty={dataEmty}
                                dataLang={dataLang}
                                type={"address"}
                                isShow={true}
                                dataColumnNew={dataEmty?.address}
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
