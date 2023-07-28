import React from "react";
import Link from "next/link";
import { Trash } from "iconsax-react";
const ButtonDelete = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      title="Xóa"
      type="button"
      className="transition  w-full bg-slate-100 hover:bg-rose-500 duration-200 ease-linear  group h-10 rounded-[5.5px] text-red-500 flex flex-col justify-center items-center hover:scale-[1.01]"
    >
      <Trash className="group-hover:text-white animate-bounce transition  duration-200 ease-linea" />
    </button>
  );
};
export default ButtonDelete;
