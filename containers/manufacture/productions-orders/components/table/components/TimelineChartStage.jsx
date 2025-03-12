// import { FORMAT_MOMENT } from "@/constants/formatDate/formatDate";
// import useSetingServer from '@/hooks/useConfigNumber';
// import { formatMoment } from "@/utils/helpers/formatMoment";
// import * as d3 from "d3";
// import { useEffect, useRef, useState } from 'react';
// import formatNumberConfig from "@/utils/helpers/formatnumber";

// const TimelineChartStage = ({ data, dataLang }) => {
//     const dataSeting = useSetingServer();

//     const formatNumber = (num) => formatNumberConfig(+num, dataSeting);

//     const getColor = (item) => {
//         if (item?.active) return "#008000"; // Màu xanh khi active
//         if (item?.begin_production == "1") return "#FF8F0D"; // Màu cam khi bắt đầu sản xuất
//         return "gray"; // Màu xám mặc định
//     };

//     const svgRef = useRef();

//     const containerRef = useRef();

//     const [width, setWidth] = useState(0);

//     useEffect(() => {
//         if (!data || data.length === 0) return;

//         const containerWidth = containerRef.current ? containerRef.current.offsetWidth : 0;

//         setWidth(containerWidth);

//         const svg = d3.select(svgRef.current);

//         svg.selectAll("*").remove(); // Xóa nội dung cũ nếu có

//         const height = 90; // Chiều cao tổng thể

//         const circleRadius = 4; // Kích thước ô tròn

//         const margin = { left: 20, right: 20 };

//         if (containerWidth === 0) return;

//         // Tạo thang đo X để định vị các ô tròn
//         const xScale = d3.scalePoint()
//             .domain(data.map(d => d.title)) // Dựa trên tiêu đề
//             .range([margin.left, containerWidth - margin.right])
//             .padding(0.5);

//         // Vẽ các đường nối giữa các ô tròn
//         svg.selectAll(".timeline-line")
//             .data(data.slice(0, -1)) // Không cần nối đường cho phần tử cuối
//             .enter()
//             .append("line")
//             .attr("x1", d => xScale(d.title) + circleRadius) // Bắt đầu từ mép phải của đường tròn
//             .attr("y1", height / 2)
//             .attr("x2", (d, i) => xScale(data[i + 1].title) - circleRadius) // Kết thúc tại mép trái của đường tròn tiếp theo
//             .attr("y2", height / 2)
//             .attr("stroke", d => getColor(d))
//             // .attr("stroke", (d, i) => getColor(data[i + 1]))
//             .attr("stroke-width", 1.5);

//         // Vẽ các điểm tròn trên timeline
//         svg.selectAll(".circle")
//             .data(data)
//             .enter()
//             .append("circle")
//             .attr("cx", d => xScale(d.title))
//             .attr("cy", height / 2)
//             .attr("r", circleRadius)
//             .attr("fill", d => getColor(d))
//         // .attr("stroke", "#fff")
//         // .attr("stroke-width", 2);

//         // Thêm ngày lên trên ô tròn
//         svg.selectAll(".date-label")
//             .data(data)
//             .enter()
//             .append("text")
//             .attr("x", d => xScale(d.title))
//             .attr("y", height / 2 - 15)
//             .attr("text-anchor", "middle")
//             .style("font-weight", "600")
//             .attr("fill", d => getColor(d))
//             .attr("font-size", "10px")
//             .text(d => {
//                 if (d?.active) {
//                     return d?.date ? formatMoment(d?.date, FORMAT_MOMENT.DATE_SLASH_LONG) : ""
//                 }
//                 else if (d?.begin_production == "1") {
//                     return d?.date_production ? formatMoment(d?.date_production, FORMAT_MOMENT.DATE_SLASH_LONG) : ""

//                 }
//             });

//         // Thêm tên dưới ô tròn
//         svg.selectAll(".title-label")
//             .data(data)
//             .enter()
//             .append("text")
//             .attr("x", d => xScale(d.title))
//             .attr("y", height / 2 + 20)
//             .attr("text-anchor", "middle")
//             .style("font-weight", "600")
//             .attr("fill", d => getColor(d))
//             .attr("font-size", "11px")
//             .text(d => d.title);

