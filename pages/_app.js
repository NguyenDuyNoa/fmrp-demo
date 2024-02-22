import Head from "next/head";
import Image from "next/image";
import { useForm } from "react-hook-form";
import React, { useState, useEffect } from "react";
import { useSelector, Provider, useDispatch } from "react-redux";

import store from "/services/redux";
import Layout from "@/components/layout";
import { _ServerInstance as Axios } from "/services/axios";

import "../styles/globals.scss";
import "sweetalert2/src/sweetalert2.scss";
import "react-datepicker/dist/react-datepicker.css";

import Swal from "sweetalert2";
import Popup from "reactjs-popup";
import { useRouter } from "next/router";
import { Lexend_Deca } from "@next/font/google";
import { More as IconMore, Eye as IconEye, EyeSlash as IconEyeSlash } from "iconsax-react";

const deca = Lexend_Deca({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
});

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
});
``;

const Default = (props) => {
    return (
        <React.Fragment>
            <Head>
                <link rel="shortcut icon" href="/favicon.ico" />
            </Head>
            <Provider store={store}>
                <main className={deca.className}>
                    <MainPage {...props} />
                </main>
            </Provider>
        </React.Fragment>
    );
};

function MainPage({ Component, pageProps }) {
    const dispatch = useDispatch();

    ///Language
    const langDefault = useSelector((state) => state.lang);
    const [changeLang, sChangeLang] = useState(false);
    const [data, sData] = useState();

    useEffect(() => {
        const showLang = localStorage.getItem("LanguagesFMRP");
        dispatch({ type: "lang/update", payload: showLang ? showLang : "vi" });
    }, []);

    const _ServerLang = async () => {
        await Axios("GET", `/api_web/Api_Lang/language/${langDefault}`, {}, (err, response) => {
            if (!err) {
                sData(response.data);
                sChangeLang(false);
            }
        });
    };

    useEffect(() => {
        changeLang && _ServerLang();
    }, [changeLang]);

    useEffect(() => {
        sChangeLang(true);
    }, [langDefault]);
    ////

    const auth = useSelector((state) => state.auth);

    const [onChecking, sOnChecking] = useState(false);

    const ServerFetching = () => {
        Axios("GET", "/api_web/Api_Authentication/authentication?csrf_protection=true", {}, (err, response) => {
            if (err) {
                dispatch({ type: "auth/update", payload: false });
            } else {
                const { isSuccess, info } = response?.data;
                if (isSuccess) {
                    dispatch({ type: "auth/update", payload: info });
                } else {
                    dispatch({ type: "auth/update", payload: false });
                }
            }
            sOnChecking(false);
        });
    };

    useEffect(() => {
        onChecking && ServerFetching();
    }, [onChecking]);

    useEffect(() => {
        auth === null && sOnChecking(true);
    }, [auth]);

    if (auth == null) {
        return <LoadingPage />;
    }

    if (auth === false) {
        return <LoginPage dataLang={data} />;
    }

    return (
        <Layout>
            <Component dataLang={data} {...pageProps} />
            {/* <PopupModelTime data={dataView} /> */}
        </Layout>
    );
}

