//MARK: Datos de prueba [hora][dia]
const dataSimulada = {
    mat:{
        nombre:"matematicas",
        grupo:"AMB A",
        prioridad: true,
        dias: [[1,0],[1,4],[2,2]],
        creditos:3,
    },
    esp:{
        nombre:"español",
        grupo:"MUL A",
        prioridad: false,
        dias: [[3,5],[5,4],[5,5]],
        creditos:6,
    },
    soc:{
        nombre:"sociales",
        grupo:"IND C",
        prioridad: false,
        dias: [[1,0],[2,0],[3,0]],
        creditos:8,
    },
    nat:{
        nombre:"naturale",
        grupo:"MEC A",
        prioridad: true,
        dias: [[1,0],[1,1],[2,1]],
        creditos:1,
    }
}

//MARK: Variables
const horario = Array.from({ length: 13 }, () => Array(6).fill()); //[Hora][Dia]
const maxCreditos = 16;
let estCreditos = 0;

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
        this.prioridad = false
    }
    
    actualizar(data,btn){
        if(this.tieneMateria){
            
            this.materia = this.ogData.materia;
            this.grupo = this.ogData.grupo;
            this.dias = this.ogData.dias;
            this.creditos = this.ogData.creditos;

            this.materia = this.materia + "/" + data.nombre;
            this.grupo = this.grupo + "/" + data.grupo;
            this.dias = this.dias.concat(data.dias);
            
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
        this.dias.forEach(dia =>{
            horario[dia[0]][dia[1]].default();
            dibujarTabla()
        })
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

// DOM
const $horario = document.getElementById("horario");
const $ulMaterias = document.getElementById("listadoMaterias");

for(const materia in dataSimulada){
    const li = document.createElement("li");
    const btn = document.createElement("button");
    
    if(dataSimulada[materia].prioridad){
        btn.innerText = dataSimulada[materia].nombre + " - " + dataSimulada[materia].grupo + " (!)";
    }else{
        btn.innerText = dataSimulada[materia].nombre + " - " + dataSimulada[materia].grupo;
    }
    
    btn.addEventListener("click",()=>{
        const auxMateria = dataSimulada[materia];
        if(estCreditos+auxMateria.creditos <= maxCreditos){
            estCreditos = estCreditos + auxMateria.creditos
            auxMateria.dias.forEach(dia => {
                horario[dia[0]][dia[1]].actualizar(auxMateria,btn);
                dibujarTabla()
            });
        }else{
            console.log("Numero de creditos superado")
        }
    })
    li.appendChild(btn);
    $ulMaterias.appendChild(li);
}

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
}

dibujarTabla()