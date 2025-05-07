import PrinterIcon from "@/components/icons/common/PrinterIcon";
import { twMerge } from "tailwind-merge";

const ButtonPrintItem = ({
  dataLang,
  onCLick,
  className = "",
  disabled = false,
  isLoading = false,
  classLoading = "",
}) => {
  const isDisabled = disabled || isLoading;

  return (
    <button
      onClick={isDisabled ? undefined : onCLick}
      disabled={isDisabled}
      className={twMerge(
        `transition-all ease-in-out flex items-center gap-2 group
        2xl:text-sm xl:text-sm text-[8px]
        rounded-lg w-fit p-1  border border-transparent hover:border-[#003DA0] hover:bg-primary-05
        ${
          isDisabled
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "hover:bg-slate-50 cursor-pointer"
        }`,
        className
      )}
    >
      {isLoading && (
        <span
          className={`${classLoading} inline-block size-4 shink animate-spin rounded-full border-[3px] border-solid border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]`}
        />
      )}
      {!isLoading && (
        <PrinterIcon color="#003DA0" className="size-5" />
        // <VscFilePdf
        //   size={20}
        //   className={twMerge(
        //     "transition-all",
        //     isDisabled
        //       ? "text-gray-400"
        //       : "group-hover:text-[#65a30d] group-hover:scale-110 group-hover:shadow-md"
        //   )}
        // />
      )}
      {/* <p
        className={isDisabled ? "text-gray-400" : "group-hover:text-[#65a30d]"}
      >
        {dataLang?.btn_table_print || "btn_table_print"}
      </p> */}
    </button>
  );
};

export default ButtonPrintItem;
