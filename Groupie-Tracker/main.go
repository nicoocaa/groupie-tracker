package main

import (
	"encoding/json"
	"fmt"
	"html/template"
	"log"
	"math/rand"
	"net/http"
	"strconv"
	"time"
)

type Artist struct {
	ID             int      `json:"id"`
	ImageURL       string   `json:"image"`
	Name           string   `json:"name"`
	Members        []string `json:"members"`
	CreationDate   int      `json:"creationDate"`
	FirstAlbum     string   `json:"firstAlbum"`
	Locations      string   `json:"locations"`
	ConcertDates   string   `json:"concertDates"`
	Relations      string   `json:"relations"`
	NumMembers     int
	FirstAlbumUnix int64
}

type ArtistData struct {
	Artists      []Artist
	RelationInfo []RelationInfo
}

type RelationInfo struct {
	ID             int                 `json:"id"`
	DatesLocations map[string][]string `json:"datesLocations"`
}

type ArtistInfoWithConcerts struct {
	Artist   Artist
	Location RelationInfo
}

type Data struct {
	Entry string
}

var data = Data{
	Entry: "",
}

func main() {
	http.HandleFunc("/", homeHandler)
	http.HandleFunc("/artists/", artistHandler)
	http.HandleFunc("/artist-list", listHandler)
	http.HandleFunc("/informations/", InformationsHandler)

	fs := http.FileServer(http.Dir("assets/"))
	http.Handle("/assets/", http.StripPrefix("/assets/", fs))

	log.Println("Serveur démarré sur le port 8080...")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal("Erreur lors du démarrage du serveur:", err)
	}
}

func homeHandler(w http.ResponseWriter, r *http.Request) {
	num1, num2, num3, num4, num5 := generateUniqueRandomNumbers()

	artistIDs := []int{num1, num2, num3, num4, num5}
	var artists []Artist
	for _, id := range artistIDs {
		artist, err := fetchArtistByID(id)
		if err != nil {
			log.Printf("Erreur lors de la récupération de l'artiste avec l'ID %d: %v\n", id, err)
			continue
		}
		artists = append(artists, artist)
	}

	tmpl, err := template.ParseFiles("templates/index.html")
	if err != nil {
		log.Println("Erreur lors de la lecture du fichier HTML:", err)
		http.Error(w, "Erreur interne du serveur", http.StatusInternalServerError)
		return
	}

	err = tmpl.Execute(w, ArtistData{Artists: artists})
	if err != nil {
		log.Println("Erreur lors de l'exécution du modèle HTML:", err)
		http.Error(w, "Erreur interne du serveur", http.StatusInternalServerError)
		return
	}
}

func listHandler(w http.ResponseWriter, r *http.Request) {
	artists, err := fetchArtistsFromAPI()
	if err != nil {
		log.Println("Erreur lors de la récupération des artistes:", err)
		http.Error(w, "Erreur interne du serveur", http.StatusInternalServerError)
		return
	}

	var artistsWithConcerts []ArtistInfoWithConcerts

	for _, artist := range artists {
		locations, err := GetLocationsbyID(artist.ID)
		if err != nil {
			log.Printf("Erreur lors de la récupération des lieux de concert pour l'artiste %s (%d): %v\n", artist.Name, artist.ID, err)
			continue
		}

		artistWithConcerts := ArtistInfoWithConcerts{
			Artist:   artist,
			Location: locations,
		}

		artistsWithConcerts = append(artistsWithConcerts, artistWithConcerts)
	}

	tmpl, err := template.ParseFiles("templates/artist-list.html")
	if err != nil {
		log.Println("Erreur lors de la lecture du fichier HTML:", err)
		http.Error(w, "Erreur interne du serveur", http.StatusInternalServerError)
		return
	}

	err = tmpl.Execute(w, artistsWithConcerts)
	if err != nil {
		log.Println("Erreur lors de l'exécution du modèle HTML:", err)
		http.Error(w, "Erreur interne du serveur", http.StatusInternalServerError)
		return
	}
}

