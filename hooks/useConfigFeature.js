import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const useFeature = () => {
    const feature = useSelector((state) => state?.feature);

    const [dataMaterialExpiry, sDataMaterialExpiry] = useState(feature?.dataMaterialExpiry || {});

    const [dataProductExpiry, sDataProductExpiry] = useState(feature?.dataProductExpiry || {});

    const [dataProductSerial, sDataProductSerial] = useState(feature?.dataProductSerial || {});


    useEffect(() => {
        if (feature) {
            sDataMaterialExpiry(feature?.dataMaterialExpiry?.is_enable ? feature?.dataMaterialExpiry : {});
            sDataProductExpiry(feature?.dataProductExpiry?.is_enable ? feature?.dataProductExpiry : {});
            sDataProductSerial(feature?.dataProductSerial?.is_enable ? feature?.dataProductSerial : {});
        }

    }, [feature]);


    return { dataMaterialExpiry, dataProductExpiry, dataProductSerial }
}



export default useFeature;
