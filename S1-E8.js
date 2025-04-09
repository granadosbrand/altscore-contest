import axios from 'axios';

const API = "https://makers-challenge.altscore.ai";
const API_KEY = "796ae020c1144b26bb129a80abf12434";

let gryffindorCookie = null;

const client = axios.create({
    baseURL: API,
    headers: {
        'api-key': API_KEY,
        'Content-Type': 'application/json'
    },
    validateStatus: () => true
});

async function read() {
    const headers = { ...client.defaults.headers };

    if (gryffindorCookie) {
        headers['Cookie'] = `gryffindor="${gryffindorCookie}"`;
    }



    const res = await client.post('/v1/s1/e8/actions/door', {}, { headers });
    console.log("----------------------------------")
    console.log("📦 Respuesta:", res.data.response);

    const setCookieHeader = res.headers['set-cookie'];
    if (!setCookieHeader || setCookieHeader.length === 0) {
        return null;
    }

    const match = setCookieHeader[0].match(/gryffindor="?([^";]+)"?/);
    if (!match) {
        console.warn("⚠️ No se encontró valor gryffindor en la cookie");
        return null;
    }

    gryffindorCookie = match[1];
    console.log("🪄 Nuevo valor gryffindor:", gryffindorCookie);
    console.log("📦 Respuesta:", res.data);

    if (res.data.response === "Has llegado al final. Recuerda usar el hechizo 'revelio' para descubrir el mensaje oculto.") {
        return 1;
    }

    return gryffindorCookie;
}

async function main() {
    let magicWord = "";
    let palabras = [];
    let done = false;
    while (!done) {
        try {
            const nextPiece = await read();

            if (nextPiece === 1) {
                done = true;
                break;
            }
            if (nextPiece) {
                magicWord += nextPiece;
                const palabra = Buffer.from(nextPiece, 'base64').toString('utf-8');
                palabras.push(palabra);

                console.log("✨ Magic Word:", magicWord);
                const mensajeFinal = palabras.join(" ");
                console.log("🪄 Mensaje final:", mensajeFinal);

            }
        } catch (err) {
            console.error("💥 Error:", err.message);
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    const decoded = magicWord
        .split("=")
        .filter(Boolean)
        .map(part => Buffer.from(part + "=", 'base64').toString('utf-8'))
        .join("");

    console.log("🔮 Decoded:", decoded);


}

main();
