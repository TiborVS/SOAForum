import { useContext, useState } from "react";
import { UserContext } from "../Contexts";
import { useNavigate } from "react-router";

function RegisterPage() {
    const [error, setError] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const {
        user,
        setUser
    } = useContext(UserContext);

    async function handleForm(event) {
        event.preventDefault();
        if (username.trim().length < 1) {
            setError("Username cannot be empty!");
        }
        else if (email.trim().length < 1) {
            setError("E-mail cannot be empty!");
        }
        else if (password.length < 1) {
            setError("Password cannot be empty!");
        }
        else {
            const data = { username, email, password }
            const fetchResult = await fetch(import.meta.env.VITE_USER_SERVICE_LOCATION + "/users", {
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
        <form id="register" onSubmit={handleForm}>
            <label className="registerlabel" id="registerlabelup" htmlFor="email">E-mail</label>
            <input className="registerlabel" type="text" name="email" id="email" placeholder="your.email@domain.com" onChange={(e) => setEmail(e.target.value)} /><br />
            <label className="registerlabel" id="registerusername" htmlFor="username">Username</label>
            <input className="registerlabel" type="text" name="username" id="username" placeholder="Your public username" onChange={(e) => setUsername(e.target.value)} /><br />
            <label className="registerlabel" htmlFor="password">Password</label>
            <input className="registerlabel" type="password" name="password" id="password" placeholder="Your password" onChange={(e) => setPassword(e.target.value)} /><br />
            <button id="registerbutton" type="submit">Register</button>
        </form>
        <p>{error}</p>
        </>
    )
}

export default RegisterPage
