import { useState } from 'react';
import './Menu.css';

function Menu() {
  const [openSubmenu, setOpenSubmenu] = useState(true);

  const toggleSubmenu = () => setOpenSubmenu(!openSubmenu);

  const handleLogout = () => {
    window.location.href = '/login';
  };

  // const handlePrint = () => {
  //   window.print();
  // };

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
            <li>Projet</li>
            <li>Statistiques</li>
            <li>Recherche</li>
            <li>Utilisateur</li>
          </ul>
        )}

        {/* <button className="sidebar-btn" onClick={handlePrint}>
          Impression
        </button> */}

        <button className="sidebar-btn logout-btn" onClick={handleLogout}>
          Déconnecter
        </button>
      </div>


      <div className="content-area">

        <h1>Bienvenue dans votre tableau de bord</h1>
        <p>Gérez vos projets, consultez les statistiques et suivez l'activité en temps réel.</p>

        <div className="stats-container">
          <div className="stat-card">
            <h3>Projets actifs</h3>
            <span>12</span>
          </div>

          <div className="stat-card">
            <h3>Utilisateurs</h3>
            <span>48</span>
          </div>

          <div className="stat-card">
            <h3>Rapports générés</h3>
            <span>27</span>
          </div>
        </div>

        <div className="activity-box">
          <h2>Activités récentes</h2>
          <ul>
            <li>✔ Nouveau projet ajouté</li>
            <li>✔ Statistiques mises à jour</li>
            <li>✔ Nouvel utilisateur enregistré</li>
          </ul>
        </div>


      </div>
    </div>
  );
}

export default Menu;