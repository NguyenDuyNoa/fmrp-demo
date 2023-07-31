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
    sCode(null);
    sTaxcode(null);
    sRepresentative(null);
    sPhone(null);
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
    sOptionDelivery(props.optionDelivery ? props.optionDelivery : []);
    sTab(0);
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
          sOptionDelivery(
            db?.clients_address_delivery?.map((e) => ({
              id: e?.id,
              nameDelivery: e?.fullname,
              phoneDelivery: e?.phone,
              addressDelivery: e?.address,
              actionDelivery: e?.is_primary == "1" ? true : false,
              idUpdate: e?.id,
            }))
          );
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

  console.log("option", option);
  const _ServerSending = () => {
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
    data.append("debt_limit", debt_limit ? debt_limit : "");
    data.append("debt_limit_day", debt_limit_day ? debt_limit_day : "");
    data.append("city", valueCt ? valueCt : "");
    data.append("district", valueDis?.value ? valueDis?.value : "");
    data.append("ward", valueWa?.value ? valueWa?.value : "");
    // data.append("client_group_id", group ? group : "");
    // data.append("branch_id", branch_id ? branch_id : "");
    valueBr?.forEach((e, index) => {
      data.append(`branch_id[${index}]`, e?.value ? e?.value : "");
    });
    valueGr?.forEach((e, index) => {
      data.append(`client_group_id[${index}]`, e?.value ? e?.value : "");
    });
    valueChar?.forEach((e, index) => {
      data.append(`staff_charge[${index}]`, e?.value ? e?.value : "");
    });
    // data.append("staff_charge", char ? char : "");
    option?.forEach((e, index) => {
      data.append(`contact[${index}][id]`, e?.id);
      data.append(`contact[${index}][full_name]`, e?.full_name);
      data.append(`contact[${index}][email]`, e?.email);
      data.append(`contact[${index}][position]`, e?.position);
      data.append(`contact[${index}][birthday]`, e?.birthday);
      data.append(`contact[${index}][address]`, e?.address);
      data.append(`contact[${index}][phone_number]`, e?.phone_number);
    });
    optionDelivery?.forEach((e, index) => {
      data.append(`items[${index}][id]`, id ? e?.idUpdate : "");
      data.append(
        `items[${index}][fullname]`,
        e?.nameDelivery ? e?.nameDelivery : ""
      );
      data.append(
        `items[${index}][phone]`,
        e?.phoneDelivery ? e?.phoneDelivery : ""
      );
      data.append(
        `items[${index}][address]`,
        e?.addressDelivery ? e?.addressDelivery : ""
      );
      data.append(`items[${index}][is_primary]`, e?.actionDelivery ? 1 : 0);
    });
    Axios(
      "POST",
      `${
        id
          ? `/api_web/api_client/client/${id}?csrf_protection=true`
          : "/api_web/api_client/client?csrf_protection=true"
      }`,
      {
        // data: {
        //   name: name,
        //   code: code,
        //   tax_code: tax_code,
        //   representative: representative,
        //   phone_number: phone_number,
        //   address: address,
        //   date_incorporation: date_incorporation ? date_incorporation : "",
        //   note: note,
        //   email: email,
        //   debt_limit: debt_limit,
        //   debt_limit_day: debt_limit_day,
        //   city: valueCt,
        //   district: valueDis,
        //   ward: valueWa,
        //   branch_id: branch_id,
        //   staff_charge: char,
        //   client_group_id: group,
        //   contact: option,
        // },
        data: data,
        headers: { "Content-Type": "multipart/form-data" },
      },
      (err, response) => {
        if (!err) {
          var { isSuccess, message, branch_name } = response.data;
          if (isSuccess) {
            Toast.fire({
              icon: "success",
              title: `${
                typeof props?.dataLang[message] !== "undefined"
                  ? props?.dataLang[message]
                  : message
              }`,
            });
            props.onRefresh && props.onRefresh();
            sOpen(false);
            sErrInput(false);
            sErrInputBr(false);
            sName("");
            sCode(null);
            sTaxcode(null);
            sRepresentative(null);
            sTab(0);
            sDate_incorporation("");
            sPhone(null);
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
            sOptionDelivery([]);
          } else {
            Toast.fire({
              icon: "error",
              title: `${
                typeof props?.dataLang[message] !== "undefined"
                  ? props.dataLang[message] + " " + branch_name
                  : message
              } `,
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
    } else if (type == "birthday") {
      option[index].birthday = value.target?.value;
    } else if (type == "address") {
      option[index].address = value.target?.value;
    } else if (type == "phone_number") {
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
      idUpdate: "",
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
            {props.dataLang?.client_popup_devivelyInfo}
          </button>
        </div>
        <div className="mt-4">
          <form onSubmit={_HandleSubmit.bind(this)} className="">
            {tab === 0 && (
              <ScrollArea
                ref={scrollAreaRef}
                className="3xl:h-[600px]  2xl:h-[470px] xl:h-[380px] lg:h-[350px] h-[400px] overflow-hidden "
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
                      {props.dataLang?.client_popup_devivelyAdd}
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
