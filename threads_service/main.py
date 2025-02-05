from fastapi import FastAPI, HTTPException, Header
from pydantic import BaseModel, Field
from typing import Annotated
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from dotenv import load_dotenv
from os import environ
import requests
import uvicorn

load_dotenv()

app = FastAPI()

MONGO_URI = environ.get("MONGO_URI", False)
if not MONGO_URI:
    raise ValueError("Environment variable MONGO_URI must be set.")

USER_SERVICE_LOCATION = environ.get("USER_SERVICE_LOCATION", False)
if not USER_SERVICE_LOCATION:
    raise ValueError("Environment variable USER_SERVICE_LOCATION must be set.")

DB_NAME = "forum-thread-service"

client = AsyncIOMotorClient(MONGO_URI)
db = client[DB_NAME]

sections_collection = db["sections"]
threads_collection = db["threads"]

class Section(BaseModel):
    title: str
    parent: str | None = None

class Thread(BaseModel):
    title: str
    section: str

async def get_subsections(parent_id: str):
    subsections_cursor = sections_collection.find({"parent": ObjectId(parent_id)})
    subsections = []
    async for subsection in subsections_cursor:
        subsection["id"] = str(subsection["_id"])
        del subsection["_id"]
        subsection["createdBy"] = str(subsection["createdBy"])
        if subsection["parent"] is not None:
            subsection["parent"] = str(subsection["parent"])
        
        subsections.append(subsection)
    return subsections

@app.get("/sections/{id}")
async def get_section(id: str):
    section = await sections_collection.find_one({"_id": ObjectId(id)})
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")
    
    section["id"] = str(section["_id"])
    del section["_id"]
    section["createdBy"] = str(section["createdBy"])
    if section["parent"] is not None:
        section["parent"] = str(section["parent"])
    section["subsections"] = await get_subsections(id)

    return section

@app.get("/sections")
async def get_sections():
    sections_cursor = sections_collection.find()
    sections = []
    async for section in sections_cursor:
        section["id"] = str(section["_id"])
        del section["_id"]
        section["createdBy"] = str(section["createdBy"])
        if section["parent"] is not None:
            section["parent"] = str(section["parent"])

        sections.append(section)
    return sections

@app.post("/sections")
async def create_section(section: Section, authorization: Annotated[str, Header()]):
    response = requests.post(f"{USER_SERVICE_LOCATION}/users/authenticate", headers={"Authorization": authorization})
    if "error" in response.json():
        raise HTTPException(401, "You must be logged in to perform this action.")
    else:
        token = response.json()["token"]

        section_dict = section.model_dump()
        section_dict["createdBy"] = ObjectId(token["userId"])
        section_dict["createdAt"] = datetime.now()
        section_dict["lastModified"] = datetime.now()
        section_dict["parent"] = ObjectId(section_dict["parent"])

        db_result = await sections_collection.insert_one(section_dict)
        if db_result.acknowledged:
            return {"message": "Successfully created section.", "id": str(db_result.inserted_id)}
        else:
            raise HTTPException(status_code=500, detail="Unknown error creating section.")

@app.put("/sections/{id}")
async def update_section(id: str, update_section: Section, authorization: Annotated[str, Header()]):
    response = requests.post(f"{USER_SERVICE_LOCATION}/users/authenticate", headers={"Authorization": authorization})
    if "error" in response.json():
        raise HTTPException(401, "You must be logged in to perform this action.")
    else:
        token = response.json()["token"]

        section = await sections_collection.find_one({"_id": ObjectId(id)})
        if not section:
            raise HTTPException(status_code=404, detail="Section not found")
        
        if (str(section["createdBy"]) != token["userId"] and not token["isAdmin"]):
            raise HTTPException(status_code=401, detail="Not allowed to change this section.")
        
        update_data = update_section.model_dump()
        update_data["lastModified"] = datetime.now()
        result = await sections_collection.update_one({"_id": ObjectId(id)}, {"$set": update_data})
        if result.acknowledged:
            return {"message": "Successfully updated section."}
        else:
            raise HTTPException(status_code=500, detail="Unknown error updating section.")

