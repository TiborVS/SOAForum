from fastapi import FastAPI, HTTPException, Header, Body, Path
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Annotated, List
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from dotenv import load_dotenv
from os import environ
import requests
import uvicorn

load_dotenv()

app = FastAPI(
    title="SOA Threads Service",
    description="A service for managing sections and threads of Yet Another Forum.",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

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

class Message(BaseModel):
    message: str

class MessageWithId(Message):
    id: str

class SectionBase(BaseModel):
    title: str
    parent: str | None = None

class SectionIn(SectionBase):
    pass

class SectionOut(SectionBase):
    id: str
    createdBy: str
    createdAt: datetime
    lastModified: datetime

class SectionOutWithDetail(SectionOut):
    subsections: List[SectionOut]
    parent: SectionOut | None

class ThreadBase(BaseModel):
    title: str
    section: str

class ThreadIn(ThreadBase):
    pass

class ThreadOut(ThreadBase):
    id: str
    createdBy: str
    createdAt: datetime
    lastModified: datetime

class ThreadOutWithDetail(ThreadOut):
    section: SectionOut

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

@app.get("/sections/root", response_model=List[SectionOut], responses={
    200: {
        "description": "List of top-level sections",
        "content": {
            "application/json": {
                "example": [
                    {
                        "id": "67a229d8e4764d635de28c2b",
                        "title": "Videogames",
                        "createdBy": "67a229d8e4764d635de2ad62",
                        "createdAt": "2025-02-04T15:53:19.901000",
                        "lastModified": "2025-02-04T15:53:19.901000"
                    },
                    {
                        "id": "67a229d8e4764d635de28c2f",
                        "title": "Sports",
                        "createdBy": "67a229d8e4764d635de2ad62",
                        "createdAt": "2025-02-05T15:53:19.901000",
                        "lastModified": "2025-02-07T15:53:19.901000"
                    }
                ]
            }
        }
    },

}, tags=["sections"], name="Get top-level sections", description="Gets all top-level sections (sections without a parent).")
async def get_root_sections():
    sections_cursor = sections_collection.find({"parent": None})
    sections = []
    async for section in sections_cursor:
        section["id"] = str(section["_id"])
        del section["_id"]
        section["createdBy"] = str(section["createdBy"])
        del section["parent"]
        
        sections.append(jsonable_encoder(section))
    return sections

@app.get("/sections/{id}", response_model=SectionOutWithDetail, responses={
    200: {
        "description": "Section with populated subsections field",
        "content": {
            "application/json": {
                "examples": {
                    "top-level": {
                        "summary": "A top-level section with its subsections",
                        "value": {
                            "id": "67a229d8e4764d635de28c2b",
                            "title": "Videogames",
                            "createdBy": "67a229d8e4764d635de2ad62",
                            "createdAt": "2025-02-04T15:53:19.901000",
                            "lastModified": "2025-02-04T15:53:19.901000",
                            "subsections": [
                                {
                                    "id": "67a229d8e4764d635de288ba",
                                    "title": "Minecraft",
                                    "parent": "67a229d8e4764d635de28c2b",
                                    "createdBy": "67a229d8e4764d635de2ad62",
                                    "createdAt": "2025-02-04T15:53:19.901000",
                                    "lastModified": "2025-02-04T15:53:19.901000"
                                },
                                {
                                    "id": "67a607e1dea34c1e8504309b",
                                    "title": "Stellaris",
                                    "parent": "67a229d8e4764d635de28c2b",
                                    "createdBy": "67a229d8e4764d635de2ad62",
                                    "createdAt": "2025-02-04T15:53:19.901000",
                                    "lastModified": "2025-02-04T15:53:19.901000"
                                }
                            ]
                        }
                    },
                    "with-parent": {
                        "summary": "A nested section with its subsections and parent section",
                        "value": {
                            "id": "67a229d8e4764d635de288ba",
                            "title": "Minecraft",
                            "createdBy": "67a229d8e4764d635de2ad62",
                            "createdAt": "2025-02-04T15:53:19.901000",
                            "lastModified": "2025-02-04T15:53:19.901000",
                            "parent": {
                                "id": "67a229d8e4764d635de28c2b",
                                "title": "Videogames",
                                "parent": "67a229d8e4764d635de28c1f",
                                "createdBy": "67a229d8e4764d635de2ad62",
                                "createdAt": "2025-02-04T15:53:19.901000",
                                "lastModified": "2025-02-04T15:53:19.901000"
                            },
                            "subsections": [
                                {
                                    "id": "67a229d8e4764d635de288ba",
                                    "title": "Modding",
                                    "parent": "67a229d8e4764d635de28c2b",
                                    "createdBy": "67a229d8e4764d635de2ad62",
                                    "createdAt": "2025-02-04T15:53:19.901000",
                                    "lastModified": "2025-02-04T15:53:19.901000"
                                },
                                {
                                    "id": "67a607e1dea34c1e8504309b",
                                    "title": "Multiplayer",
                                    "parent": "67a229d8e4764d635de28c2b",
                                    "createdBy": "67a229d8e4764d635de2ad62",
                                    "createdAt": "2025-02-04T15:53:19.901000",
                                    "lastModified": "2025-02-04T15:53:19.901000"
                                }
                            ]
                        }
                    }
                }
            }
        }
    },
    404: {
        "description": "Section with given ID was not found",
        "model": Message
    },
    500: {}
}, tags=["sections"], description="Gets section by ID, populating its subsections field with all sections who have this section as their parent.")
async def get_section_by_id(
    id: Annotated[
        str,
        Path(
            description="ID of the section to get."
        )
        ]
    ):
    section = await sections_collection.find_one({"_id": ObjectId(id)})
    if not section:
        return JSONResponse(status_code=404, content={"message": "Section not found"})
    
    if section["parent"] is not None:
        parent_section = await sections_collection.find_one({"_id": section["parent"]})
        parent_section["id"] = str(parent_section["_id"])
        del parent_section["_id"]
        parent_section["createdBy"] = str(parent_section["createdBy"])
        if parent_section["parent"] is not None:
            parent_section["parent"] = str(parent_section["parent"])
    
    section["id"] = str(section["_id"])
    del section["_id"]
    section["createdBy"] = str(section["createdBy"])
    if section["parent"] is not None:
        section["parent"] = parent_section
    section["subsections"] = await get_subsections(id)

    return section

@app.get("/sections", response_model=List[SectionOut], responses={
    200: {
        "description": "List of all sections",
        "content": {
            "application/json": {
                "example": [
                    {
                        "id": "67a229d8e4764d635de28c2b",
                        "title": "Videogames",
                        "createdBy": "67a229d8e4764d635de2ad62",
                        "createdAt": "2025-02-04T15:53:19.901000",
                        "lastModified": "2025-02-04T15:53:19.901000"
                    },
                    {
                        "id": "67a229d8e4764d635de28c2f",
                        "title": "Sports",
                        "createdBy": "67a229d8e4764d635de2ad62",
                        "createdAt": "2025-02-05T15:53:19.901000",
                        "lastModified": "2025-02-07T15:53:19.901000"
                    },
                    {
                        "id": "67a229d8e4764d635de28c3d",
                        "title": "Football",
                        "parent": "67a229d8e4764d635de28c2f",
                        "createdBy": "67a229d8e4764d635de2ad62",
                        "createdAt": "2025-02-05T15:53:19.901000",
                        "lastModified": "2025-02-07T15:53:19.901000"
                    }
                ]
            }
        }
    },
    500: {}
}, tags=["sections"], name="Get all sections", description="Gets all sections.")
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

@app.post("/sections", response_model=MessageWithId, status_code=201, responses={
    201: {
        "description": "Confirmation with ID of created section",
        "content": {
            "application/json": {
                "example": {
                    "message": "Successfully created section.",
                    "id": "67a229dfe4764d635de28c2c"
                }
            }
        }
    },
    401: {
        "model": Message,
        "description": "Not authorized to create new section."
    },
    500: {
        "model": Message,
        "description": "Unknown error creating section."
    }
}, tags=["sections"], description="Creates a new section.")
async def create_section(
    section: Annotated[
        SectionIn,
        Body(
            openapi_examples={
                "top-level": {
                    "summary": "A top-level section",
                    "description": "A section at the top level, without a parent section",
                    "value": {
                        "title": "Travel"
                    }
                },
                "subsection": {
                    "summary": "A subsection",
                    "description": "A subsection of an existing section, identified by its ID",
                    "value": {
                        "title": "Travel in Europe",
                        "parent": "67a229dfe4764d635de28c2c"
                    }
                }
            }
        )
    ],
    authorization: Annotated[
        str,
        Header(
            description="A JWT token sent using the Bearer schema",
            openapi_examples={
                "example": {
                    "summary": "JWT token",
                    "description": "A JWT token sent using the Bearer schema",
                    "value": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.IWvkxodTX0kCUbSXguAwSxBlQ-AxTdq2xnweEdfUbgo"
                }
            }
        )
    ]):
    response = requests.post(f"{USER_SERVICE_LOCATION}/users/authenticate", headers={"Authorization": authorization})
    if "error" in response.json():
        return JSONResponse(status_code=401, content={"message": "You must be logged in to perform this action."})
    else:
        token = response.json()["token"]

        section_dict = section.model_dump()
        section_dict["createdBy"] = ObjectId(token["userId"])
        section_dict["createdAt"] = datetime.now()
        section_dict["lastModified"] = datetime.now()
        if section_dict["parent"]:
            section_dict["parent"] = ObjectId(section_dict["parent"])

        db_result = await sections_collection.insert_one(section_dict)
        if db_result.acknowledged:
            return JSONResponse(status_code=201, content={"message": "Successfully created section.", "id": str(db_result.inserted_id)})
        else:
            return JSONResponse(status_code=500, content={"message": "Unknown error creating section."})

@app.put("/sections/{id}", response_model=Message, responses={
    200: {
        "description": "Confirmation of section update",
        "content": {
            "application/json": {
                "example": {
                    "message": "Successfully updated section."
                }
            }
        }
    },
    401: {
        "model": Message,
        "description": "Not authorized to update section"
    },
    404: {
        "model": Message,
        "description": "Section not found"
    },
    500: {
        "model": Message,
        "description": "Unknown error updating section"
    }
}, tags=["sections"], description="Updates a section by ID, changing its data to the request body.")
async def update_section(
    id: Annotated[
        str,
        Path(
            description="ID of the section to edit."
        )
    ],
    update_section: Annotated[
        SectionIn,
        Body(
            openapi_examples={
                "update": {
                    "summary": "Update section data",
                    "description": "Update the section, changing its title, moving it, or both.",
                    "value": {
                        "title": "New title",
                        "parent": "67a229dfe4764d635de28c2c"
                    }
                },
                "update_top-level": {
                    "summary": "Update section and make top-level",
                    "description": "Update the section, changing its title and making it top-level.",
                    "value": {
                        "title": "New title"
                    }
                }
            }
        )
    ], 
    authorization: Annotated[
        str,
        Header(
            description="A JWT token sent using the Bearer schema",
            openapi_examples={
                "example": {
                    "summary": "JWT token",
                    "description": "A JWT token sent using the Bearer schema",
                    "value": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.IWvkxodTX0kCUbSXguAwSxBlQ-AxTdq2xnweEdfUbgo"
                }
            }
        )
    ]):
    response = requests.post(f"{USER_SERVICE_LOCATION}/users/authenticate", headers={"Authorization": authorization})
    if "error" in response.json():
        return JSONResponse(status_code=401, content={"message": "You must be logged in to perform this action."})
    else:
        token = response.json()["token"]

        section = await sections_collection.find_one({"_id": ObjectId(id)})
        if not section:
            return JSONResponse(status_code=404, content={"message": "Section not found"})
        
        if (str(section["createdBy"]) != token["userId"] and not token["isAdmin"]):
            return JSONResponse(status_code=401, content={"message": "Not allowed to change this section."})
        
        update_data = update_section.model_dump()
        update_data["lastModified"] = datetime.now()
        if update_data["parent"] is not None:
            update_data["parent"] = ObjectId(update_data["parent"])
        result = await sections_collection.update_one({"_id": ObjectId(id)}, {"$set": update_data})
        if result.acknowledged:
            return JSONResponse(status_code=200, content={"message": "Successfully updated section."})
        else:
            return JSONResponse(status_code=500, content={"message": "Unknown error updating section."})

@app.delete("/sections/{id}", response_model=Message, responses={
    200: {
        "description": "Confirmation of section deletion",
        "content": {
            "application/json": {
                "example": {
                    "message": "Successfully deleted section."
                }
            }
        }
    },
    401: {
        "model": Message,
        "description": "Not authorized to delete section"
    },
    404: {
        "model": Message,
        "description": "Section not found"
    },
    500: {
        "model": Message,
        "description": "Unknown error deleting section"
    }
}, tags=["sections"], description="Deletes a section by ID.")
async def delete_section(
    id: Annotated[
        str,
        Path(
            description="ID of the section to delete."
        )
    ], 
    authorization: Annotated[
        str, Header(
            description="A JWT token sent using the Bearer schema",
            openapi_examples={
                "example": {
                    "summary": "JWT token",
                    "description": "A JWT token sent using the Bearer schema",
                    "value": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.IWvkxodTX0kCUbSXguAwSxBlQ-AxTdq2xnweEdfUbgo"
                }
            }
        )
    ]):
    response = requests.post(f"{USER_SERVICE_LOCATION}/users/authenticate", headers={"Authorization": authorization})
    if "error" in response.json():
        return JSONResponse(status_code=401, content={"message": "You must be logged in to perform this action."})
    else:
        token = response.json()["token"]

        section = await sections_collection.find_one({"_id": ObjectId(id)})
        if not section:
            return JSONResponse(status_code=404, content={"message": "Section not found."})
        
        if (str(section["createdBy"]) != token["userId"] and not token["isAdmin"]):
            return JSONResponse(status_code=401, content={"message": "Not allowed to delete this section."})

        result = await sections_collection.delete_one({"_id": ObjectId(id)})
        if result.acknowledged:
            return JSONResponse(status_code=200, content={"message": "Successfully deleted section."})
        else:
            return JSONResponse(status_code=500, content={"message": "Unknown error deleting section."})

@app.get("/threads", response_model=List[ThreadOut], responses={
    200: {
        "description": "List of all threads",
        "content": {
            "application/json": {
                "example": [
                    {
                        "id": "67a229d8e4764d635de28c2b",
                        "title": "Thoughts on the new update?",
                        "section": "67a229d8e4764d635de28c2f",
                        "createdBy": "67a229d8e4764d635de2ad62",
                        "createdAt": "2025-02-04T15:53:19.901000",
                        "lastModified": "2025-02-04T15:53:19.901000"
                    },
                    {
                        "id": "67a229d8e4764d635de28c2b",
                        "title": "My trip to France",
                        "section": "67a229d8e4764d635de28c2f",
                        "createdBy": "67a229d8e4764d635de2ad62",
                        "createdAt": "2025-02-04T15:53:19.901000",
                        "lastModified": "2025-02-04T15:53:19.901000"
                    },
                    {
                        "id": "67a229d8e4764d635de28c2b",
                        "title": "Some quotes I found interesting :)",
                        "section": "67a229d8e4764d635de28c2f",
                        "createdBy": "67a229d8e4764d635de2ad62",
                        "createdAt": "2025-02-04T15:53:19.901000",
                        "lastModified": "2025-02-04T15:53:19.901000"
                    }
                ]
            }
        }
    },
    500: {}
}, tags=["threads"], name="Get all threads", description="Gets all threads.")
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

@app.get("/threads/{id}", response_model=ThreadOutWithDetail, responses={
    200: {
        "description": "Thread with populated section field",
        "content": {
            "application/json": {
                "example": {
                    "id": "67a229d8e4764d635de28c2b",
                    "title": "Thoughts on the new update?",
                    "createdBy": "67a229d8e4764d635de2ad62",
                    "createdAt": "2025-02-04T15:53:19.901000",
                    "lastModified": "2025-02-04T15:53:19.901000",
                    "section": {
                        "id": "67a229d8e4764d635de28c2b",
                        "title": "Minecraft",
                        "createdBy": "67a229d8e4764d635de2ad62",
                        "createdAt": "2025-02-04T15:53:19.901000",
                        "lastModified": "2025-02-04T15:53:19.901000"
                    }
                }    
            }
        }
    },
    404: {
        "description": "Thread with given ID was not found",
        "model": Message
    },
    500: {}
}, tags=["threads"], description="Gets thread by ID.")
async def get_thread_by_id(
    id: Annotated[
        str,
        Path(
            description="ID of the thread to get."
        )
    ]
    ):
    thread = await threads_collection.find_one({"_id": ObjectId(id)})
    if not thread:
        return JSONResponse(status_code=404, content={"message": "Thread not found."})
    
    section = await sections_collection.find_one({"_id": thread["section"]})

    thread["id"] = str(thread["_id"])
    del thread["_id"]
    thread["createdBy"] = str(thread["createdBy"])

    section["id"] = str(section["_id"])
    del section["_id"]
    section["createdBy"] = str(section["createdBy"])
    if section["parent"] is not None:
        section["parent"] = str(section["parent"])

    thread["section"] = section

    return thread

@app.get("/threads/section/{id}", response_model=List[ThreadOut], responses={
    200: {
        "description": "List of threads from given section",
        "content": {
            "application/json": {
                "examples": {
                    "thread-list": {
                        "summary": "A list of threads",
                        "value": [
                            {
                                "id": "67a229d8e4764d635de28c2b",
                                "title": "Thoughts on the new update?",
                                "section": "67a229d8e4764d635de28c2f",
                                "createdBy": "67a229d8e4764d635de2ad62",
                                "createdAt": "2025-02-04T15:53:19.901000",
                                "lastModified": "2025-02-04T15:53:19.901000"
                            },
                            {
                                "id": "67a229d8e4764d635de28c2b",
                                "title": "My trip to France",
                                "section": "67a229d8e4764d635de28c2f",
                                "createdBy": "67a229d8e4764d635de2ad62",
                                "createdAt": "2025-02-04T15:53:19.901000",
                                "lastModified": "2025-02-04T15:53:19.901000"
                            },
                            {
                                "id": "67a229d8e4764d635de28c2b",
                                "title": "Some quotes I found interesting :)",
                                "section": "67a229d8e4764d635de28c2f",
                                "createdBy": "67a229d8e4764d635de2ad62",
                                "createdAt": "2025-02-04T15:53:19.901000",
                                "lastModified": "2025-02-04T15:53:19.901000"
                            }
                        ]
                    },
                    "empty-list": {
                        "summary": "An empty list",
                        "value": []
                    }
                }
            }
        }
    },
    500: {}
}, tags=["threads"], description="Gets threads from the section with the given ID.")
async def get_threads_from_section(
    id: Annotated[
        str,
        Path(
            description="ID of the section to get threads from."
        )
    ]
):
    threads_cursor = threads_collection.find({"section": ObjectId(id)})
    threads = []
    async for thread in threads_cursor:
        thread["id"] = str(thread["_id"])
        del thread["_id"]
        thread["createdBy"] = str(thread["createdBy"])
        thread["section"] = str(thread["section"])
        threads.append(thread)
    return threads

@app.post("/threads", response_model=MessageWithId, status_code=201, responses={
    201: {
        "description": "Confirmation with ID of created thread",
        "content": {
            "application/json": {
                "example": {
                    "message": "Successfully created thread.",
                    "id": "67a229dfe4764d635de28c2c"
                }
            }
        }
    },
    401: {
        "model": Message,
        "description": "Not authorized to create new thread."
    },
    500: {
        "model": Message,
        "description": "Unknown error creating thread."
    }
}, tags=["threads"], description="Creates a new thread.")
async def create_thread(
    thread: Annotated[
        ThreadIn,
        Body(
            openapi_examples={
                "thread": {
                    "summary": "Thread",
                    "description": "A new thread",
                    "value": {
                        "title": "My trip to Ljubljana",
                        "section": "67a229dfe4764d635de28c2c"
                    }
                }
            }
        )
    ],
    authorization: Annotated[
        str,
        Header(
            description="A JWT token sent using the Bearer schema",
            openapi_examples={
                "example": {
                    "summary": "JWT token",
                    "description": "A JWT token sent using the Bearer schema",
                    "value": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.IWvkxodTX0kCUbSXguAwSxBlQ-AxTdq2xnweEdfUbgo"
                }
            }
        )
    ]
    ):
    response = requests.post(f"{USER_SERVICE_LOCATION}/users/authenticate", headers={"Authorization": authorization})
    if "error" in response.json():
        return JSONResponse(status_code=401, content={"message": "You must be logged in to perform this action."})
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
            return JSONResponse(status_code=500, content={"message": "Unknown error creating thread."})

@app.put("/threads/{id}", response_model=Message, responses={
    200: {
        "description": "Confirmation of thread update",
        "content": {
            "application/json": {
                "example": {
                    "message": "Successfully updated thread."
                }
            }
        }
    },
    401: {
        "model": Message,
        "description": "Not authorized to update thread"
    },
    404: {
        "model": Message,
        "description": "Thread not found"
    },
    500: {
        "model": Message,
        "description": "Unknown error updating thread"
    }
}, tags=["threads"], description="Updates a thread by ID, changing its data to the request body.")
async def update_thread(
    id: Annotated[
        str,
        Path(
            description="ID of the thread to update."
        )
    ], 
    update_thread: Annotated[
        ThreadIn,
        Body(
            openapi_examples={
                "update": {
                    "summary": "Update thread data",
                    "description": "Update the thread's title, section, or both.",
                    "value": {
                        "title": "New title",
                        "section": "67a229dfe4764d635de28c2c"
                    }
                }
            }
        )
    ], 
    authorization: Annotated[
        str,
        Header(
            description="A JWT token sent using the Bearer schema",
            openapi_examples={
                "example": {
                    "summary": "JWT token",
                    "description": "A JWT token sent using the Bearer schema",
                    "value": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.IWvkxodTX0kCUbSXguAwSxBlQ-AxTdq2xnweEdfUbgo"
                }
            }
        )
    ]):
    response = requests.post(f"{USER_SERVICE_LOCATION}/users/authenticate", headers={"Authorization": authorization})
    if "error" in response.json():
        return JSONResponse(status_code=401, content={"message": "You must be logged in to perform this action."})
    else:
        token = response.json()["token"]

        thread = await threads_collection.find_one({"_id": ObjectId(id)})
        if not thread:
            return JSONResponse(status_code=404, content={"message": "Thread not found."})
        
        if (str(thread["createdBy"]) != token["userId"] and not token["isAdmin"]):
            return JSONResponse(status_code=401, content={"message": "Not allowed to change this thread."})
        
        update_data = update_thread.model_dump()
        update_data["lastModified"] = datetime.now()
        update_data["section"] = ObjectId(update_data["section"])
        result = await threads_collection.update_one({"_id": ObjectId(id)}, {"$set": update_data})
        if result.acknowledged:
            return {"message": "Successfully updated thread."}
        else:
            return JSONResponse(status_code=500, content={"message": "Unknown error updating thread."})

@app.delete("/threads/{id}", response_model=Message, responses={
    200: {
        "description": "Confirmation of thread deletion",
        "content": {
            "application/json": {
                "example": {
                    "message": "Successfully deleted thread."
                }
            }
        }
    },
    401: {
        "model": Message,
        "description": "Not authorized to delete thread"
    },
    404: {
        "model": Message,
        "description": "Thread not found"
    },
    500: {
        "model": Message,
        "description": "Unknown error deleting thread"
    }
}, tags=["threads"], description="Deletes a thread by ID")
async def delete_thread(
    id: Annotated[
        str,
        Path(
            description="ID of the thread to delete."
        )
    ], 
    authorization: Annotated[
        str, 
        Header(
            description="A JWT token sent using the Bearer schema",
            openapi_examples={
                "example": {
                    "summary": "JWT token",
                    "description": "A JWT token sent using the Bearer schema",
                    "value": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.IWvkxodTX0kCUbSXguAwSxBlQ-AxTdq2xnweEdfUbgo"
                }
            }
        )
    ]):
    response = requests.post(f"{USER_SERVICE_LOCATION}/users/authenticate", headers={"Authorization": authorization})
    if "error" in response.json():
        return JSONResponse(status_code=401, content={"message": "You must be logged in to perform this action."})
    else:
        token = response.json()["token"]

        thread = await threads_collection.find_one({"_id": ObjectId(id)})
        if not thread:
            return JSONResponse(status_code=404, content={"message": "Thread not found."})
        
        if (str(thread["createdBy"]) != token["userId"] and not token["isAdmin"]):
            return JSONResponse(status_code=401, content={"message": "Not allowed to delete this thread."})

        result = await threads_collection.delete_one({"_id": ObjectId(id)})
        if result.acknowledged:
            return {"message": "Successfully deleted thread."}
        else:
            return JSONResponse(status_code=500, content={"message": "Unknown error deleting thread."})

if __name__ == "__main__":
    uvicorn.run(app, port=int(environ.get("PORT", 8000)))
