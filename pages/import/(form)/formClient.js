import React from "react";
import Select, { components } from "react-select";
import {
  Edit as IconEdit,
  Grid6 as IconExcel,
  Trash as IconDelete,
  SearchNormal1 as IconSearch,
  Add as IconAdd,
} from "iconsax-react";
import Loading from "components/UI/loading";
import DeleteButton from "../(button)/buttonDeleteSlect";
import { motion } from "framer-motion";
import AnimatedDiv from "../../../components/UI/motions";

const FormClient = ({
  onLoadingListData,
  dataContact,
  dataDelivery,
  dataColumn,
  listDataContact,
  listDataDelivery,
  dataLang,
  handleMenuOpen,
  _HandleChangeChildContact,
  _HandleChangeChildDelivery,
  _HandleDeleteContact,
  _HandleDeleteDelivery,
}) => {
  return (
    <div className={`col-span-8`}>
      {onLoadingListData ? (
        <Loading className="h-2 col-span-2" color="#0f4f9e" />
      ) : (
        <div
          className={`${
            onLoadingListData
              ? "bg-white"
              : (listDataContact?.length > 0 || listDataDelivery?.length > 0) &&
                "bg-zinc-100 mt-2 "
          } grid grid-cols-8 items-start 3xl:gap-2 xxl:gap-2 2xl:gap-4 p-4 rounded-xl  transition-all ease-linear`}
        >
          <div className={`col-span-4   rounded-lg`}>
            {listDataContact?.map((e) => (
              <div
                className="grid-cols-13 grid gap-2.5 mt-2"
                key={e?.id}
                isExiting={true}
              >
                <div className="col-span-6">
                  <Select
                    closeMenuOnSelect={true}
                    placeholder={
                      dataLang?.import_data_fields || "import_data_fields"
                    }
                    options={dataContact}
                    isSearchable={true}
                    onChange={_HandleChangeChildContact.bind(
                      this,
                      e?.id,
                      "dataFieldsContact"
                    )}
                    value={e?.dataFieldsContact}
                    LoadingIndicator
                    noOptionsMessage={() =>
                      dataLang?.import_no_data || "Không có dữ liệu"
                    }
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
                    className="border-transparent placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] text-sm font-normal outline-none border"
                  />
                </div>
                <div className="col-span-6">
                  <Select
                    closeMenuOnSelect={true}
                    placeholder={
                      dataLang?.import_data_column || "import_data_column"
                    }
                    options={dataColumn}
                    isSearchable={true}
                    onChange={_HandleChangeChildContact.bind(
                      this,
                      e?.id,
                      "columnContact"
                    )}
                    value={e?.columnContact}
                    LoadingIndicator
                    noOptionsMessage={() =>
                      dataLang?.import_no_data || "Không có dữ liệu"
                    }
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
                    className="border-transparent placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] text-sm font-normal outline-none border"
                  />
                </div>
                <DeleteButton
                  onClick={_HandleDeleteContact.bind(this, e?.id)}
                />
              </div>
            ))}
          </div>
          <div className={`col-span-4  rounded-lg`}>
            {listDataDelivery?.map((e) => (
              <div className="grid-cols-13 grid gap-2.5 mt-2" key={e?.id}>
                <div className="col-span-6">
                  <Select
                    closeMenuOnSelect={true}
                    placeholder={
                      dataLang?.import_data_fields || "import_data_fields"
                    }
                    options={dataDelivery}
                    isSearchable={true}
                    onChange={_HandleChangeChildDelivery.bind(
                      this,
                      e?.id,
                      "dataFieldsDelivery"
                    )}
                    value={e?.dataFieldsDelivery}
                    LoadingIndicator
                    noOptionsMessage={() =>
                      dataLang?.import_no_data || "Không có dữ liệu"
                    }
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
                    className="border-transparent placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] text-sm font-normal outline-none border"
                  />
                </div>
                <div className="col-span-6 ">
                  <Select
                    closeMenuOnSelect={true}
                    placeholder={
                      dataLang?.import_data_column || "import_data_column"
                    }
                    options={dataColumn}
                    isSearchable={true}
                    onChange={_HandleChangeChildDelivery.bind(
                      this,
                      e?.id,
                      "columnDelivery"
                    )}
                    value={e?.columnDelivery}
                    LoadingIndicator
                    noOptionsMessage={() =>
                      dataLang?.import_no_data || "Không có dữ liệu"
                    }
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
                    className="border-transparent placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] text-sm font-normal outline-none border"
                  />
                </div>
                <DeleteButton
                  onClick={_HandleDeleteDelivery.bind(this, e?.id)}
                  id="contact-id-1"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FormClient;
