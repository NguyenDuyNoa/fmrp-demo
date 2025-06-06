import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import Loading from "@/components/UI/loading/loading";
import NoData from "@/components/UI/noData/nodata";
import useSetingServer from "@/hooks/useConfigNumber";
import formatNumberConfig from "@/utils/helpers/formatnumber";
import Image from "next/image";
import ModalImage from "react-modal-image";

const TabItem = ({ dataTable, handShowItem, isFetching, dataLang }) => {
    const dataSeting = useSetingServer();
    const formatNumber = (num) => formatNumberConfig(+num, dataSeting);

    return (
        <>
            <h1 className="text-[#11315B] font-normal 3xl:text-lg text-base">{dataLang?.materials_planning_list_products || 'materials_planning_list_products'}</h1>
            <div className="my-4">
                <div className="grid grid-cols-10 my-4">
                    <h4 className="col-span-4 px-4 text-[#344054] font-normal text-xs uppercase">{dataLang?.materials_planning_order || 'materials_planning_order'}</h4>
                    <h4 className="col-span-2 text-center text-[#344054] font-normal text-xs uppercase">
                        {dataLang?.category_unit || 'category_unit'}
                    </h4>
                    <h4 className="col-span-2 text-center text-[#344054] font-normal text-xs uppercase">{dataLang?.warehouses_detail_quantity || 'warehouses_detail_quantity'}</h4>
                    <h4 className="col-span-2 text-center text-[#344054] font-normal text-xs uppercase">
                        {dataLang?.materials_planning_timeline_production || 'materials_planning_timeline_production'}
                    </h4>
                </div>
            </div>
            {isFetching ? (
                <Loading className="h-80" color="#0f4f9e" />
            ) : (
                <Customscrollbar
                    className="3xl:h-[47.7vh] xxl:h-[27.5vh] 2xl:h-[35vh] xl:h-[29vh] lg:h-[30.5vh] h-[34vh] overflow-y-auto"
                >
                    {dataTable?.listDataRight?.dataPPItems?.length > 0 ? (
                        dataTable?.listDataRight?.dataPPItems?.map((e) => (
                            <div key={e.id} className="grid items-center grid-cols-10 ">
                                <div
                                    onClick={() => handShowItem(e.id, 'dataPPItems')}
                                    className="col-span-10 bg-[#EEF4FD] flex items-center gap-0.5 my-1 rounded cursor-pointer"
                                >
                                    <Image
                                        src={"/materials_planning/dow.png"}
                                        width={14}
                                        height={17}
                                        alt="dow.png"
                                        className={`object-cover ${e.showChild ? "" : "-rotate-90"
                                            } transition-all duration-150 ease-linear`}
                                    />
                                    <h1 className="text-[#52575E] font-semibold 3xl:text-sm text-xs py-2">
                                        {e.title}
                                    </h1>
                                </div>

                                {e.showChild && e.arrListData.map((i, index) => (
                                    <div
                                        key={i.id}
                                        className={`grid grid-cols-10 items-center col-span-10  ${e.arrListData?.length - 1 == index ? "" : "border-b"}`}
                                    >
                                        <h4 className="col-span-4 text-[#344054] font-normal text-xs flex items-center py-2 px-4 gap-2">
                                            <ModalImage
                                                small={i.image}
                                                large={i.image}
                                                width={36}
                                                height={36}
                                                alt={i.name}
                                                className="object-cover rounded-md min-w-[36px] min-h-[36px] w-[36px] h-[36px] max-w-[36px] max-h-[36px]"
                                            />
                                            <div className="flex flex-col gap-0.5">
                                                <h1 className="text-[#000000] font-semibold xl:text-sm text-xs">
                                                    {i.name}
                                                </h1>
                                                <h1 className="text-[#9295A4] font-normal text-[11px]">
                                                    {i.code} - {i.itemVariation}
                                                </h1>
                                            </div>
                                        </h4>
                                        <h4 className="col-span-2 text-center text-[#344054] font-normal xl:text-sm text-xs uppercase">
                                            {i.unit}
                                        </h4>
                                        <h4 className="col-span-2 text-center text-[#344054] font-normal xl:text-sm text-xs uppercase">
                                            {i.quantity > 0 ? formatNumber(i.quantity) : "-"}
                                        </h4>
                                        <h4 className="col-span-2 text-center text-[#344054] font-normal xl:text-sm text-[11px] uppercase">
                                            {i.timeline.start} - {i.timeline.end}
                                        </h4>
                                    </div>
                                ))}
                            </div>
                        ))
                    ) : <NoData className='!mt-0' />}
                </Customscrollbar>
            )}
        </>
    );
};
export default TabItem;
