import { StateContext } from "@/context/_state/productions-orders/StateContext";
import { useSheet } from "@/context/ui/SheetContext";
import {
    QueryClient,
    QueryClientProvider,
    useQueryClient
} from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import PopupGlobal from "../common/popup/PopupGlobal";
import ChatBubbleAI from "../UI/chat/ChatAiBubble";
import ImagesModal from "../UI/images/ImagesModal";
import PopupAccountInformation from "../UI/popup/PopupAccountInformation";
import PopupAppRenewal from "../UI/popup/PopupAppRenewal";
import PopupAppTrial from "../UI/popup/PopupAppTrial";
import PopupChangePassword from "../UI/popup/PopupChangePassword";
import PopupRecommendation from "../UI/popup/PopupRecommendation";
import PopupUpdateVersion from "../UI/popup/PopupUpdateVersion";
import PopupUpgradeProfessional from "../UI/popup/PopupUpgradeProfessional";
import Header from "./header";

import { useAppContext } from "@/context/_state/version-application/VersionContext";
import { useSocketContext } from "@/context/socket/SocketContext";
import { useDispatch } from "react-redux";
import PopupUpdateNewVersion from "../common/popup/PopupUpdateNewVersion";
import PopupSuccessfulPayment from "../UI/popup/PopupSuccessfulPayment";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
});

const Index = ({ children, ...props }) => {
    const router = useRouter();

    // lấy phân quyền
    const { closeSheet } = useSheet();

    const { queryStateProvider } = useContext(StateContext);
    const stateBoxChatAi = useSelector((state) => state?.stateBoxChatAi);

    const statePopupPreviewImage = useSelector(
        (state) => state?.statePopupPreviewImage
    );

    const statePopupAccountInformation = useSelector(
        (state) => state.statePopupAccountInformation
    );
    const statePopupChangePassword = useSelector(
        (state) => state.statePopupChangePassword
    );
    const statePopupRecommendation = useSelector(
        (state) => state.statePopupRecommendation
    );
    const statePopupUpdateVersion = useSelector(
        (state) => state.statePopupUpdateVersion
    );
    const statePopupUpgradeProfessional = useSelector(
        (state) => state.statePopupUpgradeProfessional
    );
    const statePopupSuccessfulPayment = useSelector(
        (state) => state.statePopupSuccessfulPayment
    );
    const statePopupGlobal = useSelector((state) => state.statePopupGlobal);

    useEffect(() => {
        if (!router?.route?.startsWith("/manufacture/productions-orders")) {
            closeSheet("manufacture-productions-orders");
            queryStateProvider((prev) => ({
                productionsOrders: {
                    ...prev.productionsOrders,
                    selectedImages: [],
                    uploadProgress: {},
                    inputCommentText: "",
                    taggedUsers: [],
                },
            }));
        }
    }, [router.isReady, router?.route]);

    // console.log("router", router);

    const { hasNewVersion, version, setHasNewVersion, refetchVersion } = useAppContext();
    const dispatch = useDispatch();
    const { socket } = useSocketContext();

    useEffect(() => {
        if (hasNewVersion) {
            dispatch({
                type: "statePopupGlobal",
                payload: {
                    open: true,
                    allowOutsideClick: false,
                    allowEscape: false,
                    children: <PopupUpdateNewVersion version={version} setHasNewVersion={setHasNewVersion} />,
                },
            });
        }
    }, [hasNewVersion, version]);
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!socket) return;
        const topic = `update_version`;

        socket.on(topic, async (data) => {
            if (data && data.data) {
                await queryClient.invalidateQueries(["versionApplication"]);
                await refetchVersion() //check nếu có 2 version cùng lúc lấy bản mới nhất
            }
        });

        return () => {
            socket.off(topic);
        };
    }, [socket]);

    return (
        <QueryClientProvider client={queryClient}>
            {router.pathname == "/manufacture/productions-orders-mobile" ||
                router.pathname == "/manufacture/production-plan-mobile" ? (
                children
            ) : (
                <React.Fragment>
                    <Header />
                    {children}
                    {stateBoxChatAi.isShowAi && <ChatBubbleAI {...props} />}
                    {/* {stateBoxChatAi.isShowAi} */}
                    {statePopupPreviewImage.open && <ImagesModal {...props} />}
                    {statePopupGlobal.open && <PopupGlobal {...props} />}

                    <PopupAppTrial {...props} />
                    <PopupAppRenewal {...props} />
                    {statePopupUpdateVersion?.open && <PopupUpdateVersion {...props} />}
                    {statePopupAccountInformation?.open && (
                        <PopupAccountInformation {...props} />
                    )}
                    {statePopupChangePassword?.open && <PopupChangePassword {...props} />}
                    {statePopupRecommendation?.open && <PopupRecommendation {...props} />}
                    {statePopupUpgradeProfessional?.open && <PopupUpgradeProfessional {...props} />}
                    {statePopupSuccessfulPayment?.open && <PopupSuccessfulPayment {...props} />}
                </React.Fragment>
            )}

            {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </QueryClientProvider>
    );
};

export default Index;
