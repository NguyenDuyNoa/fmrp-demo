import { twMerge } from "tailwind-merge";
const TagBranch = (props) => {
    return (
        <div
            key={props?.key}
            {...props}
            // className={twMerge("3xl:text-[13px] 2xl:text-[10px] xl:text-[9px] text-[8px] text-[#0F4F9E] font-[500] px-1.5 py-0.5 border  bg-[#003DA0]/10 rounded-md uppercase",
            //     props.className
            // )}
            className={twMerge(
                "3xl:text-sm 2xl:text-13 xl:text-xs text-11 font-semibold text-[#0F4F9E] px-2 py-1 border  bg-[#003DA0]/10 rounded-md ",
                props.className
            )}
        >
            {props.children}
        </div>
    );
};
export default TagBranch;
