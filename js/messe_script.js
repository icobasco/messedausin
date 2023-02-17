/*
    TODO:
        - Tasto MAPPA per vedere su Maps la Chiesa (leggi chiese.json e array diocesi_ID+chiesa_ID)
        - Filtro (check o testo) per la zona
        - Click su Messe, collapseable che apre Note
*/


let diocesi = "";
let paese = "";
let chieseDiocesi = "";
let messe = "";


/**
 * Setup:
 *  - dataFrom settato ad oggi
 *  - dataTo settato a +15gg
 *  - timeFrom settato a -1h
 *  - timeTo settato alle h21:30 (si considera nessuna Messa che inizi oltre le h21:30)
 */
const pageSetup =()=> {
    const nowDate = new Date();
    const toDate = new Date();

    const nowString = nowDate.toLocaleString('default', {year: 'numeric', month: '2-digit', day: '2-digit'});
    const dataFromPicker = document.querySelector("#dataFromPicker");
    const dataFromMin = nowString.substring(6, 10) + "-" + nowString.substring(3, 5) + "-" + nowString.substring(0, 2);
    console.log("picker min=" + dataFromMin);
    dataFromPicker.min = dataFromMin;
    dataFromPicker.value = dataFromMin;

    console.log("PRIMA: " + toDate.toLocaleString('default', {year: 'numeric', month: '2-digit', day: '2-digit'}));
    toDate.setDate(toDate.getDate() + 15);    
    console.log("DOPO: " + toDate.toLocaleString('default', {year: 'numeric', month: '2-digit', day: '2-digit'}));
    const toString =toDate.toLocaleString('default', {year: 'numeric', month: '2-digit', day: '2-digit'});
    const dataToPicker = document.querySelector("#dataToPicker");
    const dataToMax = toString.substring(6, 10) + "-" + toString.substring(3, 5) + "-" + toString.substring(0, 2);
    console.log("picker max=" + dataToMax);
    dataToPicker.max = dataToMax;
    dataToPicker.value = dataToMax;
}

/**
 * Cerca nel json le Messe che soddisfano il criterio dell'orario
 */

