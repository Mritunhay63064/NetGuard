const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const prompt = `
you will be given nikto and nmap scan results of a website, your task is to analyze and give the result in the form of JSON:


Target IP: (e.g., 216.198.79.193)
Target Hostname: (e.g., twitter-quote-six.vercel.app)
Target Port: (e.g., 443 - HTTPS)
Server: (e.g., Vercel)
Scan Start Time: (e.g., 2025-02-02 13:16:29)
Scan End Time: (e.g., 2025-02-02 13:29:56)
Scan Duration: (e.g., 807 seconds)
Vulnerability Data (Errors & Severity):
Found Errors:
Vulnerability Severity:
Critical -> High, Medium, or Low


letss do on test 
suppose i give you this data ,give the repose in the way i told
the data is
INFO:__main__:- Nikto v2.1.5
---------------------------------------------------------------------------
+ Target IP:          216.198.79.193
+ Target Hostname:    twitter-quote-six.vercel.app
+ Target Port:        443
+ Start Time:         2025-02-02 13:16:29 (GMT5.5)
---------------------------------------------------------------------------
+ Server: Vercel
+ The anti-clickjacking X-Frame-Options header is not present.
+ Uncommon header 'refresh' found, with contents: 0;url=https://twitter-quote-six.vercel.app/
+ Root page / redirects to: https://twitter-quote-six.vercel.app/
+ No CGI Directories found (use '-C all' to force check all possible dirs)
+ 6544 items checked: 15 error(s) and 2 item(s) reported on remote host
+ End Time:           2025-02-02 13:29:56 (GMT5.5) (807 seconds)
---------------------------------------------------------------------------
+ 1 host(s) tested

INFO:__main__:Starting Nmap 7.94SVN ( https://nmap.org ) at 2025-02-02 13:29 IST
Nmap done: 0 IP addresses (0 hosts up) scanned in 0.02 seconds

`;

async function generateContent() {
  const result = await model.generateContent(prompt);
  console.log(result.response.text()); // Ensure this is the correct method to get the generated text
}

generateContent();
