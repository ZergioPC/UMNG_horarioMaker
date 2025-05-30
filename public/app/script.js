//MARK: VARIABLES DOM

const $horario = document.getElementById("horario");
const $horarioHoras = document.getElementById("horario-horas");
const $horarioDias = document.getElementById("horario-dias");
const $pCreditos = document.getElementById("creditos");

const $ulMaterias = document.getElementById("listadoMaterias");
const $asideClases = document.getElementById("aside-listaMaterias");
const $asideGrupos = document.getElementById("aside-listaGrupos");
const $btnAside = document.getElementById("btnMaterias");
const $iconArrow = $btnAside.childNodes[1];
$btnAside.addEventListener('click',(event)=>{
    $asideClases.classList.toggle('ocultar-listaMaterias');    
    $iconArrow.classList.toggle("rotate-180");
    event.target.classList.toggle("btnMateriasFlat");
});

const $divUsuario = document.getElementById("datosEstudiante");
const $btnUserInfo = document.getElementById("boton-userInfo");
$btnUserInfo.addEventListener('click',()=>{
    $btnUserInfo.classList.toggle("rotate-360");
    $showUserArticle($btnUserInfo,$divUsuario.classList.contains("userinfo-show"));
});

const $btnPrint = document.getElementById("btnImprimir");
const $divPrint = document.getElementById("imprimirView");

//MARK: Variables

const horario = Array.from(
    { length: 12 }, () => Array(6).fill()           // [Hora][Dia]
); 
const listaColores = [ 
    "#c4d7f5","#d0c4f5","#eec4f5",
    "#f5c4c4","#f5d3c4","#f5f1c4",
    "#d8f5c4","#c4f5cd","#c4f5e8"];

let colorActual = 0;

let maxCreditos = 99;
let estCreditos = 0;
let materiasListado = []

// variables que gestionan en caso de superposición de materias
let auxMateriasSuperpuestas = false;
let auxDiasSuperpuestos = [];
let auxNodosSuperpuestos = [];
let auxBtnsSuperpuestos = []
let auxCreditos = 0;

//MARK: Clase de Nodo

class Nodo{
    constructor(id){
        this.id = id;
        this.tieneMateria = false;
        this.materia = "empty";
        this.grupo = "empty";
        this.dias = [];
        this.prioridad = false;
        this.ogData = null
        this.creditos = 0;
        this.domButton = null;
        this.color = "";
    }
    
    default(){
        this.id = -1;
        this.tieneMateria = false;
        this.materia = "empty";
        this.grupo = "empty";
        this.dias = [];
        this.prioridad = false;
        if(this.domButton != null){
            this.domButton.disabled = false;
        }
    }
    
    actualizar(nombre,grupo,creditos,btn,id,dias,color){
        if(this.tieneMateria){
            auxMateriasSuperpuestas = true;
            auxDiasSuperpuestos = this.dias.concat(dias);
            auxCreditos = this.creditos + creditos;
            auxNodosSuperpuestos = [this.id, id];
            auxBtnsSuperpuestos =  [this.domButton, btn];
            
            this.domButton = btn;
            this.domButton.disabled = true;

            this.materia = this.ogData.materia;
            this.grupo = this.ogData.grupo;
            this.dias = this.ogData.dias;
            this.creditos = this.ogData.creditos;

            this.materia = this.materia + "/" + nombre;
            this.grupo = this.grupo + "/" + grupo;
        }else{
            this.id = id;
            this.color = color;
            this.domButton = btn;
            this.domButton.disabled = true;
            this.tieneMateria = true;
            this.materia = nombre;
            this.grupo = grupo;
            this.dias = dias;
            this.creditos = creditos;
            this.ogData = {
                materia:this.materia,
                grupo:this.grupo,
                dias:this.dias,
                creditos:creditos
            }
        }
    }

    borrar(callback){
        /* Sí hay superposición de materias, no se puede agregar
        o borrar otro nodo hasta solucionar la solucionar la superposición */

        const verificar = auxNodosSuperpuestos.some(id => this.id == id);

        if(auxMateriasSuperpuestas){
            if(verificar){
                callback(auxNodosSuperpuestos); 
                auxBtnsSuperpuestos.forEach(btn => {
                    btn.disabled = false;
                });
                estCreditos = estCreditos - auxCreditos;
                auxMateriasSuperpuestas = false;
                dibujarTabla($horario)
            }else{
                alert("Solucione primero el cruce de materias!");
            }
        }else{
            callback([this.id]);
            estCreditos = estCreditos - this.creditos;
            dibujarTabla($horario)
        }
    }
    
