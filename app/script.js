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

// variables que gestionan en caso de superposición de materias
let auxMateriasSuperpuestas = false;
let auxDiasSuperpuestos = [];
let auxCreditos = 0;
let auxNodosSuperpuestos = []

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
    
    actualizar(data,btn,id){
        if(this.tieneMateria){
            auxMateriasSuperpuestas = true;
            auxDiasSuperpuestos = this.dias.concat(data.dias);
            auxCreditos = this.creditos + data.creditos;
            auxNodosSuperpuestos = [this.id, data.id]

            this.materia = this.ogData.materia;
            this.grupo = this.ogData.grupo;
            this.dias = this.ogData.dias;
            this.creditos = this.ogData.creditos;

            this.materia = this.materia + "/" + data.nombre;
            this.grupo = this.grupo + "/" + data.grupo;
            
            console.log(`${this.materia} ya se encuentra en este espacio`);
        }else{
            this.id = id;
            this.domButton = btn;
            this.domButton.disabled = true;
            this.tieneMateria = true;
            this.materia = data.nombre;
            this.grupo = data.grupo;
            this.dias = data.dias;
            this.creditos = data.creditos;
            this.ogData = {
                materia:this.materia,
                grupo:this.grupo,
                dias:this.dias,
                creditos:data.creditos
            }
        }
    }

    borrar(callback){
        /* Sí hay superposición de materias, no se puede agregar
        o borrar otro nodo hasta solucionar la solucionar la superposición */

        const verificar = auxNodosSuperpuestos.some(id => this.id == id);
        
        if(auxMateriasSuperpuestas){
            if(verificar){
                auxNodosSuperpuestos.forEach(id => {
                    callback(id); 
                });
                estCreditos = estCreditos - auxCreditos;
                auxMateriasSuperpuestas = false;
                dibujarTabla()
            }else{
                console.log("Solucione primero el cruce de materias!")
            }
        }else{
            callback(this.id);
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
            btn.addEventListener("click",()=>{          // Paso un callback como parametro que permita
                this.borrar(function(id){               // usar la función "buscarMateria()" recursivamente
                    const nodos = buscarMateria(id);    // dependiendo sí hay superposición de materias, y 
                    nodos.forEach(nodo => {             // activar el metodo "default()" de cada nodo correspondiente
                        nodo.default()
                        nodo.domButton.disabled = false;
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
const $aside = document.getElementById("aside-listaMaterias");
const $btnAside = document.getElementById("btnMaterias").addEventListener('click',()=>{
    $aside.classList.toggle('ocultar-listaMaterias');
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

function $listaDeMaterias(data){
    for(const materia in data){                         // Dibujar el listado de
        const li = document.createElement("li");        // materias en la interfaz
        const btn = document.createElement("button");
        
        if(data[materia].prioridad){
            btn.innerText = data[materia].nombre + " - " + data[materia].grupo + " (!)";
        }else{
            btn.innerText = data[materia].nombre + " - " + data[materia].grupo;
        }
        
        btn.addEventListener("click",()=>{
            const auxMateria = data[materia];
            if(estCreditos+auxMateria.creditos <= maxCreditos && !auxMateriasSuperpuestas){
                estCreditos = estCreditos + auxMateria.creditos
                auxMateria.dias.forEach(dia => {
                    horario[dia[0]][dia[1]].actualizar(auxMateria,btn,auxMateria.id);
                    dibujarTabla()
                });
            }else if(auxMateriasSuperpuestas){
                console.log("hay materias superpuestas!")
            }else{
                console.log("Numero de creditos superado")
            }
        })
        li.appendChild(btn);
        $ulMaterias.appendChild(li);
    }
}

function $datosEstudiante(nombre,codigo,foto){
    const pNombre = document.createElement("p");        // Dibuja los datos del
    const pCodigo = document.createElement("p");        // estudiante
    const img = document.createElement("img");
    
    pNombre.innerText = nombre;
    pCodigo.innerText = codigo
    img.src = foto;

    $divUsuario.appendChild(img);
    $divUsuario.appendChild(pNombre);
    $divUsuario.appendChild(pCodigo);
}

function $mostrarCreditos(){
    $pCreditos.innerHTML = "<b>Creditos:</b>" + estCreditos + " de " + maxCreditos;
}

//MARK: GET DATA

fetch('./data.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error al cargar el JSON: ${response.status}`);
        }
        return response.json();
    }).then(data => {       
        maxCreditos = data.creditos;
        $listaDeMaterias(data.materias)
        $datosEstudiante(data.nombre,data.codigo,data.avatar)
        $mostrarCreditos()
    }).catch(error => {
        console.error(error);
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