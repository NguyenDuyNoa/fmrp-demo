import apiProductionsOrders from "@/Api/apiManufacture/manufacture/productionsOrders/apiProductionsOrders";
import Loading from "@/components/UI/loading/loading";
import PopupConfim from "@/components/UI/popupConfim/popupConfim";
import { CONFIRM_DELETION, TITLE_DELETE } from "@/constants/delete/deleteTable";
import { FORMAT_MOMENT } from "@/constants/formatDate/formatDate";
import useFeature from "@/hooks/useConfigFeature";
import useSetingServer from "@/hooks/useConfigNumber";
import useToast from "@/hooks/useToast";
import { useToggle } from "@/hooks/useToggle";
import { formatMoment } from "@/utils/helpers/formatMoment";
import formatNumberConfig from "@/utils/helpers/formatnumber";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as d3 from "d3";
import Image from "next/image";
import { memo, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client"; // Dùng để render icon R
import { AiOutlineFileText } from "react-icons/ai";
import { FaCheck, FaCheckCircle } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa6";
import { FiCornerDownRight } from "react-icons/fi";
import ModalImage from "react-modal-image";

const initialState = {
    dataInformation: {},
};

const TabInFormation = memo(({ isStateModal, isLoading, width, dataLang, listTab, refetchProductionsOrders, typePageMoblie }) => {
    const dataSeting = useSetingServer();

    const formatNumber = (num) => formatNumberConfig(+num, dataSeting);

    const [isInfomation, setIsInfomation] = useState(initialState);

    const queryStateInfomation = (key) => setIsInfomation((x) => ({ ...x, ...key }));

    useEffect(() => {
        if (!isStateModal.dataDetail) return;
        queryStateInfomation({
            dataInformation: {
                ...isInfomation.dataInformation,
                id: isStateModal.dataDetail?.poi?.poi_id,
                image: isStateModal.dataDetail?.poi?.images ? isStateModal.dataDetail?.poi?.images : "/icon/noimagelogo.png",
                name: isStateModal.dataDetail?.poi?.item_name + " - " + isStateModal.dataDetail?.poi?.item_code,
                itemVariation: isStateModal.dataDetail?.poi?.product_variation,
                quantity: isStateModal.dataDetail?.poi?.quantity,
                quantitySussces: 0,
                unit: isStateModal.dataDetail?.poi?.unit_name,
                type: "products",
                arrayProducts: isStateModal.dataDetail?.items_semi?.map(e => {

                    return {
                        ...e,
                        id: e?.id,
                        image: e?.images ? e?.images : "/icon/noimagelogo.png",
                        name: e?.item_name,
                        code: e?.item_code,
                        itemVariation: e?.product_variation,
                        quantity: e?.quota_primary,
                        show: true,
                        processBar: e?.stages?.map(i => {
                            return {
                                ...i,
                                active: i?.active == "1",
                            }
                        })
                    }
                })
            },
        });
    }, [isStateModal.dataDetail]);

    return (
        <div>
            {/* <h1 className="my-1 text-base 3xl:text-xl">{listTab[isStateModal.isTab - 1]?.name}</h1> */}
            {isLoading
                ?
                <Loading />
                :
                <div className="flex w-full gap-2 overflow-auto ">
                    {/* <div className={`${width > 900 ? "3xl:w-[15%] 2xl:w-[23%] xl:w-[25%] lg:w-[25%]" : "3xl:w-[30%] 2xl:w-[30%] xl:w-[35%] lg:w-[30%]"}  flex items-start py-2 px-4 gap-2 bg-gray-50 border rounded-md`}>
                        <ModalImage
                            small={isInfomation.dataInformation?.image}
                            large={isInfomation.dataInformation?.image}
                            width={36}
                            height={36}
                            alt={isInfomation.dataInformation?.name}
                            className="object-cover rounded-md min-w-[36px] min-h-[36px] w-[36px] h-[36px] max-w-[36px] max-h-[36px]"
                        />
                        <div className="flex flex-col gap-1">
                            <h1 className="text-[#0F4F9E] font-semibold xl:text-sm text-sm">
                                {isInfomation.dataInformation?.name ?? ""}
                            </h1>
                            <h1 className={`text-[#9295A4] font-normal text-sm italic`}>
                                {isInfomation.dataInformation?.itemVariation ?? ""}
                            </h1>
                            <h1 className={`text-[#9295A4] font-normal text-sm`}>
                                Loại:{" "}
                                <span className={`py-[1px] px-1 rounded border h-fit w-fit font-[300] break-words leading-relaxed text-xs
                                 ${(isInfomation.dataInformation?.type === "products" && "text-lime-500 border-lime-500")
                                    ||
                                    (isInfomation.dataInformation?.type === 1 && "text-orange-500 border-orange-500")
                                    ||
                                    (isInfomation.dataInformation?.type === 2 && "text-sky-500 border-sky-500")
                                    }`}
                                >
                                    {isInfomation.dataInformation?.type === "products" && "Thành phẩm"}
                                </span>
                            </h1>

                            <h1 className="text-[#9295A4] font-normal text-sm">
                                {dataLang?.productions_orders_details_unit || 'productions_orders_details_unit'}:{" "}
                                <span className="text-sm font-semibold text-black">
                                    {isInfomation.dataInformation?.unit ?? ""}
                                </span>
                            </h1>
                            <h1 className="text-[#9295A4] font-normal text-sm">
                                {dataLang?.productions_orders_details_quantity || 'productions_orders_details_quantity'}:{" "}
                                <span className="text-sm font-semibold text-black">
                                    {isInfomation.dataInformation?.quantity > 0 ? formatNumber(isInfomation.dataInformation?.quantity) : "-"}
                                </span>
                            </h1>
                            <h1 className="text-[#9295A4] font-normal text-sm">
                                {dataLang?.productions_orders_details_accomplished || 'productions_orders_details_accomplished'}:{" "}
                                <span className="text-sm font-semibold text-black">
                                    {isInfomation.dataInformation?.quantitySussces > 0 ? formatNumber(isInfomation?.dataInformation?.quantitySussces) : "-"}
                                </span>
                            </h1>
                        </div>
                    </div> */}
                    <div
                        className={`flex flex-nowrap gap-2 justify-start  w-full overflow-x-auto pr-2`}
                    >
                        {/* <div
                        className={`flex flex-nowrap gap-2 justify-start  ${width > 900
                            ? "3xl:h-[calc(100vh_-_343px)] 2xl:h-[calc(100vh_-_343px)] xxl:h-[calc(100vh_-_345px)] 3xl:w-[85%] 2xl:w-[77%] xl:w-[75%] lg:w-[75%]"
                            : "3xl:h-[calc(100vh_-_500px)] h-[calc(100vh_-_460px)] 3xl:w-[70%] 2xl:w-[70%] xl:w-[65%] lg:w-[70%]"}  scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 overflow-x-auto pr-2`}
                    > */}
                        {/* {
                            isInfomation.dataInformation?.arrayProducts?.map((e) => {
                                const shownElements = isInfomation.dataInformation?.arrayProducts?.filter((e) => e?.show);
                                return (
                                    <RenderItem
                                        type='semi'
                                        id={e?.id}
                                        key={e?.id}
                                        name={e.name}
                                        code={e.code}
                                        image={e?.image}
                                        dataLang={dataLang}
                                        quantity={e?.quantity}
                                        quantity_keep={e?.quantity_keep}
                                        quantity_need_manufactures={e?.quantity_need_manufactures}
                                        processBar={e?.processBar}
                                        checkBorder={shownElements}
                                        itemVariation={e?.itemVariation}
                                        dataDetail={isStateModal.dataDetail}
                                        refetchProductionsOrders={refetchProductionsOrders}
                                    />
                                );
                            })
                        } */}
                        <div className="">
                            <RenderItem
                                id={undefined}
                                type='products'
                                checkBorder={''}
                                dataLang={dataLang}
                                typePageMoblie={typePageMoblie}
                                image={isStateModal.dataDetail?.poi?.images ? isStateModal.dataDetail?.poi?.images : "/icon/noimagelogo.png"}
                                dataDetail={isStateModal.dataDetail}
                                name={isStateModal.dataDetail?.poi?.item_name}
                                code={isStateModal.dataDetail?.poi?.item_code}
                                quantity={isStateModal.dataDetail?.poi?.quantity}
                                quantity_error={isStateModal.dataDetail?.poi?.quantity_error}
                                processBar={isStateModal.dataDetail?.poi?.stages}
                                itemVariation={isStateModal.dataDetail?.poi?.product_variation}
                                refetchProductionsOrders={refetchProductionsOrders}
                            />
                        </div>
                    </div>
                </div>
            }
        </div>
    );
});

const RenderItem = ({
    type, id,
    dataDetail,
    image,
    name,
    code,
    itemVariation,
    quantity,
    processBar,
    checkBorder,
    dataLang,
    refetchProductionsOrders,
    quantity_keep,
    quantity_need_manufactures,
    quantity_error,
    typePageMoblie
}) => {
    const isShow = useToast()

    const queryClient = useQueryClient()

    const dataSeting = useSetingServer()

    const { isOpen, handleQueryId, isId } = useToggle();

    const formatNumber = (num) => formatNumberConfig(+num, dataSeting);

    const handinngDeleteItem = useMutation({
        mutationFn: (data) => {
            return apiProductionsOrders.apiRemovePurchaseProduct(data)
        },
        retry: 5,
        gcTime: 5000,
        retryDelay: 5000,
    })

    const handleConfimDeleteItem = () => {
        let formData = new FormData();
        formData.append("purchase_product_id", isId);
        handinngDeleteItem.mutate(formData, {
            onSuccess: ({ isSuccess, message }) => {
                if (isSuccess) {
                    isShow('success', message);

                    queryClient.invalidateQueries(['api_item_orders_detail', true]);

                    return
                }
                isShow('error', message);
            },
            onError: (err) => {

            }
        })
        handleQueryId({ status: false })
    }

    return (
        <div key={id ?? ""} className={`w-fit`}>
            <div className={`bg-white sticky top-0 z-[1] `}>
                <div className={`flex items-start py-2 px-4   gap-2 border-[#5599EC]/50 border-[0.5px] shadow-[0_0_2px_rgba(0,0,0,0.2) rounded-xl w-fit`}>
                    <div className="min-h-[32px] h-8 w-8 min-w-[32px]">
                        <Image
                            src={image}
                            // large={image}
                            width={18}
                            height={18}
                            alt={name || "img"}
                            className="object-cover w-full h-full rounded-md"
                        />
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <div className={`${typePageMoblie ? 'text-[10px] leading-tight' : 'text-sm'} ${type === "semi" ? "font-medium" : "text-[#5599EC] font-semibold"} max-w-[200px]`}>
                            {name}
                        </div>
                        <div className={`${typePageMoblie ? "text-[9px] leading-tight" : "text-[12px]"} italic text-gray-500 w-fit`}>
                            {code} - {itemVariation}
                        </div>
                        {
                            type === "semi" ?
                                <div className="flex items-center gap-2">
                                    <div className="text-[10px] border border-[#5599EC] text-[#5599EC] font-medium w-fit px-2 py-0.5 rounded-2xl">
                                        SL cần: {quantity > 0 ? formatNumber(quantity) : "-"}
                                    </div>
                                    <div className="text-[10px] border border-[#5599EC] text-[#5599EC] font-medium w-fit px-2 py-0.5 rounded-2xl">
                                        SL giữ kho: {quantity_keep > 0 ? formatNumber(quantity_keep) : "-"}
                                    </div>
                                    <div className="text-[10px] border border-[#5599EC] text-[#5599EC] font-medium w-fit px-2 py-0.5 rounded-2xl">
                                        SL sản xuất: {quantity_need_manufactures > 0 ? formatNumber(quantity_need_manufactures) : "-"}
                                    </div>
                                </div>
                                :
                                <>
                                    <div className="text-[10px] border border-[#5599EC] text-[#5599EC] font-medium w-fit px-2 py-0.5 rounded-2xl">
                                        Số lượng: {quantity > 0 ? formatNumber(quantity) : "-"}
                                    </div>
                                    {/* <div className="text-[10px] border border-[#5599EC] text-[#5599EC] font-medium w-fit px-2 py-0.5 rounded-2xl">
                                        Số lượng lỗi: {quantity_error > 0 ? formatNumber(quantity_error) : "-"}
                                    </div> */}
                                </>
                        }

                    </div>
                </div>
            </div>
            {
                type === "semi"
                    ?
                    (quantity_need_manufactures > 0)
                        ?
                        <ProcessBar data={processBar} checkBorder={checkBorder} typePageMoblie={typePageMoblie} />
                        :
                        <p className="text-xs font-normal text-center text-red-500 xl:text-sm">
                            Số lượng sản xuất đã hết, quá trình sản xuất đã kết thúc
                        </p>
                    :
                    // <ProcessFlow data={processBar} />
                    <ProcessBar data={processBar} checkBorder={checkBorder} typePageMoblie={typePageMoblie} />
            }
            <PopupConfim
                dataLang={dataLang}
                type="warning"
                title={TITLE_DELETE}
                subtitle={CONFIRM_DELETION}
                isOpen={isOpen}
                save={() => { handleConfimDeleteItem() }}
                cancel={() => { handleQueryId({ status: false }) }}
            />
        </div>
    )
}




// const ProcessFlow = ({ data }) => {
//     const svgRef = useRef();

//     const getColor = (item) => {
//         if (item?.active) return "#008000"; // Màu xanh khi active
//         if (item?.begin_production == "1") return "orange"; // Màu cam khi bắt đầu sản xuất
//         return "gray"; // Màu xám mặc định
//     };
//     useEffect(() => {
//         if (!data || data.length === 0) return;

//         const baseStepHeight = 40;
//         const itemHeight = 35; // Tăng khoảng cách giữa các item
//         const circleRadius = 9;
//         const marginLeft = 50;
//         const marginTop = 30;
//         const paddingRight = 50;
//         const iconOffset = 40; // Tăng khoảng cách để đẩy box sang phải thêm

//         // Đo kích thước text để tính width tối thiểu
//         const tempSvg = d3.select("body").append("svg").attr("visibility", "hidden");
//         let maxTextWidth = 0;

//         data.forEach(step => {
//             const stageText = tempSvg.append("text").text(step.stage_name);
//             maxTextWidth = Math.max(maxTextWidth, stageText.node().getComputedTextLength());

//             if (step.purchase_items?.length) {
//                 step.purchase_items.forEach(item => {
//                     const itemText = tempSvg.append("text").text(`${item.code} - SL:${item.quantity}${item.hasError ? ' lỗi' : ''}`);
//                     maxTextWidth = Math.max(maxTextWidth, itemText.node().getComputedTextLength() + iconOffset + 20); // Thêm không gian cho icon
//                 });
//             }
//         });

//         tempSvg.remove();

//         const width = Math.max(maxTextWidth + marginLeft + paddingRight + 50, 300);

//         // Khởi tạo SVG
//         let svg = d3.select(svgRef.current)
//             .attr("width", "100%")
//             .attr("height", "auto")
//             .style("width", "100%")
//             .style("max-height", "none")
//             .style("overflow", "visible");

//         svg.selectAll("*").remove();

//         let currentY = marginTop;
//         let lastCircleY = null;

//         data.forEach((step, i) => {
//             const stepY = currentY;

//             // Vẽ đường nối
//             if (lastCircleY !== null) {
//                 svg.append("line")
//                     .attr("x1", marginLeft)
//                     .attr("y1", lastCircleY + circleRadius)
//                     .attr("x2", marginLeft)
//                     .attr("y2", stepY - circleRadius)
//                     .attr("stroke", getColor(step))
//                     .attr("stroke-width", 1.5);
//             }

//             // Vẽ vòng tròn
//             svg.append("circle")
//                 .attr("cx", marginLeft)
//                 .attr("cy", stepY)
//                 .attr("r", circleRadius)
//                 .attr("fill", "none")
//                 .attr("stroke", getColor(step))
//                 .attr("stroke-width", 1.5);

//             lastCircleY = stepY;

//             // Thêm tên bước
//             const textElement = svg.append("text")
//                 .attr("x", marginLeft + 20)
//                 .attr("y", stepY + 4)
//                 .text(step.stage_name)
//                 .attr("font-size", "12px")
//                 .attr("font-weight", "bold")
//                 .attr("fill", getColor(step));

//             const textWidth = textElement.node().getComputedTextLength();
//             const checkIconX = marginLeft + 20 + textWidth + 5;

//             // Icon check
//             const checkIconContainer = svg.append("foreignObject")
//                 .attr("x", checkIconX)
//                 .attr("y", stepY - 8)
//                 .attr("width", 16)
//                 .attr("height", 16)
//                 .append("xhtml:div");
//             createRoot(checkIconContainer.node()).render(<FaCheckCircle color={getColor(step)} size={12} />);

//             // Icon trong vòng tròn
//             const circleIconContainer = svg.append("foreignObject")
//                 .attr("x", marginLeft - 5)
//                 .attr("y", stepY - 5)
//                 .attr("width", 12)
//                 .attr("height", 12)
//                 .append("xhtml:div");

//             const isLastStep = i === data.length - 1;
//             const iconColor = getColor(step);
//             createRoot(circleIconContainer.node()).render(
//                 isLastStep
//                     ? <FaCheck color={iconColor} size={10} />
//                     : (i % 2 === 0 ? <FaArrowDown color={iconColor} size={10} /> : <AiOutlineFileText color={iconColor} size={10} />)
//             );

//             let itemY = stepY + circleRadius + 15;

//             // Xử lý purchase_items
//             if (step.purchase_items?.length) {
//                 step.purchase_items.forEach((item, index) => {
//                     const itemGroup = svg.append("g");

//                     // Icon chỉ xuất hiện ở item index === 0
//                     if (index === 0) {
//                         const iconContainer = itemGroup.append("foreignObject")
//                             .attr("x", marginLeft + 10) // Vị trí cố định cho icon
//                             .attr("y", itemY - 12)
//                             .attr("width", 20)
//                             .attr("height", 20)
//                             .append("xhtml:div");
//                         createRoot(iconContainer.node()).render(
//                             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
//                                 <FiCornerDownRight color={getColor(step)} size={16} />
//                             </div>
//                         );
//                     }

//                     // Dịch text và box sang phải để tránh lọt vào icon
//                     const itemTextGroup = itemGroup.append("g")
//                         .attr("transform", `translate(${marginLeft + iconOffset}, ${itemY})`); // Dịch sang phải

//                     const mainText = item.code;
//                     const quantityText = item.quantity;
//                     const hasError = item.hasError || false;

//                     // Sử dụng foreignObject để render div linh hoạt
//                     const contentContainer = itemTextGroup.append("foreignObject")
//                         .attr("width", 250) // Tăng độ rộng tối đa để chứa nội dung
//                         .attr("height", 50) // Tăng chiều cao để chứa nhiều dòng
//                         .append("xhtml:div")
//                         .style("display", "flex")
//                         .style("flexDirection", "column") // Hỗ trợ bố cục theo cột
//                         .style("align-items", "flex-start");

//                     // Tạo root để render React components
//                     const root = createRoot(contentContainer.node());
//                     root.render(
//                         <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
//                             <div style={{ display: 'flex', alignItems: 'center' }}>
//                                 {/* Text chính (màu đen nếu không lỗi, xám nếu có lỗi) */}
//                                 <span style={{ fontSize: '11px', color: hasError ? '#808080' : '#000000' }}>
//                                     {`${mainText} - SL: ${quantityText}`}
//                                 </span>
//                                 {hasError && (
//                                     <span style={{ fontSize: '11px', color: '#FF0000', marginLeft: '5px' }}>
//                                         SL lỗi
//                                     </span>
//                                 )}
//                                 {/* Ví dụ thêm ảnh (thay bằng đường dẫn ảnh thực tế) */}
//                                 <img src="https://via.placeholder.com/20" alt="sample" style={{ marginLeft: '10px', width: '20px', height: '20px' }} />
//                                 {/* Ví dụ thêm div tùy ý */}
//                                 <div style={{ marginLeft: '10px', color: '#333', fontSize: '11px' }}>Extra Info</div>
//                             </div>
//                             <div style={{ color: 'black', fontSize: '11px', marginTop: '5px' }}>helo</div>
//                         </div>
//                     );

//                     // Lấy kích thước từ DOM sau khi render
//                     const contentDiv = contentContainer.node().firstChild;
//                     requestAnimationFrame(() => {
//                         if (contentDiv) {
//                             const contentWidth = contentDiv.clientWidth || 250; // Sử dụng clientWidth, fallback 250
//                             const contentHeight = contentDiv.clientHeight || 50; // Sử dụng clientHeight, fallback 50

//                             // Tạo box bao quanh chỉ cho SL thông thường
//                             if (!hasError) {
//                                 itemGroup.insert("rect", "g")
//                                     .attr("x", marginLeft + iconOffset - 5)
//                                     .attr("y", itemY - 12)
//                                     .attr("width", contentWidth + 30)
//                                     .attr("height", contentHeight + 14)
//                                     .attr("fill", "none")
//                                     .attr("stroke", "#808080") // Thêm border màu gray
//                                     .attr("stroke-width", 1)
//                                     .attr("rx", 4) // Bo góc
//                                     .attr("ry", 4); // Bo góc (tương thích với rx)
//                             }
//                         }
//                     });

//                     itemY += itemHeight + 5;
//                 });
//             }

//             // Cập nhật currentY dựa trên vị trí cuối cùng của item
//             currentY = itemY;
//         });

//         // Cập nhật chiều cao SVG dựa trên currentY cuối cùng
//         svg.attr("height", currentY + marginTop)
//             .attr("viewBox", `0 0 ${width} ${currentY + marginTop}`);
//     }, [data]);

//     // useEffect(() => {
//     //     if (!data || data.length === 0) return;
//     //     const baseStepHeight = 40; // Khoảng cách giữa các bước
//     //     const itemHeight = 25; // Khoảng cách giữa các sản phẩm
//     //     const circleRadius = 9; // Kích thước vòng tròn
//     //     const marginLeft = 50;
//     //     const marginTop = 30;
//     //     const paddingRight = 50;  // Khoảng cách bên phải tránh bị cắt

//     //     // Tạo SVG tạm để đo kích thước thực tế
//     //     const tempSvg = d3.select("body").append("svg").attr("visibility", "hidden");

//     //     let maxTextWidth = 0;

//     //     console.log("🔍 Bắt đầu tính toán maxTextWidth...");

//     //     data.forEach((step) => {
//     //         const textElement = tempSvg.append("text")
//     //             .attr("font-size", "12px")
//     //             .text(step.stage_name);

//     //         const bbox = textElement.node().getBBox();
//     //         maxTextWidth = Math.max(maxTextWidth, bbox.width);

//     //         console.log(`✅ "${step.stage_name}" - width: ${bbox.width}`);

//     //         if (step.purchase_items && step.purchase_items.length > 0) {
//     //             step.purchase_items.forEach((item) => {
//     //                 const itemText = tempSvg.append("text")
//     //                     .attr("font-size", "10px")
//     //                     .text(`${item.reference_no} - SL: ${item.quantity} - SL lỗi: ${item.quantity_error}`);

//     //                 const itemBBox = itemText.node().getBBox();
//     //                 maxTextWidth = Math.max(maxTextWidth, itemBBox.width);

//     //                 console.log(`📦 "${item.reference_no}" - width: ${itemBBox.width}`);
//     //             });
//     //         }
//     //     });

//     //     tempSvg.remove(); // Xóa SVG tạm sau khi đo

//     //     console.log("🔍 Tổng maxTextWidth:", maxTextWidth);

//     //     const width = Math.max(maxTextWidth + marginLeft + paddingRight, 300); // Đảm bảo không nhỏ hơn 300px
//     //     const height = data.reduce(
//     //         (acc, step) => acc + baseStepHeight + (step.purchase_items?.length || 0) * (itemHeight + 5),
//     //         marginTop
//     //     );

//     //     console.log(`🛠 SVG Width: ${width}, Height: ${height}`);

//     //     const svg = d3.select(svgRef.current)
//     //         .attr("width", width) // Áp dụng width tự động
//     //         .attr("height", height)
//     //         .attr("viewBox", `0 0 ${width} ${height}`)
//     //         .attr("preserveAspectRatio", "xMinYMin meet")
//     //         .style("width", "100%") // Đảm bảo mở rộng
//     //         .style("max-width", `${width}px`) // Không bị cắt mất
//     //         .style("overflow", "visible");

//     //     svg.selectAll("*").remove(); // Xóa nội dung cũ


//     //     let currentY = marginTop;
//     //     let lastCircleY = null

//     //     data.forEach((step, i) => {
//     //         const stepY = currentY;
//     //         console.log(step);


//     //         // Vẽ đường nối với màu theo trạng thái (chỉ vẽ nếu không phải bước cuối)
//     //         if (lastCircleY !== null) {
//     //             svg.append("line")
//     //                 .attr("x1", marginLeft)
//     //                 .attr("y1", lastCircleY + circleRadius)
//     //                 .attr("x2", marginLeft)
//     //                 .attr("y2", stepY - circleRadius)
//     //                 .attr("stroke", getColor(step)) // Áp dụng màu động
//     //                 .attr("stroke-width", 1.5);
//     //         }

//     //         // Vẽ vòng tròn chỉ có viền
//     //         svg.append("circle")
//     //             .attr("cx", marginLeft)
//     //             .attr("cy", stepY)
//     //             .attr("r", circleRadius)
//     //             .attr("fill", "none")
//     //             .attr("stroke", getColor(step))
//     //             .attr("stroke-width", 1.5);

//     //         // Lưu vị trí vòng tròn
//     //         lastCircleY = stepY;

//     //         // Thêm tên bước (Giảm kích thước font)
//     //         const textElement = svg.append("text")
//     //             .attr("x", marginLeft + 20)
//     //             .attr("y", stepY + 4)
//     //             .text(step.stage_name)
//     //             .attr("font-size", "12px") // Giảm kích thước chữ
//     //             .attr("font-weight", "bold")
//     //             .attr("fill", getColor(step));

//     //         // Căn chỉnh icon check ✔️ cuối cùng theo độ dài của stage_name
//     //         const textWidth = textElement.node().getComputedTextLength();
//     //         const checkIconX = marginLeft + 20 + textWidth + 5;

//     //         const checkIconContainer = svg.append("foreignObject")
//     //             .attr("x", checkIconX)
//     //             .attr("y", stepY - 8)
//     //             .attr("width", 16)
//     //             .attr("height", 16)
//     //             .append("xhtml:div");

//     //         createRoot(checkIconContainer.node()).render(<FaCheckCircle color={getColor(step)} size={12} />);

//     //         // Thêm icon trong vòng tròn (FaArrowDown hoặc AiOutlineFileText)
//     //         const circleIconContainer = svg.append("foreignObject")
//     //             .attr("x", marginLeft - 5)
//     //             .attr("y", stepY - 5)
//     //             .attr("width", 12)
//     //             .attr("height", 12)
//     //             .append("xhtml:div");

//     //         const isLastStep = i === data.length - 1;
//     //         const iconColor = getColor(step);

//     //         createRoot(circleIconContainer.node()).render(
//     //             isLastStep
//     //                 ? <FaCheck color={iconColor} size={10} />
//     //                 : (i % 2 === 0 ? <FaArrowDown color={iconColor} size={10} /> : <AiOutlineFileText color={iconColor} size={10} />)
//     //         );

//     //         let itemY = stepY + circleRadius + 5;

//     //         // step?.purchase_items?.forEach((item, index) => {
//     //         //     // Thêm icon FiCornerDownRight trước sản phẩm đầu tiên
//     //         //     if (index === 0) {
//     //         //         const cornerIconContainer = svg.append("foreignObject")
//     //         //             .attr("x", marginLeft + 10)
//     //         //             .attr("y", itemY)
//     //         //             .attr("width", 16)
//     //         //             .attr("height", 16)
//     //         //             .append("xhtml:div");

//     //         //         createRoot(cornerIconContainer.node()).render(<FiCornerDownRight color="#888" size={12} />);
//     //         //     }


//     //         //     // Tạo text ẩn để đo chiều rộng thật
//     //         //     const tempText = svg.append("text")
//     //         //         .attr("font-size", "11px")
//     //         //         .text(`${item.reference_no} - SL: ${item.quantity} ${item.quantity_error > 0 ? `- SL lỗi: ${item.quantity_error}` : ""}`)
//     //         //         .attr("visibility", "hidden"); // Ẩn text để chỉ đo kích thước

//     //         //     const textWidth = tempText.node().getBBox().width; // Lấy chiều rộng nội dung
//     //         //     const padding = 20; // Padding hai bên
//     //         //     const imageWidth = 20; // Dành chỗ cho hình ảnh
//     //         //     const boxWidth = textWidth + padding * 1.5 + imageWidth; // Tổng chiều rộng

//     //         //     tempText.remove(); // Xóa text tạm sau khi đo

//     //         //     // Tạo foreignObject để chứa component Image + Text
//     //         //     const itemContainer = svg.append("foreignObject")
//     //         //         .attr("x", marginLeft + 30)
//     //         //         .attr("y", itemY)
//     //         //         .attr("width", boxWidth) // Dùng width động
//     //         //         .attr("height", 30)
//     //         //         .append("xhtml:div")
//     //         //         .style("display", "inline-flex")
//     //         //         .style("align-items", "center")
//     //         //         .style("border", "1px solid #333")
//     //         //         .style("border-radius", "8px")
//     //         //         .style("padding", "4px 12px")
//     //         //         .style("font-size", "11px")
//     //         //         .style("white-space", "nowrap");



//     //         //     // Thêm component hình ảnh
//     //         //     createRoot(itemContainer.node()).render(
//     //         //         <>
//     //         //             <Image
//     //         //                 src={item.image ? item.image : '/icon/noimagelogo.png'}
//     //         //                 alt="Product Image"
//     //         //                 width={14}
//     //         //                 height={14}
//     //         //                 style={{ marginRight: 8 }}
//     //         //             />
//     //         //             <span style={{ color: "#333" }}>{item.reference_no} - SL: {item.quantity}</span>
//     //         //             {item.quantity_error > 0 && (
//     //         //                 <span style={{ color: "red", marginLeft: 4 }}>- SL lỗi: {item.quantity_error}</span>
//     //         //             )}
//     //         //         </>
//     //         //     );

//     //         //     itemY += itemHeight + 8; // Cập nhật vị trí Y cho sản phẩm tiếp theo
//     //         // });








//     //         currentY = itemY + baseStepHeight;
//     //     });
//     // }, [data]);

//     return <svg ref={svgRef}></svg>;
// };



const ProcessBar = ({ data, checkBorder, typePageMoblie }) => {

    const dataSeting = useSetingServer()

    const formatNumber = (num) => formatNumberConfig(+num, dataSeting);

    const { dataMaterialExpiry, dataProductExpiry, dataProductSerial } = useFeature()

    return (
        <>
            {
                data?.map((j, jIndex) => {
                    const checkLast = data?.length - 1 != jIndex
                    // const checkDate = data?.filter((e) => e?.date_active)?.length > 0
                    return (
                        <div key={jIndex} className={`px-4 mx-auto ${jIndex == 0 && 'mt-5'} ${checkBorder ? "border-r" : ""}`}>
                            <div className="flex min-h-[70px] gap-3">
                                <div className={` ${(j?.active || j?.begin_production == 1) ? "" : ''} pt-0.5 text-[10px] 
                                ${j?.active ? ' text-[#008000]' : j?.begin_production == 1 ? "text-[#FF8F0D] " : "text-black/70"} 
                                font-medium text-right` }
                                >
                                    <div className={`${(j?.active || j?.begin_production == 1) ? 'block' : 'hidden'}`}>
                                        {formatMoment((j?.active || j?.begin_production == 1) ? (j?.active ? j?.date_active : j?.date_production ? j?.date_production : new Date()) : new Date(), FORMAT_MOMENT.DATE_SLASH_LONG)}
                                    </div>
                                    {/* <div className={`${(j?.active || j?.begin_production == 1) ? 'block' : 'hidden'} `}>
                                        {formatMoment((j?.active || j?.begin_production == 1) ? (j?.active ? j?.date_active : j?.date_production ? j?.date_production : new Date()) : new Date(), FORMAT_MOMENT.TIME_SHORT)}
                                    </div> */}
                                    <div className={`${j?.active ? 'opacity-0' : j?.begin_production == 1 ? 'opacity-0' : 'opacity-100'} ${typePageMoblie ? "text-[10px]" : 'text-xs'}`}>
                                        {(j?.active) ? 'Đã hoàn thành' : (j?.begin_production == 1) ? 'Đang sản xuất' : 'Chưa sản xuất'}
                                    </div>
                                </div>
                                <div className="flex">
                                    <div className={`mr-3 flex flex-col items-center`}>
                                        <div className="">
                                            <div className={`flex h-5 w-5  ${j?.active ? "border-[#008000] bg-[#008000]" : j?.begin_production == 1 ? 'border-[#FF8F0D]' : "border-gray-400"}  items-center justify-center rounded-full border `}>
                                                {
                                                    data?.length - 1 != jIndex
                                                        ?
                                                        <>
                                                            {
                                                                jIndex % 2 == 0 && <FaArrowDown
                                                                    size={9}
                                                                    className={`${j?.active ? 'text-white' : j?.begin_production == 1 ? 'text-[#FF8F0D]' : "text-gray-400"}`}
                                                                />
                                                            }
                                                            {
                                                                jIndex % 2 != 0 && <AiOutlineFileText
                                                                    size={9}
                                                                    className={`${j?.active ? 'text-white' : j?.begin_production == 1 ? 'text-[#FF8F0D]' : "text-gray-400"}`}
                                                                />
                                                            }
                                                        </>
                                                        :
                                                        <FaCheck
                                                            size={8}
                                                            className={`${j?.active ? 'text-white' : j?.begin_production == 1 ? 'text-[#FF8F0D]' : "text-gray-400"}`}
                                                        />
                                                }
                                            </div>
                                        </div>
                                        {checkLast && <div className={`h-full w-px ${j?.active ? 'bg-[#008000]' : j?.begin_production == 1 ? 'bg-orange-400' : 'bg-gray-300'} relative`} />}
                                    </div>
                                    <div className="mt-0.5">
                                        <div className="flex items-center gap-2">
                                            <p className={`-mt-1 ${typePageMoblie ? "text-[10px]" : 'text-[13px]'}  font-semibold ${j?.active ? "text-[#008000]" : j?.begin_production == 1 ? 'text-[#FF8F0D]' : "text-black/60"}`}>
                                                {j.stage_name}
                                            </p>
                                            {(+j?.type == 2 || +j?.type == 3)
                                                ?
                                                <FaCheckCircle size={14} className={`${j?.active ? "text-[#008000]" : j?.begin_production == 1 ? 'text-[#FF8F0D]' : "text-gray-500"} cursor-default hover:scale-110 transition-all duration-150 ease-linear`} />
                                                :
                                                +j?.type == 0 &&
                                                <FaCheckCircle size={14} className={`${j?.active ? "text-[#008000]" : j?.begin_production == 1 ? 'text-[#FF8F0D]' : "text-gray-500"} cursor-default hover:scale-110 transition-all duration-150 ease-linear`} />
                                            }
                                        </div>
                                        <div className="flex items-start gap-1 py-2">
                                            {j?.purchase_items?.length > 0 && <FiCornerDownRight size={15} className="mt-1" />}
                                            <div className="flex flex-col items-start gap-2">
                                                {
                                                    j?.purchase_items?.map(e => {
                                                        return (
                                                            <div key={e?.id} className="">
                                                                <div className={`flex items-center justify-start gap-1 px-2 ${typePageMoblie ? "py-0" : "py-px"} border border-gray-400 rounded-full`}>
                                                                    {/* <div className="h-full">
                                                                        <ModalImage
                                                                            small={e?.image ? e?.image : "/icon/noimagelogo.png"}
                                                                            large={e?.image ? e?.image : "/icon/noimagelogo.png"}
                                                                            width={24}
                                                                            height={24}
                                                                            alt={e?.reference_no}
                                                                            className="object-cover rounded-md min-w-[18px] min-h-[18px] w-[18px] h-[18px] max-w-[18px] max-h-[18px]"
                                                                        />
                                                                    </div> */}
                                                                    <div className="flex flex-row items-center divide-x">
                                                                        <div className="flex items-center gap-1 pr-1 text-[#9295A4]">
                                                                            <span className={`${typePageMoblie ? "text-[8px]" : "text-[11px]"} font-medium`}>
                                                                                {e?.reference_no}
                                                                            </span>
                                                                            -
                                                                            <span className={`text-[#9295A4] ${typePageMoblie ? "text-[8px]" : "text-[11px]"} font-medium`}>
                                                                                SL:<span className="pl-0.5">{formatNumber(e?.quantity)}</span>
                                                                            </span>
                                                                            {
                                                                                e?.quantity_error > 0 && <span className={`text-red-500 ${typePageMoblie ? "text-[8px]" : "text-[11px]"} font-semibold`}>
                                                                                    - SL lỗi:<span className="pl-0.5">{formatNumber(e?.quantity_error)}</span>
                                                                                </span>
                                                                            }
                                                                        </div>
                                                                        {
                                                                            j?.final_stage == "1" && (
                                                                                <div className="flex items-center gap-1 pl-1">
                                                                                    {dataProductSerial.is_enable === "1" && (
                                                                                        <div className="flex gap-0.5">
                                                                                            <h6 className={`${typePageMoblie ? "text-[8px]" : "text-[10px]"} text-[#9295A4]`}>
                                                                                                Serial:
                                                                                            </h6>
                                                                                            <h6 className={`${typePageMoblie ? "text-[8px]" : "text-[10px]"} text-[#9295A4] px-2 w-[full] text-left`}>
                                                                                                {e?.serial ? e?.serial : "-"}
                                                                                            </h6>
                                                                                        </div>
                                                                                    )}
                                                                                    {(dataMaterialExpiry.is_enable === "1" || dataProductExpiry.is_enable === "1") && (
                                                                                        <>
                                                                                            <div className="flex gap-0.5">
                                                                                                <h6 className={`${typePageMoblie ? "text-[8px]" : "text-[10px]"} text-[#9295A4]`}>
                                                                                                    Lot:
                                                                                                </h6>{" "}
                                                                                                <h6 className={`${typePageMoblie ? "text-[8px]" : "text-[10px]"} text-[#9295A4] px-2 w-[full] text-left`}>
                                                                                                    {e?.lot ? e?.lot : "-"}
                                                                                                </h6>
                                                                                            </div>
                                                                                            <div className="flex gap-0.5">
                                                                                                <h6 className={`${typePageMoblie ? "text-[8px]" : "text-[10px]"} text-[#9295A4]`}>
                                                                                                    Date:
                                                                                                </h6>{" "}
                                                                                                <h6 className={`${typePageMoblie ? "text-[8px]" : "text-[10px]"} text-[#9295A4] px-2 w-[full] text-left`}>
                                                                                                    {e?.expiration_date ? formatMoment(e?.expiration_date, FORMAT_MOMENT.DATE_SLASH_LONG) : "-"}
                                                                                                </h6>
                                                                                            </div>
                                                                                        </>
                                                                                    )}
                                                                                </div>
                                                                            )
                                                                        }
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </>
    )
}



export default TabInFormation;
