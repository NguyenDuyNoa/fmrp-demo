import { useSelector } from "react-redux";

const useStatusExprired = () => useSelector((state) => state?.trangthaiExprired);

export default useStatusExprired;
