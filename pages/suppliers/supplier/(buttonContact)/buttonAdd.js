import { Add } from "iconsax-react";
import React from "react";
const ButtonAdd = ({ dataLang, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      title="Thêm"
      className={`transition w-[48%] mt-5   min-h-[160px] h-40 rounded-[5.5px] hover:bg-blue-400 ease-linear duration-200 hover:text-white bg-slate-100 flex flex-col justify-center items-center hover:scale-[1.01]`}
    >
      <Add />
      {dataLang?.client_popup_addcontact}
    </button>
  );
};
export default ButtonAdd;
