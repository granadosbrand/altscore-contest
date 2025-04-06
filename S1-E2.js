export const API_KEY = "796ae020c1144b26bb129a80abf12434"

async function getStars() {
    let done = false;
    let starsData = [];
    let quanticJump = 1;  // Movido fuera del while
    
    while (!done) {
      try {
        const response = await fetch(
          `https://makers-challenge.altscore.ai/v1/s1/e2/resources/stars?page=${quanticJump}`,
          {
            headers: {
                'api-key': API_KEY,
            }
          }
        );
        const data = await response.json();
        console.log("🚀 ~ getStars ~ data:", data)
        
        if (data.length === 0) {
          done = true;
        } else {
          starsData.push(...data); // Usar spread operator para añadir los elementos
          quanticJump++;
        }
        
        // Opcional: esperar un poco entre peticiones
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.error('Error en la petición:', error);
        done = true; // O manejar el error de otra forma
      }
    }

    const totalResonance = starsData.reduce((acc, star) => acc + star.resonance, 0);
    const averageResonance = totalResonance / 100;
    console.log("Resonancia promedio:", averageResonance);

    return Math.floor(averageResonance);
}

async function main() {
    const starsData = await getStars();
    console.log("Estrellas", starsData);
}

main();