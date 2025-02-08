import { useContext, useState } from "react";
import { UserContext } from "../Contexts";
import { useNavigate } from "react-router";

function LoginPage() {
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const {
        user,
        setUser
    } = useContext(UserContext);

    async function handleForm(event) {
        event.preventDefault();
        if (email.trim().length < 1) {
            setError("E-mail cannot be empty!");
        }
        else if (password.length < 1) {
            setError("Password cannot be empty!");
        }
        else {
            const data = { email, password }
            const fetchResult = await fetch(import.meta.env.VITE_USER_SERVICE_LOCATION + "/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
            const responseJson = await fetchResult.json();
            window.localStorage.setItem('token', responseJson.token); // not safe :(
            window.localStorage.setItem('user', JSON.stringify(responseJson.user));
            responseJson.user.token = responseJson.token;
            setUser(responseJson.user);
            navigate("/");
        }
    }

    return(
        <>
        <form id="login" onSubmit={handleForm}>
            <label className="loginlabel" id="loginlabelup" htmlFor="email">E-mail</label>
            <input className="loginlabel" type="text" name="email" id="email" placeholder="your.email@domain.com" onChange={(e) => setEmail(e.target.value)} /><br />
            <label className="loginlabel" htmlFor="password">Password</label>
            <input className="loginlabel" type="password" name="password" id="password" placeholder="Your password" onChange={(e) => setPassword(e.target.value)} /><br />
            <button id="loginbutton" type="submit">Log in</button>
        </form>
        <p>{error}</p>
        </>
    )
}

export default LoginPage
