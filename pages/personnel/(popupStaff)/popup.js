import React, { useRef, useState, useEffect } from "react";
import { _ServerInstance as Axios } from "/services/axios";
import PopupEdit from "/components/UI/popup";
const ScrollArea = dynamic(() => import("react-scrollbar"), {
    ssr: false,
});
import dynamic from "next/dynamic";
import Select from "react-select";

import {
    Edit as IconEdit,
    Grid6 as IconExcel,
    Trash as IconDelete,
    SearchNormal1 as IconSearch,
    Add as IconAdd,
    Eye as IconEye,
    EyeSlash as IconEyeSlash,
    Image as IconImage,
    GalleryEdit as IconEditImg,
} from "iconsax-react";
import Image from "next/image";
import useToast from "@/hooks/useToast";

const CustomSelectOption = ({ value, label, level, code }) => (
    <div className="flex space-x-2 truncate">
        {level == 1 && <span>--</span>}
        {level == 2 && <span>----</span>}
        {level == 3 && <span>------</span>}
        {level == 4 && <span>--------</span>}
        <span className="2xl:max-w-[300px] max-w-[150px] w-fit truncate">{label}</span>
    </div>
);

const Popup_dsnd = (props) => {
    const dataLang = props.dataLang;

    const isShow = useToast();

    const scrollAreaRef = useRef(null);

    const handleMenuOpen = () => {
        const menuPortalTarget = scrollAreaRef.current;
        return { menuPortalTarget };
    };

    const [open, sOpen] = useState(false);

    const _ToggleModal = (e) => sOpen(e);

    const [onFetching, sOnFetching] = useState(false);

    const [onSending, sOnSending] = useState(false);

    const [onFetching_Manage, sOnFetching_Manage] = useState(false);

    const [errInput, sErrInput] = useState(false);

    const [errInputBr, sErrInputBr] = useState(false);

    const [errInputPas, sErrInputPas] = useState(false);

    const [name, sName] = useState("");

    const [code, sCode] = useState(null);

    const [password, sPassword] = useState("");

    const [phone_number, sPhone] = useState(null);

    const [email, sEmail] = useState("");

    const [admin, sAdmin] = useState("0");

    const [valueBr, sValueBr] = useState([]);

    const [dataDepar, sDataDepar] = useState([]);

    const depar_id = dataDepar?.map((e) => {
        return e?.id;
    });

    const [room, sRoom] = useState([]);
    // const [valuePosi, sValuePosi] = useState()
    const [tab, sTab] = useState(0);

    const _HandleSelectTab = (e) => sTab(e);

    const [thumb, sThumb] = useState(null);

    const [thumbFile, sThumbFile] = useState(null);

    const [isDeleteThumb, sIsDeleteThumb] = useState(false);

    const [dataOption, sDataOption] = useState();

    const [typePassword, sTypePassword] = useState(false);

    const _TogglePassword = () => sTypePassword(!typePassword);

    const _HandleChangeFileThumb = ({ target: { files } }) => {
        var [file] = files;
        if (file) {
            sThumbFile(file);
            sThumb(URL.createObjectURL(file));
        }
        sIsDeleteThumb(false);
    };

    const _DeleteThumb = (e) => {
        e.preventDefault();
        sThumbFile(null);
        sThumb(null);
        document.getElementById("upload").value = null;
        sIsDeleteThumb(true);
    };

    useEffect(() => {
        sThumb(thumb);
    }, [thumb]);

    useEffect(() => {
        sErrInputBr(false);
        sErrInput(false);
        sErrInputPas(false);
        sName("");
        sPhone();
        sEmail("");
        sAdmin(false);
        sThumb(null);
        sThumbFile(null);
        sPassword();
        props?.id && sOnFetching(true);
        sValueBr([]);
        sDataDepar([]);
        // sValuePosi()
        // if(valueBr?.length == 0)
        //   {
        //     sListBrand(props.listBr ? props.listBr && [...props.listBr?.map(e => ({label: e.name, value: Number(e.id)}))] : [])
        //   }
        //  else if(props?.id){
        //     sListBrand((props.listBr?.map(e=> ({label: e.name, value: Number(e.id)}))?.filter(e => valueBr.some(x => e.value !== x.value))))
        //   }

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
        sRoom(props?.room ? props.room : []);
        sDataOption(props?.dataOption ? props?.dataOption : []);
        sIdPos();
        sValueManage([]);
        sCode();

        // sManage([])
    }, [open]);

    const _ServerFetching_detailUser = () => {
        Axios("GET", `/api_web/api_staff/staff/${props?.id}?csrf_protection=true`, {}, (err, response) => {
            if (!err) {
                var db = response.data;
                sName(db?.full_name);
                sCode(db?.code);
                sPhone(db?.phonenumber);
                sEmail(db?.email);
                // sValueBr(db?.branch?.map(e=> ({label: e.name, value: Number(e.id)})))
                sValueBr(
                    db?.branch?.map((e) => ({
                        label: e.name,
                        value: Number(e.id),
                    }))
                );
                sValueManage(
                    db?.manage?.map((x) => ({
                        label: x.full_name,
                        value: Number(x.id),
                    }))
                );
                sAdmin(db?.admin);
                sDataDepar(db?.department);
                sThumb(db?.profile_image);
                sIdPos(db?.position_id);
            }
            // sOnSending(false)
            sOnFetching(false);
        });
    };
    useEffect(() => {
        open && props?.id && _ServerFetching_detailUser();
    }, [open]);

    const _HandleChangeInput = (type, value) => {
        if (type == "name") {
            sName(value.target?.value);
        } else if (type == "code") {
            sCode(value.target?.value);
        } else if (type == "phone_number") {
            sPhone(value.target?.value);
        } else if (type == "email") {
            sEmail(value.target?.value);
        } else if (type === "password") {
            sPassword(value.target?.value);
        } else if (type === "admin") {
            if (value.target?.checked === false) {
                sAdmin("0");
            } else if (value.target?.checked === true) {
                sAdmin("1");
            }
        } else if (type === "depar") {
            const name = value?.target.name;
            const id = value?.target.id;

            if (value?.target.checked) {
                // Thêm giá trị và id vào mảng khi input được chọn
                const updatedOptions = dataDepar && [...dataDepar, { name, id }];
                sDataDepar(updatedOptions);
            } else {
                // Xóa giá trị và id khỏi mảng khi input được bỏ chọn
                const updatedOptions = dataDepar?.filter((option) => option.id !== id);
                sDataDepar(updatedOptions);
            }
        } else if (type == "valueBr") {
            sValueBr(value);
        }
    };
    // branh
    const [brandpOpt, sListBrand] = useState([]);
    const branch_id = valueBr?.map((e) => {
        return e?.value;
    });
    //post db
    const _ServerSending = () => {
        let id = props?.id;
        var data = new FormData();
        data.append("name", name);
        data.append("code", code);
        data.append("password", password);
        // data.append('position_id', valuePosi);
        data.append("department_id", depar_id);
        data.append("admin", admin);
        data.append("phone_number", phone_number);
        data.append("email", email);
        data.append("branch_id", branch_id);
        data.append("profile_image", thumbFile);
        data.append("position_id", idPos);
        data.append("is_delete_image ", isDeleteThumb);
        data.append("manage ", manageV);
        Axios(
            "POST",
            `${id
                ? `/api_web/api_staff/staff/${id}?csrf_protection=true`
                : "/api_web/api_staff/staff/?csrf_protection=true"
            }`,
            {
                data: {
                    full_name: name,
                    code: code,
                    password: password,
                    phone_number: phone_number,
                    email: email,
                    // position_id: valuePosi,
                    department_id: depar_id,
                    admin: admin,
                    branch_id: branch_id,
                    position_id: idPos,
                    profile_image: thumbFile,
                    manage: manageV,
                    is_delete_image: isDeleteThumb,
                },
                // data:data,
                headers: { "Content-Type": "multipart/form-data" },
            },
            (err, response) => {
                if (!err) {
                    var { isSuccess, message, branch_name } = response.data;
                    if (isSuccess) {
                        isShow("success", props?.dataLang[message] || message);
                        props.onRefresh && props.onRefresh();
                        sOpen(false);
                        sErrInput(false);
                        sErrInputBr(false);
                        sErrInputPas(false);
                        sName("");
                        sPhone();
                        sEmail("");
                        sAdmin(false);
                        sThumb(null);
                        sThumbFile(null);
                        sValueBr([]);
                        sDataDepar([]);
                        sIdPos();
                        sValueManage([]);
                    } else {
                        isShow("error", props.dataLang[message] + " " + branch_name || message);
                    }
                }
                sOnSending(false);
            }
        );
    };

    useEffect(() => {
        onSending && _ServerSending();
    }, [onSending]);

    const [manage, sManage] = useState([]);

    const _ServerFetching__Manage = () => {
        Axios(
            "GET",
            `/api_web/api_staff/staffManage/${idPos ? idPos : -1}?csrf_protection=true`,
            {},
            (err, response) => {
                if (!err) {
                    var data = response.data;
                    if (valueManage?.length == 0) {
                        sManage(
                            data?.map((e) => ({
                                label: e.full_name,
                                value: Number(e.id),
                            }))
                        );
                    } else if (props?.id) {
                        sManage(
                            data
                                ?.map((e) => ({
                                    label: e.full_name,
                                    value: Number(e.id),
                                }))
                                ?.filter((e) => valueManage.some((x) => e.value !== x.value))
                        );
                    }
                    // else{
                    //   sManage(data?.map(e=> ({label: e.full_name, value: Number(e.id)})))
                    // }
                }
                sOnFetching_Manage(false);
            }
        );
    };
    const [valueManage, sValueManage] = useState([]);
    const manageV = valueManage?.map((e) => e.value);
    const handleChangeMana = (e) => {
        sValueManage(e);
    };

    const [idPos, sIdPos] = useState(null);
    const valueIdPos = (e) => sIdPos(e?.value);

    // useEffect(() => {
    //     onFetchingMana && _ServerFetching__Manage()
    // }, [onFetchingMana]);
    useEffect(() => {
        open && _ServerFetching__Manage();
    }, [idPos]);

    // save form
    const _HandleSubmit = (e) => {
        e.preventDefault();
        if (name?.length == 0 || branch_id?.length == 0 || password?.length == 0) {
            name?.length == 0 && sErrInput(true);
            branch_id?.length == 0 && sErrInputBr(true);
            password?.length == 0 && sErrInputPas(true);
            isShow("error", props.dataLang?.required_field_null);
        } else {
            sOnSending(true);
        }
    };
    useEffect(() => {
        sErrInput(false);
    }, [name?.length > 0]);
    useEffect(() => {
        sErrInputBr(false);
    }, [branch_id?.length > 0]);
    useEffect(() => {
        sErrInputPas(false);
    }, [password?.length > 0]);
    useEffect(() => {
        open && sOnFetching_Manage(true);
    }, [idPos]);
    useEffect(() => {
        onFetching_Manage && _ServerFetching__Manage();
    }, [onFetching_Manage]);

    return (
        <>
            <PopupEdit
                title={
                    props.id
                        ? `${props.dataLang?.personnels_staff_popup_edit}`
                        : `${props.dataLang?.personnels_staff_popup_add}`
                }
                button={props.id ? <IconEdit /> : `${props.dataLang?.branch_popup_create_new}`}
                onClickOpen={_ToggleModal.bind(this, true)}
                open={open}
                onClose={_ToggleModal.bind(this, false)}
                classNameBtn={props.className}
            >
                <div className="flex items-center space-x-4 my-3 border-[#E7EAEE] border-opacity-70 border-b-[1px]">
                    <button
                        onClick={_HandleSelectTab.bind(this, 0)}
                        className={`${tab === 0 ? "text-[#0F4F9E]  border-b-2 border-[#0F4F9E]" : "hover:text-[#0F4F9E] "
                            }  px-4 py-2 outline-none font-semibold`}
                    >
                        {props.dataLang?.personnels_staff_popup_info}
                    </button>
                    <button
                        onClick={_HandleSelectTab.bind(this, 1)}
                        className={`${tab === 1 ? "text-[#0F4F9E]  border-b-2 border-[#0F4F9E]" : "hover:text-[#0F4F9E] "
                            }  px-4 py-2 outline-none font-semibold`}
                    >
                        {props.dataLang?.personnels_staff_popup_power}
                    </button>
                </div>
                <div className="mt-4">
                    <form onSubmit={_HandleSubmit.bind(this)} className="">
                        {tab === 0 && (
                            <ScrollArea
                                ref={scrollAreaRef}
                                className="h-[550px] overflow-hidden"
                                speed={1}
                                smoothScrolling={true}
                            >
                                <div className="w-[45vw]    ">
                                    <div className="flex justify-between gap-5">
                                        <div className="w-1/2">
                                            <label className="text-[#344054] font-normal text-sm mb-1 ">
                                                {props.dataLang?.personnels_staff_popup_code}{" "}
                                            </label>
                                            <input
                                                value={code}
                                                onChange={_HandleChangeInput.bind(this, "code")}
                                                name="fname"
                                                type="text"
                                                placeholder={props.dataLang?.client_popup_sytem}
                                                className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
                                            />

                                            <label className="text-[#344054] font-normal text-sm mb-1 ">
                                                {props.dataLang?.personnels_staff_popup_name}
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <div>
                                                <input
                                                    value={name}
                                                    onChange={_HandleChangeInput.bind(this, "name")}
                                                    placeholder={props.dataLang?.personnels_staff_popup_name}
                                                    type="text"
                                                    className={`${errInput
                                                        ? "border-red-500"
                                                        : "focus:border-[#92BFF7] border-[#d0d5dd]"
                                                        } placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2`}
                                                />

                                                {errInput && (
                                                    <label className="mb-4  text-[14px] text-red-500">
                                                        {props.dataLang?.personnels_staff_popup_errName}
                                                    </label>
                                                )}
                                            </div>
                                            <div>
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
                                                    theme={(theme) => ({
                                                        ...theme,
                                                        colors: {
                                                            ...theme.colors,
                                                            primary25: "#EBF5FF",
                                                            primary50: "#92BFF7",
                                                            primary: "#0F4F9E",
                                                        },
                                                    })}
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
                                                    }}
                                                    className={`${errInputBr ? "border-red-500" : "border-transparent"
                                                        } placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `}
                                                />
                                                {errInputBr && (
                                                    <label className="mb-2  text-[14px] text-red-500">
                                                        {props.dataLang?.client_list_bran}
                                                    </label>
                                                )}
                                            </div>
                                            <label className="text-[#344054] font-normal text-sm mb-1 ">
                                                {props.dataLang?.personnels_staff_popup_email}
                                            </label>
                                            <input
                                                value={email}
                                                onChange={_HandleChangeInput.bind(this, "email")}
                                                placeholder={props.dataLang?.personnels_staff_popup_email}
                                                name="fname"
                                                type="email"
                                                className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
                                            />

                                            <div className="">
                                                <label className="text-[#344054] font-normal text-sm mb-1 ">
                                                    {props.dataLang?.personnels_staff_popup_phone}
                                                </label>
                                                <input
                                                    value={phone_number}
                                                    placeholder={props.dataLang?.personnels_staff_popup_phone}
                                                    onChange={_HandleChangeInput.bind(this, "phone_number")}
                                                    name="fname"
                                                    type="number"
                                                    className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
                                                />
                                            </div>
                                            <div className="flex items-center ">
                                                <label
                                                    className="relative flex cursor-pointer items-center rounded-full p-3 gap-3.5"
                                                    for="checkbox-6"
                                                    data-ripple-dark="true"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-indigo-500 checked:bg-indigo-500 checked:before:bg-indigo-500 hover:before:opacity-10"
                                                        id="checkbox-6"
                                                        // defaultChecked={admin == "1" && true}
                                                        value={admin}
                                                        checked={admin === "0" ? false : admin === "1" && true}
                                                        onChange={_HandleChangeInput.bind(this, "admin")}
                                                    />
                                                    <div className="pointer-events-none absolute top-2/4 left-[10%]   -translate-y-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-3.5 w-3.5"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                            stroke="currentColor"
                                                            stroke-width="1"
                                                        >
                                                            <path
                                                                fill-rule="evenodd"
                                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                clip-rule="evenodd"
                                                            ></path>
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <span className="text-[#344054] font-normal text-sm ">
                                                            {props.dataLang?.personnels_staff_popup_manager}
                                                        </span>
                                                    </div>
                                                </label>
                                            </div>
                                            <div className="relative flex flex-col mt-3">
                                                <div>
                                                    <label className="text-[#344054] font-normal text-sm ">
                                                        {props.dataLang?.personnels_staff_popup_pas}
                                                        <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type={typePassword ? "text" : "password"}
                                                        placeholder={props.dataLang?.personnels_staff_popup_pas}
                                                        value={password}
                                                        id="userpwd"
                                                        onChange={_HandleChangeInput.bind(this, "password")}
                                                        className={`${errInputPas
                                                            ? "border-red-500"
                                                            : "focus:border-[#92BFF7] border-[#d0d5dd]"
                                                            } placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal py-2 pl-3 pr-12  border outline-none `}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={_TogglePassword.bind(this)}
                                                        className="absolute right-3 top-[50%]"
                                                    >
                                                        {typePassword ? <IconEyeSlash /> : <IconEye />}
                                                    </button>
                                                </div>
                                                {errInputPas && (
                                                    <label className="mb-2  text-[14px] text-red-500">
                                                        {props.dataLang?.personnels_staff_popup_errPas}
                                                    </label>
                                                )}
                                            </div>
                                        </div>
                                        <div className="w-1/2">
                                            <div className="space-y-1 ">
                                                <label className="text-[#344054] font-normal text-sm">
                                                    {props.dataLang?.personnels_staff_table_avtar}
                                                </label>
                                                <div className="flex justify-center">
                                                    <div className="relative h-[180px] w-[180px] rounded bg-slate-200">
                                                        {thumb && (
                                                            <Image
                                                                width={180}
                                                                height={180}
                                                                quality={100}
                                                                src={
                                                                    typeof thumb === "string"
                                                                        ? thumb
                                                                        : URL.createObjectURL(thumb)
                                                                }
                                                                alt="thumb type"
                                                                className="w-[180px] h-[180px] rounded object-contain"
                                                                loading="lazy"
                                                                crossOrigin="anonymous"
                                                                blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                                                            />
                                                        )}
                                                        {!thumb && (
                                                            <div className="h-full w-full flex flex-col justify-center items-center">
                                                                <IconImage />
                                                            </div>
                                                        )}
                                                        <div className="absolute bottom-0 -right-12 flex flex-col space-y-2">
                                                            <input
                                                                onChange={_HandleChangeFileThumb.bind(this)}
                                                                type="file"
                                                                id={`upload`}
                                                                accept="image/png, image/jpeg"
                                                                hidden
                                                            />
                                                            <label
                                                                htmlFor={`upload`}
                                                                title="Sửa hình"
                                                                className="cursor-pointer w-8 h-8 rounded-full bg-slate-100 flex flex-col justify-center items-center"
                                                            >
                                                                <IconEditImg size="17" />
                                                            </label>
                                                            <button
                                                                disabled={!thumb ? true : false}
                                                                onClick={_DeleteThumb.bind(this)}
                                                                title="Xóa hình"
                                                                className="w-8 h-8 rounded-full bg-red-500 disabled:opacity-30 flex flex-col justify-center items-center text-white"
                                                            >
                                                                <IconDelete size="17" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </ScrollArea>
                        )}
                        {tab === 1 && (
                            <div>
                                <ScrollArea
                                    className="min-h-[500px] max-h-[550px] overflow-hidden"
                                    speed={1}
                                    smoothScrolling={true}
                                >
                                    <div className="w-[45vw] flex  items-center justify-between gap-5  flex-wrap ">
                                        <div className="flex items-center w-full gap-5 mb-3">
                                            <div className="w-1/2">
                                                <div className="">
                                                    <label className="text-[#344054] font-normal text-base">
                                                        {props.dataLang?.personnels_staff_position}
                                                    </label>
                                                    <Select
                                                        options={dataOption}
                                                        formatOptionLabel={CustomSelectOption}
                                                        defaultValue={
                                                            idPos == "0" || !idPos
                                                                ? {
                                                                    label: `${props.dataLang?.personnels_staff_position}`,
                                                                }
                                                                : {
                                                                    label: dataOption.find(
                                                                        (x) => x?.parent_id == idPos
                                                                    )?.label,
                                                                    code: dataOption.find(
                                                                        (x) => x?.parent_id == idPos
                                                                    )?.code,
                                                                    value: idPos,
                                                                }
                                                        }
                                                        value={
                                                            idPos == "0" || !idPos
                                                                ? {
                                                                    label: props.dataLang?.personnels_staff_position,
                                                                    code: props.dataLang?.personnels_staff_position,
                                                                }
                                                                : {
                                                                    label: dataOption.find((x) => x?.value == idPos)
                                                                        ?.label,
                                                                    code: dataOption.find((x) => x?.value == idPos)
                                                                        ?.code,
                                                                    value: idPos,
                                                                }
                                                        }
                                                        onChange={valueIdPos.bind(this)}
                                                        isClearable={true}
                                                        placeholder={props.dataLang?.personnels_staff_position}
                                                        className="placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none"
                                                        isSearchable={true}
                                                        theme={(theme) => ({
                                                            ...theme,
                                                            colors: {
                                                                ...theme.colors,
                                                                primary25: "#EBF5FF",
                                                                primary50: "#92BFF7",
                                                                primary: "#0F4F9E",
                                                            },
                                                        })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="w-1/2">
                                                <label className="text-[#344054] font-normal text-sm  ">
                                                    {props.dataLang?.personnels_staff_popup_mana}{" "}
                                                </label>
                                                <Select
                                                    closeMenuOnSelect={false}
                                                    placeholder={props.dataLang?.personnels_staff_popup_mana}
                                                    options={manage}
                                                    // value={valueManage ? {label: listWar?.find(x => x.value == valueManage)?.label, value: valueManage} : null}
                                                    isSearchable={true}
                                                    onChange={handleChangeMana}
                                                    LoadingIndicator
                                                    //hihihi
                                                    isMulti
                                                    noOptionsMessage={() => "Không có dữ liệu"}
                                                    value={valueManage}
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
                                                        control: (provided) => ({
                                                            ...provided,
                                                            border: "1px solid #d0d5dd",
                                                            "&:focus": {
                                                                outline: "none",
                                                                border: "none",
                                                            },
                                                        }),
                                                    }}
                                                    className={`${errInputBr
                                                        ? "border-red-500"
                                                        : "focus:border-[#92BFF7] border-[#d0d5dd]"
                                                        } placeholder:text-slate-300  text-[#52575E] font-normal border outline-none rounded-[5.5px] bg-white border-none xl:text-base text-[14.5px]`}
                                                />
                                            </div>
                                        </div>
                                        <div className="h-[400px] w-full">
                                            <label className="text-[#344054] font-normal text-base mb-3">
                                                {props?.dataLang?.personnels_staff_table_depart}
                                            </label>
                                            <div className="">
                                                <div className=" flex  flex-wrap justify-between">
                                                    {room?.map((e) => {
                                                        return (
                                                            <div className="w-[50%]  mt-2" key={e.id}>
                                                                <div
                                                                    className="flex w-max 
                                                items-center"
                                                                >
                                                                    <div className="inline-flex items-center">
                                                                        <label
                                                                            className="relative flex cursor-pointer items-center rounded-full p-3"
                                                                            htmlFor={e.id}
                                                                            data-ripple-dark="true"
                                                                        >
                                                                            <input
                                                                                type="checkbox"
                                                                                className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-indigo-500 checked:bg-indigo-500 checked:before:bg-indigo-500 hover:before:opacity-10"
                                                                                id={e.id}
                                                                                // defaultChecked
                                                                                value={e.name}
                                                                                checked={dataDepar?.some(
                                                                                    (selectedOpt) =>
                                                                                        selectedOpt?.id === e?.id
                                                                                )}
                                                                                onChange={_HandleChangeInput.bind(
                                                                                    this,
                                                                                    "depar"
                                                                                )}
                                                                            />
                                                                            <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                                                                                <svg
                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                    className="h-3.5 w-3.5"
                                                                                    viewBox="0 0 20 20"
                                                                                    fill="currentColor"
                                                                                    stroke="currentColor"
                                                                                    stroke-width="1"
                                                                                >
                                                                                    <path
                                                                                        fill-rule="evenodd"
                                                                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                                        clip-rule="evenodd"
                                                                                    ></path>
                                                                                </svg>
                                                                            </div>
                                                                        </label>
                                                                    </div>
                                                                    <label
                                                                        htmlFor={e.id}
                                                                        className="text-[#344054] font-medium text-base cursor-pointer"
                                                                    >
                                                                        {e.name}
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </ScrollArea>
                            </div>
                        )}
                        <div className="text-right mt-5 space-x-2">
                            <button
                                type="button"
                                onClick={_ToggleModal.bind(this, false)}
                                className="button text-[#344054] font-normal text-base py-2 px-4 rounded-[5.5px] border border-solid border-[#D0D5DD]"
                            >
                                {props.dataLang?.branch_popup_exit}
                            </button>
                            <button
                                type="submit"
                                className="button text-[#FFFFFF]  font-normal text-base py-2 px-4 rounded-[5.5px] bg-[#0F4F9E]"
                            >
                                {props.dataLang?.branch_popup_save}
                            </button>
                        </div>
                    </form>
                </div>
            </PopupEdit>
        </>
    );
};
export default Popup_dsnd;
