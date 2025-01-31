from typing import Optional,List
from fastapi import FastAPI,BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import socket
import time
import threading
from fastapi.responses import JSONResponse
from scapy.all import sniff,IP,TCP,UDP 
from pydantic import BaseModel
from collections import deque
import subprocess
import logging

app=FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)
PORT = 8000
INTERFACE='wlp0s20f3'

logging.basicConfig(level=logging.INFO)
logger=logging.getLogger(__name__)

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
        packet_info["source_host"]=get_hostname(packet[IP].src)
        packet_info["dest_host"]=get_hostname(packet[IP].dst)
        if TCP in packet:
            packet_info["protocol"] = "TCP"
            packet_info["source_port"] = packet[TCP].sport
            packet_info["dest_port"] = packet[TCP].dport
        elif UDP in packet:
            packet_info["protocol"] = "UDP"
            packet_info["source_port"] = packet[UDP].sport
            packet_info["dest_port"] = packet[UDP].dport
    packet_buffer.append(packetInfo(**packet_info))    

def capture_packet():
    global capturing
    while capturing:
        try:
            sniff(iface=INTERFACE,prn=process_packet,store=0,count=1,filter='ip')
        except Exception as e:
            print(f"capture errror :{e}")
            break


def get_hostname(ip:str)->str:
    try:
        host_name,_,_=socket.gethostbyaddr(ip)
        return host_name
    except socket.herror:
        return None    


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

@app.post("/stop")
def stop_capturing():
    global capturing, capturing_thread

    if not capturing:
        return JSONResponse(
            status_code=400,
            content={"message":"No capture is running"}
        )
    capturing=False
    if capturing_thread:
        capturing_thread.join()
        capturing_thread=None
    return {"message": "Packet capture stopped"}    







#webscan services

def run_nikto(url:str):
    result=subprocess.run(["sudo","nikto","-h",url],capture_output=True,text=True)
    # print(result.stdout)
    logger.info(result.stdout)
    return result.stdout

def run_nmap(url:str):
    result=subprocess.run(['sudo','nmap','-p','80,443',url],capture_output=True,text=True)
    # print(result.stdout)
    logger.info(result.stdout)
    return(result.stdout)

# run_nmap('http://bounty-birbal-ruby.vercel.app')


# @app.post("/scan/")
# def scan(url:str,background_task:BackgroundTasks):
#     try:
#         background_task.add_task(run_nikto,url)
#         background_task.add_task(run_nmap,url)
#         return {"message": "Scans started in the background"}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error during scan: {e}")
        


@app.post("/scan/")
async def scan(url:str):
    try:
        
        nikto_result=run_nikto(url)
        nmap_result=run_nmap(url)
        return JSONResponse(content={
            "nikto_result": nikto_result,
            "nmap_result": nmap_result
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during scan: {e}")


@app.get("/")
def hello():
    return{"message":"hello "}

if __name__=="__main__":
    import uvicorn
    uvicorn.run(app,host="0.0.0.0",port=PORT)



# # host_name = socket.gethostbyaddr("8.8.8.8")
# # # print(host_name)
# Yes, when you use Yes, when you use the sniff() function with the prn=process_packet argument, Scapy automatically passes each captured packet to the process_packet function as an input.the sniff() function with the prn=process_packet argument, Scapy automatically passes each captured packet to the process_packet function as an input.



# import subprocess

# subprocess.run(['sudo', 'nmap', '-sn', '192.168.1.0/24'])


