"use strict";
// import express from 'express';
// import pcap from 'pcap';
// const app=express();
// const PORT=8000;
// app.use(express.json());
// app.get('/',()=>{
//     console.log("Hello i am up")
// })
// const interfaceName='wlp0s20f3';
// // const session=pcap.createSession(interfaceName);
// try {
//     const session = pcap.createSession(interfaceName);
//     console.log('Packet capture started on interface:', interfaceName);
//   } catch (error) {
//     console.error('Failed to create packet capture session:', error);
//   }
// // console.log(session)
// app.listen(PORT,()=>{
//     console.log('Server is running on port',PORT);
// })
var pcap = require('pcap'), tcp_tracker = new pcap.TCPTracker(), pcap_session = pcap.createSession('en0', { filter: "ip proto \\tcp" });
tcp_tracker.on('session', function (session) {
    console.log("Start of session between " + session.src_name + " and " + session.dst_name);
    session.on('end', function (session) {
        console.log("End of TCP session between " + session.src_name + " and " + session.dst_name);
    });
});
pcap_session.on('packet', function (raw_packet) {
    var packet = pcap.decode.packet(raw_packet);
    tcp_tracker.track_packet(packet);
});
