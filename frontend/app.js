const form = document.getElementById("uploadForm");
const fileInput = document.getElementById("videoInput");
const output = document.getElementById("output");
const uploadBtn = document.getElementById("uploadBtn");

const API_URL = "http://localhost:3000/upload";

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!fileInput.files.length) {
    output.textContent = "Please select a video file.";
    return;
  }

  const formData = new FormData();
  formData.append("video", fileInput.files[0]);

  uploadBtn.disabled = true;
  uploadBtn.textContent = "Uploading...";
  output.textContent = "Sending request...";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Upload failed");
    }

    output.textContent = JSON.stringify(data, null, 2);
  } catch (error) {
    output.textContent = `Error: ${error.message}`;
  } finally {
    uploadBtn.disabled = false;
    uploadBtn.textContent = "Upload";
  }
});
