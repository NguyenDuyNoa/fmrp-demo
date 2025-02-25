import React from "react";

import ReactLoading from "react-loading";

export default function Loading(props) {
    return (
        <div
            className={
                "relative bg-slate-50/50 w-full 3xl:h-[516px] 2xl:h-[356px] xl:h-[286px] h-[352px] flex flex-col justify-center items-center rounded " +
                props.className
            }
        >
            {/* <p className="absolute -mt-24">Đang tải dữ liệu ...</p> */}
            {/* <ReactLoading type="cylon" color={props.color}  height={'50%'} width={'10%'} /> */}
            <img src="/loadingfinal.gif" className="3xl:h-44 h-36" />
            {/* <img src="/loadingLogo.gif.jpg" className="h-16 3xl:h-20" /> */}
        </div>
    );
}
