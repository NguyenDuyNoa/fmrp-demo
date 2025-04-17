import React from "react";
import Popup from "reactjs-popup";

import { Inter, Lexend_Deca } from "@next/font/google";
import Image from "next/image";
import Zoom from "../zoomElement/zoomElement";
import { useSelector } from "react-redux";
import useToast from "@/hooks/useToast";
import useActionRole from "@/hooks/useRole";
const deca = Lexend_Deca({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
});
const inter = Inter({ subsets: ["latin"] });

const PopupConfim = (props) => {

    const { is_admin: role, permissions_current: auth } = useSelector((state) => state.auth);

    const { checkBrowser: checkAuth, checkDelete } = useActionRole(auth, props?.nameModel)

    const showToat = useToast()
    const handleConfimDelete = () => {
        switch (props?.nameModel) {
            case "client_contact":
            //Xóa biến liên hệ KH
            // if (!props?.isIdChild && !checkDelete) {
            //     props.save();
            // } else {
            //     showToat('warning', 'Bạn không có quyền truy cập');
            // }
            case "contacts_suppliers":
            //Xóa biến liên hệ ncc
            // if (!props?.isIdChild && !checkDelete) {
            //     props.save();
            // } else {
            //     showToat('warning', 'Bạn không có quyền truy cập');
            // }
            case "change_item":
            //Xóa các item ở form change_item
            case "material_variation":
            //Xóa biến thể nvl
            case 'product_variant':
            //Xóa biến thể thành phẩm
            case 'personnel_staff_status':
                // Đổi trạng thái hoạt động của người dùng
                props.save();
                break;
            case "personnel_staff":
                ///Xóa người dùng
                if (role) {
                    props.save();
                } else {
                    showToat('error', 'Bạn không phải admin không thể xóa người dùng')
                }
                break
            default:
                if (role || checkDelete) {
                    props.save();
                } else {
                    showToat('error', 'Bạn không có quyền truy cập');
                }
                break;
        }
    }

    return (
        <Popup
            open={props.isOpen}
            closeOnDocumentClick={false}
            onClose={props.onClose}
            className={`${props.className} popup-edit`}
        >
            <div
                className={`min-w-[400px] ${props.nameModel == "price_quote_status" && "min-w-[500px]"
                    // className={`3xl:mt-48 2xl:mt-32 xl:mt-32 mt-36 min-w-[400px] ${props.nameModel == "price_quote_status" && "min-w-[500px]"
                    }`}
            >
                <div className={`${inter.className} bg-[#ffffff] p-4 shadow-xl rounded-xl flex flex-col gap-3`}>
                    <div className="relative inline-block">
                        {props.type == "warning" ? (
                            <Image
                                src="/popup/alert-triangle.png"
                                alt="tedd"
                                width={24}
                                height={24}
                                className="object-cover"
                            />
                        ) : (
                            <Image
                                alt="teddd"
                                src="/popup/check-circle.png"
                                width={24}
                                height={24}
                                className="object-cover"
                            />
                        )}
                    </div>
                    <h1 className="text-[#101828] font-medium 3xl:text-[22px] 2xl:text-[18px] text-lg">
                        {props.title}
                    </h1>
                    <h1 className="text-[#667085] font-medium text-sm tracking-widest-[0.14px]	">
                        {props.subtitle}
                    </h1>
                    <div className="flex items-center justify-between gap-4">
                        {props.nameModel == "price_quote_status" && (
                            <>
                                <Zoom className="w-1/2">
                                    <button
                                        onClick={props.cancel}
                                        className="text-base text-white bg-red-600 transition-all duration-150 ease-linear tran font-normal rounded-lg w-full  border-red-600 border px-[18px] py-[10px] shadow-[0px 1px 2px 0px rgba(16, 24, 40, 0.05)]"
                                    >
                                        Hủy
                                    </button>
                                </Zoom>
                                <Zoom className="w-1/2">
                                    <button
                                        onClick={() => {
                                            if (role) {
                                                return props.save()
                                            }
                                            else if (auth?.quotes?.is_agree == 1) {
                                                return props.save()
                                            } else {
                                                showToat('error', 'Bạn không có quyền thay đổi trạng thái')
                                            }
                                        }}
                                        className="text-base hover:text-white hover:bg-[#003DA0] transition-all duration-150 ease-linear tran font-normal rounded-lg w-full  text-[#344054] border-[#D0D5DD] border px-[18px] py-[10px] shadow-[0px 1px 2px 0px rgba(16, 24, 40, 0.05)]"
                                    >
                                        {props.status === "confirmed" ? props.dataLang?.aler_not_yet_approved : props.dataLang?.aler_approved}
                                    </button>
                                </Zoom>
                                <Zoom className="w-1/2">
                                    <button
                                        onClick={() => {
                                            if (role) {
                                                return props.handleNoconfim()
                                            }
                                            else if (auth?.quotes?.is_agree == 1) {
                                                return props.handleNoconfim()
                                            } else {
                                                showToat('error', 'Bạn không có quyền thay đổi trạng thái')
                                            }
                                        }}
                                        className="text-base hover:text-white hover:bg-[#003DA0] transition-all duration-150 ease-linear tran font-normal rounded-lg w-full text-[#344054] border-[#D0D5DD] border px-[18px] py-[10px] shadow-[0px 1px 2px 0px rgba(16, 24, 40, 0.05)]"
                                    >
                                        {props.status === "no_confirmed" ? props.dataLang?.aler_not_yet_approved : props.dataLang?.aler_no_approved}
                                    </button>
                                </Zoom>
                            </>
                        )}
                        {props.nameModel == "sales_product_status" && (
                            <>
                                <Zoom className="w-1/2">
                                    <button
                                        onClick={props.cancel}
                                        className="text-base text-white bg-red-600 transition-all duration-150 ease-linear tran font-normal rounded-lg w-full  border-red-600 border px-[18px] py-[10px] shadow-[0px 1px 2px 0px rgba(16, 24, 40, 0.05)]"
                                    >
                                        Hủy
                                    </button>
                                </Zoom>
                                <Zoom className="w-1/2">
                                    <button
                                        onClick={() => {
                                            if (role) {
                                                return props.save()
                                            } else if (auth?.orders?.is_agree == 1) {
                                                return props.save()
                                            }
                                            else {
                                                showToat('error', 'Bạn không có quyền thay đổi trạng thái')
                                            }
                                        }}
                                        className="text-base hover:text-white hover:bg-[#003DA0] transition-all duration-150 ease-linear tran font-normal rounded-lg w-full  text-[#344054] border-[#D0D5DD] border px-[18px] py-[10px] shadow-[0px 1px 2px 0px rgba(16, 24, 40, 0.05)]"
                                    >
                                        {props.status === "approved" ? props.dataLang?.aler_not_yet_approved : props.dataLang?.aler_approved}
                                    </button>
                                </Zoom>
                            </>
                        )}
                        {/* // nút xóa model không phải poup và xóa biến thể, chuyển đổi trạng thái status */}
                        {
                            ['client_customers',
                                'client_contact',
                                'client_status',
                                'client_group',
                                'suppliers',
                                'contacts_suppliers',
                                'suppliers_groups',
                                'material_category',
                                'material_variation',
                                'materials',
                                'category_products',
                                'price_quote',
                                'sales_product',
                                'product_variant',
                                'personnel_staff',
                                'personnel_staff_status',
                                'department',
                                'personnel_roles',
                                'warehouse',
                                'warehouse_location',
                                'inventory',
                                'change_item'
                            ].includes(props.nameModel) && (
                                <>
                                    <Zoom className="w-1/2">
                                        <button
                                            onClick={props.cancel}
                                            className="text-base text-white bg-red-600 transition-all duration-150 ease-linear tran font-normal rounded-lg w-full  border-red-600 border px-[18px] py-[10px] shadow-[0px 1px 2px 0px rgba(16, 24, 40, 0.05)]"
                                        >
                                            Hủy
                                        </button>
                                    </Zoom>
                                    <Zoom className="w-1/2">
                                        <button
                                            onClick={() => handleConfimDelete()}
                                            className="text-base hover:text-white hover:bg-[#003DA0] transition-all duration-150 ease-linear tran font-normal rounded-lg w-full  text-[#344054] border-[#D0D5DD] border px-[18px] py-[10px] shadow-[0px 1px 2px 0px rgba(16, 24, 40, 0.05)]"
                                        >
                                            Xác nhận
                                        </button>
                                    </Zoom>
                                </>
                            )}
                        {/* // nút xóa các model có nút popup tác vụ */}
                        {![
                            "price_quote",
                            "sales_product",
                            'client_customers',
                            'client_contact',
                            'client_status',
                            'client_group',
                            'suppliers',
                            'contacts_suppliers',
                            'suppliers_groups',
                            'material_category',
                            'material_variation',
                            'materials',
                            'category_products',
                            'price_quote_status',
                            'sales_product_status',
                            'product_variant',
                            'personnel_staff',
                            'personnel_staff_status',
                            'department',
                            'personnel_roles',
                            'warehouse',
                            'warehouse_location',
                            'inventory',
                            'change_item'
                        ].includes(props.nameModel) && (
                                <>
                                    <Zoom className="w-1/2">
                                        <button
                                            onClick={props.cancel}
                                            className="text-base text-white bg-red-600 transition-all duration-150 ease-linear tran font-normal rounded-lg w-full  border-red-600 border px-[18px] py-[10px] shadow-[0px 1px 2px 0px rgba(16, 24, 40, 0.05)]"
                                        >
                                            Hủy
                                        </button>
                                    </Zoom>
                                    <Zoom className="w-1/2">
                                        <button
                                            onClick={() => {
                                                if (role) {
                                                    props.save()
                                                } else if (checkAuth) {
                                                    props.save()
                                                }
                                                else {
                                                    showToat('error', 'Bạn không có quyền thay đổi trạng thái')
                                                }
                                            }}
                                            className="text-base hover:text-white hover:bg-[#003DA0] transition-all duration-150 ease-linear tran font-normal rounded-lg w-full  text-[#344054] border-[#D0D5DD] border px-[18px] py-[10px] shadow-[0px 1px 2px 0px rgba(16, 24, 40, 0.05)]"
                                        >
                                            Xác nhận
                                        </button>
                                    </Zoom>
                                </>
                            )}
                    </div>
                    {/* {props.children} */}
                </div>
            </div>
        </Popup>
    );
};
export default PopupConfim;
