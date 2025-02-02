const express=require('express');
const app=express();
const cors=require('cors')
const { GoogleGenerativeAI } = require("@google/generative-ai");

const PORT=5000;
app.use(express.json())
app.use(cors());

const genAI = new GoogleGenerativeAI("");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
app.post('/scaninsight',async(req,res)=>{
    try{
        const prompt=req.body.prompt; 
        const  formattedPrompt = `
            the most important thing , dont forget it ,i want response from you only in json format ,i dont want any explanation or story
            you will be given nikto and nmap scan results of a website, your task is to analyze and give the result in the form of JSON:
            
            
            Target IP: (e.g., 216.198.79.193)
            Target Hostname: (e.g., twitter-quote-six.vercel.app)
            Target Port: (e.g., 443 - HTTPS)
            Server: (e.g., Vercel)
            Scan Start Time: (e.g., 2025-02-02 13:16:29)
            Scan End Time: (e.g., 2025-02-02 13:29:56)
            Scan Duration: (e.g., 807 seconds)
            Vulnerability Data :
            Found Errors:
            Vulnerability Severity:
            Critical -> High, Medium, or Low
            
            
            letss do on test 
            suppose i give you this data ,give the repose in the way i told
            the data is
            {
    
             "- Nikto v2.1.5\n---------------------------------------------------------------------------\n+ Target IP:          216.198.79.129\n+ Target Hostname:    expense-tracker-orcin-five.vercel.app\n+ Target Port:        443\n+ Start Time:         2025-02-02 16:47:16 (GMT5.5)\n---------------------------------------------------------------------------\n+ Server: Vercel\n+ The anti-clickjacking X-Frame-Options header is not present.\n+ Uncommon header 'refresh' found, with contents: 0;url=https://expense-tracker-orcin-five.vercel.app/\n+ Root page / redirects to: https://expense-tracker-orcin-five.vercel.app/\n",
               "Starting Nmap 7.94SVN ( https://nmap.org ) at 2025-02-02 16:47 IST\nNmap done: 0 IP addresses (0 hosts up) scanned in 0.05 seconds\n"
            
            }
            so for this the output should be like
            {
              "Target IP": "216.198.79.193",
              "Target Hostname": "twitter-quote-six.vercel.app",
              "Target Port": "443 - HTTPS",
              "Server": "Vercel",
              "Scan Start Time": "2025-02-02 13:16:29",
              "Scan End Time": "2025-02-02 13:29:56",
              "Scan Duration": "807 seconds",
              "Vulnerability Data ": {
                "Found Errors": [
                  "The anti-clickjacking X-Frame-Options header is not present.",
                  "Uncommon header 'refresh' found, with contents: 0;url=https://twitter-quote-six.vercel.app/"
                ],
                "Vulnerability Severity": {
                  "Critical": 0,
                  "High": 0,
                  "Medium": 2, 
                  "Low":0
            
                }
              }
            }
            
            now here is real data which you have look into
             ${prompt.nikto_result}${prompt.nmap_result}
            `;
        const result = await model.generateContent(formattedPrompt);
        const unparsedreaponse=result.response.text();
        const frontParse=unparsedreaponse.slice(7);
        const finalres=frontParse.slice(0,frontParse.length-4);

        console.log()
        await res.status(200).send(finalres);
    }catch(error){
        console.error(error);
    }
})


app.get('/',(req,res)=>{
    res.send('hello gemini');
})

app.listen(PORT,()=>{
    console.log("Gemini server is running on port",PORT);
})