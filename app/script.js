//MARK: Datos de prueba [hora][dia]
const dataSimulada = {
    mat:{
        nombre:"matematicas",
        grupo:"AMB A",
        prioridad: true,
        dias: [[1,0],[1,4],[2,2]],
    },
    esp:{
        nombre:"español",
        grupo:"MUL A",
        prioridad: false,
        dias: [[3,5],[5,4],[5,5]],
    }
}

//MARK: Clase de Nodo

class Nodo{
    constructor(){
        this.tieneMateria = false;
        this.materia = "empty";
        this.grupo = "empty";
        this.dias = [];
        this.prioridad = false
    }
    
    default(){
        this.tieneMateria = false;
        this.materia = "empty";
        this.grupo = "empty";
        this.dias = [];
        this.prioridad = false
    }
    
    actualizar(data){
        if(this.tieneMateria){
            console.log(`${this.materia} ya se encuentra en este espacio`);
        }else{
            this.tieneMateria = true;
            this.materia = data.nombre;
            this.grupo = data.grupo;
            this.dias = data.dias;
        }
    }
    borrar(){
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
        auxMateria.dias.forEach(dia => {
            horario[dia[0]][dia[1]].actualizar(auxMateria);
            dibujarTabla()
        });
    })
    li.appendChild(btn);
    $ulMaterias.appendChild(li);
}

//MARK: Horario

const horario = Array.from({ length: 13 }, () => Array(6).fill()); //[Hora][Dia]

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