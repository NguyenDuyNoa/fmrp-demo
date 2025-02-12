import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import PopupAppRenewal from "../UI/popup/PopupAppRenewal";
import PopupAppTrial from "../UI/popup/PopupAppTrial";
import Header from "./header";
import ChatAiBubble from '../UI/chat/ChatAiBubble';

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
                <div className="overflow-hidden">{children}

                </div>
            </div>
            <PopupAppTrial />
            <PopupAppRenewal />
            <ReactQueryDevtools initialIsOpen={true} />
        </QueryClientProvider>
    );
};

export default Index;
