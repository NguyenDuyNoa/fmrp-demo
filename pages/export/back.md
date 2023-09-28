{/\* <div className="col-span-12 mt-2 grid-cols-10 grid gap-2.5 justify-center">
<div className="col-span-2">
<div class="w-full relative group">
<NumericFormat
id="page"
onChange={(e) =>
sPageLimit((prevState) => ({ ...prevState, page: e.target.value }))
}
value={pageLitmit.page}
className="w-full p-2 xl:text-sm text-xs peer bg-white outline-none focus:outline-blue-400 focus:outline-1
border-gray-100 border rounded"
thousandSeparator=","
allowNegative={false}
decimalScale={0}
required
isNumericString={true}
isAllowed={(values) => {
const { value } = values;
const newValue = +value;
return true;
}}
/>
<label
                                    htmlFor="page"
                                    className="transform transition-all absolute top-0 left-0 h-full flex items-center pl-2 xl:text-sm text-xs
                                    group-focus-within:text-xs peer-valid:text-xs group-focus-within:h-1/2 peer-valid:h-1/2 
                                    group-focus-within:-translate-y-full peer-valid:-translate-y-full group-focus-within:pl-0 peer-valid:pl-0"
                                >
Trang export
</label>
</div>
</div>
<div className="col-span-2">
<div class="w-full relative group">
<NumericFormat
id="limit"
onChange={(e) =>
sPageLimit((prevState) => ({ ...prevState, limit: e.target.value }))
}
className="appearance-none focus:placeholder:text-gray-400 placeholder:text-white focus:outline-blue-400 focus:outline-1
w-full p-2 xl:text-sm text-xs peer bg-white outline-none border-gray-100 border rounded"
thousandSeparator=","
value={pageLitmit.limit}
allowNegative={true}
decimalScale={0}
required
placeholder={"Xuất hết điền -1"}
isNumericString={true}
/>
<label
                                    htmlFor="limit"
                                    className=" transform transition-all absolute top-0 left-0 h-full flex items-center pl-2 xl:text-sm text-xs
                                    group-focus-within:text-xs peer-valid:text-xs group-focus-within:h-1/2 peer-valid:h-1/2  group-focus-within:-translate-y-full peer-valid:-translate-y-full group-focus-within:pl-0 peer-valid:pl-0"
                                >
Số lượng export
</label>
</div>
</div>
<div className="col-span-2">
<Select
closeMenuOnSelect={true}
placeholder={"Chọn mẫu Export dữ liệu"}
options={dataConditionColumn}
isSearchable={true}
onChange={(e) => \_HandleChange(e, "conditionColumn")}
value={conditionColumn}
LoadingIndicator
noOptionsMessage={() => dataLang?.import_no_data || "import_no_data"}
maxMenuHeight="200px"
menuPosition="fixed"
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
className={`placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] 2xl:text-[12px] xl:text-[13px] text-[12px] font-normal outline-none `}
/>
</div>
{tabPage != 5 && tabPage != 6 ? (
<div className="col-span-2 flex items-center  space-x-2 rounded p-2 hover:bg-gray-200 bg-gray-100 cursor-pointer btn-animation hover:scale-[1.02]">
<input
type="checkbox"
onChange={(e) => \_HandleChange(e, "sampleImport")}
checked={sampleImport}
value={sampleImport}
id="example12"
name="checkGroup1"
className="h-4 w-4 rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 focus:ring-offset-0 disabled:cursor-not-allowed disabled:text-gray-400"
/>
<label htmlFor="example12" className=" space-x-2 text-sm cursor-pointer">
{"Lưu mẫu export"}
</label>
</div>
) : (
<div></div>
)}

                        {isShow ? (
                            <div className="col-span-2">
                                <ExcelFile
                                    filename={`${dataLang?.import_error_data || "import_error_data"} ${
                                        (tabPage == 1 && "danh mục khách hàng") ||
                                        (tabPage == 2 && "danh mục nhà cung cấp") ||
                                        (tabPage == 3 && "danh mục nguyên vật liệu") ||
                                        (tabPage == 4 && "danh mục thành phẩm")
                                    }`}
                                    title="DLL"
                                    element={
                                        <button
                                            id="excelButton"
                                            className="w-full p-2.5  bg-gradient-to-l hover:bg-blue-300 from-blue-500 via-blue-500  to-blue-500 text-white rounded btn-animation hover:scale-[1.02] flex items-center gap-1 justify-center z-0"
                                        >
                                            <div
                                                className={
                                                    "w-4 h-4 border-2 rounded-full border-pink-200 border-t-rose-500 animate-spin"
                                                }
                                            ></div>
                                            <span className="xl:text-sm text-xs">{"Export dữ liệu"}</span>
                                        </button>
                                    }
                                >
                                    <ExcelSheet dataSet={multiDataSet} data={multiDataSet} name="Organization" />
                                </ExcelFile>
                            </div>
                        ) : (
                            <button
                                onClick={(e) => _HandleSubmit(e)}
                                type="button"
                                className="col-span-2  p-2.5  bg-gradient-to-l hover:bg-blue-300 from-blue-500 via-blue-500  to-blue-500 text-white rounded btn-animation hover:scale-[1.02] flex items-center gap-1 justify-center z-0"
                            >
                                <div
                                    className={
                                        "w-4 h-4 border-2 rounded-full border-pink-200 border-t-rose-500 animate-spin"
                                    }
                                ></div>
                                <span className="xl:text-sm text-xs">{"Export dữ liệu"}</span>
                            </button>
                        )}
                    </div> */}
