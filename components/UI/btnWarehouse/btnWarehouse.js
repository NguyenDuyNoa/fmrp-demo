import Zoom from "../zoomElement/zoomElement";
const ButtonWarehouse = ({ _HandleChangeInput, warehouseman_id, id }) => {
    return (
        <Zoom>
            <div
                className={`${
                    // warehouseman_id == "0" ? "bg-blue-700/90" : " bg-green-700/90"
                    warehouseman_id == "0" ? "bg-blue-200" : " bg-green-200"
                } rounded-md cursor-pointer hover:scale-105 ease-in-out transition-all flex items-center`}
            >
                <label
                    className="relative flex cursor-pointer items-center rounded-full p-2"
                    htmlFor={id}
                    data-ripple-dark="true"
                >
                    <input
                        type="checkbox"
                        className={`
                      
                         ${
                             warehouseman_id == "0"
                                 ? "checked:border-blue-700 checked:bg-blue-700/90 checked:before:bg-blue-700/90"
                                 : "checked:border-green-700 checked:bg-green-700/90 border-green-700 checked:before:bg-limborder-green-700/90"
                         }
                         before:content[''] peer relative 2xl:h-5 2xl:w-5 h-4 w-4 cursor-pointer appearance-none 2xl:rounded-md rounded border-blue-700 border transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity  hover:before:opacity-10`}
                        id={id}
                        value={warehouseman_id}
                        checked={warehouseman_id != "0" ? true : false}
                        onChange={_HandleChangeInput.bind(this, id, warehouseman_id, "browser")}
                    />
                    <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            stroke="currentColor"
                            stroke-width="1"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clip-rule="evenodd"
                            ></path>
                        </svg>
                    </div>
                </label>
                <label
                    htmlFor={id}
                    className={`${
                        warehouseman_id == "0" ? "text-blue-700" : "text-green-700"
                    }  3xl:text-[12px] 2xl:text-[10px] xl:text-[10px] text-[8px] font-medium cursor-pointer`}
                >
                    {warehouseman_id == "0" ? "Chưa duyệt kho" : "Đã duyệt kho"}
                </label>
            </div>
        </Zoom>
    );
};
export default ButtonWarehouse;
