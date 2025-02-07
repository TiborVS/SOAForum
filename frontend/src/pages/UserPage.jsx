import { useContext, useState, useEffect } from "react"
import { UserContext } from "../Contexts"
import { useParams, Link } from "react-router";
import { formatDateFromDbString } from "../utils";

function UserPage() {
    const [userInfo, setUserInfo] = useState(null);
    const [userPosts, setUserPosts] = useState([]);
    const [error, setError] = useState("");

    const { user, setUser } = useContext(UserContext);
    const params = useParams();

    useEffect(() => {
        setError("");
        if (!user) {
            setError("You must be logged in to see this page.");
            return;
        }
        const fetchData = async () => {
            var fetchId = (params.userId ? params.userId : user.id);
            var fetchResult = await fetch(import.meta.env.VITE_USER_SERVICE_LOCATION + "/users/" + fetchId, {
                headers: {
                    "Authorization": "Bearer " + user.token
                }
            });
            if (!fetchResult.ok) setError("Error getting user data.");
            else {
                var resultJson = await fetchResult.json();
                setUserInfo(resultJson);
                fetchResult = await fetch(import.meta.env.VITE_POST_SERVICE_LOCATION + "/posts/user/" + fetchId);
                if (!fetchResult.ok) setError("Error getting user posts.");
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
                <h2>{userInfo.username}</h2>
                <img src={import.meta.env.VITE_FILE_SERVICE_LOCATION + "/images/" + userInfo.profilePictureId} alt={userInfo.username + "'s profile picture"} width="128" height="128" border="1"/>
                <p>Joined on {formatDateFromDbString(userInfo.joined)}</p>
                {userPosts &&
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>Posted</th>
                                    <th>Thread</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {userPosts.map((post) => {
                                    return <>
                                        {!post.threadGone &&
                                            <tr key={post._id}>
                                                <td>{formatDateFromDbString(post.postedOn)}</td>
                                                <td>
                                                    {!post.threadGone &&
                                                        <Link to={"/thread/"+post.thread}>{post.threadTitle}</Link>
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
        <h2>{error}</h2>
        </>
    )
}

export default UserPage
