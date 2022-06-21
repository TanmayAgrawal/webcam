import './App.css';
import React, { useRef } from 'react';

function App() {
  let videoRef = useRef(null);
  let photoRef = useRef(null);

  const getUserCamera = () =>{
    navigator.mediaDevices.getUserMedia({
      video:true
    }).then((stream) => {
      let video = videoRef.current;
      video.srcObject = stream;
      video.play();
    }).catch((error) => {
      console.log(error);
    })
  }

  const takePicture = () => {
    let height = 375;
    let width = 500;

    let photo = photoRef.current;
    let video = videoRef.current;

    photo.width = width;
    photo.height = height;

    let ctx = photo.getContext('2d');
    ctx.drawImage(video, 0, 0, width, height);
  }

  const stopUserCamera = () => {
    let stream = videoRef.current.srcObject;
    let tracks = stream.getTracks();
    tracks.forEach((track) => {
      track.stop();
    })
  }

  // useEffect(() => {
  //   getUserCamera();
  // },[videoRef])

  return (
    <div>
      <div className='display'>
        <video className='live' ref={videoRef}></video>
        <canvas className='image' ref={photoRef}></canvas>
        
      </div>

      <div className='buttonBar'>
        <button className='button' id='b1' onClick={getUserCamera}>Start camera</button>
        <button className='button' id='b2' onClick={takePicture}>Capture Image</button>
        <button className='button' id='b3' onClick={stopUserCamera}>Stop Camera</button>
      </div>
    </div>
  );
}

export default App;
