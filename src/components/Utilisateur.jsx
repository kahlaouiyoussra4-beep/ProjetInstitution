import React, { useState, useEffect } from "react";
import "./utilisateur.css";
import Menu from "./Menu";

function Utilisateur() {
  const [formSearch, setFormSearch] = useState({ username: "", nom: "", prenom: "", cnie: "" });
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [results, setResults] = useState([]);
  const [modeUser, setModeUser] = useState("");
  const [modeProjet, setModeProjet] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchError, setSearchError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);


useEffect(() => {
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      const text = await res.text();

      try {
        const data = JSON.parse(text);
        setUsers(data);
      } catch {
        console.error("Server did not return JSON:", text);
      }

    } catch (err) {
      console.error("Erreur fetch users:", err);
    }
  };

  fetchUsers();
}, []);

  const handleChange = (e) => setFormSearch({ ...formSearch, [e.target.name]: e.target.value });

  const handleSearch = (e) => {
    e.preventDefault();

    setHasSearched(true)
    if (!formSearch.username && !formSearch.nom && !formSearch.prenom && !formSearch.cnie) {
      setSearchError("Veuillez remplir au moins un champ pour la recherche.");
      setResults([]);
      return;
    }
    setSearchError("");

    const filtered = users.filter(u =>
      (!formSearch.username || u.utilisateur.toLowerCase().includes(formSearch.username.toLowerCase())) &&
      (!formSearch.nom || u.nom.toLowerCase().includes(formSearch.nom.toLowerCase())) &&
      (!formSearch.prenom || u.prenom.toLowerCase().includes(formSearch.prenom.toLowerCase())) &&
      (!formSearch.cnie || u.cnie.toLowerCase().includes(formSearch.cnie.toLowerCase()))
    );

    setResults(filtered);
    setModeUser("");
    setSelectedUser(null);
  };

  const handleAddClick = () => { setModeUser("ajouter"); setSelectedUser(null); };

 
  const handleConsulterProjets = async (user) => {
  setSelectedUser(user);
  setModeUser("consulter");

  try {
    const res = await fetch(
      `http://localhost:5000/api/projets/user/${user.utilisateur}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );

   
    if (res.status === 404) {
      setProjects([]);
      return;
    }

    if (!res.ok) {
      throw new Error("Erreur serveur");
    }

    const data = await res.json();
    setProjects(data);

  } catch (err) {
    console.error("Erreur fetch projets:", err);
    setProjects([]);
  }
};
  const handleModifierProjet = (project) => {
    setModeProjet("modifierProjet");
    setSelectedProject(project);
  };

 
  const handleAddUser = async (e) => {
    e.preventDefault();

    const form = e.target;
    const droits = Array.from(form.elements)
      .filter(c => c.type === "checkbox" && c.checked)
      .map(c => c.name);

    const userData = {
      utilisateur: form.utilisateur.value,
      nom: form.nom.value,
      prenom: form.prenom.value,
      cnie: form.cnie.value,
      password: form.password.value,
      droits: droits
    };

    try {
      const res = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(userData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur serveur");

      alert("Utilisateur ajouté avec succès !");
      form.reset();
      setUsers([...users, data]);
    } catch (err) {
      alert("Erreur: " + err.message);
    }
  };
  const handleToggleStatus = async (userId, newStatus) => {
  try {
    const res = await fetch(`http://localhost:5000/api/users/${userId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ isActive: newStatus })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    const updated = users.map(u =>
      u._id === userId ? { ...u, isActive: newStatus } : u
    );

    setUsers(updated);
    setResults(updated);

  } catch (err) {
    alert("Erreur: " + err.message);
  }
};
const role = localStorage.getItem("role"); 
const droits = JSON.parse(localStorage.getItem("droits") || "[]");

