import './Connexion.css';

function Connexion() {
  return (
    
    <div className="connexion-container">
      <h1>Connexion</h1>
      <p>Veuillez entrer vos informations pour accéder à votre compte</p>

      <form>
        <input type="text" placeholder="Nom d'utilisateur" required />
        <input type="password" placeholder="Mot de passe" required />

        <button type="submit">Se connecter</button>
      </form>

      <p className="forgot-password">
        Mot de passe oublié ? <a href="/reset-password">Cliquez ici pour le réinitialiser</a>
      </p>
    </div>
  );
}

export default Connexion;