import { ReactElement, useEffect, useRef, useState } from 'react';

export const CameraControl = (): ReactElement => {
  const [mediaStream, setMediaStream] = useState<MediaStream>();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    if (!mediaStream) {
      const setupCamera = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true });
        setMediaStream(stream);
      };
      setupCamera();
      return;
    }
    videoRef.current.srcObject = mediaStream;

    return () => mediaStream.getTracks().forEach((track) => track.stop());
  }, [mediaStream]);

  return <video ref={videoRef} autoPlay />;
};
