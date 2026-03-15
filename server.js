const express= require("express")
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const projetRoutes = require("./routes/projets");
const authRoutes=require("./routes/auth")
const userRoutes=require("./routes/users")
const dashboardRoutes=require("./routes/dashboard");

app.use(cors());
app.use(express.json());
app.post("/api/test-login",(req,res)=>{
res.json({token:"fake-token",utilisateur:req.body.utilisateur})
})



// connexion MongoDB
mongoose.connect("mongodb+srv://teamuser:teamuser2026@cluster0.7yns9lt.mongodb.net/gestion-projets")
.then(() => console.log("MongoDB atlas connecté ✅"))
.catch(err => console.log(err));

// routes
app.use("/api/projets", projetRoutes);
app.use("/api/dashboard",dashboardRoutes);
app.use("/api/users",userRoutes);
app.use("/api/auth",authRoutes);


app.listen(5000, () => {
console.log("Serveur lancé sur http://localhost:5000");
});