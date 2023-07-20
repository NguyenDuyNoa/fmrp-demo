import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import Popup from "reactjs-popup";
import { Tooltip } from "react-tippy";

import { Lexend_Deca } from "@next/font/google";
import { useSelector } from "react-redux";
const deca = Lexend_Deca({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});
const Dropdown = (props) => {
  return (
    <div className="">
      <Popup
        trigger={
          <button
            className={`text-slate-200 3xl:text-[18px] 2xl:text-[14px] xl:text-[12px] lg:text-[10px]  hover:text-white hover:drop-shadow-[0_0_5px_#eabd7a99] 
              `}
          >
            {props.children}
          </button>
        }
        closeOnDocumentClick
        arrow={props.position}
        on={["hover"]}
        position={props.position}
        className={`popover-edit -translate-y-10 ` + props.className}
      >
        <div className={`w-auto ${deca.className}`}>
          <div className="bg-white 2xl:py-2 lg:py-0.5 px-0.5 rounded-lg justify-between flex divide-x divide-[#DDDDE2]">
            {props.data?.map((e, i) => (
              <div
                className={`${
                  e.title
                    ? "3xl:px-6 3xl:py-3 2xl:px-3 2xl:py-1 xl:px-0.5 xl:py-0.5 lg:px-0.5 lg:py-0.5"
                    : "px-1"
                } 2xl:space-y-2 lg:space-y-1 min-w-[200px]`}
                key={i}
              >
                {e.title && (
                  <h3 className="3xl:text-[22px] 2xl:text-[20px] xl:text-[18px] lg:text-[18px] font-medium px-3">
                    {e.title}
                  </h3>
                )}
                {e.sub?.map((ce, ci) => (
                  <div className="space-y-0.5" key={ci}>
                    {ce.link ? (
                      <Link
                        title={ce.title}
                        href={ce.link}
                        className="flex items-center 2xl:space-x-2 2xl:mb-2 2xl:px-3 2xl:py-2 xl:space-x-1 xl:mb-2 xl:px-3 xl:py-1 lg:space-x-1 lg:mb-1 lg:px-1 lg:py-1 rounded hover:bg-[#ececee87] text-[#344054]"
                      >
                        {ce?.img ? (
                          <React.Fragment>
                            <Image
                              alt={ce.title}
                              src={ce?.img}
                              width={24}
                              height={24}
                              quality={100}
                              className="object-contain"
                              loading="lazy"
                              crossOrigin="anonymous"
                              placeholder="blur"
                              blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                            />
                            <h5 className="uppercase 3xl:text-base 2xl:text-[14px] xl:text-[10px] lg:text-[10px]">
                              {ce.title}
                            </h5>
                          </React.Fragment>
                        ) : (
                          <li className="3xl:text-base 2xl:text-[14px] xl:text-[12px] lg:text-[10px] text-[#344054] marker:text-[#9295A4] outline-none">
                            {ce.title}
                          </li>
                        )}
                      </Link>
                    ) : (
                      <React.Fragment>
                        {ce.title && (
                          <div className="flex items-center space-x-2 mb-2 px-3">
                            <Image
                              alt={ce.title}
                              src={ce?.img}
                              width={24}
                              height={24}
                              quality={100}
                              className="object-contain"
                              loading="lazy"
                              crossOrigin="anonymous"
                              placeholder="blur"
                              blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                            />
                            <h5 className="uppercase text-[#141522] 3xl:text-base 2xl:text-[14px] xl:text-[10px] lg:text-[10px]">
                              {ce.title}
                            </h5>
                          </div>
                        )}
                      </React.Fragment>
                    )}
                    {ce.items?.map((e, i) => (
                      <Link
                        href={e.link ? e.link : "#"}
                        title={e.name}
                        className="outline-none"
                        key={i}
                      >
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
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </Popup>
    </div>
  );
};

const ZoomableElement = (props) => {
  const [isZoomed, setIsZoomed] = useState(false);

  const handleClick = () => {
    setIsZoomed(true);

    setTimeout(() => {
      setIsZoomed(false);
    }, 200);
  };

  const zoomedStyle = {
    transform: isZoomed ? "scale(1.1)" : "scale(1)",
    transition: "transform 0.2s",
    willChange: "transform",
  };
  return (
    <div style={zoomedStyle} onClick={handleClick}>
      <li className="3xl:text-base 2xl:text-[14px] xl:text-[12px] lg:text-[10px] text-[#344054] focus:transform-gpu marker:text-[#9295A4] px-3 py-2 rounded hover:bg-[#ececee87]">
        {props?.name}
      </li>
    </div>
  );
};
export default Dropdown;
