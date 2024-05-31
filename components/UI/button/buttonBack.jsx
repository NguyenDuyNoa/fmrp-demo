import React from "react";
const ButtonBack = ({ onClick, dataLang, ...rest }) => {
    return (
        <React.Fragment>
            <button
                onClick={() => onClick()}
                {...rest}
                className={`${rest?.className} button text-[#344054] font-normal text-base hover:bg-blue-500 hover:text-white hover:scale-105 ease-in-out transition-all btn-amination py-2 px-4 rounded-[5.5px] border border-solid border-[#D0D5DD]`}
            >
                {dataLang?.purchase_order_purchase_back || "purchase_order_purchase_back"}
            </button>
        </React.Fragment>
    );
};
export default ButtonBack;
