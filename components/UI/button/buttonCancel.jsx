import React from "react";
const ButtonCancel = ({ onClick, dataLang, ...rest }) => {
    return (
        <React.Fragment>
            <button
                onClick={() => onClick()}
                type="button"
                {...rest}
                className={`${rest?.className} button text-[#344054] font-normal text-base py-2 px-4 rounded-[5.5px] border border-solid border-[#D0D5DD] hover:scale-105 transition-all ease-linear`}
            >
                {dataLang?.branch_popup_exit}
            </button>
        </React.Fragment>
    );
};
export default ButtonCancel;
