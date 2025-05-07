import ButtonAnimationNew from "@/components/common/button/ButtonAnimationNew";
import ErrorChatBot from "@/components/icons/common/ErrorChatBot";
import SuccessChatIcon from "@/components/icons/common/SuccessChatIcon";
import Image from "next/image";
import React from "react";
import { FaCheck } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";
const ResultChatBot = ({ productAnalysis, onRetry, onRedirect }) => {
    return (
        <div className="w-full mx-auto px-1 py-5 text-center flex flex-col items-center justify-center gap-y-8 h-full lgd:max-h-[500px]">
            {/* Tiêu đề + icon */}
            <div className="flex justify-center items-center gap-2 ">
                {productAnalysis.isSuccess === 1 ||
                    productAnalysis.isSuccess === true ? (
                    <SuccessChatIcon />
                ) : (
                    <ErrorChatBot />
                )}
                <h2 className="text-2xl font-bold text-[#25387A] font-deca">
                    {productAnalysis.message ?? "Thêm dữ liệu thành công!"}
                </h2>
            </div>

            {/* Hình ảnh minh họa */}
            <div className="flex justify-center">
                {productAnalysis.isSuccess === 1 ||
                    productAnalysis.isSuccess === true ? (
                    <Image
                        src="/bot-ai/userSuccess.png" // thay bằng đường dẫn hình bạn export
                        alt="Success"
                        width={600}
                        height={600}
                        className="w-[300px] h-[230px]"
                        loading="eager"
                        priority
                    />
                ) : (
                    <Image
                        src="/bot-ai/userFail.png" // thay bằng đường dẫn hình bạn export
                        alt="Success"
                        width={600}
                        height={600}
                        className="w-[300px] h-[230px]"
                        loading="eager"
                        priority
                    />
                )}
            </div>

            {/* Mô tả + link */}
            {productAnalysis.isSuccess === 1 || productAnalysis.isSuccess === true ? (
                <p className="text-lg font-deca font-medium text-[#1C252E]  max-w-[473px]">
                    Xin chúc mừng, dữ liệu của bạn đã được thêm vào hệ thống! Vui lòng
                    truy cập vào mục{" "}
                    <span className="text-[#0375F3]">Danh sách thành phẩm</span> để xem
                    chi tiết hoặc tuỳ chỉnh.
                </p>
            ) : (
                <p className="text-lg font-deca font-medium text-[#1C252E]  max-w-[473px]">
                    Rất tiếc, dữ liệu của bạn không thể được thêm vào hệ thống! Điều này
                    xảy ra do lỗi hệ thống hiện chưa nhận diện được sản phẩm hoặc dữ liệu
                    đã tồn tại.
                </p>
            )}

            {/* Hành động */}
            {productAnalysis.isSuccess === 1 || productAnalysis.isSuccess === true ? (
                <div className="flex justify-center gap-x-2 flex-row w-full">
                    <ButtonAnimationNew
                        title="Phân tích sản phẩm khác"
                        className="flex items-center gap-2 bg-white px-6 py-4 border border-[#00A76F] text-[#00A76F] rounded-xl hover:bg-[#F3F4F6] transition text-lg font-deca font-normal hover:shadow-hover-button "
                        onClick={() => onRetry()}
                    />

                    <ButtonAnimationNew
                        icon={
                            <div className="size-4">
                                <FaArrowRightLong />
                            </div>
                        }
                        title=" Truy cập ngay "
                        className="flex items-center gap-2 bg-linear-background-button-chat rounded-xl px-6 py-4 text-white transition text-lg font-deca font-medium hover:shadow-hover-button "
                        onClick={() => onRedirect()}
                        reverse={1}
                    />
                </div>
            ) : (
                <div className="w-full flex flex-row justify-center items-center">
                    <ButtonAnimationNew
                        title="Phân tích sản phẩm khác"
                        className="flex items-center gap-2 bg-linear-background-button-chat rounded-xl px-6 py-4 text-white transition text-lg font-deca font-medium hover:shadow-hover-button "
                        onClick={() => onRetry()}
                    />
                </div>
            )}
        </div>
    );
};

export default ResultChatBot;