const LoginPage = React.memo((props) => {
    const dispatch = useDispatch();

    const router = useRouter();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const dataLang = props.dataLang;

    const data = useSelector((state) => state.availableLang);

    const [tab, sTab] = useState(0);
    const _HandleSelectTab = (e) => sTab(e);

    const [typePassword, sTypePassword] = useState(false);
    const _TogglePassword = () => sTypePassword(!typePassword);

    const [rememberMe, sRememberMe] = useState(
        localStorage?.getItem("remembermeFMRP") ? localStorage?.getItem("remembermeFMRP") : false
    );
    const _ToggleRememberMe = () => sRememberMe(!rememberMe);

    const [code, sCode] = useState(localStorage?.getItem("usercodeFMRP") ? localStorage?.getItem("usercodeFMRP") : "");
    const [name, sName] = useState(localStorage?.getItem("usernameFMRP") ? localStorage?.getItem("usernameFMRP") : "");
    const [password, sPassword] = useState("");
    const [onSending, sOnSending] = useState(false);

    const [onFechingRegister, sOnFechingRegister] = useState(false);
    const [listMajor, sListMajor] = useState([]);
    const [listPosition, sListPosition] = useState([]);
    const [checkMajior, sCheckMajior] = useState(null);

    const [loadingRegester, sLoadingRegester] = useState(false);

    const showToat = (type, mssg) => {
        return Toast.fire({ icon: `${type}`, title: `${mssg}` });
    };
    const _ServerSending = () => {
        Axios(
            "POST",
            "/api_web/Api_Login/loginMain?csrf_protection=true",
            {
                data: {
                    company_code: code,
                    user_name: name,
                    password: password,
                },
            },
            (err, response) => {
                if (response !== null) {
                    const { isSuccess, message, token, database_app } = response?.data;
                    if (isSuccess) {
                        dispatch({ type: "auth/update", payload: response.data?.data });

                        localStorage.setItem("tokenFMRP", token);
                        localStorage.setItem("databaseappFMRP", database_app);

                        showToat("success", message);

                        if (rememberMe) {
                            localStorage.setItem("usernameFMRP", name);
                            localStorage.setItem("usercodeFMRP", code);
                            localStorage.setItem("remembermeFMRP", rememberMe);
                        } else {
                            ["usernameFMRP", "usercodeFMRP", "remembermeFMRP"].forEach((key) =>
                                localStorage.removeItem(key)
                            );
                        }
                    } else {
                        showToat("error", `${message || "Đăng nhập thất bại"}`);
                    }
                } else {
                    console.log("Lỗi");
                }
                sOnSending(false);
            }
        );
    };

    useEffect(() => {
        onSending && _ServerSending();
    }, [onSending]);

    const _HandleSubmit = (e) => {
        e.preventDefault();
        if ((name.length && code.length && password.length) === 0) {
            showToat("error", "Vui lòng điền đầy đủ thông tin");
        } else {
            sOnSending(true);
        }
    };

    ///Đăng ký
    const [isLogin, sIsLogin] = useState(true);

    const _HandleIsLogin = (e) => {
        sIsLogin(e);
        !e && sOnFechingRegister(true);
    };

    const _ServerFetching_Majior = () => {
        Axios("GET", "/api_web/Api_Login/get_list_data?csrf_protection=true", {}, (err, response) => {
            if (!err) {
                const result = response?.data;
                sListMajor(result?.career);
                sListPosition(result?.role_user);
            }
        });
        sOnFechingRegister(false);
    };
    useEffect(() => {
        onFechingRegister && _ServerFetching_Majior();
    }, [onFechingRegister]);

    const [stepRegister, sStepRegister] = useState(0);
    const _HandleSelectStep = (e) => {
        if (checkMajior) {
            sStepRegister(e);
        } else {
            showToat("error", "Vui lòng chọn ngành hàng của bạn");
        }
    };

    const onSubmit = async (data) => {
        sLoadingRegester(true);
        sPassword(data?.password);

        const dataSubmit = new FormData();

        dataSubmit.append("career", data?.major);
        dataSubmit.append("company_name", data?.companyName);
        dataSubmit.append("fullname", data?.fullName);
        dataSubmit.append("email", data?.email);
        dataSubmit.append("phone_number", data?.phone);
        dataSubmit.append("address", data?.city);
        dataSubmit.append("password", data?.password);
        dataSubmit.append("role_user", data?.location);

        await Axios(
            "POST",
            `/api_web/Api_Login/SignUpMain?csrf_protection=true`,
            {
                data: dataSubmit,
                headers: { "Content-Type": "multipart/form-data" },
            },
            (err, response) => {
                if (!err) {
                    const { isSuccess, message, code, email } = response?.data;
                    if (isSuccess) {
                        showToat("success", message);
                        setTimeout(() => {
                            sCode(code);
                            sName(email);
                            sOnSending(true);
                            router.push("/");
                        }, 1000);
                    } else {
                        showToat("error", message);
                        sLoadingRegester(false);
                    }
                }
            }
        );
    };

    return (
        <>
            {isLogin ? (
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
                                            {/* <div className="flex space-x-5 w-full">
                                                <button
                                                    onClick={_HandleSelectTab.bind(this, 0)}
                                                    className={`${
                                                        tab === 0
                                                            ? "bg-[#E2F0FE] border-transparent text-[#11315B]"
                                                            : "bg-white border-[#cccccc]"
                                                    } px-5 py-3 rounded-md transition hover:scale-105 border w-full`}
                                                >
                                                    {dataLang?.auth_version_official || "auth_version_official"}
                                                </button>
                                                <button
                                                    onClick={_HandleSelectTab.bind(this, 1)}
                                                    className={`${
                                                        tab === 1
                                                            ? "bg-[#E2F0FE] border-transparent text-[#11315B]"
                                                            : "bg-white border-[#cccccc]"
                                                    } px-5 py-3 rounded-md transition hover:scale-105 border w-full`}
                                                >
                                                    {dataLang?.auth_version_test || "auth_version_test"}
                                                </button>
                                            </div> */}
                                        </div>
                                        <div className="space-y-2">
                                            <input
                                                type="text"
                                                placeholder="Mã công ty"
                                                value={code}
                                                onChange={(e) => sCode(e.target.value)}
                                                className="border outline-none border-[#cccccc] focus:border-[#0F4F9E] hover:border-[#0F4F9E]/60 px-5 py-3 rounded-md w-full"
                                            />
                                            <input
                                                type="text"
                                                placeholder={dataLang?.auth_user_name || "auth_user_name"}
                                                value={name}
                                                id="username"
                                                onChange={(e) => sName(e.target.value)}
                                                className="border outline-none border-[#cccccc] focus:border-[#0F4F9E] hover:border-[#0F4F9E]/60 px-5 py-3 rounded-md w-full"
                                            />
                                            <div className="relative flex flex-col justify-center">
                                                <input
                                                    type={typePassword ? "text" : "password"}
                                                    placeholder={dataLang?.auth_password || "auth_password"}
                                                    value={password}
                                                    id="userpwd"
                                                    onChange={(e) => sPassword(e.target.value)}
                                                    className="border outline-none border-[#cccccc] focus:border-[#0F4F9E] hover:border-[#0F4F9E]/60 py-3 pl-5 pr-12 rounded-md w-full"
                                                />
                                                <button
                                                    onClick={_TogglePassword.bind(this)}
                                                    className="absolute right-3"
                                                >
                                                    {typePassword ? <IconEyeSlash /> : <IconEye />}
                                                </button>
                                            </div>
                                            <div className="flex w-full justify-between">
                                                <div className="flex items-center space-x-1.5">
                                                    <input
                                                        type="checkbox"
                                                        id="rememberMe"
                                                        value={rememberMe}
                                                        checked={rememberMe ? true : false}
                                                        onChange={_ToggleRememberMe.bind(this)}
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
                                            onClick={_HandleSubmit.bind(this)}
                                            className="text-[#FFFFFF] font-normal text-lg py-3 w-full rounded-md bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] btn-animation hover:scale-105"
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
                                            src="/logo_1.png"
                                            width={200}
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
                                {stepRegister == 0
                                    ? "Bước 1/2: Lựa chọn ngành hàng của bạn"
                                    : "Bước 2/2: Nhập thông tin của bạn để đăng ký"}
                            </h3>
                            <div className="3xl:w-[50%] 2xl:w-[50%] [@media(min-width:1440px)]:w-[50%] xl:w-[55%] lg:w-[70%] 3xl:mt-5 xxl:mt-1 mt-1">
                                <div className="grid grid-cols-2 gap-1">
                                    <div className="w-full h-1.5 rounded-full bg-[#3276FA]" />
                                    <div className="w-full h-1.5 rounded-full bg-[#F3F4F6] relative overflow-hidden">
                                        <div
                                            className={`${stepRegister == 0 ? "w-0" : "w-full"
                                                } duration-300 bg-[#3276FA] transition-[width] h-full absolute`}
                                        />
                                    </div>
                                </div>
                                {stepRegister == 0 ? (
                                    <div className="grid grid-cols-3  2xl:gap-5 gap-3 3xl:mt-5 xxl:mt-1 mt-2">
                                        {listMajor.map((e, index) => (
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
                                                            sCheckMajior(e.target.checked);
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
                                                        required: true,
                                                        minLength: 10,
                                                        maxLength: 16,
                                                    })}
                                                    placeholder="Nhập số điện thoại"
                                                    className={`${errors.phone
                                                            ? "border-red-500 border"
                                                            : "border-[#D0D5DD] border focus:border-[#3276FA] placeholder:text-[13px]"
                                                        } w-full   3xl:p-3 xxl:p-1.5 2xl:p-2 xl:p-2 lg:p-1 p-3 outline-none  rounded`}
                                                />
                                                {errors.phone && errors.phone.type === "required" && (
                                                    <span className="text-red-500 text-[13px]">
                                                        Vui lòng nhập số điện thoại
                                                    </span>
                                                )}
                                                {errors.phone && errors.phone.type === "maxLength" && (
                                                    <span className="text-red-500 text-[13px]">Tối đa 16 số</span>
                                                )}
                                                {errors.phone && errors.phone.type === "minLength" && (
                                                    <span className="text-red-500 text-[13px]">Tối thiểu 10 số</span>
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
                                                {listPosition.map((e) => (
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
                                            <button className="w-full bg-[#E2F0FE] text-[#1760B9] rounded 2xl:text-base text-sm">
                                                Nhập mã xác thực qua SMS
                                            </button>
                                            <input
                                                type="text"
                                                placeholder="Nhập mã xác thực"
                                                className="w-full border border-[#D0D5DD] 3xl:p-3 xxl:p-1.5 2xl:p-2 xl:p-2 lg:p-1 p-3 outline-none focus:border-[#3276FA] rounded placeholder:text-[13px]"
                                            />
                                        </div>
                                    </div>
                                )}
                                {stepRegister == 0 ? (
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
                                        <button
                                            type="button"
                                            onClick={handleSubmit(onSubmit)}
                                            disabled={loadingRegester}
                                            className={`${loadingRegester ? "relative" : ""
                                                } w-full 3xl:py-4 xxl:p-2 2xl:py-2 xl:p-2 lg:p-1 py-3 text-center rounded hover:bg-blue-600 transition-all duration-200 ease-linear bg bg-[#0F4F9E] text-white 3xl:mt-5 xxl:mt-1  2xl:mt-2 mt-1`}
                                        >
                                            {loadingRegester ? (
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
                                            ) : (
                                                "Đăng ký"
                                            )}
                                        </button>
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

const LoadingPage = () => {
    return (
        <React.Fragment>
            <Head>
                <title>Đang kiểm tra dữ liệu</title>
            </Head>
            <div className="h-screen w-screen flex flex-col justify-center items-center space-y-3 relative bg-[#fdfdfe]">
                {/* <Image alt="" src="/logo_1.png" width={200} height={70} quality={100} className="object-contain" loading="lazy" crossOrigin="anonymous" placeholder="blur" blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
        <h1>Đang kiểm tra dữ liệu vui lòng chờ trong giây lát</h1>
        <svg className="animate-spin h-40 w-40 opacity-50 absolute z-[-1] text-blue-600 fill-blue-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg> */}
                <img src="/loadingLogo.gif.jpg" className="h-40" />
            </div>
        </React.Fragment>
    );
};

export default Default;
