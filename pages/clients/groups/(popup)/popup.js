import React, { useState, useEffect, useRef } from "react";
import PopupEdit from "/components/UI/popup";
import Select, { components } from "react-select";

import {
    Edit as IconEdit,
    Trash as IconDelete,
    SearchNormal1 as IconSearch,
    Grid6 as IconExcel,
} from "iconsax-react";

import Swal from "sweetalert2";

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
});
const Popup_groupKh = (props) => {
    const [open, sOpen] = useState(false);
    const _ToggleModal = (e) => sOpen(e);
    const scrollAreaRef = useRef(null);
    const handleMenuOpen = () => {
        const menuPortalTarget = scrollAreaRef.current;
        return { menuPortalTarget };
    };

    const [onSending, sOnSending] = useState(false);
    const [brandpOpt, sListBrand] = useState([]);
    const [name, sName] = useState("");
    const [color, sColor] = useState("");
    const [errInput, sErrInput] = useState(false);

    const [errInputBr, sErrInputBr] = useState(false);
    const [valueBr, sValueBr] = useState([]);
    // const branch = valueBr.map(e => e.value)

    useEffect(() => {
        sErrInputBr(false);
        sErrInput(false);
        sName(props.name ? props.name : "");
        sColor(props.color ? props.color : "");
        sListBrand(
            props.listBr
                ? props.listBr && [
                      ...props.listBr?.map((e) => ({
                          label: e.name,
                          value: Number(e.id),
                      })),
                  ]
                : []
        );
        sValueBr(
            props.sValueBr
                ? props.listBr && [
                      ...props.sValueBr?.map((e) => ({
                          label: e.name,
                          value: Number(e.id),
                      })),
                  ]
                : []
        );
    }, [open]);
    const branch_id = valueBr?.map((e) => {
        return e?.value;
    });
    const _HandleChangeInput = (type, value) => {
        if (type == "name") {
            sName(value.target?.value);
        } else if (type == "valueBr") {
            sValueBr(value);
        } else if (type == "color") {
            sColor(value.target?.value);
        }
    };

    useEffect(() => {
        sErrInput(false);
    }, [name.length > 0]);
    useEffect(() => {
        sErrInputBr(false);
    }, [branch_id?.length > 0]);

    const _ServerSending = async () => {
        const id = props.id;
        var data = new FormData();
        data.append("name", name);
        data.append("color", color);
        await Axios(
            "POST",
            `${
                props.id
                    ? `/api_web/Api_client/group/${id}?csrf_protection=true`
                    : "/api_web/Api_client/group?csrf_protection=true"
            }`,
            {
                data: {
                    name: name,
                    color: color,
                    branch_id: branch_id,
                },
                headers: { "Content-Type": "multipart/form-data" },
            },
            (err, response) => {
                if (!err) {
                    var { isSuccess, message } = response.data;
                    if (isSuccess) {
                        Toast.fire({
                            icon: "success",
                            title: `${props.dataLang[message]}`,
                        });
                        sErrInput(false);
                        sName("");
                        sColor("");
                        sErrInputBr(false);
                        sValueBr([]);
                        props.onRefresh && props.onRefresh();
                        sOpen(false);
                    } else {
                        Toast.fire({
                            icon: "error",
                            title: `${props.dataLang[message]}`,
                        });
                    }
                }
                sOnSending(false);
            }
        );
    };
    //da up date
    useEffect(() => {
        onSending && _ServerSending();
    }, [onSending]);
    const _HandleSubmit = (e) => {
        e.preventDefault();
        if (name.length == 0 || branch_id?.length == 0) {
            name?.length == 0 && sErrInput(true);
            branch_id?.length == 0 && sErrInputBr(true);
            Toast.fire({
                icon: "error",
                title: `${props.dataLang?.required_field_null}`,
            });
        } else {
            // sErrInput(false)
            sOnSending(true);
        }
    };
    return (
        <PopupEdit
            title={
                props.id
                    ? `${props.dataLang?.client_group_edit}`
                    : `${props.dataLang?.client_group_add}`
            }
            button={
                props.id ? (
                    <IconEdit />
                ) : (
                    `${props.dataLang?.branch_popup_create_new}`
                )
            }
            onClickOpen={_ToggleModal.bind(this, true)}
            open={open}
            onClose={_ToggleModal.bind(this, false)}
            classNameBtn={props.className}
        >
            <div className="w-96 mt-4">
                <form onSubmit={_HandleSubmit.bind(this)}>
                    <div>
                        <div className="flex flex-wrap justify-between">
                            <label className="text-[#344054] font-normal text-sm mb-1 ">
                                {props.dataLang?.client_group_name}{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                value={name}
                                onChange={_HandleChangeInput.bind(this, "name")}
                                name="fname"
                                type="text"
                                className={`${
                                    errInput
                                        ? "border-red-500"
                                        : "focus:border-[#92BFF7] border-[#d0d5dd]"
                                } placeholder:text-slate-300 w-full bg-[#ffffff] rounded-md text-[#52575E] font-normal p-2 border outline-none mb-2`}
                            />
                            {errInput && (
                                <label className="mb-2  text-[14px] text-red-500">
                                    {props.dataLang?.client_group_please_name}
                                </label>
                            )}
                        </div>
                        <label className="text-[#344054] font-normal text-sm mb-1 ">
                            {props.dataLang?.client_list_brand}{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <Select
                            closeMenuOnSelect={false}
                            placeholder={props.dataLang?.client_list_brand}
                            options={brandpOpt}
                            isSearchable={true}
                            onChange={_HandleChangeInput.bind(this, "valueBr")}
                            LoadingIndicator
                            isMulti
                            noOptionsMessage={() => "Không có dữ liệu"}
                            value={valueBr}
                            maxMenuHeight="200px"
                            isClearable={true}
                            menuPortalTarget={document.body}
                            onMenuOpen={handleMenuOpen}
                            styles={{
                                placeholder: (base) => ({
                                    ...base,
                                    color: "#cbd5e1",
                                }),
                                menuPortal: (base) => ({
                                    ...base,
                                    zIndex: 9999,
                                    position: "absolute",
                                }),
                                // control: base => ({
                                //   ...base,
                                //   border: '1px solid #d0d5dd',
                                //   boxShadow: 'none',

                                // })  ,
                                control: (provided) => ({
                                    ...provided,
                                    border: "1px solid #d0d5dd",
                                    "&:focus": {
                                        outline: "none",
                                        border: "none",
                                    },
                                }),
                            }}
                            className={`${
                                errInputBr
                                    ? "border-red-500"
                                    : "border-transparent"
                            } placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `}
                        />
                        {errInputBr && (
                            <label className="mb-2  text-[14px] text-red-500">
                                {props.dataLang?.client_list_bran}
                            </label>
                        )}
                        <div className="flex flex-wrap justify-between mt-2">
                            <label className="text-[#344054] font-normal text-sm mb-1 ">
                                {props.dataLang?.client_group_color}
                            </label>
                            <input
                                value={color}
                                onChange={_HandleChangeInput.bind(
                                    this,
                                    "color"
                                )}
                                name="color"
                                type="color"
                                className="placeholder-[color:#667085] w-full min-h-[50px] bg-[#ffffff] rounded-lg focus:border-[#92BFF7] text-[#52575E] font-normal  p-2 border border-[#d0d5dd] outline-none mb-6"
                            />
                        </div>
                        <div className="text-right mt-5 space-x-2">
                            <button
                                type="button"
                                onClick={_ToggleModal.bind(this, false)}
                                className="button text-[#344054] font-normal text-base py-2 px-4 rounded-lg border border-solid border-[#D0D5DD]"
                            >
                                {props.dataLang?.branch_popup_exit}
                            </button>
                            <button
                                type="submit"
                                className="button text-[#FFFFFF]  font-normal text-base py-2 px-4 rounded-lg bg-[#0F4F9E]"
                            >
                                {props.dataLang?.branch_popup_save}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </PopupEdit>
    );
};
export default Popup_groupKh;
