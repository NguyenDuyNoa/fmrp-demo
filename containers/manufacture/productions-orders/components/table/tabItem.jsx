import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import Loading from "@/components/UI/loading/loading";
import NoData from "@/components/UI/noData/nodata";
import useSetingServer from "@/hooks/useConfigNumber";
import formatNumberConfig from "@/utils/helpers/formatnumber";
import Image from "next/image";
import { memo } from "react";
import { FiCornerDownRight } from "react-icons/fi";
import ModalImage from "react-modal-image";

const TabItem = memo(({ isState, handShowItem, isFetching, dataLang, handleShowModel }) => {
    const dataSeting = useSetingServer();
    const formatNumber = (num) => formatNumberConfig(+num, dataSeting);
    return (
        <>
            <div className="my-4">
                <div className="grid grid-cols-12 my-4">
                    <h4 className="col-span-4 px-4 text-[#344054] font-normal text-xs uppercase">
                        {dataLang?.materials_planning_order || "materials_planning_order"}
                    </h4>
                    <h4 className="col-span-1 text-center text-[#344054] font-normal text-xs uppercase">
                        {dataLang?.category_unit || "category_unit"}
                    </h4>
                    <h4 className="col-span-2 text-center text-[#344054] font-normal text-xs uppercase">
                        {dataLang?.warehouses_detail_quantity || "warehouses_detail_quantity"}
                    </h4>
                    <h4 className="col-span-5 text-center text-[#344054] font-normal text-xs uppercase">
                        {"Tiến trình"}
                    </h4>
                </div>
            </div>
            {isFetching ? (
                <Loading className="h-80" color="#0f4f9e" />
            ) : (
                <Customscrollbar className="3xl:h-[47.7vh] xxl:h-[27.5vh] 2xl:h-[36vh] xl:h-[29vh] lg:h-[30.5vh] h-[34vh] overflow-y-auto">
                    {isState?.listDataRight?.dataPPItems?.length > 0 ? (
                        isState?.listDataRight?.dataPPItems?.map((e) => (
                            <div key={e.id} className="grid grid-cols-12 items-center ">
                                <div
                                    onClick={() => handShowItem(e.id, "dataPPItems")}
                                    className="col-span-12 bg-[#EEF4FD] flex items-center gap-0.5 my-1 rounded cursor-pointer"
                                >
                                    <Image
                                        src={"/materials_planning/dow.png"}
                                        width={14}
                                        height={17}
                                        alt="dow.png"
                                        className={`object-cover ${e.showChild ? "" : "-rotate-90"} transition-all duration-150 ease-linear`}
                                    />
                                    <h1 className="text-[#52575E] font-semibold 3xl:text-sm text-xs py-2">{e.title}</h1>
                                </div>
                                {e.showChild &&
                                    e.arrListData.map((i, index) => (
                                        <div
                                            key={i.id}
                                            onClick={() => handleShowModel(i)}
                                            className={`grid grid-cols-12 ${isState.dataModal.id == i.id ? "bg-gray-100" : ""} ${e.arrListData?.length - 1 == index ? "" : "border-b"}   
                                            items-center col-span-12 group hover:bg-gray-100 cursor-pointer transition-all duration-150 ease-in-out`}
                                        >
                                            <h4 className="col-span-4 text-[#344054] font-normal text-xs flex items-start py-2 px-4 gap-2">
                                                <ModalImage
                                                    small={i.image}
                                                    large={i.image}
                                                    width={36}
                                                    height={36}
                                                    alt={i.name}
                                                    className="object-cover rounded-md min-w-[36px] min-h-[36px] w-[36px] h-[36px] max-w-[36px] max-h-[36px]"
                                                />
                                                <div className="flex flex-col gap-0.5">
                                                    <h1 className={`${isState.dataModal.id == i.id ? "text-[#0F4F9E]" : "text-[#000000]"} group-hover:text-[#0F4F9E] font-semibold xl:text-sm text-xs`}     >
                                                        {i.name}
                                                    </h1>
                                                    <h1 className="text-[#9295A4] font-normal text-[11px]">
                                                        {i.code} - {i.itemVariation}
                                                    </h1>
                                                    <div className="flex flex-col gap-2">
                                                        {/* {i.childProducts.map((e) => {
                                                            return (
                                                                <div className="flex items-center gap-1">
                                                                    <FiCornerDownRight size={15} />
                                                                    <div className="border border-gray-400 px-2 py-1 rounded-xl flex items-center gap-1">
                                                                        <ModalImage
                                                                            small={e.image}
                                                                            large={e.image}
                                                                            width={18}
                                                                            height={18}
                                                                            alt={e.name}
                                                                            className="object-cover rounded-md min-w-[18px] min-h-[18px] w-[18px] h-[18px] max-w-[18px] max-h-[18px]"
                                                                        />
                                                                        <span className="text-[#9295A4] text-[11px]">
                                                                            {e.item_code} - SL:{" "}
                                                                            {e.quota_primary > 0
                                                                                ? formatNumber(e.quota_primary)
                                                                                : "-"}{" "}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })} */}
                                                        <ProductList data={i.childProducts} />
                                                        {/* <Tree data={i.childProducts} /> */}
                                                    </div>
                                                </div>
                                            </h4>
                                            <h4 className="col-span-1 text-center text-[#344054] font-normal xl:text-sm text-xs uppercase">
                                                {i.unit}
                                            </h4>
                                            <h4 className="col-span-2 text-center text-[#344054] font-normal xl:text-sm text-xs uppercase">
                                                {i.quantity > 0 ? formatNumber(i.quantity) : "-"}
                                            </h4>
                                            <h4 className="col-span-5 flex items-center">
                                                {i.processBar.map((j, JIndex) => {
                                                    return (
                                                        <div key={j.id} className="flex flex-col w-full items-start">
                                                            {/* <div className={`${j.active ? "text-[#0BAA2E]" : "text-gray-500"} font-normal 3xl:text-[10px] text-[9px] flex flex-col`}>
                                                                {moment(j.date).format('DD/MM/YYYY, HH:mm:ss')}
                                                                <span>{j.status}</span>
                                                                <span>({moment(j.date).format('DD/MM/YYYY')})</span>
                                                            </div> */}
                                                            {/* <p
                                                                className={`${
                                                                    j.active ? "text-[#0BAA2E]" : "text-gray-500"
                                                                } font-normal 3xl:text-[10px] text-[9px] flex flex-col`}
                                                            >
                                                                <span>{j.status}</span>
                                                                <span>({moment(j.date).format("DD/MM/YYYY")})</span>
                                                            </p> */}

                                                            <li
                                                                className={`${JIndex == i.processBar.length - 1
                                                                    ? "list-none flex w-full relative text-gray-900 "
                                                                    : `list-none flex w-full relative text-gray-900  after:content-[''] after:w-full after:h-0.5 
                                                                    ${j.active ? "after:bg-[#00C170]" : "after:bg-gray-500"} after:inline-block after:absolute after:top-1 after:left-[15px]`
                                                                    }`}
                                                            >
                                                                <div className="block whitespace-nowrap z-10 ">
                                                                    <span className={`w-[10px] h-[10px]  border-2  ${j.active
                                                                        ? "bg-[#00C170] border-[#00C170]"
                                                                        : "bg-gray-500 border-gray-500"
                                                                        } rounded-full flex justify-center items-center mx-auto mb-1 text-sm`}
                                                                    ></span>
                                                                    <p className={`${j.active
                                                                        ? "text-[#0BAA2E]"
                                                                        : "text-gray-500"
                                                                        } font-normal absolute  3xl:text-[11px] text-[10px]`}
                                                                    >
                                                                        {j.title}
                                                                    </p>

                                                                    <p className={` ${j.quantity > 0 ? "opacity-100" : "opacity-0"} text-[#0BAA2E] font-normal text-[10px]`} >
                                                                        SL:
                                                                        <span className="text-[#0BAA2E] font-semibold text-[11px] px-1">
                                                                            {j.quantity > 0 ? formatNumber(j.quantity) : "-"}
                                                                        </span>
                                                                    </p>
                                                                </div>
                                                            </li>
                                                        </div>
                                                    );
                                                })}
                                            </h4>
                                        </div>
                                    ))}
                            </div>
                        ))
                    ) : (
                        <NoData />
                    )}
                </Customscrollbar>
            )}
        </>
    );
});

