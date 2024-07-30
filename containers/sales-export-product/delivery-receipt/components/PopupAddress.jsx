import apiDeliveryReceipt from "@/Api/apiSalesExportProduct/deliveryReceipt/apiDeliveryReceipt";
import useToast from "@/hooks/useToast";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import PopupCustom from "/components/UI/popup";


const PopupAddress = (props) => {
    const [namePerson, setNamePerson] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [errNamePerson, setErrNamePerson] = useState(false);
    const [errAddress, setErrAddress] = useState(false);
    const [errPhone, setErrPhone] = useState(false);
    const [loading, setLoading] = useState(false);
    const isShow = useToast()
    const handleOnChangeInput = (type, value) => {
        if (namePerson !== "" || address !== "" || phone !== "") {
            setLoading(false);
        }
        if (type == "namePerson") {
            setNamePerson(value.target?.value);
            setErrNamePerson(false);
        } else if (type == "address") {
            setAddress(value.target?.value);
            setErrAddress(false);
        } else if (type == "phone") {
            setPhone(value);
            setErrPhone(false);
        }
    };

    const handingAddress = useMutation({
        mutationFn: (data) => {
            return apiDeliveryReceipt.apiHandingWarehouse(data);
        }
    })

    const handleSubmitAddress = async (e) => {
        e.preventDefault();
        if (namePerson === "") setErrNamePerson(true);
        if (address === "") setErrAddress(true);
        if (phone === "") setErrPhone(true);

        let data = new FormData();
        data.append("client_id", props?.clientId !== null ? props?.clientId : null);
        data.append("name", namePerson);
        data.append("address", address);
        data.append("phone", phone);
        setLoading(true);
        if (namePerson !== "" && address !== "" && phone !== "") {
            handingAddress.mutate(data, {
                onSuccess: ({ isSuccess, message }) => {
                    if (isSuccess) {
                        isShow("success", props.dataLang[message] || message);
                        setNamePerson("");
                        setAddress("");
                        setPhone("");
                        setLoading(false);
                        handleClosePopup();
                    } else {
                        isShow("error", props.dataLang[message] || message);
                    }
                },
                onError: (error) => { }
            });
        }
    };

    const handleClosePopup = () => {
        setNamePerson("");
        setAddress("");
        setPhone("");
        setErrNamePerson(false);
        setErrAddress(false);
        setErrPhone(false);
        setLoading(false);
        props?.handleClosePopupAddress();
    };

    return (
        <PopupCustom
            title={`${props.dataLang?.delivery_receipt_add_address || "delivery_receipt_add_address"}`}
            open={props.openPopupAddress}
            onClose={handleClosePopup}
            classNameBtn={props.className}
        >
            <div className="pt-5 w-96">
                <form onSubmit={(e) => handleSubmitAddress(e)} className="space-y-5">
                    <div className="space-y-1">
                        <label className="text-[#344054] font-normal text-base">
                            {props.dataLang?.delivery_receipt_name_person_address || "delivery_receipt_name_person_address"}
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                            value={namePerson}
                            onChange={(value) => handleOnChangeInput("namePerson", value)}
                            namePerson="fname"
                            type="text"
                            className={`${errNamePerson ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd] "
                                } placeholder-[color:#667085] w-full bg-[#ffffff] rounded-lg text-[#52575E] font-normal  p-2 border outline-none`}
                        />
                        {errNamePerson && (
                            <label className="text-sm text-red-500">
                                {props.dataLang?.delivery_receipt_err_name_person_address || "delivery_receipt_err_name_person_address"}
                            </label>
                        )}
                    </div>
                    <div className="space-y-1">
                        <label className="text-[#344054] font-normal">
                            {props.dataLang?.delivery_receipt_address || "delivery_receipt_address"}
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                            value={address}
                            onChange={(value) => handleOnChangeInput("address", value)}
                            namePerson="adress"
                            type="text"
                            className={`${errAddress ? "border-red-500" : "focus:border-[#92BFF7] border-[#d0d5dd] "
                                } placeholder-[color:#667085] w-full bg-[#ffffff] rounded-lg focus:border-[#92BFF7] text-[#52575E] font-normal  p-2 border border-[#d0d5dd] outline-none`}
                        />
                        {errAddress && (
                            <label className="text-sm text-red-500">
                                {props.dataLang?.delivery_receipt_err_address || "delivery_receipt_err_address"}
                            </label>
                        )}
                    </div>
                    <div className="space-y-1">
                        <label className="text-[#344054] font-normal">
                            {props.dataLang?.delivery_receipt_phone || "delivery_receipt_phone"}
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <PhoneInput
                            country={"vn"}
                            value={phone}
                            onChange={(value) => handleOnChangeInput("phone", value)}
                            inputProps={{ autoFocus: true }}
                            inputStyle={{
                                width: "100%",
                                border: errPhone ? "" : "1px solid #d0d5dd",
                                borderRadius: "8px",
                                paddingTop: "8px",
                                paddingBottom: "8px",
                                height: "auto",
                            }}
                            containerStyle={{
                                border: errPhone === true ? "1.5px solid red" : "",
                                borderRadius: "7px",
                            }}
                        />
                        {errPhone && (
                            <label className="text-sm text-red-500">
                                {props.dataLang?.delivery_receipt_err_phone || "delivery_receipt_err_phone"}
                            </label>
                        )}
                    </div>
                    <div className="mt-5 space-x-2 flex flex-row justify-end">
                        <button
                            type="button"
                            onClick={handleClosePopup}
                            className="button font-normal text-base py-2 px-4 rounded-lg border border-solid border-[#D0D5DD] text-gray-500 hover:text-gray-300 hover:bg-gray-100 transition-all"
                        >
                            {props.dataLang?.btn_cancel || "btn_cancel"}
                        </button>
                        <button
                            type="submit"
                            disabled={loading ? true : false}
                            className={`${loading ? "disabled:opacity-75" : ""} button font-normal text-base py-2 px-4 rounded-lg bg-sky-400 hover:bg-sky-500 text-[#FFFFFF] transition-shadow flex justify-center items-center gap-2`}
                        >
                            <AiOutlineLoading3Quarters className={`${loading ? "motion-reduce:hidden animate-spin visible" : "hidden"}`} />
                            <span>{props.dataLang?.btn_save || "btn_save"}</span>
                        </button>
                    </div>
                </form>
            </div>
        </PopupCustom>
    );
};

export default PopupAddress;
