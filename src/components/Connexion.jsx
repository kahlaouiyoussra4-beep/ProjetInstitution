import { useNavigate } from 'react-router-dom';
import './Connexion.css';
import Header from './Header';
import { useState } from 'react';

function Connexion() {
  const navigate=useNavigate()
  const [error,setError]=useState("")
  const handleSubmit=(e)=>{
    e.preventDefault();
    const usename=e.target[0].value;
    const password=e.target[1].value;
    if(usename==="admin" && password==="1234"){
      setError("");
      navigate("/menu")
    }
    else{
      setError("Nom d'utilisateur ou mot de passe incerrect !")
    }
  }
  return (
    <div className='page-container'>
    <Header/>
      <div className="connexion-container">
      <h1>Connexion</h1>
      <p>Veuillez entrer vos informations pour accéder à votre compte</p>

      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Nom d'utilisateur" required />
        <input type="password" placeholder="Mot de passe" required />

        <button type="submit">Se connecter</button>
      </form>
      {error && <p style={{color:"red",fontSize:"17px",marginTop:"15px",fontWeight:500}}>{error}</p>}

      <p className="forgot-password">
        <span>Mot de passe oublié ?</span> <a href="/reset-password">Cliquez ici pour le réinitialiser</a>
      </p>
    </div>
    </div>
  
  );
}

export default Connexion;