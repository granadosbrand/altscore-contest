const API = "https://makers-challenge.altscore.ai"
const API_KEY = "796ae020c1144b26bb129a80abf12434"

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const pregunta = (texto) => {
    return new Promise((resolve) => {
        rl.question(texto, (respuesta) => {
            resolve(respuesta);
        });
    });
};

async function start() {
    const res = await fetch(`${API}/v1/s1/e5/actions/start`, {
        method: 'POST',
        headers: {
            'api-key': API_KEY,
        }
    });
    console.log("🚀 ~ start ~ res:", res)

  
}

function parseRadarData(actionResult) {
    const rows = actionResult.split("|").filter(Boolean); // Dividimos las filas
    const grid = [];

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const cells = [];
        for (let j = 0; j < row.length; j += 3) {
            const cell = row.substring(j, j + 3); // ej: "a05", "e$5"
            cells.push(cell);
        }
        grid.push(cells);
    }

    return grid; // Retorna una matriz 8x8
}

function findEnemyPosition(grid) {
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            const cell = grid[y][x];
            if (cell.includes("^")) {
               
                const letter = String.fromCharCode(97 + x); 
                const number = 8 - y; 
                return { x: letter, y: number + 1 };
            }
        }
    }
    return null; // En caso de no encontrarlo
}


async function read() {

    const res = await fetch(`${API}/v1/s1/e5/actions/perform-turn`, {
        method: 'POST',
        headers: {
            'api-key': API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            action: "radar",
            attack_position: {
    x: "a",
    y: 1
  }
        })
    });

    const result = await res.json();
    console.log("🚀 ~ read ~ result:", result)
    
    // const result = {
    //     performed_action: "read",
    //     turns_remaining: 3,
    //     time_remaining: 5,
    //     action_result: "a01b01c01d01e01f01g01h01|a02b02c02d02e$2f02g02h02|a03b03c03d03e03f03g03h$3|a04b04c04d04e04f04g04h04|a05b05c05d05e$5f05g^5h05|a06b06c06d06e$6f06g06h06|a07b07c07d07e07f07g07h07|a08b08c08d08e08f#8g08h08|",
    //     message: "string"
    // }

    const rows = result.action_result.split("|");
    const columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    
    // Invertimos el orden de las filas para mostrar desde 8 hasta 1
    const reversedRows = rows.reverse();

    // Imprimimos el encabezado de columnas
    console.log('    ' + columns.join('   '));
    console.log('  ─────────────────────');

    for (let i = 0; i < reversedRows.length; i++) {
        const row = reversedRows[i];
        let lectureRow = "";
        const rowNumber = 8 - (i-1);
        
        // Procesamos cada celda
        for (let j = 0; j < row.length; j += 3) {
            const column = row[j];    // Letra de la columna
            const number = row[j + 1]; // Número
            const special = row[j + 2] === '$' || row[j + 2] === '^' || row[j + 2] === '#' ? row[j + 2] : ' ';
            lectureRow += number + special + ' ';
        }
        
        // Imprimimos el número de fila seguido de los valores
        console.log(`${rowNumber}│ ${lectureRow}`);
    }

    return result;
}

async function attack(x, y) {

    console.log("Atacando...");
    console.log("X:", x);
    console.log("Y:", y);

    const res = await fetch(`${API}/v1/s1/e5/actions/perform-turn`, {
        method: 'POST',
        headers: {
            'api-key': API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            action: "attack",
            attack_position: {
                x: x,
                y: y
            }
        })
    });

    const result = await res.json();
    console.log("Resultado:", result);

    return result;


}

async function main() {

    let turnsRemaining = 0;
    let timeRemaining = 0;
    

    while (true) {
    
        console.log("\n");
        console.log("*****************************************");
        console.log("*** Panel de control de la nave***");

        console.group("Status de la nave:");
        console.log("Turnos restantes:", turnsRemaining);
        console.log("Tiempo restante:", timeRemaining);

        console.log("\n")
        console.groupEnd();

        console.log("\n")
        console.log("Selecciona una opción:");
        console.log("1: Leer radar");
        console.log("2: atacar");
        console.log("3: comenzar misión");
        console.log("\n");

        
        const accion = await pregunta('¿Qué acción quieres realizar? ');

        switch (accion) {
            case '1':
                console.log("Leyendo radar...");
                const radar = await read();
                timeRemaining = radar.time_remaining;
                turnsRemaining = radar.turns_remaining;

                const grid = parseRadarData(radar.action_result);
                const enemyPos = findEnemyPosition(grid);

                if (enemyPos) {
                    console.log(`📍 Enemigo detectado en: ${enemyPos.x}${enemyPos.y}`);
                } else {
                    console.log("❌ No se detectó al enemigo.");
                }

                await pregunta('Oprime enter para continuar...');
                break;

                case '2':
                    console.log("Atacando...")
                    const attackResult = await attack('a', 4);
                    console.log("Resultado:", attackResult);
                    const finishAttack = await pregunta('Oprima un botón para continuar');
            
                break;
                case '3':
                    console.log("Comenzando misión...")
                    const startResult = await start();
                    
                    
                break;
            default:
                console.log("Opción no válida");
                break;
        }
        
    }
    rl.close();
}

main();