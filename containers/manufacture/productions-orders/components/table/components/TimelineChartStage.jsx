import { FORMAT_MOMENT } from "@/constants/formatDate/formatDate";
import useSetingServer from '@/hooks/useConfigNumber';
import { formatMoment } from "@/utils/helpers/formatMoment";
import * as d3 from "d3";
import { useEffect, useRef, useState } from 'react';
import formatNumberConfig from "@/utils/helpers/formatnumber";

const TimelineChartStage = ({ data, dataLang }) => {
    const dataSeting = useSetingServer();

    const formatNumber = (num) => formatNumberConfig(+num, dataSeting);

    const getColor = (item) => {
        if (item?.active) return "#008000"; // Màu xanh khi active
        if (item?.begin_production == "1") return "#FF8F0D"; // Màu cam khi bắt đầu sản xuất
        return "gray"; // Màu xám mặc định
    };

    const svgRef = useRef();

    const containerRef = useRef();

    const [width, setWidth] = useState(0);

    useEffect(() => {
        if (!data || data.length === 0) return;

        const containerWidth = containerRef.current ? containerRef.current.offsetWidth : 0;

        setWidth(containerWidth);

        const svg = d3.select(svgRef.current);

        svg.selectAll("*").remove(); // Xóa nội dung cũ nếu có

        const height = 90; // Chiều cao tổng thể

        const circleRadius = 4; // Kích thước ô tròn

        const margin = { left: 20, right: 20 };

        if (containerWidth === 0) return;

        // Tạo thang đo X để định vị các ô tròn
        const xScale = d3.scalePoint()
            .domain(data.map(d => d.title)) // Dựa trên tiêu đề
            .range([margin.left, containerWidth - margin.right])
            .padding(0.5);

        // Vẽ các đường nối giữa các ô tròn
        svg.selectAll(".timeline-line")
            .data(data.slice(0, -1)) // Không cần nối đường cho phần tử cuối
            .enter()
            .append("line")
            .attr("x1", d => xScale(d.title) + circleRadius) // Bắt đầu từ mép phải của đường tròn
            .attr("y1", height / 2)
            .attr("x2", (d, i) => xScale(data[i + 1].title) - circleRadius) // Kết thúc tại mép trái của đường tròn tiếp theo
            .attr("y2", height / 2)
            .attr("stroke", d => getColor(d))
            // .attr("stroke", (d, i) => getColor(data[i + 1]))
            .attr("stroke-width", 1.5);

        // Vẽ các điểm tròn trên timeline
        svg.selectAll(".circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => xScale(d.title))
            .attr("cy", height / 2)
            .attr("r", circleRadius)
            .attr("fill", d => getColor(d))
        // .attr("stroke", "#fff")
        // .attr("stroke-width", 2);

        // Thêm ngày lên trên ô tròn
        svg.selectAll(".date-label")
            .data(data)
            .enter()
            .append("text")
            .attr("x", d => xScale(d.title))
            .attr("y", height / 2 - 15)
            .attr("text-anchor", "middle")
            .style("font-weight", "600")
            .attr("fill", d => getColor(d))
            .attr("font-size", "10px")
            .text(d => {
                if (d?.active) {
                    return d?.date ? formatMoment(d?.date, FORMAT_MOMENT.DATE_SLASH_LONG) : ""
                }
                else if (d?.begin_production == "1") {
                    return d?.date_production ? formatMoment(d?.date_production, FORMAT_MOMENT.DATE_SLASH_LONG) : ""

                }
            });

        // Thêm tên dưới ô tròn
        svg.selectAll(".title-label")
            .data(data)
            .enter()
            .append("text")
            .attr("x", d => xScale(d.title))
            .attr("y", height / 2 + 20)
            .attr("text-anchor", "middle")
            .style("font-weight", "600")
            .attr("fill", d => getColor(d))
            .attr("font-size", "11px")
            .text(d => d.title);

        // Thêm số lượng dưới tên
        svg.selectAll(".quantity-label")
            .data(data)
            .enter()
            .append("text")
            .attr("x", d => xScale(d.title))
            .attr("y", height / 2 + 35)
            .attr("text-anchor", "middle")
            .style("font-weight", "600")
            .attr("fill", d => getColor(d))
            .attr("font-size", "10px")
            .text(d => d.dtPurchaseProduct?.quantity > 0 ? `SL: ${formatNumber(d.dtPurchaseProduct?.quantity)}` : "");

        // Thêm số lương dưới số lượng
        svg.selectAll(".salary-label")
            .data(data)
            .enter()
            .append("text")
            .attr("x", d => xScale(d.title))
            .attr("y", height / 2 + 50) // Khoảng cách lớn hơn số lượng
            .attr("text-anchor", "middle")
            .style("font-weight", "600")
            .attr("fill", d => '#ff0000')
            .attr("font-size", "10px")
            .text(d => d.dtPurchaseProduct?.quantity_error > 0 ? `SL lỗi: ${formatNumber(d.dtPurchaseProduct?.quantity_error)}` : '');

    }, [data, width, dataLang]);

    return (
        <div ref={containerRef} className="w-full">
            <svg ref={svgRef} width="100%" height={120}></svg>
        </div>
    );
}

export default TimelineChartStage