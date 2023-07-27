import React from "react";
import DeleteParentButton from "./buttonDeleteParent";
import { Add } from "iconsax-react";
const ParentControls = ({
  listData,
  onLoadingListData,
  dataLang,
  _HandleAddParent,
  _HandleDeleteParent,
  color,
  colorIcon,
}) => {
  return (
    <div
      className={`${
        listData?.length > 1 && !onLoadingListData
          ? "grid-cols-14"
          : "grid-cols-12"
      } grid gap-2 items-center`}
    >
      <div
        className={`${
          listData?.length > 1 && !onLoadingListData
            ? "col-span-11"
            : "col-span-12"
        }`}
      >
        <div className="b flex items-center justify-center w-full pt-5">
          <button
            onClick={_HandleAddParent}
            className={`${color} "i flex justify-center gap-2 group  w-full text-center py-2 text-white items-center rounded cursor-pointer hover:scale-[1.02] overflow-hidden transform transition duration-300 ease-out`}
          >
            <Add
              size="20"
              color={colorIcon}
              className="bg-gray-50 rounded-full group-hover:animate-spin ease-linear transition-all"
            />
            <p className="text-sm">
              {dataLang?.import_more_collum || "import_more_collum"}
            </p>
          </button>
        </div>
      </div>
      {listData?.length > 1 && !onLoadingListData && (
        <DeleteParentButton
          _HandleDeleteParent={_HandleDeleteParent}
          listData={listData}
          dataLang={dataLang}
        />
      )}
    </div>
  );
};

export default ParentControls;
