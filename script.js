// LISTAN NIMEÄMINEN
function nimeaLista() {
  let nimi = prompt("Anna muistilistalle nimi!")
  if (nimi.length >= 3 && nimi.length <= 30) { // tarkastetaan, että nimi on 3....30 välillä
      document.getElementById("otsikko").innerHTML = nimi;
      tallennaLocalStorageen();
  } else {
      alert("Nimen tulee olla 3-30 merkkiä pitkä!");
  }
}

// TEHTÄVÄN LISÄÄMINEN
function addRivi() {
  let tehtavarivi = document.getElementById("rivi").value;
  addRiviTaulukkoon(tehtavarivi, false);
}

// TEHTÄVÄN LISÄÄMINEN TAULUKKOON
function addRiviTaulukkoon(tehtavarivi, valittu) {

  // Tarkistetaan, että tehtävä on 3-40 merkkiä pitkä
  if (tehtavarivi.length >= 3 && tehtavarivi.length <= 40) {
      let taulukko = document.getElementById("tehtavalista"); // Oikea tbody
      let rivi = taulukko.insertRow(); // Lisätään uusi tyhjä rivi ensimmäiseksi

      // 1 Lisätään checkbox ensimmäiseen soluun
      let checkboxSolu = rivi.insertCell(0); // käytetään insertCell-metodia
      let checkboxElementti = document.createElement("input");
      checkboxElementti.type = "checkbox";
      checkboxElementti.checked = valittu; // Jos valittu on true, checkbox on valittu
      checkboxSolu.appendChild(checkboxElementti);

      // 2 Lisätään tehtävän nimi keskimmäiseen sarakkeeseen
      let tehtavaSolu = rivi.insertCell(1);
      tehtavaSolu.innerHTML = tehtavarivi;

      // 3 Lisätään rivin poisto viimeiseen soluun
      let poistoSolu = rivi.insertCell(2);
      let poistoNappi = document.createElement("button");
      poistoNappi.textContent = "Poista";
      poistoNappi.className="napit"
      poistoNappi.onclick = function () {
          taulukko.deleteRow(rivi.sectionRowIndex); // Poistaa rivin oikealla indeksillä
          tallennaLocalStorageen();
      };
      poistoSolu.appendChild(poistoNappi);

      document.getElementById("rivi").value = ""; // Tyhjennetään tekstikenttä


      // Checkboxin toiminnallisuus: yliviivataan teksti, kun checkbox valitaan
      checkboxElementti.addEventListener("change", function () {
          if (checkboxElementti.checked) {
              // Jos checkbox on valittu, yliviivataan tekstin solu
              tehtavaSolu.style.textDecoration = "line-through";
          } else {
              // Jos checkbox ei ole valittu, poistetaan yliviivaus
              tehtavaSolu.style.textDecoration = "none";
          }

          tallennaLocalStorageen(); // Tallennetaan checkbox painallus local storageen
      });

      if (valittu) {
        tehtavaSolu.style.textDecoration = "line-through"; // storagen takia piti lisätä tämä, jotta yliviivaus toimii oikein
      }
      
      tallennaLocalStorageen();
      document.getElementById("rivi").style.border = ""; // punaisen virheboksin poisto
  } else {
      alert("Tehtävän tulee olla 3-30 merkkiä pitkä!");
      document.getElementById("rivi").style.border = "thick solid red";
  }
}

// VALMIIT / KESKEN Suodattaa taulukon rivit valitun tilan mukaan
function suodata(tila) {
  // Haetaan kaikki taulukon rivit
  let rivit = document.querySelectorAll("#tehtavalista tr");

  // Käydään kaikki rivit läpi ja tarkistetaan checkboxin tila
  rivit.forEach(function (rivi) {
      let checkbox = rivi.querySelector("input[type='checkbox']");

      // Suodatetaan rivit sen mukaan, mikä tila on valittu
      if (tila === "kaikki") {
          // Näytetään kaikki rivit
          rivi.style.display = "";
      } else if (tila === "valmiit" && checkbox.checked) {
          // Näytetään vain valitut (checkbox on valittu)
          rivi.style.display = "";
      } else if (tila === "kesken" && !checkbox.checked) {
          // Näytetään vain valitsemattomat (checkbox ei ole valittu)
          rivi.style.display = "";
      } else {
          // Piilotetaan kaikki rivit, jotka eivät vastaa valittua suodatusta
          rivi.style.display = "none";
      }
  });
}

// LOCAL STORAGE
function tallennaLocalStorageen() {

  // Tallennetaan listan nimi
  localStorage.setItem("listanimi", document.getElementById("otsikko").innerHTML);

  let tehtavat = [];
  let rivit = document.querySelectorAll("#tehtavalista tr");

  // Käydään kaikki taulukon rivit läpi ja lisätään tehtävät taulukkoon
  for (let i = 0; i < rivit.length; i++) {
      let rivi = rivit[i];
      let checkbox = rivi.querySelector("input");  // https://www.w3schools.com/Jsref/met_document_queryselector.asp
      let tehtava = rivi.querySelectorAll("td")[1].textContent;

      tehtavat.push({  // https://www.w3schools.com/js/js_arrays.asp
          tehtava: tehtava,
          valmis: checkbox.checked
      });
  }

  // Tallennetaan tehtävät local storageen
  localStorage.setItem("tehtavat", JSON.stringify(tehtavat));
}

// Ladataan listan nimi ja tehtävät local storagesta
function lataaLocalStoragesta() {
  
  // Ladataan listan nimi ja astetaan otsikkoon
  let listanimi = localStorage.getItem("listanimi");

/* jos lista nimi tyhjä tai annettu */ 
  if (listanimi==null) {
    document.getElementById("otsikko").innerHTML = "Anna listalle nimi";
  }
  else {
    document.getElementById("otsikko").innerHTML = listanimi;
  }

  let tehtavat = JSON.parse(localStorage.getItem("tehtavat"));

  // Käydään kaikki tehtävät läpi ja lisätään ne taulukkoon
  if (tehtavat != null) {
  tehtavat.forEach(function (tehtava) {
      addRiviTaulukkoon(tehtava.tehtava, tehtava.valmis);
  });}
}