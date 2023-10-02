import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";

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
  return (
    <div className="App">
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Router>
            <NavBar></NavBar>
            <Routes>
              <Route path="/" element={<Home />} />
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
