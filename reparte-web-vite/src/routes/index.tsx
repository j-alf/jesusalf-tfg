import {Navigate, Route, Routes, useLocation} from 'react-router-dom';
import {useAuth} from '../hooks/useAuth';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Groups from '../pages/Groups';
import GroupDetails from '../pages/GroupDetails';
import Members from '../pages/Members';
import Balances from '../pages/Balances';
import JoinGroup from '../pages/JoinGroup';
import Profile from '../pages/Profile.tsx';
import {ReactNode} from 'react';

function PrivateRoute({children}: Readonly<{ children: ReactNode }>) {
    const {isAuthenticated} = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{from: location}}/>;
    }

    return <>{children}</>;
}

function PublicRoute({children}: Readonly<{ children: ReactNode }>) {
    const {isAuthenticated} = useAuth();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/groups';

    if (isAuthenticated) {
        return <Navigate to={from}/>;
    }

    return <>{children}</>;
}

export default function AppRoutes() {
    return (
        <Routes>
            <Route
                path="/login"
                element={
                    <PublicRoute>
                        <Login/>
                    </PublicRoute>
                }
            />
            <Route
                path="/register"
                element={
                    <PublicRoute>
                        <Register/>
                    </PublicRoute>
                }
            />
            <Route
                path="/groups"
                element={
                    <PrivateRoute>
                        <Groups/>
                    </PrivateRoute>
                }
            />
            <Route
                path="/groups/:groupId"
                element={
                    <PrivateRoute>
                        <GroupDetails/>
                    </PrivateRoute>
                }
            />
            <Route
                path="/groups/:groupId/members"
                element={
                    <PrivateRoute>
                        <Members/>
                    </PrivateRoute>
                }
            />
            <Route
                path="/groups/:groupId/balances"
                element={
                    <PrivateRoute>
                        <Balances/>
                    </PrivateRoute>
                }
            />
            <Route
                path="/join/:inviteCode"
                element={
                    <PrivateRoute>
                        <JoinGroup/>
                    </PrivateRoute>
                }
            />
            <Route
                path="/profile"
                element={
                    <PrivateRoute>
                        <Profile/>
                    </PrivateRoute>
                }
            />
            <Route path="/" element={<Navigate to="/groups"/>}/>
        </Routes>
    );
}
