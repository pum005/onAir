import React, { useRef, useEffect } from "react";

// audioElement라는 prop을 받아와서 이를 사용하는 Equalizer 컴포넌트의 Props 타입을 정의합니다.
type EqualizerProps = {
  audioElement: HTMLAudioElement;
  djName: string;
};

type DjColorMap = {
  [djName: string]: {
    color: string;
    backgroundColor: string;
  };
};

const djColors: DjColorMap = {
  아라: { color: "orange", backgroundColor: "#b386001f" },
  상도: { color: "orange", backgroundColor: "#b386001f" },
  이안: { color: "blue", backgroundColor: "#1a1a2e" },
  규원: { color: "blue", backgroundColor: "#1a1a2e" },
  고은: { color: "green", backgroundColor: "#007aa741" },
  나오미: { color: "green", backgroundColor: "#007aa741" },
  정영화: { color: "pink", backgroundColor: "#8b00001c" },
  안나: { color: "pink", backgroundColor: "#8b00001c" },
  기효: { color: "yellow", backgroundColor: "#228b2224" },
  원탁: { color: "yellow", backgroundColor: "#228b2224" },
};

export function getColorByDjName(djName: string): {
  color: string;
  backgroundColor: string;
} {
  return djColors[djName] || { color: "white", backgroundColor: "#FFFFFF" };
}

const Equalizer: React.FC<EqualizerProps> = ({ audioElement, djName }) => {
  // canvas 요소에 접근하기 위한 ref를 생성합니다.
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { color: equalizerColor } = getColorByDjName(djName);
  const containerRef = useRef<HTMLDivElement>(null);

  // 컴포넌트가 마운트되거나 audioElement가 변경될 때 실행되는 useEffect 훅입니다.
  useEffect(() => {
    // audioElement나 canvasRef가 없으면 함수를 종료합니다.
    if (!audioElement || !canvasRef.current) return;

    // 오디오 컨텍스트를 생성합니다. 이는 웹 오디오 API의 엔트리 포인트입니다.
    const audioContext = new AudioContext();

    // 주파수 데이터를 분석하기 위한 analyser를 생성합니다.
    const analyser = audioContext.createAnalyser();

    // 오디오 요소의 미디어 소스를 생성하고 analyser에 연결합니다.
    const source = audioContext.createMediaElementSource(audioElement);
    source.connect(analyser);

    // analyser를 오디오 컨텍스트의 destination(스피커)에 연결하여 소리를 들을 수 있게 합니다.
    analyser.connect(audioContext.destination);

    // 주파수 데이터를 저장하기 위한 Uint8Array를 생성합니다.
    const frequencyData = new Uint8Array(analyser.frequencyBinCount);

    // canvas와 그려질 컨텍스트에 대한 참조를 가져옵니다.
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const baseRadius = 30; // 원의 기본 반지름을 설정합니다.
    const color = getColorByDjName(djName);

    // 주기적으로 화면을 다시 그려주는 함수입니다.
    function renderFrame() {
      // 다음 애니메이션 프레임을 요청합니다.
      requestAnimationFrame(renderFrame);

      // 현재의 주파수 데이터를 가져옵니다.
      analyser.getByteFrequencyData(frequencyData);

      // 캔버스를 초기화합니다.
      ctx!.clearRect(0, 0, canvas.width, canvas.height);
      ctx!.beginPath();

      // 첫 번째 원의 반지름을 계산합니다.
      const averageFrequency =
        frequencyData.reduce((a, b) => a + b) / frequencyData.length;
      const outerRadius = baseRadius + averageFrequency;

      // 첫 번째 원을 그립니다.
      ctx!.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI);

      // 두 번째 원의 기본 반지름을 설정합니다.
      const innerBaseRadius = outerRadius * 0.75;

      // 주파수 데이터의 일부를 사용하여 두 번째 원을 그립니다.
      const dataLength = frequencyData.length / 8;
      for (let i = dataLength - 1; i >= 0; i--) {
        const barHeight = frequencyData[i];
        const radian = (Math.PI * 2) / dataLength;
        const radius = innerBaseRadius + barHeight / 7;
        const x = centerX + Math.cos(radian * i) * radius;
        const y = centerY + Math.sin(radian * i) * radius;
        ctx!.lineTo(x, y);
      }

      // 원의 경로를 닫습니다.
      ctx!.closePath();

      // 두 원 사이의 공간을 노란색으로 채웁니다.
      ctx!.fillStyle = equalizerColor;
      ctx!.fill();

      // 원의 테두리를 그립니다.
      ctx!.strokeStyle = "white";
      ctx!.stroke();
    }

    // renderFrame 함수를 처음 호출하여 애니메이션을 시작합니다.
    renderFrame();
  }, [audioElement, djName]);

  // 캔버스 요소를 반환합니다.
  return (
    <canvas
      ref={canvasRef}
      width={350}
      height={350}
      style={{ display: "block", marginBottom: "50px" }}
    />
  );
};

export default Equalizer;
