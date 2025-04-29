import ButtonAnimationNew from "@/components/common/button/ButtonAnimationNew";
import CheckIcon from "@/components/icons/common/CheckIcon";
import DownloadIcon from "@/components/icons/common/DownloadIcon";
import UpgradeIcon from "@/components/icons/common/UpgradeIcon";
import PopupCustom from "@/components/UI/popup";
import { Lexend_Deca } from "@next/font/google";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";

const deca = Lexend_Deca({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const PopupSuccessfulPayment = (props) => {
  const { dataLang } = props;
  const dispatch = useDispatch();
  const statePopupSuccessfulPayment = useSelector(
    (state) => state.statePopupSuccessfulPayment
  );

  const handleClose = () => {
    dispatch({
      type: "statePopupSuccessfulPayment",
      payload: {
        open: false,
      },
    });
  };

  return (
    <PopupCustom
      title={
        <div className="flex items-center gap-4">
          <CheckIcon className="size-8 text-[#1FC583]" />
          <p className="text-2xl font-semibold text-[#25387A] normal-case">
            {dataLang?.successful_payment ?? "Thanh toán thành công!"}
          </p>
        </div>
      }
      classNameTittle="!justify-center"
      onClickOpen={() => {}}
      open={statePopupSuccessfulPayment.open}
      onClose={handleClose}
      lockScroll={true}
      closeOnDocumentClick={true}
      classNameBtn={props?.className + "relative"}
      classNameModeltime="p-2 lg:p-9"
    >
      <div
        className={`w-[750px] max-h-[75vh] flex flex-col items-center justify-center gap-3 2xl:gap-9 pt-4 2xl:pt-9 ${deca.className}`}
      >
        <div className="">
          <Image
            width={323}
            height={250}
            src={"/popup/commandCompleted.webp"}
            alt="commandCompleted"
            className="object-cover w-[270px] 2xl:w-[323px] 2xl:h-[250px]"
            priority
            // unoptimized
          />
        </div>
        <div className="flex gap-4 w-full">
          <div className="p-3 py-2 2xl:py-3 rounded-xl border border-[#919EAB3D] w-full">
            <h3 className="text-lg font-medium text-typo-gray-4">
              Ngày mua hàng:
            </h3>
            <p className="text-lg font-medium text-typo-black-4">
              24/04/2025 - 16:48:55
            </p>
          </div>
          <div className="p-3 py-2 2xl:py-3 rounded-xl border border-[#919EAB3D] w-full">
            <h3 className="text-lg font-medium text-typo-gray-4">
              Mã đơn hàng:
            </h3>
            <p className="text-lg font-medium text-[#003DA0]">
              01dc1370-3df6-11eb-b378
            </p>
          </div>
        </div>
        <p className="text-base 2xl:text-lg font-normal text-typo-gray-4">
          🎉 Cảm ơn bạn đã tin tưởng và nâng cấp lên gói{" "}
          <span className="text-[#003DA0]">Professional</span>.
          <br /> Gói của bạn sẽ có hiệu lực đến{" "}
          <span className="text-[#EE1E1E]">24/04/2026</span>.
          <br />
          Bạn có thể tải về hóa đơn ngay tại đây hoặc kiểm tra email đã đăng ký
          tài khoản để xem chi tiết.
          <br /> Nếu cần hỗ trợ thêm trong quá trình sử dụng, đừng ngần ngại
          liên hệ{" "}
          <span className="text-typo-blue-2 underline">bộ phận CSKH</span> của
          chúng tôi. Đội ngũ FMRP luôn sẵn sàng đồng hành cùng bạn!
        </p>
        <div className="w-full">
          <p className="text-base 2xl:text-lg font-normal text-typo-black-4">
            Trân trọng, <br />
            Đội ngũ FMRP <br /> Quản lý xưởng dễ dàng hơn bao giờ hết.
          </p>
        </div>
        <ButtonAnimationNew
          icon={<DownloadIcon className="text-white text-[15px]" size={15} />}
          classNameWithIcon="space-x-2"
          reverse={true}
          title="Tải về hoá đơn"
          className="border-gradient-button-foso w-[207px] text-white text-[20px] font-medium rounded-[8px] text-center flex items-center justify-center py-3 transition-colors duration-300 ease-in-out"
          style={{
            background: `linear-gradient(to bottom right, #1FC583 0%, #1F9285 100%)`,
          }}
          whileHover={{
            background: [
              "radial-gradient(100% 100% at 50% 0%, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 100%), linear-gradient(0deg, #1AD598, #1AD598)",
              "radial-gradient(100% 100% at 50% 0%, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.3) 100%), linear-gradient(0deg, #1AD598, #1AD598)",
              "radial-gradient(100% 100% at 50% 0%, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 100%), linear-gradient(0deg, #1AD598, #1AD598)",
              ,
            ],
            transition: {
              duration: 1.5,
              ease: [0.4, 0, 0.6, 1],
              repeat: Infinity,
            },
            boxShadow: [
              "inset -2px -2px 5px rgba(255,255,255,0.5), inset 2px 2px 4px rgba(0,0,0,0.15)",
              "inset -3px -3px 6px rgba(255,255,255,0.7), inset 3px 3px 6px rgba(0,0,0,0.35)",
              "inset -3px -3px 7px rgba(255,255,255,0.7), inset 3px 3px 7px rgba(0,0,0,0.4)",
              "inset -2px -2px 5px rgba(255,255,255,0.5), inset 2px 2px 4px rgba(0,0,0,0.3)",
            ],
          }}
        />
      </div>
    </PopupCustom>
  );
};

export default PopupSuccessfulPayment;
