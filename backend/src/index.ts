import express from 'express';
import pcap from 'pcap';

const app=express();
const PORT=8000;
app.use(express.json());
app.get('/',()=>{
    console.log("Hello i am up")
})
const interfaceName='wlp0s20f3';
// const session=pcap.createSession(interfaceName);
try {
    const session = pcap.createSession(interfaceName,  { 
        filter: 'ip', 
        promiscuous: true, 
        buffer_size: 10 * 1024 * 1024 // 10 MB buffer
      });
    console.log('Packet capture started on interface:', interfaceName);
  } catch (error) {
    console.error('Failed to create packet capture session:', error);
  }
  
// console.log(session)
app.listen(PORT,()=>{
    console.log('Server is running on port',PORT);
})