//         // Thêm số lượng dưới tên
//         svg.selectAll(".quantity-label")
//             .data(data)
//             .enter()
//             .append("text")
//             .attr("x", d => xScale(d.title))
//             .attr("y", height / 2 + 35)
//             .attr("text-anchor", "middle")
//             .style("font-weight", "600")
//             .attr("fill", d => getColor(d))
//             .attr("font-size", "10px")
//             .text(d => d.dtPurchaseProduct?.quantity > 0 ? `SL: ${formatNumber(d.dtPurchaseProduct?.quantity)}` : "");

//         // Thêm số lương dưới số lượng
//         svg.selectAll(".salary-label")
//             .data(data)
//             .enter()
//             .append("text")
//             .attr("x", d => xScale(d.title))
//             .attr("y", height / 2 + 50) // Khoảng cách lớn hơn số lượng
//             .attr("text-anchor", "middle")
//             .style("font-weight", "600")
//             .attr("fill", d => '#ff0000')
//             .attr("font-size", "10px")
//             .text(d => d.dtPurchaseProduct?.quantity_error > 0 ? `SL lỗi: ${formatNumber(d.dtPurchaseProduct?.quantity_error)}` : '');

//     }, [data, width, dataLang]);

//     return (
//         <div ref={containerRef} className="w-full">
//             <svg ref={svgRef} width="100%" height={120}></svg>
//         </div>
//     );
// }

// export default TimelineChartStage
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { formatMoment } from "@/utils/helpers/formatMoment";
import formatNumberConfig from "@/utils/helpers/formatnumber";
import useSetingServer from "@/hooks/useConfigNumber";
import { FORMAT_MOMENT } from "@/constants/formatDate/formatDate";

