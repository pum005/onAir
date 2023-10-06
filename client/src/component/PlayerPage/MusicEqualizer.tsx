import React, { useRef, useEffect } from "react";

const Equalizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const bars = 8; // 바의 갯수
    const barWidth = canvas.width / bars; // 각 바의 너비

    function renderFrame() {
      requestAnimationFrame(renderFrame);

      ctx!.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < bars; i++) {
        const barHeight = Math.random() * canvas.height; // 무작위 높이 생성
        ctx!.fillStyle = "white";
        ctx!.fillRect(
          i * barWidth,
          canvas.height - barHeight,
          barWidth,
          barHeight
        );
      }
    }

    renderFrame();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={200}
      height={50}
      style={{ display: "block" }}
    />
  );
};

export default Equalizer;
