import { forwardRef } from "react"

export const ContainerFilterTab = forwardRef(({ children }, ref) => {
    return (
        <div
            ref={ref}
            className="flex items-center justify-start overflow-hidden overflow-y-hidden 2xl:space-x-3 lg:space-x-3 h-fit scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
            {children}
        </div>
    )
})


export const Container = ({ children, className }) => {
    return <div className={`${className} 3xl:pt-[88px] 2xl:pt-[74px] xl:pt-[60px] lg:pt-[60px] 3xl:px-6 3xl:pb-10 2xl:px-4 2xl:pb-8 xl:px-4 xl:pb-10 px-4 lg:pb-10 space-y-1 overflow-hidden h-screen`}>
        {children}
    </div>
}

export const ContainerBody = ({ children }) => {
    return (
        <div className=" gap-1 h-[100%] overflow-hidden col-span-7 flex-col justify-between">
            <div className="h-[100%] flex flex-col justify-between overflow-hidden">
                {/* <div className="col-span-7 h-[100%] flex flex-col justify-between overflow-hidden"> */}
                {children}
            </div>
        </div>
    )

}

export const ContainerTotal = ({ children, className }) => {
    return (
        <div className={`${className ? className : ""} grid grid-cols-12 bg-gray-100 items-center`}>
            {children}
        </div>
    )
}
export const ContainerTable = ({ children }) => {
    return (
        <div className="space-y-2 3xl:h-[92%] 2xl:h-[88%] xl:h-[95%] lg:h-[90%] overflow-hidden">
            {children}
        </div>
    )
}