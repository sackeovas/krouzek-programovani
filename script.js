let had = [document.querySelector(".had")]
let plocha = document.getElementById("plocha")
const poleVelikost = document.getElementById("velikost");
const velikost = parseInt(poleVelikost.value);

function pridejHadaNaNahodnePole(velikost) {
  let a = Math.floor(Math.random() * velikost + 1) ; //Math.floor zaokrouhlí na celé číslo dolů
  let b = Math.floor(Math.random() * velikost + 1) ;
  let nahodnePole = document.getElementById(a + ":" + b)

  console.log("Chci hodit hada na " + a + ":" + b)

  nahodnePole.classList.add("had");
  had = [nahodnePole]
}

function pridejZradloNaNahodnePole(velikost) {
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

//SPECIÁLNÍ ŽRÁDLA
function nesmrtelnost(velikost){
  let a = Math.floor(Math.random() * (velikost) + 1);
  let b = Math.floor(Math.random() * (velikost) + 1);
  let nahodnePolee = document.getElementById(a + ":" + b);

  if (nahodnePolee.classList.contains("had")) {
    // Recursively call the function until an unoccupied pole is found
    nesmrtelnost(velikost);} 
  else if(nahodnePolee.classList.contains("zradlo")) {
    nesmrtelnost(velikost);}
  else {
    nahodnePolee.classList.add("nesmrtelneZradlo");
    console.log("Chci hodit nesmrtelné žrádlo na " + a + ":" + b);
    zradlo = [nahodnePolee];
  }
  }
  

window.onload = function btnAppears() {
  let startButton = document.getElementById("startButton");
  startButton.style.display = "block";
  plocha.style.display = "none";

  startButton.addEventListener('click', function () {
    startButton.style.display = "inline-block";
    plocha.style.display = "inline-block"
  });
}

const customGrid = document.getElementById("customGrid")
customGrid.addEventListener("click", zmenaMrizky)

function zmenaMrizky() {
  const mrizka = document.getElementById("plocha");

  for (const element of mrizka.querySelectorAll("br, .pole")) {
    element.remove()
  }
  const puvodniMezera = document.createElement("br");
  mrizka.append(puvodniMezera)

  const poleVelikost = document.getElementById("velikost");
  const velikost = parseInt(poleVelikost.value);
  console.log("Měním mřížku na velikost " + velikost)
  mrizka.style.setProperty('--velikost', velikost)
  for (let noveX = 1; noveX <= velikost; noveX++) {
    for (let noveY = 1; noveY <= velikost; noveY++) {
      const novyDiv = document.createElement("div");
      novyDiv.classList.add("pole");
      novyDiv.id = noveX + ":" + noveY
      mrizka.append(novyDiv);
      console.log("Přidám div s id" + novyDiv.id);
    }
    const noveBr = document.createElement("br");
    mrizka.append(noveBr);
  }
  pridejHadaNaNahodnePole(velikost)
  pridejZradloNaNahodnePole(velikost)
  nesmrtelnost(velikost)
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

    pridejZradloNaNahodnePole(velikost)
  } else {
    const polickoKterePrestavaBytHadem = had.pop();
    polickoKterePrestavaBytHadem.classList.remove("had");
  }
  
  if (cilovePolicko.classList.contains("nesmrtelneZradlo")) {
    console.log("Had bude nesmrtelný");
    cilovePolicko.classList.remove("nesmrtelneZradlo");

  } else {
    const polickoKterePrestavaBytHadem = had.pop();
    polickoKterePrestavaBytHadem.classList.remove("had");
  }
}

let posledniKlavesa = 0;

let rychlost;

function autopohyb(udalost) {
  const jeToPrvniKlavesa = (posledniKlavesa === 0);
  posledniKlavesa = udalost.which;
  if (jeToPrvniKlavesa) {
    rychlost = setInterval(pohyb, 200);
  }
  console.log("Posledni klavesa je " + posledniKlavesa);
}

function zrychlení(velikost) { //nefunguje :(((
  if (velikost > 12){
    clearInterval(rychlost);
    rychlost = setInterval(pohyb, 100);
    console.log("Zrychluji hada");
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


function kontrolaProhry(cilovePolicko) {
  if (cilovePolicko == null) {
    clearInterval() //had se zastaví
    window.alert("Had narazil do zdi:(")

    window.location.reload(); //page reload   
  }
  else if (cilovePolicko.classList.contains("had")) {
    clearInterval() //had se zastaví
    window.alert("Sebe sežrat nemůžeš")
    window.location.reload();
  }
  if (cilovePolicko.classList.contains("nesmrtelneZradlo")){
    setTimeout(kontrolaProhry(cilovePolicko),5000);
    console.log ("Had je 5s nesmrtelný")
  }
}

document.addEventListener("keydown", autopohyb);

zmenaMrizky()