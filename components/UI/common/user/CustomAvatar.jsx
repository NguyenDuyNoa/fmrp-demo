import { getColorByParam, getRandomColors } from "@/utils/helpers/radomcolor";
import ImageErrors from "../../imageErrors"

import ModalImage from "react-modal-image"
import { Lightbox } from "react-modal-image";

const CustomAvatar = ({ profileImage, fullName, data, classNameAvatar }) => {
    const randomColors = getColorByParam(fullName)
    console.log("fullName", fullName);

    return (
        <div className="flex items-center justify-start w-full gap-2">
            <div className={`relative ${classNameAvatar} ${profileImage ? "w-[32px] min-w-[32px] max-w-[32px]" : " w-[26px] min-w-[26px] max-w-[26px]"} `}>
                {
                    profileImage ?
                        <>
                            <ModalImage
                                small={profileImage ? profileImage : "/user-placeholder.jpg"}
                                large={profileImage ? profileImage : "/user-placeholder.jpg"}
                                className="object-cover rounded-full w-7 h-7 max-w-7 max-h-7 min-w-7 min-h-7 clickModalImage"
                                alt={fullName ?? ""}

                            >
                                <div className="">
                                    <ImageErrors
                                        src={profileImage}
                                        width={25}
                                        height={25}
                                        defaultSrc="/user-placeholder.jpg"
                                        alt="Image"
                                        className="object-contain  rounded-[100%] text-left cursor-pointer"
                                    />
                                </div>
                            </ModalImage>
                        </>
                        :
                        <div className="text-[#0F4F9E] ">
                            <div
                                style={{ backgroundImage: `linear-gradient(to left, ${randomColors[1]}, ${randomColors[0]})` }}
                                className=" text-base  rounded-full h-[26px] uppercase  w-[26px] text-[#FFFFFF] flex items-center justify-center"
                            >
                                {fullName ? fullName[0] : ""}
                            </div>
                        </div>
                }
                <span className="h-2 w-2 absolute 3xl:bottom-full 3xl:translate-y-[150%] 3xl:left-1/2  3xl:translate-x-[100%] 2xl:bottom-[80%] 2xl:translate-y-full 2xl:left-1/2 bottom-[50%] left-1/2 translate-x-full translate-y-full">
                    <span className="relative inline-flex w-2 h-2 rounded-full bg-lime-500">
                        <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-lime-400"></span>
                    </span>
                </span>
            </div>
            <h6 className="text-[13px] capitalize">
                {fullName}
            </h6>
        </div>
    )
}
export default CustomAvatar