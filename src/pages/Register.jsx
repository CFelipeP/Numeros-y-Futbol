import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Register(){

const navigate = useNavigate();

const [nombre,setNombre] = useState("");
const [email,setEmail] = useState("");
const [password,setPassword] = useState("");

const register = async (e) => {

e.preventDefault();

try{

const res = await axios.post("/api/register.php", {
nombre,
email,
password
});

if(res.data.success){
alert(res.data.mensaje);
navigate("/login");
}else{
alert("Error: " + res.data.error);
}

}catch(error){

console.log(error);
alert("Error de conexión");

}

};

return(

<div className="register-page">

<nav className="register-navbar">

<h2>Números y Fútbol</h2>

<button
className="back-btn"
onClick={()=>navigate("/")}
>
← Volver
</button>

</nav>

<div className="register-card">

<h1 className="register-title">
Crear Cuenta
</h1>

<form onSubmit={register} className="register-form">

<input
placeholder="Nombre"
value={nombre}
onChange={(e)=>setNombre(e.target.value)}
required
/>

<input
placeholder="Correo electrónico"
value={email}
onChange={(e)=>setEmail(e.target.value)}
required
/>

<input
type="password"
placeholder="Contraseña"
value={password}
onChange={(e)=>setPassword(e.target.value)}
required
/>

<button type="submit">
Registrarse
</button>

</form>

<p className="login-redirect">
¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link>
</p>

</div>

</div>

);

}