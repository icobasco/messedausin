
/**
 * Carica a video tutte le Chiese dal json
 */

const caricaChiese =()=> {
    console.log("caricaChiese()");
    let mapIconHTML = "<img src=\"./img/map_50.png\"/>";
    let divChiese = document.querySelector("#divChiese");
    while (divChiese.hasChildNodes()) {
        divChiese.removeChild(divChiese.children[0]);
    }
    let oldPaese = "";
    for (let idChiesa=0; idChiesa<chiese.length; idChiesa++){
        let chiesa = chiese[idChiesa];
        console.log("Chiesa: " + chiesa.intitolazione);
        let divChiesa = document.createElement("div");
        divChiesa.className = "chiesa"; 
        let divMappa = "";
        if (chiesa.paese != oldPaese) {
            let divPaese = document.createElement("div");
            divPaese.className = "paese";
            divPaese.innerHTML = "<b>" + chiesa.paese + "</b>";
            divChiese.appendChild(divPaese);
            oldPaese = chiesa.paese;
        }
        if (chiesa.posizione.lat != 0 && chiesa.posizione.lon != 0){
            divMappa = document.createElement("div");
            divMappa.innerHTML = " <a class=\"map_icon\" target=\"_blank\" href=\"https://www.google.com/maps/@" + chiesa.posizione.lat + "," + chiesa.posizione.lon + ",19z\">" + mapIconHTML + "</a>";
            // console.log("\t\t Trovato posizione!");
        }
        // TODO: Indirizzo da inserire
        // let chiesaIndirizzo = "";
        // if (chiesa.posizione.indirizzo != ""){
        //     chiesaIndirizzo = " (" + chiesa.posizione.indirizzo + ")";
        // }
        let divChiesaName = document.createElement("div");
        divChiesaName.className = "chiesa_name align-middle h3";
        // divChiesaName.innerHTML = chiesa.intitolazione + " di " + chiesa.paese + chiesaIndirizzo;
        divChiesaName.innerHTML = chiesa.intitolazione + " di " + chiesa.paese;
        divChiesa.appendChild(divChiesaName);
        if (divMappa != "")
            divChiesa.appendChild(divMappa);
        divChiese.appendChild(divChiesa);
    }
}