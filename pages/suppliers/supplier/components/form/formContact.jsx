import React from "react";
import ButtonDelete from "../button/buttonDelete";
const FormContact = ({ dataLang, e, _OnChangeOption, _HandleDelete }) => {
    return (
        <div className="" key={e?.idFe?.toString()}>
            <label className="text-[#344054] font-normal text-sm mb-1 ">{dataLang?.suppliers_supplier_fullname}</label>
            <span className="text-red-500 px-1">*</span>
            <input
                value={e.full_name}
                // disabled={e?.idBe && !e?.disble}
                placeholder={dataLang?.suppliers_supplier_fullname}
                onChange={(value) => _OnChangeOption(e?.idFe, "full_name", value)}
                name="optionVariant"
                type="text"
                className={`${
                    e.full_name == "" ? "border-red-500" : ""
                } focus:border-[#92BFF7]  disabled:bg-gray-300 border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2`}
            />
            <label className="text-[#344054] font-normal text-sm mb-1 ">{dataLang?.suppliers_supplier_phone}</label>{" "}
            <span className="text-red-500 px-1">*</span>
            <input
                // disabled={e?.idBe && !e?.disble}
                value={e.phone_number}
                placeholder={dataLang?.suppliers_supplier_phone}
                onChange={(value) => _OnChangeOption(e?.idFe, "phone_number", value)}
                name="fname"
                type="number"
                className={`${
                    e.phone_number == "" ? "border-red-500" : ""
                } focus:border-[#92BFF7]  disabled:bg-gray-300 border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2`}
            />
            <label className="text-[#344054] font-normal text-sm mb-1 ">{dataLang?.suppliers_supplier_email}</label>
            <input
                // disabled={e?.idBe && !e?.disble}
                value={e.email}
                placeholder={dataLang?.suppliers_supplier_email}
                onChange={(value) => _OnChangeOption(e?.idFe, "email", value)}
                name="optionEmail"
                type="text"
                className="focus:border-[#92BFF7]  disabled:bg-gray-300 border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
            />
            <label className="text-[#344054] font-normal text-sm mb-1 ">{dataLang?.suppliers_supplier_pos}</label>
            <input
                // disabled={e?.idBe && !e?.disble}
                value={e.position}
                placeholder={dataLang?.suppliers_supplier_pos}
                onChange={(value) => _OnChangeOption(e?.idFe, "position", value)}
                name="fname"
                type="text"
                className="focus:border-[#92BFF7]  disabled:bg-gray-300 border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
            />
            <label className="text-[#344054] font-normal text-sm mb-1 ">{dataLang?.suppliers_supplier_adress}</label>
            <textarea
                // disabled={e?.idBe && !e?.disble}
                value={e.address}
                placeholder={dataLang?.suppliers_supplier_adress}
                onChange={(value) => _OnChangeOption(e?.idFe, "address", value)}
                name="fname"
                type="text"
                className="focus:border-[#92BFF7]  disabled:bg-gray-300 border-[#d0d5dd] placeholder:text-slate-300 w-full min-h-[90px] max-h-[200px] bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-2 border outline-none mb-2"
            />
            <ButtonDelete onClick={() => _HandleDelete({ id: e?.idFe, status: true, idChild: e?.idBe })} />
        </div>
    );
};
export default FormContact;
