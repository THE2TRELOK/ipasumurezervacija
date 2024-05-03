import { BrowserRouter, Routes, Route,Navigate  } from "react-router-dom";
import Header from "./components/start/Header";
import Calendarnbook from "./components/start/Calendarnbook";
import Footer from "./components/start/Footer/Footer";
import Review from "./components/start/Review";
import Apartamenti from "./Apartamenti";
import Popular from "./components/start/Popular";
import Main from "./components/start/Main";
import Profils from "./components/Profils";
import Login from "./components/Login/Login";
import { UserProvider, useUser } from "./components/UserContext"; 
function App() {
  const { user } = useUser();
  return (
    <div className="App"
    >
      <UserProvider>
       <BrowserRouter>
      <Routes>
        
      <Route path="/" element={<Main />} />
          <Route path="/header" element={<Header />} />
          <Route path="/calendarnbook" element={<Calendarnbook />} />
          <Route path="/footer" element={<Footer />} />
          <Route path="/review" element={<Review />} />
          <Route path="/apartamenti" element={<Apartamenti />} />
          <Route path="/popular" element={<Popular />} />
          <Route path="/profils"
          element={user ? <Profils /> : <Navigate to="/" />}
          />
          <Route path="/login" element={<Login/>}/>
      </Routes>
    </BrowserRouter>
    </UserProvider>
    </div>
    
  );
}

export default App;
