import PopupCustom from "@/components/UI/popup";
import { useChangePassword } from "@/hooks/useAuth";
import useToast from "@/hooks/useToast";
import { Eye, EyeSlash } from "iconsax-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import ButtonSubmit from "../button/buttonSubmit";

const PopupChangePassword = (props) => {
    const { dataLang } = props

    const isShow = useToast()

    const dispatch = useDispatch()

    const [showPassword, setShowPassword] = useState(false);

    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { register, handleSubmit, watch, formState: { errors }, } = useForm();

    const { isLoading, onSubmit: onSubmitChangePassword } = useChangePassword()

    const statePopupChangePassword = useSelector((state) => state.statePopupChangePassword);

    const onSubmit = async (data) => {
        const r = await onSubmitChangePassword(data)

        if (r?.isSuccess == 1) {
            isShow('success', r?.message)
            dispatch({
                type: "statePopupChangePassword",
                payload: {
                    open: false
                }
            })
            return
        }
        isShow('error', r?.message)
    };

    return (
        <PopupCustom
            title={dataLang?.change_password ?? "change_password"}
            onClickOpen={() => { }}
            open={statePopupChangePassword.open}
            onClose={() => {
                dispatch({ type: "statePopupChangePassword", payload: { open: false } })
            }}
            lockScroll={true}
            closeOnDocumentClick={true}
            classNameBtn={props?.className + "relative"}
        >
            <div className="flex items-center space-x-4 my-2 border-[#E7EAEE] border-opacity-70 border-b-[1px]"></div>
            <div className='max-w-sm w-[384px] h-fit bg-white rounded-xl relative'>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Mật khẩu mới */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700">{dataLang?.new_password ?? "new_password"}<span className="pl-1 text-red-500 text-[13px]">*</span></label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                {...register("newPassword", {
                                    required: dataLang?.please_enter_new_password ?? "please_enter_new_password",
                                    // minLength: { value: 6, message: "Mật khẩu ít nhất 6 ký tự" },
                                })}
                                className="block w-full pl-2 pr-9  py-3 mt-1 border rounded-md shadow-sm focus:border focus:outline-none placeholder:text-[13px] text-[13px]"
                                placeholder={dataLang?.enter_new_password ?? "enter_new_password"}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 flex items-center right-2"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeSlash /> : <Eye />}
                            </button>
                        </div>
                        {errors.newPassword && <p className="mt-1 text-[13px] text-red-500">{errors.newPassword.message}</p>}
                    </div>

                    {/* Xác nhận mật khẩu */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700">{dataLang?.confirm_password ?? "confirm_password"}<span className="pl-1 text-red-500 text-[13px]">*</span></label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                {...register("confirmPassword", {
                                    required: dataLang?.please_confirm_password ?? "please_confirm_password",
                                    validate: (value) => value === watch("newPassword") || (dataLang?.confirmation_password_does_not_match ?? "confirmation_password_does_not_match"),
                                })}
                                className="block w-full pl-2 pr-9  py-3 mt-1 border rounded-md shadow-sm focus:border focus:outline-none placeholder:text-[13px] text-[13px]"
                                placeholder={dataLang?.confirm_new_password ?? "confirm_new_password"}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 flex items-center right-2"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <EyeSlash /> : <Eye />}
                            </button>
                        </div>
                        {errors.confirmPassword && <p className="mt-1 text-[13px] text-red-500">{errors.confirmPassword.message}</p>}
                    </div>

                    <div className="flex flex-row justify-end w-full">
                        <ButtonSubmit
                            type="submit"
                            title={dataLang?.change_password ?? "change_password"}
                            className='w-fit'
                            loading={isLoading}
                            dataLang={dataLang}
                        />
                    </div>
                </form>
            </div>
        </PopupCustom >
    );
};

export default PopupChangePassword;
