import React from "react";
import BtnClickAddItem from "../(children)/addDelete/btnAdd";
import BtnClickDeleteItem from "../(children)/addDelete/btnDelete";
import TitleForm from "../(children)/title/titleForm";
import ListItem from "../(children)/listItem/listItem";
const Products = ({ dataColumnNew, HandleCheckAll, dataLang, HandlePushItem, dataEmty, sDataEmty }) => {
    return (
        <div>
            <div className="grid grid-cols-12 gap-2">
                <div className="col-span-4 bg-zinc-50 border-2 rounded my-2">
                    <div className="grid grid-cols-2  divide-x-2">
                        <div className="">
                            <TitleForm title={"Trường dữ liệu"} />
                            <BtnClickAddItem
                                dataEmty={dataEmty}
                                dataBe={dataColumnNew.products}
                                HandleCheckAll={HandleCheckAll}
                                sDataEmty={sDataEmty}
                                type="addAll"
                                parent="products"
                            />
                            <ListItem
                                dataEmty={dataEmty}
                                dataLang={dataLang}
                                sDataEmty={sDataEmty}
                                type={"products"}
                                dataColumnNew={dataColumnNew.products}
                                HandlePushItem={HandlePushItem}
                            />
                        </div>
                        <div>
                            <TitleForm title={"Trường dữ liệu xuất"} />
                            <BtnClickDeleteItem
                                sDataEmty={sDataEmty}
                                dataBe={dataEmty?.products}
                                dataEmty={dataEmty}
                                type="deleteAll"
                                HandleCheckAll={HandleCheckAll}
                                parent="products"
                            />
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
