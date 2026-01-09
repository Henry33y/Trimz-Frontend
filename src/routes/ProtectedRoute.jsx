/* eslint-disable react/prop-types */
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { token, role } = useContext(AuthContext);



    // Debugging token and role
    console.log('ProtectedRoute:', { token, role, allowedRoles });

    // Show a loading state if token or role is not yet defined
    if (token === undefined || role === undefined) {
        return <div>Loading...</div>;
    }



    // Check if the user is allowed
    const isAllowed = token && allowedRoles.includes(role);

    // Determine where to redirect if not allowed
    let redirectPath = "/login";
    if (allowedRoles.includes('superadmin') && !allowedRoles.includes('user')) {
        redirectPath = "/superadmin/login";
    } else if (allowedRoles.includes('admin') && !allowedRoles.includes('user')) {
        redirectPath = "/admin/login";
    }

    const accessibleRoute = token && isAllowed ? children : <Navigate to={redirectPath} replace={true} />;

    return accessibleRoute
};

export default ProtectedRoute;
