import React from "react";
import { useRouter } from "next/router";
import { ArrowCircleDown } from "iconsax-react";

const TabClient = React.memo((props) => {
  const router = useRouter();
  return (
    <button
      style={props.style}
      onClick={props.onClick}
      className={`${props.className} justify-center min-w-[220px] flex gap-2 items-center rounded-[5.5px] px-4 py-2 outline-none relative `}
    >
      {router.query?.tab === `${props.active}` && (
        <ArrowCircleDown size="20" color="#0F4F9E" />
      )}
      {props.children}
      <span
        className={`${
          props?.total > 0 &&
          "absolute min-w-[29px] top-0 right-0 bg-[#ff6f00] text-xs translate-x-2.5 -translate-y-2 text-white rounded-[100%] px-2 text-center items-center flex justify-center py-1.5"
        } `}
      >
        {props?.total > 0 && props?.total}
      </span>
    </button>
  );
});
export default TabClient;
