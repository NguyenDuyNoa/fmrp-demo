import React, { useEffect, useState, useMemo, useRef } from "react";

import Select, { components } from "react-select";
import { _ServerInstance as Axios } from "/services/axios";
import PopupEdit from "/components/UI/popup";
import { v4 as uuidv4 } from "uuid";

import Popup from "reactjs-popup";

import dynamic from "next/dynamic";

const ScrollArea = dynamic(() => import("react-scrollbar"), {
  ssr: false,
});

import {
  Edit as IconEdit,
  Grid6 as IconExcel,
  Trash as IconDelete,
  SearchNormal1 as IconSearch,
  Add as IconAdd,
} from "iconsax-react";

import Swal from "sweetalert2";
import ButtoonAdd from "./(button)/buttonAdd";
import ButtoonDelete from "./(button)/buttonDelete";
import FormContactInfo from "./(form)/formContactInfo";
import FormContactDelivery from "./(form)/formDelivery";
import Form from "./(form)/form";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
});

const Popup_dskh = (props) => {
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
  const [optionDelivery, sOptionDelivery] = useState([]);

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
  const [debt_limit, sDebt_limit] = useState("");
  const [debt_limit_day, sDebt_limit_day] = useState("");

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
    sDebt_limit("");
    sDebt_limit_day("");
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
    sValueChar([]);
    sListChar([]);
  }, [open]);

  const _ServerFetching_detailUser = async () => {
    await Axios(
      "GET",
      `/api_web/api_client/client/${props?.id}?csrf_protection=true`,
      {},
      (err, response) => {
        if (!err) {
          var db = response.data;

          sValueBr(
            db?.branch?.map((e) => ({ label: e.name, value: Number(e.id) }))
          );
          sValueChar(
            db?.staff_charge.map((e) => ({
              label: e.full_name,
              value: Number(e.staffid),
            }))
          );
          sValueGr(
            db?.client_group.map((e) => ({
              label: e.name,
              value: Number(e.id),
            }))
          );
          sName(db?.name);
          sCode(db?.code);
          sTaxcode(db?.tax_code);
          sRepresentative(db?.representative);
          sPhone(db?.phone_number);
          sAdress(db?.address);
          sEmail(db?.email);
          sDebt_limit(db?.debt_limit);
          sDebt_limit_day(db?.debt_limit_day);
          sDate_incorporation(db?.date_incorporation);
          sValueDis({
            label: db?.district.name,
            value: db?.district.districtid,
          });
          sValueCt(db?.city.provinceid);
          sNote(db?.note);
          sValueWa({ label: db?.ward.name, value: db?.ward.wardid });
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
    } else if (type == "debt_limit") {
      sDebt_limit(value.target?.value);
    } else if (type == "debt_limit_day") {
      sDebt_limit_day(value.target?.value);
    } else if (type == "valueBr") {
      sValueBr(value);
    } else if (type == "optionName") {
      sOptionName(value.target?.value);
    } else if (type == "optionHapy") {
      sOptionHapy(value.target?.value);
    } else if (type == "optionNote") {
      sOptionNote(value.target?.value);
    } else if (type == "optionPhone") {
      sOptionPhone(value.target?.value);
    }
  };

  // char..
  const [valueChar, sValueChar] = useState([]);

  const [listChar, sListChar] = useState([]);
  const _ServerFetching_Char = () => {
    Axios(
      "GET",
      `/api_web/api_staff/GetstaffInBrard?csrf_protection=true`,
      {
        params: {
          "brach_id[]": branch,
          staffid: branch ? branch : -1,
        },
      },
      (err, response) => {
        if (!err) {
          var db = response.data;
          if (valueChar?.length == 0) {
            sListChar(
              db?.map((e) => ({ label: e.name, value: Number(e.staffid) }))
            );
          } else if (props?.id) {
            sListChar(
              db
                ?.map((e) => ({ label: e.name, value: Number(e.staffid) }))
                ?.filter((e) => valueChar.some((x) => e.value !== x.value))
            );
          }
        }
        // sOnFetching(false)
        sOnFetchingBr(false);
      }
    );
  };
  // console.log(listChar)
  const char = valueChar?.map((e) => e.value);
  const handleChangeChar = (e) => {
    sValueChar(e);
  };

  useEffect(() => {
    onFetchingBr && _ServerFetching_Char();
  }, [onFetchingBr]);

  useEffect(() => {
    open && _ServerFetching_Char();
  }, [valueBr]);

  // branh
  const [brandpOpt, sListBrand] = useState([]);
  const branch_id = valueBr?.map((e) => {
    return e?.value;
  });

  // group
  const [valueGr, sValueGr] = useState([]);
  const [listGr, sListGr] = useState([]);
  const _ServerFetching_Gr = () => {
    Axios(
      "GET",
      `/api_web/Api_client/group?csrf_protection=true`,
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
              rResult?.map((e) => ({ label: e.name, value: Number(e.id) }))
            );
          } else if (props?.id) {
            sListGr(
              rResult
                ?.map((x) => ({ label: x.name, value: Number(x.id) }))
                ?.filter((e) => valueGr.some((x) => e.value !== x.value))
            );
          }
        }
        sOnFetchingGr(false);
      }
    );
  };
  const group = valueGr?.map((e) => e.value);
  const handleChangeGr = (e) => {
    sValueGr(e);
  };

  useEffect(() => {
    onFetchingBr && _ServerFetching_Gr();
  }, [onFetchingBr]);

  useEffect(() => {
    open && _ServerFetching_Gr();
  }, [valueBr]);

  // useEffect(() => {
  //   sOnFetchingBr(true)
  // }, [valueBr]);

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
  const _ServerFetching_distric = () => {
    Axios(
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
    sValueDis(e);
  };

  //fecth ward
  const [ward_id, sWard] = useState();
  const _ServerFetching_war = () => {
    Axios(
      "GET",
      "/api_web/Api_address/ward?limit=0",
      {
        params: {
          districtid: valueDis ? valueDis?.value : -1,
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
    sValueWa(e);
  };

  //post db
  const _ServerSending = () => {
    let id = props?.id;
    var data = new FormData();
    data.append("name", name);
    data.append("code", code);
    data.append("tax_code", tax_code);
    data.append("representative", representative);
    data.append("phone_number", phone_number);
    data.append("address", address);
    data.append("date_incorporation", date_incorporation);
    data.append("note", note);
    data.append("email", email);
    data.append("debt_limit", debt_limit);
    data.append("debt_limit_day", debt_limit_day);
    data.append("city", valueCt);
    data.append("district", valueDis?.value);
    data.append("ward", valueWa?.value);
    data.append("client_group_id", group);
    data.append("branch_id", branch_id);
    data.append("staff_charge", char);
    Axios(
      "POST",
      `${
        id
          ? `/api_web/api_client/client/${id}?csrf_protection=true`
          : "/api_web/api_client/client?csrf_protection=true"
      }`,
      {
        data: {
          name: name,
          code: code,
          tax_code: tax_code,
          representative: representative,
          phone_number: phone_number,
          address: address,
          date_incorporation: date_incorporation,
          note: note,
          email: email,
          debt_limit: debt_limit,
          debt_limit_day: debt_limit_day,
          city: valueCt,
          district: valueDis,
          ward: valueWa,
          branch_id: branch_id,
          staff_charge: char,
          client_group_id: group,
          contact: option,
        },
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
            sDebt_limit("");
            sDebt_limit_day("");
            sWard("");
            sOption([]);
            sValueBr([]);
            sGroupOpt([]);
            sValueChar([]);
          } else {
            Toast.fire({
              icon: "error",
              title: `${props.dataLang[message] + " " + branch_name} `,
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
    } else if (type === "birthday") {
      option[index].birthday = value.target?.value;
    } else if (type === "address") {
      option[index].address = value.target?.value;
    } else if (type === "phone_number") {
      option[index].phone_number = value.target?.value;
    }
    sOption([...option]);
  };

  // const _OnChangeOptionDelivery = (id, type, value) => {
  //   var index = optionDelivery.findIndex((x) => x.id === id);
  //   if (type == "nameDelivery") {
  //     optionDelivery[index].nameDelivery = value.target?.value;
  //   } else if (type === "addressDelivery") {
  //     optionDelivery[index].addressDelivery = value.target?.value;
  //   } else if (type === "phoneDelivery") {
  //     optionDelivery[index].phoneDelivery = value.target?.value;
  //   } else if (type === "actionDelivery") {
  //     optionDelivery[index].actionDelivery = value.target?.checked;
  //   }
  //   sOptionDelivery([...optionDelivery]);
  // };
  // const _OnChangeOptionDelivery = (id, type, value) => {
  //   const index = optionDelivery.findIndex((x) => x.id === id);
  //   if (index === -1) {
  //     return; // Kiểm tra xem id có tồn tại trong optionDelivery hay không
  //   }
  //   const updatedOptionDelivery = [...optionDelivery];
  //   updatedOptionDelivery[index] = {
  //     ...updatedOptionDelivery[index],
  //     [type]:
  //       type === "actionDelivery" ? value.target?.checked : value.target?.value,
  //   };
  //   sOptionDelivery(updatedOptionDelivery);
  // };
  const _OnChangeOptionDelivery = (id, type, value) => {
    const updatedOptionDelivery = optionDelivery.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          [type]:
            type === "actionDelivery"
              ? value.target?.checked
              : value.target?.value,
        };
      } else if (type === "actionDelivery" && value.target.checked) {
        return { ...item, actionDelivery: false };
      }
      return item;
    });

    sOptionDelivery(updatedOptionDelivery);
  };

  console.log("optionDelivery", optionDelivery);
  // add option form
  const _HandleAddNew = () => {
    sOption([
      ...option,
      {
        id: Date.now(),
        full_name: optionfull_name,
        email: optionEmail,
        position: optionposition,
        birthday: optionbirthday,
        address: optionaddress,
        phone_number: optionphone_number,
      },
    ]);
    sOptionFull_name("");
    sOptionEmail("");
    sPosition("");
    sOptionBirthday("");
    sOptionAddress("");
    sOptionPhone_number("");
  };

  const _HandleAddNewDelivery = () => {
    const newData = {
      id: uuidv4(),
      nameDelivery: null,
      phoneDelivery: null,
      addressDelivery: null,
      actionDelivery: false,
    };
    sOptionDelivery([...optionDelivery, newData]);
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

  const _HandleDeleteDelivery = (id) => {
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
        sOptionDelivery([...optionDelivery.filter((x) => x.id !== id)]);
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
    open && sOnFetchingChar(true);
  }, [valueBr]);
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

  // useEffect(()=>{
  //   onFetchingChar && _ServerFetching_Char()
  // },[onFetchingChar])
  return (
    <>
      <PopupEdit
        title={
          props.id
            ? `${props.dataLang?.client_popup_edit}`
            : `${props.dataLang?.client_popup_add}`
        }
        button={
          props.id ? <IconEdit /> : `${props.dataLang?.branch_popup_create_new}`
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
          <button
            onClick={_HandleSelectTab.bind(this, 2)}
            className={`${
              tab === 2
                ? "text-[#0F4F9E]  border-b-2 border-[#0F4F9E]"
                : "hover:text-[#0F4F9E] "
            }  px-4 py-2 outline-none font-semibold`}
          >
            {"Thông tin giao hàng"}
          </button>
        </div>
        <div className="mt-4">
          <form onSubmit={_HandleSubmit.bind(this)} className="">
            {tab === 0 && (
              <ScrollArea
                ref={scrollAreaRef}
                className="3xl:h-[600px]  2xl:h-[470px] xl:h-[380px] lg:h-[350px] h-[400px] overflow-hidden"
                speed={1}
                smoothScrolling={true}
              >
                <Form
                  code={code}
                  name={name}
                  representative={representative}
                  email={email}
                  phone_number={phone_number}
                  tax_code={tax_code}
                  date_incorporation={date_incorporation}
                  address={address}
                  dataLang={props.dataLang}
                  errInput={errInput}
                  errInputBr={errInputBr}
                  handleMenuOpen={handleMenuOpen}
                  handleChangeChar={handleChangeChar}
                  handleChangeGr={handleChangeGr}
                  handleChangeCt={handleChangeCt}
                  handleChangeDtric={handleChangeDtric}
                  handleChangeWar={handleChangeWar}
                  valueBr={valueBr}
                  valueChar={valueChar}
                  valueGr={valueGr}
                  valueCt={valueCt}
                  valueDis={valueDis}
                  valueWa={valueWa}
                  listChar={listChar}
                  listGr={listGr}
                  cityOpt={cityOpt}
                  ditrict={ditrict}
                  listWar={listWar}
                  brandpOpt={brandpOpt}
                  debt_limit={debt_limit}
                  debt_limit_day={debt_limit_day}
                  note={note}
                  _HandleChangeInput={_HandleChangeInput.bind(this)}
                />
                {/* <div className="w-[50vw]  p-2  ">
                  <div className="flex flex-wrap justify-between ">
                    <div className="w-[48%]">
                      <label className="text-[#344054] font-normal text-sm mb-1 ">
                        {props.dataLang?.client_list_namecode}{" "}
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
                        {props.dataLang?.client_list_name}
                        <span className="text-red-500">*</span>
                      </label>
                      <div>
                        <input
                          value={name}
                          onChange={_HandleChangeInput.bind(this, "name")}
                          placeholder={props.dataLang?.client_list_name}
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
                            {props.dataLang?.client_list_nameuser}
                          </label>
                        )}
                      </div>
                      <label className="text-[#344054] font-normal text-sm mb-1 ">
                        {props.dataLang?.client_list_repre}
                      </label>
                      <input
                        value={representative}
                        placeholder={props.dataLang?.client_list_repre}
                        onChange={_HandleChangeInput.bind(
                          this,
                          "representative"
                        )}
                        name="fname"
                        type="text"
                        className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
                      />
                      <label className="text-[#344054] font-normal text-sm mb-1 ">
                        {props.dataLang?.client_popup_mail}
                      </label>
                      <input
                        value={email}
                        onChange={_HandleChangeInput.bind(this, "email")}
                        placeholder={props.dataLang?.client_popup_mail}
                        name="fname"
                        type="email"
                        className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
                      />
                      <label className="text-[#344054] font-normal text-sm mb-1 ">
                        {props.dataLang?.client_list_phone}
                      </label>
                      <input
                        value={phone_number}
                        placeholder={props.dataLang?.client_list_phone}
                        onChange={_HandleChangeInput.bind(this, "phone_number")}
                        name="fname"
                        type="text"
                        className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
                      />
                      <label className="text-[#344054] font-normal text-sm mb-1 ">
                        {props.dataLang?.client_list_taxtcode}
                      </label>
                      <input
                        value={tax_code}
                        placeholder={props.dataLang?.client_list_taxtcode}
                        onChange={_HandleChangeInput.bind(this, "tax_code")}
                        name="fname"
                        type="text"
                        className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
                      />
                      <label className="text-[#344054] font-normal text-sm mb-1 ">
                        {props.dataLang?.client_popup_date}
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

                      <label className="text-[#344054] font-normal text-sm mb-1 ">
                        {props.dataLang?.client_popup_adress}
                      </label>
                      <textarea
                        value={address}
                        placeholder={props.dataLang?.client_popup_adress}
                        onChange={_HandleChangeInput.bind(this, "address")}
                        name="fname"
                        type="text"
                        className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full min-h-[40px] h-[40px] max-h-[200px] bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-2 border outline-none mb-2"
                      />
                    </div>
                    <div className="w-[48%]">
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
                        {props.dataLang?.client_popup_char}
                      </label>
                      <Select
                        closeMenuOnSelect={false}
                        placeholder={props.dataLang?.client_popup_char}
                        options={listChar}
                        isSearchable={true}
                        onChange={handleChangeChar}
                        isMulti
                        value={valueChar}
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
                        className={`${
                          errInputBr
                            ? "border-red-500"
                            : "focus:border-[#92BFF7] border-[#d0d5dd]"
                        } placeholder:text-slate-300 w-full  text-[#52575E] font-normal border outline-none mb-2 rounded-[5.5px] bg-white border-none xl:text-base text-[14.5px]`}
                      />
                      <label className="text-[#344054] font-normal text-sm mb-1 ">
                        {props.dataLang?.client_list_group}
                      </label>
                      <Select
                        placeholder={props.dataLang?.client_list_group}
                        noOptionsMessage={() => "Không có dữ liệu"}
                        options={listGr}
                        //hihi
                        value={valueGr}
                        onChange={handleChangeGr}
                        isSearchable={true}
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
                        {props.dataLang?.client_popup_limit}
                      </label>
                      <input
                        value={debt_limit}
                        onChange={_HandleChangeInput.bind(this, "debt_limit")}
                        placeholder={props.dataLang?.client_popup_limit}
                        name="fname"
                        type="text"
                        className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
                      />
                      <div>
                        <label className="text-[#344054] font-normal text-sm mb-1 ">
                          {props.dataLang?.client_popup_days}
                        </label>
                        <input
                          value={debt_limit_day}
                          onChange={_HandleChangeInput.bind(
                            this,
                            "debt_limit_day"
                          )}
                          name="fname"
                          placeholder={props.dataLang?.client_popup_days}
                          type="text"
                          className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
                        />
                      </div>
                      <div>
                        <label className="text-[#344054] font-normal text-sm mb-1 ">
                          {props.dataLang?.client_popup_city}
                        </label>
                        <Select
                          placeholder={props.dataLang?.client_popup_city}
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
                          {props.dataLang?.client_popup_district}
                        </label>
                        <Select
                          placeholder={props.dataLang?.client_popup_district}
                          options={ditrict}
                          // value={valueDis ? {label: ditrict?.find(x => x.value == valueDis)?.label, value: valueDis} : null}
                          value={valueDis}
                          onChange={handleChangeDtric}
                          isSearchable={true}
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
                          {props.dataLang?.client_popup_wards}
                        </label>
                        <Select
                          placeholder={props.dataLang?.client_popup_wards}
                          options={listWar}
                          // value={valueWa ? {label: listWar?.find(x => x.value == valueWa)?.label, value: valueWa} : null}
                          value={valueWa}
                          onChange={handleChangeWar}
                          isSearchable={true}
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
                    </div>
                    <label className="text-[#344054] font-normal text-sm mb-1 ">
                      {props.dataLang?.client_popup_note}
                    </label>
                    <textarea
                      value={note}
                      placeholder={props.dataLang?.client_popup_note}
                      onChange={_HandleChangeInput.bind(this, "note")}
                      name="fname"
                      type="text"
                      className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full min-h-[40px] max-h-[200px] bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-2 border outline-none mb-2"
                    />
                  </div>
                </div> */}
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
                    {/* {option.map((e) => (
                      <div className="w-[48%]">
                        <div className="" key={e.id?.toString()}>
                          <label className="text-[#344054] font-normal text-sm mb-1 ">
                            {props.dataLang?.client_popup_fiandlass}
                          </label>
                          <input
                            value={e.full_name}
                            onChange={_OnChangeOption.bind(
                              this,
                              e.id,
                              "full_name"
                            )}
                            name="optionVariant"
                            type="text"
                            placeholder="Họ và tên"
                            className="focus:border-[#92BFF7] placeholder:text-xs border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
                          />
                          <label className="text-[#344054] font-normal text-sm mb-1 ">
                            {props.dataLang?.client_popup_phone}
                          </label>
                          <input
                            value={e.phone_number}
                            onChange={_OnChangeOption.bind(
                              this,
                              e.id,
                              "phone_number"
                            )}
                            name="fname"
                            type="number"
                            placeholder="Số điện thoại"
                            className="focus:border-[#92BFF7] placeholder:text-xs border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
                          />
                          <label className="text-[#344054] font-normal text-sm mb-1 ">
                            Email
                          </label>
                          <input
                            value={e.email}
                            onChange={_OnChangeOption.bind(this, e.id, "email")}
                            name="optionEmail"
                            type="text"
                            placeholder="Email"
                            className="focus:border-[#92BFF7] placeholder:text-xs border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
                          />
                          <label className="text-[#344054] font-normal text-sm mb-1 ">
                            {props.dataLang?.client_popup_position}
                          </label>
                          <input
                            value={e.position}
                            onChange={_OnChangeOption.bind(
                              this,
                              e.id,
                              "position"
                            )}
                            name="fname"
                            type="text"
                            placeholder="Chức vụ"
                            className="focus:border-[#92BFF7] placeholder:text-xs border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
                          />
                          <label className="text-[#344054] font-normal text-sm mb-1 ">
                            {props.dataLang?.client_popup_birthday}
                          </label>
                          <input
                            value={e.birthday}
                            onChange={_OnChangeOption.bind(
                              this,
                              e.id,
                              "birthday"
                            )}
                            name="fname"
                            type="date"
                            className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
                          />
                          <label className="text-[#344054] font-normal text-sm mb-1 ">
                            {props.dataLang?.client_popup_adress}
                          </label>
                          <textarea
                            value={e.address}
                            onChange={_OnChangeOption.bind(
                              this,
                              e.id,
                              "address"
                            )}
                            name="fname"
                            type="text"
                            placeholder="Địa chỉ"
                            className="focus:border-[#92BFF7] placeholder:text-xs border-[#d0d5dd] placeholder:text-slate-300 w-full min-h-[90px] max-h-[200px] bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-2 border outline-none mb-2"
                          />
                          <ButtoonDelete
                            onClick={_HandleDelete.bind(this, e.id)}
                          >
                            <IconDelete className="group-hover:text-white animate-bounce transition  duration-200 ease-linea" />
                          </ButtoonDelete>
                        </div>
                      </div>
                    ))} */}
                    {option.map((e) => (
                      <FormContactInfo
                        key={e.id?.toString()}
                        option={e}
                        dataLang={props.dataLang}
                        _OnChangeOption={_OnChangeOption.bind(this)}
                        onDelete={_HandleDelete.bind(this)}
                      >
                        <IconDelete className="group-hover:text-white animate-bounce transition  duration-200 ease-linea" />
                      </FormContactInfo>
                    ))}
                    <ButtoonAdd onClick={_HandleAddNew.bind(this)}>
                      <IconAdd className="animate-bounce" />
                      {props.dataLang?.client_popup_addcontact}
                    </ButtoonAdd>
                  </div>
                </ScrollArea>
              </div>
            )}
            {tab === 2 && (
              <div>
                <ScrollArea
                  className="min-h-[0px] max-h-[550px] overflow-hidden"
                  speed={1}
                  smoothScrolling={true}
                >
                  <div className="w-[50vw] flex justify-between space-x-1  flex-wrap p-2">
                    {/* {optionDelivery.map((e) => (
                      <div className="w-[48%] bg-white shadow-lg rounded-xl">
                        <div className="p-3" key={e.id?.toString()}>
                          <label className="text-[#344054] font-normal text-sm mb-1 ">
                            {"Tên"}
                          </label>
                          <input
                            value={e.nameDelivery}
                            onChange={_OnChangeOptionDelivery.bind(
                              this,
                              e.id,
                              "nameDelivery"
                            )}
                            placeholder="Tên người nhận"
                            name="optionVariant"
                            type="text"
                            className="focus:border-[#92BFF7] placeholder:text-xs border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
                          />
                          <label className="text-[#344054] font-normal text-sm mb-1 ">
                            {props.dataLang?.client_popup_phone}
                          </label>
                          <input
                            value={e.phoneDelivery}
                            onChange={_OnChangeOptionDelivery.bind(
                              this,
                              e.id,
                              "phoneDelivery"
                            )}
                            name="fname"
                            type="number"
                            placeholder="Số điện thoại"
                            className="focus:border-[#92BFF7] placeholder:text-xs border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
                          />

                          <label className="text-[#344054] font-normal text-sm mb-1 ">
                            {props.dataLang?.client_popup_adress}
                          </label>
                          <textarea
                            value={e.addressDelivery}
                            onChange={_OnChangeOptionDelivery.bind(
                              this,
                              e.id,
                              "addressDelivery"
                            )}
                            name="fname"
                            type="text"
                            placeholder="Ghi chú"
                            className="focus:border-[#92BFF7] placeholder:text-xs border-[#d0d5dd] placeholder:text-slate-300 w-full min-h-[90px] max-h-[200px] bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-2 border outline-none "
                          />
                          <div className="flex items-center ">
                            <label
                              className="relative flex cursor-pointer items-center rounded-full p-3 gap-3.5"
                              htmlFor={e.id}
                              data-ripple-dark="true"
                            >
                              <input
                                type="checkbox"
                                className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-indigo-500 checked:bg-indigo-500 checked:before:bg-indigo-500 hover:before:opacity-10"
                                id={e.id}
                                value={e.actionDelivery}
                                checked={e.actionDelivery}
                                onChange={_OnChangeOptionDelivery.bind(
                                  this,
                                  e.id,
                                  "actionDelivery"
                                )}
                              />
                              <div className="pointer-events-none absolute top-2/4 3xl:left-[7%] 2xl:left-[7%] xl:left-[7%] lg:left-[7%] left-[7%] -translate-y-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
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
                                  {"Địa chỉ giao hàng chính"}
                                </span>
                              </div>
                            </label>
                          </div>
                          <ButtoonDelete
                            onClick={_HandleDeleteDelivery.bind(this, e.id)}
                          >
                            <IconDelete className="group-hover:text-white animate-bounce transition  duration-200 ease-linea" />
                          </ButtoonDelete>
                        </div>
                      </div>
                    ))} */}
                    {optionDelivery.map((e) => (
                      <FormContactDelivery
                        key={e.id?.toString()}
                        optionDelivery={e}
                        dataLang={props.dataLang}
                        _OnChangeOptionDelivery={_OnChangeOptionDelivery.bind(
                          this
                        )}
                        onDelete={_HandleDeleteDelivery.bind(this)}
                      >
                        <IconDelete className="group-hover:text-white animate-bounce transition  duration-200 ease-linea" />
                      </FormContactDelivery>
                    ))}
                    <ButtoonAdd onClick={_HandleAddNewDelivery.bind(this)}>
                      <IconAdd className="animate-bounce" />
                      {"Thêm địa chỉ giao hàng"}
                    </ButtoonAdd>
                  </div>
                </ScrollArea>
              </div>
            )}
            <div className="text-right mt-5 space-x-2">
              <button
                type="button"
                onClick={_ToggleModal.bind(this, false)}
                className="button text-[#344054] font-normal text-base py-2 px-4 rounded-[5.5px] border border-solid border-[#D0D5DD] hover:scale-105 transition-all ease-linear"
              >
                {props.dataLang?.branch_popup_exit}
              </button>
              <button
                type="submit"
                className="button text-[#FFFFFF]  font-normal text-base py-2 px-4 rounded-[5.5px] bg-[#0F4F9E] hover:scale-105 transition-all ease-linear"
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
export default Popup_dskh;
