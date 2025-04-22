import Loading from "@/components/UI/loading/loading";
import React from "react";

const PopupPrintItem = ({
    dataLang,
    onCLick,
    className = "",
    disabled = false,
    isLoading = false,
    classLoading = "",
    type
}) => {
    const isDisabled = disabled || isLoading;

    return (
        <>
            {isLoading ? (
                <div className="w-full flex justify-center items-center py-4 gap-x-3">

                    <span
                        className={`${classLoading} inline-block size-6 shink animate-spin border-typo-blue-3 rounded-full border-[3px] border-solid border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]`}
                    />
                    <span className="text-base font-medium text-typo-blue-3">Loading...</span>
                </div>
            ) : (
                <div className="flex items-center justify-center my-3">
                    <button
                        onClick={() => onCLick("notPrice")}
                        className="relative hover:-translate-y-[3px] transition-all ease-linear inline-flex items-center justify-center p-0.5  mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"
                    >
                        <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                            {["payment", "receipts"].includes(type)
                                ? dataLang?.PDF_PrintOnelink || "PDF_PrintOnelink"
                                : dataLang?.option_prin_notprice ||
                                "option_prin_notprice"}
                        </span>
                    </button>
                    <button
                        onClick={() => onCLick("price")}
                        className="relative hover:-translate-y-[3px] transition-all ease-linear inline-flex items-center justify-center p-0.5  mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800"
                    >
                        <span className="relative px-8 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                            {["payment", "receipts"].includes(type)
                                ? dataLang?.PDF_PrintTwolink || "PDF_PrintTwolink"
                                : dataLang?.option_prin_price || "option_prin_price"}
                        </span>
                    </button>
                </div>
            )}
        </>
    );
};

export default PopupPrintItem;
