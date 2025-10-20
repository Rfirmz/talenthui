'use client';

interface VideoBackgroundProps {
  videoUrl: string;
  className?: string;
}

export default function VideoBackground({ 
  videoUrl, 
  className = ''
}: VideoBackgroundProps) {
  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Video Background */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
      
      {/* Light Blue Overlay */}
      <div className="absolute inset-0 w-full h-full bg-blue-500 bg-opacity-20" />
    </div>
  );
}
