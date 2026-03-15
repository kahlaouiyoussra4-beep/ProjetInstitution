import { useNavigate } from 'react-router-dom';
import './Connexion.css';
import Header from './Header';
import { useState } from 'react';

function Connexion() {
  const navigate=useNavigate()
  const [error,setError]=useState("")
 const [utilisateur,setUtilisateur]=useState("")
 const [password,setPassword]=useState("")
  const handleSubmit= async (e)=>{
    
    e.preventDefault();
   
    // const username = e.target[0].value;
    // const password = e.target[1].value;
    // console.log(username)

    // const user = users.find(
    //   (u) => u.username === username && u.password === password
    // );

    // if (!user) {
    //   setError("Nom d'utilisateur ou mot de passe incorrect ");
    //   return;
    // }
    // localStorage.setItem("token", "fake-token");
    // navigate("/Dashboard");

     try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ utilisateur, password })
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Erreur connexion");
      return;
    }

  
    localStorage.setItem("token", data.token);
    localStorage.setItem("droits", JSON.stringify(data.droits));
    localStorage.setItem("role",data.role);
    localStorage.setItem("isActive",data.isActive)
    //  if(!data.isActive){
    //   setError("Votre compte est déactivé.Contactez l'administrateur.");
    //   return
    // }

    navigate("/Dashboard");

  } catch (err) {
    setError("Erreur serveur");
    console.log(err)
  }
  }
  return (
    <div className='page-container'>
    <Header/>
      <div className="connexion-container">
      <h1>Connexion</h1>
      <p>Veuillez entrer vos informations pour accéder à votre compte</p>

      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Nom d'utilisateur" required value={utilisateur} onChange={(e)=>setUtilisateur(e.target.value)}/>
        <input type="password" placeholder="Mot de passe" required value={password} onChange={(e)=>setPassword(e.target.value)}/>

        <button type="submit">Se connecter</button>
      </form>
      {error && <p style={{color:"red",fontSize:"17px",marginTop:"15px",fontWeight:500}}>{error}</p>}

      <p className="forgot-password">
        <span>Mot de passe oublié ?</span> <a href="/reset-password">Cliquez ici pour le réinitialiser</a>
      </p>
    </div>
     <div className='zellige'></div>
        <div className='zellige-right'></div>
          <div className='zellige-side'></div>
        <div className='zellige-left-side'></div>
    </div>
  
  );
}

export default Connexion;
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./Connexion.css";

// function Connexion() {
//   const navigate = useNavigate();
//   const [error, setError] = useState("");

//   const users = [
//     { username: "yousra", password: "yousra2026" },
//   ];

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const username = e.target[0].value;
//     const password = e.target[1].value;

//     const user = users.find(
//       (u) => u.username === username && u.password === password
//     );

//     if (!user) {
//       setError("Nom d'utilisateur ou mot de passe incorrect ❌");
//       return;
//     }

//     localStorage.setItem("token", "fake-token");
//     navigate("/Dashboard");
//   };

//   return (
//     <div className="page-container">
//       <div className="connexion-container">
//         <h1>Connexion</h1>
//         <form onSubmit={handleSubmit}>
//           <input type="text" placeholder="Nom d'utilisateur" required />
//           <input type="password" placeholder="Mot de passe" required />
//           <button type="submit">Se connecter</button>
//         </form>
//         {error && <p style={{ color: "red", fontSize: 17 }}>{error}</p>}
//       </div>
//     </div>
//   );
// }

// export default Connexion;