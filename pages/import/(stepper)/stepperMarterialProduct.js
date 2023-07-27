import React from "react";

const ProgressBarWithLabels = ({ stepper, dataLang }) => {
  return (
    <div className={`flex items-center justify-center  gap-2 pt-5`}>
      <div className="flex items-center gap-1 group">
        <ColorsSquare
          size="22"
          className={`${
            stepper.main ? "text-blue-600" : "text-gray-500"
          } group-hover:scale-105 transition-all ease-linear animate-pulse duration-700`}
        />
        <h3
          className={`${
            stepper.main ? "text-blue-600" : "text-gray-600"
          } font-semibold duration-700 3xl:text-sm 2xl:text-sm xl:text-xs text-xs`}
        >
          {dataLang?.import_variation || "import_variation"}
        </h3>
      </div>
      <div
        className={`3xl:w-[50%] 2xl:w-[40%] w-[35%]  h-2 bg-gray-200  rounded-xl relative duration-500 transition`}
      >
        <div
          style={{
            width: `${
              stepper.main && !stepper.extra
                ? "50%"
                : stepper.main && stepper.extra
                ? "100%"
                : "0%"
            }`,
          }}
          className={`absolute  bg-blue-600 top-0 left-0 h-full rounded transition-all duration-500`}
        ></div>
      </div>
      <div className="flex items-center gap-1 group">
        <Colorfilter
          size="22"
          className={`${
            stepper?.main && stepper?.extra ? "text-blue-600" : "text-gray-500"
          } group-hover:scale-105 duration-700 transition-all ease-linear animate-pulse`}
        />
        <h3
          className={`${
            stepper?.main && stepper?.extra ? "text-blue-600" : "text-gray-600"
          } font-semibold 3xl:text-sm 2xl:text-sm xl:text-xs text-xs duration-700`}
        >
          {dataLang?.import_subvariant || "import_subvariant"}
        </h3>
      </div>
    </div>
  );
};

export default ProgressBarWithLabels;
