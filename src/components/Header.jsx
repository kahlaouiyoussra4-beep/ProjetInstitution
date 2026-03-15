import './Header.css'
import logo from "../assets/Coat_of_arms_of_Morocco.svg.png"
function Header() {
  return (
    <div className="header">
       <img src={logo} alt="Coat_of_arms_of_Morocco" />
            <span>Royaume du Maroc</span><span> Ministère de l’Intérieur </span>
            <span>
              Wilaya de la Région de l’Oriental Préfecture Oujda-Angad  </span>
            <h2>Gestion des projets de la prefecture Oujda-Angad</h2>
      </div>
    
  )
}

export default Header