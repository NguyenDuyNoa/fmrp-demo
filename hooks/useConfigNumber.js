import { useSelector } from "react-redux";

const useSetingServer = () => useSelector((state) => state?.setings);



export default useSetingServer;
