import ReactExport from "react-data-export";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
import { Grid6 as IconExcel } from "iconsax-react";
import ExcelIcon from "@/components/icons/common/Excel";
const ExcelFileComponent = ({ dataLang, classBtn, filename, title, multiDataSet }) => {
    return (
        <ExcelFile
            filename={`${filename}`}
            title={`${title}`}
            element={
                <button className={`${classBtn} 3xl:px-4 2xl:px-3 xl:px-4 lg:px-1 px-3 xl:py-3 py-1.5 2xl:text-xs xl:text-xs text-[7px] flex items-center space-x-2 bg-[#C7DFFB] rounded hover:scale-105 transition`}>
                    <ExcelIcon className="2xl:scale-100 xl:scale-100 scale-75 size-4 text-typo-blue-4" />
                    <span className="text-typo-blue-4 text-sm font-medium whitespace-nowrap">{dataLang?.client_list_exportexcel}</span>
                </button>
            }
        >
            <ExcelSheet dataSet={multiDataSet} data={multiDataSet} name="Organization" />
        </ExcelFile>
    );
};
export default ExcelFileComponent;
