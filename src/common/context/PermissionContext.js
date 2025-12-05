import {createContext, useCallback, useContext, useMemo} from "react";
import {useSelector} from "react-redux";
import {MyRolesInfo} from "../../types/common";

const PermissionContext = createContext({})
export const PermissionProvidor = ({children}) => {
    const rolesInfo = useSelector((state) => state.commonReducer.myRolesInfo);

    const hasAppPermission = useCallback(() => {
        if (rolesInfo && rolesInfo.is_superuser) {
            return true;
        }
        return false;
    }, [rolesInfo]);
    const hasSchedulingPermission = useCallback(() => {
        if (rolesInfo.is_superuser)
            return true;
        if (rolesInfo.course_roles && rolesInfo.course_roles.indexOf('mentor') > -1)
            return true;
        return false;
    });
    const value = useMemo(() => ({
        hasAppPermission,
        hasSchedulingPermission
    }), [hasAppPermission, hasSchedulingPermission]);
    return (
        <PermissionContext.Provider value={value}>
            {children}
        </PermissionContext.Provider>
    );
};
export const usePermission = () => {
    const context = useContext(PermissionContext);
    if (!context) {
        throw new Error("usePermissions must be used within a PermissionProvider");
    }
    return context;
};
