/*
    TODO:
        - Tasto MAPPA per vedere su Maps la Chiesa (leggi chiese.json e array diocesi_ID+chiesa_ID)
        - Filtro (check o testo) per la zona
        - Click su Messe, collapseable che apre Note
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
    let lastDataMessa = "";
/*
    console.log("========================================");
    for (let idMessa=0; idMessa<messe.length; idMessa++){
        let messa = messe[idMessa];
        const messaValue = messa.data.substring(6, 10) + messa.data.substring(3, 5) + messa.data.substring(0, 2) + messa.ora.replace(":", "");
        console.log(idMessa + "[" + messaValue + "]");
    }
*/
    console.log("========================================");
    messe = messe.sort((a, b) => {
        const messaA = a.data.substring(6, 10) + a.data.substring(3, 5) + a.data.substring(0, 2) + a.ora.replace(":", "");
        const messaB = b.data.substring(6, 10) + b.data.substring(3, 5) + b.data.substring(0, 2)+ b.ora.replace(":", "");
        return messaA - messaB;
      });
/*
    console.log("========================================");
    for (let idMessa=0; idMessa<messe.length; idMessa++){
        let messa = messe[idMessa];
        const messaValue = messa.data.substring(6, 10) + messa.data.substring(3, 5) + messa.data.substring(0, 2) + messa.ora.replace(":", "");
        console.log(idMessa + "[" + messaValue + "]");
    }
*/
    for (let idMessa=0; idMessa<messe.length; idMessa++){
        let messa = messe[idMessa];
        let divMessa = "NO_MESSA";
        const dataMessa = messa.data.substring(6, 10) + "-" + messa.data.substring(3, 5) + "-" + messa.data.substring(0, 2);
        const giornoMessa = new Date(dataMessa).toLocaleString('default', {weekday: 'long'});
        const messaTimestamp = new Date(dataMessa);
        console.log("Luogo: " + selectLuogo.value);
        if (messa.paese == selectLuogo.value) {
            if ( (messaTimestamp >= fromDate) && (messaTimestamp <= toDate) ){
                divMessa = document.createElement("div");
                messeOKCounter++;   
            }
        }
        else {
            console.log("Filtro: \"" + selectLuogo.value + "\" - Chiesa: \"" + messa.paese + "\"");
        }
        if (divMessa != "NO_MESSA") {
            if (lastDataMessa != dataMessa) {
                // cambio giorno
                const divGiorno = document.createElement("div");
                divGiorno.className = "mt-5 h2 border-bottom border-warning";
                divGiorno.innerHTML = giornoMessa + " " + messa.data;
                divMesse.appendChild(divGiorno);
                lastDataMessa = dataMessa;
            }
            let  note = "";
            if (messa.note != "")
                note = "<p>[" + messa.note + "]</p>";
                
            let  frazione = "";
            if (messa.frazione != "Capoluogo")
                frazione = " (fr. " + messa.frazione + ")";
            
            divMessa.innerHTML = 
                "<div class=\"messa_riga\">"
                + "<div class=\"messa_orario bg-warning h4\">h " + messa.ora + "</div>"
                + "<div class=\"messa_chiesa h5\">" + messa.paese + " - " + messa.chiesa_nome + frazione + note + "</div></div>";

            // divMessa.innerHTML = "<div class=\"messa_chiesa\"><h2><b>" + messa.paese + " - " + messa.chiesa + "</b></h2></div>"
            //     + "<div>" + giornoMessa + " " + messa.data + " alle h" + messa.ora + "</div>";

            // console.log("Messa: [" + messa.diocesi_id + messa.chiesa_id + "]" + messa.paese + frazione + " - " + messa.chiesa_nome + " di " +  giornoMessa + " " + messa.data + " @" + messa.ora);
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



const cambiaLuogo=()=> {
    const selectLuogo = document.querySelector("#selectLuogo");
    console.log("cambiaLuogo(): " + selectLuogo.value);
    cercaMesse();
}