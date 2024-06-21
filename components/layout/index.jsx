import PopupAppRenewal from "../UI/popup/popupAppRenewal";
import PopupAppTrial from "../UI/popup/popupAppTrial";
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
