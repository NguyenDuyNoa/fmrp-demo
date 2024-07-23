import React from "react";
import Select from "react-select";
import { NumericFormat } from "react-number-format";
import InPutNumericFormat from "@/components/UI/inputNumericFormat/inputNumericFormat";
import useToast from "@/hooks/useToast";
const FormInfo = ({ isState, dataGroup, dataDitrict, dataWar, queryState, dataLang }) => {
  const isShow = useToast()
  return (
    <div className="w-[50vw]  p-2  ">
      <div className="flex flex-wrap justify-between ">
        <div className="w-[48%]">
          <label className="text-[#344054] font-normal text-sm mb-1 ">
            {dataLang?.suppliers_supplier_code}{" "}
          </label>
          <input
            value={isState.code}
            onChange={(e) => queryState({ code: e.target.value })}
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
              value={isState.name}
              onChange={(e) => queryState({ name: e.target.value })}
              placeholder={dataLang?.suppliers_supplier_name}
              name="fname"
              type="text"
              className={`${isState.errInput
                ? "border-red-500"
                : "focus:border-[#92BFF7] border-[#d0d5dd]"
                } placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2`}
            />
            {isState.errInput && (
              <label className="mb-4  text-[14px] text-red-500">
                {dataLang?.suppliers_supplier_err}
              </label>
            )}
          </div>
          <label className="text-[#344054] font-normal text-sm mb-1 ">
            {dataLang?.suppliers_supplier_reper}
          </label>
          <input
            value={isState.representative}
            placeholder={dataLang?.suppliers_supplier_reper}
            onChange={(e) => queryState({ representative: e.target.value })}
            name="fname"
            type="text"
            className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
          />
          <label className="text-[#344054] font-normal text-sm mb-1 ">
            {dataLang?.suppliers_supplier_email}
          </label>
          <input
            value={isState.email}
            onChange={(e) => queryState({ email: e.target.value })}
            placeholder={dataLang?.suppliers_supplier_email}
            name="fname"
            type="email"
            className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
          />
          <label className="text-[#344054] font-normal text-sm mb-1 ">
            {dataLang?.suppliers_supplier_phone}
          </label>
          <input
            value={isState.phone_number}
            placeholder={dataLang?.suppliers_supplier_phone}
            onChange={(e) => queryState({ phone_number: e.target.value })}
            name="fname"
            type="text"
            className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
          />
          <label className="text-[#344054] font-normal text-sm mb-1 ">
            {dataLang?.suppliers_supplier_taxcode}
          </label>
          <input
            value={isState.tax_code}
            placeholder={dataLang?.suppliers_supplier_taxcode}
            onChange={(e) => queryState({ tax_code: e.target.value })}
            name="fname"
            type="text"
            className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
          />
          <label className="text-[#344054] font-normal text-sm mb-1 ">
            {dataLang?.suppliers_supplier_date}
          </label>
          <input
            value={isState.date_incorporation}
            onChange={(e) => queryState({ date_incorporation: e.target.value })}
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
              options={isState.dataBr}
              isSearchable={true}
              onChange={(e) => queryState({ valueBr: e })}
              LoadingIndicator
              isMulti
              noOptionsMessage={() => "Không có dữ liệu"}
              value={isState.valueBr}
              maxMenuHeight="200px"
              isClearable={true}
              menuPortalTarget={document.body}
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
              className={`${isState.errInputBr ? "border-red-500" : "border-transparent"
                } placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `}
            />
            {isState.errInputBr && (
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
            options={dataGroup}
            value={isState.valueGr}
            onChange={(e) => queryState({ valueGr: e })}
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
          {/* <NumericFormat
            value={isState.debt_begin}
            onValueChange={_HandleChangeInput.bind(this, "debt_begin")}
            className="ocus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
            thousandSeparator=","
            allowNegative={false}
            isNumericString={true}
            placeholder={dataLang?.suppliers_supplier_debt}
          /> */}
          <InPutNumericFormat
            value={isState.debt_begin || 0}
            onValueChange={(e) => queryState({ debt_begin: e.floatValue })}
            isAllowed={(values) => {
              const { floatValue } = values;
              if (floatValue == 0) {
                return true;
              }
              if (floatValue < 0) {
                isShow('warning', 'Vui lòng nhập lớn hơn 0');
                return false
              }
              return true
            }}
            placeholder={dataLang?.suppliers_supplier_debt}
            className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2"
          />

          <div>
            <label className="text-[#344054] font-normal text-sm mb-1 ">
              {dataLang?.suppliers_supplier_city}
            </label>
            <Select
              placeholder={dataLang?.suppliers_supplier_city}
              options={isState.dataCity}
              value={isState.valueCt}
              onChange={(e) => queryState({ valueCt: e })}
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
              options={dataDitrict}
              value={isState.valueDitrict}
              onChange={(e) => queryState({ valueDitrict: e })}
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
              options={dataWar}
              value={isState.valueWa}
              onChange={(e) => queryState({ valueWa: e })}
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
            value={isState.address}
            placeholder={dataLang?.suppliers_supplier_adress}
            onChange={(e) => queryState({ address: e.target.value })}
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
            value={isState.note}
            placeholder={dataLang?.suppliers_supplier_note}
            onChange={(e) => queryState({ note: e.target.value })}
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
