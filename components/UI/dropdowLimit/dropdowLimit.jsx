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
import DropdownFilledIcon from "@/components/icons/common/DropdownFilledIcon";

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
    <div className="flex items-center gap-4">
      {/* Label */}
      <div className="font-normal text-neutral-02 2xl:text-xs xl:text-sm text-[8px]">
        {dataLang?.display}
      </div>

      {/* Dropdown tùy chỉnh */}
      <div className="relative" ref={dropdownRef}>
        {/* Nút hiển thị giá trị hiện tại */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`outline-none cursor-pointer text-neutral-05 text-[10px] xl:text-xs 2xl:text-base bg-white rounded-lg px-3 py-2 hover:bg-white/70 flex items-center gap-2 border transition-all duration-300 ${isOpen ? "border-[#003DA0]" : "border-border-gray-1"}`}
        >
          {limit === -1 ? "Tất cả" : limit}
          <DropdownFilledIcon
            className={`w-3 h-3 transition-transform duration-500 ${
              isOpen ? "rotate-180 text-[#003DA0]" : "text-neutral-02"
            }`}
          />
        </button>

        {/* Danh sách tùy chọn */}
        {isOpen && (
          <ul className="absolute bottom-full z-10 w-full mb-1 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg min-w-fit max-h-40">
            {data.map((e, index) => (
              <li
                key={index}
                onClick={() => handleSelect(e)}
                className="text-center text-[10px] xl:text-xs 2xl:text-base px-2 py-1 cursor-pointer hover:bg-gray-100 text-neutral-05"
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
