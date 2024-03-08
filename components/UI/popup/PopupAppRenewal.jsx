import React, { useEffect, useState } from 'react'
import Popup from 'reactjs-popup';
import Image from 'next/image'
import { MdClose } from "react-icons/md";
import { FormatNumberDot } from '../format/FormatNumber';
import { PresentionChart, User } from 'iconsax-react';

import Select, { components } from "react-select";

const PopupAppRenewal = () => {
    const [openModal, setOpenModal] = useState(false)

    const handleCloseModal = () => {
        setOpenModal(false)
    }

    const hiddenOptions = [];
    // const hiddenOptions = isState?.idBranch?.length > 3 ? isState?.idBranch?.slice(0, 3) : [];

    const options = [];
    // const options = listBr_filter ? listBr_filter?.filter((x) => !hiddenOptions.includes(x.value)) : [];

    return (
        <Popup
            // trigger={<button className="button"> Open Modal </button>}
            modal
            open={openModal}
            closeOnEscape
            // onClose={() => setOpenModal(false)}
            // defaultOpen={true}
            closeOnDocumentClick={false}
            lockScroll
        >
            <div className='3xl:w-[1000px] 3xl:max-w-[1100px] w-[800px] max-w-[900px] h-full flex flex-col gap-6 bg-white rounded-xl relative p-6'>
                <MdClose onClick={handleCloseModal} className='absolute top-4 right-4 text-2xl cursor-pointer text-[#000000] hover:text-[#000000]/80 hover:scale-105 duration-300 transition-colors' />
                <div className='flex flex-col gap-2'>
                    <div className='text-xl text-[#101828] font-bold'>
                        Gia hạn phần mềm
                    </div>
                    <div className='bg-[#FFEEF0] text-[#EE1E1E] w-full p-1 font-semibold'>
                        Đã hết hạn gói dùng thử, vui lòng gia hạn để tiếp tục sử dụng!
                    </div>
                </div>
                <div className='bg-[#F3F9FF] border border-[#C7DFFB] rounded-xl p-6 flex flex-col gap-2'>
                    <div className='w-full grid grid-cols-3 gap-4'>
                        <div className='col-span-1 w-full flex flex-col gap-1'>
                            <div className='text-sm text-[#344054] font-semibold'>
                                Chọn gói
                            </div>
                            <Select
                                options={[
                                    {
                                        value: "",
                                        label: "Chọn chọn gói",
                                        isDisabled: true,
                                    },
                                    ...options,
                                ]}
                                // onMenuOpen={() => handleOpenSelect('branch')}
                                // onChange={onChangeFilter.bind(this, "branch")}
                                // value={}
                                hideSelectedOptions={false}
                                isMulti
                                isClearable={true}
                                placeholder={"Chọn gói"}
                                className="rounded-md bg-white 3xl:text-base xxl:text-sm text-xs z-20"
                                isSearchable={true}
                                noOptionsMessage={() => "Không có dữ liệu"}
                                closeMenuOnSelect={false}
                                style={{
                                    border: "none",
                                    boxShadow: "none",
                                    outline: "none",
                                }}
                                theme={(theme) => ({
                                    ...theme,
                                    colors: {
                                        ...theme.colors,
                                        primary25: "#EBF5FF",
                                        primary50: "#92BFF7",
                                        primary: "#0F4F9E",
                                    },
                                })}
                                styles={{
                                    placeholder: (base) => ({
                                        ...base,
                                        color: "#cbd5e1",
                                    }),
                                    control: (base, state) => ({
                                        ...base,
                                        border: "none",
                                        outline: "none",
                                        boxShadow: "none",
                                        ...(state.isFocused && {
                                            boxShadow: "0 0 0 1.5px #0F4F9E",
                                        }),
                                    }),
                                }}
                            />
                        </div>
                        <div className='col-span-1 w-full flex flex-col gap-1'>
                            <div className='text-sm text-[#344054] font-semibold'>
                                Thời hạn
                            </div>
                            <Select
                                options={[
                                    {
                                        value: "",
                                        label: "Chọn thời hạn",
                                        isDisabled: true,
                                    },
                                    ...options,
                                ]}
                                // onMenuOpen={() => handleOpenSelect('branch')}
                                // onChange={onChangeFilter.bind(this, "branch")}
                                // value={}
                                hideSelectedOptions={false}
                                isMulti
                                isClearable={true}
                                placeholder={"Chọn gói"}
                                className="rounded-md bg-white 3xl:text-base xxl:text-sm text-xs z-20"
                                isSearchable={true}
                                noOptionsMessage={() => "Không có dữ liệu"}
                                closeMenuOnSelect={false}
                                style={{
                                    border: "none",
                                    boxShadow: "none",
                                    outline: "none",
                                }}
                                theme={(theme) => ({
                                    ...theme,
                                    colors: {
                                        ...theme.colors,
                                        primary25: "#EBF5FF",
                                        primary50: "#92BFF7",
                                        primary: "#0F4F9E",
                                    },
                                })}
                                styles={{
                                    placeholder: (base) => ({
                                        ...base,
                                        color: "#cbd5e1",
                                    }),
                                    control: (base, state) => ({
                                        ...base,
                                        border: "none",
                                        outline: "none",
                                        boxShadow: "none",
                                        ...(state.isFocused && {
                                            boxShadow: "0 0 0 1.5px #0F4F9E",
                                        }),
                                    }),
                                }}
                            />
                        </div>
                        <div className='col-span-1 w-full flex flex-col gap-1'>
                            <div className='text-sm text-[#344054] font-semibold'>
                                Số user
                            </div>
                            <Select
                                options={[
                                    {
                                        value: "",
                                        label: "Chọn số user",
                                        isDisabled: true,
                                    },
                                    ...options,
                                ]}
                                // onMenuOpen={() => handleOpenSelect('branch')}
                                // onChange={onChangeFilter.bind(this, "branch")}
                                // value={}
                                hideSelectedOptions={false}
                                isMulti
                                isClearable={true}
                                placeholder={"Chọn gói"}
                                className="rounded-md bg-white 3xl:text-base xxl:text-sm text-xs z-20"
                                isSearchable={true}
                                noOptionsMessage={() => "Không có dữ liệu"}
                                closeMenuOnSelect={false}
                                style={{
                                    border: "none",
                                    boxShadow: "none",
                                    outline: "none",
                                }}
                                theme={(theme) => ({
                                    ...theme,
                                    colors: {
                                        ...theme.colors,
                                        primary25: "#EBF5FF",
                                        primary50: "#92BFF7",
                                        primary: "#0F4F9E",
                                    },
                                })}
                                styles={{
                                    placeholder: (base) => ({
                                        ...base,
                                        color: "#cbd5e1",
                                    }),
                                    control: (base, state) => ({
                                        ...base,
                                        border: "none",
                                        outline: "none",
                                        boxShadow: "none",
                                        ...(state.isFocused && {
                                            boxShadow: "0 0 0 1.5px #0F4F9E",
                                        }),
                                    }),
                                }}
                            />
                        </div>
                    </div>
                    <div className='w-full flex items-center justify-end pb-3 border-b border-[#92BFF7]'>
                        <div className='flex items-center gap-1'>
                            <span className='text-base text-[#344053]'>Tổng: </span>
                            <span className='text-lg text-[#344053] font-semibold'>{FormatNumberDot(12000000)} VNĐ</span>
                        </div>
                    </div>
                    <div className='flex flex-row items-center justify-between'>
                        <div className='text-sm text-[#344054] max-w-[50%] font-semibold'>
                            * 12.000.000đ/tháng bao gồm 5 user
                            <br />
                            User tăng thêm: 200k/tháng, 200k/user thứ 6 trở đi
                        </div>
                    </div>
                </div>

                <div className='flex flex-col'>
                    <div className='text-xl text-[#101828] font-bold'>
                        Hướng dẫn thanh toán
                    </div>
                    <div className='text-base text-[#667085] max-w-[70%] font-medium'>
                        Sau khi tạo mới hoặc nâng cấp gói cước, vui lòng chuyển khoản vào một tài khoản bên dưới với nội dung chuyển khoản là mã gia hạn vừa được tạo
                    </div>
                </div>

                <div className='grid grid-cols-7 gap-4'>
                    <div className='col-span-4 flex flex-col w-full border rounded-lg'>
                        <div className='flex flex-row items-center gap-2 bg-[#F7F9FC] p-2 rounded-lg'>
                            <PresentionChart
                                color="#3A3E4C"
                                variant="Bold"
                                className='w-6 h-6'
                            />
                            <div className='text-base text-[#3A3E4C] font-medium'>Đối với khách hàng doanh nghiệp</div>
                        </div>
                        <div className='p-4 flex flex-row gap-6'>
                            <div className='flex flex-col gap-4'>
                                <Image
                                    src="/pay/acb.png"
                                    alt="ACB"
                                    width={400}
                                    height={400}
                                    className='w-[100px] min-w-[100px] h-auto object-contain'
                                />
                                <Image
                                    src="/pay/qr1.png"
                                    alt="ACB"
                                    width={800}
                                    height={800}
                                    className='w-[130px] min-w-[130px] h-auto object-contain'
                                    style={{ mixBlendMode: "luminosity" }}
                                />
                            </div>
                            <div className='flex flex-col justify-between gap-2'>
                                <div className='flex flex-col'>
                                    <div className='text-base text-[#667085]'>
                                        Tên tài khoản:
                                    </div>
                                    <div className='text-base uppercase font-bold text-[#141522]'>
                                        CONG ty tnhh giai phap phan mem foso
                                    </div>
                                </div>
                                <div className='flex flex-col'>
                                    <div className='text-base text-[#667085]'>
                                        Số TK:
                                    </div>
                                    <div className='text-base capitalize font-bold text-[#141522]'>
                                        881688
                                    </div>
                                </div>
                                <div className='flex flex-col'>
                                    <div className='text-base text-[#667085]'>
                                        Ngân hàng:
                                    </div>
                                    <div className='text-base capitalize font-bold text-[#141522]'>
                                        Á Châu (ACB) - Chi Nhánh TP HCM
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-span-3 flex flex-col w-full border rounded-lg'>
                        <div className='flex flex-row items-center gap-2 bg-[#F7F9FC] p-2 rounded-lg'>
                            <User
                                color="#3A3E4C"
                                variant="Bold"
                                className='w-6 h-6'
                            />
                            <div className='text-base text-[#3A3E4C] font-medium'>Đối với khách hàng cá nhân</div>
                        </div>
                        <div className='p-4 flex flex-row gap-6'>
                            <div className='flex flex-col gap-4'>
                                <Image
                                    src="/pay/acb.png"
                                    alt="ACB"
                                    width={400}
                                    height={400}
                                    className='w-[100px] min-w-[100px] h-auto object-contain'
                                />
                                <Image
                                    src="/pay/qr2.png"
                                    alt="ACB"
                                    width={800}
                                    height={800}
                                    className='w-[130px] min-w-[130px] h-auto object-contain'
                                    style={{ mixBlendMode: "luminosity" }}
                                />
                            </div>
                            <div className='flex flex-col justify-between gap-2'>
                                <div className='flex flex-col'>
                                    <div className='text-base text-[#667085]'>
                                        Tên tài khoản:
                                    </div>
                                    <div className='text-base uppercase font-bold text-[#141522]'>
                                        bui pham thanh thuy
                                    </div>
                                </div>
                                <div className='flex flex-col'>
                                    <div className='text-base text-[#667085]'>
                                        Số TK:
                                    </div>
                                    <div className='text-base capitalize font-bold text-[#141522]'>
                                        18694 6789
                                    </div>
                                </div>
                                <div className='flex flex-col'>
                                    <div className='text-base text-[#667085]'>
                                        Ngân hàng:
                                    </div>
                                    <div className='text-base capitalize font-bold text-[#141522]'>
                                        Á Châu (ACB) - Chi Nhánh TP HCM
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='text-base text-[#667085] max-w-full font-medium'>
                    Sau khi nhận được thông báo từ ngân hàng và gói cước được xác thực, hệ thống sẽ kích hoạt gói cước sau 5-15 phút
                    <br />
                    Trong trường hợp bạn điền sai thông tin hoặc có bất cứ sự cố nào khiến hệ thống không thể tự kích hoạt, vui lòng liên hệ BQT để được hỗ trợ sớm nhất.
                </div>
            </div>
        </Popup >
    )
}

export default PopupAppRenewal