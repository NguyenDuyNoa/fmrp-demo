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

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
})

const Index = ({ children, ...props }) => {
    const stateBoxChatAi = useSelector((state) => state?.stateBoxChatAi);

    const statePopupPreviewImage = useSelector((state) => state?.statePopupPreviewImage);

    return (
        <QueryClientProvider client={queryClient}>

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

            <PopupAppTrial {...props} />
            <PopupAppRenewal {...props} />
            <PopupUpdateVersion {...props} />
            <PopupAccountInformation {...props} />
            <PopupChangePassword {...props} />
            <PopupRecommendation {...props} />
            {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </QueryClientProvider>
    );
};

export default Index;
