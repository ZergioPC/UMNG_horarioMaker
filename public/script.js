const qParams = new URLSearchParams(window.location.search)  // Recibe los QueryParams de la URL
const $alert = document.getElementById("alert");

if(qParams.has("error") && qParams.get("error")==="1"){
  const $p = document.createElement("p");

  if((qParams.has("pass"))){
    $p.innerText = "Contraseña Incorrecta";
  }else{
    $p.innerText = "Usuario No encontrado";
  }
  $alert.appendChild($p);
}
