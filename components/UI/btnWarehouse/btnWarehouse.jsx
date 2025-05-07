import DropdownFilledIcon from "@/components/icons/common/DropdownFilledIcon";
import { useEffect, useRef, useState } from "react";

const ButtonWarehouse = ({ _HandleChangeInput, warehouseman_id, id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (value) => {
    const mockEvent = {
      target: {
        checked: value !== "0",
        value: value
      }
    };
    
    _HandleChangeInput(id, warehouseman_id, "browser", mockEvent);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className={`${
          warehouseman_id == "0"
            ? "bg-neutral-01 text-neutral-05 border-border-gray-1"
            : "bg-green-02 text-green-00 border-green-01"
        } 
            border rounded-lg px-3 py-2 flex items-center gap-2 hover:scale-105 ease-in-out transition-all`}
      >
        <span className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9px] lg:text-[8px] text-[8px] font-medium whitespace-nowrap">
          {warehouseman_id == "0" ? "Chưa duyệt" : "Đã duyệt"}
        </span>
        <DropdownFilledIcon
          className={`w-3 h-3 transition-transform duration-300 ${warehouseman_id == "0" ? "text-neutral-02" : "text-green-01"} ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute p-1 mt-1 min-w-[120px] w-fit bg-white rounded-xl z-[999] shadow-[0px_20px_40px_-4px_#919EAB3D,0px_0px_2px_0px_#919EAB3D]">
          <ul className="flex flex-col gap-1">
            <li
              className={`px-1.5 py-2 rounded-lg hover:bg-primary-05 3xl:text-[12px] 2xl:text-[10px] xl:text-[9px] lg:text-[8px] text-[8px] text-neutral-07 font-normal whitespace-nowrap cursor-pointer flex items-center 
                ${warehouseman_id == "0" ? "bg-primary-05" : ""}`}
              onClick={() => handleSelect("0")}
            >
              <span>Chưa duyệt</span>
              {warehouseman_id == "0" && (
                <svg
                  className="h-4 w-4 ml-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </li>
            <li
              className={`px-1.5 py-2 rounded-lg hover:bg-primary-05 3xl:text-[12px] 2xl:text-[10px] xl:text-[9px] lg:text-[8px] text-[8px] text-neutral-07 font-normal whitespace-nowrap cursor-pointer flex items-center 
                ${warehouseman_id != "0" ? "bg-primary-05" : ""}`}
              onClick={() => handleSelect("1")}
            >
              <span>Đã duyệt</span>
              {warehouseman_id != "0" && (
                <svg
                  className="h-4 w-4 ml-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ButtonWarehouse;
