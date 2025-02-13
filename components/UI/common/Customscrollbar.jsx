import React, { forwardRef } from "react";
import SimpleBar from 'simplebar-react';
export const SimpleBarCustom = forwardRef(({ children, ...props }, ref) => {
    return (
        <SimpleBar
            scrollableNodePropsprop={{ ref: ref }}
            style={props.style ? props.style : {}}
            className={props.className}
            ref={ref}
        >
            {children}
        </SimpleBar>
    )
})
export const Customscrollbar = forwardRef((props, ref) => {
    return (
        <div
            ref={ref}
            style={props.style ? props.style : {}}
            className={`${props.className ? props.className : "min:h-[200px] 3xl:h-[83%] xxl:h-[77%] 2xl:h-[79%] xl:h-[78%] lg:h-[84%] max:h-[400px] pb-2"}
            overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100`}
        >
            {props.children}
        </div>
    )
})



