from typing import Optional,List
from fastapi import FastAPI,BackgroundTasks
import socket
import time
import threading
from fastapi.responses import JSONResponse
from scapy.all import sniff,IP,TCP,UDP 
from pydantic import BaseModel
from collections import deque

app=FastAPI()
PORT = 8000
INTERFACE='wlp0s20f3'

class packetInfo(BaseModel):
    timestamp:float
    source_ip:Optional[str]=None
    dest_ip:Optional[str]=None
    source_host:Optional[str]=None
    dest_host:Optional[str]=None
    protocol:str
    length:int
    source_port:Optional[int]=None
    dest_port:Optional[int]=None

packet_buffer=deque(maxlen=1000)
capturing =False
capturing_thread=None

def process_packet(packet):
    packet_info={
        "timestamp":time.time(),
        "protocol":"OTHER",
        "length":len(packet),
    }
    if IP in packet:
        packet_info["source_ip"]=packet[IP].src
        packet_info["dest_ip"]=packet[IP].dst
    packet_buffer.append(packetInfo(**packet_info))    

def capture_packet():
    global capturing
    while capturing:
        try:
            sniff(iface=INTERFACE,prn=process_packet,store=0,count=1,filter='ip')
        except Exception as e:
            print(f"capture errror :{e}")
            break


@app.post("/capture/start")
async def start_capture():
    global capturing,capturing_thread

    if capturing:
        return JSONResponse(
            status_code=400,
            content={"message","Capture already running"}
        )
    capturing=True
    capturing_thread=threading.Thread(target=capture_packet)
    capturing_thread.start()
    return {"message": "Packet capture started"}


@app.get("/packets",response_model=List[packetInfo])
async def get_packets(limit:int =100):
    packet =list(packet_buffer)[-limit:]
    return packet





@app.get("/")
def hello():
    return{"message":"hello "}

if __name__=="__main__":
    import uvicorn
    uvicorn.run(app,host="0.0.0.0",port=PORT)






# # host_name = socket.gethostbyaddr("8.8.8.8")
# # # print(host_name)