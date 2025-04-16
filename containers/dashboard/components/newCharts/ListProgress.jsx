import CalendarDropdown, {
  productionStatuses,
} from "@/components/common/dropdown/CalendarDropdown";
import { useGetProductionProgressByGroup } from "@/hooks/dashboard/useGetProductionProgressByGroup";
import { getDateRangeFromValue } from "@/utils/helpers/getDateRange";
import React, { useEffect, useState } from "react";

const ProgressItem = ({ name, quantity, percentage }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between">
        <span className="font-medium text-sm text-typo-black-4">{name}</span>
        <p className="text-sm font-semibold text-typo-black-4">
          {quantity?.toLocaleString()} cái{" "}
          <span className="text-secondary1 font-normal text-typo-gray-4">
            ({percentage <= 100 ? percentage : 100}%)
          </span>
        </p>
      </div>
      <div className="h-[8px] bg-[#919EAB1F] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#1FC583] rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

const progressData = [
  { label: "Áo sơ mi dài tay", count: 500, percentage: 25 },
  { label: "Áo sơ mi cụt tay", count: 750, percentage: 38 },
  { label: "Quần baggy", count: 200, percentage: 10 },
  { label: "Quần tây", count: 800, percentage: 40 },
  { label: "Đầm maxi", count: 150, percentage: 8 },
  { label: "Áo hoodie", count: 900, percentage: 45 },
  { label: "Áo khoác bomber", count: 300, percentage: 15 },
];

const ListProgress = () => {
  const [data, setData] = useState([]);
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [productProgress, setProductProgress] = useState([]);
  console.log("🚀 ~ ListProgress ~ productProgress:", productProgress)
  // const [status, setStatus] = useState(productionStatuses[2]);
  // const dataRange = productionStatuses
  const { data: ProductionProgress, isLoading: isLoadingProductionProgress } =
    useGetProductionProgressByGroup({ dateEnd: dateEnd, dateStart: dateStart, limited: 7 });

  useEffect(() => {
    const range = getDateRangeFromValue("thisYear");
    setDateStart(range ? range.startDate : "");
    setDateEnd(range ? range.endDate : "");
  }, []);

  useEffect(() => {
    setData(progressData);
    if (!isLoadingProductionProgress && ProductionProgress) {
      setProductProgress(ProductionProgress.items)
    }
  }, [isLoadingProductionProgress, ProductionProgress]);

  return (
    <div className="flex flex-col gap-2 w-full xlg:p-6 p-3  rounded-2xl bg-white shadow-[0px_12px_24px_-4px_rgba(145,158,171,0.12),0px_0px_2px_0px_rgba(145,158,171,0.20)]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-6">
        <h2 className="flex-1 text capitalize text-lg font-medium text-typo-black-1">
          Tiến độ sản xuất theo nhóm
        </h2>
        {/* <div className="flex justify-end w-full sm:w-fit">
          <CalendarDropdown
            dataRanges={dataRange}
            setState={setStatus}
          />
        </div> */}
      </div>

      {productProgress.length === 0 ? (
        <div className="flex flex-col gap-8">
          {[...Array(7)].map((_, index) => (
            <div key={index} className="flex flex-col gap-2">
              <div className="flex justify-between">
                <span className="font-medium text-sm text-typo-black-1">
                  Chưa có mặt hàng
                </span>
                <p className="text-sm font-semibold text-typo-black-1">-</p>
              </div>
              <div className="h-[8px] bg-[#919EAB1F] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#1FC583] rounded-full"
                  style={{ width: `0%` }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {productProgress.map((item, index) => (
            <ProgressItem
              key={index}
              name={item.name_category}
              quantity={item.quantity}
              percentage={item.pecent}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ListProgress;
