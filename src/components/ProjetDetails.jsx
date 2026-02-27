import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Menu from "./Menu";
import "./ProjetDetails.css";

function ProjetDetails() {

  const { id } = useParams();
  const [projet, setProjet] = useState(null);

useEffect(() => {
  const token = localStorage.getItem("token");

  fetch(`http://localhost:5000/api/projets/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => setProjet(data))
    .catch(err => console.log(err));
}, [id]);

  if (!projet) return <div className="loading">Chargement...</div>;

  return (
    <div className="fiche-page">
      <Menu />

      <div className="detail-page">

        <h1 className="detail-title">{projet.intitule}</h1>

        <div className="detail-card">

          {/* ===== INFOS GENERALES ===== */}
          <div className="info-grid">

            <div className="info-item">
              <div className="info-label">Commun</div>
              <div className="info-value">{projet.commun}</div>
            </div>

            <div className="info-item">
              <div className="info-label">Lieu</div>
              <div className="info-value">{projet.lieu}</div>
            </div>

            <div className="info-item">
              <div className="info-label">Axe</div>
              <div className="info-value">{projet.axe}</div>
            </div>

            <div className="info-item">
              <div className="info-label">Sous axe</div>
              <div className="info-value">{projet.sousAxe}</div>
            </div>

            <div className="info-item">
              <div className="info-label">Coût total</div>
              <div className="info-value">{projet.cout} DH</div>
            </div>

            <div className="info-item">
              <div className="info-label">Délai</div>
              <div className="info-value">{projet.delai} mois</div>
            </div>

            <div className="info-item">
              <div className="info-label">Date début</div>
              <div className="info-value">
                {new Date(projet.dateDebut).toLocaleDateString()}
              </div>
            </div>

            <div className="info-item">
              <div className="info-label">Date fin</div>
              <div className="info-value">
                {new Date(projet.dateFin).toLocaleDateString()}
              </div>
            </div>

          </div>

          {/* ===== OBJECTIFS ===== */}
          <div className="section">
            <div className="section-title">Objectifs du projet</div>
            <div className="text-block">{projet.objectifs}</div>
          </div>

          {/* ===== OBSERVATIONS ===== */}
          <div className="section">
            <div className="section-title">Observations</div>
            <div className="text-block">{projet.observations}</div>
          </div>

          {/* ===== AVANCEMENT PHYSIQUE ===== */}
          <div className="section">
            <div className="section-title">
              Avancement physique ({projet.avancementPhysique}%)
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${projet.avancementPhysique}%` }}
              />
            </div>
          </div>

          {/* ===== AVANCEMENT FINANCIER ===== */}
          <div className="section">
            <div className="section-title">
              Avancement financier ({projet.avancementFinancier}%)
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width:` ${projet.avancementFinancier}%` }}
              />
            </div>
          </div>

          {/* ===== PARTENAIRES ===== */}
          <div className="section">
            <div className="section-title">Partenaires</div>

            {projet.partenaires.map((p, i) => (
              <div key={i} className="partenaire-item">
                <span>{p.name}</span>
                <span>{p.cout} DH</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

export default ProjetDetails;