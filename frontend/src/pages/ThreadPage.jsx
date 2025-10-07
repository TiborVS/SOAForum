import { useState, useEffect, useContext } from "react"
import { useNavigate, useParams, Link } from "react-router";
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
                    post.postedByName = resultJson.username;
                    const reactions = parseReactions(post);
                    post.likes = reactions.likes;
                    post.dislikes = reactions.dislikes;
                    post.userLiked = reactions.userLiked;
                    post.userDisliked = reactions.userDisliked;
                    post.userReactionId = reactions.userReactionId;
                }
                setPosts(resultJson);
            }
            else {
                navigate("/");
            }
        }
        fetchData();
    }, [params, newlyPosted]);

    function parseReactions(post) {
        var likes = 0;
        var dislikes = 0;
        var userLiked = false;
        var userDisliked = false;
        var userReactionId = "";
        for (const reaction of post.reactions) {
            if (reaction.type == "like") likes++;
            else if (reaction.type == "dislike") dislikes++

            if (reaction.reactedBy == user._id) {
                userReactionId = reaction._id;
                if (reaction.type == "like") userLiked = true;
                else if (reaction.type == "dislike") userDisliked = true;
            }
        }
        return { likes, dislikes, userLiked, userDisliked, userReactionId }
    }

    async function postSubmitHandler(formData) {
        setError("");
        const file = formData.get("file");
        if (postText.trim().length < 1) {
            setError("Post text cannot be empty!")
            return;
        }
        if (!editing) {
            if (file) {
                var fileOk = true;
                if (file.type == "text/plain") {
                    var endpoint = "/text/"
                    var fileType = "text"
                }
                else if (file.type == "image/png" || file.type == "image/jpg" || file.type == "image/jpeg") {
                    endpoint = "/images/"
                    fileType = "image"
                }
                else {
                    fileOk = false;
                }
                if (fileOk) {
                    const response = await fetch(import.meta.env.VITE_FILE_SERVICE_LOCATION + endpoint, {
                    method: "POST",
                    headers: {
                        "Authorization": "Bearer " + user.token
                    },
                    body: formData
                    })
                    if (!response.ok) {
                        setError("Error uploading file.");
                        return;
                    }
                    var responseJson = await response.json();
                    var fileId = responseJson.fileId;
                    var data = { text: postText, thread: params.threadId, attachment: { name: file.name, id: fileId, fileType}};
                }
                else {
                    data = { text: postText, thread: params.threadId }
                }
            }
            else {
                data = { text: postText, thread: params.threadId }
            }
            const fetchResult = await fetch(import.meta.env.VITE_POST_SERVICE_LOCATION + "/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + user.token
                },
                body: JSON.stringify(data)
            });
            if (!fetchResult.ok) {
                setError("Error submitting post.");
                return;
            }
            setPostText("");
            setNewlyPosted(newlyPosted + 1);
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
            if (!fetchResult.ok) {
                setError("Error editing post.");
                return;
            }
            setPostText("");
            setEditing(false);
            setEditingId("");
            setNewlyPosted(newlyPosted + 1);
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

    async function addReaction(id, type) {
        const fetchResponse = await fetch(import.meta.env.VITE_POST_SERVICE_LOCATION + "/posts/" + id + "/reactions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + user.token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                type
            })
        });
        if (!fetchResponse.ok) {
            alert("Error submitting reaction, try again later.");
            console.log(await fetchResponse.json());
            return;
        }
        setNewlyPosted(newlyPosted + 1);
    }

    async function removeReaction(postId, reactionId) {
        const fetchResponse = await fetch(import.meta.env.VITE_POST_SERVICE_LOCATION + "/posts/" + postId + "/reactions/" + reactionId, {
            method: "DELETE",
            "headers": {
                "Authorization": "Bearer " + user.token
            }
        })
        if (!fetchResponse.ok) {
            alert("Error removing reaction, try again later.");
            console.log(await fetchResponse.json());
            return;
        }
        setNewlyPosted(newlyPosted + 1);
    }

    return (
        <>
            <div className="homethreadsnav">
                <h3>
                    {thread &&
                        <>
                            {thread.section.parent && <Link className="homelink" to={"/section/" + thread.section.parent}>...</Link>} /&nbsp;
                            <Link className="homelink" to={"/section/" + thread.section.id}>{thread.section.title}</Link> / {thread.title}
                        </>
                    }
                </h3>
            </div>
            <div id="threadtablediv">
                <table id="threadtable">
                    <thead>
                    </thead>
                    <tbody>
                        {posts && posts.map((post) => {
                            return <tr key={post._id}>
                                <td>
                                    <Link className="homelink bold" to={"/user/"+ post.postedBy} >
                                        {post.postedByName}
                                    </Link>
                                    <br />
                                    {formatDateFromDbString(post.postedOn)}
                                </td>
                                <td>
                                    <p className="posttextcss"> {post.text} </p>
                                    {post.attachment &&
                                    <>
                                        <p><a className="attachmentcss" target="_blank" href={import.meta.env.VITE_FILE_SERVICE_LOCATION + "/" + (post.attachment.fileType == "image" ? "images" : "text") + "/" + post.attachment.id}>{post.attachment.name}</a></p>
                                        <br />
                                    </>
                                    }
                                    <p className="likedislike">Likes: {post.likes} Dislikes: {post.dislikes} </p>
                                    {user && post.postedByName != user.username &&
                                    <>
                                       
                                        {!post.userLiked &&
                                            <button className="threadbutton" onClick={() => {
                                                addReaction(post._id, "like");
                                            }}>Like</button>
                                        }
                                        {!post.userDisliked &&
                                            <button className="threadbutton" onClick={() => {
                                                addReaction(post._id, "dislike");
                                            }}>Dislike</button>
                                        }
                                        {(post.userLiked || post.userDisliked) &&
                                            <button className="threadbutton" onClick={() => {
                                                removeReaction(post._id, post.userReactionId);
                                            }}>Unreact</button>
                                        }
                                    </>
                                    }
                                    
                                    {user && post.postedByName == user.username && 
                                    <>
                                      
                                        <button className="threadbutton" onClick={() => {
                                            setEditing(true);
                                            setEditingId(post._id);
                                            setPostText(post.text);
                                        }}>Edit</button>
                                        <button className="threadbutton" onClick={() => {
                                            deletePost(post._id);
                                        }}>Delete</button>
                                        
                                    </>
                                        
                                    }
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
            {user && <>
                <div id="threadcommentdiv">
                    <hr/>
                    <form action={postSubmitHandler}>
                        <textarea rows="5" cols="40" className="commenttextarea" name="text" id="text" placeholder="Your thoughts here..." value={postText} onChange={(e) => setPostText(e.target.value)}></textarea>
                        <br/> 
                        {!editing &&
                            <input type="file" name="file" id="file" accept="text/plain,image/jpg,image/jpeg,image/png" />
                        }
                        <br/> <br/>
                        <button id="commentbutton" type="submit">{editing ? "Edit" : "Post"}</button>
                        {editing && <button onClick={() => {
                            setEditing(false);
                            setEditingId("");
                            setPostText("");
                        }}>Cancel</button>}
                    </form>
                    <p>{error}</p>
                </div>
            </>}
        </>
    )
}

export default ThreadPage
