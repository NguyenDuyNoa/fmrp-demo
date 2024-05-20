import { useSelector } from "react-redux";

const useStatusExprired = () => useSelector((state) => state?.statusExprired);

export default useStatusExprired;
