import { Route, Routes } from "react-router-dom"
import Connexion from "./components/Connexion"
import Landing from "./components/Landing"

function App() {

  return (
    <>

   <Routes>
    <Route path="/" element={<Landing/>}></Route>
    <Route path="/login" element={<Connexion/>}></Route>
   </Routes>
    </>
  )
}

export default App
