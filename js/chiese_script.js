
/**
 * Carica a video tutte le Chiese dal json
 */

const caricaChiese =()=> {
    let divChiese = document.querySelector("#divChiese");
    while (divChiese.hasChildNodes()) {
        divChiese.removeChild(divChiese.children[0]);
    }
    for (let idChiesa=0; idChiesa<chiese.length; idChiesa++){
        let chiesa = chiese[idChiesa];
        console.log("Chiesa: " + chiesa.intitolazione);
        let divChiesa = document.createElement("div");
        divChiesa.className = "chiesa"; 
        let mappa = "";
        if (chiesa.posizione.lat != 0 && chiesa.posizione.lon != 0){
            mappa = " <a target=\"_blank\" href=\"https://www.google.com/maps/@" + chiesa.posizione.lat + "," + chiesa.posizione.lon + ",19z\"> MAPPA </a>";
            // console.log("\t\t Trovato posizione!");
        }
        divChiesa.innerHTML = 
            "<b>" + chiesa.intitolazione + "</b></a> di " + chiesa.paese + " (" + chiesa.posizione.indirizzo + ")" + mappa;
        divChiese.appendChild(divChiesa);
    }
}