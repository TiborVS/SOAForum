import { useState, useEffect, useContext } from "react"
import { useNavigate, useParams } from "react-router";
import { formatDateFromDbString } from "../utils";
import { UserContext } from "../Contexts";

function ThreadPage() {
    const [posts, setPosts] = useState([]);
    const [thread, setThread] = useState(null);

    const [error, setError] = useState("");
    const [postText, setPostText] = useState("");
    const [newlyPosted, setNewlyPosted] = useState(0);
    const [editing, setEditing] = useState(false);
    const [editingId, setEditingId] = useState("");
    
    const params = useParams();
    const navigate = useNavigate();
    const {
        user,
        setUser
    } = useContext(UserContext);

    useEffect(() => {
        const fetchData = async () => {
            if (params.threadId) {
                var fetchResult = await fetch(import.meta.env.VITE_THREAD_SERVICE_LOCATION + "/threads/" + params.threadId);
                var resultJson = await fetchResult.json();
                var thread = resultJson;
                fetchResult = await fetch(import.meta.env.VITE_USER_SERVICE_LOCATION + "/users/" + thread.createdBy + "/username");
                resultJson = await fetchResult.json();
                thread.createdBy = resultJson.username;
                setThread(thread);

                fetchResult = await fetch(import.meta.env.VITE_POST_SERVICE_LOCATION + "/posts/thread/" + params.threadId);
                resultJson = await fetchResult.json();
                for (const post of resultJson) {
                    const fetchResult = await fetch(import.meta.env.VITE_USER_SERVICE_LOCATION + "/users/" + post.postedBy + "/username");
                    const resultJson = await fetchResult.json();
                    post.postedBy = resultJson.username;
                }
                setPosts(resultJson);
            }
            else {
                navigate("/");
            }
        }
        fetchData();
    }, [params, newlyPosted]);

    async function postSubmitHandler(event) {
        event.preventDefault();
        if (postText.trim().length < 1) {
            setError("Post text cannot be empty!")
        }
        else if (!editing) {
            const data = { text: postText, thread: params.threadId }
            const fetchResult = await fetch(import.meta.env.VITE_POST_SERVICE_LOCATION + "/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + user.token
                },
                body: JSON.stringify(data)
            });
            if (!fetchResult.ok) setError("Error submitting post.");
            else {
                setPostText("");
                setNewlyPosted(newlyPosted + 1);
            }
        }
        else {
            const data = { text: postText }
            const fetchResult = await fetch(import.meta.env.VITE_POST_SERVICE_LOCATION + "/posts/" + editingId, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + user.token
                },
                body: JSON.stringify(data)
            });
            if (!fetchResult.ok) setError("Error editing post.");
            else {
                setPostText("");
                setEditing(false);
                setEditingId("");
                setNewlyPosted(newlyPosted + 1);
            }
        }
    }

    async function deletePost(id) {
        const fetchResult = await fetch(import.meta.env.VITE_POST_SERVICE_LOCATION + "/posts/" + id, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + user.token
            }
        });
        if (!fetchResult.ok) setError("Error deleting post.");
        else {
            setNewlyPosted(newlyPosted + 1);
        }
    }

    return (
        <>
            <table>
                <thead>
                    <tr>
                        <th colSpan="2"><h3>{thread && thread.title}</h3></th>
                    </tr>
                </thead>
                <tbody>
                    {posts && posts.map((post) => {
                        return <tr key={post._id}>
                            <td>{post.postedBy}<br />{formatDateFromDbString(post.postedOn)}<hr /></td>
                            <td>
                                {post.text}
                                <hr />
                                {post.postedBy == user.username && 
                                <>
                                    <button onClick={() => {
                                        setEditing(true);
                                        setEditingId(post._id);
                                        setPostText(post.text);
                                    }}>Edit</button>
                                    <button onClick={() => {
                                        deletePost(post._id);
                                    }}>Delete</button>
                                </>
                                    
                                }
                            </td>
                        </tr>
                    })}
                </tbody>
            </table>
            {user && <>
                <form onSubmit={postSubmitHandler}>
                    <textarea name="text" id="text" placeholder="Your thoughts here..." value={postText} onChange={(e) => setPostText(e.target.value)}></textarea>
                    <button type="submit">{editing ? "Edit" : "Post"}</button>
                    {editing && <button onClick={() => {
                        setEditing(false);
                        setEditingId("");
                        setPostText("");
                    }}>Cancel</button>}
                </form>
                <p>{error}</p>
            </>}
        </>
    )
}

export default ThreadPage
