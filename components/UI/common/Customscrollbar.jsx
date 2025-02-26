import SimpleBar from 'simplebar-react';
import React, { forwardRef, useEffect, useRef } from "react";
import 'simplebar-react/dist/simplebar.min.css';

const SimpleBarCustom = forwardRef(({ children, ...props }, ref) => {
    const innerRef = useRef(null);

    useEffect(() => {
        if (innerRef.current && ref) {
            ref.current = innerRef.current;
        }
    }, [innerRef, ref]);

    return (
        <SimpleBar
            {...props}
            id={props.id}
            onScroll={(e) => props.onScroll(e)}
            scrollableNodeProps={{
                ref: innerRef,
                className: props?.scrollableNodePropsClassName
            }} // Gắn ref vào inner scrollable element
            style={props.style || {}}
            className={props.className}
            forceVisible={props.forceVisible ? props.forceVisible : 'y'}
        >
            {children}
        </SimpleBar>
    );
});



export const Customscrollbar = forwardRef((props, ref) => {
    return (
        <SimpleBarCustom
            {...props}
            ref={ref}
            id={props.id}
            // onScroll={props.onScroll}
            style={props.style ? props.style : {}}
            className={`${props.className ? props.className : "3xl:h-[83%]  2xl:h-[80%] xxl:h-[80%] xl:h-[81%] lg:h-[84%] pb-2"}
            overflow-y-auto overflow-x-auto`}
        // className={`${props.className ? props.className : "min:h-[200px] 3xl:h-[83%] xxl:h-[77%] 2xl:h-[79%] xl:h-[78%] lg:h-[84%] max:h-[400px] pb-2"}
        // overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100`}
        >
            {props.children}
        </SimpleBarCustom>
    )
})



