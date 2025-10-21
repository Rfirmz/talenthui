const fs = require('fs');
const path = require('path');

async function uploadVideo() {
  try {
    const videoPath = path.join(__dirname, '../public/videos/hawaii-background.mp4');
    const videoBuffer = fs.readFileSync(videoPath);
    
    // Set the environment variable for the script
    process.env.BLOB_READ_WRITE_TOKEN = "vercel_blob_rw_nS0RtrmCit3LCPie_UYBwMiWtXoQYO9buGQZF8GPPIbmp8k";
    
    const response = await fetch('http://localhost:3000/api/upload?filename=hawaii-background.mp4', {
      method: 'POST',
      body: videoBuffer,
    });
    
    const blob = await response.json();
    console.log('Video uploaded successfully!');
    console.log('Blob URL:', blob.url);
    console.log('Add this URL to your video src in the component');
    
    return blob.url;
  } catch (error) {
    console.error('Error uploading video:', error);
  }
}

uploadVideo();
