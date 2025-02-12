import ImageErrors from "../../imageErrors"

import ModalImage from "react-modal-image"

const CustomAvatar = ({ profileImage, fullName, data }) => {
    return (
        <div className="flex items-center justify-start gap-2">
            <div className="relative min-w-[30%] w-[30%]">
                <ModalImage
                    small={profileImage ? profileImage : "/user-placeholder.jpg"}
                    large={profileImage ? profileImage : "/user-placeholder.jpg"}
                    className="object-cover w-full h-full rounded-full min-h-10 min-w-10 "
                    alt={fullName ?? ""}
                >
                    <div className="">
                        <ImageErrors
                            src={profileImage}
                            width={25}
                            height={25}
                            defaultSrc="/user-placeholder.jpg"
                            alt="Image"
                            className="object-cover  rounded-[100%] text-left cursor-pointer"
                        />
                    </div>
                </ModalImage>
                <span className="h-2 w-2 absolute 3xl:bottom-full 3xl:translate-y-[150%] 3xl:left-1/2  3xl:translate-x-[100%] 2xl:bottom-[80%] 2xl:translate-y-full 2xl:left-1/2 bottom-[50%] left-1/2 translate-x-full translate-y-full">
                    <span className="relative inline-flex w-2 h-2 rounded-full bg-lime-500">
                        <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-lime-400"></span>
                    </span>
                </span>
            </div>
            <h6 className="capitalize w-[70%]">
                {fullName}
            </h6>
        </div>
    )
}
export default CustomAvatar