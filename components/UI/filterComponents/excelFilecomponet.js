import ReactExport from "react-data-export";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
import { Grid6 as IconExcel } from "iconsax-react";
const ExcelFileComponent = ({ dataLang, classBtn, filename, title, multiDataSet }) => {
    return (
        <ExcelFile
            filename={`${filename}`}
            title={`${title}`}
            element={
                <button className={`${classBtn} xl:px-4 px-3 xl:py-2.5 py-1.5 2xl:text-xs xl:text-xs text-[7px] flex items-center space-x-2 bg-[#C7DFFB] rounded hover:scale-105 transition`}>
                    <IconExcel className="2xl:scale-100 xl:scale-100 scale-75" size={18} />
                    <span>{dataLang?.client_list_exportexcel}</span>
                </button>
            }
        >
            <ExcelSheet dataSet={multiDataSet} data={multiDataSet} name="Organization" />
        </ExcelFile>
    );
};
export default ExcelFileComponent;
