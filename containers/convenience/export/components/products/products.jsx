import React from "react";
import BtnClickAddItem from "../common/btnAdd";
import BtnClickDeleteItem from "../common/btnDelete";
import TitleForm from "../common/titleForm";
import ListItem from "../common/listItem";
const Products = ({ dataColumnNew, HandleCheckAll, dataLang, HandlePushItem, dataEmty, sDataEmty }) => {
    return (
        <div className="grid h-full min-h-0 grid-cols-12 gap-2 ">
            <div className="h-full min-h-0 col-span-4 my-2 border-2 rounded bg-zinc-50">
                <div className="grid h-full grid-cols-2 divide-x-2">
                    <div className="flex flex-col h-full min-h-0 ">
                        <div className="h-fit">
                            <TitleForm title={"Trường dữ liệu"} />
                        </div>
                        <div className="h-fit">
                            <BtnClickAddItem
                                dataEmty={dataEmty}
                                dataBe={dataColumnNew.products}
                                HandleCheckAll={HandleCheckAll}
                                sDataEmty={sDataEmty}
                                type="addAll"
                                parent="products"
                            />
                        </div>
                        <div className="flex-1 min-h-0">
                            <ListItem
                                dataEmty={dataEmty}
                                dataLang={dataLang}
                                sDataEmty={sDataEmty}
                                type={"products"}
                                dataColumnNew={dataColumnNew.products}
                                HandlePushItem={HandlePushItem}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col h-full min-h-0 ">
                        <div className="h-fit">
                            <TitleForm title={"Trường dữ liệu xuất"} />
                        </div>
                        <div className="h-fit">
                            <BtnClickDeleteItem
                                sDataEmty={sDataEmty}
                                dataBe={dataEmty?.products}
                                dataEmty={dataEmty}
                                type="deleteAll"
                                HandleCheckAll={HandleCheckAll}
                                parent="products"
                            />
                        </div>
                        <div className="flex-1 min-h-0">
                            <ListItem
                                sDataEmty={sDataEmty}
                                dataEmty={dataEmty}
                                dataLang={dataLang}
                                type={"products"}
                                isShow={true}
                                dataColumnNew={dataEmty.products}
                                HandlePushItem={HandlePushItem}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Products;
