import { useEffect, useState } from "react";

import { Add as IconAdd, Trash as IconDelete, Edit as IconEdit } from "iconsax-react";

import useToast from "@/hooks/useToast";

import apiVariant from "@/api/apiSettings/apiVariant";
import PopupCustom from "@/components/UI/popup";
const PopupVariant = (props) => {
    const [open, sOpen] = useState(false);

    const isShow = useToast();

    const _ToggleModal = (e) => sOpen(e);

    const [onSending, sOnSending] = useState(false);

    const [name, sName] = useState("");

    const [option, sOption] = useState([]);

    const [required, sRequired] = useState(false);

    const [optionErr, sOptionErr] = useState(false);

    const [listOptErr, sListOptErr] = useState();

    useEffect(() => {
        sOption(props.option ? props.option : []);
        sName(props.name ? props.name : "");
        sRequired(false);
        sOptionErr(false);
    }, [open]);

    const [optionName, sOptionName] = useState("");

    const id = props.id;

    const _HandleChangeInput = (type, value) => {
        if (type == "name") {
            sName(value.target?.value);
        } else if (type == "optionName") {
            sOptionName(value.target?.value);
        }
    };

    const _OnChangeOption = (id, value) => {
        var index = option.findIndex((x) => x.id === id);
        option[index].name = value.target?.value;
        sOption([...option]);
    };

    const _ServerSending = async () => {
        try {
            const { isSuccess, message, same_option } = await apiVariant.apiHandingVariant(id ? id : undefined, {
                data: {
                    name: name,
                    option: option
                }
            })
            if (isSuccess) {
                isShow("success", props.dataLang[message] || message);
                sName("");
                sOption([]);
                props.onRefresh && props.onRefresh();
                sOpen(false);
                sListOptErr();
            } else {
                isShow("error", props.dataLang[message] || message);
                // const res = option.filter(i => same_option.some(item => i.name === item));
                sListOptErr(same_option);
            }
        } catch (error) {

        }
        sOnSending(false);
    };

    useEffect(() => {
        onSending && _ServerSending();
    }, [onSending]);

    const _HandleSubmit = (e) => {
        e.preventDefault();
        if (name.length == 0) {
            sRequired(true);
            isShow("error", props.dataLang?.required_field_null);
        } else {
            sOnSending(true);
        }
    };

    useEffect(() => {
        sRequired(false);
    }, [name.length > 0]);

    const _HandleAddNew = () => {
        sOption([...option, { id: Date.now(), name: optionName }]);
        sOptionName("");
    };
    const _HandleDelete = (id) => {
        sOption([...option.filter((x) => x.id !== id)]);
    };

    return (
        <PopupCustom
            title={
                props.id ? `${props.dataLang?.variant_popup_edit}` : `${props.dataLang?.branch_popup_create_new_variant}`
            }
            button={props.id ? <IconEdit /> : `${props.dataLang?.branch_popup_create_new}`}
            onClickOpen={_ToggleModal.bind(this, true)}
            open={open}
            onClose={_ToggleModal.bind(this, false)}
            classNameBtn={props.className}
        >
            <div className="pt-5 w-96">
                <form onSubmit={_HandleSubmit.bind(this)} className="space-y-5">
                    <div className="space-y-1">
                        <label className="text-[#344054] font-normal text-base">
                            {props.dataLang?.variant_name} <span className="text-red-500">*</span>
                        </label>
                        <input
                            value={name}
                            name="nameVariant"
                            onChange={_HandleChangeInput.bind(this, "name")}
                            placeholder={props.dataLang?.variant_name}
                            type="text"
                            className={`${required ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd] "
                                } placeholder:text-slate-300 w-full bg-[#ffffff] rounded-lg text-[#52575E] font-normal  p-2 border outline-none`}
                        />
                        {required && <label className="text-sm text-red-500">Vui lòng nhập tên biến thể</label>}
                    </div>
                    <div className="space-y-1.5">
                        <h6 className="text-[#344054] font-normal text-sm">
                            {props.dataLang?.branch_popup_variant_option}
                        </h6>
                        <div className="pr-3 max-h-60 overflow-auto space-y-1.5 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                            {option.map((e) => (
                                <div className="flex space-x-3 items-center" key={e.id?.toString()}>
                                    <input
                                        value={e.name}
                                        onChange={_OnChangeOption.bind(this, e.id)}
                                        placeholder="Nhập tùy chọn"
                                        name="optionVariant"
                                        type="text"
                                        className={`${listOptErr?.some((i) => i === e.name)
                                            ? "border-red-500"
                                            : "border-[#d0d5dd] focus:border-[#92BFF7]"
                                            } placeholder:text-slate-300 w-full bg-[#ffffff] rounded-lg text-[#52575E] font-normal p-2 border outline-none`}
                                    />
                                    <button
                                        onClick={_HandleDelete.bind(this, e.id)}
                                        type="button"
                                        title="Xóa"
                                        className="transition hover:scale-105 min-w-[40px] h-10 rounded-lg text-red-500 flex flex-col justify-center items-center"
                                    >
                                        <IconDelete />
                                    </button>
                                </div>
                            ))}
                        </div>
                        {/* <div className='flex space-x-3 items-center pr-3'>
                <input
                    value={optionName}
                    onChange={_HandleChangeInput.bind(this, "optionName")}
                    placeholder="Nhập tùy chọn"                      
                    type="text"
                    className="placeholder:text-slate-300 w-full bg-[#ffffff] rounded-lg focus:border-[#92BFF7] text-[#52575E] font-normal  p-2 border border-[#d0d5dd] outline-none"
                />     
                <button type='button' onClick={_HandleAddNew.bind(this)} title='Thêm' className='transition hover:scale-105 min-w-[40px] h-10 rounded-lg bg-slate-100 flex flex-col justify-center items-center'><IconAdd /></button>
              </div> */}
                        <div className="pr-3">
                            <button
                                type="button"
                                onClick={_HandleAddNew.bind(this)}
                                title="Thêm"
                                className="w-full h-10 rounded-lg flex flex-col justify-center items-center bg-slate-100 hover:opacity-70 transition"
                            >
                                <IconAdd />
                            </button>
                        </div>
                    </div>
                    <div className="text-right pt-5 space-x-2">
                        <button
                            type="button"
                            onClick={_ToggleModal.bind(this, false)}
                            className="text-base py-2 px-4 rounded-lg bg-slate-200 hover:opacity-90 hover:scale-105 transition"
                        >
                            {props.dataLang?.branch_popup_exit}
                        </button>
                        <button
                            type="submit"
                            className="text-[#FFFFFF] text-base py-2 px-4 rounded-lg bg-[#0F4F9E] hover:opacity-90 hover:scale-105 transition"
                        >
                            {props.dataLang?.branch_popup_save}
                        </button>
                    </div>
                </form>
            </div>
        </PopupCustom>
    );
};
export default PopupVariant