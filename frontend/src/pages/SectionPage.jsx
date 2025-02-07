import { useEffect, useState } from "react"
import { Link, useParams } from "react-router";
import { formatDateFromDbString } from "../utils";


function SectionPage() {
    const [sections, setSections] = useState([]);
    const [threads, setThreads] = useState([]);
    const [sectionTitle, setSectionTitle] = useState("");
    const params = useParams();

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
                setSectionTitle(resultJson.title);
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
    }, [params]);
    
    return(
        <>
            <h3>{sectionTitle}</h3>
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Posted by</th>
                        <th>Posted on</th>
                    </tr>
                </thead>
                <tbody>
            {sections && sections.map((section) => {
                return <tr key={section.id}>
                    <td><Link to={"/section/" + section.id}>{section.title}</Link></td>
                    <td>{section.createdBy}</td>
                    <td>{formatDateFromDbString(section.createdAt)}</td>
                </tr>
            })}
                    <tr>
                        <td colSpan="3"><hr /></td>
                    </tr>
            {threads && threads.map((thread) => {
                return <tr key={thread.id}>
                    <td><Link to={"/thread/" + thread.id}>{thread.title}</Link></td>
                    <td>{thread.createdBy}</td>
                    <td>{formatDateFromDbString(thread.createdAt)}</td>
                </tr>
            })}
                </tbody>
            </table>
        </>
    )

}

export default SectionPage
