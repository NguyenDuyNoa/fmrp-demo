import React from "react";

import ReactLoading from "react-loading";

export default function Loading(props) {
    return (
        <div className={"relative bg-slate-50/50 w-fulll flex flex-col justify-center items-center rounded " + props.className}> 
            {/* <p className="absolute -mt-24">Đang tải dữ liệu ...</p> */}
            {/* <ReactLoading type="cylon" color={props.color}  height={'50%'} width={'10%'} /> */}
            <img src="/loadingLogo.gif.jpg" className="h-16" />
        </div>
    )
}