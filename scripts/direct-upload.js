const { put } = require('@vercel/blob');
const fs = require('fs');
const path = require('path');

async function uploadVideoDirectly() {
  try {
    // Set the environment variable
    process.env.BLOB_READ_WRITE_TOKEN = "vercel_blob_rw_nS0RtrmCit3LCPie_UYBwMiWtXoQYO9buGQZF8GPPIbmp8k";
    
    const videoPath = path.join(__dirname, '../public/videos/hawaii-background.mp4');
    const videoBuffer = fs.readFileSync(videoPath);
    
    console.log('Uploading video to Vercel Blob...');
    console.log('File size:', (videoBuffer.length / 1024 / 1024).toFixed(2), 'MB');
    
    const blob = await put('hawaii-background.mp4', videoBuffer, {
      access: 'public',
      addRandomSuffix: true
    });
    
    console.log('✅ Video uploaded successfully!');
    console.log('🔗 Blob URL:', blob.url);
    console.log('');
    console.log('📝 Next steps:');
    console.log('1. Copy the URL above');
    console.log('2. Update your video src in src/app/page.tsx');
    console.log('3. Replace "/videos/hawaii-background.mp4" with the Blob URL');
    
    return blob.url;
  } catch (error) {
    console.error('❌ Error uploading video:', error.message);
    process.exit(1);
  }
}

uploadVideoDirectly();
