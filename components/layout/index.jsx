import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SimpleBar from 'simplebar-react';
import PopupAppRenewal from "../UI/popup/PopupAppRenewal";
import PopupAppTrial from "../UI/popup/PopupAppTrial";
import Header from "./header";
import { Customscrollbar } from '../UI/common/Customscrollbar';

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
                <Customscrollbar className="max-h-screen" style={{ height: "100vh" }}>
                    {children}
                </Customscrollbar>
            </div>
            <PopupAppTrial />
            <PopupAppRenewal />
            {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </QueryClientProvider>
    );
};

export default Index;
