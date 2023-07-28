import React from "react";
import ButtonDelete from "../(buttonContact)/buttonDelete";
const FormContact = ({ dataLang, e, _OnChangeOption, _HandleDelete }) => {
  return (
    <div className="" key={e.id?.toString()}>
      <label className="text-[#344054] font-normal text-sm mb-1 ">
        {dataLang?.suppliers_supplier_fullname}
      </label>
      <input
        value={e.full_name}
        placeholder={dataLang?.suppliers_supplier_fullname}
        onChange={_OnChangeOption.bind(this, e.id, "full_name")}
        name="optionVariant"
        type="text"
        className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
      />
      <label className="text-[#344054] font-normal text-sm mb-1 ">
        {dataLang?.suppliers_supplier_phone}
      </label>
      <input
        value={e.phone_number}
        placeholder={dataLang?.suppliers_supplier_phone}
        onChange={_OnChangeOption.bind(this, e.id, "phone_number")}
        name="fname"
        type="number"
        className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
      />
      <label className="text-[#344054] font-normal text-sm mb-1 ">
        {dataLang?.suppliers_supplier_email}
      </label>
      <input
        value={e.email}
        placeholder={dataLang?.suppliers_supplier_email}
        onChange={_OnChangeOption.bind(this, e.id, "email")}
        name="optionEmail"
        type="text"
        className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
      />
      <label className="text-[#344054] font-normal text-sm mb-1 ">
        {dataLang?.suppliers_supplier_pos}
      </label>
      <input
        value={e.position}
        placeholder={dataLang?.suppliers_supplier_pos}
        onChange={_OnChangeOption.bind(this, e.id, "position")}
        name="fname"
        type="text"
        className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
      />
      <label className="text-[#344054] font-normal text-sm mb-1 ">
        {dataLang?.suppliers_supplier_adress}
      </label>
      <textarea
        value={e.address}
        placeholder={dataLang?.suppliers_supplier_adress}
        onChange={_OnChangeOption.bind(this, e.id, "address")}
        name="fname"
        type="text"
        className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full min-h-[90px] max-h-[200px] bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-2 border outline-none mb-2"
      />
      <ButtonDelete onClick={_HandleDelete.bind(this, e.id)} />
    </div>
  );
};
export default FormContact;