func artistHandler(w http.ResponseWriter, r *http.Request) {
	id := r.URL.Path[len("/artists/"):]
	artistID, err := strconv.Atoi(id)
	if err != nil {
		http.Error(w, "ID d'artiste non valide", http.StatusBadRequest)
		return
	}

	artist, err := fetchArtistByID(artistID)
	if err != nil {
		http.Error(w, "Artiste non trouvé", http.StatusNotFound)
		return
	}

	locations, err := GetLocationsbyID(artistID)
	if err != nil {

		log.Println("Erreur lors de la récupération des lieux de concert:", err)
		http.Error(w, "Erreur interne du serveur", http.StatusInternalServerError)
		return
	}

	artistInfo := ArtistInfoWithConcerts{
		Artist:   artist,
		Location: locations,
	}

	tmpl, err := template.ParseFiles("templates/artists.html")
	if err != nil {
		log.Println("Erreur lors de la lecture du fichier HTML:", err)
		http.Error(w, "Erreur interne du serveur", http.StatusInternalServerError)
		return
	}

	err = tmpl.Execute(w, artistInfo)
	if err != nil {
		log.Println("Erreur lors de l'exécution du modèle HTML:", err)
		http.Error(w, "Erreur interne du serveur", http.StatusInternalServerError)
		return
	}
}

func InformationsHandler(w http.ResponseWriter, r *http.Request) {
	id := r.URL.Path[len("/informations/"):]
	artistID, err := strconv.Atoi(id)
	artist, err := fetchArtistByID(artistID)
	tmpl, err := template.ParseFiles("templates/informations.html")
	if err != nil {
		log.Println("Erreur lors de la lecture du fichier HTML:", err)
		http.Error(w, "Erreur interne du serveur", http.StatusInternalServerError)
		return
	}
	err = tmpl.Execute(w, artist)
	if err != nil {
		log.Println("Erreur lors de l'exécution du modèle HTML:", err)
		http.Error(w, "Erreur interne du serveur", http.StatusInternalServerError)
		return
	}
}

func fetchArtistsFromAPI() ([]Artist, error) {
	response, err := http.Get("https://groupietrackers.herokuapp.com/api/artists")
	if err != nil {
		return nil, err
	}
	defer response.Body.Close()

	var artists []Artist
	err = json.NewDecoder(response.Body).Decode(&artists)
	if err != nil {
		return nil, err
	}

	for i := range artists {
		artists[i].NumMembers = len(artists[i].Members)
	}

	for i := range artists {
		date, err := parseDate(artists[i].FirstAlbum)
		if err != nil {
			log.Printf("Erreur lors du parsing de la date du premier album pour l'artiste %s: %v\n", artists[i].Name, err)
			continue
		}
		artists[i].FirstAlbumUnix = date.UnixNano() / int64(time.Millisecond)
	}
	return artists, nil
}

func parseDate(dateString string) (time.Time, error) {
	layout := "02-01-2006" 
	parsedDate, err := time.Parse(layout, dateString)
	if err != nil {
		return time.Time{}, err
	}
	return parsedDate, nil
}

func fetchArtistByID(id int) (Artist, error) {
	url := fmt.Sprintf("https://groupietrackers.herokuapp.com/api/artists/%d", id)
	response, err := http.Get(url)
	if err != nil {
		return Artist{}, err
	}
	defer response.Body.Close()

	if response.StatusCode != http.StatusOK {
		return Artist{}, fmt.Errorf("Impossible de récupérer l'artiste avec l'ID %d, code de statut: %d", id, response.StatusCode)
	}

	var artist Artist
	err = json.NewDecoder(response.Body).Decode(&artist)
	if err != nil {
		return Artist{}, err
	}

	return artist, nil
}

func generateUniqueRandomNumbers() (int, int, int, int, int) {
	rand.Seed(time.Now().UnixNano())
	used := make(map[int]bool)

	var num1, num2, num3, num4, num5 int

	for i := 0; i < 5; {
		num := rand.Intn(52) + 1
		if !used[num] {
			switch i {
			case 0:
				num1 = num
			case 1:
				num2 = num
			case 2:
				num3 = num
			case 3:
				num4 = num
			case 4:
				num5 = num
			}
			used[num] = true
			i++
		}
	}

	return num1, num2, num3, num4, num5
}

func GetLocationsbyID(id int) (RelationInfo, error) {
	url := fmt.Sprintf("https://groupietrackers.herokuapp.com/api/relation/%d", id)
	resp, err := http.Get(url)
	if err != nil {
		fmt.Println("Erreur lors de la requête GET:", err)
	}
	defer resp.Body.Close()

	var locations RelationInfo
	err = json.NewDecoder(resp.Body).Decode(&locations)
	if err != nil {
		print(err.Error())
		return RelationInfo{}, err
	}

	return locations, nil
}
