export const API_KEY = "796ae020c1144b26bb129a80abf12434"

async function scan() {
    let measure = false;
    
    while (!measure) {
      try {
        const response = await fetch('https://makers-challenge.altscore.ai/v1/s1/e1/resources/measurement',{
            headers: {
                'api-key': API_KEY,
            }
        });
        const data = await response.json();
        console.log("🚀 ~ scan ~ data:", data)
        
        if (data.distance !== 'failed to measure, try again') {
          measure = true;
          return data;
        }
        
        // await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.error('Error en la petición:', error);
      }
    }

  }

  async function main() {
    const data = await scan();
    const distance = parseFloat(data.distance);

    const time = parseFloat(data.time);
    const speed = distance / time;
  
    console.log(" Velocidad:", Math.round(speed));

}

main();