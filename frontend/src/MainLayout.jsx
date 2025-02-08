import { useState, createContext, useEffect } from "react";
import { NavLink, Outlet } from "react-router";
import { UserContext } from "./Contexts";

function MainLayout() {
    const [user, setUser] = useState(null);

    function logOut() {
        setUser(null);
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("user");
    }

    useEffect(() => {
        const token = window.localStorage.getItem("token");
        const storedUser = window.localStorage.getItem("user");
        if (token && storedUser) {
            let userObj = JSON.parse(storedUser);
            userObj.token = token;
            setUser(userObj);
        }
    }, []);

    return (
        <UserContext.Provider value={{user, setUser}}>
            <header>
                <h1>Yet Another Forum</h1>
                <nav>
                    <NavLink className="navlink" to="/" end>Home</NavLink>
                    {!user && <NavLink className="navlink" to="/login" end>Log in</NavLink>}
                    {!user && <NavLink className="navlink" to="/register" end>Register</NavLink>}
                    {user && <NavLink className="navlink" to="/user" end>{user.username}</NavLink>}
                    {user && 
                        <button id="logout" onClick={logOut}>Log out</button>
                    }
                </nav>
            </header>
            <Outlet />
        </UserContext.Provider>
    );
    
}

export default MainLayout;
