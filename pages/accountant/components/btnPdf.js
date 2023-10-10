import { useState, useEffect } from "react";
import { _ServerInstance as Axios } from "/services/axios";
import FilePDF from "../FilePDF";
import PopupEdit from "/components/UI/popup";

const Popup_Pdf = (props) => {
    const [open, sOpen] = useState(false);
    const _ToggleModal = (e) => sOpen(e);
    const [dataPDF, setData] = useState();
    const [dataCompany, setDataCompany] = useState();
    const fetchDataSettingsCompany = () => {
        if (props?.id) {
            Axios("GET", `/api_web/Api_setting/CompanyInfo?csrf_protection=true`, {}, (err, response) => {
                if (!err) {
                    let { data } = response.data;
                    setDataCompany(data);
                }
            });
        }
        if (props?.id) {
            Axios(
                "GET",
                `/api_web/Api_expense_payslips/expenseCoupon/${props?.id}?csrf_protection=true`,
                {},
                (err, response) => {
                    if (!err) {
                        let db = response.data;
                        setData(db);
                    }
                }
            );
        }
    };
    useEffect(() => {
        open && fetchDataSettingsCompany();
    }, [open]);

    return (
        <>
            <PopupEdit
                title={props.dataLang?.option_prin || "option_prin"}
                button={props.dataLang?.btn_table_print || "btn_table_print"}
                onClickOpen={_ToggleModal.bind(this, true)}
                open={open}
                onClose={_ToggleModal.bind(this, false)}
                classNameBtn={props?.className}
            >
                <div className="flex items-center space-x-4 my-2 border-[#E7EAEE] border-opacity-70 border-b-[1px]"></div>
                <div className="space-x-5 w-[400px] h-auto">
                    <div>
                        <div className="w-[400px]">
                            <FilePDF
                                props={props}
                                openAction={open}
                                setOpenAction={sOpen}
                                dataCompany={dataCompany}
                                data={dataPDF}
                            />
                        </div>
                    </div>
                </div>
            </PopupEdit>
        </>
    );
};
export default Popup_Pdf;
