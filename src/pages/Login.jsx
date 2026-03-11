import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import api from "../api";


export default function Login(){

const navigate = useNavigate();

const [email,setEmail] = useState("");
const [password,setPassword] = useState("");

const login = async(e)=>{

e.preventDefault();

try{

const res = await axios.post(
"http://localhost/numeros-y-futbol/backend/login.php",
{
email,
password
}
);


localStorage.setItem("user",JSON.stringify(res.data));

if(res.data.rol === "admin"){
navigate("/dashboard");
}else{
navigate("/");
}

}catch{

alert("Credenciales incorrectas");

}

};

return(

<form onSubmit={login}>

<input
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
required
/>

<input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
required
/>

<button type="submit">
Login
</button>

</form>

);

}