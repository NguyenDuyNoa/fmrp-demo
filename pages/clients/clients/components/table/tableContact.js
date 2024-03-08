import React from "react";
import Link from "next/link";
import Loading from "components/UI/loading";
import dynamic from "next/dynamic";
import moment from "moment";
const ScrollArea = dynamic(() => import("react-scrollbar"), {
  ssr: false,
});
const TableContact = (props) => {
  return (
    <div>
      <div className="w-[930px]">
        <div className="min:h-[200px] h-[72%] max:h-[400px]  overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
          <div className="pr-2 w-[100%] lx:w-[110%] ">
            <div className="flex items-center sticky top-0 bg-slate-100  z-10 ">
              <h4 className="xl:text-[14px] text-[12px] px-2 py-2 text-gray-500 uppercase w-[20%] font-[400] text-center">
                {props?.dataLang?.client_popup_detailName}
              </h4>
              <h4 className="xl:text-[14px] text-[12px] px-2 py-2 text-gray-500 uppercase w-[20%] font-[400] text-center">
                {props?.dataLang?.client_popup_phone}
              </h4>
              <h4 className="xl:text-[14px] text-[12px] px-2 py-2 text-gray-500 uppercase w-[15%] font-[400] text-center">
                {props?.dataLang?.client_popup_mail}
              </h4>
              <h4 className="xl:text-[14px] text-[12px] px-2 py-2 text-gray-500 uppercase w-[10%] font-[400] text-center">
                {props?.dataLang?.client_popup_position}
              </h4>
              <h4 className="xl:text-[14px] text-[12px] px-2 py-2 text-gray-500 uppercase w-[15%] font-[400] text-center">
                {props?.dataLang?.client_popup_birthday}
              </h4>
              <h4 className="xl:text-[14px] text-[12px] px-2 py-2 text-gray-500 uppercase w-[20%] font-[400] text-center">
                {props?.dataLang?.client_popup_adress}
              </h4>
            </div>
            {props?.onFetching ? (
              <Loading className="h-80" color="#0f4f9e" />
            ) : props?.data?.contact?.length > 0 ? (
              <>
                <ScrollArea
                  className="min-h-[455px] max-h-[455px] overflow-hidden"
                  speed={1}
                  smoothScrolling={true}
                >
                  <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[500px]">
                    {props?.data?.contact?.map((e) => (
                      <div
                        className="flex items-center py-1.5 px-2 hover:bg-slate-100/40 "
                        key={e?.id.toString()}
                      >
                        <h6 className="xl:text-base text-xs  px-2 py-0.5 w-[20%]  rounded-md text-left">
                          {e?.full_name}
                        </h6>
                        <h6 className="xl:text-base text-xs  px-2 py-0.5 w-[20%]  rounded-md text-center">
                          {e?.phone_number}
                        </h6>
                        <h6 className="xl:text-base text-xs  px-2 py-0.5 w-[15%]  rounded-md text-left break-words">
                          {e?.email}
                        </h6>
                        <h6 className="xl:text-base text-xs  px-2 py-0.5 w-[10%]  rounded-md text-left break-words">
                          {e?.position}
                        </h6>
                        <h6 className="xl:text-base text-xs  px-2 py-0.5 w-[15%]  rounded-md text-center">
                          {e?.birthday != "0000-00-00"
                            ? moment(e?.birthday).format("DD/MM/YYYY")
                            : ""}
                        </h6>
                        <h6 className="xl:text-base text-xs  px-2 py-0.5 w-[20%]  rounded-md text-left">
                          {e?.address}
                        </h6>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </>
            ) : (
              <div className=" max-w-[352px] mt-24 mx-auto">
                <div className="text-center">
                  <div className="bg-[#EBF4FF] rounded-[100%] inline-block ">
                    {props.children}
                  </div>
                  <h1 className="textx-[#141522] text-base opacity-90 font-medium">
                    Không tìm thấy các mục
                  </h1>
                  <div className="flex items-center justify-around mt-6 "></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default TableContact;
