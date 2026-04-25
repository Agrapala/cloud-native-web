const axios = require("axios");

const BACKEND_URL = "http://localhost:3000";

async function processJobs() {
    try {
        const res = await axios.get(`${BACKEND_URL}/jobs`);
        const jobs = res.data;

        for (let job of jobs) {
            if (job.status === "queued") {
                console.log("⚙️ Processing job:", job.id);

                // simulate processing
                await new Promise(r => setTimeout(r, 3000));

                job.status = "completed";

                console.log("✅ Completed job:", job.id);
            }
        }
    } catch (err) {
        console.log("❌ Error:", err.message);
    }
}

// run every 5 seconds
setInterval(processJobs, 5000);

console.log("👷 Worker started...");