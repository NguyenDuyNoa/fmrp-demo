import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import PopupAppRenewal from "../UI/popup/PopupAppRenewal";
import PopupAppTrial from "../UI/popup/PopupAppTrial";
import Header from "./header";
import ChatAiBubble from '../UI/chat/ChatAiBubble';
import SimpleBar from 'simplebar-react';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
})

const Index = ({ children }) => {
    return (
        <QueryClientProvider client={queryClient}>
            <div>
                <Header />
                <SimpleBar style={{ height: "100vh" }}>
                    {children}
                </SimpleBar>
            </div>
            <PopupAppTrial />
            <PopupAppRenewal />
            {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </QueryClientProvider>
    );
};

export default Index;