const RenderHtml = ({ item }) => {
    const dataSeting = useSetingServer();
    const formatNumber = (num) => formatNumberConfig(+num, dataSeting);
    return (
        <div className="flex items-center gap-1">
            <FiCornerDownRight size={15} />
            <div className="border border-gray-400 px-2 py-1 rounded-xl flex items-center gap-1">
                <ModalImage
                    small={item.image ?? "/no_img.png"}
                    large={item.image ?? "/no_img.png"}
                    width={18}
                    height={18}
                    alt={item.item_name}
                    className="object-cover rounded-md min-w-[18px] min-h-[18px] w-[18px] h-[18px] max-w-[18px] max-h-[18px]"
                />
                <span className="text-[#9295A4] text-[11px]">
                    {item.item_name} - SL: {item.quota_primary > 0 ? formatNumber(item.quota_primary) : "-"}
                </span>
            </div>
        </div>
    );
};

const ChildProduct = ({ product }) => {
    return (
        <div className="flex flex-col gap-2">
            <RenderHtml item={product} />
            {product?.sub &&
                product?.sub?.length > 0 &&
                product?.sub.map((child) => {
                    return (
                        <div className="ml-4">
                            <ChildProduct key={child?.id} product={child} />
                        </div>
                    );
                })}
        </div>
    );
};

// Component hiển thị sản phẩm
const ProductItem = ({ item }) => {
    return (
        <div className="flex flex-col gap-2">
            <RenderHtml item={item} />
            {item.sub.map((product) => {
                return (
                    <div className="ml-4">
                        <ChildProduct key={product?.id} product={product} />
                    </div>
                );
            })}
        </div>
    );
};

// Component hiển thị danh sách sản phẩm
const ProductList = ({ data }) => (
    <div>
        {data.map((item) => (
            <ProductItem key={item.id} item={item} />
        ))}
    </div>
);
// Trong ứng dụng của bạn

export default TabItem;
