import { Lexend_Deca } from "@next/font/google";
import React from "react";
import { useDispatch } from "react-redux";
import { Add as IconClose } from "iconsax-react";
import Image from "next/image";
const deca = Lexend_Deca({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const PopupQRCode = ({ urlQR }) => {
  const dispatch = useDispatch();
  return (
    <div
      style={{
        boxShadow: `0px 20px 40px -8px rgba(16, 24, 40, 0.1)`,
      }}
      className={`bg-[#ffffff] xlg:p-9 p-8 rounded-[24px] min-w-[478] h-fit relative flex flex-col gap-y-8 justify-center items-center ${deca.className}`}
    >
      <div className="flex items-start justify-between relative w-full">
        <div className="flex items-center justify-center flex-1 px-5">
          <p className=" lgd:text-xl lg:text-2xl font-semibold leading-8 text-[#0375F3] text-center capitalize">
            Sử dụng app FMRP để <br /> hoàn thành công đoạn ngay
          </p>
        </div>
        <div className="absolute top-[-5px] right-[-10px]">
          <button
            onClick={() => {
              dispatch({
                type: "statePopupGlobal",
                payload: {
                  open: false,
                },
              });
            }}
            className="flex flex-col items-center justify-center transition rounded-full outline-none hover:opacity-80 hover:scale-105 mb-2"
          >
            <IconClose className="rotate-45" color="#9295A4" size={34} />
          </button>
        </div>
      </div>
      <div className="w-[285px] h-auto aspect-1 relative overflow-hidden">
        <Image
          src={urlQR ? urlQR : "/qrCode/QR.png"}
          fill
          alt="QR"
          //   quality={100}
          className="object-contain"
          loading="eager"
        />
      </div>

      <div className="flex flex-row justify-center items-center gap-x-[18px]">
        <div className="w-[197px] h-[57px] relative">
          <Image
            src="/popup/appstore.png"
            fill
            className="object-contain"
            alt="appstore"
            quality={100}
            loading="eager"
          />
        </div>
        <div className="w-[197px] h-[57px] relative">
          <Image
            src="/popup/googleplay.png"
            fill
            className="object-contain"
            alt="google"
            quality={100}
            loading="eager"
          />
        </div>
      </div>
    </div>
  );
};

export default PopupQRCode;
