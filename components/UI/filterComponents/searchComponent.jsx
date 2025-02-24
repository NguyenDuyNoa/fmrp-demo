// SearchComponent.jsx
import React from "react";
import { SearchNormal1 } from "iconsax-react";
const SearchComponent = ({ onChange, dataLang, colSpan, classInput, classNameBox }) => {
    return (
        <div className={`${classNameBox}`} style={{ gridColumn: `span ${colSpan || 1}` }}>
            <form className="relative flex items-center">
                <SearchNormal1 size={20} className="absolute 2xl:left-3 z-0 text-[#cccccc] xl:left-[4%] left-[1%]" />
                <input
                    className={`${classInput} relative placeholder:text-[#cbd5e1] bg-white outline-[#D0D5DD] focus:outline-[#0F4F9E] pl-10 p-0 2xl:py-1.5 py-2.5 rounded 2xl:text-base text-xs  text-start 2xl:w-full xl:w-full w-[100%]`}
                    type="text"
                    onChange={onChange}
                    placeholder={dataLang?.branch_search}
                />
            </form>
        </div>
    );
};

export default SearchComponent;
