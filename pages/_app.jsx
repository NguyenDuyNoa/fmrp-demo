import Layout from "@/components/layout";
import LoadingPage from "@/components/UI/loading/loadingPage";
import LoginPage from "@/components/UI/login/login";
import { useAuththentication, useLanguage, useSetings } from "@/hooks/useAuth";
import store from "@/services/redux";
import { Lexend_Deca } from "@next/font/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { Suspense, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Provider, useDispatch, useSelector } from "react-redux";
import "sweetalert2/src/sweetalert2.scss";
import "../styles/globals.scss";

const deca = Lexend_Deca({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
});

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
                        <main className={deca.className}>
                            <MainPage {...props} />
                        </main>
                    </Provider>
                </Suspense>
            </QueryClientProvider>
        </React.Fragment>
    );
};

function MainPage({ Component, pageProps }) {
    const { } = useSetings()

    const router = useRouter();


    const dispatch = useDispatch();

    const auth = useSelector((state) => state.auth);

    const { } = useAuththentication(auth)

    const langDefault = useSelector((state) => state.lang);

    const { data } = useLanguage(langDefault)

    useEffect(() => {
        const showLang = localStorage.getItem("LanguagesFMRP");
        dispatch({ type: "lang/update", payload: showLang ? showLang : "vi" });
    }, []);

    if (auth == null) {
        return <LoadingPage />;
    }

    if (auth == false) {
        return <LoginPage dataLang={data} />;
    }

    return (
        <Layout>
            <Component dataLang={data} {...pageProps} />
        </Layout>
    );
}
export default Index;
