import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SimpleBar from "simplebar-react";
import PopupAppRenewal from "../UI/popup/PopupAppRenewal";
import PopupAppTrial from "../UI/popup/PopupAppTrial";
import Header from "./header";
import { Customscrollbar } from '../UI/common/Customscrollbar';
import { useSelector } from 'react-redux';
import ChatBubbleAI from '../UI/chat/ChatAiBubble';
import PopupAccountInformation from '../UI/popup/PopupAccountInformation';
import PopupChangePassword from '../UI/popup/PopupChangePassword';
import PopupRecommendation from '../UI/popup/PopupRecommendation';
import PopupUpdateVersion from '../UI/popup/PopupUpdateVersion';
import ImagesModal from '../UI/images/ImagesModal';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useRef } from 'react';
import PopupGlobal from '../common/popup/PopupGlobal';
import { useSheet } from '@/context/ui/SheetContext';
import { StateContext } from '@/context/_state/productions-orders/StateContext';
import useSocket from '@/hooks/socket/useSocket';

import { v4 as uuidv4 } from 'uuid';
import { useSocketWithToken } from '@/hooks/socket/useSocketWithToken';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
});

const Index = ({ children, ...props }) => {
    const router = useRouter()
    
    // lấy phân quyền
    const { closeSheet } = useSheet()

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

    console.log("router", router);

    const { hasNewVersion, version } = useAppContext();
    const dispatch = useDispatch();

    useEffect(() => {
        if (hasNewVersion) {
            dispatch({
                type: "statePopupGlobal",
                payload: {
                    open: true,
                    allowOutsideClick: false,
                    allowEscape: false,
                    children: <PopupUpdateNewVersion version={version} />,
                },
            });
        }
    }, [hasNewVersion]);

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
                </React.Fragment>
            )}

            {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </QueryClientProvider>
    );
};

export default Index;
