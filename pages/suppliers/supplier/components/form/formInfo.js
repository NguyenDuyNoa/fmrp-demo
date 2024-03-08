import React from "react";
import Select from "react-select";
import { NumericFormat } from "react-number-format";
const FormInfo = (props) => {
  const {
    code,
    name,
    representative,
    email,
    phone_number,
    tax_code,
    date_incorporation,
    valueBr,
    brandpOpt,
    errInput,
    errInputBr,
    listGr,
    valueGr,
    handleChangeGr,
    handleMenuOpen,
    cityOpt,
    valueCt,
    handleChangeCt,
    ditrict,
    valueDis,
    handleChangeDtric,
    listWar,
    valueWa,
    handleChangeWar,
    address,
    note,
    _HandleChangeInput,
    dataLang,
    debt_begin,
  } = props;

  return (
    <div className="w-[50vw]  p-2  ">
      <div className="flex flex-wrap justify-between ">
        <div className="w-[48%]">
          <label className="text-[#344054] font-normal text-sm mb-1 ">
            {dataLang?.suppliers_supplier_code}{" "}
          </label>
          <input
            value={code}
            onChange={_HandleChangeInput.bind(this, "code")}
            name="fname"
            type="text"
            placeholder={dataLang?.client_popup_sytem}
            className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
          />

          <label className="text-[#344054] font-normal text-sm mb-1 ">
            {dataLang?.suppliers_supplier_name}
            <span className="text-red-500">*</span>
          </label>
          <div>
            <input
              value={name}
              onChange={_HandleChangeInput.bind(this, "name")}
              placeholder={dataLang?.suppliers_supplier_name}
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
                {dataLang?.suppliers_supplier_err}
              </label>
            )}
          </div>
          <label className="text-[#344054] font-normal text-sm mb-1 ">
            {dataLang?.suppliers_supplier_reper}
          </label>
          <input
            value={representative}
            placeholder={dataLang?.suppliers_supplier_reper}
            onChange={_HandleChangeInput.bind(this, "representative")}
            name="fname"
            type="text"
            className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
          />
          <label className="text-[#344054] font-normal text-sm mb-1 ">
            {dataLang?.suppliers_supplier_email}
          </label>
          <input
            value={email}
            onChange={_HandleChangeInput.bind(this, "email")}
            placeholder={dataLang?.suppliers_supplier_email}
            name="fname"
            type="email"
            className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
          />
          <label className="text-[#344054] font-normal text-sm mb-1 ">
            {dataLang?.suppliers_supplier_phone}
          </label>
          <input
            value={phone_number}
            placeholder={dataLang?.suppliers_supplier_phone}
            onChange={_HandleChangeInput.bind(this, "phone_number")}
            name="fname"
            type="text"
            className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
          />
          <label className="text-[#344054] font-normal text-sm mb-1 ">
            {dataLang?.suppliers_supplier_taxcode}
          </label>
          <input
            value={tax_code}
            placeholder={dataLang?.suppliers_supplier_taxcode}
            onChange={_HandleChangeInput.bind(this, "tax_code")}
            name="fname"
            type="text"
            className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
          />
          <label className="text-[#344054] font-normal text-sm mb-1 ">
            {dataLang?.suppliers_supplier_date}
          </label>
          <input
            value={date_incorporation}
            onChange={_HandleChangeInput.bind(this, "date_incorporation")}
            name="fname"
            type="date"
            className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
          />
        </div>
        <div className="w-[48%]">
          <div className="mb-1">
            <label className="text-[#344054] font-normal text-sm mb-1 ">
              {dataLang?.client_list_brand}{" "}
              <span className="text-red-500">*</span>
            </label>
            <Select
              closeMenuOnSelect={false}
              placeholder={dataLang?.client_list_brand}
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
                {dataLang?.client_list_bran}
              </label>
            )}
          </div>
          <label className="text-[#344054] font-normal text-sm mb-1 ">
            {dataLang?.suppliers_supplier_group}
          </label>
          <Select
            placeholder={dataLang?.suppliers_supplier_group}
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
            {dataLang?.suppliers_supplier_debt}
          </label>
          <NumericFormat
            value={debt_begin}
            onValueChange={_HandleChangeInput.bind(this, "debt_begin")}
            className="ocus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
            thousandSeparator=","
            allowNegative={false}
            isNumericString={true}
            placeholder={dataLang?.suppliers_supplier_debt}
          />

          <div>
            <label className="text-[#344054] font-normal text-sm mb-1 ">
              {dataLang?.suppliers_supplier_city}
            </label>
            <Select
              placeholder={dataLang?.suppliers_supplier_city}
              options={cityOpt}
              value={
                valueCt
                  ? {
                      label: cityOpt?.find((x) => x.value == valueCt)?.label,
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
              {dataLang?.suppliers_supplier_district}
            </label>
            <Select
              placeholder={dataLang?.suppliers_supplier_district}
              options={ditrict}
              value={
                valueDis
                  ? {
                      label: ditrict?.find((x) => x.value == valueDis)?.label,
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
              {dataLang?.suppliers_supplier_wards}
            </label>
            <Select
              placeholder={dataLang?.suppliers_supplier_wards}
              options={listWar}
              value={
                valueWa
                  ? {
                      label: listWar?.find((x) => x.value == valueWa)?.label,
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
            {dataLang?.suppliers_supplier_adress}
          </label>
          <textarea
            value={address}
            placeholder={dataLang?.suppliers_supplier_adress}
            onChange={_HandleChangeInput.bind(this, "address")}
            name="fname"
            type="text"
            className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full min-h-[40px] h-[40px] max-h-[200px] bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-2 border outline-none mb-2"
          />
        </div>
        <div className="w-full">
          <label className="text-[#344054] font-normal text-sm mb-1 ">
            {dataLang?.suppliers_supplier_note}
          </label>
          <textarea
            value={note}
            placeholder={dataLang?.suppliers_supplier_note}
            onChange={_HandleChangeInput.bind(this, "note")}
            name="fname"
            type="text"
            className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full min-h-[40px] max-h-[200px] bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-2 border outline-none mb-2"
          />
        </div>
      </div>
    </div>
  );
};
export default FormInfo;
