import React from "react";
const ButtonAddNew = ({ onClick, dataLang, ...rest }) => {
    return (
        <React.Fragment>
            <button
                onClick={() => onClick()}
                type="button"
                {...rest}
                className={`${rest?.className} 3xl:text-sm 2xl:text-xs xl:text-xs text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105`}
            >
                {dataLang?.btn_new || "btn_new"}
            </button>
        </React.Fragment>
    );
};
export default ButtonAddNew;
