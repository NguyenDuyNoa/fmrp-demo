import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SimpleBar from 'simplebar-react';
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
import React from 'react';
import PopupGlobal from '../common/popup/PopupGlobal';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
})

const Index = ({ children, ...props }) => {
    const router = useRouter()

    const stateBoxChatAi = useSelector((state) => state?.stateBoxChatAi);

    const statePopupPreviewImage = useSelector((state) => state?.statePopupPreviewImage);

    const statePopupAccountInformation = useSelector((state) => state.statePopupAccountInformation);
    const statePopupChangePassword = useSelector((state) => state.statePopupChangePassword);
    const statePopupRecommendation = useSelector((state) => state.statePopupRecommendation);
    const statePopupUpdateVersion = useSelector((state) => state.statePopupUpdateVersion);
    const statePopupGlobal = useSelector((state) => state.statePopupGlobal);

    return (
        <QueryClientProvider client={queryClient}>
            {
                (router.pathname == '/manufacture/productions-orders-mobile' || router.pathname == '/manufacture/production-plan-mobile')
                    ?
                    children
                    :
                    <React.Fragment>
                        <Header />
                        {children}
                        {
                            stateBoxChatAi.isShowAi && (
                                <ChatBubbleAI {...props} />
                            )
                        }
                        {
                            statePopupPreviewImage.open && <ImagesModal {...props} />
                        }
                        {
                            statePopupGlobal.open && <PopupGlobal {...props} />
                        }

                        <PopupAppTrial {...props} />
                        <PopupAppRenewal {...props} />
                        {
                            statePopupUpdateVersion?.open &&
                            <PopupUpdateVersion {...props} />
                        }
                        {
                            statePopupAccountInformation?.open &&
                            <PopupAccountInformation {...props} />
                        }
                        {
                            statePopupChangePassword?.open &&
                            <PopupChangePassword {...props} />
                        }
                        {
                            statePopupRecommendation?.open &&
                            <PopupRecommendation {...props} />
                        }
                    </React.Fragment>
            }

            {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </QueryClientProvider>
    );
};

export default Index;
