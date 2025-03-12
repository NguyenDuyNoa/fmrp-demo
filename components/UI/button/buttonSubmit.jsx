import React from "react";
import LoadingButton from "../loading/loadingButton";
const ButtonSubmit = ({ loading, dataLang, onClick, ...rest }) => {
    const title = rest?.title || dataLang?.purchase_order_purchase_save || "purchase_order_purchase_save";
    return (
        <React.Fragment>
            {!loading ? (
                <button
                    onClick={onClick}
                    type={rest?.type || 'submit'}
                    {...rest}
                    className={`${rest?.className} button text-[#FFFFFF] hover:bg-blue-500 font-normal text-base hover:scale-105 ease-in-out transition-all btn-amination py-2 px-4 rounded-[5.5px] bg-[#003DA0]`}
                >
                    {/* {dataLang?.purchase_order_purchase_save || "purchase_order_purchase_save"} */}
                    {title}
                </button>
            ) : (
                <button
                    disabled
                    type="button"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
                >

                    <LoadingButton dataLang={dataLang} />
                </button>
            )}
        </React.Fragment>
    );
};
export default ButtonSubmit;