const cercaMesse =()=> {
    console.log("========================================================================");
    const dataFrom = document.querySelector("#dataFromPicker").value;
    const dataTo = document.querySelector("#dataToPicker").value;
    console.log("Cerco le Messe DOPO di " + dataFrom + " e PRIMA di " + dataTo);

    // Crea array associativo delle Chiese (per dati Chiesa)
    let chieseDati = new Array();
    console.log("Creo array associativo per le chiese di " + diocesi + ": INIZIO");
    for (let idChiesa=0; idChiesa<chieseDiocesi.length; idChiesa++){
        let chiesa = chieseDiocesi[idChiesa];
        let chiesaCOD = chiesa.diocesi_id + chiesa.chiesa_id;
        // 
        const chiesaDati = {
            paese: chiesa.paese,
            frazione: chiesa.frazione,
            intitolazione: chiesa.intitolazione,
            posizione: {
                indirizzo: chiesa.posizione.indirizzo,
                cap: chiesa.posizione.cap,
                lat: chiesa.posizione.lat,
                lon: chiesa.posizione.lon
            }
        };
        // console.log(idChiesa + ")" + chiesaDati.paese + " - " + chiesaDati.intitolazione);
        chieseDati[chiesaCOD] = chiesaDati;
    }
    console.log("Creo array associativo per Chiese: FINE");


    let divMesse = document.querySelector("#divMesse");
    let indirizzoOKIcon = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"50\" height=\"50\" fill=\"#f4c007\" " + 
                        "class=\"bi bi-geo-alt-fill pr-2\" viewBox=\"0 0 16 16\">" + 
                        "<path d=\"M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z\"/></svg>";  
    let indirizzoKOIcon = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"50\" height=\"50\" fill=\"#7c8895\" " + 
                        "class=\"bi bi-geo-alt-fill pr-2\" viewBox=\"0 0 16 16\">" + 
                        "<path d=\"M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z\"/></svg>";  
    
    let noteIcon = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"50\" height=\"50\" fill=\"#f4c007\" " + 
                        "class=\"bi bi-info-square pr-2\" viewBox=\"0 0 16 16\">" + 
                        "<path d=\"M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z\"/>" +
                        "<path d=\"m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z\"/>" +
                        "</svg>";
                        
    // Pulisci i precedenti risultati a video
    while (divMesse.hasChildNodes()) {
        divMesse.removeChild(divMesse.children[0]);
    }
    const fromDate = new Date(dataFrom);
    const toDate = new Date(dataTo);
    console.log("fromDate [" +  fromDate.toLocaleString('default', {year: 'numeric', month: '2-digit', day: '2-digit'}) + "]");    
    console.log("toDate [" +    toDate.toLocaleString('default', {year: 'numeric', month: '2-digit', day: '2-digit'}) + "]");         
    console.log("Diocesi: " + diocesi);
    console.log("Paese: " + paese);
    let messeOKCounter = 0;
    let lastDataMessa = "";
    console.log("========================================");
    messe = messe.sort((a, b) => {
        const messaA = a.data.substring(6, 10) + a.data.substring(3, 5) + a.data.substring(0, 2) + a.ora.replace(":", "");
        const messaB = b.data.substring(6, 10) + b.data.substring(3, 5) + b.data.substring(0, 2)+ b.ora.replace(":", "");
        return messaA - messaB;
      });
    for (let idMessa=0; idMessa<messe.length; idMessa++){
        let messa = messe[idMessa];
        let divMessa = "NO_MESSA";
        const dataMessa = messa.data.substring(6, 10) + "-" + messa.data.substring(3, 5) + "-" + messa.data.substring(0, 2);
        const giornoMessa = new Date(dataMessa).toLocaleString('default', {weekday: 'long'});
        const messaTimestamp = new Date(dataMessa);        
        // console.log("Luogo: " + selectLuogo.value);
        let posIndirizzo = "";
        let posLat = "";
        let posLon = "";
        if (messa.paese == paese) {
            if ( (messaTimestamp >= fromDate) && (messaTimestamp <= toDate) ){
                let chiesaCOD = messa.diocesi_id + messa.chiesa_id;
                console.log("Trovato una Messa OK: " + messa.paese + " - " + messa.chiesa_nome + " " + giornoMessa + " " + messa.data + " [" + chiesaCOD + "]");
                let chiesaDati = chieseDati[chiesaCOD];
                console.log("\tchiesaDati: " + chiesaDati);
                frazione = chiesaDati.frazione;
                posIndirizzo = chiesaDati.posizione.indirizzo;
                posLat = chiesaDati.posizione.lat;
                posLon = chiesaDati.posizione.lon;
                console.log("\t" + chiesaDati.intitolazione + " IN " + chiesaDati.paese + " (" + posIndirizzo + ")\t" + posLat + "," + posLon);
                divMessa = document.createElement("div");
                messeOKCounter++;   
            }
        }
        // else {
        //     console.log("Filtro: \"" + selectLuogo.value + "\" - Chiesa: \"" + messa.paese + "\"");
        // }
        if (divMessa != "NO_MESSA") {
            if (lastDataMessa != dataMessa) {
                // cambio giorno
                const divGiorno = document.createElement("div");
                divGiorno.className = "mt-5 h2 border-bottom border-warning";
                divGiorno.innerHTML = giornoMessa + " " + messa.data;
                divMesse.appendChild(divGiorno);
                lastDataMessa = dataMessa;
            }
            
            let linkMapsHTML = "";
            let indirizzoIcon = "";
            if ( (posLat != 0) && (posLon != 0) ){
                linkMapsHTML = " <a target=\"_blank\" href=\"https://www.google.com/maps/search/?api=1&query=" + posLat + "," + posLon + "\">";
                indirizzoIcon = indirizzoOKIcon;
            }
            else {
                indirizzoIcon.replace("COLORE_ICONA", "7c8895");
                indirizzoIcon = indirizzoKOIcon;
            }
                
            let divIndirizzoHTML = "<div class=\"messa_chiesa_indirizzo\">" + linkMapsHTML + indirizzoIcon + "</a>";
            if (frazione != "Capoluogo") {
                divIndirizzoHTML += "(fr. " + frazione + ") ";
            }
            divIndirizzoHTML += posIndirizzo + "</div>";

            let  note = "";
            if (messa.note != "")
                note = "<div class=\"messa_chiesa_note\">" + noteIcon + messa.note + "</div>";
            
            divMessa.innerHTML = 
                "<div class=\"messa_riga\">"
                + "<div class=\"messa_orario bg-warning h4\">" + messa.ora + "</div>"
                +   "<div class=\"messa_chiesa_dati\">"
                +       "<div class=\"messa_chiesa_nome h4\">" + messa.paese + " - " + messa.chiesa_nome + "</div>"
                +       divIndirizzoHTML
                +       note
                +   "</div>"
                + "</div>";
            divMesse.appendChild(divMessa);
        }
    }
    if (messeOKCounter == 0) {
        let divNoMesse = document.createElement("div");
        divNoMesse.innerHTML = "<i>Nessuna Messa che soddisfa i requisiti richiesti è stata trovata.</i>";
        divMesse.appendChild(divNoMesse);
    }
}

