import React, { useEffect, useState, useRef } from "react";
import Select, { components } from "react-select";
import PopupEdit from "/components/UI/popup";
import {
    Edit as IconEdit,
    Trash as IconDelete,
    Grid6 as IconExcel,
    SearchNormal1 as IconSearch,
} from "iconsax-react";
import Swal from "sweetalert2";

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
});
const Popup_phongban = (props) => {
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
    const [email, sEmail] = useState("");
    const [errInput, sErrInput] = useState(false);

    const [errInputBr, sErrInputBr] = useState(false);
    const [valueBr, sValueBr] = useState([]);

    useEffect(() => {
        sErrInputBr(false);
        sErrInput(false);
        sName(props.name ? props.name : "");
        sEmail(props.email ? props.email : "");
        sListBrand(
            props?.id
                ? props.listBr
                    ? props.listBr && [
                          ...props.listBr
                              ?.map((e) => ({
                                  label: e.name,
                                  value: Number(e.id),
                              }))
                              ?.filter((e) =>
                                  valueBr?.some((x) => e.label !== x.label)
                              ),
                      ]
                    : []
                : props.listBr
                ? props.listBr && [
                      ...props.listBr?.map((e) => ({
                          label: e.name,
                          value: Number(e.id),
                      })),
                  ]
                : []
        );
        // sListBrand(props.listBr ? props.listBr && [...props.listBr?.map(e => ({label: e.name, value: Number(e.id)}))] : [])
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
        // sValueBr(props.sValueBr ? props.listBr && [...props.sValueBr?.map(e => ({label: e.name, value: Number(e.id)}))] : [])
    }, [open]);
    const branch_id = valueBr?.map((e) => {
        return e?.value;
    });
    const _HandleChangeInput = (type, value) => {
        if (type == "name") {
            sName(value.target?.value);
        } else if (type == "valueBr") {
            sValueBr(value);
        } else if (type == "email") {
            sEmail(value.target?.value);
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
        data.append("email", email);
        await Axios(
            "POST",
            `${
                props.id
                    ? `/api_web/api_staff/department/${id}?csrf_protection=true`
                    : "/api_web/api_staff/department/?csrf_protection=true"
            }`,
            {
                data: {
                    name: name,
                    email: email,
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
                        sEmail("");
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
                    ? `${props.dataLang?.personnels_deparrtments_edit}`
                    : `${props.dataLang?.personnels_deparrtments_add}`
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
                                {props.dataLang?.personnels_deparrtments_name}{" "}
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
                                } placeholder:text-slate-300 w-full bg-[#ffffff] rounded-lg text-[#52575E] font-normal p-2 border outline-none mb-2`}
                            />
                            {errInput && (
                                <label className="mb-2  text-[14px] text-red-500">
                                    {
                                        props.dataLang
                                            ?.personnels_deparrtments_please
                                    }
                                </label>
                            )}
                        </div>

                        <div className="flex flex-wrap justify-between mt-2">
                            <label className="text-[#344054] font-normal text-sm mb-1 ">
                                {props?.dataLang?.personnels_deparrtments_email}
                            </label>
                            <input
                                value={email}
                                onChange={_HandleChangeInput.bind(
                                    this,
                                    "email"
                                )}
                                name="email"
                                type="email"
                                className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-lg text-[#52575E] font-normal p-2 border outline-none mb-2"
                            />
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
                                // {`${errInputBr ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd]"} placeholder:text-slate-300 w-full bg-[#ffffff] rounded-lg text-[#52575E] font-normal p-2 border outline-none mb-2`}
                                // })  ,
                                control: (provided) => ({
                                    ...provided,
                                    //   border: '1px solid #d0d5dd',
                                    borderColor: `${
                                        errInputBr ? "red" : "#d0d5dd"
                                    }`,
                                    "&:hover": {
                                        borderColor: "none",
                                    },

                                    "&:focus": {
                                        outline: "none",
                                        border: "none",
                                        borderColor: "none",
                                    },
                                }),
                            }}
                            // className={`${errInputBr ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd]"} placeholder:text-slate-300 w-full  text-[#52575E] font-normal border outline-none rounded-lg bg-white border-none xl:text-base text-[14.5px]`}
                        />
                        {errInputBr && (
                            <label className="mb-2  text-[14px] text-red-500">
                                {props.dataLang?.client_list_bran}
                            </label>
                        )}

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
export default Popup_phongban;
