import { Link } from 'react-router-dom'
import './Landing.css'
import Header from './Header'
function Landing(){
    return(
       
        <body>
        <div className="landing-container">
        <Header/>
           <Link to="/login"><button>Entrer</button></Link> 
        </div>
        </body>
        
    )
}

export default Landing