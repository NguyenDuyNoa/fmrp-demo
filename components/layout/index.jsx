import PopupAppRenewal from "../UI/popup/PopupAppRenewal";
import PopupAppTrial from "../UI/popup/PopupAppTrial";
import Header from "./header";

const Index = (props) => {
    return (
        <>
            <div>
                <Header />
                <div className="overflow-hidden">{props.children}</div>
            </div>
            <PopupAppTrial />
            <PopupAppRenewal />
        </>
    );
};

export default Index;
