import { useEffect, useRef, useState } from 'react';

export const CameraControl = (): JSX.Element => {
  const [mediaStream, setMediaStream] = useState<MediaStream>();
  const videoRef = useRef<HTMLVideoElement>(null);

  const setupCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true });
    setMediaStream(stream);
  };
  useEffect(() => {
    if (!videoRef.current) return;
    if (!mediaStream) {
      setupCamera();
      return;
    }

    videoRef.current.srcObject = mediaStream;

    return () => mediaStream.getTracks().forEach((track) => track.stop());
  }, [mediaStream]);

  return <video ref={videoRef} autoPlay />;
};
