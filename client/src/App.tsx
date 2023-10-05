import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import Game from "./pages/PlayerPage/Game"; // 경로를 실제 Game 컴포넌트의 경로로 바꾸세요

import CreateRadio from "./pages/HomePage/CreateRadio";
import { Home } from "./pages/HomePage/Home";

import { MyPage } from "./pages/MyPage/MyPage";

import { Loading } from "./pages/PlayerPage/Loading";
import { LivePlayer } from "./pages/PlayerPage/LivePlayer";
import { MusicPlayer } from "./pages/PlayerPage/MusicPlayer";
import { RadioPlayer } from "./pages/PlayerPage/RadioPlayer";
import { MyMusicPlayer } from "./pages/PlayerPage/MyMusicPlayer";
import { Player } from "./pages/PlayerPage/Player";

import OncastCreateComplete from "./pages/PlayerPage/OncastCreateComplete";

import Success from "./utils/Success";

import store, { persistor } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { GlobalYouTubePlayer } from "./component/YoutubeMusicPlayer/GlobalYouTubePlayer";
import NavBar from "./component/Common/Navbar";

function App() {
  const [showNavBar, setShowNavBar] = useState<boolean>(() => {
    const storedValue = localStorage.getItem("showNavBar");
    return storedValue ? JSON.parse(storedValue) : false;
  });

  const handleSetShowNavBar = (value: boolean) => {
    setShowNavBar(value);
    localStorage.setItem("showNavBar", JSON.stringify(value));
  };

  useEffect(() => {
    const storedShowNavBar = localStorage.getItem("showNavBar");
    if (storedShowNavBar !== null) {
      setShowNavBar(JSON.parse(storedShowNavBar));
    }
  }, []);
  const [showAlbumIcon, setShowAlbumIcon] = useState(false);

  return (
    <div className="App">
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Router>
            {showNavBar && <NavBar />}
            <Routes>
              <Route
                path="/"
                element={
                  <Home
                    setShowNavBar={setShowNavBar}
                    setShowAlbumIcon={setShowAlbumIcon}
                  />
                }
              />
              {/* 상태 변경 함수를 Home 컴포넌트로 전달 */}
              <Route path="/CreateRadio" element={<CreateRadio />} />
              <Route path="/MyPage" element={<MyPage />} />
              <Route path="/Loading" element={<Loading />} />
              <Route
                path="/OncastCreateComplete"
                element={<OncastCreateComplete />}
              />
              <Route path="/LivePlayer" element={<LivePlayer />} />
              <Route path="/Player" element={<Player />} />
              <Route path="/MyMusicPlayer" element={<MyMusicPlayer />} />
              <Route path="/Success" element={<Success />} />
            </Routes>
            <GlobalYouTubePlayer></GlobalYouTubePlayer>
          </Router>
        </PersistGate>
      </Provider>
    </div>
    //ㅏㅓㅏ
  );
}

export default App;
