import React from "react";
import Link from 'next/link';
import Image from "next/image";

import Popup from 'reactjs-popup';

const Dropdown = (props) => {
    return (
        <div className="">
            <Popup
                trigger={<button className={`text-slate-200 hover:text-white hover:drop-shadow-[0_0_5px_#eabd7a99]`} >{props.children}</button>}
                closeOnDocumentClick
                arrow={props.position}
                on={['hover']}
                position={props.position}
                className={`popover-edit ` + props.className}
            >
                <div className="w-auto">
                    <div className="bg-white py-2 px-0.5 rounded-t justify-between flex divide-x divide-[#DDDDE2]">
                        {props.data?.map((e, i) => 
                            <div className={`${e.title ? "px-7 py-3" : "px-1"} space-y-4 min-w-[150px]`} key={i}>
                                {e.title && <h3 className="text-[20px] font-medium px-3">{e.title}</h3>}
                                {e.sub?.map((ce, ci) => 
                                    <div className="space-y-0.5" key={ci}>
                                        {ce.link ? 
                                            <Link title={ce.title} href={ce.link} className="flex items-center space-x-2 mb-2 px-3 py-2 rounded hover:bg-[#ececee87] text-[#344054]">
                                                <Image alt={ce.title} src={ce?.img} width={18} height={18} quality={100} className="object-contain" loading="lazy" crossOrigin="anonymous" blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
                                                <h5 className="uppercase text-[14px]">{ce.title}</h5>
                                            </Link>
                                            :
                                            <React.Fragment>
                                                {ce.title &&
                                                    <div className="flex items-center space-x-2 mb-2 px-3">
                                                        <Image alt={ce.title} src={ce?.img} width={18} height={18} quality={100} className="object-contain" loading="lazy" crossOrigin="anonymous" blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
                                                        <h5 className="uppercase text-[#141522] text-[14px]">{ce.title}</h5>
                                                    </div>
                                                }
                                            </React.Fragment>
                                        }
                                        {ce.items?.map((e, i) => 
                                            <Link href={e.link ? e.link : "#"} title={e.name} className="outline-none" key={i}>
                                                {/* <a title={e.name} className="outline-none"> */}
                                                    <li className="text-[14px] text-[#344054] marker:text-[#9295A4] px-3 py-2 rounded hover:bg-[#ececee87]">
                                                        {e.name}
                                                    </li>
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

export default Dropdown;