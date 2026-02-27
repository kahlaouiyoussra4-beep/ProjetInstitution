import { useState } from "react";
import Menu from "./Menu";
import "./ADDProjet.css";
import { useNavigate } from "react-router-dom";

function AjouterProjet() {
  const [errors, setErrors] = useState({});
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Id: '',
    intitule: '',
    commun: '',
    lieu: '',
    axe: '',
    sousAxe: '',
    objectifs: '',
    cout: '',
    partenaires: [{ name: '', cout: '' }],
    composantes: '',
    delai: '',
    dateDebut: '',
    dateFin: '',
    avancementPhysique: '',
    avancementFinancier: '',
    observations: '',
  });

  const addPartenaire = () => {
    setFormData({
      ...formData,
      partenaires: [...formData.partenaires, { name: '', cout: '' }],
    });
  };

  const handlePartenaireChange = (index, field, value) => {
    const newPartenaires = [...formData.partenaires];
    newPartenaires[index][field] = value;
    setFormData({ ...formData, partenaires: newPartenaires });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(""); 
    const newErrors = {};

    // Validation
    for (let key in formData) {
      if (key === "partenaires") {
        formData.partenaires.forEach((p, i) => {
          if (!p.name) newErrors[`partenaire${i}`] = 'Champ obligatoire';
          if (!p.cout) newErrors[`coutPartenaire${i}`] = 'Champ obligatoire';
        });
      } else if (!formData[key]) {
        newErrors[key] = 'Champ obligatoire';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const dataToSend = {
      ...formData,
      Id: Number(formData.Id),
      cout: Number(formData.cout),
      partenaires: formData.partenaires.map(p => ({
        name: p.name,
        cout: Number(p.cout)
      })),
      dateDebut: new Date(formData.dateDebut),
      dateFin: new Date(formData.dateFin),
      avancementPhysique: Number(formData.avancementPhysique),
      avancementFinancier: Number(formData.avancementFinancier)
    };

    const token = localStorage.getItem("token");
    if (!token) {
      setErrorMsg("Token manquant, veuillez vous reconnecter !");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/projets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization":`Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Erreur serveur ❌");
      }

     
      navigate("/FicheProjet");

    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="fiches-page">
      <Menu />
      <div className="fiches-container">
        <h1>Fiche de Projet</h1>
        <form onSubmit={handleSubmit}>
        
          <div className="form-row">
            <label>Id <span className="required">*</span></label>
            <input name="Id" type="number" value={formData.Id} min={1} onChange={handleChange} className={errors.Id ? 'error' : ''} />
            {errors.Id && <span className="error-msg">{errors.Id}</span>}
          </div>

          <div className="form-row">
            <label>Intitulé du projet <span className="required">*</span></label>
            <input name="intitule" type="text" value={formData.intitule} onChange={handleChange} className={errors.intitule ? 'error' : ''} />
            {errors.intitule && <span className="error-msg">{errors.intitule}</span>}
          </div>

          <div className="form-row">
            <label>Commun <span className="required">*</span></label>
            <select name="commun" value={formData.commun} onChange={handleChange} className={errors.commun ? 'error' : ''}>
              <option value="">-- Choisir --</option>
              <option value="Commun A">Oujda Angad</option>
              <option value="Commun B">Berkan</option>
              <option value="Commun C">Commun C</option>
            </select>
            {errors.commun && <span className="error-msg">{errors.commun}</span>}
          </div>

          <div className="form-row">
            <label>Lieu (Quartier)<span className="required">*</span></label>
            <input name="lieu" type="text" value={formData.lieu} onChange={handleChange} className={errors.lieu ? 'error' : ''} />
            {errors.lieu && <span className="error-msg">{errors.lieu}</span>}
          </div>
          <div className="form-row">
            <label>Axe <span className="required">*</span></label>
            <input name="axe" type="text" value={formData.axe} onChange={handleChange} className={errors.axe ? 'error' : ''} />
            {errors.axe && <span className="error-msg">{errors.axe}</span>}
          </div>
          <div className="form-row">
            <label>Sous-Axe <span className="required">*</span></label>
            <input name="sousAxe" type="text" value={formData.sousAxe} onChange={handleChange} className={errors.sousAxe ? 'error' : ''} />
            {errors.sousAxe && <span className="error-msg">{errors.sousAxe}</span>}
          </div>

      
          <div className="form-row">
            <label>Objectifs <span className="required">*</span></label>
            <textarea name="objectifs" value={formData.objectifs} onChange={handleChange} className={errors.objectifs ? 'error' : ''} />
            {errors.objectifs && <span className="error-msg">{errors.objectifs}</span>}
          </div>


          <div className="form-row">
            <label>Coût (DH) <span className="required">*</span></label>
            <input name="cout" type="number" value={formData.cout} onChange={handleChange} min={1} className={errors.cout ? 'error' : ''} />
            {errors.cout && <span className="error-msg">{errors.cout}</span>}
          </div>

          <div className="form-row">
            <label>Partenaires <span className="required">*</span></label>
            {formData.partenaires.map((p, i) => (
              <div key={i} className="partenaire-row">
                <input placeholder="Nom partenaire" value={p.name} onChange={(e) => handlePartenaireChange(i, 'name', e.target.value)} className={errors[`partenaire${i}`] ? 'error' : ''} />
                <input placeholder="Coût partenaire (DH)" type="number" value={p.cout} onChange={(e) => handlePartenaireChange(i, 'cout', e.target.value)} className={errors[`coutPartenaire${i}`] ? 'error' : ''} />
                {i === formData.partenaires.length - 1 && <button type="button" className="add-btn" onClick={addPartenaire}>+</button>}
                {errors[`partenaire${i}`] && <span className="error-msg">{errors[`partenaire${i}`]}</span>}
              </div>
            ))}
          </div>

          
          <div className="form-row">
            <label>Composantes du projet <span className="required">*</span></label>
            <textarea name="composantes" value={formData.composantes} onChange={handleChange} className={errors.composantes ? 'error' : ''} />
            {errors.composantes && <span className="error-msg">{errors.composantes}</span>}
          </div>

          <div className="form-row">
            <label>Délai d'extension (Nombre de Mois) <span className="required">*</span></label>
            <input name="delai" type="number" min={1} value={formData.delai} onChange={handleChange} className={errors.delai ? 'error' : ''} />
            {errors.delai && <span className="error-msg">{errors.delai}</span>}
          </div>

          <div className="form-row">
            <label>Date début <span className="required">*</span></label>
            <input type="date" name="dateDebut" value={formData.dateDebut} onChange={handleChange} className={errors.dateDebut ? 'error' : ''} />
            {errors.dateDebut && <span className="error-msg">{errors.dateDebut}</span>}
          </div>
          <div className="form-row">
            <label>Date fin <span className="required">*</span></label>
            <input type="date" name="dateFin" value={formData.dateFin} onChange={handleChange} className={errors.dateFin ? 'error' : ''} />
            {errors.dateFin && <span className="error-msg">{errors.dateFin}</span>}
          </div>

          <div className="form-row">
            <label>Etat d'avancement physique (%) <span className="required">*</span></label>
            <input type="number" name="avancementPhysique" min="0" max="100" value={formData.avancementPhysique} onChange={handleChange} className={errors.avancementPhysique ? 'error' : ''} />
            {errors.avancementPhysique && <span className="error-msg">{errors.avancementPhysique}</span>}
          </div>
          <div className="form-row">
            <label>Etat d'avancement financière (%) <span className="required">*</span></label>
            <input type="number" name="avancementFinancier" min="0" max="100" value={formData.avancementFinancier} onChange={handleChange} className={errors.avancementFinancier ? 'error' : ''} />
            {errors.avancementFinancier && <span className="error-msg">{errors.avancementFinancier}</span>}
          </div>

          <div className="form-row">
            <label>Observations <span className="required">*</span></label>
            <textarea name="observations" value={formData.observations} onChange={handleChange} className={errors.observations ? 'error' : ''} />
            {errors.observations && <span className="error-msg">{errors.observations}</span>}
          </div>

          <button type="submit" className="submit-btn">Inscrire</button>
          {errorMsg && <div className="error-msg">{errorMsg}</div>}
        </form>
      </div>
    </div>
  );
}

export default AjouterProjet;