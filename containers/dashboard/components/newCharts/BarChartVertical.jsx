import CalendarDropdown, {
  timeRanges,
} from "@/components/common/dropdown/CalendarDropdown";
import Loading from "@/components/UI/loading/loading";
import NoData from "@/components/UI/noData/nodata";
import { useGetProductionPlan } from "@/hooks/dashboard/useGetProductionPlan";
import { handleTicksBarChart } from "@/utils/helpers/deviceTicksChart";
import { getDateRangeFromValue } from "@/utils/helpers/getDateRange";
import React, { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white text-typo-black-1 px-3 py-2 rounded-lg text-sm font-medium shadow-md">
        <p className="mb-1">{`${label}`}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value} cái`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const BarChartVertical = () => {
  const [productPlan, setProductPlan] = useState();
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [date, setDate] = useState(timeRanges[4]);
  const [ticks, setTicks] = useState([0, 25, 50, 75, 100]);

  const wrapText = ({ text, maxCharsPerLine = 10, maxLines = 2 }) => {
    let lines = [];
    for (let i = 0; i < maxLines; i++) {
      const start = i * maxCharsPerLine;
      const end = start + maxCharsPerLine;

      if (i === maxLines - 1 && text.length > end) {
        // Dòng cuối: thêm dấu "…" nếu còn dư
        lines.push(text.slice(start, end) + "…");
      } else {
        lines.push(text.slice(start, end));
      }

      if (end >= text.length) break;
    }
    return lines;
  };

  const { data, isLoading } = useGetProductionPlan({
    limited: 5,
    dateEnd: dateEnd,
    dateStart: dateStart,
  });

  useEffect(() => {
    if (date) {
      const range = getDateRangeFromValue(date.value);
      setDateStart(range ? range.startDate : "");
      setDateEnd(range ? range.endDate : "");
    }
  }, [date]);

  useEffect(() => {
    if (!isLoading && data) {
      setProductPlan(data?.items);

      const allValues = data?.items?.flatMap((item) => [
        item.quantity,
        item.quantity_plan,
      ]);

      const dynamicTicks = allValues.length > 0 ? handleTicksBarChart(allValues) : [0, 25, 50, 75, 100];
      setTicks(dynamicTicks);
    }
  }, [isLoading, data]);

  return (
    <div className="xlg:p-6 p-3 rounded-2xl bg-neutral-00 w-full shadow-[0px_12px_24px_-4px_rgba(145,158,171,0.12),0px_0px_2px_0px_rgba(145,158,171,0.20)]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="capitalize text-lg font-medium text-typo-black-1">
          Kế Hoạch Sản Xuất
        </h2>
        <CalendarDropdown setState={setDate} />
      </div>

      <div className="flex items-center justify-end gap-4 mb-4 px-4">
        <div className="flex items-center gap-[10px]">
          <div className="w-[27px] h-[13px] rounded-full bg-typo-blue-4"></div>
          <span className="text-sm font-medium text-typo-gray-3">Kế hoạch</span>
        </div>
        <div className="flex items-center gap-[10px]">
          <div className="w-[27px] h-[13px] rounded-full bg-typo-green-2"></div>
          <span className="text-sm font-medium text-typo-gray-3">
            Thực hiện
          </span>
        </div>
      </div>
      {isLoading ? (
        <Loading className="h-80" color="#0f4f9e" />
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={productPlan}
            margin={{ top: 40, right: 0, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="item_name"
              axisLine={false}
              tickLine={false}
              dy={10}
              tick={(props) => {
                const { x, y, payload } = props;
                const lines = wrapText({ text: payload.value });

                return (
                  <g transform={`translate(${x},${y})`}>
                    {lines.map((line, index) => (
                      <text
                        key={index}
                        x={0}
                        y={10 + index * 12} // khoảng cách dòng
                        dy={5}
                        textAnchor="middle"
                        fill="#9295A4"
                        fontSize={12}
                      >
                        {line}
                      </text>
                    ))}
                  </g>
                );
              }}
              interval={0}
              label={{
                value: "Mặt hàng",
                position: "insideLeft",
                offset: -40,
                style: {
                  textAnchor: "middle",
                  fill: "#667085",
                  fontSize: 12,
                },
              }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              ticks={ticks}
              domain={[0, ticks[ticks.length - 1]]}
              tick={(props) => {
                const { x, y, payload } = props;
                return (
                  <g transform={`translate(${x - 10},${y})`}>
                    <text
                      x={0}
                      y={0}
                      dy={4}
                      textAnchor="end"
                      fill="#9295A4"
                      fontSize={12}
                    >
                      {payload.value}
                    </text>
                  </g>
                );
              }}
              width={60}
              dy={30}
              label={{
                value: isLoading ? "Đơn vị" : "Cái",
                position: "top",
                offset: 30,
                style: { textAnchor: "", fill: "#9295A4", fontSize: 12 },
              }}
            />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Bar
              dataKey="quantity_plan"
              fill="#0375F3"
              barSize={20}
              radius={[4, 4, 0, 0]}
              name="Kế hoạch"
              minPointSize={1}
            ></Bar>
            <Bar
              dataKey="quantity"
              fill="#1FC583"
              barSize={20}
              radius={[4, 4, 0, 0]}
              name="Thực hiện"
              minPointSize={1}
            ></Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default BarChartVertical;
