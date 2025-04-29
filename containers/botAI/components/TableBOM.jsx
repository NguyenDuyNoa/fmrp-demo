import React from "react";

const TableBOM = () => {
    return (
        <div className="flex flex-col gap-y-2 mt-6">
            <p className="font-deca text-base  font-normal text-typo-black-6">
                Công Đoạn BOM
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
                            <th className="px-1 py-2 w-[20%] font-deca font-medium">
                                Công đoạn sử dụng
                            </th>
                        </tr>
                    </thead>
                    <tbody className="relative">
                        <>
                            {/* thằng cha  */}
                            <tr className="bg-white border-t text-[10px] border-collapse relative z-[2]">
                                <td className="px-1 text-center py-2 font-normal font-deca text-[10px] text-[#637381]">
                                    1
                                </td>
                                <td className="px-1 py-2">
                                    <p className="bg-[#35BD4B] bg-opacity-20 text-[#1A7526] text-xs font-medium px-[6px] py-1 rounded-[4px] w-full text-nowrap">
                                        Bán thành phẩm
                                    </p>
                                </td>
                                <td className="px-1  py-2 text-[#003DA0] font-semibold text-xs font-deca">
                                    Cổ áo
                                </td>
                                <td className="px-1 py-2 font-normal font-deca text-xs text-[#637381]">
                                    1
                                </td>
                                <td className="px-1 py-2 font-normal font-deca text-xs text-[#637381]">
                                    Cái
                                </td>
                                <td className="px-1  py-2 font-normal font-deca text-xs text-[#637381]">
                                    {" "}
                                    -{" "}
                                </td>
                                <td className="px-1  py-2 font-normal font-deca text-xs text-[#637381]">
                                    Ghép
                                </td>
                            </tr>
                            {/* bảng con */}
                            <tr className="relative z-[1]">
                                <td colSpan="7" className="p-0 relative">
                                    <div className="py-2 relative z-10 ">
                                        <div className="absolute h-[85%] w-[100px] border-l-2 border-b-2 border-[#C7C7CC] top-0 left-3 rounded-bl-lg" />
                                        <table className="min-w-full text-[10px] border-separate border-spacing-y-[2px] pr-2">
                                            <tbody>
                                                <tr className="relative">
                                                    <td className="w-[5%] relative z-0">
                                                        <div className="absolute left-3 bottom-5 h-full w-full border-l-2 border-b-2 rounded-bl-lg border-[#C7C7CC]" />
                                                    </td>
                                                    <td className="w-[20%] px-[6px] py-2 bg-white rounded-tl-lg z-[2] relative">
                                                        <p className="bg-[#FF811A] bg-opacity-15 text-[#C25705] text-[10px] font-medium px-[8px] py-[2px] rounded-[4px] w-fit text-nowrap">
                                                            Nguyên vật liệu
                                                        </p>
                                                    </td>
                                                    <td className="w-[20%] px-1 py-2 bg-white font-semibold text-[12px] text-[#003DA0] font-deca">
                                                        Vải lót
                                                    </td>
                                                    <td className="w-[10%] px-1 py-2 bg-white font-normal font-deca text-[10px] text-[#637381]">
                                                        0.1
                                                    </td>
                                                    <td className="w-[15%] px-1 py-2 bg-white font-normal font-deca text-[10px] text-[#637381]">
                                                        Mét
                                                    </td>
                                                    <td className="w-[10%] px-1 py-2 bg-white font-normal font-deca text-[10px] text-[#637381]">
                                                        5%
                                                    </td>
                                                    <td className="w-[20%] px-1 py-2 bg-white font-normal rounded-tr-lg font-deca text-[10px] text-[#637381]">
                                                        Cắt vải
                                                    </td>
                                                </tr>

                                                <tr className="relative">
                                                    <td className="w-[5%] relative z-0 px-1 py-2">
                                                        <div className="absolute left-3 bottom-5  h-full w-full border-l-2 border-b-2 rounded-bl-lg border-[#C7C7CC]"></div>
                                                    </td>
                                                    <td className="w-[20%] px-[6px]  py-2 bg-white z-[2] relative">
                                                        <p className="bg-[#FF811A] bg-opacity-15 text-[#C25705] text-[10px] font-medium px-[8px] py-[2px] rounded-[4px] w-fit text-nowrap">
                                                            Nguyên vật liệu
                                                        </p>
                                                    </td>
                                                    <td className="w-[20%] px-1 py-2 bg-white ">
                                                        <div className="flex flex-col">
                                                            <p className="font-semibold text-[12px] text-[#003DA0] font-deca">
                                                                Vải lót
                                                            </p>
                                                            <p className="font-normal text-[8px] text-[#667085] font-deca">
                                                                Cotton 65/35, khổ 1m5
                                                            </p>
                                                        </div>
                                                    </td>
                                                    <td className="w-[10%] px-1 py-2 bg-white font-normal font-deca text-[10px] text-[#637381]">
                                                        0.1
                                                    </td>
                                                    <td className="w-[15%] px-1 py-2 bg-white font-normal font-deca text-[10px] text-[#637381]">
                                                        Mét
                                                    </td>
                                                    <td className="w-[10%] px-1 py-2 bg-white font-normal font-deca text-[10px] text-[#637381]">
                                                        5%
                                                    </td>
                                                    <td className="w-[20%] px-1 py-2 bg-white  font-normal font-deca text-[10px] text-[#637381]">
                                                        Cắt vải
                                                    </td>
                                                </tr>

                                                <tr className="relative">
                                                    <td className="w-[5%] relative z-0 px-1 py-2"></td>
                                                    <td className="w-[20%] px-[6px] py-2 bg-white rounded-bl-lg z-[2] relative">
                                                        <p className="bg-[#FF811A] bg-opacity-15 text-[#C25705] text-[10px] font-medium px-[8px] py-[2px] rounded-[4px] w-fit text-nowrap">
                                                            Nguyên vật liệu
                                                        </p>
                                                    </td>
                                                    <td className="w-[20%] px-1 py-2 bg-white font-semibold text-[12px] text-[#003DA0] font-deca">
                                                        Vải lót
                                                    </td>
                                                    <td className="w-[10%] px-1 py-2 bg-white font-normal font-deca text-[10px] text-[#637381]">
                                                        0.1
                                                    </td>
                                                    <td className="w-[15%] px-1 py-2 bg-white font-normal font-deca text-[10px] text-[#637381]">
                                                        Mét
                                                    </td>
                                                    <td className="w-[10%] px-1 py-2 bg-white font-normal font-deca text-[10px] text-[#637381]">
                                                        5%
                                                    </td>
                                                    <td className="w-[20%] px-1 py-2 bg-white rounded-br-lg font-normal font-deca text-[10px] text-[#637381]">
                                                        Cắt vải
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </td>
                            </tr>

                            {/* thằng cha  */}
                            <tr className="bg-white border-t text-[10px] border-collapse relative z-[2]">
                                <td className="px-1 text-center py-2 font-normal font-deca text-[10px] text-[#637381]">
                                    1
                                </td>
                                <td className="px-1 py-2">
                                    <p className="bg-[#35BD4B] bg-opacity-20 text-[#1A7526] text-xs font-medium px-[6px] py-1 rounded-[4px] w-full text-nowrap">
                                        Bán thành phẩm
                                    </p>
                                </td>
                                <td className="px-1  py-2 text-[#003DA0] font-semibold text-sm font-deca">
                                    Cổ áo
                                </td>
                                <td className="px-1 py-2 font-normal font-deca text-xs text-[#637381]">
                                    1
                                </td>
                                <td className="px-1 py-2 font-normal font-deca text-xs text-[#637381]">
                                    Cái
                                </td>
                                <td className="px-1  py-2 font-normal font-deca text-xs text-[#637381]">
                                    {" "}
                                    -{" "}
                                </td>
                                <td className="px-1  py-2 font-normal font-deca text-xs text-[#637381]">
                                    Ghép
                                </td>
                            </tr>
                            {/* bảng con */}
                            <tr className="relative z-[1]">
                                <td colSpan="7" className="p-0 relative">
                                    <div className="py-2 relative z-10 ">
                                        <div className="absolute h-[85%] w-[100px] border-l-2 border-b-2 border-[#C7C7CC] top-0 left-3 rounded-bl-lg" />
                                        <table className="min-w-full text-[10px] border-separate border-spacing-y-[2px] pr-2">
                                            <tbody>
                                                <tr className="relative">
                                                    <td className="w-[5%] relative z-0">
                                                        <div className="absolute left-3 bottom-5 h-full w-full border-l-2 border-b-2 rounded-bl-lg border-[#C7C7CC]" />
                                                    </td>
                                                    <td className="w-[20%] px-[8px] py-2 bg-white rounded-tl-lg z-[2] relative">
                                                        <p className="bg-[#FF811A] bg-opacity-15 text-[#C25705] text-[10px] font-medium px-[8px] py-[2px] rounded-[4px] w-fit text-nowrap">
                                                            Nguyên vật liệu
                                                        </p>
                                                    </td>
                                                    <td className="w-[20%] px-1 py-2 bg-white font-semibold text-[12px] text-[#003DA0] font-deca">
                                                        Vải lót
                                                    </td>
                                                    <td className="w-[10%] px-1 py-2 bg-white font-normal font-deca text-[10px] text-[#637381]">
                                                        0.1
                                                    </td>
                                                    <td className="w-[15%] px-1 py-2 bg-white font-normal font-deca text-[10px] text-[#637381]">
                                                        Mét
                                                    </td>
                                                    <td className="w-[10%] px-1 py-2 bg-white font-normal font-deca text-[10px] text-[#637381]">
                                                        5%
                                                    </td>
                                                    <td className="w-[20%] px-1 py-2 bg-white font-normal rounded-tr-lg font-deca text-[10px] text-[#637381]">
                                                        Cắt vải
                                                    </td>
                                                </tr>

                                                <tr className="relative">
                                                    <td className="w-[5%] relative z-0 px-1 py-2">
                                                        <div className="absolute left-3 bottom-5  h-full w-full border-l-2 border-b-2 rounded-bl-lg border-[#C7C7CC]"></div>
                                                    </td>
                                                    <td className="w-[20%] px-[8px]  py-2 bg-white z-[2] relative">
                                                        <p className="bg-[#FF811A] bg-opacity-15 text-[#C25705] text-[10px] font-medium px-[8px] py-[2px] rounded-[4px] w-fit text-nowrap">
                                                            Nguyên vật liệu
                                                        </p>
                                                    </td>
                                                    <td className="w-[20%] px-1 py-2 bg-white ">
                                                        <div className="flex flex-col">
                                                            <p className="font-semibold text-[12px] text-[#003DA0] font-deca">
                                                                Vải lót
                                                            </p>
                                                            <p className="font-normal text-[8px] text-[#667085] font-deca">
                                                                Cotton 65/35, khổ 1m5
                                                            </p>
                                                        </div>
                                                    </td>
                                                    <td className="w-[10%] px-1 py-2 bg-white font-normal font-deca text-[10px] text-[#637381]">
                                                        0.1
                                                    </td>
                                                    <td className="w-[15%] px-1 py-2 bg-white font-normal font-deca text-[10px] text-[#637381]">
                                                        Mét
                                                    </td>
                                                    <td className="w-[10%] px-1 py-2 bg-white font-normal font-deca text-[10px] text-[#637381]">
                                                        5%
                                                    </td>
                                                    <td className="w-[20%] px-1 py-2 bg-white  font-normal font-deca text-[10px] text-[#637381]">
                                                        Cắt vải
                                                    </td>
                                                </tr>

                                                <tr className="relative">
                                                    <td className="w-[5%] relative z-0 px-1 py-2"></td>
                                                    <td className="w-[20%] px-[8px] py-2 bg-white rounded-bl-lg z-[2] relative">
                                                        <p className="bg-[#FF811A] bg-opacity-15 text-[#C25705] text-[10px] font-medium px-[8px] py-[2px] rounded-[4px] w-fit text-nowrap">
                                                            Nguyên vật liệu
                                                        </p>
                                                    </td>
                                                    <td className="w-[20%] px-1 py-2 bg-white font-semibold text-[12px] text-[#003DA0] font-deca">
                                                        Vải lót
                                                    </td>
                                                    <td className="w-[10%] px-1 py-2 bg-white font-normal font-deca text-[10px] text-[#637381]">
                                                        0.1
                                                    </td>
                                                    <td className="w-[15%] px-1 py-2 bg-white font-normal font-deca text-[10px] text-[#637381]">
                                                        Mét
                                                    </td>
                                                    <td className="w-[10%] px-1 py-2 bg-white font-normal font-deca text-[10px] text-[#637381]">
                                                        5%
                                                    </td>
                                                    <td className="w-[20%] px-1 py-2 bg-white rounded-br-lg font-normal font-deca text-[10px] text-[#637381]">
                                                        Cắt vải
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </td>
                            </tr>

                            <tr className="bg-white border-t text-[10px] border-collapse relative z-[2]">
                                <td className="px-1 text-center py-2 font-normal font-deca text-[10px] text-[#637381]">
                                    1
                                </td>
                                <td className="px-1 py-2">
                                    <p className="bg-[#35BD4B] bg-opacity-20 text-[#1A7526] text-xs font-medium px-[6px] py-1 rounded-[4px] w-full text-nowrap">
                                        Bán thành phẩm
                                    </p>
                                </td>
                                <td className="px-1  py-2 text-[#003DA0] font-semibold text-xs font-deca">
                                    Cổ áo
                                </td>
                                <td className="px-1 py-2 font-normal font-deca text-xs text-[#637381]">
                                    1
                                </td>
                                <td className="px-1 py-2 font-normal font-deca text-xs text-[#637381]">
                                    Cái
                                </td>
                                <td className="px-1  py-2 font-normal font-deca text-xs text-[#637381]">
                                    {" "}
                                    -{" "}
                                </td>
                                <td className="px-1  py-2 font-normal font-deca text-xs text-[#637381]">
                                    Ghép
                                </td>
                            </tr>
                            <tr className="bg-white border-t text-[10px] border-collapse relative z-[2]">
                                <td className="px-1 text-center py-2 font-normal font-deca text-[10px] text-[#637381]">
                                    1
                                </td>
                                <td className="px-1 py-2">
                                    <p className="bg-[#35BD4B] bg-opacity-20 text-[#1A7526] text-xs font-medium px-[6px] py-1 rounded-[4px] w-full text-nowrap">
                                        Bán thành phẩm
                                    </p>
                                </td>
                                <td className="px-1  py-2 text-[#003DA0] font-semibold text-xs font-deca">
                                    Cổ áo
                                </td>
                                <td className="px-1 py-2 font-normal font-deca text-xs text-[#637381]">
                                    1
                                </td>
                                <td className="px-1 py-2 font-normal font-deca text-xs text-[#637381]">
                                    Cái
                                </td>
                                <td className="px-1  py-2 font-normal font-deca text-xs text-[#637381]">
                                    {" "}
                                    -{" "}
                                </td>
                                <td className="px-1  py-2 font-normal font-deca text-xs text-[#637381]">
                                    Ghép
                                </td>
                            </tr>
                        </>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TableBOM;
