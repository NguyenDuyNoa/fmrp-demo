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
    return <span className={`${className} font-normal 3xl:text-[11px] 2xl:text-[9px] xl:text-[8px] text-[7px] text-sky-500  rounded-xl 3xl:py-0 py-0.5 px-3  w-fit bg-sky-200`}>
        {name}
    </span>
}

const TagColorOrange = ({ name, className, ...props }) => {
    return <span {...props} className={`${className} font-normal 3xl:text-[11px] 2xl:text-[9px] xl:text-[8px] text-[7px] text-orange-500 rounded-xl 3xl:py-0 py-0.5 px-3  w-fit bg-orange-200`}>
        {name}
    </span>
}

const TagColorLime = ({ name, className }) => {
    return <span className={`${className} flex 3xl:text-[11px] 2xl:text-[9px] xl:text-[8px] text-[7px] items-center gap-1 font-normal text-lime-500  rounded-xl 3xl:py-0 py-0.5 px-3  w-fit bg-lime-200`}>
        <TickCircle
            className="rounded-full bg-lime-500"
            color="white"
            size={15}
        />
        {name}
    </span>
}

const TagColorRed = ({ name, className }) => {
    return <span className={`${className} font-normal 3xl:text-[11px] 2xl:text-[9px] xl:text-[8px] text-[7px] text-red-500 rounded-xl 3xl:py-0 py-0.5 px-3  w-fit bg-red-200`}>
        {name}
    </span>
}

const TagColorMore = ({ name, className, backgroundColor, color }) => {
    return <span
        style={{
            backgroundColor: backgroundColor,
            color: color
        }}
        className={`${className} font-normal 3xl:text-[11px] 2xl:text-[9px] xl:text-[8px] text-[7px] rounded-xl 3xl:py-0 py-0.5 px-3  w-fit `}>
        {name}
    </span>
}

export { TagColorSky, TagColorOrange, TagColorLime, TagColorRed, TagColorMore, TagColorProduct }