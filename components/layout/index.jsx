import PopupAppRenewal from "../UI/popup/PopupAppRenewal";
import PopupAppTrial from "../UI/popup/PopupAppTrial";
import Header from "./header";

const Index = ({ children }) => {
    return (
        <>
            <div>
                <Header />
                <div className="overflow-hidden">{children}</div>
            </div>
            <PopupAppTrial />
            <PopupAppRenewal />
        </>
    );
};

export default Index;