const hasAccess = (requiredRight) => {
  if(role === "ADM") return true; 
  return droits.includes(requiredRight); 
};
const handleUpdateProjet = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch(`http://localhost:5000/api/projets/${selectedProject._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(selectedProject)
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Erreur serveur");

    const updatedProjects = projects.map(p => p._id === selectedProject._id ? data : p);
    setProjects(updatedProjects);
    setModeProjet(""); 
    alert("Projet modifié avec succès !");
  } catch (err) {
    alert("Erreur: " + err.message);
  }
};


  return (
    <div className="fiche-page">
      <Menu />
      {!hasAccess("utilisateur")?(
        <div style={{color:"red",fontWeight:"bold",padding:"20px",fontSize:"18px"}}>
          Vous n'avez pas le droit d'accéder à cette page.
        </div>
      ):
      <div className="utilisateur-container">

        <h2>Recherche Utilisateur</h2>
        <button onClick={handleAddClick} className="ajouter_Utilisateur">+Ajouter utilisateur</button>

        <form onSubmit={handleSearch}>
          {["username", "nom", "prenom", "CNIE"].map(field => (
            <div className="form-group" key={field}>
              <label>{field === "username" ? "Utilisateur" : field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input type="text" name={field} value={formSearch[field]} onChange={handleChange} />
            </div>
          ))}
          {searchError && <span className="error">{searchError}</span>}<br />
          <button type="submit" className="button">Rechercher</button>
        </form>

        {/* Résultats recherche */}
        {results.length > 0 && (
          <table className="results-table">
            <thead>
              <tr>
                <th>Utilisateur</th><th>Nom</th><th>Prénom</th><th>CNIE</th><th>Statut</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {results.map(u => (
                <tr key={u._id}>
                  <td>{u.utilisateur}</td><td>{u.nom}</td><td>{u.prenom}</td><td>{u.cnie}</td>
                  <td>
                    {role==="ADM"?(
                      <>
                    <label><input type="radio" name={`status-${u._id}`} checked={u.isActive===true} onChange={()=>handleToggleStatus(u._id,true)} /> Actif</label>
                    <label><input type="radio" name={`status-${u._id}`} checked={u.isActive===false} onChange={()=>handleToggleStatus(u._id,false)} /> Non Actif</label></>
                    ):<span style={{frontWeight:"bold",color:u.isActive?"green":"red"}}>{u.isActive?"Actif":"Désactivé"}</span>

                  
                  }
                  </td>
                  <td>
                    <button onClick={() => handleConsulterProjets(u)}>Consulter Projets</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Aucun résultat */}
        {results.length === 0 && hasSearched && (
          <div className="no-result">
            <p>Aucun résultat</p>
          </div>
        )}

        {/* Formulaire Ajouter Utilisateur */}
        {modeUser === "ajouter" && (
          <div className="form-user">
            <h3>Ajouter Utilisateur</h3>
            <form onSubmit={handleAddUser}>
              {["utilisateur", "nom", "prenom", "cnie"].map(f => (
                <div className="form-group" key={f}>
                  <label>{f.charAt(0).toUpperCase() + f.slice(1)}</label>
                  <input type="text" name={f} />
                </div>
              ))}
              <div className="form-group">
                <label>Mot de passe</label>
                <input type="password" name="password" />
              </div>
              <div className="form-group">
                <label>Droits d'accès</label>
                <div>
                  {["Utilisateur", "Projet", "Statistiques", "Recherche"].map(d => (
                    <label key={d}><input type="checkbox" defaultChecked name={d} /> {d}</label>
                  ))}
                </div>
              </div>
              <button type="submit">Ajouter</button>
            </form>
          </div>
        )}

        {/* Consultation + Modification Projet */}
        {modeUser === "consulter" && selectedUser && (
          <div className="consultation-projects">
            <h3>Projets de {selectedUser.utilisateur}</h3>
            {projects.length===0 ? (<p>Aucun projet pour cet utilisateur</p>):(
            <table className="results-table">
              <thead>
                <tr>
                  <th>ID</th><th>Intitulé</th><th>Commun</th><th>Lieu</th><th>Axe</th><th>Sous-Axe</th><th>Objectifs</th>
                  <th>Cout</th><th>Partenaires</th><th>Cout Partenaire</th><th>Composant</th><th>Délai</th>
                  <th>Date Début</th><th>Date Fin</th><th>Etat Physique</th><th>Etat Financier</th><th>Observations</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
  {projects.map(p => (
    <tr key={p._id}>
      <td>{p.Id}</td>
      <td>{p.intitule}</td>
      <td>{p.commun}</td>
      <td>{p.lieu}</td>
      <td>{p.axe}</td>
      <td>{p.sousAxe}</td>
      <td>{p.objectifs}</td>
      <td>{p.cout}</td>
    

      {/* أسماء الشركاء */}
      <td>
        {p.partenaires?.map(part => part.name).join(", ")}
      </td>

      {/* تكلفة الشركاء */}
      <td>
        {p.partenaires?.map(part => part.cout).join(", ")}
      </td>

      <td>{p.composantes}</td>
      <td>{p.delai}</td>
      <td>{new Date(p.dateDebut).toLocaleDateString()}</td>
      <td>{new Date(p.dateFin).toLocaleDateString()}</td>
      <td>{p.avancementPhysique}</td>
      <td>{p.avancementFinancier}</td>
      <td>{p.observations}</td>
        <td><button onClick={()=>handleModifierProjet(p)}>Modifier</button></td>
    </tr>
  ))}
</tbody>
            </table>
            
            )}
            {modeProjet==="modifierProjet" && selectedProject && (
  <div className="form-user">
    <h3>Modifier Projet</h3>
    <form onSubmit={handleUpdateProjet}>

      <div className="form-group">
        <label>Id</label>
        <input
          type="number"
          value={selectedProject.Id}
          onChange={(e) =>
            setSelectedProject({ ...selectedProject, Id: Number(e.target.value) })
          }
        />
      </div>

      <div className="form-group">
        <label>Intitulé</label>
        <input
          type="text"
          value={selectedProject.intitule}
          onChange={(e) =>
            setSelectedProject({ ...selectedProject, intitule: e.target.value })
          }
        />
      </div>

      <div className="form-group">
        <label>Commun</label>
        <input
          type="text"
          value={selectedProject.commun}
          onChange={(e) =>
            setSelectedProject({ ...selectedProject, commun: e.target.value })
          }
        />
      </div>

      <div className="form-group">
        <label>Lieu</label>
        <input
          type="text"
          value={selectedProject.lieu}
          onChange={(e) =>
            setSelectedProject({ ...selectedProject, lieu: e.target.value })
          }
        />
      </div>

      <div className="form-group">
        <label>Axe</label>
        <input
          type="text"
          value={selectedProject.axe}
          onChange={(e) =>
            setSelectedProject({ ...selectedProject, axe: e.target.value })
          }
        />
      </div>

      <div className="form-group">
        <label>Sous-Axe</label>
        <input
          type="text"
          value={selectedProject.sousAxe}
          onChange={(e) =>
            setSelectedProject({ ...selectedProject, sousAxe: e.target.value })
          }
        />
      </div>

      <div className="form-group form_full">
        <label>Objectifs</label>
        <textarea
          value={selectedProject.objectifs}
          onChange={(e) =>
            setSelectedProject({ ...selectedProject, objectifs: e.target.value })
          }
        />
      </div>

      <div className="form-group">
        <label>Coût</label>
        <input
          type="number"
          value={selectedProject.cout}
          onChange={(e) =>
            setSelectedProject({ ...selectedProject, cout: Number(e.target.value) })
          }
        />
      </div>

      <div className="form-group">
        <label>Partenaires</label>
        {selectedProject.partenaires?.map((p, i) => (
          <div key={i}>
            <input
              placeholder="Nom partenaire"
              value={p.name}
              onChange={(e) => {
                const newPart = [...selectedProject.partenaires];
                newPart[i].name = e.target.value;
                setSelectedProject({ ...selectedProject, partenaires: newPart });
              }}
            />
            <input
              type="number"
              placeholder="Coût partenaire"
              value={p.cout}
              onChange={(e) => {
                const newPart = [...selectedProject.partenaires];
                newPart[i].cout = Number(e.target.value);
                setSelectedProject({ ...selectedProject, partenaires: newPart });
              }}
            />
          </div>
        ))}
      </div>

      <div className="form-group">
        <label>Composantes</label>
        <textarea
          value={selectedProject.composantes}
          onChange={(e) =>
            setSelectedProject({ ...selectedProject, composantes: e.target.value })
          }
        />
      </div>

      <div className="form-group">
        <label>Délai (mois)</label>
        <input
          type="number"
          value={selectedProject.delai}
          onChange={(e) =>
            setSelectedProject({ ...selectedProject, delai: Number(e.target.value) })
          }
        />
      </div>

      <div className="form-group">
        <label>Date Début</label>
        <input
          type="date"
          value={selectedProject.dateDebut?.split("T")[0] || ""}
          onChange={(e) =>
            setSelectedProject({ ...selectedProject, dateDebut: e.target.value })
          }
        />
      </div>

      <div className="form-group">
        <label>Date Fin</label>
        <input
          type="date"
          value={selectedProject.dateFin?.split("T")[0] || ""}
          onChange={(e) =>
            setSelectedProject({ ...selectedProject, dateFin: e.target.value })
          }
        />
      </div>

      <div className="form-group">
        <label>Avancement Physique (%)</label>
        <input
          type="number"
          min="0"
          max="100"
          value={selectedProject.avancementPhysique}
          onChange={(e) =>
            setSelectedProject({ ...selectedProject, avancementPhysique: Number(e.target.value) })
          }
        />
      </div>

      <div className="form-group">
        <label>Avancement Financier (%)</label>
        <input
          type="number"
          min="0"
          max="100"
          value={selectedProject.avancementFinancier}
          onChange={(e) =>
            setSelectedProject({ ...selectedProject, avancementFinancier: Number(e.target.value) })
          }
        />
      </div>

      <div className="form-group">
        <label>Observations</label>
        <textarea
          value={selectedProject.observations}
          onChange={(e) =>
            setSelectedProject({ ...selectedProject, observations: e.target.value })
          }
        />
      </div>

      <button type="submit">Enregistrer</button>
    </form>
  </div>
)}
            
          </div>
        )}
        

      </div>
 } </div>
);
}

export default Utilisateur;