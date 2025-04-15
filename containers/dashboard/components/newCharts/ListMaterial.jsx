import Cardtable from "@/components/common/card/Cardtable";
import CalendarDropdown, { timeRanges } from "@/components/common/dropdown/CalendarDropdown";
import NoData from "@/components/UI/noData/nodata";
import React, { useState } from "react";

const materialsData = [
  {
    id: 1,
    name: "Chỉ cotton",
    code: "NVL_000014",
    unit: "Cuộn",
    quantity: 8,
  },
  { id: 2, name: "Vải lụa", code: "NVL_000024", unit: "Mét", quantity: 8 },
  { id: 3, name: "Vải lót", code: "NVL_000024", unit: "Mét", quantity: 8 },
  {
    id: 4,
    name: "Vải chống thấm",
    code: "NVL_000024",
    unit: "Mét",
    quantity: 8,
  },
  { id: 5, name: "Vải nỉ", code: "NVL_000024", unit: "Mét", quantity: 8 },
];

const ListMaterial = () => {
  const [materials, setMaterials] = useState(materialsData);
  const [date, setDate] = useState(timeRanges[4]);

  return (
    <div className="rounded-2xl bg-white w-full shadow-[0px_12px_24px_-4px_rgba(145,158,171,0.12),0px_0px_2px_0px_rgba(145,158,171,0.20)]">
      <div className="py-6 px-4 flex justify-between items-center">
        <h2 className="flex-1 capitalize text-lg font-medium text-typo-black-1">
          Nguyên Vật Liệu Cần Mua
        </h2>
        <CalendarDropdown setState={setDate} />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-[#F3F4F6] h-12  border-[#F3F3F4]">
            <tr>
              <th className="p-2 text-center font-semibold text-xs text-typo-gray-5">
                STT
              </th>
              <th className="p-2 text-left font-semibold text-xs text-typo-gray-5">
                Nguyên vật liệu
              </th>
              <th className="p-2 text-left font-semibold text-xs text-typo-gray-5">
                Đơn vị tính
              </th>
              <th className="p-2 text-center font-semibold text-xs text-typo-gray-5">
                Số lượng
              </th>
            </tr>
          </thead>
          {materials.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={4} className="text-center py-4">
                  <div className="flex flex-col items-center justify-center">
                    <NoData className="mt-0" type="table" />
                  </div>
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {materials.map((material) => (
                <tr key={material.id} className="border-t border-[#F3F3F4]">
                  <td className="p-2 text-center font-semibold text-sm text-typo-black-1">
                    {material.id}
                  </td>
                  <td className="py-4 px-2">
                    <Cardtable
                      code={material.code}
                      name={material.name}
                      typeTable="materials"
                      classNameImage="2xl:size-10 size-8"
                    />
                  </td>
                  <td className="p-2 font-semibold text-sm text-typo-black-1">
                    {material.unit}
                  </td>
                  <td className="p-2 text-center font-semibold text-sm text-typo-black-1">
                    {material.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
};

export default ListMaterial;
