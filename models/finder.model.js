const fs = require('fs');

// Función para obtener todos los usuarios
function getUsers() {
    const data = fs.readFileSync("./DB/usuarios.json", 'utf8');
    return JSON.parse(data);
}

exports.findUser = (codigo) => {
    const users = getUsers();
    return users.find(u => u.codigo === codigo);
};
