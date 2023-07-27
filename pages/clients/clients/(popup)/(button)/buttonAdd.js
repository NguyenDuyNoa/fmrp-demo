import React from "react";
import Link from "next/link";
import { IconAdd } from "iconsax-react";
const ButtoonAdd = (props) => {
  return (
    <button
      title="Thêm"
      type="button"
      onClick={props.onClick}
      className={`transition w-[48%] mt-5   min-h-[160px] h-40 rounded-[5.5px] hover:bg-blue-400 ease-linear duration-200 hover:text-white bg-slate-100 flex flex-col justify-center items-center hover:scale-[1.01]`}
    >
      {props.children}
    </button>
  );
};
export default ButtoonAdd;
