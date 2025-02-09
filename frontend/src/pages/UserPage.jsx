import { useContext, useState, useEffect } from "react"
import { UserContext } from "../Contexts"
import { useParams, Link } from "react-router";
import { formatDateFromDbString } from "../utils";

function UserPage() {
    const [userInfo, setUserInfo] = useState(null);
    const [userPosts, setUserPosts] = useState([]);
    const [pageError, setPageError] = useState("");
    const [formError, setFormError] = useState("");

    const { user, setUser } = useContext(UserContext);
    const params = useParams();

    async function handleFormSubmit(formData) {
        setFormError("");
        var response = await fetch(import.meta.env.VITE_FILE_SERVICE_LOCATION + "/images/", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + user.token
            },
            body: formData
        });
        if (!response.ok) {
            setFormError("Unknown error uploading file.")
            console.log(response.status);
            var responseJson = await response.json();
            console.log(responseJson);
        }
        else {
            responseJson = await response.json();
            const fileId = responseJson.fileId;
            const data = {
                username: user.username,
                email: user.email,
                profilePictureId: fileId,
                signature: user.signature
            }
            response = await fetch(import.meta.env.VITE_USER_SERVICE_LOCATION + "/users/" + user._id, {
                method: "PUT",
                headers: {
                    "Authorization": "Bearer " + user.token,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                setFormError("Unknown error updating user (file was uploaded).")
                console.log(response.status);
                responseJson = await response.json();
                console.log(responseJson);
            }
            else {
                alert("Successfully uploaded new profile image. It may take a few moments and a page refresh to show the new image.");
            }
        }
    }

    useEffect(() => {
        setPageError("");
        if (!user) {
            setPageError("You must be logged in to see this page.");
            return;
        }
        const fetchData = async () => {
            var fetchId = (params.userId ? params.userId : user._id);
            var fetchResult = await fetch(import.meta.env.VITE_USER_SERVICE_LOCATION + "/users/" + fetchId, {
                headers: {
                    "Authorization": "Bearer " + user.token
                }
            });
            if (!fetchResult.ok) setPageError("Error getting user data.");
            else {
                var resultJson = await fetchResult.json();
                setUserInfo(resultJson);
                fetchResult = await fetch(import.meta.env.VITE_POST_SERVICE_LOCATION + "/posts/user/" + fetchId);
                if (!fetchResult.ok) setPageError("Error getting user posts.");
                else {
                    const posts = await fetchResult.json();
                    for (const post of posts) {
                        fetchResult = await fetch(import.meta.env.VITE_THREAD_SERVICE_LOCATION + "/threads/" + post.thread);
                        if (!fetchResult.ok) {
                            if (fetchResult.status == 404) post.threadGone = true;
                            else post.threadTitle = "???";
                        }
                        else {
                            resultJson = await fetchResult.json();
                            post.threadTitle = resultJson.title;
                        }
                    }
                    setUserPosts(posts);
                }
            }
        }
        fetchData();
    }, [params]);



    return(
        <>
        {userInfo &&
            <>
                <h2 id="userName">{userInfo.username}</h2>
                <div id="userimage">
                    <img src={import.meta.env.VITE_FILE_SERVICE_LOCATION + "/images/" + userInfo.profilePictureId} alt={userInfo.username + "'s profile picture"} width="128" height="128" border="1"/>
                </div>
                <form action={handleFormSubmit}>
                    <label htmlFor="file">Change profile picture</label>
                    <input type="file" name="file" id="file" />
                    <button type="submit">Upload</button>
                </form>
                <p>{formError}</p>
                <p id="joinedon">Joined on {formatDateFromDbString(userInfo.joined)}</p>
                {userPosts &&
                    <>
                        <table id="userposts">
                            <thead>
                                <tr>
                                    <th className="userpostedthread">Posted</th>
                                    <th className="userpostedthread">Thread</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {userPosts.map((post) => {
                                    return <>
                                        {!post.threadGone &&
                                            <tr key={post._id}>
                                                <td className="usertabledate">{formatDateFromDbString(post.postedOn)}</td>
                                                <td className="usertablethread">
                                                    {!post.threadGone &&
                                                        <Link className="usertablethreadname" to={"/thread/"+post.thread}>{post.threadTitle}</Link>
                                                    }
                                                </td>
                                                <td>{post.text}</td>
                                            </tr>
                                        }
                                    </>
                                })}
                            </tbody>
                        </table>
                    </>
                }
            </>
        }
        <h2>{pageError}</h2>
        </>
    )
}

export default UserPage
