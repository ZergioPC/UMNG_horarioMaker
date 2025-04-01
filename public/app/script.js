//MARK: Variables
const horario = Array.from(
    { length: 12 }, () => Array(6).fill()           // [Hora][Dia]
); 
const listaColores = [ 
    ["#c4d7f5",false],["#d0c4f5",false],["#eec4f5",false],      // [color, en uso]
    ["#f5c4c4",false],["#f5d3c4",false],["#f5f1c4",false],
    ["#d8f5c4",false],["#c4f5cd",false],["#c4f5e8",false]];

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
        this.domButton = null
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
    
    actualizar(nombre,grupo,creditos,btn,id,dias){
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

            console.log(`${this.materia} ya se encuentra en este espacio`);
        }else{
            this.id = id;
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
                console.log(auxBtnsSuperpuestos)
                auxBtnsSuperpuestos.forEach(btn => {
                    btn.disabled = false;
                });
                estCreditos = estCreditos - auxCreditos;
                auxMateriasSuperpuestas = false;
                dibujarTabla()
            }else{
                console.log("Solucione primero el cruce de materias!")
            }
        }else{
            callback([this.id]);
            estCreditos = estCreditos - this.creditos;
            dibujarTabla()
        }
        console.log("borrado")
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

            pMateria.innerText = this.materia;
            pGrupo.innerText = this.grupo;
            btn.innerText = "E"
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

            div.appendChild(pMateria);
            div.appendChild(pGrupo);
            div.appendChild(btn);
        }
        return div;
    }
}

//MARK: DOM

const $horario = document.getElementById("horario");
const $horarioHoras = document.getElementById("horario-horas");
const $horarioDias = document.getElementById("horario-dias");
const $ulMaterias = document.getElementById("listadoMaterias");
const $divUsuario = document.getElementById("datosEstudiante");
const $pCreditos = document.getElementById("creditos");
const $asideClases = document.getElementById("aside-listaMaterias");
const $asideGrupos = document.getElementById("aside-listaGrupos");
const $btnAside = document.getElementById("btnMaterias").addEventListener('click',()=>{
    $asideClases.classList.toggle('ocultar-listaMaterias');
});
const $btnUserInfo = document.getElementById("boton-userInfo").addEventListener('click',()=>{
    $divUsuario.classList.toggle("userinfo-hide");
});

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

function $listaDeMaterias(dataList,dataInfo){
    /* Dibujar las materias en la interfáz */
    materiasListado = dataInfo;

    dataList.forEach( materia => {
        const mat = dataInfo.find(info => info.id == materia[0]);
        const $li = document.createElement("li");
        const $btn = document.createElement("button");
        $btn.innerText = mat.nombre;
        $btn.addEventListener("click",()=>{
            if(estCreditos+mat.creditos <= maxCreditos && !auxMateriasSuperpuestas){
                $listaDeGrupos(materia[0],materia[1],$btn);
                $asideGrupos.classList.toggle("ocultar-aside-listaGrupos");
            }else if(auxMateriasSuperpuestas){
                console.log("hay materias superpuestas!")
            }else{
                console.log("Numero de creditos superado")
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
            $btn.innerText = grupo + " (!)";            
        }else{
            $btn.innerText = grupo;
        }
        
        $btn.addEventListener("click",()=>{
            $asideGrupos.classList.toggle("ocultar-aside-listaGrupos");
            estCreditos = estCreditos + materia.creditos;
            materia.grupos[grupo].forEach(dia => {
                horario[dia[0]][dia[1]].actualizar(             // Se pasa el Boton Padre para que sea el
                    materia.nombre,grupo,materia.creditos,      // el nodo quien controle sí está o no activo
                    btnPadre,materia.id,materia.grupos[grupo]
                );        
                dibujarTabla();
            });
        });
        $asideGrupos.appendChild($btn);
    }
}

function $datosEstudiante(nombre,codigo,foto){
    const pNombre = document.createElement("p");        // Dibuja los datos del
    const pCodigo = document.createElement("p");        // estudiante
    const img = document.createElement("img");
    
    pNombre.innerText = nombre;
    pCodigo.innerText = codigo
    img.src = foto;
    
    $divUsuario.innerHTML = "";
    $divUsuario.appendChild(img);
    $divUsuario.appendChild(pNombre);
    $divUsuario.appendChild(pCodigo);
}

function $mostrarCreditos(){
    $pCreditos.innerHTML = "<b>Creditos:</b>" + estCreditos + " de " + maxCreditos;
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

function dibujarTabla() {
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

    $horario.innerHTML = "";
    $horario.appendChild(tabla);
    $mostrarCreditos()
}

dibujarTabla()