@app.delete("/sections/{id}")
async def delete_section(id: str, authorization: Annotated[str, Header()]):
    response = requests.post(f"{USER_SERVICE_LOCATION}/users/authenticate", headers={"Authorization": authorization})
    if "error" in response.json():
        raise HTTPException(401, "You must be logged in to perform this action.")
    else:
        token = response.json()["token"]

        section = await sections_collection.find_one({"_id": ObjectId(id)})
        if not section:
            raise HTTPException(status_code=404, detail="Section not found")
        
        if (str(section["createdBy"]) != token["userId"] and not token["isAdmin"]):
            raise HTTPException(status_code=401, detail="Not allowed to delete this section.")

        result = await sections_collection.delete_one({"_id": ObjectId(id)})
        if result.acknowledged:
            return {"message": "Successfully deleted section."}
        else:
            raise HTTPException(status_code=500, detail="Unknown error deleting section.")

@app.get("/threads")
async def get_threads():
    threads_cursor = threads_collection.find()
    threads = []
    async for thread in threads_cursor:
        thread["id"] = str(thread["_id"])
        del thread["_id"]
        thread["createdBy"] = str(thread["createdBy"])
        thread["section"] = str(thread["section"])
        threads.append(thread)
    return threads

@app.get("/threads/{id}")
async def get_thread(id: str):
    thread = await threads_collection.find_one({"_id": ObjectId(id)})
    if not thread:
        raise HTTPException(status_code=404, detail="Thread not found.")
    
    thread["id"] = str(thread["_id"])
    del thread["_id"]
    thread["createdBy"] = str(thread["createdBy"])
    thread["section"] = str(thread["section"])

    return thread

@app.post("/threads")
async def create_thread(thread: Thread, authorization: Annotated[str, Header()]):
    response = requests.post(f"{USER_SERVICE_LOCATION}/users/authenticate", headers={"Authorization": authorization})
    if "error" in response.json():
        raise HTTPException(401, "You must be logged in to perform this action.")
    else:
        token = response.json()["token"]

        thread_dict = thread.model_dump()
        thread_dict["createdBy"] = ObjectId(token["userId"])
        thread_dict["createdAt"] = datetime.now()
        thread_dict["lastModified"] = datetime.now()
        thread_dict["section"] = ObjectId(thread_dict["section"])

        db_result = await threads_collection.insert_one(thread_dict)
        if db_result.acknowledged:
            return {"message": "Successfully created thread.", "id": str(db_result.inserted_id)}
        else:
            raise HTTPException(status_code=500, detail="Unknown error creating thread.")

@app.put("/threads/{id}")
async def update_thread(id: str, update_thread: Thread, authorization: Annotated[str, Header()]):
    response = requests.post(f"{USER_SERVICE_LOCATION}/users/authenticate", headers={"Authorization": authorization})
    if "error" in response.json():
        raise HTTPException(401, "You must be logged in to perform this action.")
    else:
        token = response.json()["token"]

        thread = await threads_collection.find_one({"_id": ObjectId(id)})
        if not thread:
            raise HTTPException(status_code=404, detail="Thread not found.")
        
        if (str(thread["createdBy"]) != token["userId"] and not token["isAdmin"]):
            raise HTTPException(status_code=401, detail="Not allowed to change this thread.")
        
        update_data = update_thread.model_dump()
        update_data["lastModified"] = datetime.now()
        result = await threads_collection.update_one({"_id": ObjectId(id)}, {"$set": update_data})
        if result.acknowledged:
            return {"message": "Successfully updated thread."}
        else:
            raise HTTPException(status_code=500, detail="Unknown error updating thread.")

@app.delete("/threads/{id}")
async def delete_thread(id: str, authorization: Annotated[str, Header()]):
    response = requests.post(f"{USER_SERVICE_LOCATION}/users/authenticate", headers={"Authorization": authorization})
    if "error" in response.json():
        raise HTTPException(401, "You must be logged in to perform this action.")
    else:
        token = response.json()["token"]

        thread = await threads_collection.find_one({"_id": ObjectId(id)})
        if not thread:
            raise HTTPException(status_code=404, detail="Thread not found.")
        
        if (str(thread["createdBy"]) != token["userId"] and not token["isAdmin"]):
            raise HTTPException(status_code=401, detail="Not allowed to delete this thread.")

        result = await threads_collection.delete_one({"_id": ObjectId(id)})
        if result.acknowledged:
            return {"message": "Successfully deleted thread."}
        else:
            raise HTTPException(status_code=500, detail="Unknown error deleting thread.")

if __name__ == "__main__":
    uvicorn.run(app, port=int(environ.get("PORT", 8000)))
