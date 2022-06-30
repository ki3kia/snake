import { ReactElement, useEffect, useRef, useState } from 'react';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import '@mediapipe/hands';
import '@tensorflow-models/hand-pose-detection';
import { getDirectionByHandsPose, Point } from './gameUtils';

const model = handPoseDetection.SupportedModels.MediaPipeHands;
const detectorConfig: handPoseDetection.MediaPipeHandsMediaPipeModelConfig = {
  runtime: 'mediapipe',
  solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands',
  modelType: 'full',
  maxHands: 1,
};

const detectorPromise = handPoseDetection.createDetector(model, detectorConfig);

type CameraControlProps = {
  onChangeDirection?: (direction: Point) => void;
  interval?: number;
};
export const CameraControl = ({ onChangeDirection, interval }: CameraControlProps): ReactElement => {
  const [mediaStream, setMediaStream] = useState<MediaStream>();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const initCamera = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true });
      setMediaStream(stream);
    };

    if (!mediaStream) initCamera();
  });

  useEffect(() => {
    if (!videoRef.current || !mediaStream) return;
    videoRef.current.srcObject = mediaStream;
    return () => {
      mediaStream.getTracks().forEach((track) => track.stop());
    };
  }, [mediaStream]);

  useEffect(() => {
    if (!mediaStream || !onChangeDirection || !videoRef.current) return;

    const intervalId = setInterval(async () => {
      const detector = await detectorPromise;
      if (!videoRef.current) return;
      const hands = await detector.estimateHands(videoRef.current, { staticImageMode: true });
      let direction: Point | undefined;
      if (hands[0]) direction = getDirectionByHandsPose(hands[0]);

      if (direction) onChangeDirection(direction);
    }, 200);

    return () => clearInterval(intervalId);
  }, [onChangeDirection, interval, mediaStream]);

  return <video ref={videoRef} autoPlay />;
};
