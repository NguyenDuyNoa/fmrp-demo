import useToast from "@/hooks/useToast";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import PopupEdit from "@/components/UI/popup";
import { useToggle } from "@/hooks/useToggle";
import Select from "react-select";
import {
    SearchNormal1 as IconSearch,
    Trash as IconDelete,
    UserEdit as IconUserEdit,
    Grid6 as IconExcel,
    Image as IconImage,
    GalleryEdit as IconEditImg,
    ArrowDown2 as IconDown,
    Add as IconAdd,
    Maximize4 as IconMax,
    CloseCircle as IconClose,
    TickCircle as IconTick,
    I3Square,
} from "iconsax-react";
import { NumericFormat } from "react-number-format";
import SelectOptionLever from "@/components/UI/selectOptionLever/selectOptionLever";
import Loading from "@/components/UI/loading";
import { _ServerInstance as Axios } from "/services/axios";
import { SortableContainer, SortableElement, sortableHandle } from "react-sortable-hoc";
import { arrayMoveImmutable } from "array-move";
import useActionRole from "@/hooks/useRole";
import { WARNING_STATUS_ROLE } from "@/constants/warningStatus/warningStatus";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
const Popup_GiaiDoan = React.memo((props) => {
    const listCd = useSelector((state) => state.congdoan_finishedProduct);

    const isShow = useToast();

    const [isOpen, sIsOpen] = useState(false);

    const _ToggleModal = (e) => sIsOpen(e);

    const scrollAreaRef = useRef(null);
    const handleMenuOpen = () => {
        const menuPortalTarget = scrollAreaRef != null ? scrollAreaRef.current : scrollAreaRef;
        return { menuPortalTarget };
    };

    const { is_admin: role, permissions_current: auth } = useSelector((state) => state.auth);

    const { checkAdd, checkEdit } = useActionRole(auth, 'products');

    const [onSending, sOnSending] = useState(false);

    const [onFetching, sOnFetching] = useState(false);

    const [statusBtnAdd, sStatusBtnAdd] = useState(false);

    const [errName, sErrName] = useState(false);

    const [listCdChosen, sListCdChosen] = useState([]);

    const [option, sOption] = useState([]);

    const [listCdRest, sListCdRest] = useState([]);

    const [name, sName] = useState(null);

    const [radio1, sRadio1] = useState(0);

    const [radio2, sRadio2] = useState(0);

    useEffect(() => {
        isOpen && sOption([]);
        isOpen && sListCdChosen([]);
        isOpen && sStatusBtnAdd(false);
        isOpen && sErrName(false);
        isOpen && sOnFetching(true);
    }, [isOpen]);

    useEffect(() => {
        if (listCd?.length == option?.length) {
            sStatusBtnAdd(true);
        } else {
            sStatusBtnAdd(false);
        }
    }, [option]);

    const _ServerFetching = () => {
        Axios("GET", `/api_web/api_product/getDesignStages/${props.id}?csrf_protection=true`, {}, (err, response) => {
            if (!err) {
                const data = response.data;
                sOption(
                    data.map((e) => ({
                        id: Number(e.id),
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
            }
            sOnFetching(false);
        });
    };

    useEffect(() => {
        onFetching && _ServerFetching();
    }, [onFetching]);

    const _ServerSending = () => {
        const formData = new FormData();

        formData.append("product_id", props.id);
        if (option?.length > 0) {
            option.forEach((item, index) => {
                formData.append(`data[${index}][stages]`, item?.name?.value);
                formData.append(`data[${index}][type]`, item.radio1);
                formData.append(`data[${index}][final_stage]`, item.radio2);
            });
        }
        Axios(
            "POST",
            "/api_web/api_product/designStages?csrf_protection=true",
            {
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
            },
            (err, response) => {
                if (!err) {
                    const { isSuccess, message } = response.data;
                    if (isSuccess) {
                        isShow("success", props.dataLang[message] || message);
                        sIsOpen(false);
                        props.onRefresh && props.onRefresh();
                    } else {
                        isShow("error", props.dataLang[message] || message);
                    }
                }
                sOnSending(false);
            }
        );
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

    //Draggable

    const _HandleAddNew = () => {
        sOption([...option, { id: Date.now(), name: name, radio1: radio1, radio2: radio2 }]);
        sName(null);
        sRadio1(0);
        sRadio2(0);
    };

    const onSortEnd = ({ oldIndex, newIndex }) => {
        var newItems = arrayMoveImmutable([...option], oldIndex, newIndex);
        sOption(newItems);
    };

    useEffect(() => {
        isOpen &&
            listCdChosen &&
            sListCdRest(
                listCd?.filter(
                    (item1) =>
                        !listCdChosen.some((item2) => item1.label === item2?.label && item1.value === item2?.value)
                )
            );
    }, [listCdChosen]);

    const handleDelete = (updatedData) => {
        sOption(updatedData);
    };

    const handleRatioChange = (id, type) => {
        const updatedData = option.map((item) => {
            if (item.id === id) {
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
        const index = option.findIndex((x) => x.id === id);
        option[index].name = value;
        sOption([...option]);
        sListCdChosen(option.map((e) => e.name));
    };

    const ItemDragHandle = sortableHandle(() => {
        return (
            <button type="button" className="text-blue-500 relative flex flex-col justify-center items-center">
                <IconMax size="18" className="-rotate-45" />
                <IconMax size="18" className="rotate-45 absolute" />
            </button>
        );
    });

    const SortableList = SortableContainer(({ items, onClickDelete }) => {
        const handleDelete = (id) => {
            const updatedItems = items.filter((item) => item.id !== id);
            onClickDelete(updatedItems);
        };
        return (
            <div className="divide-y divide-slate-100">
                {items.map((e, index) => (
                    <SortableItem
                        key={`item-${e.value}`}
                        index={index}
                        indexItem={index}
                        value={e}
                        onClickDelete={handleDelete}
                    />
                ))}
            </div>
        );
    });

    const SortableItem = SortableElement(({ value, indexItem, onClickDelete }) => {
        const handleDeleteClick = () => {
            onClickDelete(value.id);
        };

        return (
            <div className="flex items-center z-[999] py-1 hover:bg-slate-50 bg-white">
                <h6 className="w-[5%] text-center px-2">{indexItem + 1}</h6>
                <div className="w-[30%] px-2">
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
                <div className="w-[30%] flex items-center justify-center">
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
                <div className="w-[20%] flex items-center justify-center">
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
                <div className="w-[15%] flex items-center justify-center space-x-4">
                    <ItemDragHandle />
                    <button onClick={handleDeleteClick.bind(this)} type="button" className="text-red-500">
                        <IconDelete />
                    </button>
                </div>
            </div>
        );
    });

    return (
        <PopupEdit
            title={`${props.dataLang?.stage_finishedProduct || "stage_finishedProduct"} (${props.code} - ${props.name
                })`}
            button={
                <div
                    onClick={() => {
                        if (role || checkEdit || checkAdd) {
                            sIsOpen(true)
                        } else {
                            isShow("warning", WARNING_STATUS_ROLE)
                        }
                    }}
                    className={props.type == 'add' && "group outline-none transition-all ease-in-out flex items-center justify-center gap-1 hover:bg-slate-50 text-left cursor-pointer roundedw-full"}>
                    {props.type == "add" && <I3Square size={20} className="group-hover:text-amber-500 group-hover:scale-110" />}
                    <button type="button" className="group-hover:text-amber-500" >
                        {props.type == "add"
                            ? `${props.dataLang?.stage_design_finishedProduct || "stage_design_finishedProduct"}`
                            : `${props.dataLang?.edit || "edit"}`}
                    </button>
                </div>
            }
            open={isOpen}
            onClose={_ToggleModal.bind(this, false)}
            classNameBtn={props.className}
        >
            <div className="py-4 w-[800px]">
                <div className="flex w-full items-center py-2">
                    <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[5%] font-[400] text-center">
                        {props.dataLang?.no || "no"}
                    </h4>
                    <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[30%] font-[400] text-left">
                        {props.dataLang?.stage_name_finishedProduct}
                    </h4>
                    <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[30%] font-[400] text-left">
                        {props.dataLang?.check_first_stage_finishedProduct || "check_first_stage_finishedProduct"}
                    </h4>
                    <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[20%] font-[400] text-center">
                        {props.dataLang?.stage_last_finishedProduct}
                    </h4>
                    <h4 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase w-[15%] font-[400] text-center">
                        {props.dataLang?.branch_popup_properties}
                    </h4>
                </div>
                {onFetching ? (
                    <Loading className="h-96" color="#0f4f9e" />
                ) : (
                    <>
                        <Customscrollbar className="3xl:h-[600px]  2xl:h-[470px] xl:h-[380px] lg:h-[350px] h-[400px]">
                            <SortableList
                                useDragHandle
                                lockAxis={"y"}
                                items={option}
                                onSortEnd={onSortEnd.bind(this)}
                                onClickDelete={handleDelete}
                            />
                            <button
                                type="button"
                                onClick={_HandleAddNew.bind(this)}
                                disabled={statusBtnAdd}
                                title="Thêm"
                                className={`${statusBtnAdd ? "opacity-50" : "opacity-100 hover:text-[#0F4F9E] hover:bg-[#e2f0fe]"
                                    } transition mt-5 w-full min-h-[100px] h-35 rounded-[5.5px] bg-slate-100 flex flex-col justify-center items-center`}
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
        </PopupEdit>
    );
});
export default Popup_GiaiDoan