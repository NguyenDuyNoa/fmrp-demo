import { useSelector } from "react-redux";

const useStatusExprired = () => {
    return useSelector((state) => state?.trangthaiExprired);
};

export default useStatusExprired;
