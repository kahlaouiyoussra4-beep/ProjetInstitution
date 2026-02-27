import { useState, useEffect } from 'react';
import Menu from './Menu';
import './FicheProjet.css';
import { useNavigate } from 'react-router-dom';

function FicheProjet() {

  const [projects,setProjects]=useState([]);
  

  const navigate=useNavigate()





useEffect(() => {
  const token = localStorage.getItem("token");

  fetch("http://localhost:5000/api/projets", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data)) {
        setProjects(data);
      } else {
        console.log("Erreur serveur :", data);
        setProjects([]);
      }
    })
    .catch(err => console.log(err));
}, []);


 




  return (
    <div className="fiche-page">
      <Menu />

      <div className="fiche-container">

        <h1>Gestion des Projets</h1>

        <button className="add-project-btn" onClick={()=>navigate("/AjouterProjet")}>
          + Ajouter Projet
        </button>

    
        <div className="cards-container">
          {projects.length === 0 ? (
            <div className="no-projects">
              📌 Aucun projet trouvé. Veuillez ajouter un projet.
            </div>
          ) : (
            projects.map((p,index)=>(
              <div className="project-card" key={index}>
                <h3>{p.intitule}</h3>
                <button className="detail-btn" onClick={()=>navigate(`/projet/${p._id}`)}>Voir détail</button>
              </div>
            ))
          )}
        </div>

     
    


      </div>
    </div>
  );
}

export default FicheProjet;