const onDataFromChange=()=> {
    console.log("onDataFromChange()");
    const dataFromPicker = document.querySelector("#dataFromPicker");
    const dataToPicker = document.querySelector("#dataToPicker");
    console.log("Setto a " + dataFromPicker.value );
    dataToPicker.min = dataFromPicker.value;
    // dataToPicker.value = dataFromPicker.value;
}

const onDiocesiChange=()=> {
    const selDiocesi = document.querySelector("#selDiocesi");
    diocesi = selDiocesi.value;
    console.log("onDiocesiChange(): " + diocesi);
    caricaChieseDiocesi();
}

const onPaeseChange=()=> {
    const selPaese = document.querySelector("#selPaese");
    paese = selPaese.value;
    console.log("onPaeseChange(): " + paese);
    cercaMesse();
}


const caricaChieseDiocesi=()=> {
    console.log("Carico chiese della Diocesi di " + diocesi);
    switch (diocesi) {
        case "Saluzzo": {
            chieseDiocesi = chiese_001;
            messe = messe_001;
            break;
        }
        case "Cuneo": {
            chieseDiocesi = chiese_002;  
            messe = messe_002;
            break;
        }
    }
    console.log("Caricato n." + chieseDiocesi.length + " chiese");
    
        // Controllo quale Paesi (distinct) sono presenti
    let paesi = Array();
    for (let idChiesa=0; idChiesa<chieseDiocesi.length; idChiesa++){
        let chiesa = chieseDiocesi[idChiesa];
        if (paesi.indexOf(chiesa.paese) == -1)
            paesi.push(chiesa.paese);
    }
        // Aggiungo i Paesi nella selPaese                  // TODO: rimuovere le option. Ora non le rimuove tutte
    let selPaese = document.getElementById("selPaese");
    selPaese.innerHTML = "";
    let option = document.createElement("option");
    option.text = "Scegli...";
    selPaese.add(option);

    console.log("Elenco paesi:");
    for (let idPaese=0; idPaese<paesi.length; idPaese++) {
        console.log("\t- " + paesi[idPaese]);
        let optPaese = document.createElement("option");
        optPaese.text = paesi[idPaese];
        selPaese.add(optPaese);
    }





    // TODO: fare fetch?
}
