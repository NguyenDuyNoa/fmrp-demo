import { color } from "framer-motion"
import { TickCircle } from "iconsax-react"
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

export { TagColorSky, TagColorOrange, TagColorLime, TagColorRed, TagColorMore }