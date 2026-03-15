import { useState } from 'react';
import './Menu.css';
import { NavLink } from 'react-router-dom';

function Menu() {
  const [openSubmenu, setOpenSubmenu] = useState(true);

  const toggleSubmenu = () => setOpenSubmenu(!openSubmenu);

  const handleLogout = () => {
    window.location.href = '/';
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="menu-page">

      <div className="sidebar-container">

        <div className="back-btn" onClick={() => window.history.back()}>
          ◀ Retour
        </div>

        <div
          className={`menu-item ${openSubmenu ? 'active' : ''}`}
          onClick={toggleSubmenu}
        >
          Accueil
          <span className={`arrow ${openSubmenu ? 'down' : 'up'}`}>▼</span>
        </div>

        {openSubmenu && (
          <ul className="submenu">
           <li><NavLink to='/FicheProjet' className={({isActive})=>isActive?'active-link':''}>Projet</NavLink></li> 
           <li><NavLink to='/' className={({isActive})=>isActive?'active-link':''}>Statistiques</NavLink></li> 
           <li><NavLink to='/' className={({isActive})=>isActive?'active-link':''}>Recherche</NavLink></li> 
           <li><NavLink to='/Utilisateur' className={({isActive})=>isActive?'active-link':''}>Utilisateur</NavLink></li> 
            
          </ul>
        )}

        {/* <button className="sidebar-btn" onClick={handlePrint}>
          Impression
        </button> */}

        <button className="sidebar-btn logout-btn" onClick={handleLogout}>
          Déconnecter
        </button>
      </div>


    


    </div>
  );
}

export default Menu;