// import useSetingServer from "@/hooks/useConfigNumber";

// const DropdowLimit = ({ sLimit, limit, dataLang }) => {
//     const dataSeting = useSetingServer()

//     const data = [15, 20, 40, 60]

//     if (dataSeting?.tables_pagination_limit && !data.includes(+dataSeting.tables_pagination_limit)) {
//         // Thêm giá trị vào mảng
//         data.push(dataSeting.tables_pagination_limit);
//         // Sắp xếp mảng từ nhỏ đến lớn
//         data.sort((a, b) => a - b);
//     }

//     return (
//         <>
//             <div className="font-[300] text-slate-400 2xl:text-xs xl:text-sm text-[8px]">{dataLang?.display}</div>
//             <select
//                 value={limit}
//                 onChange={(e) => sLimit(e.target.value)}
//                 className="outline-none cursor-pointer  text-[10px] xl:text-xs 2xl:text-sm"
//             >
//                 <option className="text-[10px] xl:text-xs 2xl:text-sm cursor-pointer hidden" disabled>
//                     {limit == -1 ? "Tất cả" : limit}
//                 </option>
//                 {data?.map((e, index) => (
//                     <option key={index} className="text-[10px] xl:text-xs 2xl:text-sm !cursor-pointer" value={e}>
//                         {e}
//                     </option>
//                 ))}

//             </select>
//         </>
//     );
// };
// export default DropdowLimit;

import { useEffect, useRef, useState } from "react";
import useSetingServer from "@/hooks/useConfigNumber";

const DropdowLimit = ({ sLimit, limit, dataLang }) => {
    const dataSeting = useSetingServer();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    // Khởi tạo mảng data với giá trị mặc định
    const data = [15, 20, 40, 60];

    // Thêm tables_pagination_limit nếu cần
    if (
        dataSeting?.tables_pagination_limit &&
        !data.includes(+dataSeting.tables_pagination_limit)
    ) {
        data.push(+dataSeting.tables_pagination_limit);
        data.sort((a, b) => a - b);
    }

    // Hàm xử lý khi chọn một giá trị
    const handleSelect = (value) => {
        sLimit(value);
        setIsOpen(false);
    };

    // Đóng dropdown khi nhấp ra ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        // Thêm sự kiện lắng nghe nhấp chuột
        document.addEventListener("mousedown", handleClickOutside);

        // Dọn dẹp sự kiện khi component unmount
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="flex flex-col items-center gap-px">
            {/* Label */}
            <div className="font-[300] text-slate-400 2xl:text-xs xl:text-sm text-[8px]">
                {dataLang?.display}
            </div>

            {/* Dropdown tùy chỉnh */}
            <div className="relative" ref={dropdownRef}>
                {/* Nút hiển thị giá trị hiện tại */}
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="outline-none cursor-pointer text-[10px] xl:text-xs 2xl:text-[13px] bg-white rounded px-2 py-px hover:bg-white/70 flex items-center gap-1"
                >
                    {limit === -1 ? "Tất cả" : limit}
                    <svg
                        className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {/* Danh sách tùy chọn */}
                {isOpen && (
                    <ul className="absolute z-10 w-full mt-1 overflow-y-auto bg-white border border-gray-300 rounded shadow-lg min-w-fit max-h-40">
                        {data.map((e, index) => (
                            <li
                                key={index}
                                onClick={() => handleSelect(e)}
                                className="text-[10px] xl:text-xs 2xl:text-[13px] px-2 py-px cursor-pointer hover:bg-gray-100 text-gray-800"
                            >
                                {e}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default DropdowLimit;