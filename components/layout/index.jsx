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

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
})

const Index = ({ children, ...props }) => {
    const stateBoxChatAi = useSelector((state) => state?.stateBoxChatAi);

    return (
        <QueryClientProvider client={queryClient}>
            <div>
                <Header />
                <div>
                    {children}
                </div>
            </div>
            <PopupAppTrial {...props} />
            <PopupAppRenewal {...props} />
            {
                stateBoxChatAi.isShowAi && (
                    <ChatBubbleAI {...props} />
                )
            }
            <PopupAccountInformation {...props} />
            <PopupChangePassword {...props} />
            {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </QueryClientProvider>
    );
};

export default Index;
