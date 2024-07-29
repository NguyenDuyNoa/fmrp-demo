import apiProducts from "@/Api/apiProducts/products/apiProducts";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import Loading from "@/components/UI/loading";
import PopupCustom from "@/components/UI/popup";
import { WARNING_STATUS_ROLE } from "@/constants/warningStatus/warningStatus";
import useDragAndDrop from "@/hooks/useDragAndDrop";
import useActionRole from "@/hooks/useRole";
import useToast from "@/hooks/useToast";
import { useQuery } from "@tanstack/react-query";
import { I3Square, Add as IconAdd, Trash as IconDelete, Maximize4 as IconMax } from "iconsax-react";
import React, { useEffect, useRef, useState } from "react";
import { DragDropContext, Draggable, Droppable, } from 'react-beautiful-dnd';
import { useSelector } from "react-redux";
import Select from "react-select";
import { v4 as uddidV4 } from "uuid";
const Popup_Stage = React.memo((props) => {
    const listCd = useSelector((state) => state.stage_finishedProduct);

    const isShow = useToast();

    const [isOpen, sIsOpen] = useState(false);

    const _ToggleModal = (e) => sIsOpen(e);

    const scrollAreaRef = useRef(null);
    const handleMenuOpen = () => {
        const menuPortalTarget = scrollAreaRef != null ? scrollAreaRef.current : scrollAreaRef;
        return { menuPortalTarget };
    };

    const { is_admin: role, permissions_current: auth } = useSelector((state) => state.auth);

    const { checkAdd, checkEdit } = useActionRole(auth, "products");

    const [onSending, sOnSending] = useState(false);

    const [statusBtnAdd, sStatusBtnAdd] = useState(false);

    const [errName, sErrName] = useState(false);

    const [listCdChosen, sListCdChosen] = useState([]);

    const [option, sOption] = useState([]);

    const [listCdRest, sListCdRest] = useState([]);

    const [name, sName] = useState(null);

    const [radio1, sRadio1] = useState(0);

    const [radio2, sRadio2] = useState(0);

    const [enabled, setEnabled] = useState(false);

    const { onDragEnd } = useDragAndDrop(option, (updatedData) => { sOption(updatedData) })

    useEffect(() => {
        setEnabled(true)
    }, []);

    useEffect(() => {
        isOpen && sOption([]);
        isOpen && sListCdChosen([]);
        isOpen && sStatusBtnAdd(false);
        isOpen && sErrName(false);
    }, [isOpen]);

    useEffect(() => {
        if (listCd?.length == option?.length) {
            sStatusBtnAdd(true);
        } else {
            sStatusBtnAdd(false);
        }
    }, [option]);

    const { isFetching, isLoading } = useQuery({
        queryKey: ["api_product_getDesignStages", props.id],
        queryFn: async () => {
            const data = await apiProducts.apiDataDesignStage(props.id);
            sOption(
                data.map((e) => ({
                    id: `${e.id}`,
                    name: { label: e.stage_name, value: e.stage_id },
                    radio1: e.type !== "0" ? 1 : 0,
                    radio2: e.final_stage !== "0" ? 1 : 0,
                }))
            );
            sListCdChosen(
                data.map((e) => ({
                    label: e.stage_name,
                    value: e.stage_id,
                }))
            );
            return data;
        },
        enabled: isOpen && !!props.id,
    })

    const _ServerSending = async () => {
        const formData = new FormData();
        formData.append("product_id", props.id);
        if (option?.length > 0) {
            option.forEach((item, index) => {
                formData.append(`data[${index}][stages]`, item?.name?.value);
                formData.append(`data[${index}][type]`, item.radio1);
                formData.append(`data[${index}][final_stage]`, item.radio2);
            });
        }
        try {
            const { isSuccess, message } = await apiProducts.apiHandingStage(formData);
            if (isSuccess) {
                isShow("success", props.dataLang[message] || message);
                sIsOpen(false);
                props.onRefresh && props.onRefresh();
            } else {
                isShow("error", props.dataLang[message] || message);
            }
        } catch (error) {

        } finally {
            sOnSending(false);
        }
    };

    useEffect(() => {
        onSending && _ServerSending();
    }, [onSending]);

    const _HandleSubmit = (e) => {
        e.preventDefault();
        const hasNullLabel = option.some((item) => item.name === null);
        if (hasNullLabel) {
            sErrName(true);
            isShow("error", props.dataLang?.required_field_null);
        } else {
            sErrName(false);
            sOnSending(true);
        }
    };

    const _HandleAddNew = () => {
        sOption([...option, { id: uddidV4(), name: name, radio1: radio1, radio2: radio2 }]);
        sName(null);
        sRadio1(0);
        sRadio2(0);
    };

    useEffect(() => {
        isOpen &&
            listCdChosen &&
            sListCdRest(listCd?.filter((item1) => !listCdChosen.some((item2) => item1.label === item2?.label && item1.value === item2?.value)));
    }, [listCdChosen]);

    const handleDelete = (id) => {
        const updatedData = option.filter((item) => item.id != id);
        sOption(updatedData);
    };

    const handleRatioChange = (id, type) => {
        const updatedData = option.map((item) => {
            if (item.id == id) {
                if (type == "radio1") {
                    return { ...item, radio1: 1 };
                } else if (type == "radio2") {
                    return { ...item, radio2: 1 };
                }
            } else {
                if (type == "radio1") {
                    return { ...item, radio1: 0 };
                } else if (type == "radio2") {
                    return { ...item, radio2: 0 };
                }
            }
        });
        sOption(updatedData);
    };

    const handleSelectChange = (id, value) => {
        const index = option.findIndex((x) => x.id == id);
        option[index].name = value;
        sOption([...option]);
        sListCdChosen(option.map((e) => e.name));
    };

    const DraggableItem = ({ value, index }) => {
        return (
            <Draggable
                key={value.id}
                draggableId={`${value.id}`}
                index={index}
                isDragDisabled={false} // Disable dragging by default
            >
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`draggable-item`}
                        style={{
                            ...provided.draggableProps.style,
                            position: 'static'
                        }}
                    >
                        <div className="grid grid-cols-9 items-center py-1 h-full hover:bg-slate-50 bg-white">
                            <h6 className="col-span-1 text-center px-2">{index + 1}</h6>
                            <div className="col-span-2 px-2 ">
                                <Select
                                    closeMenuOnSelect={true}
                                    placeholder={props.dataLang?.stage_finishedProduct}
                                    options={listCdRest}
                                    value={value.name}
                                    onChange={handleSelectChange.bind(this, value.id)}
                                    isSearchable={true}
                                    noOptionsMessage={() => "Không có dữ liệu"}
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
                                    className={`${errName && value.name == null ? "border-red-500" : "border-transparent"
                                        } placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `}
                                />
                            </div>
                            <div className="col-span-3 flex items-center justify-center">
                                <input
                                    type="radio"
                                    id={`radio1 + ${value.id}`}
                                    onChange={handleRatioChange.bind(this, value.id, "radio1")}
                                    checked={value.radio1 === 0 ? false : true}
                                    name="radio1"
                                    className="scale-150 outline-none accent-blue-500"
                                />
                                <label
                                    htmlFor={`radio1 + ${value.id}`}
                                    className="relative flex cursor-pointer items-center rounded-full p-3"
                                    data-ripple-dark="true"
                                >
                                    {"Chọn"}
                                </label>
                            </div>
                            <div className="col-span-2 flex items-center justify-center">
                                <input
                                    type="radio"
                                    id={`radio2 + ${value.id}`}
                                    onChange={handleRatioChange.bind(this, value.id, "radio2")}
                                    checked={value.radio2 === 0 ? false : true}
                                    name="radio2"
                                    className="scale-150 outline-none accent-blue-500"
                                />
                                <label
                                    htmlFor={`radio2 + ${value.id}`}
                                    className="relative flex cursor-pointer items-center rounded-full p-3"
                                    data-ripple-dark="true"
                                >
                                    {"Chọn"}
                                </label>
                            </div>
                            <div className="col-span-1 flex items-center justify-center space-x-4">
                                <div
                                    {...provided.dragHandleProps}
                                    className="text-blue-500 cursor-move relative flex flex-col justify-center items-center">
                                    <IconMax size="18" className="-rotate-45" />
                                    <IconMax size="18" className="rotate-45 absolute" />
                                </div>
                                <button onClick={() => handleDelete(value?.id)} type="button" className="text-red-500">
                                    <IconDelete />
                                </button>
                            </div>
                        </div>

                    </div>
                )}
            </Draggable>
        );
    };


    const DroppableContainer = ({ options }) => {
        return (
            <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`${snapshot.isDraggingOver ? "bg-slate-50" : "bg-white"} w-full transition-all duration-100 ease-in-out`}
                    >
                        <div className="flex flex-col h-fit">
                            {options.map((item, index) => (
                                <DraggableItem key={item.id} value={item} index={index} />
                            ))}
                        </div>
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        );
    };


    if (!enabled) {
        return null;
    }
    return (
        <PopupCustom
            title={`${props.dataLang?.stage_finishedProduct || "stage_finishedProduct"} (${props.code} - ${props.name
                })`}
            button={
                <div
                    onClick={() => {
                        if (role || checkEdit || checkAdd) {
                            sIsOpen(true);
                        } else {
                            isShow("warning", WARNING_STATUS_ROLE);
                        }
                    }}
                    className={props.type == "add" && "group outline-none transition-all ease-in-out flex items-center justify-center gap-1 hover:bg-slate-50 text-left cursor-pointer roundedw-full"}
                >
                    {props.type == "add" && (
                        <I3Square size={20} className="group-hover:text-amber-500 group-hover:scale-110" />
                    )}
                    <button type="button" className="group-hover:text-amber-500">
                        {props.type == "add" ? `${props.dataLang?.stage_design_finishedProduct || "stage_design_finishedProduct"}` : `${props.dataLang?.edit || "edit"}`}
                    </button>
                </div>
            }
            open={isOpen}
            onClose={_ToggleModal.bind(this, false)}
            classNameBtn={props.className}
        >
            <div className="py-4 w-[800px]">
                <div className="grid grid-cols-9 py-2">
                    <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center">
                        {props.dataLang?.no || "no"}
                    </h4>
                    <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-2 font-[400] text-left">
                        {props.dataLang?.stage_name_finishedProduct}
                    </h4>
                    <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-3 font-[400] text-left">
                        {props.dataLang?.check_first_stage_finishedProduct || "check_first_stage_finishedProduct"}
                    </h4>
                    <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-2 font-[400] text-center">
                        {props.dataLang?.stage_last_finishedProduct}
                    </h4>
                    <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase col-span-1 font-[400] text-center">
                        {props.dataLang?.branch_popup_properties}
                    </h4>
                </div>
                {isFetching || isLoading ? (
                    <Loading className="h-96" color="#0f4f9e" />
                ) : (
                    <>
                        <Customscrollbar className="3xl:h-[600px]  2xl:h-[470px] xl:h-[380px] lg:h-[350px] h-[400px]">
                            <DragDropContext onDragEnd={onDragEnd}>
                                <DroppableContainer options={option} />
                            </DragDropContext>
                            <button
                                type="button"
                                onClick={_HandleAddNew.bind(this)}
                                disabled={statusBtnAdd}
                                title="Thêm"
                                className={`${statusBtnAdd ? "opacity-50" : "opacity-100 hover:text-[#0F4F9E] hover:bg-[#e2f0fe]"} transition mt-5 w-full min-h-[100px] h-35 rounded-[5.5px] bg-slate-100 flex flex-col justify-center items-center`}
                            >
                                <IconAdd />
                                {props.dataLang?.stage_add_finishedProduct}
                            </button>
                        </Customscrollbar>
                        <div className="text-right mt-5 space-x-2">
                            <button
                                type="button"
                                onClick={_ToggleModal.bind(this, false)}
                                className={`text-[#344054] font-normal text-base py-2 px-4 rounded-[5.5px] border border-solid border-[#D0D5DD]`}
                            >
                                {props.dataLang?.branch_popup_exit}
                            </button>
                            <button
                                onClick={_HandleSubmit.bind(this)}
                                className="text-[#FFFFFF] font-normal text-base py-2 px-4 rounded-[5.5px] bg-[#0F4F9E]"
                            >
                                {props.dataLang?.branch_popup_save}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </PopupCustom>
    );
});
export default Popup_Stage;
