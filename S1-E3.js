export const API_KEY = "796ae020c1144b26bb129a80abf12434"
const SWAPI_API_URL = "https://swapi.dev/api";
const ORACLE_API_URL = "https://makers-challenge.altscore.ai/v1/s1/e3/resources/oracle-rolodex";

function decodeRolodex(oracleNotes) {
    try {

      const decodedString = atob(oracleNotes);
      return decodedString;
    } catch (error) {
      console.error('Error decoding Rolodex:', error);
      return null;
    }
  }

async function getPlanets() {

    let done = false;
    let page = 1;
    let planets = [];

    while (!done) {
        try {
            const res = await fetch(`${SWAPI_API_URL}/planets/?page=${page}`);
            const resPlanets = await res.json();

            if (res.status === 200) {
                planets.push(...resPlanets.results);
                page++;
            } else {
               return planets;
            }

        } catch (error) {
            console.error('Error en la petición:', error);
     
        }
    }



    return planets;

}

async function consultOracle( characterName ) {

    const res = await fetch(`${ORACLE_API_URL}?name=${characterName}`,{
        headers: {
            'api-key': API_KEY,
        }
    });
    const data = await res.json();

    const oracleNotes = decodeRolodex(data.oracle_notes);
    console.log("Oracle: ", oracleNotes)

    const forceSide = oracleNotes?.includes("Light Side") ? "light" : "dark";
    console.log("Force Side:", forceSide);
 

    return forceSide;
}

async function getCharacterForceSide( apiUrl ) {

    const res = await fetch(apiUrl);
    const data = await res.json();
    const characterName = data.name;
    console.log("Character Name:", characterName);

    const forceSide = await consultOracle(characterName);

    return forceSide;


}

async function calculateIBF(planet) {

    const residents = planet.residents;

    let LightSide = 0;
    let DarkSide = 0;
    
    for (let i = 0; i < residents.length; i++) {
        
        const characterForceSide = await getCharacterForceSide(residents[i]);
        
        if (characterForceSide === "light") {
            LightSide++;
        } else if (characterForceSide === "dark") {
            DarkSide++;
        }
        
        
    }
    // console.log("🚀 ~ calculateIBF ~ LightSide:", LightSide)
    // console.log("🚀 ~ calculateIBF ~ DarkSide:", DarkSide)
    // console.log("🚀 ~ calculateIBF ~ residents:", residents.length)

    const IBF = ((LightSide) - (DarkSide ))/residents.length;

    return IBF;



}

async function getNeutralPlanet( ) {
    // 1. Obtener los planetas
    const planets = await getPlanets();

    // 2. Calcular el IFB de cada planeta
    
    for (let i = 0; i < planets.length; i++) {
        const planet = planets[i];
        console.log("Planet:", planet.name);
        const ibf = await calculateIBF(planet);

        console.log("IBF:", ibf);
        console.log("-----------------------------------------------")

        if (ibf === 0) {
            return planet.name;
        }
    }
    
}

async function main() {
    const neutralPlanet = await getNeutralPlanet();
    console.log("*** Neutral Planet ***");
    console.log("Neutral Planet: ", neutralPlanet);
}

main();