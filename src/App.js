import './App.css';
import React, { useState, useRef} from 'react';
import {Hands} from '@mediapipe/hands';
import * as handson from '@mediapipe/hands';
import * as cam from '@mediapipe/camera_utils';
import Webcam from 'react-webcam';

function App() {
  let webcamRef = useRef(null);
  let canvasRef = useRef(null);
  // let photoRef = useRef(null);
  const connect = window.drawConnectors;
  const Landmarks = window.drawLandmarks;
  var camera = null;

  function onResults(results) {
    // const video = webcamRef.current.video;
    const videoWidth = webcamRef.current.video.videoWidth;
    const videoHeight = webcamRef.current.video.videoHeight;

    // Set canvas width
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;

    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext("2d");
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

    if (results.multiHandLandmarks) {
      for (const landmarks of results.multiHandLandmarks) {
        connect(canvasCtx, landmarks, handson.HAND_CONNECTIONS, {
          color: "##00FF00",
          lineWidth: 5,
        });
        Landmarks(canvasCtx, landmarks, {
          color: "#FF0030",
          lineWidth: 2
        });
      }

      // for (const landmarks of results.multiHandLandmarks) {
      //   let landmarksCoord = [];
      //   for(const landmark of landmarks.landmark) {
      //     landmarksCoord.push([parseInt(landmark.x * canvasElement.width), parseInt(landmark.y * canvasElement.height), parseInt(landmark.z * canvasElement.width)]);
      //   }
      //   let x_coordinates = landmarksCoord.map(x => x.map(a => a[0])).flat(1);
      //   let y_coordinates = landmarksCoord.map(x => x.map(a => a[1])).flat(1);

      //   let x1 = Math.min(...x_coordinates) - 10;
      //   let y1 = Math.min(...y_coordinates) - 10;
      //   let x2 = Math.max(...x_coordinates) + 10;
      //   let y2 = Math.max(...y_coordinates) + 10;
      // }
    }

    canvasCtx.restore();
  }

  const [image,setImage]=useState('');
  const [cameraOn,setCamera]=useState(false);

  const getSkeleton = () => {
    const hands = new Hands({
      locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      }
    });

    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    hands.onResults(onResults);

    if (typeof webcamRef.current !== "undefined" && webcamRef.current !== null) {
      camera = new cam.Camera(webcamRef.current.video, {
        onFrame: async () => {
          await hands.send({ image: webcamRef.current.video });
        },
        width: 1280,
        height: 720,
      });
      camera.start();
    }
  };


  const getUserCamera = () =>{
    setCamera(true);
  }

  const takePicture = React.useCallback(
    () => {
      const imageSrc = webcamRef.current.getScreenshot();
      setImage(imageSrc);
    },
    [webcamRef]
  );
  const stopUserCamera = () => {
    setCamera(false);
  }

  return (
    <div>
      <div className='display'>
        {cameraOn ?
        (<Webcam className = 'live'
         ref={webcamRef}
         screenshotFormat="image/jpeg"
         onUserMedia = {getSkeleton}/>
        ) : (<></>)}

        <canvas className = 'live' ref={canvasRef}></canvas>
        <img className='image' src={image} alt = "Capture"/>
      </div>

      <div className='buttonBar'>
        <button className='button' id='b1' onClick = {getUserCamera} >Start camera</button>
        <button className='button' id='b2' onClick={takePicture} >Capture Image</button>
        <button className='button' id='b3' onClick ={stopUserCamera} >Stop Camera</button>
      </div>
    </div>
  );
}

export default App;
