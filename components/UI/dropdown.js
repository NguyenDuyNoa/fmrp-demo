import React, { useState } from "react";
import Link from 'next/link';
import Image from "next/image";

import Popup from 'reactjs-popup';
import { Lexend_Deca } from "@next/font/google";
const deca = Lexend_Deca({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700']
})

const Dropdown = (props) => {
    return (
        <div className="">
            <Popup
                trigger={<button className={`text-slate-200 2xl:text-base xl:text-sm lg:text-[12px] hover:text-white hover:drop-shadow-[0_0_5px_#eabd7a99]`} >{props.children}</button>}
                closeOnDocumentClick
                arrow={props.position}
                on={['hover']}
                position={props.position}
                className={`popover-edit ` + props.className}
            >
                <div className={`w-auto ${deca.className}`}>
                    <div className="bg-white py-2 px-0.5 rounded-t justify-between flex divide-x divide-[#DDDDE2]">
                        {props.data?.map((e, i) =>
                            <div className={`${e.title ? "px-7 py-3" : "px-1"} space-y-2 min-w-[200px]`} key={i}>
                                {e.title && <h3 className="text-[20px] font-medium px-3">{e.title}</h3>}
                                {e.sub?.map((ce, ci) =>
                                    <div className="space-y-0.5" key={ci}>
                                        {ce.link ?
                                            <Link title={ce.title} href={ce.link} className="flex items-center space-x-2 mb-2  px-3 py-2 rounded hover:bg-[#ececee87] text-[#344054]">
                                                {ce?.img ?
                                                    <React.Fragment>
                                                        <Image alt={ce.title} src={ce?.img} width={24} height={24} quality={100} className="object-contain" loading="lazy" crossOrigin="anonymous" placeholder="blur" blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
                                                        <h5 className="uppercase text-[14px]">{ce.title}</h5>
                                                    </React.Fragment>
                                                    :
                                                    <li className="text-[14px] text-[#344054] marker:text-[#9295A4] outline-none">
                                                        {ce.title}
                                                    </li>
                                                }
                                            </Link>
                                            :
                                            <React.Fragment>
                                                {ce.title &&
                                                    <div className="flex items-center space-x-2 mb-2 px-3">
                                                        <Image alt={ce.title} src={ce?.img} width={24} height={24} quality={100} className="object-contain" loading="lazy" crossOrigin="anonymous" placeholder="blur" blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
                                                        <h5 className="uppercase text-[#141522] text-[14px]">{ce.title}</h5>
                                                    </div>
                                                }
                                            </React.Fragment>
                                        }
                                        {ce.items?.map((e, i) =>
                                            <Link href={e.link ? e.link : "#"} title={e.name} className="outline-none" key={i}>
                                                {/* <a title={e.name} className="outline-none"> */}
                                                <ZoomableElement name={e?.name} />
                                                {/* <li 
                                                     style={zoomedStyle} 
                                                     onMouseDown={handleMouseDown}
                                                     onMouseUp={handleMouseUp}
                                                     onMouseEnter={handleMouseEnter}
                                                     className="text-[14px] text-[#344054] focus:transform-gpu marker:text-[#9295A4] px-3 py-2 rounded hover:bg-[#ececee87]">
                                                    {e.name}
                                                    </li> */}
                                                {/* </a> */}
                                            </Link>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </Popup>
        </div>
    );
}

const ZoomableElement = (props) => {
    const [isZoomed, setIsZoomed] = useState(false);

    const handleClick = () => {
        setIsZoomed(true);

        setTimeout(() => {
            setIsZoomed(false);
        }, 200);
    };

    const zoomedStyle = {
        transform: isZoomed ? 'scale(1.1)' : 'scale(1)',
        transition: 'transform 0.2s',
        willChange: 'transform',
    };
    return (
        <div
            style={zoomedStyle}
            onClick={handleClick}
        >
            <li className="text-[14px] text-[#344054] focus:transform-gpu marker:text-[#9295A4] px-3 py-2 rounded hover:bg-[#ececee87]">
                {props?.name}
            </li>
        </div>
    );
};
export default Dropdown;