import PopupCustom from "@/components/UI/popup";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import ButtonSubmit from "../button/buttonSubmit";
import ImageUploader from "../common/upload/ImageUploader";
import { Customscrollbar } from "../common/Customscrollbar";
import DatePicker from "react-datepicker";
import { FiCalendar, FiXCircle } from "react-icons/fi";
import useToast from "@/hooks/useToast";

const PopupRecommendation = (props) => {
    const isShow = useToast()
    const dispatch = useDispatch();
    const statePopupRecommendation = useSelector((state) => state.statePopupRecommendation);
    const { register, handleSubmit, formState: { errors }, setValue, control, watch } = useForm();
    const [feedbackImages, setFeedbackImages] = useState([]);

    const onSubmit = async (data) => {
        console.log("Góp ý:", data);
        console.log("Danh sách file ảnh:", feedbackImages);
        isShow('error', "Chức năng đang phát triển")
    };

    return (
        <PopupCustom
            title={"Góp ý"}
            open={statePopupRecommendation.open}
            onClose={() => {
                dispatch({ type: "statePopupRecommendation", payload: { open: false } });
            }}
            lockScroll={true}
            closeOnDocumentClick={true}
        >
            <div className="flex items-center space-x-4 my-2 border-[#E7EAEE] border-opacity-70 border-b-[1px]"></div>
            <div className='max-w-lg w-[512px] h-fit bg-white rounded-xl relative '>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Tên công ty góp ý */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tên công ty góp ý<span className="pl-1 text-red-500">*</span></label>
                        <input
                            type="text"
                            {...register("companyName", { required: "Vui lòng nhập tên công ty" })}
                            className="block w-full pl-2 pr-9  py-3 mt-1 border rounded-md shadow-sm focus:border focus:outline-none placeholder:text-[13px] text-[13px]"
                            placeholder="Nhập tên công ty"
                        />
                        {errors.companyName && <p className="text-xs text-red-500">{errors.companyName.message}</p>}
                    </div>

                    {/* Ngày góp ý */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700">Ngày góp ý<span className="pl-1 text-red-500">*</span></label>
                        {/* <Controller
                            control={control}
                            name="feedbackDate"
                            rules={{ required: "Vui lòng chọn ngày góp ý" }}
                            render={({ field }) => (
                                <DatePicker
                                    {...field}
                                    selected={field.value}
                                    onChange={(date) => field.onChange(date)}
                                    className="block w-full pl-2 pr-9  py-3 mt-1 border rounded-md shadow-sm focus:border focus:outline-none placeholder:text-[13px] text-[13px]"
                                    dateFormat="dd/MM/yyyy"
                                    placeholderText="Chọn ngày góp ý"
                                />
                            )}
                        /> */}
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
                            {/* Icon lịch */}
                            <FiCalendar className="absolute w-5 h-5 text-gray-400 pointer-events-none right-3 top-3.5" />
                            {/* Dấu X để xóa ngày */}
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
                    </div>

                    {/* Nội dung góp ý */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nội dung góp ý<span className="pl-1 text-red-500">*</span></label>
                        <textarea
                            {...register("feedbackContent", { required: "Vui lòng nhập nội dung góp ý" })}
                            className="w-full h-24 max-h-24 p-2 block pl-2 pr-9  py-3 mt-1 border rounded-md shadow-sm focus:border focus:outline-none placeholder:text-[13px] text-[13px]"
                            placeholder="Nhập nội dung góp ý"
                        />
                        {errors.feedbackContent && <p className="text-xs text-red-500">{errors.feedbackContent.message}</p>}
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Tải lên hình ảnh góp ý (kéo & thả hoặc chọn file)</label>
                        <Customscrollbar className='max-h-[23vh] overflow-x-hidden'>
                            <ImageUploader
                                onChange={(e) => {
                                    console.log("e", e);

                                }}
                                maxSizeMB={2} // Giới hạn dung lượng 2MB mỗi file
                            />
                        </Customscrollbar>
                    </div>

                    {/* Nút gửi góp ý */}
                    <div className="flex justify-end">
                        <ButtonSubmit type="submit" title="Gửi góp ý" className='w-fit' />
                    </div>
                </form>
            </div>
        </PopupCustom>
    );
};

export default PopupRecommendation;
