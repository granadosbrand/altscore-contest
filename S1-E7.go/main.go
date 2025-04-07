package main

import (
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"net/http"
)

var systemCodes = map[string]string{
	"navigation":      "NAV-01",
	"communications":  "COM-02",
	"life_support":    "LIFE-03",
	"engines":         "ENG-04",
	"deflector_shield": "SHLD-05",
}

var currentDamagedSystem string

func main() {


	http.HandleFunc("GET /status", statusHandler)
	http.HandleFunc("GET /repair-bay", repairBayHandler)
	http.HandleFunc("POST /teapot", teapotHandler)

	fmt.Println("🚀 Servidor levantado en puerto 3007")
	log.Fatal(http.ListenAndServe(":3007", nil))
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
