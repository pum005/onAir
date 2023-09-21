import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";

import CreateRadio from "./pages/HomePage/CreateRadio";
import { Home } from "./pages/HomePage/Home";

import { MyPage } from "./pages/MyPage/MyPage";

import { Loading } from "./pages/PlayerPage/Loading";
import { LivePlayer } from "./pages/PlayerPage/LivePlayer";
import { MusicPlayer } from "./pages/PlayerPage/MusicPlayer";
import { RadioPlayer } from "./pages/PlayerPage/RadioPlayer";
import { MyMusicPlayer } from "./pages/PlayerPage/MyMusicPlayer";
import { Player } from "./pages/PlayerPage/Player";

import Success from "./utils/Success";
function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/CreateRadio" element={<CreateRadio />} />

            <Route path="/MyPage" element={<MyPage />} />

            <Route path="/Loading" element={<Loading />} />
            <Route path="/LivePlayer" element={<LivePlayer />} />
            <Route path="/MusicPlayer" element={<MusicPlayer />} />
            <Route path="/RadioPlayer" element={<RadioPlayer />} />
            <Route path="/MyMusicPlayer" element={<MyMusicPlayer />} />
            <Route path="/Player" element={<Player />} />

            <Route path="/Success" element={<Success />} />
          </Routes>
        </Router>
      </Provider>
    </div>
  );
}

export default App;