const TimelineChartStage = ({ data, dataLang, typePageMoblie }) => {
    const dataSeting = useSetingServer();
    const formatNumber = (num) => formatNumberConfig(+num, dataSeting);

    const getColor = (item) => {
        if (item?.active) return "#008000"; // Xanh khi active
        if (item?.begin_production == "1") return "#FF8F0D"; // Cam khi bắt đầu sản xuất
        return "gray"; // Xám mặc định
    };

    const svgRef = useRef();
    const containerRef = useRef();

    const [width, setWidth] = useState(0);

    const [height, setHeight] = useState(0); // Chiều cao tự động

    useEffect(() => {
        if (!data || data.length === 0) return;

        const containerWidth = containerRef.current ? containerRef.current.offsetWidth : 0;
        setWidth(containerWidth);

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove(); // Xóa nội dung cũ nếu có

        // const dynamicHeight = Math.max(data.length * (20) - 30, 50);
        const additionalHeight = data.length * 25; // Mỗi mục cách nhau 25px
        const dynamicHeight = additionalHeight; // Loại bỏ baseHeight, chỉ dựa vào số lượng dữ liệu
        setHeight(dynamicHeight); // Cập nhật chiều cao động

        const circleRadius = 4;
        const margin = { left: 20, right: 20 };

        if (containerWidth === 0) return;

        // Tạo thang đo X
        const xScale = d3.scalePoint()
            .domain(data.map(d => d.title))
            .range([margin.left, containerWidth - margin.right])
            .padding(0.5);

        // Vẽ các đường nối
        svg.selectAll(".timeline-line")
            .data(data.slice(0, -1))
            .enter()
            .append("line")
            .attr("x1", d => xScale(d.title) + circleRadius)
            .attr("y1", dynamicHeight / 2)
            .attr("x2", (d, i) => xScale(data[i + 1].title) - circleRadius)
            .attr("y2", dynamicHeight / 2)
            .attr("stroke", d => getColor(d))
            .attr("stroke-width", 1.5);

        // Vẽ các điểm tròn
        svg.selectAll(".circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => xScale(d.title))
            .attr("cy", dynamicHeight / 2)
            .attr("r", circleRadius)
            .attr("fill", d => getColor(d));

        // Thêm ngày
        svg.selectAll(".date-label")
            .data(data)
            .enter()
            .append("text")
            .attr("x", d => xScale(d.title))
            .attr("y", dynamicHeight / 2 - (typePageMoblie ? 10 : 15))
            .attr("text-anchor", "middle")
            .style("font-weight", "600")
            .attr("fill", d => getColor(d))
            .attr("font-size", typePageMoblie ? "7px" : "10px")
            .text(d => d?.date ? formatMoment(d?.date, FORMAT_MOMENT.DATE_SLASH_LONG) : "");

        // Thêm tên
        svg.selectAll(".title-label")
            .data(data)
            .enter()
            .append("text")
            .attr("x", d => xScale(d.title))
            .attr("y", dynamicHeight / 2 + (typePageMoblie ? 15 : 20))
            .attr("text-anchor", "middle")
            .style("font-weight", "600")
            .attr("fill", d => getColor(d))
            .attr("font-size", typePageMoblie ? "7px" : "11px")
            .text(d => d.title);

        // Thêm số lượng
        svg.selectAll(".quantity-label")
            .data(data)
            .enter()
            .append("text")
            .attr("x", d => xScale(d.title))
            .attr("y", dynamicHeight / 2 + (typePageMoblie ? 23 : 35))
            .attr("text-anchor", "middle")
            .style("font-weight", "600")
            .attr("fill", d => getColor(d))
            .attr("font-size", typePageMoblie ? "7px" : "10px")
            .text(d => d.dtPurchaseProduct?.quantity > 0 ? `SL: ${formatNumber(d.dtPurchaseProduct?.quantity)}` : "");

        // Thêm số lỗi
        svg.selectAll(".salary-label")
            .data(data)
            .enter()
            .append("text")
            .attr("x", d => xScale(d.title))
            .attr("y", dynamicHeight / 2 + (typePageMoblie ? 45 : 50))
            .attr("text-anchor", "middle")
            .style("font-weight", "600")
            .attr("fill", '#ff0000')
            .attr("font-size", typePageMoblie ? "7px" : "10px")
            .text(d => d.dtPurchaseProduct?.quantity_error > 0 ? `SL lỗi: ${formatNumber(d.dtPurchaseProduct?.quantity_error)}` : ``);
    }, [data, width, dataLang]);

    // useEffect(() => {
    //     if (!data || data.length === 0) return;

    //     const containerWidth = containerRef.current ? containerRef.current.offsetWidth : 0;
    //     setWidth(containerWidth);

    //     const svg = d3.select(svgRef.current);
    //     svg.selectAll("*").remove(); // Xóa nội dung cũ nếu có

    //     const baseHeight = 90; // Chiều cao tối thiểu
    //     const additionalHeight = data.length * 25; // Mỗi mục cách nhau 25px
    //     const dynamicHeight = Math.max(baseHeight, additionalHeight);
    //     setHeight(dynamicHeight); // Cập nhật chiều cao động

    //     const circleRadius = 4;
    //     const margin = { left: 20, right: 20 };

    //     if (containerWidth === 0) return;

    //     // Tạo thang đo X
    //     const xScale = d3.scalePoint()
    //         .domain(data.map(d => d.title))
    //         .range([margin.left, containerWidth - margin.right])
    //         .padding(0.5);

    //     // Vẽ các đường nối
    //     svg.selectAll(".timeline-line")
    //         .data(data.slice(0, -1))
    //         .enter()
    //         .append("line")
    //         .attr("x1", d => xScale(d.title) + circleRadius)
    //         .attr("y1", dynamicHeight / 2)
    //         .attr("x2", (d, i) => xScale(data[i + 1].title) - circleRadius)
    //         .attr("y2", dynamicHeight / 2)
    //         .attr("stroke", d => getColor(d))
    //         .attr("stroke-width", 1.5);

    //     // Vẽ các điểm tròn
    //     svg.selectAll(".circle")
    //         .data(data)
    //         .enter()
    //         .append("circle")
    //         .attr("cx", d => xScale(d.title))
    //         .attr("cy", dynamicHeight / 2)
    //         .attr("r", circleRadius)
    //         .attr("fill", d => getColor(d));

    //     // Thêm ngày
    //     svg.selectAll(".date-label")
    //         .data(data)
    //         .enter()
    //         .append("text")
    //         .attr("x", d => xScale(d.title))
    //         .attr("y", dynamicHeight / 2 - 15)
    //         .attr("text-anchor", "middle")
    //         .style("font-weight", "600")
    //         .attr("fill", d => getColor(d))
    //         .attr("font-size", "10px")
    //         .text(d => d?.date ? formatMoment(d?.date, FORMAT_MOMENT.DATE_SLASH_LONG) : "");

    //     // Thêm tên
    //     svg.selectAll(".title-label")
    //         .data(data)
    //         .enter()
    //         .append("text")
    //         .attr("x", d => xScale(d.title))
    //         .attr("y", dynamicHeight / 2 + 20)
    //         .attr("text-anchor", "middle")
    //         .style("font-weight", "600")
    //         .attr("fill", d => getColor(d))
    //         .attr("font-size", "11px")
    //         .text(d => d.title);

    //     // Thêm số lượng
    //     svg.selectAll(".quantity-label")
    //         .data(data)
    //         .enter()
    //         .append("text")
    //         .attr("x", d => xScale(d.title))
    //         .attr("y", dynamicHeight / 2 + 35)
    //         .attr("text-anchor", "middle")
    //         .style("font-weight", "600")
    //         .attr("fill", d => getColor(d))
    //         .attr("font-size", "10px")
    //         .text(d => d.dtPurchaseProduct?.quantity > 0 ? `SL: ${formatNumber(d.dtPurchaseProduct?.quantity)}` : "");

    //     // Thêm số lỗi
    //     svg.selectAll(".salary-label")
    //         .data(data)
    //         .enter()
    //         .append("text")
    //         .attr("x", d => xScale(d.title))
    //         .attr("y", dynamicHeight / 2 + 50)
    //         .attr("text-anchor", "middle")
    //         .style("font-weight", "600")
    //         .attr("fill", '#ff0000')
    //         .attr("font-size", "10px")
    //         .text(d => d.dtPurchaseProduct?.quantity_error > 0 ? `SL lỗi: ${formatNumber(d.dtPurchaseProduct?.quantity_error)}` : '');

    // }, [data, width, dataLang]);

    return (
        <div ref={containerRef} className="w-full">
            <svg ref={svgRef} width="100%" height={typePageMoblie ? (height) : height}></svg>
        </div>
    );
};

export default TimelineChartStage;


// import { useEffect, useRef, useState } from "react";
// import * as d3 from "d3";
// import { formatMoment } from "@/utils/helpers/formatMoment";
// import formatNumberConfig from "@/utils/helpers/formatnumber";
// import useSetingServer from "@/hooks/useConfigNumber";
// import { FORMAT_MOMENT } from "@/constants/formatDate/formatDate";

// const TimelineChartStage = ({ data, dataLang, typePageMoblie }) => {
//     const dataSeting = useSetingServer();
//     const formatNumber = (num) => formatNumberConfig(+num, dataSeting);

//     const getColor = (item) => {
//         if (item?.active) return "#008000";
//         if (item?.begin_production == "1") return "#FF8F0D";
//         return "gray";
//     };

//     const svgRef = useRef();
//     const containerRef = useRef();

//     const [width, setWidth] = useState(0);
//     const [height, setHeight] = useState(0);

//     useEffect(() => {
//         if (!data || data.length === 0) return;

//         const containerWidth = containerRef.current ? containerRef.current.offsetWidth : 0;
//         const minChartWidth = data.length * 100; // Đảm bảo đủ không gian nếu có nhiều điểm
//         const dynamicWidth = Math.max(containerWidth, minChartWidth);
//         setWidth(dynamicWidth);

//         // Tính chiều cao tự động, thêm padding để tránh quá rộng
//         if (typePageMoblie) {
//             const calculatedHeight = Math.max(data.length * (20) - 30, 50);
//             setHeight(calculatedHeight);
//         } else {
//             const additionalHeight = data.length * 25; // Mỗi mục cách nhau 25px
//             const dynamicHeight = additionalHeight; // Loại bỏ baseHeight, chỉ dựa vào số lượng dữ liệu
//             setHeight(120); // Cập nhật chiều cao động
//         }

//         const svg = d3.select(svgRef.current);
//         svg.selectAll("*").remove();

//         const circleRadius = 4;
//         const margin = { left: 20, right: 20 };
//         const yBase = 20; // Đẩy toàn bộ nội dung lên trên

//         if (containerWidth === 0) return;

//         // Tạo thang đo X với kích thước linh hoạt
//         const xScale = d3.scalePoint()
//             .domain(data.map(d => d.title))
//             .range([margin.left, dynamicWidth - margin.right])
//             .padding(0.5);

//         // Vẽ các đường nối
//         svg.selectAll(".timeline-line")
//             .data(data.slice(0, -1))
//             .enter()
//             .append("line")
//             .attr("x1", d => xScale(d.title) + circleRadius)
//             .attr("y1", yBase)
//             .attr("x2", (d, i) => xScale(data[i + 1].title) - circleRadius)
//             .attr("y2", yBase)
//             .attr("stroke", d => getColor(d))
//             .attr("stroke-width", 1.5);

//         // Vẽ các điểm tròn
//         svg.selectAll(".circle")
//             .data(data)
//             .enter()
//             .append("circle")
//             .attr("cx", d => xScale(d.title))
//             .attr("cy", yBase)
//             .attr("r", circleRadius)
//             .attr("fill", d => getColor(d));

//         // Thêm nhãn ngày
//         svg.selectAll(".date-label")
//             .data(data)
//             .enter()
//             .append("text")
//             .attr("x", d => xScale(d.title))
//             .attr("y", yBase - (typePageMoblie ? 8 : 12)) // Đẩy lên trên
//             .attr("text-anchor", "middle")
//             .style("font-weight", "600")
//             .attr("fill", d => getColor(d))
//             .attr("font-size", typePageMoblie ? '6px' : "10px")
//             .text(d => d?.date ? formatMoment(d?.date, FORMAT_MOMENT.DATE_SLASH_LONG) : "");

//         // Thêm tên
//         svg.selectAll(".title-label")
//             .data(data)
//             .enter()
//             .append("text")
//             .attr("x", d => xScale(d.title))
//             .attr("y", yBase + (typePageMoblie ? 10 : 14)) // Đẩy lên cao hơn
//             .attr("text-anchor", "middle")
//             .style("font-weight", "600")
//             .attr("fill", d => getColor(d))
//             .attr("font-size", typePageMoblie ? '6.5px' : "11px")
//             .text(d => d.title);

//         // Thêm số lượng
//         svg.selectAll(".quantity-label")
//             .data(data)
//             .enter()
//             .append("text")
//             .attr("x", d => xScale(d.title))
//             .attr("y", yBase + (typePageMoblie ? 18 : 22)) // Đẩy lên gần hơn
//             .attr("text-anchor", "middle")
//             .style("font-weight", "600")
//             .attr("fill", d => getColor(d))
//             .attr("font-size", typePageMoblie ? '6px' : "10px")
//             .text(d => d.dtPurchaseProduct?.quantity > 0 ? `SL: ${formatNumber(d.dtPurchaseProduct?.quantity)}` : "");

//         // Thêm số lỗi
//         !typePageMoblie && svg.selectAll(".salary-label")
//             .data(data)
//             .enter()
//             .append("text")
//             .attr("x", d => xScale(d.title))
//             .attr("y", yBase + (typePageMoblie ? 28 : 30)) // Đẩy lên gần hơn
//             .attr("text-anchor", "middle")
//             .style("font-weight", "600")
//             .attr("fill", '#ff0000')
//             .attr("font-size", typePageMoblie ? '6px' : "10px")
//             .text(d => d.dtPurchaseProduct?.quantity_error > 0 ? `SL lỗi: ${formatNumber(d.dtPurchaseProduct?.quantity_error)}` : ``);
//         // .text(d => d.dtPurchaseProduct?.quantity_error > 0 ? `SL lỗi: ${formatNumber(d.dtPurchaseProduct?.quantity_error)}` : '');
//     }, [data, dataLang]);

//     return (
//         <div ref={containerRef} className="w-full overflow-x-auto">
//             <svg
//                 ref={svgRef}
//                 width={width}
//                 // height={height}
//                 viewBox={`0 0 ${width} ${height}`} // Giữ chiều cao động
//                 preserveAspectRatio="xMinYMin meet"
//             />
//         </div>
//     );
// };

// export default TimelineChartStage;
