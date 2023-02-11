
/**
 * Carica a video tutte le Chiese dal json
 */

const caricaChiese =()=> {
    console.log("caricaChiese()");
    let mapIconHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"40\" height=\"40\" fill=\"currentColor\" class=\"bi bi-signpost-fill\" viewBox=\"0 0 16 16\"><path d=\"M7.293.707A1 1 0 0 0 7 1.414V4H2a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h5v6h2v-6h3.532a1 1 0 0 0 .768-.36l1.933-2.32a.5.5 0 0 0 0-.64L13.3 4.36a1 1 0 0 0-.768-.36H9V1.414A1 1 0 0 0 7.293.707z\"/></svg>";
    let divChiese = document.querySelector("#divChiese");
    while (divChiese.hasChildNodes()) {
        divChiese.removeChild(divChiese.children[0]);
    }
    let oldPaese = "";
    for (let idChiesa=0; idChiesa<chiese.length; idChiesa++){
        let chiesa = chiese[idChiesa];
        console.log("Chiesa: " + chiesa.intitolazione);
        let divChiesa = document.createElement("div");
        divChiesa.className = "chiesa bg-dark"; 
        let divMappa = "";
        if (chiesa.paese != oldPaese) {
            let divPaese = document.createElement("div");
            divPaese.className = "paese h2";
            divPaese.innerHTML = chiesa.paese;
            divChiese.appendChild(divPaese);
            oldPaese = chiesa.paese;
        }
        if (chiesa.posizione.lat != 0 && chiesa.posizione.lon != 0){
            divMappa = document.createElement("div");
            // divMappa.innerHTML = " <a class=\"chiesa_map_icon\" target=\"_blank\" href=\"https://www.google.com/maps/@" + chiesa.posizione.lat + "," + chiesa.posizione.lon + ",19z\">" + mapIconHTML + "</a>";
            divMappa.innerHTML = " <a class=\"chiesa_map_icon\" target=\"_blank\" href=\"https://www.google.com/maps/search/?api=1&query=" + chiesa.posizione.lat + "," + chiesa.posizione.lon + "\">" + mapIconHTML + "</a>";
            // https://www.google.com/maps/search/?api=1&query=36.26577,-92.54324
            // console.log("\t\t Trovato posizione!");
        }
        // TODO: Indirizzo da inserire
        // let chiesaIndirizzo = "";
        // if (chiesa.posizione.indirizzo != ""){
        //     chiesaIndirizzo = " (" + chiesa.posizione.indirizzo + ")";
        // }
        let divChiesaName = document.createElement("div");
        divChiesaName.className = "chiesa_name h3";
        // divChiesaName.innerHTML = chiesa.intitolazione + " di " + chiesa.paese + chiesaIndirizzo;
        divChiesaName.innerHTML = chiesa.intitolazione + " di " + chiesa.paese;
        divChiesa.appendChild(divChiesaName);
        if (divMappa != "")
            divChiesa.appendChild(divMappa);
        divChiese.appendChild(divChiesa);
    }
}