import { useSocketContext } from "@/context/socket/SocketContext";
import { useVersionApplication } from "@/managers/api/version-application/useVersionApplication";
import { CookieCore } from "@/utils/lib/cookie";
import { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

export const VersionContext = createContext();

export const VersionProvider = ({ children }) => {
  const [hasNewVersion, setHasNewVersion] = useState(false);

  // lấy phân quyền
  const auth = useSelector((state) => state.auth);
  const tokenFMRP = CookieCore.get("tokenFMRP");
  const databaseappFMRP = CookieCore.get("databaseappFMRP");


  const {
    data: version,
    isLoading: isLoadingVersion,
    refetch: refetchVersion,
  } = useVersionApplication({
    enabled: !!auth && !!tokenFMRP && !!databaseappFMRP,
  });


  useEffect(() => {
    if (!isLoadingVersion && auth && tokenFMRP && databaseappFMRP) {
      const { version_current, version_new } = version ?? {};
      if (version_current?.version !== version_new?.version) {
        setHasNewVersion(true);
      }
    }
  }, [version]);


  return (
    <VersionContext.Provider
      value={{ hasNewVersion, setHasNewVersion, version, refetchVersion }}
    >
      {children}
    </VersionContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(VersionContext);
  if (!context) {
    throw new Error("useAppContext phải được dùng bên trong AppProvider");
  }
  return context;
};
