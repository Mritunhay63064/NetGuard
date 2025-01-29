from typing import Optional
from fastapi import FastAPI,BackgroundTasks
import socket
import time
from fastapi.responses import JSONResponse
from scapy.all import sniff,IP,TCP,UDP
from pydantic import BaseModel
from collections import deque

app=FastAPI()
PORT = 8001

class packetInfo(BaseModel):
    timestamp:float
    source_ip:Optional[str]=None
    dest:Optional[str]=None
    source_host:Optional[str]=None
    dest_host:Optional[str]=None
    protocol:str
    length:int
    source_port:Optional[int]=None
    dest_port:Optional[int]=None



@app.get("/")
def hello():
    return{"hello":"world"}

if __name__=="__main__":
    import uvicorn
    uvicorn.run(app,host="0.0.0.0",port=PORT)
