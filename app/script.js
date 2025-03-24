//MARK: Variables
const horario = Array.from({ length: 13 }, () => Array(6).fill()); //[Hora][Dia]
let maxCreditos = 99;
let estCreditos = 0;
let auxMateriasSuperpuestas = false;
let auxDiasSuperpuestos = []

//MARK: Clase de Nodo

class Nodo{
    constructor(){
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
        this.tieneMateria = false;
        this.materia = "empty";
        this.grupo = "empty";
        this.dias = [];
        this.prioridad = false;
        if(this.domButton != null){
            this.domButton.disabled = false;
        }
    }
    
    actualizar(data,btn){
        if(this.tieneMateria){
            auxMateriasSuperpuestas = true;
            this.materia = this.ogData.materia;
            this.grupo = this.ogData.grupo;
            this.dias = this.ogData.dias;
            this.creditos = this.ogData.creditos;

            this.materia = this.materia + "/" + data.nombre;
            this.grupo = this.grupo + "/" + data.grupo;
            auxDiasSuperpuestos = this.dias.concat(data.dias);
            
            console.log(`${this.materia} ya se encuentra en este espacio`);
        }else{
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
    borrar(){
        estCreditos = estCreditos - this.creditos;
        this.domButton.disabled = false;
        if(auxMateriasSuperpuestas){
            auxDiasSuperpuestos.forEach(dia =>{
                horario[dia[0]][dia[1]].default();
                dibujarTabla()
            })
            auxMateriasSuperpuestas = false;
        }else{
            this.dias.forEach(dia =>{
                horario[dia[0]][dia[1]].default();
                dibujarTabla()
            })
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
            btn.addEventListener("click",()=>{
                this.borrar()
            })
            
            div.appendChild(pMateria);
            div.appendChild(pGrupo);
            div.appendChild(btn);
        }
        return div;
    }
}

//MARK: DOM

const $horario = document.getElementById("horario");
const $ulMaterias = document.getElementById("listadoMaterias");
const $divUsuario = document.getElementById("datosEstudiante");
const $pCreditos = document.getElementById("creditos");

function $listaDeMaterias(data){
    for(const materia in data){
        const li = document.createElement("li");
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
                    horario[dia[0]][dia[1]].actualizar(auxMateria,btn);
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
    const pNombre = document.createElement("p");
    const pCodigo = document.createElement("p");
    const img = document.createElement("img");
    
    pNombre.innerText = nombre;
    pCodigo.innerText = codigo
    img.src = foto;

    $divUsuario.appendChild(img);
    $divUsuario.appendChild(pNombre);
    $divUsuario.appendChild(pCodigo);
}

function $mostrarCreditos(){
    $pCreditos.innerText = estCreditos + " de " + maxCreditos;
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

for (let hora = 0; hora < horario.length; hora++) {
    for (let dia = 0; dia < horario[hora].length; dia++) {
        horario[hora][dia] = new Nodo();
    }
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