const data = {
    mat:{
        prioridad: 1,
        dias: [[1,3],[1,4],[2,2]],
    },
    esp:{
        prioridad: 1,
        dias: [[3,5],[5,4],[5,5]],
    }
}

const horario = Array(6).fill(Array(14).fill(0)); //[dia,hora]

for (const materia in data) {
    data[materia].dias.forEach(dia => {
        //horario[dia[0]][dia[1]] = 1;
    });
}
dia = data.mat.dias[0]
//horario[0][1] = 1;

console.table(horario);