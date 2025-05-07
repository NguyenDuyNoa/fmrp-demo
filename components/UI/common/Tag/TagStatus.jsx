import { color } from "framer-motion"
import { TickCircle } from "iconsax-react"

const TagColorProduct = ({ dataLang, dataKey, name, className, lang = true, textSize }) => {
    const findColor = {
        0: "text-lime-500 bg-lime-100",
        1: "text-orange-500 bg-orange-100",
        2: "text-sky-500 bg-sky-100",
        3: "text-purple-500 bg-purple-100",
        4: "text-green-500 bg-green-100",
        5: "text-teal-500 bg-teal-100",
        6: "text-red-500 bg-red-100",
        7: "text-gray-500 bg-gray-100",
    }
    return (
        <span
            className={`${className} py-0.5 px-2 rounded-full h-fit w-fit font-[500] break-words leading-relaxed ${textSize ? textSize : "3xl:text-[13px] 2xl:text-[10px] xl:text-[9px] text-[8px]"}
                } ${findColor[dataKey]}`}
        >
            {
                lang ?
                    (dataLang[name] || "")
                    :
                    (name ?? "")
            }
        </span>
    )
}

const TagColorSky = ({ name, className }) => {
    return <span className={`${className} font-normal 3xl:text-sm 2xl:text-13 xl:text-xs text-11 text-[#C25705] bg-[#FF811A26] rounded py-0.5 px-1.5 2xl:py-1 2xl:px-2 w-fit`}>
        {name}
    </span>
}

const TagColorOrange = ({ name, className, ...props }) => {
    return <span {...props} className={`${className} text-center font-normal 3xl:text-sm 2xl:text-13 xl:text-xs text-11 text-[#1A7526] bg-[#35BD4B33] rounded py-0.5 px-1.5 2xl:py-1 2xl:px-2 w-fit`}>
        {name}
    </span>
}

const TagColorLime = ({ name, className }) => {
    return <span className={`${className} flex 3xl:text-sm 2xl:text-13 xl:text-xs text-11 items-center gap-1 font-normal text-[#1A7526] bg-[#35BD4B33] rounded py-0.5 px-1.5 2xl:py-1 2xl:px-2 w-fit`}>
        {/* <TickCircle
            className="rounded-full bg-lime-500"
            color="white"
            size={15}
        /> */}
        {name}
    </span>
}

const TagColorRed = ({ name, className }) => {
    return <span className={`${className} font-normal 3xl:text-sm 2xl:text-13 xl:text-xs text-11 text-red-500 rounded py-0.5 px-1.5 2xl:py-1 2xl:px-2 w-fit bg-red-200`}>
        {name}
    </span>
}

const TagColorMore = ({ name, className, backgroundColor, color }) => {
    return <span
        style={{
            backgroundColor: backgroundColor,
            color: color
        }}
        className={`${className} font-normal 3xl:text-sm 2xl:text-13 xl:text-xs text-11 rounded py-0.5 px-1.5 2xl:py-1 2xl:px-2 w-fit `}>
        {name}
    </span>
}

export { TagColorSky, TagColorOrange, TagColorLime, TagColorRed, TagColorMore, TagColorProduct }