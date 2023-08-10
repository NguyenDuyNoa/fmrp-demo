import React, { useState, useRef, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import { _ServerInstance as Axios } from "/services/axios";
const ScrollArea = dynamic(() => import("react-scrollbar"), {
    ssr: false,
});
import { NumericFormat } from "react-number-format";
import ReactExport from "react-data-export";

import Swal from "sweetalert2";

import {
    Edit as IconEdit,
    Grid6 as IconExcel,
    Trash as IconDelete,
    SearchNormal1 as IconSearch,
    Add as IconAdd,
} from "iconsax-react";
import PopupEdit from "/components/UI/popup";
import Loading from "components/UI/loading";
import Pagination from "/components/UI/pagination";
import dynamic from "next/dynamic";
import moment from "moment/moment";
import Select, { components } from "react-select";
import Popup from "reactjs-popup";
import { data } from "autoprefixer";
import { useDispatch } from "react-redux";
import ButtonAdd from "../(buttonContact)/buttonAdd";
import ButtonDelete from "../(buttonContact)/buttonDelete";
import FormContact from "../(form)/formContact";
import FormInfo from "../(form)/formInfo";

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
});

const Popup_dsncc = (props) => {
    const dataLang = props.dataLang;
    const scrollAreaRef = useRef(null);
    const handleMenuOpen = () => {
        const menuPortalTarget = scrollAreaRef.current;
        return { menuPortalTarget };
    };

    const [open, sOpen] = useState(false);
    const _ToggleModal = (e) => sOpen(e);
    const [onSending, sOnSending] = useState(false);
    const [onFetching, sOnFetching] = useState(false);
    const [onFetchingDis, sOnFetchingDis] = useState(false);
    const [onFetchingWar, sOnFetchingWar] = useState(false);
    const [onFetchingChar, sOnFetchingChar] = useState(false);
    const [onFetchingBr, sOnFetchingBr] = useState(false);
    const [onFetchingGr, sOnFetchingGr] = useState(false);

    const [errInput, sErrInput] = useState(false);
    const [errInputBr, sErrInputBr] = useState(false);

    const [option, sOption] = useState([]);
    const [optionfull_name, sOptionFull_name] = useState("");
    const [optionEmail, sOptionEmail] = useState("");
    const [optionposition, sPosition] = useState("");
    const [optionbirthday, sOptionBirthday] = useState("");
    const [optionaddress, sOptionAddress] = useState("");
    const [optionphone_number, sOptionPhone_number] = useState("");

    const [name, sName] = useState("");
    const [code, sCode] = useState(null);
    const [tax_code, sTaxcode] = useState(null);
    const [representative, sRepresentative] = useState(null);
    const [phone_number, sPhone] = useState(null);
    const [address, sAdress] = useState("");
    const [date_incorporation, sDate_incorporation] = useState("");
    const [email, sEmail] = useState("");
    const [note, sNote] = useState("");
    const [debt_begin, sDebt_begin] = useState("");

    const [tab, sTab] = useState(0);

    const [valueBr, sValueBr] = useState([]);
    const branch = valueBr.map((e) => e.value);

    const _HandleSelectTab = (e) => sTab(e);
    const [hidden, sHidden] = useState(false);

    useEffect(() => {
        sErrInputBr(false);
        sErrInput(false);
        sName("");
        sCode();
        sTaxcode();
        sRepresentative();
        sPhone();
        sAdress("");
        sDate_incorporation("");
        sEmail("");
        sNote("");
        sDebt_begin("");
        props?.id && sOnFetching(true);
        sCityOpt(
            props.listSelectCt && [
                ...props.listSelectCt?.map((e) => ({
                    label: e.name,
                    value: Number(e.provinceid),
                })),
            ]
        );
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
        sOption(props.option ? props.option : []);
        sValueBr([]);
        sValueCt();
        sValueDis();
        sValueWa();
        sValueGr([]);
    }, [open]);

    const _ServerFetching_detailUser = async () => {
        await Axios(
            "GET",
            `/api_web/api_supplier/supplier/${props?.id}?csrf_protection=true`,
            {},
            (err, response) => {
                if (!err) {
                    var db = response.data;
                    sName(db?.name);
                    sCode(db?.code);
                    sTaxcode(db?.tax_code);
                    sRepresentative(db?.representative);
                    sPhone(db?.phone_number);
                    sAdress(db?.address);
                    sEmail(db?.email);
                    sDebt_begin(db?.debt_begin);
                    sDate_incorporation(db?.date_incorporation);
                    sValueDis(db?.district.districtid);
                    sValueCt(db?.city.provinceid);
                    sNote(db?.note);
                    sValueBr(
                        db?.branch?.map((e) => ({
                            label: e.name,
                            value: Number(e.id),
                        }))
                    );
                    sValueWa(db?.ward.wardid);
                    sValueGr(
                        db?.supplier_group.map((e) => ({
                            label: e.name,
                            value: Number(e.id),
                        }))
                    );
                    sOption(db?.contact ? db?.contact : []);
                }
                sOnFetching(false);
            }
        );
    };

    useEffect(() => {
        onFetching && props?.id && _ServerFetching_detailUser();
    }, [open]);

    //onchang input
    const _HandleChangeInput = (type, value) => {
        if (type == "name") {
            sName(value.target?.value);
        } else if (type == "code") {
            sCode(value.target?.value);
        } else if (type == "tax_code") {
            sTaxcode(value.target?.value);
        } else if (type == "representative") {
            sRepresentative(value.target?.value);
        } else if (type == "phone_number") {
            sPhone(value.target?.value);
        } else if (type == "address") {
            sAdress(value.target?.value);
        } else if (type == "date_incorporation") {
            sDate_incorporation(value.target?.value);
        } else if (type == "email") {
            sEmail(value.target?.value);
        } else if (type == "note") {
            sNote(value.target?.value);
        } else if (type == "debt_begin") {
            sDebt_begin(value?.value);
        } else if (type == "valueBr") {
            sValueBr(value);
        }

        // else if(type == "optionName"){
        //   sOptionName(value.target?.value)
        // }else if(type == "optionHapy"){
        //   sOptionHapy(value.target?.value)
        // }else if(type == "optionNote"){
        //   sOptionNote(value.target?.value)
        // }else if(type == "optionPhone"){
        //   sOptionPhone(value.target?.value)
        // }
    };

    // branh
    const [brandpOpt, sListBrand] = useState([]);
    const branch_id = valueBr?.map((e) => {
        return e?.value;
    });

    // group

    const [listGr, sListGr] = useState();
    const _ServerFetching_Gr = async () => {
        await Axios(
            "GET",
            `/api_web/api_supplier/group/?csrf_protection=true`,
            {
                params: {
                    "filter[branch_id]": branch?.length > 0 ? branch : -1,
                },
            },
            (err, response) => {
                if (!err) {
                    var { rResult } = response.data;

                    if (valueGr?.length == 0) {
                        sListGr(
                            rResult?.map((e) => ({
                                label: e.name,
                                value: Number(e.id),
                            }))
                        );
                    } else if (props?.id) {
                        sListGr(
                            rResult
                                ?.map((x) => ({
                                    label: x.name,
                                    value: Number(x.id),
                                }))
                                ?.filter((e) =>
                                    valueGr.some((x) => e.value !== x.value)
                                )
                        );
                    }
                }
                // sOnFetching(false)
                sOnFetchingBr(false);
            }
        );
    };
    // const listGrp  = listGr?.map(e=> ({label: e.name, value:e.id}))
    const [valueGr, sValueGr] = useState([]);
    const group = valueGr?.map((e) => e.value);
    const handleChangeGr = (e) => {
        sValueGr(e);
    };
    useEffect(() => {
        onFetchingBr && _ServerFetching_Gr();
    }, [onFetchingBr]);
    useEffect(() => {
        open && _ServerFetching_Gr(true);
    }, [valueBr]);

    const client_group_id = valueGr?.map((e) => {
        return e.value;
    });

    // on chang city
    const [cityOpt, sCityOpt] = useState();
    const [valueCt, sValueCt] = useState();

    const handleChangeCt = (e) => {
        sValueCt(e?.value);
    };

    // fecht distric
    const [ditrict, sDistricts] = useState();
    const _ServerFetching_distric = async () => {
        await Axios(
            "GET",
            "/api_web/Api_address/district?limit=0",
            {
                params: {
                    provinceid: valueCt ? valueCt : -1,
                },
            },
            (err, response) => {
                if (!err) {
                    var { rResult, output } = response.data;
                    sDistricts(
                        rResult?.map((e) => ({
                            label: e.name,
                            value: e.districtid,
                        }))
                    );
                    // sDistricts(rResult)
                }
                sOnSending(false);
                sOnFetchingDis(false);
            }
        );
    };

    //on chang ditrict
    const [valueDis, sValueDis] = useState();
    const handleChangeDtric = (e) => {
        sValueDis(e?.value);
    };

    //fecth ward
    const [ward_id, sWard] = useState();
    const _ServerFetching_war = async () => {
        await Axios(
            "GET",
            "/api_web/Api_address/ward?limit=0",
            {
                params: {
                    districtid: valueDis ? valueDis : -1,
                },
            },
            (err, response) => {
                if (!err) {
                    var { rResult, output } = response.data;
                    sWard(rResult);
                }
                sOnSending(false);
                sOnFetchingWar(false);
            }
        );
    };

    const listWar = ward_id && [
        ...ward_id?.map((e) => ({ label: e.name, value: Number(e.wardid) })),
    ];
    //onchang ward
    const [valueWa, sValueWa] = useState();

    // const ward =  valueWa?.value
    const handleChangeWar = (e) => {
        sValueWa(e?.value);
    };

    //post db
    const _ServerSending = async () => {
        let id = props?.id;
        var data = new FormData();
        data.append("name", name ? name : "");
        data.append("code", code ? code : "");
        data.append("tax_code", tax_code ? tax_code : "");
        data.append("representative", representative ? representative : "");
        data.append("phone_number", phone_number ? phone_number : "");
        data.append("address", address ? address : "");
        data.append(
            "date_incorporation",
            date_incorporation ? date_incorporation : ""
        );
        data.append("note", note ? note : "");
        data.append("email", email ? email : "");
        data.append("debt_begin", debt_begin ? debt_begin : "");
        data.append("city", valueCt ? valueCt : "");
        data.append("district", valueDis ? valueDis : "");
        data.append("ward", valueWa ? valueWa : "");
        // data.append("supplier_group_id", group);
        // data.append("branch_id", branch_id);
        valueBr?.forEach((e, index) => {
            data.append(`branch_id[${index}]`, e?.value ? e?.value : "");
        });
        valueGr?.forEach((e, index) => {
            data.append(
                `supplier_group_id[${index}]`,
                e?.value ? e?.value : ""
            );
        });
        option?.forEach((e, index) => {
            data.append(`contact[${index}][id]`, id ? e?.id : "");
            data.append(`contact[${index}][full_name]`, e?.full_name);
            data.append(`contact[${index}][email]`, e?.email);
            data.append(`contact[${index}][position]`, e?.position);
            data.append(`contact[${index}][address]`, e?.address);
            data.append(`contact[${index}][phone_number]`, e?.phone_number);
        });
        await Axios(
            "POST",
            `${
                id
                    ? `/api_web/api_supplier/supplier/${id}?csrf_protection=true`
                    : "/api_web/api_supplier/supplier/?csrf_protection=true"
            }`,
            {
                data: data,
                // data: {
                //   name: name,
                //   code: code,
                //   tax_code: tax_code,
                //   representative: representative,
                //   phone_number: phone_number,
                //   address: address,
                //   date_incorporation: date_incorporation,
                //   note: note,
                //   email: email,
                //   debt_begin: debt_begin,
                //   city: valueCt,
                //   district: valueDis,
                //   ward: valueWa,
                //   supplier_group_id: group,
                //   branch_id: branch_id,
                //   contact: option,
                // },
                headers: { "Content-Type": "multipart/form-data" },
            },
            (err, response) => {
                if (!err) {
                    var { isSuccess, message, branch_name } = response.data;
                    if (isSuccess) {
                        Toast.fire({
                            icon: "success",
                            title: `${props?.dataLang[message]}`,
                        });
                        props.onRefresh && props.onRefresh();
                        props.onRefreshGroup && props.onRefreshGroup();
                        sOpen(false);
                        sErrInput(false);
                        sErrInputBr(false);
                        sName("");
                        sCode(null);
                        sTaxcode(null);
                        sRepresentative(null);
                        sDate_incorporation("");
                        sPhone("");
                        sAdress("");
                        sNote("");
                        sEmail("");
                        sWebsite("");
                        sDebt_begin("");
                        sWard("");
                        sOption([]);
                        sValueBr([]);
                        sGroupOpt([]);
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

    //onchang option form
    const _OnChangeOption = (id, type, value) => {
        var index = option.findIndex((x) => x.id === id);
        if (type == "full_name") {
            option[index].full_name = value.target?.value;
        } else if (type == "email") {
            option[index].email = value.target?.value;
        } else if (type == "position") {
            option[index].position = value.target?.value;
        } else if (type === "address") {
            option[index].address = value.target?.value;
        } else if (type === "phone_number") {
            option[index].phone_number = value.target?.value;
        }
        sOption([...option]);
    };

    // add option form
    const _HandleAddNew = () => {
        sOption([
            ...option,
            {
                id: Date.now(),
                full_name: optionfull_name,
                email: optionEmail,
                position: optionposition,
                address: optionaddress,
                phone_number: optionphone_number,
            },
        ]);
        sOptionFull_name("");
        sOptionEmail("");
        sPosition("");
        sOptionAddress("");
        sOptionPhone_number("");
    };

    // delete option form
    const _HandleDelete = (id) => {
        Swal.fire({
            title: `${dataLang?.aler_ask}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#296dc1",
            cancelButtonColor: "#d33",
            confirmButtonText: `${dataLang?.aler_yes}`,
            cancelButtonText: `${dataLang?.aler_cancel}`,
        }).then((result) => {
            if (result.isConfirmed) {
                sOption([...option.filter((x) => x.id !== id)]);
            }
        });
    };
    useEffect(() => {
        option.length == 0 && sHidden(false);
        option.length != 0 && sHidden(true);
    }, [option.length]);
    useEffect(() => {
        onSending && _ServerSending();
    }, [onSending]);

    // save form
    const _HandleSubmit = (e) => {
        e.preventDefault();
        if (name?.length == 0 || branch_id?.length == 0) {
            name?.length == 0 && sErrInput(true);
            branch_id?.length == 0 && sErrInputBr(true);
            Toast.fire({
                icon: "error",
                title: `${props.dataLang?.required_field_null}`,
            });
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
        open && sOnFetchingDis(true);
    }, [valueCt]);
    useEffect(() => {
        open && sOnFetchingWar(true);
    }, [valueDis]);

    useEffect(() => {
        open && sOnFetchingGr(true);
    }, [valueBr]);
    // },[valueChar])

    useEffect(() => {
        onFetchingGr && _ServerFetching_Gr();
    }, [onFetchingGr]);

    useEffect(() => {
        onFetchingDis && _ServerFetching_distric();
    }, [onFetchingDis]);
    useEffect(() => {
        onFetchingWar && _ServerFetching_war();
    }, [onFetchingWar]);

    return (
        <>
            <PopupEdit
                title={
                    props.id
                        ? `${props.dataLang?.suppliers_supplier_edit}`
                        : `${props.dataLang?.suppliers_supplier_add}`
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
                <div className="flex items-center space-x-4 my-3 border-[#E7EAEE] border-opacity-70 border-b-[1px]">
                    <button
                        onClick={_HandleSelectTab.bind(this, 0)}
                        className={`${
                            tab === 0
                                ? "text-[#0F4F9E]  border-b-2 border-[#0F4F9E]"
                                : "hover:text-[#0F4F9E] "
                        }  px-4 py-2 outline-none font-semibold`}
                    >
                        {props.dataLang?.client_popup_general}
                    </button>
                    <button
                        onClick={_HandleSelectTab.bind(this, 1)}
                        className={`${
                            tab === 1
                                ? "text-[#0F4F9E]  border-b-2 border-[#0F4F9E]"
                                : "hover:text-[#0F4F9E] "
                        }  px-4 py-2 outline-none font-semibold`}
                    >
                        {props.dataLang?.client_popup_contact}
                    </button>
                </div>
                <div className="mt-4">
                    <form onSubmit={_HandleSubmit.bind(this)} className="">
                        {tab === 0 && (
                            <ScrollArea
                                ref={scrollAreaRef}
                                className="3xl:h-[500px] 2xl:h-[500px] xl:h-[500px]  lg:h-[400px] h-[500px] overflow-hidden"
                                speed={1}
                                smoothScrolling={true}
                            >
                                {/* <div className="w-[50vw]  p-2  ">
                  <div className="flex flex-wrap justify-between ">
                    <div className="w-[48%]">
                      <label className="text-[#344054] font-normal text-sm mb-1 ">
                        {props.dataLang?.suppliers_supplier_code}{" "}
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
                        {props.dataLang?.suppliers_supplier_name}
                        <span className="text-red-500">*</span>
                      </label>
                      <div>
                        <input
                          value={name}
                          onChange={_HandleChangeInput.bind(this, "name")}
                          placeholder={props.dataLang?.suppliers_supplier_name}
                          name="fname"
                          type="text"
                          className={`${
                            errInput
                              ? "border-red-500"
                              : "focus:border-[#92BFF7] border-[#d0d5dd]"
                          } placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2`}
                        />
                        {errInput && (
                          <label className="mb-4  text-[14px] text-red-500">
                            {props.dataLang?.suppliers_supplier_err}
                          </label>
                        )}
                      </div>
                      <label className="text-[#344054] font-normal text-sm mb-1 ">
                        {props.dataLang?.suppliers_supplier_reper}
                      </label>
                      <input
                        value={representative}
                        placeholder={props.dataLang?.suppliers_supplier_reper}
                        onChange={_HandleChangeInput.bind(
                          this,
                          "representative"
                        )}
                        name="fname"
                        type="text"
                        className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
                      />
                      <label className="text-[#344054] font-normal text-sm mb-1 ">
                        {props.dataLang?.suppliers_supplier_email}
                      </label>
                      <input
                        value={email}
                        onChange={_HandleChangeInput.bind(this, "email")}
                        placeholder={props.dataLang?.suppliers_supplier_email}
                        name="fname"
                        type="email"
                        className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
                      />
                      <label className="text-[#344054] font-normal text-sm mb-1 ">
                        {props.dataLang?.suppliers_supplier_phone}
                      </label>
                      <input
                        value={phone_number}
                        placeholder={props.dataLang?.suppliers_supplier_phone}
                        onChange={_HandleChangeInput.bind(this, "phone_number")}
                        name="fname"
                        type="text"
                        className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
                      />
                      <label className="text-[#344054] font-normal text-sm mb-1 ">
                        {props.dataLang?.suppliers_supplier_taxcode}
                      </label>
                      <input
                        value={tax_code}
                        placeholder={props.dataLang?.suppliers_supplier_taxcode}
                        onChange={_HandleChangeInput.bind(this, "tax_code")}
                        name="fname"
                        type="text"
                        className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
                      />
                      <label className="text-[#344054] font-normal text-sm mb-1 ">
                        {props.dataLang?.suppliers_supplier_date}
                      </label>
                      <input
                        value={date_incorporation}
                        onChange={_HandleChangeInput.bind(
                          this,
                          "date_incorporation"
                        )}
                        name="fname"
                        type="date"
                        className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
                      />
                    </div>
                    <div className="w-[48%]">
                      <div className="mb-1">
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
                          }}
                          className={`${
                            errInputBr ? "border-red-500" : "border-transparent"
                          } placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `}
                        />
                        {errInputBr && (
                          <label className="mb-2  text-[14px] text-red-500">
                            {props.dataLang?.client_list_bran}
                          </label>
                        )}
                      </div>
                      <label className="text-[#344054] font-normal text-sm mb-1 ">
                        {props.dataLang?.suppliers_supplier_group}
                      </label>
                      <Select
                        placeholder={props.dataLang?.suppliers_supplier_group}
                        noOptionsMessage={() => "Không có dữ liệu"}
                        options={listGr}
                        value={valueGr}
                        onChange={handleChangeGr}
                        isSearchable={true}
                        LoadingIndicator
                        isMulti={true}
                        maxMenuHeight="200px"
                        isClearable={true}
                        theme={(theme) => ({
                          ...theme,
                          colors: {
                            ...theme.colors,
                            primary25: "#EBF5FF",
                            primary50: "#92BFF7",
                            primary: "#0F4F9E",
                          },
                        })}
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
                        }}
                        className="rounded-[5.5px] py-0.5 mb-2 bg-white border-none xl:text-base text-[14.5px] "
                      />
                      <label className="text-[#344054] font-normal text-sm mb-1 ">
                        {props.dataLang?.suppliers_supplier_debt}
                      </label>
                      <NumericFormat
                        value={debt_begin}
                        onValueChange={_HandleChangeInput.bind(
                          this,
                          "debt_begin"
                        )}
                        className="ocus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
                        thousandSeparator=","
                        allowNegative={false}
                        isNumericString={true}
                        placeholder={props.dataLang?.suppliers_supplier_debt}
                      />
                    

                      <div>
                        <label className="text-[#344054] font-normal text-sm mb-1 ">
                          {props.dataLang?.suppliers_supplier_city}
                        </label>
                        <Select
                          placeholder={props.dataLang?.suppliers_supplier_city}
                          options={cityOpt}
                          value={
                            valueCt
                              ? {
                                  label: cityOpt?.find(
                                    (x) => x.value == valueCt
                                  )?.label,
                                  value: valueCt,
                                }
                              : null
                          }
                          onChange={handleChangeCt}
                          isSearchable={true}
                          LoadingIndicator
                          maxMenuHeight="200px"
                          isClearable={true}
                          noOptionsMessage={() => "Không có dữ liệu"}
                          theme={(theme) => ({
                            ...theme,
                            colors: {
                              ...theme.colors,
                              primary25: "#EBF5FF",
                              primary50: "#92BFF7",
                              primary: "#0F4F9E",
                            },
                          })}
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
                          }}
                          className="rounded-[5.5px] py-0.5 mb-1 bg-white border-none xl:text-base text-[14.5px] "
                        />
                      </div>
                      <div className="mb-2">
                        <label className="text-[#344054] font-normal text-sm mb-1 ">
                          {props.dataLang?.suppliers_supplier_district}
                        </label>
                        <Select
                          placeholder={
                            props.dataLang?.suppliers_supplier_district
                          }
                          options={ditrict}
                          value={
                            valueDis
                              ? {
                                  label: ditrict?.find(
                                    (x) => x.value == valueDis
                                  )?.label,
                                  value: valueDis,
                                }
                              : null
                          }
                          onChange={handleChangeDtric}
                          isSearchable={true}
                          LoadingIndicator
                          maxMenuHeight="200px"
                          isClearable={true}
                          theme={(theme) => ({
                            ...theme,
                            colors: {
                              ...theme.colors,
                              primary25: "#EBF5FF",
                              primary50: "#92BFF7",
                              primary: "#0F4F9E",
                            },
                          })}
                          noOptionsMessage={() => "Không có dữ liệu"}
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
                          }}
                          className="rounded-[5.5px] py-0.5 bg-white border-none xl:text-base text-[14.5px] "
                        />
                      </div>
                      <div>
                        <label className="text-[#344054] font-normal text-sm mb-1 ">
                          {props.dataLang?.suppliers_supplier_wards}
                        </label>
                        <Select
                          placeholder={props.dataLang?.suppliers_supplier_wards}
                          options={listWar}
                          value={
                            valueWa
                              ? {
                                  label: listWar?.find(
                                    (x) => x.value == valueWa
                                  )?.label,
                                  value: valueWa,
                                }
                              : null
                          }
                          onChange={handleChangeWar}
                          isSearchable={true}
                          LoadingIndicator
                          maxMenuHeight="200px"
                          isClearable={true}
                          theme={(theme) => ({
                            ...theme,
                            colors: {
                              ...theme.colors,
                              primary25: "#EBF5FF",
                              primary50: "#92BFF7",
                              primary: "#0F4F9E",
                            },
                          })}
                          noOptionsMessage={() => "Không có dữ liệu"}
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
                          }}
                          className="rounded-[5.5px] py-0.5 bg-white border-none xl:text-base text-[14.5px] "
                        />
                      </div>
                      <label className="text-[#344054] font-normal text-sm mb-1 ">
                        {props.dataLang?.suppliers_supplier_adress}
                      </label>
                      <textarea
                        value={address}
                        placeholder={props.dataLang?.suppliers_supplier_adress}
                        onChange={_HandleChangeInput.bind(this, "address")}
                        name="fname"
                        type="text"
                        className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full min-h-[40px] h-[40px] max-h-[200px] bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-2 border outline-none mb-2"
                      />
                    </div>
                    <div className="w-full">
                      <label className="text-[#344054] font-normal text-sm mb-1 ">
                        {props.dataLang?.suppliers_supplier_note}
                      </label>
                      <textarea
                        value={note}
                        placeholder={props.dataLang?.suppliers_supplier_note}
                        onChange={_HandleChangeInput.bind(this, "note")}
                        name="fname"
                        type="text"
                        className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full min-h-[40px] max-h-[200px] bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-2 border outline-none mb-2"
                      />
                    </div>
                  </div>
                </div> */}
                                <FormInfo
                                    code={code}
                                    name={name}
                                    representative={representative}
                                    email={email}
                                    phone_number={phone_number}
                                    tax_code={tax_code}
                                    date_incorporation={date_incorporation}
                                    valueBr={valueBr}
                                    brandpOpt={brandpOpt}
                                    errInput={errInput}
                                    errInputBr={errInputBr}
                                    listGr={listGr}
                                    valueGr={valueGr}
                                    debt_begin={debt_begin}
                                    _HandleChangeInput={_HandleChangeInput.bind(
                                        this
                                    )}
                                    handleChangeGr={handleChangeGr.bind(this)}
                                    handleMenuOpen={handleMenuOpen.bind(this)}
                                    cityOpt={cityOpt}
                                    valueCt={valueCt}
                                    handleChangeCt={handleChangeCt.bind(this)}
                                    ditrict={ditrict}
                                    valueDis={valueDis}
                                    handleChangeDtric={handleChangeDtric.bind(
                                        this
                                    )}
                                    listWar={listWar}
                                    valueWa={valueWa}
                                    handleChangeWar={handleChangeWar.bind(this)}
                                    address={address}
                                    note={note}
                                    dataLang={dataLang}
                                ></FormInfo>
                            </ScrollArea>
                        )}
                        {tab === 1 && (
                            <div>
                                <ScrollArea
                                    className="min-h-[0px] max-h-[550px] overflow-hidden"
                                    speed={1}
                                    smoothScrolling={true}
                                >
                                    <div className="w-[50vw] flex justify-between space-x-1  flex-wrap p-2">
                                        {option.map((e) => (
                                            <div className="w-[48%]">
                                                {/* <div className="" key={e.id?.toString()}>
                          <label className="text-[#344054] font-normal text-sm mb-1 ">
                            {props.dataLang?.suppliers_supplier_fullname}
                          </label>
                          <input
                            value={e.full_name}
                            placeholder={
                              props.dataLang?.suppliers_supplier_fullname
                            }
                            onChange={_OnChangeOption.bind(
                              this,
                              e.id,
                              "full_name"
                            )}
                            name="optionVariant"
                            type="text"
                            className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
                          />
                          <label className="text-[#344054] font-normal text-sm mb-1 ">
                            {props.dataLang?.suppliers_supplier_phone}
                          </label>
                          <input
                            value={e.phone_number}
                            placeholder={
                              props.dataLang?.suppliers_supplier_phone
                            }
                            onChange={_OnChangeOption.bind(
                              this,
                              e.id,
                              "phone_number"
                            )}
                            name="fname"
                            type="number"
                            className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
                          />
                          <label className="text-[#344054] font-normal text-sm mb-1 ">
                            {props.dataLang?.suppliers_supplier_email}
                          </label>
                          <input
                            value={e.email}
                            placeholder={
                              props.dataLang?.suppliers_supplier_email
                            }
                            onChange={_OnChangeOption.bind(this, e.id, "email")}
                            name="optionEmail"
                            type="text"
                            className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
                          />
                          <label className="text-[#344054] font-normal text-sm mb-1 ">
                            {props.dataLang?.suppliers_supplier_pos}
                          </label>
                          <input
                            value={e.position}
                            placeholder={props.dataLang?.suppliers_supplier_pos}
                            onChange={_OnChangeOption.bind(
                              this,
                              e.id,
                              "position"
                            )}
                            name="fname"
                            type="text"
                            className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
                          />
                          <label className="text-[#344054] font-normal text-sm mb-1 ">
                            {props.dataLang?.suppliers_supplier_adress}
                          </label>
                          <textarea
                            value={e.address}
                            placeholder={
                              props.dataLang?.suppliers_supplier_adress
                            }
                            onChange={_OnChangeOption.bind(
                              this,
                              e.id,
                              "address"
                            )}
                            name="fname"
                            type="text"
                            className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full min-h-[90px] max-h-[200px] bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-2 border outline-none mb-2"
                          />
                          <ButtonDelete
                            onClick={_HandleDelete.bind(this, e.id)}
                          />
                        </div> */}
                                                <FormContact
                                                    dataLang={dataLang}
                                                    e={e}
                                                    _OnChangeOption={_OnChangeOption.bind(
                                                        this
                                                    )}
                                                    _HandleDelete={_HandleDelete.bind(
                                                        this
                                                    )}
                                                />
                                            </div>
                                        ))}
                                        <ButtonAdd
                                            onClick={_HandleAddNew.bind(this)}
                                            dataLang={dataLang}
                                        ></ButtonAdd>
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
export default Popup_dsncc;
