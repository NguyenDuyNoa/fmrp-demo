import Layout from "@/components/layout";
import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import LoadingPage from "@/components/UI/loading/loadingPage";
import { useAuththentication, useLanguage, useSetings } from "@/hooks/useAuth";
import store from "@/services/redux";
import { CookieCore } from "@/utils/lib/cookie";
import { Inter, Lexend_Deca } from "@next/font/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { Suspense, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Provider, useDispatch, useSelector } from "react-redux";
import 'simplebar-react/dist/simplebar.min.css';
import "sweetalert2/src/sweetalert2.scss";
import "../styles/globals.scss";
import Login from "./auth/login";
import Register from "./auth/register";

// const t = Lark
const deca = Lexend_Deca({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({ subsets: ["latin"] });

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
});

const Index = (props) => {

    return (
        <React.Fragment>
            <QueryClientProvider client={queryClient}>
                <Head>
                    <link rel="shortcut icon" href="/faicon-nobg.png" />
                    {/* <link rel="shortcut icon" href="/Favicon.png" /> */}
                </Head>
                <Suspense fallback={<LoadingPage />}>
                    <Provider store={store}>
                        {/* <main style={{ fontFamily: "LarkHackSafariFont, LarkEmojiFont, LarkChineseQuote, -apple-system, BlinkMacSystemFont, Helvetica Neue, Tahoma, PingFang SC, Microsoft Yahei, Arial, Hiragino Sans GB, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji" }}> */}
                        {/* <main className={deca.className}> */}
                        <main className={inter.className}>
                            <MainPage {...props} />
                        </main>
                    </Provider>
                </Suspense>
            </QueryClientProvider>
        </React.Fragment>
    );
};

function MainPage({ Component, pageProps }) {
    const dispatch = useDispatch();

    const router = useRouter()

    const tokenFMRP = CookieCore.get('tokenFMRP')

    const databaseappFMRP = CookieCore.get('databaseappFMRP')

    const { data: dataSeting } = useSetings()

    const auth = useSelector((state) => state.auth);

    const { data: dataAuth, isLoading } = useAuththentication(auth)

    const stateBoxChatAi = useSelector((state) => state?.stateBoxChatAi);

    const statePopupParent = useSelector((state) => state?.popupParent);

    const langDefault = useSelector((state) => state.lang);

    const { data } = useLanguage(langDefault)

    const statePopupPreviewImage = useSelector((state) => state?.statePopupPreviewImage);

    useEffect(() => {

        const parentDatepicker = document.querySelector(".parentDatepicker");
        const parentSelect = document.querySelector(".parentSelect");

        const headerTablePopup = document.querySelector(".headerTablePopup");
        if (!parentDatepicker || !parentSelect || !headerTablePopup) return;

        const updateZIndex = () => {
            const modalContainer = document.getElementById("react-modal-image-img");

            if (modalContainer) {
                parentDatepicker.style.zIndex = "0"; // Khi modal mở, thay đổi z-index của phần tử mong muốn
                parentSelect.style.zIndex = "0"; // Khi modal mở, thay đổi z-index của phần tử mong muốn
                headerTablePopup.style.zIndex = "0"; // Khi modal mở, thay đổi z-index của phần tử mong muốn
            } else {
                parentSelect.style.zIndex = ""; // Khi modal đóng, reset lại giá trị mặc định
                parentDatepicker.style.zIndex = ""; // Khi modal đóng, reset lại giá trị mặc định
                headerTablePopup.style.zIndex = ""; // Khi modal đóng, reset lại giá trị mặc định
            }
        };

        // Theo dõi sự thay đổi trong body
        const observer = new MutationObserver(updateZIndex);
        observer.observe(document.body, { childList: true, subtree: true });

        // Kiểm tra ngay khi component mount
        updateZIndex();


        return () => {
            observer.disconnect(); // Dừng theo dõi khi component bị unmount
        };
    }, [router.pathname, statePopupPreviewImage.open]);


    useEffect(() => {
        const showLang = localStorage.getItem("LanguagesFMRP");
        dispatch({ type: "lang/update", payload: showLang ? showLang : "vi" });
    }, []);

    useEffect(() => {
        const scroll = document.querySelector('.simplebar-mask')
        if (stateBoxChatAi.open && scroll) {
            scroll.style.zIndex = 'unset'
            return
        }
    }, [stateBoxChatAi.open, statePopupPreviewImage.open])

    if (isLoading || auth == null) {
        return <LoadingPage />;
    }

    if (router.pathname == '/manufacture/productions-orders-mobile' || router.pathname == '/manufacture/production-plan-mobile') {

        return <Customscrollbar className="relative max-h-screen ">
            <Layout dataLang={data}>
                <Component dataLang={data} {...pageProps} />
            </Layout>
        </Customscrollbar>
    }

    if (!isLoading && (!dataAuth || !(tokenFMRP && databaseappFMRP) || auth == false)) {
        console.log("tokenFMRP", tokenFMRP);
        console.log("databaseappFMRP", databaseappFMRP);
        if (router.pathname == '/auth/register') {
            console.log("auth");
            return <Register dataLang={data} />;
        }
        if ((!isLoading && (!dataAuth || !(tokenFMRP && databaseappFMRP) || auth == false) || router.pathname == '/auth/login')) {
            console.log("auth1");

            return <Login dataLang={data} />;
        }
        router.replace("/dashboard");
        return <LoadingPage />;


    }
    // Nếu đã đăng nhập mà đang ở login hoặc register, chuyển hướng dashboard
    if (router.pathname.startsWith("/auth")) {
        router.replace("/dashboard");
        return <LoadingPage />;
    }

    return (
        <Customscrollbar
            className="relative max-h-screen "
        // className={`${['/dashboard'].includes(router.pathname) ? "max-h-screen" : "!overflow-y-hidden !overflow-x-hidden"}`}
        >
            <Layout dataLang={data}>
                <Component dataLang={data} {...pageProps} />
            </Layout>
        </Customscrollbar>
    );
}
export default Index;