    dibujar(){
        const div = document.createElement("div");
        if(!this.tieneMateria){
            const p = document.createElement("p");
                p.innerText = this.materia;
            div.appendChild(p);
        }else{
            const pMateria = document.createElement("p");
            const pGrupo = document.createElement("p");
            const btn = document.createElement("button");
            const img = document.createElement('img');

            pMateria.innerText = this.materia;
            pGrupo.innerText = this.grupo;
            
            img.src = "/assets/UI-nodo-borrar.svg"
            btn.appendChild(img);
            btn.addEventListener("click",()=>{              // Paso un callback como parametro que permita
                this.borrar(function(ids){                  // usar la función "buscarMateria()" recursivamente
                    ids.forEach(id=>{
                        const nodos = buscarMateria(id);    // dependiendo sí hay superposición de materias, y 
                        nodos.forEach(nodo => {             // activar el metodo "default()" de cada nodo correspondiente
                            nodo.default();
                        });
                    });
                })
            })
            
            div.classList.add("nodo");
            if(auxMateriasSuperpuestas){
                div.style.backgroundColor = "#ff0000";
            }else{
                div.style.backgroundColor = this.color;
            }

            div.appendChild(pMateria);
            div.appendChild(pGrupo);
            div.appendChild(btn);
        }
        return div;
    }
}

//MARK: FUNCIONES DOM

(function(){
    const dias = ["Lunes","Martes","Miercoles","Jueves","Viernes","Sabado"];

    dias.forEach(dia => {
        const p = document.createElement('p');
        p.innerText = dia;
        $horarioDias.appendChild(p);
    });


    for (let hora = 7; hora < 19; hora++) {         // Dibujar las Horas de
        const p = document.createElement('p');      // la tabla 
        if(hora < 10){
            p.innerText = `0${hora}:00`;
        }else{
            p.innerText = `${hora}:00`;
        }
        $horarioHoras.appendChild(p);
    }
})();

function colorSelector(){
    if(colorActual+1 >= listaColores.length)
        colorActual = 0;
    else{
        colorActual++;
    }
}

function $showUserArticle(btn,visible){
    btn.disabled = true;
    btn.firstElementChild.classList.toggle("userIMG-hide");
    btn.lastElementChild.classList.toggle("userIMG-hide");
    
    setTimeout(function(){btn.disabled = false},1000);

    if(!visible){
        $divUsuario.classList.add("userinfo-show");
        $divUsuario.classList.remove("userinfo-content-hide");
        setTimeout(function(){
            $divUsuario.classList.add("userinfo-grid");
        },10);
        setTimeout(function(){
            for (const element of $divUsuario.children) {
                element.classList.add("userinfo-content-show")
            }
        },700);
    }else{
        for (const element of $divUsuario.children) {
            element.classList.remove("userinfo-content-show")
        }
        setTimeout(function(){
            $divUsuario.classList.add("userinfo-content-hide");
        },250);
        setTimeout(function(){
            $divUsuario.classList.remove("userinfo-grid");
            $divUsuario.classList.remove("userinfo-show");
        },610);
    }
}

function $listaDeMaterias(dataList,dataInfo){
    /* Dibujar las materias en la interfáz */
    materiasListado = dataInfo;

    dataList.forEach( materia => {
        const mat = dataInfo.find(info => info.id == materia[0]);
        const $li = document.createElement("li");
        const $btn = document.createElement("button");
        $btn.innerText = mat.nombre;
        $btn.addEventListener("click",(event)=>{
            if(estCreditos+mat.creditos <= maxCreditos && !auxMateriasSuperpuestas){
                $listaDeGrupos(materia[0],materia[1],event.target);
                $asideGrupos.classList.toggle("ocultar-aside-listaGrupos");
            }else if(auxMateriasSuperpuestas){
                alert("hay materias superpuestas!\nBorrelas primero");
            }else{
                alert("Numero de creditos superado");
            }
        });
        $li.appendChild($btn);
        $ulMaterias.appendChild($li);
    })
}
function $listaDeGrupos(codigo,prioridad,btnPadre){
    /* Dibujar los grupos en la interfáz */
    $asideGrupos.innerHTML = "";
    const materia = materiasListado.find(mat => mat.id == codigo);

    for (const grupo in materia.grupos) {
        const $btn = document.createElement("button");

        if(prioridad === 1){
            $btn.innerText = grupo + " ⚠️";
        }else{
            $btn.innerText = grupo;
        }
        
        $btn.addEventListener("click",()=>{
            if($asideClases.classList.contains('ocultar-listaMaterias')){
                $asideClases.classList.remove('ocultar-listaMaterias');
                $iconArrow.classList.remove("rotate-180");
            }
            $asideGrupos.classList.toggle("ocultar-aside-listaGrupos")
            $btnAside.classList.toggle("btnMateriasFlat");
            estCreditos = estCreditos + materia.creditos;
            materia.grupos[grupo].forEach(dia => {
                horario[dia[0]][dia[1]].actualizar(             // Se pasa el Boton Padre para que sea el
                    materia.nombre,grupo,materia.creditos,      // el nodo quien controle sí está o no activo
                    btnPadre,materia.id,materia.grupos[grupo],
                    listaColores[colorActual]
                );        
                dibujarTabla($horario);
            });
            colorSelector();
        });
        $asideGrupos.appendChild($btn);
    }
}

