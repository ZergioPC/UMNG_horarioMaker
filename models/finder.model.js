const fs = require('fs');

// Función para obtener todos los usuarios
function getUsers() {
    const data = fs.readFileSync("./DB/usuarios.json", 'utf8');
    return JSON.parse(data);
}

function getMaterias(materias) {
    const DB = fs.readFileSync("./DB/materias.json", 'utf8');
    const data = JSON.parse(DB);
    const materiasList = []
    for (let i = 0; i < materias.length; i++) {
        materiasList.push(data[materias[i][0]]);
    }
    return materiasList;
}

exports.findUser = (codigo) => {
    const users = getUsers();
    return users.find(u => u.codigo === codigo);
};

exports.findMaterias = (codigo) => {
    const user = getUsers().find(u => u.codigo === codigo);
    const { pass, ...nuevoUsuario } = user;
        
    const materias = getMaterias(user.materias);
    return [nuevoUsuario,materias];
}