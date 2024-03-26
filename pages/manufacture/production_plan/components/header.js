import Image from "next/image";
import dynamic from "next/dynamic";
import useToast from "@/hooks/useToast";
import { useRouter } from "next/router";
import { routerPproductionPlan } from "@/routers/manufacture";
import { useSelector } from "react-redux";
import useActionRole from "@/hooks/useRole";
import { WARNING_STATUS_ROLE } from "@/constants/warningStatus/warningStatus";

const Zoom = dynamic(() => import("@/components/UI/zoomElement/zoomElement"), { ssr: false });

const Header = (props) => {
    const router = useRouter();

    const showToat = useToast();

    const isCheck = props.data?.some((order) => order.listProducts.some((product) => product.checked));


    const { is_admin: role, permissions_current: auth } = useSelector((state) => state.auth);

    const { checkAdd, checkEdit, checkExport } = useActionRole(auth, 'production_plans_fmrp');

    return (
        <>
            <div className="flex space-x-1 mt-4 3xl:text-sm 2xl:text-[11px] xl:text-[10px] lg:text-[10px]">
                <h6 className="text-[#141522]/40">{"Sản xuất"}</h6>
                <span className="text-[#141522]/40">/</span>
                <h6>{"Kế hoạch sản xuất"}</h6>
            </div>
            <div className="flex justify-between items-center">
                <h2 className="3xl:text-2xl 2xl:text-xl xl:text-lg text-base text-[#52575E] capitalize">
                    Kế hoạch sản xuất
                </h2>
                <div className="flex items-center gap-4">
                    <div>
                        <Zoom>
                            <button
                                type="button"
                                onClick={() => {
                                    if (role || checkAdd) {
                                        if (isCheck) {
                                            router.push(routerPproductionPlan.form);
                                        } else {
                                            showToat(
                                                "error",
                                                router.query?.tab == "plan"
                                                    ? "Vui lòng chọn ít nhất một KHNB"
                                                    : "Vui lòng chọn ít nhất một đơn hàng"
                                            );
                                        }
                                    } else {
                                        showToat('warning', WARNING_STATUS_ROLE);
                                    }
                                }}
                                className="bg-[#0F4F9E] rounded-md hover:scale-105 transition-all duration-200 ease-linear 3xl:py-2.5 xxl:py-2 2xl:py-2 xl:py-1 lg:py-1 py-3  px-4 flex items-center gap-2"
                            >
                                <Image
                                    src={"/productionPlan/Icon.png"}
                                    width={16}
                                    height={16}
                                    className="object-cover"
                                />
                                <h3 className="text-white font-medium transition-all duration-200 ease-linear text-sm">
                                    Lập kế hoạch NVL
                                </h3>
                            </button>
                        </Zoom>
                    </div>
                    <div>
                        <Zoom>
                            <button
                                type="button"
                                className="bg-white border-[#D0D5DD] border rounded-md hover:scale-105 transition-all duration-200 ease-linear 3xl:py-2.5 xxl:py-2 2xl:py-2 xl:py-1 lg:py-1 py-3  px-4 flex items-center gap-2"
                            >
                                <Image
                                    src={"/productionPlan/Icondow.png"}
                                    width={16}
                                    height={16}
                                    className="object-cover"
                                />
                                <h3 className="text-[#141522] font-medium transition-all duration-200 ease-linear text-sm">
                                    Xuất báo cáo
                                </h3>
                            </button>
                        </Zoom>
                    </div>
                </div>
            </div>
        </>
    );
};
export default Header;
