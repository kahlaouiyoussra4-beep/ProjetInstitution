import Menu from "./Menu";
import { useEffect, useState } from "react";
import "./Dashboard.css";

function Dashboard() {
  const droits=JSON.parse(localStorage.getItem("droits") || "[]")
  if(!droits.includes("Projet")){
    return <h2>Accés refusé</h2>
  }
  const [projectsCount, setProjectsCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [reportsCount, setReportsCount] = useState(0);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
  const fetchDashboardData = async () => {
    try {

      const token = localStorage.getItem("token");

      const headers = {
        Authorization: `Bearer ${token}`
      };

      // عدد المشاريع
      const projectsRes = await fetch(
        "http://localhost:5000/api/dashboard/projects-count",
        { headers }
      );
      const projectsData = await projectsRes.json();
      setProjectsCount(projectsData.count);

      // عدد المستخدمين
      const usersRes = await fetch(
        "http://localhost:5000/api/dashboard/users-count",
        { headers }
      );
      const usersData = await usersRes.json();
      setUsersCount(usersData.count);

      // التقارير
      const reportsRes = await fetch(
        "http://localhost:5000/api/dashboard/reports",
        { headers }
      );
      const reportsData = await reportsRes.json();
      setReportsCount(reportsData.length);

      const recentActivities = reportsData.map(
        p =>` ✔ Nouveau projet: ${p.intitule}`
      );
      setActivities(recentActivities);

    } catch (err) {
      console.log(err);
    }
  };

  fetchDashboardData();
}, []);

  return (
    <div className="fiche-page">
      <Menu />
      <div className="content-area">
        <h1>Bienvenue dans votre tableau de bord</h1>
        <p>Gérez vos projets, consultez les statistiques et suivez l'activité en temps réel.</p>

        <div className="stats-container">
          <div className="stat-card">
            <h3>Projets actifs</h3>
            <span>{projectsCount}</span>
          </div>

          <div className="stat-card">
            <h3>Utilisateurs</h3>
            <span>{usersCount}</span>
          </div>

          <div className="stat-card">
            <h3>Rapports générés</h3>
            <span>{reportsCount}</span>
          </div>
        </div>

        <div className="activity-box">
          <h2>Activités récentes</h2>
          <ul>
            {activities.map((act, idx) => (
              <li key={idx}>{act}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;