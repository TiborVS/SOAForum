import { useContext, useEffect, useState } from "react"
import { Link, useParams } from "react-router";
import { formatDateFromDbString } from "../utils";
import { UserContext } from "../Contexts";


function SectionPage() {
    const [sections, setSections] = useState([]);
    const [threads, setThreads] = useState([]);
    const [currentSection, setCurrentSection] = useState("");

    const [formError, setFormError] = useState("");
    const [titleInput, setTitleInput] = useState("");
    const [formType, setFormType] = useState("");
    const [editing, setEditing] = useState(false);
    const [editingId, setEditingId] = useState("");

    const [newlyPosted, setNewlyPosted] = useState(0);

    const params = useParams();
    const { user, setUser } = useContext(UserContext);

    useEffect(() => {
        const fetchData = async () => {
            if (params.sectionId) {
                // looking at a specific section (render both subsections and threads in section)
                var fetchResult = await fetch(import.meta.env.VITE_THREAD_SERVICE_LOCATION + "/sections/" + params.sectionId);
                var resultJson = await fetchResult.json();
                for (const section of resultJson.subsections) {
                    const fetchResult = await fetch(import.meta.env.VITE_USER_SERVICE_LOCATION + "/users/" + section.createdBy + "/username");
                    const resultJson = await fetchResult.json();
                    section.createdBy = resultJson.username;
                }
                setCurrentSection(resultJson);
                setSections(resultJson.subsections);
                fetchResult = await fetch(import.meta.env.VITE_THREAD_SERVICE_LOCATION + "/threads/section/" + params.sectionId);
                resultJson = await fetchResult.json();
                for (const thread of resultJson) {
                    const fetchResult = await fetch(import.meta.env.VITE_USER_SERVICE_LOCATION + "/users/" + thread.createdBy + "/username");
                    const resultJson = await fetchResult.json();
                    thread.createdBy = resultJson.username;
                }
                setThreads(resultJson);
            }
            else {
                // looking at "root" section, render only top-level sections and no threads
                const fetchResult = await fetch(import.meta.env.VITE_THREAD_SERVICE_LOCATION + "/sections/root");
                const resultJson = await fetchResult.json();
                for (const section of resultJson) {
                    const fetchResult = await fetch(import.meta.env.VITE_USER_SERVICE_LOCATION + "/users/" + section.createdBy + "/username");
                    const resultJson = await fetchResult.json();
                    section.createdBy = resultJson.username;
                }
                setSections(resultJson);
            }
        }
        fetchData();
    }, [params, newlyPosted]);
    
    async function formHandler(event, type) {
        event.preventDefault();
        setFormError("");
        if (titleInput.trim().length < 1) {
            setFormError("Title cannot be empty!");
            return;
        }
        var fetchUrl = "";
        var data = {};
        var method = "";
        var errorMsg = "";
        if (type == "thread") {
            fetchUrl = import.meta.env.VITE_THREAD_SERVICE_LOCATION + "/threads/";
            data = { title: titleInput, section: currentSection.id}
            if (editing) {
                fetchUrl += editingId;
                method = "PUT";
                errorMsg = "Error editing thread.";
            }
            else {
                method = "POST";
                errorMsg = "Error creating thread.";
            }
        }
        else if (type == "section") {
            fetchUrl = import.meta.env.VITE_THREAD_SERVICE_LOCATION + "/sections/";
            data = { title: titleInput, parent: (params.sectionId ? currentSection.id : null)}
            if (editing) {
                fetchUrl += editingId;
                method = "PUT";
                errorMsg = "Error editing section.";
            }
            else {
                method = "POST";
                errorMsg = "Error creating section.";
            }
        }
        
        const fetchResult = await fetch(fetchUrl, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + user.token
            },
            body: JSON.stringify(data)
        });
        if (!fetchResult.ok) setFormError(errorMsg);
        else {
            setTitleInput("");
            setNewlyPosted(newlyPosted + 1);
            setEditing(false);
        }
    }

    async function editHandler(type, obj) {
        setFormType(type);
        setEditing(true);
        setEditingId(obj.id);
        setTitleInput(obj.title);
    }

    async function deleteHandler(type, obj) {
        var fetchUrl = import.meta.env.VITE_THREAD_SERVICE_LOCATION + (type == "section" ? "/sections/" : "/threads/");
        fetchUrl += obj.id;
        const fetchResult = await fetch(fetchUrl, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + user.token
            }
        });
        if (!fetchResult.ok) setFormError("Error deleting " + type + ".");
        else {
            setNewlyPosted(newlyPosted + 1);
        }
    }

    return(
        <>
        <div className="homethreadsnav">
                <h3>{(currentSection && currentSection.parent) &&
                    <>
                        {currentSection.parent.parent && <Link className="homelink" to={"/section/" + currentSection.parent.parent}>...</Link>} /&nbsp;
                        <Link className="homelink" to={"/section/" + currentSection.parent.id}>{currentSection.parent.title}</Link> / {currentSection.title}
                    </>
                }</h3>
                <h3>{(currentSection && !currentSection.parent) &&
                    <>
                        <Link className="homelink" to={"/"}>Home</Link> /&nbsp;
                        {currentSection.title}
                    </>
                    
                }</h3>
            </div>
            <div id="hometablediv">
                <table id="hometable">
                    <thead>
                        <tr>
                            <th className="hometableheader">Section</th>
                            <th className="hometableheader">Created by</th>
                            <th className="hometableheader">Created on</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                {sections && sections.map((section) => {
                    return <tr key={section.id}>
                        <td className="homethreadname"><Link className="threadnamelink" to={"/section/" + section.id}>{section.title}</Link></td>
                        <td>{section.createdBy}</td>
                        <td>{formatDateFromDbString(section.createdAt)}</td>
                        <td>
                            {user && section.createdBy == user.username &&
                                <>
                                    <button onClick={(e) => {editHandler("section", section)}}>Edit</button>
                                    <button onClick={(e) => {deleteHandler("section", section)}}>Delete</button>
                                </>
                            }
                        </td>
                    </tr>
                })}
                        <tr>
                            <td colSpan="4"><hr /></td>
                        </tr>
                        {threads.length > 0 &&
                        <tr>
                            <th className="hometableheader">Thread</th>
                            <th className="hometableheader">Posted by</th>
                            <th className="hometableheader">Posted on</th>
                            <th></th>
                        </tr>
                        }
                {threads && threads.map((thread) => {
                    return <tr key={thread.id}>
                        <td className="homethreadname"><Link className="threadnamelink" to={"/thread/" + thread.id}>{thread.title}</Link></td>
                        <td className="homepostedby">{thread.createdBy}</td>
                        <td>{formatDateFromDbString(thread.createdAt)}</td>
                        <td>
                            {user && thread.createdBy == user.username &&
                                <>
                                    <button onClick={(e) => {editHandler("thread", thread)}}>Edit</button>
                                    <button onClick={(e) => {deleteHandler("thread", thread)}}>Delete</button>
                                </>
                            }
                        </td>
                    </tr>
                })}
                    </tbody>
                </table>
            </div>
            {user &&
                <div id="homebottomsection">
                    <form id="homecreatesection">
                        <label className="hometitlelabel" htmlFor="title">Title</label><br />
                        <input className="hometitleinput" type="text" name="title" id="title" value={titleInput} onChange={(e) => setTitleInput(e.target.value)}/><br />
                        {!editing &&
                            <>
                                <button className="buttoncreatesection" onClick={(e) => {
                                    formHandler(e, "section");
                                }}>
                                    Create section
                                </button>
                                {params.sectionId &&
                                    <button className="buttoncreatethread" onClick={(e) => {
                                        formHandler(e, "thread");
                                    }}>
                                        Create thread
                                    </button>
                                }
                            </>
                        }
                        {editing &&
                            <button onClick={(e) => {
                                formHandler(e, formType);
                            }}>
                                Edit {formType}
                            </button>
                        }
                        <p>{formError}</p>
                    </form>
                </div>
            }
        </>
    )

}

export default SectionPage
