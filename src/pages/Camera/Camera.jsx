import React, { useEffect, useRef, useState } from 'react';
import './Camera.scss';

function Camera() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [imgPos, setImgPos] = useState({ x: 0, y: 0 });
    const [imgSize, setImgSize] = useState(100); // 슬라이더로 조절할 이미지 크기, 퍼센트 단위
    const [rotation, setRotation] = useState(0); // 이미지 회전 각도
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    

    useEffect(() => {
        // 웹캠 설정
        navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
            const video = videoRef.current;
            video.srcObject = stream;
            video.play();
        });
    }, [windowWidth]);

    const handleMouseDown = (e) => {
        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches[0].clientY;
        const offsetX = clientX - imgPos.x;
        const offsetY = clientY - imgPos.y;
    
        const handleMouseMove = (e) => {
            const moveX = e.clientX || e.touches[0].clientX;
            const moveY = e.clientY || e.touches[0].clientY;
        
            const newPosX = moveX - offsetX;
            const newPosY = moveY - offsetY;
        
            const videoElement = videoRef.current;
            const videoWidth = videoElement.offsetWidth;
            const videoHeight = videoElement.offsetHeight;
        
            const imgElement = document.querySelector('img');
            const imgWidth = imgElement.offsetWidth;
            const imgHeight = imgElement.offsetHeight;
        
            if (newPosX >= 0 && newPosX <= videoWidth - imgWidth &&
                newPosY >= 0 && newPosY <= videoHeight - imgHeight) {
                console.log(`moveX: ${moveX}, moveY: ${moveY}`);  // 현재 위치 로깅
                setImgPos({
                    x: newPosX,
                    y: newPosY,
                });
            }
        };
    
        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('touchmove', handleMouseMove);
            document.removeEventListener('touchend', handleMouseUp);
        };
    
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('touchmove', handleMouseMove);
        document.addEventListener('touchend', handleMouseUp);
    };

    // 이미지 크기를 변경할 때의 로직
    const handleImageSizeChange = (e) => {
        const newSize = e.target.value;
        const videoElement = videoRef.current;
        const videoWidth = videoElement.offsetWidth;
        const videoHeight = videoElement.offsetHeight;
    
        const imgElement = document.querySelector('img');
        const imgWidth = imgElement.naturalWidth * (newSize / 100);
        const imgHeight = imgElement.naturalHeight * (newSize / 100);
    
        let newX = imgPos.x;
        let newY = imgPos.y;
    
        // 이미지가 웹캠 영역을 벗어나는지 확인하고, 벗어난다면 영역 안으로 재조정
        if (imgPos.x + imgWidth > videoWidth) {
        newX = videoWidth - imgWidth;
        }
        if (imgPos.y + imgHeight > videoHeight) {
        newY = videoHeight - imgHeight;
        }
    
        setImgPos({ x: newX, y: newY });
        setImgSize(newSize);
    };

    const capture = () => {
        const videoElement = videoRef.current;
        const canvasElement = canvasRef.current;
        const ctx = canvasElement.getContext('2d');

        // 웹캠 캡처
        ctx.drawImage(videoElement, 0, 0, videoElement.width, videoElement.height);

        // 이미지 로드 및 캡처
        const img = new Image();
        img.src = '/images/images-2.jpg';
        img.onload = () => {
            // 이미지 회전과 위치 조절
            ctx.save();
            ctx.translate(imgPos.x + (img.width * imgSize / 200), imgPos.y + (img.height * imgSize / 200));
            ctx.rotate(rotation * (Math.PI / 180));
            ctx.drawImage(img, -(img.width * imgSize / 200), -(img.height * imgSize / 200), img.width * (imgSize / 100), img.height * (imgSize / 100));
            ctx.restore();

            // // 캡처된 이미지를 새 창에 띄우기
            // const dataURL = canvasElement.toDataURL('image/png');
            // window.open(dataURL, '_blank');
            // 캡처된 이미지를 새 창에 띄우기 대신 페이지에 삽입
            const dataURL = canvasElement.toDataURL('image/png');
            const imgTag = document.createElement('img');
            imgTag.src = dataURL;
            document.body.appendChild(imgTag);

        };
    };

    return (
        <>
        <video ref={videoRef} width={windowWidth} height={Math.floor(windowWidth * (3 / 4))} autoPlay></video>
        <canvas ref={canvasRef} width={windowWidth} height={Math.floor(windowWidth * (3 / 4))} style={{ display: 'none' }}></canvas>
        <div
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
            style={{
            position: 'absolute',
            top: imgPos.y,
            left: imgPos.x,
            cursor: 'grab',
            transform: `rotate(${rotation}deg)`,
            }}
        >
            <img src="/images/images-2.jpg" width={`${imgSize}%`} />
        </div>
        <div>
            <button onClick={() => setRotation(rotation + 15)}>시계 회전</button>
            <button onClick={() => setRotation(rotation - 15)}>반시계 회전</button>
        </div>
        <div>
            <input type="range" min="70" max="100" value={imgSize} onChange={handleImageSizeChange} />
        </div>
        <button className="capture-button" onClick={capture}>캡처</button>
        </>
    );
}

export default Camera;
