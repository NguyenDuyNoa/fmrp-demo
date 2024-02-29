import { useSelector } from "react-redux";

const useFeature = () => useSelector((state) => state?.feature);



export default useFeature;
