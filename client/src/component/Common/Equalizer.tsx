// Equalizer.tsx
import React, { useRef, useEffect } from "react";

type EqualizerProps = {
  audioElement: HTMLAudioElement;
};

const Equalizer: React.FC<EqualizerProps> = ({ audioElement }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!audioElement || !canvasRef.current) return;

    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaElementSource(audioElement);
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    const frequencyData = new Uint8Array(analyser.frequencyBinCount);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const baseRadius = 80; // 원의 기본 반지름

    function renderFrame() {
      requestAnimationFrame(renderFrame);
      analyser.getByteFrequencyData(frequencyData);

      ctx!.clearRect(0, 0, canvas.width, canvas.height);
      ctx!.beginPath();

      // 첫 번째 원의 반지름 계산
      const averageFrequency =
        frequencyData.reduce((a, b) => a + b) / frequencyData.length;
      const outerRadius = baseRadius + averageFrequency;

      // 첫 번째 원 그리기
      ctx!.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI);

      // 두 번째 원의 기본 반지름은 첫 번째 원의 3/4로 설정
      const innerBaseRadius = outerRadius * 0.75;

      // 주파수 데이터의 일부만 사용하여 두 번째 원 그림
      const dataLength = frequencyData.length / 8;
      for (let i = dataLength - 1; i >= 0; i--) {
        // 이 부분은 역순으로 반복해야 합니다.
        const barHeight = frequencyData[i];
        const radian = (Math.PI * 2) / dataLength;
        const radius = innerBaseRadius + barHeight / 4; // 두 번째 원의 변화는 첫 번째 원보다 약간 더 미미하게 설정
        const x = centerX + Math.cos(radian * i) * radius;
        const y = centerY + Math.sin(radian * i) * radius;
        ctx!.lineTo(x, y);
      }

      ctx!.closePath();
      ctx!.fillStyle = "yellow";
      ctx!.fill(); // 이 부분은 두 원 사이의 공간을 채우기 위해 추가되었습니다.
      ctx!.strokeStyle = "white";
      ctx!.stroke();
    }

    renderFrame();
  }, [audioElement]);

  return (
    <canvas
      ref={canvasRef}
      width={500}
      height={500}
      style={{ display: "block" }}
    />
  );
};

export default Equalizer;
