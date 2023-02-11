/*
    TODO:
        - Tasto MAPPA per vedere su Maps la Chiesa
        - Filtro (check o testo)
        - Messe Piasco marzo
        - Messe Verzuolo (standard)
        - Mercoledì ceneri
*/


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
 * Carica a video tutte le Messe dal json
 */
const caricaMesse =()=> {
    let divMesse = document.querySelector("#divMesse");
    while (divMesse.hasChildNodes()) {
        divMesse.removeChild(divMesse.children[0]);
    }
    for (let idMessa=0; idMessa<messe.length; idMessa++){
        let messa = messe[idMessa];
        const dataMessa = messa.data.substring(6, 10) + "-" + messa.data.substring(3, 5) + "-" + messa.data.substring(0, 2);
        const giornoMessa = new Date(dataMessa).toLocaleString('default', {weekday: 'long'});
        let divMessa = document.createElement("div");
        divMessa.className = "messa";        
        divMessa.innerHTML = "<b>" + messa.paese + " - " + messa.parrocchia + "</b> " + giornoMessa + " " + messa.data + " alle h" + messa.ora;
        console.log("Messa: " + messa.paese + " - " + messa.parrocchia + " di " +  giornoMessa + " " + messa.data + " @" + messa.ora);
        divMesse.appendChild(divMessa);
    }
}

/**
 * Cerca nel json le Messe che soddisfano il criterio dell'orario
 */

const cercaMesse =()=> {
    console.log("========================================================================");
    const dataFrom = document.querySelector("#dataFromPicker").value;    
    const dataTo = document.querySelector("#dataToPicker").value;
    console.log("Cerco le Messe DOPO di " + dataFrom + " e PRIMA di " + dataTo);
    let divMesse = document.querySelector("#divMesse");
    while (divMesse.hasChildNodes()) {
        divMesse.removeChild(divMesse.children[0]);
    }
    const fromDate = new Date(dataFrom);
    const toDate = new Date(dataTo);
    console.log("fromDate [" +  fromDate.toLocaleString('default', {year: 'numeric', month: '2-digit', day: '2-digit'}) + "]");    
    console.log("toDate [" +    toDate.toLocaleString('default', {year: 'numeric', month: '2-digit', day: '2-digit'}) + "]");         
    let messeOKCounter = 0;
    let lastGiornoMessa = "";
    for (let idMessa=0; idMessa<messe.length; idMessa++){
        let messa = messe[idMessa];
        let divMessa = "NO_MESSA";
        const dataMessa = messa.data.substring(6, 10) + "-" + messa.data.substring(3, 5) + "-" + messa.data.substring(0, 2);
        const giornoMessa = new Date(dataMessa).toLocaleString('default', {weekday: 'long'});
        const messaTimestamp = new Date(dataMessa);
        if ( (messaTimestamp >= fromDate) && (messaTimestamp <= toDate) ){
            divMessa = document.createElement("div");
            messeOKCounter++;   
        }
        if (divMessa != "NO_MESSA") {
            if (lastGiornoMessa != giornoMessa) {
                // cambio giorno
                const divGiorno = document.createElement("div");
                divGiorno.className = "h2";
                divGiorno.innerHTML = giornoMessa + " " + messa.data;
                divMesse.appendChild(divGiorno);
                lastGiornoMessa = giornoMessa;
            }
            let  note = "";
            if (messa.note != "")
                note = "<p>[" + messa.note + "]</p>";
            
            divMessa.innerHTML = 
                "<div class=\"messa_riga\">"
                + "<div class=\"messa_orario bg-dark h4\">h " + messa.ora + "</div>"
                + "<div class=\"messa_chiesa text-dark h5\">" + messa.paese + " - " + messa.chiesa_nome + note + "</div></div>";

            // divMessa.innerHTML = "<div class=\"messa_chiesa\"><h2><b>" + messa.paese + " - " + messa.chiesa + "</b></h2></div>"
            //     + "<div>" + giornoMessa + " " + messa.data + " alle h" + messa.ora + "</div>";

            console.log("Messa: " + messa.paese + " - " + messa.chiesa_nome + " di " +  giornoMessa + " " + messa.data + " @" + messa.ora);
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

// https://www.google.com/maps/@44.5688508,7.4576425,19z


            // console.log("Messa da visualizzare! [" + messaTimestamp.toLocaleString('default', {year: 'numeric', month: '2-digit', day: '2-digit', hour:'2-digit', minute: '2-digit', second: '2-digit'}) + "] [now is " 
            // + now.toLocaleString('default', {year: 'numeric', month: '2-digit', day: '2-digit', hour:'2-digit', minute: '2-digit', second: '2-digit'}) + "]");            

