import React from "react";
import BtnClickAddItem from "../(children)/addDelete/btnAdd";
import BtnClickDeleteItem from "../(children)/addDelete/btnDelete";
import TitleForm from "../(children)/title/titleForm";
import ListItem from "../(children)/listItem/listItem";
const Materials = ({ dataColumnNew, HandleCheckAll, dataLang, HandlePushItem, dataEmty, sDataEmty }) => {
    return (
        <div>
            <div className="grid grid-cols-12 gap-2">
                <div className="col-span-4 bg-zinc-50 border-2 rounded my-2 3xl:h-auto xxl:h-[270px]  2xl:h-[375px] xl:h-[265px] lg:h-[270px] h-auto">
                    <div className="grid grid-cols-2  divide-x-2">
                        <div className="">
                            <TitleForm title={"Trường dữ liệu"} />
                            <BtnClickAddItem
                                dataEmty={dataEmty}
                                dataBe={dataColumnNew.materials}
                                HandleCheckAll={HandleCheckAll}
                                sDataEmty={sDataEmty}
                                type="addAll"
                                parent="materials"
                            />
                            <ListItem
                                dataEmty={dataEmty}
                                dataLang={dataLang}
                                sDataEmty={sDataEmty}
                                type={"materials"}
                                dataColumnNew={dataColumnNew.materials}
                                HandlePushItem={HandlePushItem}
                            />
                        </div>
                        <div>
                            <TitleForm title={"Trường dữ liệu xuất"} />
                            <BtnClickDeleteItem
                                sDataEmty={sDataEmty}
                                dataBe={dataEmty?.materials}
                                dataEmty={dataEmty}
                                type="deleteAll"
                                HandleCheckAll={HandleCheckAll}
                                parent="materials"
                            />
                            <ListItem
                                sDataEmty={sDataEmty}
                                dataEmty={dataEmty}
                                dataLang={dataLang}
                                type={"materials"}
                                isShow={true}
                                dataColumnNew={dataEmty.materials}
                                HandlePushItem={HandlePushItem}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Materials;
