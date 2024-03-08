// SearchComponent.jsx
import React from "react";
import { SearchNormal1 } from "iconsax-react";
const SearchComponent = ({ onChange, dataLang, colSpan, classInput }) => {
    return (
        <div className="" style={{ gridColumn: `span ${colSpan || 1}` }}>
            <form className="flex items-center relative">
                <SearchNormal1 size={20} className="absolute 2xl:left-3 z-10 text-[#cccccc] xl:left-[4%] left-[1%]" />
                <input
                    className={`${classInput} relative bg-white outline-[#D0D5DD] focus:outline-[#0F4F9E] 2xl:text-left 2xl:pl-10 xl:pl-0 p-0 2xl:py-1.5 py-2.5 rounded 2xl:text-base text-xs xl:text-center text-center 2xl:w-full xl:w-full w-[100%]`}
                    type="text"
                    onChange={onChange}
                    placeholder={dataLang?.branch_search}
                />
            </form>
        </div>
    );
};

export default SearchComponent;