function $datosEstudiante(nombre,codigo,foto){
    $divUsuario.children[1]
    
    $divUsuario.children[1].innerText = nombre;
    $divUsuario.children[2].innerText = codigo
    $divUsuario.children[0].src = "/assets/img/"+foto;    
}

function $mostrarCreditos(){
    $pCreditos.innerHTML = "<b>Creditos: </b>" + estCreditos + " de " + maxCreditos;
}

//MARK: GET DATA
const USUARIO = new URLSearchParams(window.location.search).get("user");

fetch("/materias/get",{
    method:"POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user: USUARIO })
    }
    ).then(res => res.json()
    ).then(data => {
        // En el array llegan [UsuarioInfo][Materias]
        $btnUserInfo.firstElementChild.src = "/assets/img/" + data[0].avatar;
        maxCreditos = data[0].creditos;
        $datosEstudiante(
            data[0].nombre,
            data[0].codigo,
            data[0].avatar
        );
        $listaDeMaterias(data[0].materias,data[1]);
        $mostrarCreditos()
    });

//MARK: Horario

(function(){
    for (let hora = 0; hora < horario.length; hora++) {
        for (let dia = 0; dia < horario[hora].length; dia++) {
            horario[hora][dia] = new Nodo(-1);
        }
    }
})(); 

function buscarMateria(code){                           // Busca en el array "horario" todos los
    let valor = [];                                     // todos los nodos que coincidan con el
    for (let i = 0; i < horario.length; i++) {          // id de la materia y los retorna en un
        for (let j = 0; j < horario[i].length; j++) {   // array
            if(horario[i][j].id === code){
                valor.push(horario[i][j]);
            }
        }
    }
    return valor;
}

//MARK: Dibujar Tabla

function dibujarTabla(element) {
    const tabla = document.createElement("table");

    horario.forEach(fila => {
        const tr = document.createElement("tr");
        fila.forEach(celda => {
            const td = document.createElement("td");
            td.appendChild(celda.dibujar())
            tr.appendChild(td);
        });
        tabla.appendChild(tr);
    });

    element.innerHTML = "";
    element.appendChild(tabla);
    $mostrarCreditos()
}

dibujarTabla($horario)

$btnPrint.addEventListener("click",()=>{
    const dias = ["Lunes","Martes","Miercoles","Jueves","Viernes","Sabado"];
    const materias = [];
    const materiasID = [];

    const $sectionHorario = document.createElement("section");
    const $divDias = document.createElement("div");
    const $divHoras = document.createElement("div");
    const $divTabla = document.createElement("div");

    const $sectionTitulo = document.createElement("section");
    const $h1 =  document.createElement("h1");

    const $sectionLog = document.createElement("section");
    const $p = document.createElement("p");
    const $listado = document.createElement("ul");

    dias.forEach(dia => {
        const p = document.createElement('p');
        p.innerText = dia;
        $divDias.appendChild(p);
    });

    for (let hora = 7; hora < 19; hora++) {         // Dibujar las Horas de
        const p = document.createElement('p');      // la tabla 
        if(hora < 10){
            p.innerText = `0${hora}:00`;
        }else{
            p.innerText = `${hora}:00`;
        }
        $divHoras.appendChild(p);
    }
    dibujarTabla($divTabla);
    $divPrint.innerHTML = "";

    $divDias.classList.add('print-horario-dias');
    $divHoras.classList.add('print-horario-horas');
    $divTabla.classList.add('print-horario-tabla');

    $h1.innerText = "Horario Maker";
    $sectionTitulo.appendChild($h1)

    $sectionHorario.appendChild($divDias);
    $sectionHorario.appendChild($divHoras);
    $sectionHorario.appendChild($divTabla);

    $sectionLog.classList.add('print-lista');

    horario.forEach(hora => {
        hora.forEach(nodo => {
            if(nodo.tieneMateria && !materiasID.includes(nodo.id)){
                materias.push(nodo);
                materiasID.push(nodo.id);
            }
        });
    });
    
    materias.forEach(nodo =>{
        const $li = document.createElement("li");
        $li.innerText = nodo.materia + " - " + nodo.grupo;
        $listado.appendChild($li);
    });

    $p.innerText = "Lista de Materias";

    $sectionLog.appendChild($p);
    $sectionLog.appendChild($listado);

    $divPrint.appendChild($sectionTitulo);
    $divPrint.appendChild($sectionHorario);
    $divPrint.appendChild($sectionLog);
    print()
})