import { ReactElement, useEffect, useRef, useState } from 'react';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import '@mediapipe/hands';
import '@tensorflow-models/hand-pose-detection';
import { getDirectionByHandsPose, Point } from './gameUtils';

type CameraControlProps = {
  onChangeDirection: (direction: Point) => void;
};

const DELAY = 200;
const MODEL = handPoseDetection.SupportedModels.MediaPipeHands;
const DETECTOR_CONFIG: handPoseDetection.MediaPipeHandsMediaPipeModelConfig = {
  runtime: 'mediapipe',
  solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands',
  modelType: 'full',
  maxHands: 1,
};

const detectorPromise = handPoseDetection.createDetector(MODEL, DETECTOR_CONFIG);

export const CameraControl = ({ onChangeDirection }: CameraControlProps): ReactElement => {
  const [mediaStream, setMediaStream] = useState<MediaStream>();
  const [detector, setDetector] = useState<handPoseDetection.HandDetector>();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const initCamera = async () => {
      setMediaStream(await navigator.mediaDevices.getUserMedia({ audio: false, video: true }));
    };

    const initDetector = async () => {
      setDetector(await detectorPromise);
    };

    initCamera();
    initDetector();
  }, []);

  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = mediaStream ?? null;

    if (mediaStream) {
      return () => {
        mediaStream.getTracks().forEach((track) => track.stop());
      };
    }
  }, [mediaStream]);

  const onChangeDirectionRef = useRef(onChangeDirection);
  onChangeDirectionRef.current = onChangeDirection;

  useEffect(() => {
    if (!mediaStream || !detector) return;

    const getDirection = async () => {
      if (!videoRef.current) return;
      const hands = await detector.estimateHands(videoRef.current, { staticImageMode: false });
      let direction: Point | undefined;
      if (hands[0]) direction = getDirectionByHandsPose(hands[0]);

      if (direction) onChangeDirectionRef.current(direction);
      let clear: (() => void) | undefined;
      const timeoutID = setTimeout(async () => {
        clear = await getDirection();
      }, DELAY);
      return () => {
        if (clear) clear();
        clearTimeout(timeoutID);
      };
    };

    let clearTimeoutFunction: (() => void) | undefined;
    const timeoutId = setTimeout(async () => {
      clearTimeoutFunction = await getDirection();
    }, DELAY);

    return () => {
      clearTimeout(timeoutId);
      if (clearTimeoutFunction) clearTimeoutFunction();
    };
  }, [mediaStream, detector]);

  return <video ref={videoRef} autoPlay />;
};
