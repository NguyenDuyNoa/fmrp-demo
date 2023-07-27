import React from "react";
import { IconDelete } from "iconsax-react";
import ButtoonDelete from "../(button)/buttonDelete";
import Link from "next/link";
const FormContactInfo = ({
  option,
  dataLang,
  _OnChangeOption,
  onDelete,
  children,
}) => {
  return (
    <div className="w-[48%] bg-white shadow-lg rounded-xl mb-2 hover:scale-[1.01] hover:shadow-2xl transition-all duration-200 ease-linear">
      <div key={option.id?.toString()}>
        <div className="w-full p-3 pt-0">
          <div className="" key={option.id?.toString()}>
            <label className="text-[#344054] font-normal text-sm mb-1 ">
              {dataLang?.client_popup_fiandlass}
            </label>
            <input
              value={option.full_name}
              onChange={_OnChangeOption.bind(this, option.id, "full_name")}
              name="optionVariant"
              type="text"
              placeholder="Họ và tên"
              className="focus:border-[#92BFF7] placeholder:text-xs border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
            />
            <label className="text-[#344054] font-normal text-sm mb-1 ">
              {dataLang?.client_popup_phone}
            </label>
            <input
              value={option.phone_number}
              onChange={_OnChangeOption.bind(this, option.id, "phone_number")}
              name="fname"
              type="number"
              placeholder="Số điện thoại"
              className="focus:border-[#92BFF7] placeholder:text-xs border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
            />
            <label className="text-[#344054] font-normal text-sm mb-1 ">
              Email
            </label>
            <input
              value={option.email}
              onChange={_OnChangeOption.bind(this, option.id, "email")}
              name="optionEmail"
              type="text"
              placeholder="Email"
              className="focus:border-[#92BFF7] placeholder:text-xs border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
            />
            <label className="text-[#344054] font-normal text-sm mb-1 ">
              {dataLang?.client_popup_position}
            </label>
            <input
              value={option.position}
              onChange={_OnChangeOption.bind(this, option.id, "position")}
              name="fname"
              type="text"
              placeholder="Chức vụ"
              className="focus:border-[#92BFF7] placeholder:text-xs border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
            />
            <label className="text-[#344054] font-normal text-sm mb-1 ">
              {dataLang?.client_popup_birthday}
            </label>
            <input
              value={option.birthday}
              onChange={_OnChangeOption.bind(this, option.id, "birthday")}
              name="fname"
              type="date"
              className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
            />
            <label className="text-[#344054] font-normal text-sm mb-1 ">
              {dataLang?.client_popup_adress}
            </label>
            <textarea
              value={option.address}
              onChange={_OnChangeOption.bind(this, option.id, "address")}
              name="fname"
              type="text"
              placeholder="Địa chỉ"
              className="focus:border-[#92BFF7] placeholder:text-xs border-[#d0d5dd] placeholder:text-slate-300 w-full min-h-[90px] max-h-[200px] bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-2 border outline-none mb-2"
            />
          </div>
          <ButtoonDelete onClick={onDelete.bind(this, option.id)}>
            {children}
          </ButtoonDelete>
        </div>
      </div>
    </div>
  );
};

export default FormContactInfo;
