import Layout from "@/components/layout";
import LoadingPage from "@/components/UI/loading/loadingPage";
import LoginPage from "@/components/UI/login/login";
import { useAuththentication, useLanguage, useSetings } from "@/hooks/useAuth";
import store from "@/services/redux";
import { Inter, Lexend_Deca } from "@next/font/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Head from "next/head";
import React, { Suspense, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Provider, useDispatch, useSelector } from "react-redux";
import "sweetalert2/src/sweetalert2.scss";
import "../styles/globals.scss";
import { CookieCore } from "@/utils/lib/cookie";
// import ChatBubbleAI from "@/components/UI/chat/ChatAiBubble";
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
                    <link rel="shortcut icon" href="/Favicon.png" />
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

    const tokenFMRP = CookieCore.get('tokenFMRP')

    const stateBoxChatAi = useSelector((state) => state?.stateBoxChatAi);

    const databaseappFMRP = CookieCore.get('databaseappFMRP')

    const { data: dataSeting } = useSetings()

    const auth = useSelector((state) => state.auth);

    const { data: dataAuth, isLoading } = useAuththentication(auth)

    const langDefault = useSelector((state) => state.lang);

    const { data } = useLanguage(langDefault)

    useEffect(() => {
        const showLang = localStorage.getItem("LanguagesFMRP");
        dispatch({ type: "lang/update", payload: showLang ? showLang : "vi" });
    }, []);

    if (isLoading || auth == null) {
        return <LoadingPage />;
    }

    if (!isLoading && (!dataAuth || !(tokenFMRP && databaseappFMRP) || auth == false)) {
        return <LoginPage dataLang={data} />;
    }

    return (
        <Layout>
            <Component dataLang={data} {...pageProps} />
            {/* {
                stateBoxChatAi.isShowAi && (
                    <ChatBubbleAI dataLang={data} />
                )
            } */}
        </Layout>
    );
}
export default Index;
