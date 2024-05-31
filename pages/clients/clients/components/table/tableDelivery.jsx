import React from "react";
import Loading from "components/UI/loading";
import { Map, IconSearch } from "iconsax-react";
import dynamic from "next/dynamic";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import { ColumnTablePopup, HeaderTablePopup } from "@/components/UI/common/TablePopup";
const ScrollArea = dynamic(() => import("react-scrollbar"), {
  ssr: false,
});
const TableDelivery = (props) => {
  return (
    <div>
      <div className="w-[930px]">
        <Customscrollbar className="min:h-[200px] h-[72%] max:h-[400px] pb-2">
          <div className="pr-2 w-[100%] ">
            <HeaderTablePopup gridCols={5}>
              <ColumnTablePopup>
                {"STT"}
              </ColumnTablePopup>
              <ColumnTablePopup>
                {props?.dataLang.client_popup_devivelyName || "client_popup_devivelyName"}
              </ColumnTablePopup>
              <ColumnTablePopup>
                {props.dataLang?.client_popup_phone || 'client_popup_phone'}
              </ColumnTablePopup>
              <ColumnTablePopup>
                {props.dataLang?.client_popup_adress || 'client_popup_adress'}
              </ColumnTablePopup>
              <ColumnTablePopup>
                {props.dataLang?.client_popup_devivelyAddres || 'client_popup_devivelyAddres'}
              </ColumnTablePopup>
            </HeaderTablePopup>
            {props.onFetching ? (
              <Loading className="h-80" color="#0f4f9e" />
            ) : props?.data?.clients_address_delivery?.length > 0 ? (
              <>
                <ScrollArea
                  className="min-h-[455px] max-h-[455px] overflow-hidden"
                  speed={1}
                  smoothScrolling={true}
                >
                  <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[500px]">
                    {props?.data?.clients_address_delivery?.map((e, index) => (
                      <div
                        className="grid grid-cols-12 items-center py-1.5 px-2 hover:bg-slate-100/40 "
                        key={e.id.toString()}
                      >
                        <h6 className="xl:text-base text-xs  px-2 py-0.5 col-span-1   rounded-md text-center">
                          {index + 1}
                        </h6>
                        <h6 className="xl:text-base text-xs  px-2 py-0.5 col-span-2   rounded-md text-left">
                          {e.fullname}
                        </h6>
                        <h6 className="xl:text-base text-xs  px-2 py-0.5 col-span-2  rounded-md text-center">
                          {e.phone}
                        </h6>
                        <h6 className="xl:text-base text-xs  px-2 py-0.5 col-span-4  rounded-md text-left break-words">
                          {e.address}
                        </h6>
                        <h6 className="xl:text-base text-xs  px-2 py-0.5 col-span-3  rounded-md text-center">
                          {e.is_primary == "1" && (
                            <Map
                              size="32"
                              color="green"
                              className="mx-auto animate-bounce"
                            />
                          )}
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
                    {props.children} {/* <IconSearch /> */}
                  </div>
                  <h1 className="textx-[#141522] text-base opacity-90 font-medium">
                    Không tìm thấy các mục
                  </h1>
                  <div className="flex items-center justify-around mt-6 ">
                    {/* <Popup_dskh onRefresh={_ServerFetching.bind(this)} dataLang={dataLang} className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105" />     */}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Customscrollbar>
      </div>
    </div>
  );
};
export default TableDelivery;
