import React, { useEffect, useState, useMemo, useRef } from "react";

import { _ServerInstance as Axios } from "/services/axios";
import PopupEdit from "/components/UI/popup";
import dynamic from "next/dynamic";

const ScrollArea = dynamic(() => import("react-scrollbar"), {
  ssr: false,
});
import Loading from "components/UI/loading";
import Popup from "reactjs-popup";
import moment from "moment/moment";
import {
  Edit as IconEdit,
  Grid6 as IconExcel,
  Trash as IconDelete,
  SearchNormal1 as IconSearch,
  Add as IconAdd,
  Map,
} from "iconsax-react";
import TableContact from "./(table)/tableContact";
import TableDelivery from "./(table)/tableDelivery";
import ImageErrors from "components/UI/imageErrors";
import { Tooltip } from "react-tippy";

const Popup_chitiet = (props) => {
  const scrollAreaRef = useRef(null);

  const [open, sOpen] = useState(false);

  const _ToggleModal = (e) => sOpen(e);

  const [tab, sTab] = useState(0);

  const _HandleSelectTab = (index) => sTab(index);

  const [data, sData] = useState();

  const [onFetching, sOnFetching] = useState(false);

  useEffect(() => {
    props?.id && sOnFetching(true);
  }, [open]);

  const _ServerFetching_detailUser = () => {
    Axios(
      "GET",
      `/api_web/api_client/client/${props?.id}?csrf_protection=true`,
      {},
      (err, response) => {
        if (!err) {
          var db = response.data;

          sData(db);
        }
        sOnFetching(false);
      }
    );
  };

  useEffect(() => {
    onFetching && _ServerFetching_detailUser();
  }, [open]);

  const formatNumber = (number) => {
    if (!number && number !== 0) return 0;
    const integerPart = Math.floor(number);
    const decimalPart = number - integerPart;
    const roundedDecimalPart = decimalPart >= 0.05 ? 1 : 0;
    const roundedNumber = integerPart + roundedDecimalPart;
    return roundedNumber.toLocaleString("en");
  };

  const TabButtons = [
    {
      index: 0,
      label: props.dataLang?.client_popup_general,
    },
    {
      index: 1,
      label: props.dataLang?.client_popup_detailContact,
    },
    {
      index: 2,
      label: props.dataLang?.client_popup_devivelyInfo,
    },
  ];
  return (
    <>
      <PopupEdit
        title={props.dataLang?.client_popup_detailUser}
        button={props?.name}
        onClickOpen={_ToggleModal.bind(this, true)}
        open={open}
        onClose={_ToggleModal.bind(this, false)}
        classNameBtn={props?.className}
      >
        <div className="flex items-center space-x-4 my-3 border-[#E7EAEE] border-opacity-70 border-b-[1px]">
          {TabButtons.map((tabItem) => (
            <button
              key={tabItem.index}
              onClick={_HandleSelectTab.bind(this, tabItem.index)}
              className={`px-4 py-2 outline-none font-semibold ${
                tab === tabItem.index
                  ? "text-[#0F4F9E] border-b-2 border-[#0F4F9E]"
                  : "hover:text-[#0F4F9E]"
              }`}
            >
              {tabItem.label}
            </button>
          ))}
        </div>
        <div className="mt-4 space-x-5 w-[930px] 3xl:h-[500px] 2xl:h-[500px] xl:h-[500px]  lg:h-[400px] h-[500px]">
          {tab === 0 && (
            <ScrollArea
              ref={scrollAreaRef}
              className="w-[930px] 3xl:h-[500px] 2xl:h-[500px] xl:h-[500px]  lg:h-[400px] h-[500px] overflow-hidden "
              speed={1}
              smoothScrolling={true}
            >
              {onFetching ? (
                <Loading className="h-80" color="#0f4f9e" />
              ) : (
                data != "" && (
                  <div className="flex gap-5 rounded-md ">
                    <div className="w-[50%] bg-slate-100/40 rounded-md">
                      <div className="mb-4 h-[50px] flex justify-between items-center p-2">
                        <span className="text-slate-400 text-sm w-[25%]">
                          {props.dataLang?.client_list_namecode}:
                        </span>{" "}
                        <span className="font-normal capitalize">
                          {data?.code}
                        </span>
                      </div>
                      <div className="mb-4 flex justify-between flex-wrap p-2">
                        <span className="text-slate-400 text-sm      w-[25%]">
                          {props.dataLang?.client_list_name}:
                        </span>{" "}
                        <span className="font-normal capitalize">
                          {data?.name}
                        </span>
                      </div>
                      <div className="mb-4 flex justify-between items-center p-2">
                        <span className="text-slate-400 text-sm   w-[25%]">
                          {props.dataLang?.client_list_repre}:
                        </span>{" "}
                        <span className="font-normal capitalize">
                          {data?.representative}
                        </span>
                      </div>
                      <div className="mb-4 flex justify-between  items-center p-2">
                        <span className="text-slate-400 text-sm  w-[25%]">
                          {props.dataLang?.client_popup_mail}:
                        </span>{" "}
                        <span className="font-normal">{data?.email}</span>
                      </div>
                      <div className="mb-4 flex justify-between items-center p-2">
                        <span className="text-slate-400 text-sm   w-[25%]">
                          {props.dataLang?.client_popup_phone}:
                        </span>{" "}
                        <span className="font-normal capitalize">
                          {data?.phone_number}
                        </span>
                      </div>
                      <div className="mb-4 flex justify-between items-center p-2">
                        <span className="text-slate-400 text-sm   w-[25%]">
                          {props.dataLang?.client_list_taxtcode}:
                        </span>{" "}
                        <span className="font-normal capitalize">
                          {data?.tax_code}
                        </span>
                      </div>
                      <div className="mb-4 flex justify-between items-center p-2">
                        <span className="text-slate-400 text-sm   w-[25%]">
                          {props.dataLang?.client_popup_adress}:
                        </span>{" "}
                        <span className="font-normal capitalize">
                          {data?.address}
                        </span>
                      </div>
                      <div className="mb-4 flex justify-between items-center p-2">
                        <span className="text-slate-400 text-sm   w-[25%]">
                          {props.dataLang?.client_popup_note}:{" "}
                        </span>{" "}
                        <span className="font-medium capitalize">
                          {data?.note}
                        </span>
                      </div>
                    </div>
                    <div className="w-[50%] bg-slate-100/40">
                      <div className="mb-4 min-h-[50px] max-h-[auto] flex  p-2 justify-between  items-center flex-wrap">
                        <span className="text-slate-400 text-sm">
                          {props.dataLang?.client_popup_char}:
                        </span>
                        <span className="flex flex-wrap">
                          {data?.staff_charge
                            ? data?.staff_charge?.map((e) => {
                                return (
                                  <span className="font-normal capitalize   ml-1">
                                    {/* <Popup
                                  className="dropdown-avt"
                                  key={e.id}
                                  trigger={(open) => (
                                    <img
                                      src={e.profile_image}
                                      width={40}
                                      height={40}
                                      className="object-cover rounded-[100%]"
                                    ></img>
                                  )}
                                  position="top center"
                                  on={["hover"]}
                                  arrow={false}
                                >
                                  <span className="bg-[#0f4f9e] text-white rounded p-1.5">
                                    {e.full_name}{" "}
                                  </span>
                                </Popup> */}
                                    <Tooltip
                                      title={e.full_name}
                                      arrow
                                      theme="dark"
                                    >
                                      <ImageErrors
                                        src={e.profile_image}
                                        width={40}
                                        height={40}
                                        defaultSrc="/user-placeholder.jpg"
                                        alt="Image"
                                        className="object-cover rounded-[100%] text-left"
                                      />
                                    </Tooltip>
                                  </span>
                                );
                              })
                            : ""}
                        </span>
                      </div>
                      <div className="mb-4 flex justify-between  p-2 items-center flex-wrap">
                        <span className="text-slate-400 text-sm">
                          {props.dataLang?.client_list_brand}:
                        </span>{" "}
                        <span className="flex justify-between space-x-1">
                          {data?.branch?.map((e) => {
                            return (
                              <span className="last:ml-0 font-normal capitalize  w-fit xl:text-base text-xs px-2 text-[#0F4F9E] border border-[#0F4F9E] rounded-[5.5px]">
                                {" "}
                                {e.name}
                              </span>
                            );
                          })}
                        </span>
                      </div>
                      <div className="mb-4 justify-between  items-center p-2 flex space-x-2">
                        <span className="text-slate-400 text-sm">
                          {props.dataLang?.client_list_group}:
                        </span>{" "}
                        <span className="flex justify-between space-x-1">
                          {data?.client_group?.map((e) => {
                            return (
                              <span
                                style={{
                                  backgroundColor: `${
                                    e.color == "" || e.color == null
                                      ? "#e2f0fe"
                                      : e.color
                                  }`,
                                  color: `${
                                    e.color == "" ? "#0F4F9E" : "#0F4F9E"
                                  }`,
                                }}
                                className="last:ml-0 font-normal capitalize  w-fit xl:text-base text-xs px-2   rounded-[5.5px]"
                              >
                                {e.name}{" "}
                              </span>
                            );
                          })}
                        </span>
                      </div>
                      <div className="mb-4 flex justify-between items-center p-2">
                        <span className="text-slate-400 text-sm">
                          {props.dataLang?.client_popup_limit}:
                        </span>{" "}
                        <span className="font-normal capitalize">
                          {formatNumber(data?.debt_limit)}
                        </span>
                      </div>
                      <div className="mb-4 flex justify-between items-center p-2">
                        <span className="text-slate-400 text-sm">
                          {props.dataLang?.client_popup_days}:
                        </span>{" "}
                        <span className="font-normal capitalize">
                          {formatNumber(data?.debt_limit_day)}
                        </span>
                      </div>
                      <div className="mb-4 flex justify-between items-center p-2">
                        <span className="text-slate-400 text-sm">
                          {props.dataLang?.client_popup_date}:
                        </span>{" "}
                        <span className="font-normal capitalize">
                          {data?.date_incorporation != null &&
                          data?.date_incorporation != "0000-00-00"
                            ? moment(data?.date_incorporation).format(
                                "DD/MM/YYYY"
                              )
                            : ""}
                        </span>
                      </div>
                      <div className="mb-4 flex justify-between items-center p-2">
                        <span className="text-slate-400 text-sm">
                          {props.dataLang?.client_popup_city}:
                        </span>{" "}
                        <span className="font-normal capitalize">
                          {data?.city != ""
                            ? data?.city.type + " " + data?.city.name
                            : ""}
                        </span>
                      </div>
                      <div className="mb-4 flex justify-between p-2 items-center">
                        <span className="text-slate-400 text-sm">
                          {props.dataLang?.client_popup_district}:{" "}
                        </span>
                        <span className="font-normal capitalize">
                          {data?.district != ""
                            ? data?.district.type + " " + data?.district.name
                            : ""}
                        </span>
                        ,
                        <span className="text-slate-400 text-sm">
                          {props.dataLang?.client_popup_wards}:
                        </span>
                        <span className="font-normal capitalize">
                          {data?.ward != ""
                            ? data?.ward.type + " " + data?.ward.name
                            : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              )}
            </ScrollArea>
          )}
          {tab === 1 && (
            <TableContact
              onFetching={onFetching}
              data={data}
              dataLang={props.dataLang}
            >
              <IconSearch />
            </TableContact>
          )}
          {tab === 2 && (
            <TableDelivery
              onFetching={onFetching}
              data={data}
              dataLang={props.dataLang}
            >
              <IconSearch />
            </TableDelivery>
          )}
        </div>
      </PopupEdit>
    </>
  );
};
export default Popup_chitiet;
