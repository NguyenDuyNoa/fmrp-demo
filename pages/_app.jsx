import Head from "next/head";
import React, { useEffect, useState } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";

import Layout from "@/components/layout";
import store from "/services/redux";

import "react-datepicker/dist/react-datepicker.css";
import "sweetalert2/src/sweetalert2.scss";
import "../styles/globals.scss";

import LoginPage from "@/components/UI/login/login";
import { Lexend_Deca } from "@next/font/google";
import apiDashboard from "Api/apiDashboard/apiDashboard";

const deca = Lexend_Deca({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
});
const Default = (props) => {
    return (
        <React.Fragment>
            <Head>
                <link rel="shortcut icon" href="/Favicon.png" />
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
    const [onSeting, sOnSeting] = useState(false);

    useEffect(() => {
        const showLang = localStorage.getItem("LanguagesFMRP");
        dispatch({ type: "lang/update", payload: showLang ? showLang : "vi" });
    }, []);

    const _ServerLang = async () => {
        const res = await apiDashboard.apiLang(langDefault);
        if (res) {
            sData(res);
            sChangeLang(false);
        }
    };

    const FetchSetingServer = async () => {
        const res = await apiDashboard.apiSettings();
        dispatch({ type: "setings/server", payload: res?.settings });

        const fature = await apiDashboard.apiFeature();
        const newData = {
            dataMaterialExpiry: fature.find((x) => x.code == "material_expiry"),
            dataProductExpiry: fature.find((x) => x.code == "product_expiry"),
            dataProductSerial: fature.find((x) => x.code == "product_serial"),
        };
        dispatch({ type: "setings/feature", payload: newData });
        sOnSeting(false);
    };

    useEffect(() => {
        changeLang && _ServerLang();
    }, [changeLang]);

    useEffect(() => {
        sOnSeting(true);
    }, []);

    useEffect(() => {
        onSeting && FetchSetingServer();
    }, [onSeting]);

    useEffect(() => {
        sChangeLang(true);
    }, [langDefault]);
    ////

    const auth = useSelector((state) => state.auth);

    const [onChecking, sOnChecking] = useState(false);

    const ServerFetching = async () => {
        const { isSuccess, info } = await apiDashboard.apiAuthentication();
        if (isSuccess) {
            dispatch({ type: "auth/update", payload: info });
        } else {
            dispatch({ type: "auth/update", payload: false });
        }
        sOnChecking(false);
    };

    useEffect(() => {
        onChecking && ServerFetching();
    }, [onChecking]);

    useEffect(() => {
        if (auth == null) {
            sOnChecking(true);
        }
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
        </Layout>
    );
}

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
                <img src="/loadingLogo.gif" className="h-52" />
                {/* <img src="/loadingLogo.gif.jpg" className="h-40" /> */}
            </div>
        </React.Fragment>
    );
};

export default Default;
