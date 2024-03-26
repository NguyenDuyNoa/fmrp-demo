import ImageErrors from "../../imageErrors"

import ModalImage from "react-modal-image"

const CustomAvatar = ({ profileImage, fullName, data }) => {
    return (
        <div className="flex items-center justify-start gap-2">
            <div className="relative">
                <ModalImage
                    small={profileImage ? profileImage : "/user-placeholder.jpg"}
                    large={profileImage ? profileImage : "/user-placeholder.jpg"}
                    className="h-6 w-6 min-h-6 min-w-6 rounded-full object-cover "
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
                    <span className="inline-flex relative rounded-full h-2 w-2 bg-lime-500">
                        <span className="animate-ping  inline-flex h-full w-full rounded-full bg-lime-400 opacity-75 absolute"></span>
                    </span>
                </span>
            </div>
            <h6 className="capitalize">
                {fullName}
            </h6>
        </div>
    )
}
export default CustomAvatar