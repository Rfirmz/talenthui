export default function VideoTest() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-4">Video Test Page</h1>
      
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Direct Video Test:</h2>
        <video 
          controls 
          className="w-full max-w-md"
          preload="metadata"
        >
          <source src="/videos/hawaii-background.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Background Video Test:</h2>
        <div className="relative w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
          <video 
            className="absolute inset-0 w-full h-full object-cover"
            muted
            loop
            playsInline
            autoPlay
            preload="auto"
          >
            <source src="/videos/hawaii-background.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-blue-500 bg-opacity-30"></div>
          <div className="relative z-10 flex items-center justify-center h-full">
            <p className="text-white font-bold text-xl">Video Background Test</p>
          </div>
        </div>
      </div>
      
      <div className="text-sm text-gray-600">
        <p>If you can see the video above, the file is working.</p>
        <p>If not, there might be an issue with the video file format or size.</p>
      </div>
    </div>
  );
}
