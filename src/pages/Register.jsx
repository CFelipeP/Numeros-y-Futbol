import { useState } from "react";
import axios from "axios";

export default function Register(){

const [nombre,setNombre] = useState("");
const [email,setEmail] = useState("");
const [password,setPassword] = useState("");

const register = async(e)=>{

e.preventDefault();

try{

    console.log({
nombre,
email,
password
});

await axios.post(
"http://localhost/Numeros-y-Futbol/backend/register.php",
{
nombre: nombre,
email: email,
password: password
}
);

alert("Usuario creado");

}catch(error){

console.log(error);
alert("Error al registrar");

}

};

return(

<form onSubmit={register}>

<input
placeholder="Nombre"
value={nombre}
onChange={(e)=>setNombre(e.target.value)}
/>

<input
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

<input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

<button type="submit">
Registrarse
</button>

</form>

);

}