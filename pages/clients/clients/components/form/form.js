import React from "react";
import { IconDelete } from "iconsax-react";
import Link from "next/link";
import Select, { components } from "react-select";

const Form = ({
  code,
  name,
  representative,
  email,
  phone_number,
  tax_code,
  date_incorporation,
  address,
  dataLang,
  errInput,
  errInputBr,
  handleMenuOpen,
  handleChangeChar,
  handleChangeGr,
  handleChangeCt,
  handleChangeDtric,
  handleChangeWar,
  valueBr,
  valueChar,
  valueGr,
  valueCt,
  valueDis,
  valueWa,
  listChar,
  listGr,
  cityOpt,
  ditrict,
  listWar,
  brandpOpt,
  debt_limit,
  debt_limit_day,
  note,
  _HandleChangeInput,
}) => {
  return (
    <div className="w-[50vw]  p-2 ">
      <div className="flex flex-wrap justify-between ">
        <div className="w-[48%]">
          <label className="text-[#344054] font-normal text-sm mb-1 ">
            {dataLang?.client_list_namecode}{" "}
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
            {dataLang?.client_list_name}
            <span className="text-red-500">*</span>
          </label>
          <div>
            <input
              value={name}
              onChange={_HandleChangeInput.bind(this, "name")}
              placeholder={dataLang?.client_list_name}
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
                {dataLang?.client_list_nameuser}
              </label>
            )}
          </div>
          <label className="text-[#344054] font-normal text-sm mb-1 ">
            {dataLang?.client_list_repre}
          </label>
          <input
            value={representative}
            placeholder={dataLang?.client_list_repre}
            onChange={_HandleChangeInput.bind(this, "representative")}
            name="fname"
            type="text"
            className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
          />
          <label className="text-[#344054] font-normal text-sm mb-1 ">
            {dataLang?.client_popup_mail}
          </label>
          <input
            value={email}
            onChange={_HandleChangeInput.bind(this, "email")}
            placeholder={dataLang?.client_popup_mail}
            name="fname"
            type="email"
            className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
          />
          <label className="text-[#344054] font-normal text-sm mb-1 ">
            {dataLang?.client_list_phone}
          </label>
          <input
            value={phone_number}
            placeholder={dataLang?.client_list_phone}
            onChange={_HandleChangeInput.bind(this, "phone_number")}
            name="fname"
            type="text"
            className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
          />
          <label className="text-[#344054] font-normal text-sm mb-1 ">
            {dataLang?.client_list_taxtcode}
          </label>
          <input
            value={tax_code}
            placeholder={dataLang?.client_list_taxtcode}
            onChange={_HandleChangeInput.bind(this, "tax_code")}
            name="fname"
            type="text"
            className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
          />
          <label className="text-[#344054] font-normal text-sm mb-1 ">
            {dataLang?.client_popup_date}
          </label>
          <input
            value={date_incorporation}
            onChange={_HandleChangeInput.bind(this, "date_incorporation")}
            name="fname"
            type="date"
            className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
          />

          <label className="text-[#344054] font-normal text-sm mb-1 ">
            {dataLang?.client_popup_adress}
          </label>
          <textarea
            value={address}
            placeholder={dataLang?.client_popup_adress}
            onChange={_HandleChangeInput.bind(this, "address")}
            name="fname"
            type="text"
            className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full min-h-[40px] h-[40px] max-h-[200px] bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-2 border outline-none mb-2"
          />
        </div>
        <div className="w-[48%]">
          <div>
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
                {dataLang?.client_list_bran}
              </label>
            )}
          </div>
          <label className="text-[#344054] font-normal text-sm mb-1 ">
            {dataLang?.client_popup_char}
          </label>
          <Select
            closeMenuOnSelect={false}
            placeholder={dataLang?.client_popup_char}
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
            {dataLang?.client_list_group}
          </label>
          <Select
            placeholder={dataLang?.client_list_group}
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
            {dataLang?.client_popup_limit}
          </label>
          <input
            value={debt_limit}
            onChange={_HandleChangeInput.bind(this, "debt_limit")}
            placeholder={dataLang?.client_popup_limit}
            name="fname"
            type="text"
            className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
          />
          <div>
            <label className="text-[#344054] font-normal text-sm mb-1 ">
              {dataLang?.client_popup_days}
            </label>
            <input
              value={debt_limit_day}
              onChange={_HandleChangeInput.bind(this, "debt_limit_day")}
              name="fname"
              placeholder={dataLang?.client_popup_days}
              type="text"
              className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
            />
          </div>
          <div>
            <label className="text-[#344054] font-normal text-sm mb-1 ">
              {dataLang?.client_popup_city}
            </label>
            <Select
              placeholder={dataLang?.client_popup_city}
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
              {dataLang?.client_popup_district}
            </label>
            <Select
              placeholder={dataLang?.client_popup_district}
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
              {dataLang?.client_popup_wards}
            </label>
            <Select
              placeholder={dataLang?.client_popup_wards}
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
          {dataLang?.client_popup_note}
        </label>
        <textarea
          value={note}
          placeholder={dataLang?.client_popup_note}
          onChange={_HandleChangeInput.bind(this, "note")}
          name="fname"
          type="text"
          className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full min-h-[40px] max-h-[200px] bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-2 border outline-none mb-2"
        />
      </div>
    </div>
  );
};
export default Form;
