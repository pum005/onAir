import { useState, useEffect } from "react";
import NavBar from "../../component/Common/Navbar";

type MyMusicPlayerProps = {
  playlistData?: any[]; // 추후에 더 구체적인 타입으로 변경해주세요.
};

export const MyMusicPlayer: React.FC<MyMusicPlayerProps> = ({
  playlistData,
}) => {
  const [songs, setSongs] = useState<any[]>([]); // 추후에 더 구체적인 타입으로 변경해주세요.

  useEffect(() => {
    // 플레이리스트 데이터가 props로 전달되면 해당 데이터를 사용합니다.
    if (playlistData) {
      setSongs(playlistData);
    }
  }, [playlistData]);

  return (
    <div
      style={{ backgroundColor: "#000104", height: "100vh", color: "white" }}
    >
      <NavBar />
      {/* 이제 여기에 노래 데이터를 출력하는 로직을 추가할 수 있습니다. */}
      {songs.map(song => (
        <div key={song.title}>
          {/* 각 노래의 정보를 출력합니다. */}
          {/* 예: <p>{song.title} - {song.artist}</p> */}
        </div>
      ))}
    </div>
  );
};
