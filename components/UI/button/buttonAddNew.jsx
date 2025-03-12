import React from "react";
const ButtonAddNew = ({ onClick, dataLang, ...rest }) => {
    return (
        <button
            {...rest}
            type="button"
            onClick={() => onClick()}
            className={`${rest?.className} 3xl:text-sm 2xl:text-xs xl:text-xs text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-[#003DA0] text-white rounded btn-animation hover:scale-105`}
        >
            {dataLang?.btn_new || "btn_new"}
        </button>
    );
};
export default ButtonAddNew;
