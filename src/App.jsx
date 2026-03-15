import { Route, Routes } from "react-router-dom"
import Connexion from "./components/Connexion"
import Menu from "./components/Menu"
import FicheProjet from "./components/FicheProjet"
import Dashboard from "./components/Dashboard"
import Utilisateur from "./components/Utilisateur"
import ProjetDetails from "./components/ProjetDetails"
import AjouterProjet from "./components/ADDProjet"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {

  return (
    <>

   <Routes>
    <Route path="/" element={<Connexion/>}></Route>
    <Route path="/Dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}></Route>
    <Route path="/FicheProjet" element={<ProtectedRoute><FicheProjet/></ProtectedRoute>}></Route>
    <Route path="/projet/:id" element={<ProtectedRoute><ProjetDetails/></ProtectedRoute>}></Route>
    <Route path="/Utilisateur" element={<ProtectedRoute><Utilisateur/></ProtectedRoute>}></Route>
    <Route path="/AjouterProjet" element={<ProtectedRoute><AjouterProjet/></ProtectedRoute>}></Route>
   </Routes>
    </>
  )
}

export default App
