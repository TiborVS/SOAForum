from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from dotenv import load_dotenv
from os import environ

load_dotenv()

app = FastAPI()

MONGO_URI = environ.get("MONGO_URI", False)
if not MONGO_URI:
    raise ValueError("Environment variable MONGO_URI must be set.")
DB_NAME = "forum-thread-service"
client = AsyncIOMotorClient(MONGO_URI)
db = client[DB_NAME]
sections_collection = db["sections"]
threads_collection = db["threads"]

class Section(BaseModel):
    title: str
    createdBy: str
    createdAt: datetime = Field(default_factory=datetime.now)
    lastModified: datetime = Field(default_factory=datetime.now)
    parent: Optional[str] = None

    class Config:
        json_encoders = {
            ObjectId: str
        }

class Thread(BaseModel):
    title: str
    createdBy: str
    createdAt: datetime = Field(default_factory=datetime.now)
    lastModified: datetime = Field(default_factory=datetime.now)
    section: str

    class Config:
        json_encoders = {
            ObjectId: str
        }

async def get_subsections(parent_id: str):
    subsections_cursor = sections_collection.find({"parent": parent_id})
    subsections = []
    async for doc in subsections_cursor:
        doc["id"] = str(doc["_id"])
        subsections.append(doc)
    return subsections

@app.get("/sections/{id}")
async def get_section(id: str):
    section = await sections_collection.find_one({"_id": ObjectId(id)})
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")
    section["id"] = str(section["_id"])
    section["subsections"] = await get_subsections(id)
    return section

@app.get("/sections")
async def get_sections():
    sections_cursor = sections_collection.find()
    sections = []
    async for doc in sections_cursor:
        doc["id"] = str(doc["_id"])
        sections.append(doc)
    return sections

@app.post("/sections")
async def create_section(section: Section):
    section_dict = section.model_dump(exclude_unset=True, mode='json')
    result = await sections_collection.insert_one(section_dict)
    section_dict["id"] = str(result.inserted_id)
    del section_dict["_id"]
    return section_dict

@app.put("/sections/{id}")
async def update_section(id: str, section: Section):
    update_data = section.model_dump(exclude_unset=True)
    update_data["lastModified"] = datetime.now()
    result = await sections_collection.update_one({"_id": ObjectId(id)}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Section not found")
    return await get_section(id)

@app.delete("/sections/{id}")
async def delete_section(id: str):
    result = await sections_collection.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Section not found")
    return {"message": "Section deleted"}

@app.get("/threads")
async def get_threads():
    threads_cursor = threads_collection.find()
    threads = []
    async for doc in threads_cursor:
        doc["id"] = str(doc["_id"])
        threads.append(doc)
    return threads

@app.get("/threads/{id}")
async def get_thread(id: str):
    thread = await threads_collection.find_one({"_id": ObjectId(id)})
    if not thread:
        raise HTTPException(status_code=404, detail="Thread not found")
    thread["id"] = str(thread["_id"])
    return thread

@app.post("/threads")
async def create_thread(thread: Thread):
    thread_dict = thread.model_dump()
    result = await threads_collection.insert_one(thread_dict)
    thread_dict["id"] = str(result.inserted_id)
    return thread_dict

@app.put("/threads/{id}")
async def update_thread(id: str, thread: Thread):
    update_data = {k: v for k, v in thread.model_dump(exclude_unset=True).items()}
    update_data["lastModified"] = datetime.now()
    result = await threads_collection.update_one({"_id": ObjectId(id)}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Thread not found")
    return await get_thread(id)

@app.delete("/threads/{id}")
async def delete_thread(id: str):
    result = await threads_collection.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Thread not found")
    return {"message": "Thread deleted"}
