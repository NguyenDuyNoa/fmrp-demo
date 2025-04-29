import PopupCustom from "@/components/UI/popup";
import { usePostRecommendation } from "@/hooks/popup/usePostRecommendation";
import useToast from "@/hooks/useToast";
import { motion } from 'framer-motion';
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import ButtonSubmit from "../button/buttonSubmit";
import { Customscrollbar } from "../common/Customscrollbar";
import ImageUploader from "../common/upload/ImageUploader";

const PopupRecommendation = (props) => {
    const { dataLang } = props

    const isShow = useToast()

    const dispatch = useDispatch();

    const [isSubmitted, setIsSubmitted] = useState(false);

    const statePopupRecommendation = useSelector((state) => state.statePopupRecommendation);

    const { register, handleSubmit, formState: { errors }, setValue, control, watch, reset } = useForm();

    const { onSubmit: postRecommendation, isLoading } = usePostRecommendation()

    const onSubmit = async (data) => {
        const r = await postRecommendation(data);
        if (r?.isSuccess == 1) {
            isShow('success', r?.message)
            setIsSubmitted(true);
            reset()
            setTimeout(() => {
                dispatch({ type: "statePopupRecommendation", payload: { open: false } });
                setIsSubmitted(false);
            }, 4000);
            return
        }
        isShow('error', r?.message)

    };

    return (
        <PopupCustom
            title={!isSubmitted ? (dataLang?.popup_recommendation_title ?? "popup_recommendation_title") : ''}
            open={statePopupRecommendation.open}
            onClose={() => {
                dispatch({ type: "statePopupRecommendation", payload: { open: false } });
                setIsSubmitted(false);
            }}
            type={isSubmitted ? 'popupRecommendationSubmitted' : ''}
            lockScroll={true}
            closeOnDocumentClick={true}
            classNameTittle="!text-[#25387A] font-semibold"
        >
            {
                !isSubmitted && <div className="flex items-center space-x-4 my-2 border-[#E7EAEE] border-opacity-70 border-b-[1px]" />
            }

            <div className='max-w-lg w-[512px] h-fit bg-white rounded-xl relative '>
                {isSubmitted
                    ?
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="flex flex-col items-center justify-center space-y-4"
                    >
                        <motion.svg
                            className="w-20 h-20 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            initial={{ strokeDasharray: 24, strokeDashoffset: 24 }}
                            animate={{ strokeDashoffset: 0 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                        </motion.svg>

                        <p
                            // initial={{ opacity: 0, y: 20 }}
                            // animate={{ opacity: 1, y: 0 }}
                            // transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                            className="text-xl font-semibold text-gray-800"
                        >
                            {dataLang?.popup_recommendation_thank_you ?? "popup_recommendation_thank_you"}
                        </p>
                        <p
                            // initial={{ opacity: 0, y: 10 }}
                            // animate={{ opacity: 1, y: 0 }}
                            // transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
                            className="text-sm text-center text-gray-600"
                        >
                            {dataLang?.popup_recommendation_message ?? "popup_recommendation_message"}
                        </p>
                    </motion.div>
                    :
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Tên công ty góp ý */}
                        {/* <div>
                        <label className="block text-sm font-medium text-gray-700">Tên công ty góp ý<span className="pl-1 text-red-500">*</span></label>
                        <input
                            type="text"
                            {...register("companyName", { required: "Vui lòng nhập tên công ty" })}
                            className="block w-full pl-2 pr-9  py-3 mt-1 border rounded-md shadow-sm focus:border focus:outline-none placeholder:text-[13px] text-[13px]"
                            placeholder="Nhập tên công ty"
                        />
                        {errors.companyName && <p className="text-xs text-red-500">{errors.companyName.message}</p>}
                    </div> */}

                        {/* Ngày góp ý */}
                        {/* <div className="relative">
                        <label className="block text-sm font-medium text-gray-700">Ngày góp ý<span className="pl-1 text-red-500">*</span></label>
                        <div className="relative">
                            <Controller
                                control={control}
                                name="feedbackDate"
                                rules={{ required: "Vui lòng chọn ngày góp ý" }}
                                render={({ field }) => (
                                    <DatePicker
                                        {...field}
                                        selected={field.value}
                                        onChange={(date) => field.onChange(date)}
                                        className="block w-full pl-2 pr-10  py-3 mt-1 border rounded-md shadow-sm focus:border focus:outline-none placeholder:text-[13px] text-[13px]"
                                        dateFormat="dd/MM/yyyy"
                                        placeholderText="Chọn ngày góp ý"
                                    />
                                )}
                            />
                            <FiCalendar className="absolute w-5 h-5 text-gray-400 pointer-events-none right-3 top-3.5" />
                            {watch("feedbackDate") && (
                                <button
                                    type="button"
                                    className="absolute text-gray-400 right-10 top-3.5 hover:text-gray-500"
                                    onClick={() => setValue("feedbackDate", null)}
                                >
                                    <FiXCircle className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                        {errors.feedbackDate && <p className="text-xs text-red-500">{errors.feedbackDate.message}</p>}
                    </div> */}

                        {/* Nội dung góp ý */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{dataLang?.popup_recommendation_feedback_content ?? "popup_recommendation_feedback_content"}<span className="pl-1 text-red-500">*</span></label>
                            <textarea
                                {...register("feedbackContent", { required: (dataLang?.popup_recommendation_feedback_required ?? "popup_recommendation_feedback_required") })}
                                className="w-full h-24 max-h-40 p-2 block pl-2 pr-9  py-3 mt-1 border rounded-md shadow-sm focus:border focus:outline-none placeholder:text-[13px] text-[13px]"
                                placeholder={dataLang?.popup_recommendation_feedback_placeholder ?? "popup_recommendation_feedback_placeholder"}
                            />
                            {errors.feedbackContent && <p className="text-xs text-red-500">{errors.feedbackContent.message}</p>}
                        </div>

                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">{dataLang?.popup_recommendation_upload_image ?? "popup_recommendation_upload_image"}</label>
                            <Customscrollbar className='max-h-[35vh] overflow-x-hidden'>
                                <ImageUploader
                                    onChange={(e) => {
                                        setValue("feedbackImages", e);
                                    }}
                                    maxFiles={10}
                                    maxSizeMB={2} // Giới hạn dung lượng 2MB mỗi file
                                    dataLang={dataLang}
                                />
                            </Customscrollbar>
                        </div>

                        {/* Nút gửi góp ý */}
                        <div className="flex justify-end">
                            <ButtonSubmit
                                type="submit"
                                title={dataLang?.popup_recommendation_submit ?? "popup_recommendation_submit"}
                                className='w-fit'
                                loading={isLoading}
                            />
                        </div>
                    </form>
                }
            </div>
        </PopupCustom>
    );
};

export default PopupRecommendation;
