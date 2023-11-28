import Image from "next/image";
import dynamic from "next/dynamic";
import useToast from "@/hooks/useToast";
import { useRouter } from "next/router";
import { routerPproductionPlan } from "@/routers/manufacture";

const Zoom = dynamic(() => import("@/components/UI/zoomElement/zoomElement"), { ssr: false });

const Header = (props) => {
    const router = useRouter();

    const showToat = useToast();

    const isCheck = props.data?.some((order) => order.listProducts.some((product) => product.checked));

    return (
        <>
            <div className="flex items-center justify-between">
                <div className={` flex space-x-3  xl:text-[14.5px] text-[12px]`}>
                    <h6 className="text-[#141522]/40">{"Sản xuất"}</h6>
                    <span className="text-[#141522]/40">/</span>
                    <h6>{"Kế hoạch sản xuất"}</h6>
                </div>
            </div>
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-medium text-[#11315B]">Kế hoạch sản xuất</h1>
                <div className="flex items-center gap-4">
                    <div>
                        <Zoom>
                            <button
                                type="button"
                                onClick={() => {
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
