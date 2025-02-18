import PopupCustom from "@/components/UI/popup";
import { FORMAT_MOMENT } from "@/constants/formatDate/formatDate";
import { useGetInfo, useUpdateAvatar } from "@/hooks/useAuth";
import { formatMoment } from "@/utils/helpers/formatMoment";
import { Camera } from "iconsax-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TagBranch from "../common/Tag/TagBranch";
import useToast from "@/hooks/useToast";
import Loading from "../loading/loading";

const PopupAccountInformation = (props) => {
    const isShow = useToast()

    const dispatch = useDispatch()

    const stateAuth = useSelector((state) => state.auth);

    const statePopupAccountInformation = useSelector((state) => state.statePopupAccountInformation);

    const { data, isLoading: isLoadingInfo } = useGetInfo({ open: statePopupAccountInformation.open })

    const { onSubmit, isLoaidng } = useUpdateAvatar()

    const [image, setImage] = useState('/user-placeholder.jpg');

    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            const r = await onSubmit(file)
            if (r?.isSuccess == 1) {
                setImage(imageUrl);
                dispatch({
                    type: "auth/update",
                    payload: {
                        ...stateAuth,
                        user_avatar: imageUrl
                    }
                })
                isShow('success', r?.message)
                return
            }
            isShow('error', r?.message)
        }
    };

    useEffect(() => {
        if (data?.data?.staff?.profile_image) {
            setImage(data?.data?.staff?.profile_image)
        }
    }, [data])

    return (
        <PopupCustom
            title={"Thông tin tài khoản"}
            onClickOpen={() => { }}
            open={statePopupAccountInformation.open}
            onClose={() => {
                dispatch({ type: "statePopupAccountInformation", payload: { open: false } })
            }}
            classNameBtn={props?.className + "relative"}
        >
            <div className="flex items-center space-x-4 my-2 border-[#E7EAEE] border-opacity-70 border-b-[1px]"></div>
            <div className='max-w-sm w-[384px] h-fit bg-white rounded-xl relative'>
                {
                    isLoadingInfo
                        ?
                        <Loading className='h-[120px]' />
                        :
                        <>
                            <div className="flex items-center gap-4">
                                <label className="relative cursor-pointer">
                                    <div className="w-16 h-16 overflow-hidden border border-gray-300 rounded-full">
                                        <Image
                                            width={1280}
                                            height={1024}
                                            src={image}
                                            alt="Profile"
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                    <label className="absolute bottom-0 right-0 p-1 bg-gray-200 border border-gray-300 rounded-full cursor-pointer">
                                        <Camera size={16} className="text-gray-600" />
                                        <input
                                            disabled={isLoaidng}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageChange}
                                        />
                                    </label>
                                </label>
                                <h2 className="text-lg font-semibold">{data?.data?.staff?.full_name}</h2>
                            </div>
                            <div className="mt-4 space-y-2 text-gray-700">
                                <div>
                                    <span className="text-sm font-normal">Chức vụ:</span> <span className="text-sm font-semibold">{data?.data?.staff?.position_name}</span>
                                </div>

                                <div>
                                    <span className="text-sm font-normal">Email:</span> <span className="text-sm font-semibold">{data?.data?.staff?.email}</span>
                                </div>

                                <div>
                                    <span className="text-sm font-normal">Điện thoại:</span> <span className="text-sm font-semibold">{data?.data?.staff?.phonenumber}</span>
                                </div>
                                <div>
                                    <span className="text-sm font-normal">Lần đăng nhập trước đó:</span> <span className="text-sm font-semibold">{formatMoment(data?.data?.staff?.created_at, FORMAT_MOMENT.DATE_SLASH_LONG)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="text-sm font-normal">Chi nhánh:</div>
                                    <div className="flex items-center gap-2">
                                        {
                                            data?.data?.staff?.branch?.map(e => {
                                                return (
                                                    <TagBranch key={e?.id} className="w-fit">
                                                        {e?.name}
                                                    </TagBranch>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        </>
                }
            </div>
        </PopupCustom >
    );
};

export default PopupAccountInformation;
