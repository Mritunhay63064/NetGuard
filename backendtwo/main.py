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


def process_packet(packet):
    packet_info={
        "timestamp":time.time(),
        "protocol":"OTHER",
        "length":len(packet),
    }
    if IP in packet:
        packet_info["source_ip"]=packet[IP].src
        packet_info["dest_ip"]=packet[IP].dest
    packet_buffer.append(packetInfo(**packet_info))    

def capture_packet():
    global capturing
    while capturing:
        try:
            sniff(iface=INTERFACE,prn=process_packet,store=0,count=1,filter='ip')
        except Exception as e:
            print(f"capture errror :{e}")
            break



@app.get("/")
def hello():
    return{"message":"hello "}

if __name__=="__main__":
    import uvicorn
    uvicorn.run(app,host="0.0.0.0",port=PORT)






# host_name = socket.gethostbyaddr("8.8.8.8")
# print(host_name)
