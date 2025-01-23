import React, { forwardRef } from "react";

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



