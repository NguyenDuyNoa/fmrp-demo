import { useSelector } from "react-redux";
// check xem tài khoản user tới hạn hay chưa
const useStatusExprired = () => useSelector((state) => state?.statusExprired);

export default useStatusExprired;
