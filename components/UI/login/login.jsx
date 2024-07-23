import Head from "next/head";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import "react-datepicker/dist/react-datepicker.css";
import "sweetalert2/src/sweetalert2.scss";

import { CookieCore } from "@/utils/lib/cookie";
import { Eye as IconEye, EyeSlash as IconEyeSlash, More as IconMore } from "iconsax-react";
import { useRouter } from "next/router";
import Popup from "reactjs-popup";
import Swal from "sweetalert2";
import firebase from "@/utils/lib/Firebase";
import apiDashboard from "@/Api/apiDashboard/apiDashboard";
import apiLogin from "@/Api/apiLogin/apiLogin";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { reTryQuery } from "@/configs/configRetryQuery";

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
});
const LoginPage = React.memo((props) => {
    const dispatch = useDispatch();

    const router = useRouter();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm();

    const dataLang = props.dataLang;

    const data = useSelector((state) => state.availableLang);

    const initialState = {
        rememberMe: localStorage?.getItem("remembermeFMRP") ? localStorage?.getItem("remembermeFMRP") : false,
        onSending: false,
        listMajor: [],
        listPosition: [],
        checkMajior: null,
        loadingRegester: false,
        typePassword: false,
        stepRegister: 0,
        isLogin: true,
        sendOtp: true,
        checkOtp: false,
        countOtp: 0,
        name: "",
        code: "",
        checkValidateOtp: false,
    };

    const valueForm = watch();

    const [isState, sIsState] = useState(initialState);

    const queryState = (key) => sIsState((pver) => ({ ...pver, ...key }));

    const showToat = (type, mssg) => {
        return Toast.fire({ icon: `${type}`, title: `${mssg}` });
    };

    useEffect(() => {
        queryState({ sendOtp: true });
    }, [valueForm.phone]);

    const setupRecapcha = () => {
        try {
            window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier("sign-in-button", {
                size: "invisible",
                callback: (response) => {
                    console.log("reCAPTCHA solved, allow signInWithPhoneNumber", response);
                },
                defaultCountry: "VN",
            });
            console.log("reCAPTCHA verifier initialized");
        } catch (error) {
            console.error("Error initializing reCAPTCHA verifier:", error);
        }
    };

    useEffect(() => {
        setValue("code", localStorage?.getItem("usercodeFMRP") ? localStorage?.getItem("usercodeFMRP") : "");
        setValue("name", localStorage?.getItem("usernameFMRP") ? localStorage?.getItem("usernameFMRP") : "");
    }, []);

    const handleSendOtp = async (phone) => {
        queryState({ countOtp: 30, checkOtp: true, sendOtp: false, checkValidateOtp: true });
        const appVerifier = window.recaptchaVerifier;
        // const formattedPhoneNumber = `+${phone.replace(/\D/g, "")}`;
        const formatPhoneNumber = (phoneNumber) => {
            // Loại bỏ tất cả các ký tự không phải số
            const cleaned = phoneNumber.replace(/\D/g, "");
            // Nếu đầu số điện thoại không chứa mã quốc gia, thêm mã quốc gia của Việt Nam (+84)
            const formattedPhoneNumber = cleaned.startsWith("0") ? `+84${cleaned.slice(1)}` : `+${cleaned}`;
            return formattedPhoneNumber;
        };
        const formattedPhone = formatPhoneNumber(phone);

        await firebase
            .auth()
            .signInWithPhoneNumber(formattedPhone, appVerifier)
            .then((res) => {
                window.confirmationResult = res;
                queryState({ checkOtp: true, sendOtp: false });
                showToat("success", "Đã gửi OTP thành công");
            })
            .catch((error) => {
                queryState({ checkOtp: false, sendOtp: true, countOtp: 30 });
                showToat("error", "Gửi OTP thất bại");
            });
    };

    useEffect(() => {
        if (isState.checkOtp && isState.countOtp > 0) {
            const timer = setTimeout(() => {
                queryState({ countOtp: isState.countOtp - 1 });
            }, 1000);

            // Clean up the timer when the component is unmounted or count changes
            return () => clearTimeout(timer);
        }
    }, [isState.countOtp, isState.checkOtp]);

    const handleVeryfyOtp = (otp) => {
        window.confirmationResult
            .confirm(otp)
            .then(() => {
                showToat("success", "Xác thực thành công");
                queryState({ checkOtp: false, countOtp: 0 });
            })
            .catch((error) => {
                queryState({ checkOtp: true, countOtp: 30 });
                showToat("error", "Xác thực thất bại");
            });
    };

    useEffect(() => {
        setupRecapcha();
    }, []);

    const FetchSetingServer = async () => {
        try {
            const res = await apiDashboard.apiSettings();

            dispatch({ type: "setings/server", payload: res?.settings });

            const fature = await apiDashboard.apiFeature();

            const newData = {
                dataMaterialExpiry: fature.find((x) => x.code == "material_expiry"),
                dataProductExpiry: fature.find((x) => x.code == "product_expiry"),
                dataProductSerial: fature.find((x) => x.code == "product_serial"),
            };

            dispatch({ type: "setings/feature", payload: newData });
        } catch (error) { }
    };

    ///Đăng ký

    const _HandleIsLogin = (e) => {
        queryState({ isLogin: e });
        // !e && queryState({ onFechingRegister: true });
    };

    useQuery({
        queryKey: ["api_majior"],
        queryFn: async () => {
            const res = await apiLogin.apiMajior();
            queryState({ listMajor: res?.career, listPosition: res?.role_user });
            return res;
        },

        initialData: keepPreviousData,

        staleTime: 1000 * 60 * 5,

        enabled: !isState.isLogin,
        ...reTryQuery
    })

    const _HandleSelectStep = (e) => {
        if (isState.checkMajior) {
            queryState({ stepRegister: e });
        } else {
            showToat("error", "Vui lòng chọn ngành hàng của bạn");
        }
    };
    const onSubmit = async (data, type) => {
        if (type == "login") {
            try {
                const res = await apiLogin.apiLoginMain({
                    data: {
                        company_code: data.code,
                        user_name: data.name,
                        password: data.password,
                    },
                });
                const { isSuccess, message, token, database_app } = res;
                if (isSuccess) {
                    FetchSetingServer();
                    dispatch({ type: "auth/update", payload: res.data?.data });
                    CookieCore.set("tokenFMRP", token, {
                        path: "/",
                        expires: new Date(Date.now() + 86400 * 1000),
                        sameSite: true,
                    });
                    CookieCore.set("databaseappFMRP", database_app, {
                        path: "/",
                        expires: new Date(Date.now() + 86400 * 1000),
                        sameSite: true,
                    });
                    showToat("success", message);
                    if (isState.rememberMe) {
                        localStorage.setItem("usernameFMRP", data.name);
                        localStorage.setItem("usercodeFMRP", data.code);
                        localStorage.setItem("remembermeFMRP", isState.rememberMe);
                    } else {
                        ["usernameFMRP", "usercodeFMRP", "remembermeFMRP"].forEach((key) =>
                            localStorage.removeItem(key)
                        );
                    }
                } else {
                    showToat("error", `${message || "Đăng nhập thất bại"}`);
                }
            } catch (error) { }
        }
        if (type == "sendOtp") {
            await handleSendOtp(data?.phone);
        }
        if (type == "checkOtp") {
            await handleVeryfyOtp(data?.otp);
        }
        if (type == "register") {
            queryState({ password: data?.password, loadingRegester: true });
            const dataSubmit = new FormData();
            dataSubmit.append("career", data?.major);
            dataSubmit.append("company_name", data?.companyName);
            dataSubmit.append("fullname", data?.fullName);
            dataSubmit.append("email", data?.email);
            dataSubmit.append("phone_number", data?.phone);
            dataSubmit.append("address", data?.city);
            dataSubmit.append("password", data?.password);
            dataSubmit.append("role_user", data?.location);
            dataSubmit.append("otp", 111111);
            try {
                const { isSuccess, message, code, email } = await apiLogin.apiRegister(dataSubmit);
                if (isSuccess) {
                    showToat("success", message);
                    queryState({ name: email, code: code });
                    router.push("/");
                } else {
                    showToat("error", message);
                    queryState({ loadingRegester: false });
                }
            } catch (error) { }
        }
    };

    return (
        <>
            {isState.isLogin ? (
                <>
                    <Head>
                        <title>{dataLang?.auth_login || "auth_login"}</title>
                    </Head>
                    <div className="bg-[#EEF1F8]">
                        <div className="bg-[url('/Logo-BG.png')] relative bg-repeat-round h-screen w-screen flex flex-col justify-center items-center overflow-hidden">
                            <div className="flex justify-center space-x-20 w-full z-10">
                                <div className="3xl:space-y-8 xxl:space-y-2 2xl:space-y-3 xl:space-y-2 lg:space-y-1 space-y-1">
                                    <div className="bg-white px-16 pt-20 pb-12 xxl:pb-10 xxl:pt-4 2xl:pb-15 2xl:pt-10 xl:pb-8 lg:pt-2 xl:pt-4 rounded-lg space-y-10 w-[600px]">
                                        <div className="space-y-3">
                                            <h1 className="text-[#11315B] font-medium text-3xl text-center">
                                                {dataLang?.auth_login || "auth_login"}
                                            </h1>
                                        </div>
                                        <div className="space-y-2">
                                            <input
                                                type="text"
                                                name="code"
                                                {...register("code", { required: true })}
                                                placeholder="Mã công ty"
                                                className={`${errors.code ? "border-red-500 border" : "border-[#cccccc]"
                                                    } border outline-none  focus:border-[#0F4F9E] hover:border-[#0F4F9E]/60 px-5 py-3 rounded-md w-full`}
                                            />
                                            {errors.code && (
                                                <span className="text-red-500 text-[13px]">
                                                    Vui lòng nhập mã công ty
                                                </span>
                                            )}
                                            <input
                                                type="text"
                                                name="name"
                                                {...register("name", { required: true })}
                                                placeholder={dataLang?.auth_user_name || "auth_user_name"}
                                                className={`${errors.name ? "border-red-500 border" : "border-[#cccccc]"
                                                    } border outline-none  focus:border-[#0F4F9E] hover:border-[#0F4F9E]/60 px-5 py-3 rounded-md w-full`}
                                            />
                                            {errors.name && (
                                                <span className="text-red-500 text-[13px]">
                                                    Vui lòng nhập email hoặc số điện thoại
                                                </span>
                                            )}
                                            <div className="relative flex flex-col justify-center">
                                                <input
                                                    type={isState.typePassword ? "text" : "password"}
                                                    name="password"
                                                    {...register("password", { required: true })}
                                                    placeholder={dataLang?.auth_password || "auth_password"}
                                                    className={`${errors.password ? "border-red-500 border" : "border-[#cccccc]"
                                                        } border outline-none focus:border-[#0F4F9E] hover:border-[#0F4F9E]/60 py-3 pl-5 pr-12 rounded-md w-full`}
                                                />
                                                {errors.password && (
                                                    <span className="text-red-500 text-[13px]">
                                                        Vui lòng nhập mật khẩu
                                                    </span>
                                                )}
                                                <button
                                                    onClick={() => queryState({ typePassword: !isState.typePassword })}
                                                    className="absolute right-3 top-0 translate-y-1/2"
                                                >
                                                    {isState.typePassword ? <IconEyeSlash /> : <IconEye />}
                                                </button>
                                            </div>
                                            <div className="flex w-full justify-between">
                                                <div className="flex items-center space-x-1.5">
                                                    <input
                                                        type="checkbox"
                                                        id="rememberMe"
                                                        {...register("rememberMe", { required: false })}
                                                        checked={isState.rememberMe ? true : false}
                                                        onChange={() => queryState({ rememberMe: !isState.rememberMe })}
                                                    />
                                                    <label htmlFor="rememberMe">
                                                        {dataLang?.auth_remember_login || "auth_remember_login"}
                                                    </label>
                                                </div>
                                                <button className="text-[#3276FA] text-sm">
                                                    {dataLang?.auth_forgot_password || "auth_forgot_password"}
                                                </button>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleSubmit((data) => onSubmit(data, "login"))}
                                            className="text-[#FFFFFF] font-normal text-lg py-3 w-full rounded-md bg-gradient-to-l from-[#0375f3] via-[#0375f3] via-[#296dc1] to-[#0375f3] btn-animation hover:scale-105"
                                        >
                                            {dataLang?.auth_login || "auth_login"}
                                        </button>
                                        <div className="flex justify-center space-x-2">
                                            <span className="font-[300] ">Bạn chưa có tài khoản?</span>
                                            <button
                                                onClick={_HandleIsLogin.bind(this, false)}
                                                className="text-[#5599EC]"
                                            >
                                                Đăng ký ngay
                                            </button>
                                        </div>
                                        <h4 className="text-center text-[#667085] text-sm font-light">
                                            FOSOSOFT © 2021
                                        </h4>
                                    </div>
                                    <div className="flex items-center space-x-6 justify-center">
                                        <a href="#" className="text-[#344054] hover:text-[#0F4F9E] font-light text-sm">
                                            Cổng dịch vụ khách hàng
                                        </a>
                                        <a href="#" className="text-[#344054] hover:text-[#0F4F9E] font-light text-sm">
                                            User Pay
                                        </a>
                                        <a href="#" className="text-[#344054] hover:text-[#0F4F9E] font-light text-sm">
                                            FMRP Website
                                        </a>
                                        <Popup
                                            trigger={
                                                <button className="text-[#344054] hover:text-[#0F4F9E]">
                                                    <IconMore />
                                                </button>
                                            }
                                            closeOnDocumentClick
                                            arrow={false}
                                            position="right bottom"
                                            on={["hover"]}
                                            className={`dropdown-edit `}
                                        >
                                            <div className="w-auto">
                                                <div className="bg-white p-0.5 rounded-t w-60">
                                                    <button className="text-sm text-[#667085] hover:text-black font-semibold hover:bg-slate-100 text-left w-full px-5 rounded py-2.5">
                                                        Tạo phím tắt trên màn hình
                                                    </button>
                                                    <button className="text-sm text-[#667085] hover:text-black font-semibold hover:bg-slate-100 text-left w-full px-5 rounded py-2.5">
                                                        Yêu cầu Tư vấn qua điện thoại
                                                    </button>
                                                    <button className="text-sm text-[#667085] hover:text-black font-semibold hover:bg-slate-100 text-left w-full px-5 rounded py-2.5">
                                                        Tối ưu hóa trình duyệt
                                                    </button>
                                                    <button className="text-sm text-[#667085] hover:text-black font-semibold hover:bg-slate-100 text-left w-full px-5 rounded py-2.5">
                                                        Báo cáo lỗi
                                                    </button>
                                                    <button className="text-sm text-[#667085] hover:text-black font-semibold hover:bg-slate-100 text-left w-full px-5 rounded py-2.5">
                                                        Điều khiển
                                                    </button>
                                                    <button className="text-sm text-[#667085] hover:text-black font-semibold hover:bg-slate-100 text-left w-full px-5 rounded py-2.5">
                                                        Liên hệ
                                                    </button>
                                                </div>
                                            </div>
                                        </Popup>
                                        {data.map((e) => (
                                            <BtnLang key={e.label} {...e} />
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-9">
                                    <div className="pointer-events-none select-none">
                                        <Image
                                            alt=""
                                            width={200}
                                            // src="/FMRP_Logo.png"
                                            src="/LOGO_LOGIN.png"
                                            height={70}
                                            quality={100}
                                            className="object-contain"
                                            loading="lazy"
                                            crossOrigin="anonymous"
                                            placeholder="blur"
                                            blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                                        />
                                    </div>
                                    <div className="space-y-6">
                                        <h1 className="text-[#344054] font-medium text-xl">Trợ lý sản xuất</h1>
                                        <div className="3xl:space-y-1 xxl:space-y-1 2xl:space-y-0 space-y-1">
                                            <p className="text-[#667085] font-light text-[16px]">
                                                Giải pháp phần mềm cho doanh nghiệp
                                            </p>
                                            <p className="text-[#667085] font-light text-[16px]">
                                                Hotline:
                                                <span className="text-[#0F4F9E] font-normal ml-1">0901.13.6968</span>
                                            </p>
                                            <p className="text-[#667085] font-light text-[16px]">
                                                Tổng đài:
                                                <span className="text-[#0F4F9E] font-normal mx-1">028.7776.8880</span>
                                                (Phím 1 - BP. Tư Vấn - Phím 2 - BP. Kỹ Thuật)
                                            </p>
                                        </div>
                                    </div>
                                    <div className="pointer-events-none select-none">
                                        <Image
                                            alt=""
                                            src="/qr.png"
                                            width={120}
                                            height={120}
                                            quality={100}
                                            className="object-contain w-auto h-auto "
                                            loading="lazy"
                                            crossOrigin="anonymous"
                                            placeholder="blur"
                                            blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="absolute bottom-0 right-0 pointer-events-none select-none">
                                <Image
                                    src="/Illust.png"
                                    alt=""
                                    width={500}
                                    height={500}
                                    quality={100}
                                    className="object-contain w-[500px] h-auto"
                                    loading="lazy"
                                    crossOrigin="anonymous"
                                    placeholder="blur"
                                    blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                                />
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <Head>
                        <title>Đăng ký</title>
                    </Head>
                    <div className="grid grid-cols-5 h-screen w-screen overflow-hidden">
                        <div className="col-span-2 bg-[#11315B] h-screen relative">
                            <Image
                                src="/register/img.png"
                                alt="background"
                                width={828}
                                height={1261}
                                quality={100}
                                className="object-contain w-full h-auto select-none pointer-events-none"
                                loading="lazy"
                                crossOrigin="anonymous"
                                placeholder="blur"
                                blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                            />
                            <div className="absolute bottom-[10%] left-[15%] z-[1]">
                                <Image
                                    alt="logo"
                                    src="/logo.png"
                                    width={200}
                                    height={70}
                                    quality={100}
                                    className="object-contain w-auto h-[60px] select-none pointer-events-none"
                                    loading="lazy"
                                    crossOrigin="anonymous"
                                    placeholder="blur"
                                    blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                                />
                                <h2 className="text-white text-2xl font-[600] mt-8">Đăng ký tài khoản FMRP</h2>
                                <h6 className="text-white mt-3">Hỗ trợ đăng ký: 01821 92 2312</h6>
                            </div>
                        </div>
                        <div className="col-span-3 bg-white h-full flex flex-col items-center xxl:mt-0 2xl:mt-1 mt-1 3xl:p-0 2xl:p-0 p-0">
                            <h1 className="text-[#11315B] 3xl:text-4xl xxl:text-3xl 2xl:text-3xl text-2xl font-[500]">
                                Đăng ký
                            </h1>
                            <h3 className="3xl:mt-8 xxl:mt-0 2xl:mt-0 mt-1 text-[#667085] 2xl:text-lg">
                                {isState.stepRegister == 0
                                    ? "Bước 1/2: Lựa chọn ngành hàng của bạn"
                                    : "Bước 2/2: Nhập thông tin của bạn để đăng ký"}
                            </h3>
                            <div className="3xl:w-[50%] 2xl:w-[50%] [@media(min-width:1440px)]:w-[50%] xl:w-[55%] lg:w-[70%] 3xl:mt-5 xxl:mt-1 mt-1">
                                <div className="grid grid-cols-2 gap-1">
                                    <div className="w-full h-1.5 rounded-full bg-[#3276FA]" />
                                    <div className="w-full h-1.5 rounded-full bg-[#F3F4F6] relative overflow-hidden">
                                        <div
                                            className={`${isState.stepRegister == 0 ? "w-0" : "w-full"
                                                } duration-300 bg-[#3276FA] transition-[width] h-full absolute`}
                                        />
                                    </div>
                                </div>
                                {isState.stepRegister == 0 ? (
                                    <div className="grid grid-cols-3  2xl:gap-5 gap-3 3xl:mt-5 xxl:mt-1 mt-2">
                                        {isState.listMajor.map((e, index) => (
                                            <label
                                                key={e?.id?.toString()}
                                                htmlFor={`major ${e?.id}`}
                                                className="w-full h-full cursor-pointer xl:aspect-w-1 lg:aspect-w-3 lg:aspect-h-4 aspect-w-[5] xl:aspect-h-1 aspect-h-[4] rounded-md border border-[#DDDDE2] relative"
                                            >
                                                <div className="w-full h-full flex flex-col items-center justify-between 2xl:p-5 p-3 select-none">
                                                    <input
                                                        type="radio"
                                                        id={`major ${e?.id}`}
                                                        // {...register("major", {
                                                        //     onChange: (e) => {
                                                        //         sCheckMajior(
                                                        //             e?.target
                                                        //                 ?.checked
                                                        //         );
                                                        //     },
                                                        // })}
                                                        {...register(`major`)}
                                                        onChange={(e) => {
                                                            queryState({ checkMajior: e.target.checked });
                                                        }}
                                                        value={e?.id}
                                                        // name="major register"
                                                        className="2xl:w-5 w-3.5 2xl:h-5 h-3.5 accent-[#1847ED] peer relative z-[1]"
                                                    />
                                                    <Image
                                                        alt={e?.title}
                                                        src={e?.img}
                                                        width={44}
                                                        height={44}
                                                        quality={80}
                                                        className="w-auto 2xl:h-[44px] xl:h-[40px] h-[36px] object-contain relative z-[1]"
                                                    />
                                                    <label className="text-[#1760B9] relative z-[1] 2xl:text-base xl:text-sm [@media(min-width:1336px)]:text-[13px] text-[13px] text-center">
                                                        {e?.title}
                                                    </label>
                                                    <div className="w-full h-full peer-checked:bg-[#E2F0FE]/40 absolute top-0 left-0 transition duration-300 peer-checked:border border-[#C7DFFB] rounded-md" />
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="3xl:space-y-5 xxl:space-y-1 2xl:space-y-3 space-y-2 2xl:mt-0 xl:mt-0 lg:mt-0 mt-3">
                                        <div className="3xl:space-y-1 xxl:space-y-1 2xl:space-y-0 space-y-1">
                                            <label className="2xl:text-base text-sm">
                                                Họ và tên của bạn
                                                <span className="text-red-500 p-1">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                {...register("fullName", {
                                                    required: true,
                                                })}
                                                placeholder="Nhập họ và tên của bạn"
                                                className={`${errors.fullName
                                                    ? "border-red-500 border"
                                                    : "border-[#D0D5DD] border focus:border-[#3276FA] placeholder:text-[13px]"
                                                    } w-full   3xl:p-3 xxl:p-1.5 2xl:p-2 xl:p-2 lg:p-1 p-3 outline-none  rounded`}
                                            />
                                            {errors.fullName && (
                                                <span className="text-red-500 text-[13px]">
                                                    Vui lòng nhập họ và tên
                                                </span>
                                            )}
                                        </div>
                                        <div className="3xl:space-y-1 xxl:space-y-1 2xl:space-y-0 space-y-1">
                                            <label className="2xl:text-base text-sm">
                                                Tên công ty
                                                <span className="text-red-500 p-1">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="companyName"
                                                {...register("companyName", {
                                                    required: true,
                                                })}
                                                placeholder="Nhập tên công ty"
                                                className={`${errors.companyName
                                                    ? "border-red-500 border"
                                                    : "border-[#D0D5DD] border focus:border-[#3276FA] placeholder:text-[13px]"
                                                    } w-full   3xl:p-3 xxl:p-1.5 2xl:p-2 xl:p-2 lg:p-1 p-3 outline-none  rounded`}
                                            />
                                            {errors.fullName && (
                                                <span className="text-red-500 text-[13px]">
                                                    Vui lòng nhập tên công ty
                                                </span>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-2 gap-5">
                                            <div className="3xl:space-y-1 xxl:space-y-1 2xl:space-y-0 space-y-1">
                                                <label className="2xl:text-base text-sm">
                                                    Email của bạn
                                                    <span className="text-red-500 p-1">*</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    {...register("email", {
                                                        required: true,
                                                        pattern: {
                                                            value: /\S+@\S+\.\S+/,
                                                            message: "Nhập đúng định dạng email",
                                                        },
                                                    })}
                                                    placeholder="Nhập Email của bạn"
                                                    className={`${errors.email
                                                        ? "border-red-500 border"
                                                        : "border-[#D0D5DD] border focus:border-[#3276FA] placeholder:text-[13px]"
                                                        } w-full   3xl:p-3 xxl:p-1.5 2xl:p-2 xl:p-2 lg:p-1 p-3 outline-none  rounded`}
                                                />
                                                {errors.email && (
                                                    <span className="text-red-500 text-[13px]" role="alert">
                                                        {errors.email.message || "Vui lòng nhập email"}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="3xl:space-y-1 xxl:space-y-1 2xl:space-y-0 space-y-1">
                                                <label className="2xl:text-base text-sm">
                                                    Số điện thoại
                                                    <span className="text-red-500 p-1">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="phone"
                                                    {...register("phone", {
                                                        required: {
                                                            value: true,
                                                            message: "Vui lòng nhập số điện thoại",
                                                        },
                                                        minLength: {
                                                            value: 10,
                                                            message: "Số điện thoại tối thiểu 10 số",
                                                        },
                                                        maxLength: {
                                                            value: 11,
                                                            message: "Số điện thoại tối đa 10 số",
                                                        },
                                                        pattern: {
                                                            value: /^(0|\+84)(\d{9})$/,
                                                            message: "Số điện thoại không hợp lệ",
                                                        },
                                                    })}
                                                    placeholder="Nhập số điện thoại"
                                                    className={`${errors.phone
                                                        ? "border-red-500 border"
                                                        : "border-[#D0D5DD] border focus:border-[#3276FA] placeholder:text-[13px]"
                                                        } w-full   3xl:p-3 xxl:p-1.5 2xl:p-2 xl:p-2 lg:p-1 p-3 outline-none  rounded`}
                                                />
                                                {/* {errors.phone && errors.phone.type === "required" && (
                                                    <span className="text-red-500 text-[13px]">
                                                        Vui lòng nhập số điện thoại
                                                    </span>
                                                )}
                                                {errors.phone && errors.phone.type === "maxLength" && (
                                                    <span className="text-red-500 text-[13px]">Tối đa 16 số</span>
                                                )}
                                                {errors.phone && errors.phone.type === "minLength" && (
                                                    <span className="text-red-500 text-[13px]">Tối thiểu 10 số</span>
                                                )} */}
                                                {errors.phone && (
                                                    <span className="text-red-500 text-[13px]">
                                                        {errors.phone.message}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="3xl:space-y-1 xxl:space-y-1 2xl:space-y-0 space-y-1">
                                                <label className="2xl:text-base text-sm">Tỉnh / Thành phố</label>
                                                <input
                                                    type="text"
                                                    name="city"
                                                    {...register("city")}
                                                    placeholder="Nhập tỉnh / Thành phố"
                                                    className="w-full border placeholder:text-[13px] border-[#D0D5DD] 3xl:p-3 xxl:p-1.5 2xl:p-2 xl:p-2 lg:p-1 p-3 outline-none focus:border-[#3276FA] rounded"
                                                />
                                            </div>
                                            <div className="3xl:space-y-1 xxl:space-y-1 2xl:space-y-0 space-y-1">
                                                <label className="2xl:text-base text-sm placeholder:text-[13px]">
                                                    Mật khẩu
                                                    <span className="text-red-500 p-1">*</span>
                                                </label>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    {...register("password", {
                                                        required: true,
                                                        minLength: 10,
                                                    })}
                                                    placeholder="Nhập mật khẩu"
                                                    className={`${errors.password
                                                        ? "border-red-500 border"
                                                        : "border-[#D0D5DD] border focus:border-[#3276FA] placeholder:text-[13px]"
                                                        } w-full   3xl:p-3 xxl:p-1.5 2xl:p-2 xl:p-2 lg:p-1 p-3 outline-none  rounded`}
                                                />
                                                {errors.password && errors.password.type === "required" && (
                                                    <span className="text-red-500 text-[13px]">
                                                        Vui lòng nhập mật khẩu
                                                    </span>
                                                )}
                                                {errors.password && errors.password.type === "minLength" && (
                                                    <span className="text-red-500 text-[13px]">Tối thiểu 10 ký tự</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="2xl:text-base text-sm">
                                                Vị trí công việc
                                                <span className="text-red-500 p-1">*</span>
                                            </label>
                                            <div className="flex flex-wrap">
                                                {isState.listPosition.map((e) => (
                                                    <div
                                                        key={e?.id?.toString()}
                                                        className="flex space-x-3 items-center mr-6 mb-1"
                                                    >
                                                        <input
                                                            id={`posiiton ${e?.id}`}
                                                            type="radio"
                                                            {...register("location", {
                                                                required: true,
                                                            })}
                                                            value={e?.id}
                                                            name="location"
                                                            className="accent-[#1847ED] 2xl:scale-110"
                                                        />
                                                        <label
                                                            htmlFor={`posiiton ${e?.id}`}
                                                            className={`${errors.location ? "text-[#52575E]" : "text-[#52575E]"
                                                                }  2xl:text-base text-sm cursor-pointer`}
                                                        >
                                                            {e?.title}
                                                        </label>
                                                    </div>
                                                ))}
                                                {errors.location && (
                                                    <span className="text-red-500 text-[13px]">
                                                        Vui lòng chọn vị trí công việc
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-5">
                                            <div className="w-full flex justify-center items-center bg-[#E2F0FE] text-[#1760B9] rounded 3xl:text-base text-sm px-2">
                                                Nhập mã xác thực qua SMS
                                            </div>
                                            <input
                                                type="number"
                                                placeholder="Nhập mã xác thực"
                                                name="otp"
                                                {...register("otp", {
                                                    required: {
                                                        value: isState.checkValidateOtp,
                                                        message: "Vui lòng nhập mã xác thực",
                                                    },
                                                    minLength: {
                                                        value: isState.checkOtp ? 6 : undefined,
                                                        message: isState.checkOtp && "Mã xác thực tối thiểu 6 số",
                                                    },
                                                    maxLength: {
                                                        value: isState.checkOtp ? 6 : undefined,
                                                        message: isState.checkOtp && "Mã xác thực tối đa 6 số",
                                                    },
                                                })}
                                                className="w-full border border-[#D0D5DD] 3xl:p-3 xxl:p-1.5 2xl:p-2 xl:p-2 lg:p-1 p-3 outline-none focus:border-[#3276FA] rounded placeholder:text-[13px]"
                                            />

                                            {errors.otp && (
                                                <span className="text-red-500 text-[13px]">{errors.otp.message}</span>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {isState.stepRegister == 0 ? (
                                    <>
                                        <button
                                            onClick={_HandleSelectStep.bind(this, 1)}
                                            className="hover:bg-blue-600 transition-all duration-200 ease-linear w-full py-4 text-center rounded bg bg-[#0F4F9E] text-white 3xl:mt-5 xl:mt-2 2xl:mt-2 mt-5"
                                        >
                                            Tiếp theo
                                        </button>
                                        <div className="flex justify-center space-x-2 3xl:mt-5 xxl:mt-1 mt-1 2xl:mt-5">
                                            <span className="font-[300] ">Bạn đã có tài khoản?</span>
                                            <button
                                                onClick={_HandleIsLogin.bind(this, true)}
                                                className="text-[#5599EC]"
                                            >
                                                Đăng nhập ngay
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {isState.checkOtp && isState.countOtp > 0 && (
                                            <div className="text-gray-400  mt-2 text-sm">
                                                Gửi lại mã xác thực sau {isState.countOtp} giây
                                            </div>
                                        )}
                                        <div className="flex gap-5">
                                            {isState.checkOtp && isState.countOtp == 0 && (
                                                <button
                                                    onClick={() => {
                                                        queryState({ checkValidateOtp: false });
                                                        handleSubmit((data) => onSubmit(data, "sendOtp"))();
                                                    }}
                                                    type="button"
                                                    className={` w-full 3xl:py-4 xxl:p-2 2xl:py-2 xl:p-2 lg:p-1 py-3 text-center rounded hover:bg-blue-600 transition-all duration-200 ease-linear bg bg-[#0F4F9E] text-white 3xl:mt-5 xxl:mt-1  2xl:mt-2 mt-1`}
                                                >
                                                    Gửi lại mã xác thực
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    handleSubmit((data) =>
                                                        onSubmit(
                                                            data,
                                                            isState?.sendOtp
                                                                ? "sendOtp"
                                                                : isState.checkOtp
                                                                    ? "checkOtp"
                                                                    : "register"
                                                        )
                                                    )();
                                                }}
                                                disabled={
                                                    isState.sendOtp && isState.countOtp > 0
                                                        ? true
                                                        : isState.loadingRegester
                                                }
                                                className={`${isState.loadingRegester ? "relative" : ""
                                                    } w-full 3xl:py-4 xxl:p-2 2xl:py-2 xl:p-2 lg:p-1 py-3 text-center rounded hover:bg-blue-600 transition-all duration-200 ease-linear bg bg-[#0F4F9E] text-white 3xl:mt-5 xxl:mt-1  2xl:mt-2 mt-1`}
                                            >
                                                {isState.loadingRegester ? (
                                                    <div>
                                                        <div className="flex items-end justify-center">
                                                            <svg
                                                                aria-hidden="true"
                                                                className="w-6 h-6 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                                                viewBox="0 0 100 101"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path
                                                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                                    fill="currentColor"
                                                                />
                                                                <path
                                                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                                    fill="currentFill"
                                                                />
                                                            </svg>
                                                            <h2>Đang khởi tạo dữ liệu ...</h2>
                                                        </div>
                                                    </div>
                                                ) : isState.sendOtp ? (
                                                    "Gửi mã xác thực"
                                                ) : isState.checkOtp ? (
                                                    "Xác thực SMS"
                                                ) : (
                                                    "Đăng ký"
                                                )}
                                            </button>
                                        </div>
                                        <button
                                            onClick={_HandleSelectStep.bind(this, 0)}
                                            className="w-full 3xl:py-4 xxl:p-2 2xl:py-2 xl:p-2 lg:p-1 py-3 text-center rounded bg bg-white text-[#667085] mt-3 border border-[#D0D5DD]"
                                        >
                                            Quay lại
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
            <div id="sign-in-button"> </div>
        </>
    );
});

const BtnLang = React.memo((props) => {
    const dispatch = useDispatch();

    const _HandleShowLang = () => {
        dispatch({ type: "lang/update", payload: props.code });
        localStorage.setItem("LanguagesFMRP", props.code);
    };
    return <button onClick={_HandleShowLang.bind(this)}>{props.label}</button>;
});
export default LoginPage;
