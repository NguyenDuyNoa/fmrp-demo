import React from "react";
import ButtoonDelete from "../button/buttonDelete";
const FormContactInfo = ({ option, dataLang, onChangOptions, onDelete, children }) => {
    return (
        <div className="w-[48%] bg-white shadow-lg rounded-xl mb-2 hover:scale-[1.01] hover:shadow-2xl transition-all duration-200 ease-linear">
            <div key={option.idFe?.toString()}>
                <div className="w-full p-3 pt-0">
                    <div className="" key={option.idFe?.toString()}>
                        <label className="text-[#344054] font-normal text-sm mb-1 ">
                            {dataLang?.client_popup_fiandlass}
                        </label>
                        <input
                            disabled={option?.idBe && option?.disble}
                            value={option.full_name}
                            onChange={(e) => onChangOptions(option.idFe, "full_name", e?.target.value)}
                            name="optionVariant"
                            type="text"
                            placeholder="Họ và tên"
                            className="focus:border-[#92BFF7] placeholder:text-xs border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
                        />
                        <label className="text-[#344054] font-normal text-sm mb-1 ">
                            {dataLang?.client_popup_phone}
                        </label>
                        <input
                            disabled={option?.idBe && option?.disble}
                            value={option.phone_number}
                            onChange={(e) => onChangOptions(option.idFe, "phone_number", e?.target.value)}
                            name="fname"
                            type="number"
                            placeholder="Số điện thoại"
                            className="focus:border-[#92BFF7] placeholder:text-xs border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
                        />
                        <label className="text-[#344054] font-normal text-sm mb-1 ">Email</label>
                        <input
                            disabled={option?.idBe && option?.disble}
                            value={option.email}
                            onChange={(e) => onChangOptions(option.idFe, "email", e?.target.value)}
                            name="optionEmail"
                            type="text"
                            placeholder="Email"
                            className="focus:border-[#92BFF7] placeholder:text-xs border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
                        />
                        <label className="text-[#344054] font-normal text-sm mb-1 ">
                            {dataLang?.client_popup_position}
                        </label>
                        <input
                            disabled={option?.idBe && option?.disble}
                            value={option.position}
                            onChange={(e) => onChangOptions(option.idFe, "position", e?.target.value)}
                            name="fname"
                            type="text"
                            placeholder="Chức vụ"
                            className="focus:border-[#92BFF7] placeholder:text-xs border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
                        />
                        <label className="text-[#344054] font-normal text-sm mb-1 ">
                            {dataLang?.client_popup_birthday}
                        </label>
                        <input
                            disabled={option?.idBe && option?.disble}
                            value={option.birthday}
                            onChange={(e) => onChangOptions(option.idFe, "birthday", e?.target.value)}
                            name="fname"
                            type="date"
                            className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
                        />
                        <label className="text-[#344054] font-normal text-sm mb-1 ">
                            {dataLang?.client_popup_adress}
                        </label>
                        <textarea
                            disabled={option?.idBe && option?.disble}
                            value={option.address}
                            onChange={(e) => onChangOptions(option.idFe, "address", e?.target.value)}
                            name="fname"
                            type="text"
                            placeholder="Địa chỉ"
                            className="focus:border-[#92BFF7] placeholder:text-xs border-[#d0d5dd] placeholder:text-slate-300 w-full min-h-[90px] max-h-[200px] bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-2 border outline-none mb-2"
                        />
                    </div>
                    <ButtoonDelete onClick={() => onDelete({ id: option.idFe, status: true, idChild: option?.idBe })}>{children}</ButtoonDelete>
                </div>
            </div>
        </div>
    );
};

export default FormContactInfo;
