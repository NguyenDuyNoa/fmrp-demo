import { color } from "framer-motion";
import { TickCircle } from "iconsax-react";

const TagColorProduct = ({
    dataLang,
    dataKey,
    name,
    className,
    lang = true,
    textSize,
}) => {
    const findColor = {
        0: "text-lime-500 bg-lime-100",
        1: "text-orange-500 bg-orange-100",
        2: "text-sky-500 bg-sky-100",
        3: "text-purple-500 bg-purple-100",
        4: "text-green-500 bg-green-100",
        5: "text-teal-500 bg-teal-100",
        6: "text-red-500 bg-red-100",
        7: "text-gray-500 bg-gray-100",
    };
    return (
        <span
            className={` py-0.5 px-2 rounded h-fit w-fit font-[500] break-words ${textSize ? textSize : "responsive-text-sm"
                }
                ${findColor[dataKey]} ${className}`}
        >
            {lang ? dataLang[name] || "" : name ?? ""}
        </span>
    );
};

const TagColorSky = ({ name, className }) => {
    return (
        <span
            className={`${className} font-normal responsive-text-sm text-[#C25705] bg-[#FF811A26] rounded-md py-0.5 px-1.5 2xl:py-1 2xl:px-2 w-fit`}
        >
            {name}
        </span>
    );
};

const TagColorOrange = ({ name, className, ...props }) => {
    return (
        <span
            {...props}
            className={`${className} text-center font-normal responsive-text-sm text-[#1A7526] bg-[#35BD4B33] rounded-md  py-0.5 px-1.5 2xl:py-1 2xl:px-2 w-fit`}
        >
            {name}
        </span>
    );
};

const TagColorLime = ({ name, className }) => {
    return (
        <span
            className={`${className} flex responsive-text-sm items-center gap-1 font-normal text-[#1A7526] bg-[#35BD4B33] rounded-md  py-0.5 px-1.5 2xl:py-1 2xl:px-2 w-fit`}
        >
            {/* <TickCircle
            className="rounded-md -full bg-lime-500"
            color="white"
            size={15}
        /> */}
            {name}
        </span>
    );
};

const TagColorRed = ({ name, className }) => {
    return (
        <span
            className={`${className} font-normal responsive-text-sm text-red-500 rounded-md  py-0.5 px-1.5 2xl:py-1 2xl:px-2 w-fit bg-red-200`}
        >
            {name}
        </span>
    );
};

const TagColorMore = ({ name, className, backgroundColor, color }) => {
    return (
        <span
            style={{
                backgroundColor: backgroundColor,
                color: color,
            }}
            className={`${className} font-normal responsive-text-sm rounded-md  py-0.5 px-1.5 2xl:py-1 2xl:px-2 w-fit `}
        >
            {name}
        </span>
    );
};

export {
    TagColorSky,
    TagColorOrange,
    TagColorLime,
    TagColorRed,
    TagColorMore,
    TagColorProduct,
};
