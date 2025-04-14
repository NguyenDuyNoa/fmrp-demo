import CalendarDropdown from "@/components/common/dropdown/CalendarDropdown";
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
      <div className="bg-dark-primary text-neutral-00 px-3 py-2 rounded-lg text-sm font-medium">
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

const topProductsData = [
  {
    id: 1,
    name: "Áo sơ mi dài tay",
    quantity: 100,
    percentageChange: 8.2,
    plan: 10,
  },
  {
    id: 2,
    name: "Quần tây",
    quantity: 50,
    percentageChange: -5,
    plan: 25,
  },
  {
    id: 3,
    name: "Áo hoodie",
    quantity: 60,
    percentageChange: 12,
    plan: 30,
  },
  {
    id: 4,
    name: "Đầm maxi",
    quantity: 33,
    percentageChange: 3.5,
    plan: 20,
  },
  {
    id: 5,
    name: "Áo thun cổ tròn",
    quantity: 80,
    percentageChange: 4.7,
    plan: 40,
  },
];

const BarChartVertical = () => {
  const [loading, setLoading] = useState(true);
  const [productPlan, setProductPlan] = useState();
  const [ticks, setTicks] = useState([0, 25, 50, 75, 100]);

  const handleTicksBarChart = (value) => {
    //gom value của keHoach và thucHien vao 1 bảng -> tìm giá trị lớn nhất
    const allValues = value?.flatMap((item) => [
      item.keHoach,
      item.thucHien,
    ]);
    const maxValue = Math.max(...allValues);

    // Làm tròn lên số chia hết cho 4 (tối ưu cho step tròn)
    const roundUpToNearestDivisibleBy4 = (value) => {
      // Làm tròn lên số gần nhất chia hết cho 4
      const remainder = value % 4;
      if (remainder === 0) return value;

      const next = value + (4 - remainder);
      // Nếu next không tròn đẹp (ví dụ 157 + 3 = 160, thì giữ), còn nếu là số xấu thì làm tròn lên bước 10 gần nhất
      const rounded = Math.ceil(next / 10) * 10;
      return rounded % 4 === 0 ? rounded : rounded + (4 - (rounded % 4));
    };
    const newMaxValue = roundUpToNearestDivisibleBy4(maxValue);
    const step = newMaxValue / 4;
    const dynamicTicks = Array.from({ length: 5 }, (_, i) => i * step);

    return dynamicTicks
  }

  useEffect(() => {
    setLoading(false);
    const transformedData = topProductsData.map((item) => ({
      name: item.name,
      keHoach: item.plan,
      thucHien: item.quantity,
    }));
    setProductPlan(transformedData);

    // Tìm giá trị lớn nhất giữa keHoach và thucHien
    const dynamicTicks = handleTicksBarChart(transformedData)
    setTicks(dynamicTicks);
  }, []);

  return (
    <div className="p-6 rounded-2xl bg-neutral-00 w-full shadow-[0px_12px_24px_-4px_rgba(145,158,171,0.12),0px_0px_2px_0px_rgba(145,158,171,0.20)]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="capitalize text-lg font-medium text-typo-black-1">
          Kế Hoạch Sản Xuất
        </h2>
        <CalendarDropdown
          defaultRange={{ label: "Quý này", value: "thisQuarter" }}
        />
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
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={productPlan}
          margin={{ top: 40, right: 0, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            dy={10}
            tick={(props) => {
              const { x, y, payload } = props;
              return (
                <g transform={`translate(${x},${y})`}>
                  <text
                    x={0}
                    y={10}
                    dy={4}
                    textAnchor="middle"
                    fill="#9295A4"
                    fontSize={12}
                  >
                    {payload.value}
                  </text>
                </g>
              );
            }}
            label={{
              value: "Mặt hàng",
              position: "insideLeft",
              offset: -40,
              style: { textAnchor: "middle", fill: "#667085", fontSize: 12 },
            }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            ticks={ticks}
            // domain={[0, ticks[ticks.length - 1]]}
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
              value: loading ? "Đơn vị" : "Cái",
              position: "top",
              offset: 30,
              style: { textAnchor: "", fill: "#9295A4", fontSize: 12 },
            }}
          />
          <Tooltip content={<CustomTooltip />} cursor={false} />
          <Bar
            dataKey="keHoach"
            fill="#0375F3"
            barSize={20}
            radius={[4, 4, 0, 0]}
            name="Kế hoạch"
          ></Bar>
          <Bar
            dataKey="thucHien"
            fill="#1FC583"
            barSize={20}
            radius={[4, 4, 0, 0]}
            name="Thực hiện"
          ></Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartVertical;
