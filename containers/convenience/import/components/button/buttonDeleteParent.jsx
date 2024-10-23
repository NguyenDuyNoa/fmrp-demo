import React from "react";
import { Trash as IconDelete } from "iconsax-react";
const DeleteParentButton = ({ _HandleDeleteParent, listData, dataLang }) => {
  return (
    <div className="col-span-3 pt-5">
      <button
        type="button"
        onClick={_HandleDeleteParent}
        className="flex w-full  items-center  justify-center bg-rose-600 rounded p-2 gap-1 i cursor-pointer hover:scale-[1.02]  overflow-hidden transform  transition duration-300 ease-out"
      >
        <IconDelete
          size={19}
          color="white"
          className="transition-all ease-out animate-bounce-custom"
        />{" "}
        <h6 className="text-white font-normal text-xs">
          {listData?.length} {dataLang?.import_column || "import_column"}
        </h6>
      </button>
    </div>
  );
};

export default DeleteParentButton;
