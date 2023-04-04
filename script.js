
// Konstanty
const plocha = document.getElementById("plocha")
const tlacitkoStart = document.getElementById("tlacitkoStart")
const tlacitkoZmenVelikost = document.getElementById("tlacitkoZmenVelikost")

// Globalní proměnné
let had = [document.querySelector(".had")]
let posledniKlavesa = 0;
let rychlost;
let velikost;
let delkaHada = 1;


// Události
tlacitkoStart.addEventListener('click', function () {
  tlacitkoStart.remove()
  plocha.style.display = ""
});
tlacitkoZmenVelikost.addEventListener("click", zmenaMrizky)
document.addEventListener("keydown", autopohyb);

// Počáteční nastavení
zmenaMrizky()

function pridejHadaNaNahodnePole() {
  let a = Math.floor(Math.random() * velikost + 1) ; //Math.floor zaokrouhlí na celé číslo dolů
  let b = Math.floor(Math.random() * velikost + 1) ;
  let nahodnePole = document.getElementById(a + ":" + b)

  console.log("Chci hodit hada na " + a + ":" + b)

  nahodnePole.classList.add("had");
  had = [nahodnePole]
}

function pridejZradloNaNahodnePole() {
  let a = Math.floor(Math.random() * (velikost) + 1);
  let b = Math.floor(Math.random() * (velikost) + 1);
  let nahodnePolee = document.getElementById(a + ":" + b);

  if (nahodnePolee.classList.contains("had")) {
    // Recursively call the function until an unoccupied pole is found
    pridejZradloNaNahodnePole(velikost);
  } else {
    nahodnePolee.classList.add("zradlo");
    console.log("Chci hodit zradlo na " + a + ":" + b);
    zradlo = [nahodnePolee];
  }
}

function zmenaMrizky() {
  const mrizka = document.getElementById("plocha");

  for (const element of mrizka.querySelectorAll("br, .pole")) {
    element.remove()
  }
  const puvodniMezera = document.createElement("br");
  mrizka.append(puvodniMezera)

  const poleVelikost = document.getElementById("velikost");
  velikost = parseInt(poleVelikost.value);
  console.log("Měním mřížku na velikost " + velikost)

  mrizka.style.setProperty('--velikost', velikost)
  for (let noveX = 1; noveX <= velikost; noveX++) {
    for (let noveY = 1; noveY <= velikost; noveY++) {
      const novyDiv = document.createElement("div");
      novyDiv.classList.add("pole");
      novyDiv.id = noveX + ":" + noveY
      mrizka.append(novyDiv);
      //console.log("Přidám div s id" + novyDiv.id);
    }
    const noveBr = document.createElement("br");
    mrizka.append(noveBr);
  }
  pridejHadaNaNahodnePole()
  pridejZradloNaNahodnePole()
  //nesmrtelnost()
  zrychlení()
}
 
function pohniHadem(dolu, doprava) {
  const hadiHlava = had[0];
  
  console.log("Had je na " + hadiHlava.id);

  let radek = parseInt(hadiHlava.id.split(":")[0]);
  let sloupec = parseInt(hadiHlava.id.split(":")[1]);
  const idCil = radek + dolu + ":" + (sloupec + doprava);
  console.log("Had bude na " + idCil);

  const cilovePolicko = document.getElementById(idCil);

  kontrolaProhry(cilovePolicko)

  had.unshift(cilovePolicko);

  cilovePolicko.classList.add("had");

  if (cilovePolicko.classList.contains("zradlo")) {
    console.log("Had bude žrát");
    cilovePolicko.classList.remove("zradlo");

    pridejZradloNaNahodnePole()

    delkaHada++;
  // upraví délku hada
  document.getElementById("delkaHada").textContent = delkaHada;
}
   else {
    const polickoKterePrestavaBytHadem = had.pop();
    polickoKterePrestavaBytHadem.classList.remove("had");
  }

}

function autopohyb(udalost) {
  const jeToPrvniKlavesa = (posledniKlavesa === 0);
  posledniKlavesa = udalost.which;
  if (jeToPrvniKlavesa) {
    console.log ("Opravdu to je první klávesa!")
    rychlost = setInterval(pohyb, 200);
  }
  console.log("Posledni klavesa je " + posledniKlavesa);
}

function zrychlení() { 
  if (velikost > 12){
    console.log("Zrychluji hada");
    clearInterval(rychlost);
    rychlost = setInterval(pohyb, 100);
  }
}

function pohyb() {
  if (posledniKlavesa === 37) {
    console.log("Hade, jdi doleva pls");
    pohniHadem(0, -1);
  }
  if (posledniKlavesa === 38) {
    console.log("Hade, jdi nahoru pls");
    pohniHadem(-1, 0);
  }
  if (posledniKlavesa === 39) {
    console.log("Hade, jdi doprava pls");
    pohniHadem(0, 1);
  }
  if (posledniKlavesa === 40) {
    console.log("Hade, jdi dolů pls");
    pohniHadem(1, 0);
  }
}




function resetujHru() {
  // čistá plocha
  
  let pole = document.querySelectorAll(".pole");
  pole.forEach(function(policko) {
    policko.classList.remove("had", "zradlo");
  });
  console.log("Odstraňuji žrádla a hada");
  //nový had a žrádlo
  pridejZradloNaNahodnePole();
  pridejHadaNaNahodnePole();
  
    document.addEventListener("keydown", autopohyb);
  
}

function kontrolaProhry(cilovePolicko) {
  if (cilovePolicko == null) {
    clearInterval(rychlost); //had se zastaví
    window.alert("Had narazil do zdi:(");
    resetujHru();
   
    //window.location.reload(); //page reload   
  }
  else if (cilovePolicko.classList.contains("had")) {
    clearInterval(rychlost); //had se zastaví
    window.alert("Sebe sežrat nemůžeš");
    resetujHru();
    
    //window.location.reload();
  }
}

// save the score in local storage
function ulozDelkuHada() {
  localStorage.setItem('delkaHada', delkaHada);
}

// retrieve the score from local storage on page load
window.onload = function() {
  if (localStorage.getItem('delkaHada')) {
    delkaHada = parseInt(localStorage.getItem('delkaHada'));
    
  document.getElementById("delkaHada").textContent = delkaHada;
  }
}



/*function objeveniPortalu(klavesaP) {
  const jeToP = (klavesaPortal === 80);
  klavesaPortal = klavesaP.which;
  if (jeToP) {
    portaly()
  }
}
function portaly() {
  console.log("Portály se spawnou");
  if ()
}*/