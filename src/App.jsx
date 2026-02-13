import { Route, Routes } from "react-router-dom"
import Connexion from "./components/Connexion"
import Landing from "./components/Landing"
import Menu from "./components/Menu"

function App() {

  return (
    <>

   <Routes>
    <Route path="/" element={<Landing/>}></Route>
    <Route path="/login" element={<Connexion/>}></Route>
    <Route path="/menu" element={<Menu/>}></Route>
   </Routes>
    </>
  )
}

export default App
