import React from "react";
import { NumericFormat } from "react-number-format";

const Row = ({
  dataLang,
  _HandleChange,
  errRowStart,
  row_tarts,
  errEndRow,
  end_row,
}) => {
  return (
    <div className="grid grid-cols-4 gap-2.5">
      <div className="mx-auto w-full col-span-2">
        <label
          htmlFor="input-label"
          className="block text-sm font-medium mb-2 "
        >
          {dataLang?.import_line_starts || "import_line_starts"}{" "}
          <span className="text-red-500">*</span>
        </label>
        <NumericFormat
          className={`${errRowStart && (row_tarts == null || row_tarts === "")
            ? "border-red-500"
            : "border-gray-200"
            } border py-2.5 outline-none px-4  block w-full  rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 `}
          onValueChange={_HandleChange.bind(this, "row_tarts")}
          value={row_tarts}
          allowNegative={false}
          decimalScale={0}
          isNumericString={true}
          thousandSeparator=","
          placeholder={dataLang?.import_line_starts || "import_line_starts"}
        />
        {errRowStart && row_tarts == null && (
          <label className="text-sm text-red-500">
            {dataLang?.import_ERR_line || "import_ERR_line"}
          </label>
        )}
      </div>
      <div className="mx-auto w-full col-span-2">
        <label
          htmlFor="input-labels"
          className="block text-sm font-medium mb-2 "
        >
          {dataLang?.import_finished_row || "import_finished_row"}
          <span className="text-red-500">*</span>
        </label>
        <NumericFormat
          className={`${errEndRow && (end_row == null || end_row === "")
            ? "border-red-500"
            : "border-gray-200"
            } border py-2.5 outline-none px-4 border block w-full  rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 `}
          onValueChange={_HandleChange.bind(this, "end_row")}
          value={end_row}
          disabled={row_tarts == null}
          allowNegative={false}
          decimalScale={0}
          isNumericString={true}
          thousandSeparator=","
          placeholder={
            row_tarts == null
              ? dataLang?.import_startrow || "import_startrow"
              : dataLang?.import_finished_row || "import_finished_row"
          }
        />
        {errEndRow && end_row == null && (
          <label className="text-sm text-red-500">
            {dataLang?.import_ERR_linefinish || "import_ERR_linefinish"}
          </label>
        )}
      </div>
    </div>
  );
};

export default Row;
