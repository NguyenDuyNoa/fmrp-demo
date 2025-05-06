import React, { Fragment } from "react";
import { twMerge } from "tailwind-merge";
import { IoIosCalculator } from "react-icons/io";

const findNameStepSemiProducts = ({ value, stages = [] }) => {
    const findStep = stages.find((item) => item.code === value);
    const { code, name } = findStep ?? {};
    return name;
};

const TableBOM = ({ materialsPrimary, semiProducts, stages = [] }) => {
    return (
        <div className="flex flex-col gap-y-2 mt-6">
            <p className="font-deca text-base  font-normal text-typo-black-6 flex flex-row justify-start items-center gap-x-1">
                <IoIosCalculator /> Công Đoạn BOM
            </p>

            <div className="overflow-x-auto rounded-xl border">
                <table className="min-w-full text-sm text-left border-collapse bg-[#919EAB] bg-opacity-10">
                    <thead className="bg-[#EBF5FF] text-[#141522]  text-[10px]">
                        <tr>
                            <th className="px-1 py-2 text-center w-[5%] font-deca font-medium">
                                STT
                            </th>
                            <th className="px-1 py-2 w-[20%] font-deca font-medium">Loại</th>
                            <th className="px-1 py-2 w-[20%] font-deca font-medium">
                                Tên nguyên vật liệu
                            </th>
                            <th className="px-1 py-2 w-[10%] font-deca font-medium">
                                Định mức
                            </th>
                            <th className="px-1 py-2 w-[15%] font-deca font-medium">
                                Đơn vị tính
                            </th>
                            <th className="px-[2px] py-2 w-[10%] font-deca font-medium">
                                % hao hụt
                            </th>
                            <th className="px-1 py-2 w-[20%] font-deca font-medium ">
                                Công đoạn sử dụng
                            </th>
                        </tr>
                    </thead>
                    <tbody className="relative">
                        <>
                            {semiProducts.length > 0 &&
                                semiProducts.map((item, index) => (
                                    <Fragment key={index}>
                                        {/* thằng cha  */}
                                        <tr
                                            className="bg-white border-t text-[10px] border-collapse relative z-[2] "
                                        // key={index}
                                        >
                                            <td className="px-1 text-center py-2 font-normal font-deca text-[10px] text-[#637381]">
                                                {index + 1}
                                            </td>
                                            <td className="px-1 py-2">
                                                <p className="bg-[#35BD4B] bg-opacity-20 text-[#1A7526] text-xs font-medium px-[6px] py-1 rounded-[4px] text-nowrap w-fit">
                                                    Bán thành phẩm
                                                </p>
                                            </td>
                                            <td className="px-1  py-2 text-[#003DA0] font-semibold text-xs font-deca">
                                                {item.name}
                                            </td>
                                            <td className="px-1 py-2 font-normal font-deca text-xs text-[#637381]">
                                                {item.quantity}
                                            </td>
                                            <td className="px-1 py-2 font-normal font-deca text-xs text-[#637381] uppercase">
                                                {item.unit}
                                            </td>
                                            <td className="px-1  py-2 font-normal font-deca text-xs text-[#637381]">
                                                {item.percentage_loss > 0
                                                    ? `${item.percentage_loss}%`
                                                    : " - "}
                                            </td>
                                            <td className="px-1  py-2 font-normal font-deca text-xs text-[#637381]">
                                                {item.stages.length > 0
                                                    ? item.stages[0].name
                                                    : findNameStepSemiProducts({
                                                        value: item.step,
                                                        stages,
                                                    })}
                                            </td>
                                        </tr>
                                        {/* bảng con */}
                                        {item.materials.length > 0 && (
                                            <tr className="relative z-[1]">
                                                <td colSpan="7" className="p-0 relative">
                                                    <div className="py-2 relative z-10 ">
                                                        <div
                                                            className={twMerge(
                                                                "absolute  w-[100px] border-l-2 h-[85%] border-b-2 border-[#C7C7CC] top-0 left-3 rounded-bl-lg",
                                                                item.materials.length < 2
                                                                    ? "h-[65%]"
                                                                    : "h-[80%]"
                                                            )}
                                                        />
                                                        <table className="min-w-full text-[10px] border-separate border-spacing-y-[2px] pr-2">
                                                            <tbody>
                                                                {item.materials.map((materialItem, index) => (
                                                                    <tr className="relative" key={index}>
                                                                        <td className="w-[5%] relative z-0">
                                                                            {item.materials.length - 1 !== index && (
                                                                                <div className="absolute left-3 bottom-5 h-full w-full border-l-2 border-b-2 rounded-bl-lg border-[#C7C7CC]" />
                                                                            )}
                                                                            {/* <div className="absolute left-3 bottom-5 h-full w-full border-l-2 border-b-2 rounded-bl-lg border-[#C7C7CC]" /> */}
                                                                        </td>
                                                                        <td
                                                                            className={twMerge(
                                                                                "w-[20%] px-[6px] py-2 bg-white  z-[2] relative",
                                                                                item.materials.length === 1 &&
                                                                                "rounded-bl-lg",
                                                                                index === 0
                                                                                    ? "rounded-tl-lg"
                                                                                    : item.materials.length - 1 === index
                                                                                        ? "rounded-bl-lg"
                                                                                        : " rounded-none"
                                                                            )}
                                                                        >
                                                                            <p className="bg-[#FF811A] bg-opacity-15 text-[#C25705] text-[10px] font-medium px-[8px] py-[2px] rounded-[4px] w-fit text-nowrap">
                                                                                Nguyên vật liệu
                                                                            </p>
                                                                        </td>
                                                                        <td className="w-[20%] pr-1 pl-2 py-2 bg-white font-semibold text-[12px] text-[#003DA0] font-deca">
                                                                            {materialItem.name}
                                                                        </td>
                                                                        <td className="w-[10%] pr-1 pl-2  py-2 bg-white font-normal font-deca text-[10px] text-[#637381]">
                                                                            {materialItem.quantity}
                                                                        </td>
                                                                        <td className="w-[15%] pr-1 pl-2  py-2 bg-white font-normal font-deca text-[10px] text-[#637381] uppercase">
                                                                            {materialItem.unit}
                                                                        </td>
                                                                        <td className="w-[10%] pr-1 pl-2  py-2 bg-white font-normal font-deca text-[10px] text-[#637381]">
                                                                            {materialItem.percentage_loss > 0
                                                                                ? `${materialItem.percentage_loss}%`
                                                                                : " - "}
                                                                        </td>
                                                                        <td
                                                                            className={twMerge(
                                                                                "w-[20%] pr-1 pl-[10px]  py-2 bg-white font-normal font-deca text-[10px] text-[#637381]",
                                                                                item.materials.length === 1 &&
                                                                                "rounded-br-lg ",
                                                                                index === 0
                                                                                    ? "rounded-tr-lg "
                                                                                    : item.materials.length - 1 === index
                                                                                        ? "rounded-br-lg "
                                                                                        : " rounded-none"
                                                                            )}
                                                                        >
                                                                            {findNameStepSemiProducts({
                                                                                value: materialItem.step,
                                                                                stages: item.stages,
                                                                            })}
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </Fragment>
                                ))}
                        </>
                        <>
                            {materialsPrimary.length > 0 &&
                                materialsPrimary.map((item, index) => (
                                    <tr
                                        className="bg-white border-t text-[10px] border-collapse relative z-[2] "
                                        key={index}
                                    >
                                        <td className="px-1 text-center py-2 font-normal font-deca text-[10px] text-[#637381]">
                                            {semiProducts.length + index + 1}
                                        </td>
                                        <td className="px-1 py-2">
                                            <p className="bg-[#FF811A] bg-opacity-15 text-[#C25705] text-xs font-medium px-[6px] py-1 rounded-[4px] text-nowrap w-fit">
                                                Nguyên vật liệu
                                            </p>
                                        </td>
                                        <td className="px-1  py-2 text-[#003DA0] font-semibold text-xs font-deca">
                                            {item.name}
                                        </td>
                                        <td className="px-1 py-2 font-normal font-deca text-xs text-[#637381]">
                                            {item.quantity}
                                        </td>
                                        <td className="px-1 py-2 font-normal font-deca text-xs text-[#637381] uppercase">
                                            {item.unit}
                                        </td>
                                        <td className="px-1  py-2 font-normal font-deca text-xs text-[#637381]">
                                            {item.percentage_loss > 0
                                                ? `${item.percentage_loss}%`
                                                : " - "}
                                        </td>
                                        <td className="px-1  py-2 font-normal font-deca text-xs text-[#637381]">
                                            {findNameStepSemiProducts({
                                                value: item.step,
                                                stages,
                                            })}
                                        </td>
                                    </tr>
                                ))}
                        </>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TableBOM;
