const mongoose = require("mongoose");
const cors = require("cors");

const projetRoutes = require("./routes/projets");
const authRoutes=require("./routes/auth")
const userRoutes=require("./routes/users")
const app = express();
app.post("/api/test-login",(req,res)=>{
res.json({token:"fake-token",utilisateur:req.body.utilisateur})
})

app.use(cors());
app.use(express.json());

// connexion MongoDB
mongoose.connect("mongodb+srv://teamuser:teamuser2026@cluster0.7yns9lt.mongodb.net/gestion-projets")
.then(() => console.log("MongoDB atlas connecté ✅"))
.catch(err => console.log(err));

// routes
app.use("/api/projets", projetRoutes);
const dashboardRoutes=require("./routes/dashboard")
app.use("/api/dashboard",dashboardRoutes)
app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);

app.listen(5000, () => {
console.log("Serveur lancé sur http://localhost:5000");
});