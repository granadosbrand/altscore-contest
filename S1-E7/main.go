package main

import (
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"os"
	"strconv"
	"math"
)

var systemCodes = map[string]string{
	"navigation":       "NAV-01",
	"communications":   "COM-02",
	"life_support":     "LIFE-03",
	"engines":          "ENG-04",
	"deflector_shield": "SHLD-05",
}

var currentDamagedSystem string

func truncateTo4Decimals(val float64) float64 {
    return math.Floor(val*10000) / 10000
}

func main() {

	port := os.Getenv("PORT")

	if port == "" {
		port = "3007"
	}

	http.HandleFunc("GET /status", statusHandler)
	http.HandleFunc("GET /repair-bay", repairBayHandler)
	http.HandleFunc("POST /teapot", teapotHandler)

	// S1-E8
	http.HandleFunc("GET /phase-change-diagram", phaseChangeDiagramHandler)

	fmt.Println("Servidor corriendo en el puerto:", port)

	log.Fatal(http.ListenAndServe(":"+port, nil))
}

func phaseChangeDiagramHandler(w http.ResponseWriter, r *http.Request) {
	queryParams := r.URL.Query()
	pressureStr := queryParams.Get("pressure")

	pressure, err := strconv.ParseFloat(pressureStr, 64)
	if err != nil {
		http.Error(w, "Invalid pressure value", http.StatusBadRequest)
		return
	}


	liquidSlope := (0.0035 - 0.00105) / (10 - 0.05) 
	liquidB := 0.00105 - (liquidSlope * 0.05)       

	
	vaporSlope := (0.0035 - 30.0) / (10.0 - 0.05) 
	vaporB := 30.0 - (vaporSlope * 0.05)          

	liquidVolume := liquidSlope*pressure + liquidB
	vaporVolume := vaporSlope*pressure + vaporB

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]float64{
		"specific_volume_liquid": truncateTo4Decimals(liquidVolume),
		"specific_volume_vapor":  truncateTo4Decimals(vaporVolume),
	})
}

func statusHandler(w http.ResponseWriter, r *http.Request) {

	keys := make([]string, 0, len(systemCodes))
	for k := range systemCodes {
		keys = append(keys, k)
	}
	currentDamagedSystem = keys[rand.Intn(len(keys))]

	resp := map[string]string{"damaged_system": currentDamagedSystem}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

func repairBayHandler(w http.ResponseWriter, r *http.Request) {

	code, ok := systemCodes[currentDamagedSystem]

	if !ok {
		http.Error(w, "Sistema no definido. Llama primero a /status.", http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "text/html")
	fmt.Fprintf(w, `<!DOCTYPE html>
				<html>
				<head><title>Repair</title></head>
				<body>
					<div class="anchor-point">%s</div>
				</body>
				</html>`, code)
}

func teapotHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Método no permitido", http.StatusMethodNotAllowed)
		return
	}

	w.WriteHeader(http.StatusTeapot)
	fmt.Fprint(w, "I'm a teapot.")
}
