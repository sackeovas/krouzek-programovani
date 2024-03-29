
// Konstanty
const plocha = document.getElementById("plocha")
const tlacitkoStart = document.getElementById("tlacitkoStart")
const tlacitkoZmenVelikost = document.getElementById("tlacitkoZmenVelikost")

console.log(plocha)

// Globalní proměnné
let posledniKlavesa = 0;
let delkaHada = 1;
let nejdelsiHad =1;

let stavHry = {
	velikost: 12,
  rychlost: null, 
  had: [{x: 9, y: 3}],
  zradlo: [{x: 4, y: 6}],
}

var peer = new Peer();
peer.on("open", function(mojeid) {
  console.log('My peer ID is: ' + mojeid);
	document.getElementById("mojeid").textContent = mojeid
  peer.on("connection", function(connection) {
    setInterval(() => {
      console.log ("posílám stavhry", stavHry)
      connection.send(stavHry)
    }, 50)
  })
})
peer.on("error", function(error) {
  console.error(error)
})

function pripojse() {
	const ciziid = document.getElementById("ciziid").value
  if (ciziid === "") {
  	return
  }
  document.getElementById("ciziid").value = ""
	const connection = peer.connect(ciziid)
  connection.on('open', function(){
    console.log("Připojil se!")
    skryjButtonky()
    connection.on("data", function(stavHry){
      console.log ("přijímám stavhry", stavHry)
      zobrazStavHry(stavHry)
    })
  })
  connection.on("error", function(error) {
  	console.error(error)
  })
}


function skryjButtonky() {
  var tlacitkoStart = document.getElementById("tlacitkoStart");
  var tlacitkoZmenVelikost = document.getElementById("tlacitkoZmenVelikost");
  var velikost = document.getElementById("velikost");
  var plocha = document.getElementById("plocha");

  tlacitkoStart.remove();
  tlacitkoZmenVelikost.remove();
  velikost.remove();
  plocha.style.display = "";
}

function zobrazStavHry (stavHry){
  for (const element of plocha.querySelectorAll("br, .pole")) {
    element.remove()
  }
  const puvodniMezera = document.createElement("br");
  plocha.append(puvodniMezera)
  plocha.style.setProperty('--velikost', stavHry.velikost)
  for (let noveX = 1; noveX <= stavHry.velikost; noveX++) {
    for (let noveY = 1; noveY <= stavHry.velikost; noveY++) {
      const novyDiv = document.createElement("div");
      novyDiv.classList.add("pole");
      novyDiv.id = noveX + ":" + noveY
      plocha.append(novyDiv);
    }
    const noveBr = document.createElement("br");
    plocha.append(noveBr);
  }
  stavHry.had.forEach(({x, y}) => {
    const poleHada = document.getElementById(x + ":" + y)
    poleHada.classList.add("had");
   });
  stavHry.zradlo.forEach(({x, y}) => {
    const poleZradla = document.getElementById(x + ":" + y)
    poleZradla.classList.add("zradlo");
   });
  autopohyb()
} 

// Události
tlacitkoStart.addEventListener('click', function () {
  console.log("Hra začala.")
  tlacitkoStart.remove()
  plocha.style.display = ""
  document.addEventListener("keydown", autopohyb);
});
tlacitkoZmenVelikost.addEventListener("click", zmenaMrizky)


// Počáteční nastavení
zmenaMrizky()

function pridejHadaNaNahodnePole() {
  const x = Math.floor(Math.random() * stavHry.velikost + 1) ; //Math.floor zaokrouhlí na celé číslo dolů
  const y = Math.floor(Math.random() * stavHry.velikost + 1) ;
  const nahodnePole = document.getElementById(x + ":" + y)

  console.log("Chci hodit hada na " + x + ":" + y)

  nahodnePole.classList.add("had");
  stavHry.had = [{x: x, y: y}]
}

function pridejZradloNaNahodnePole() {
  let x = Math.floor(Math.random() * (stavHry.velikost) + 1);
  let y = Math.floor(Math.random() * (stavHry.velikost) + 1);
  let nahodnePolee = document.getElementById(x + ":" + y);
  
  if (nahodnePolee.classList.contains("had")) {
    pridejZradloNaNahodnePole();
  } else {
    nahodnePolee.classList.add("zradlo");
    console.log("Chci hodit zradlo na " + x + ":" + y);
    stavHry.zradlo = [{x: x, y: y}];
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
  stavHry.velikost = parseInt(poleVelikost.value);
  console.log("Měním mřížku na velikost " + stavHry.velikost)

  mrizka.style.setProperty('--velikost', stavHry.velikost)
  for (let noveX = 1; noveX <= stavHry.velikost; noveX++) {
    for (let noveY = 1; noveY <= stavHry.velikost; noveY++) {
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
  zrychlení()
}
 
function pohniHadem(dolu, doprava) {
  const hadiHlava = stavHry.had[0];
  console.log("Had je na " + hadiHlava.x + ":" + hadiHlava.y);

  const idCil = hadiHlava.x + dolu + ":" + (hadiHlava.y + doprava);
  console.log("Had bude na " + idCil);

  const cilovePolicko = document.getElementById(idCil);

  if (kontrolaProhry(cilovePolicko)) {
    resetujHru();
    return
  }

  stavHry.had.unshift({x: hadiHlava.x + dolu, y: hadiHlava.y + doprava});
  cilovePolicko.classList.add("had");

  if (cilovePolicko.classList.contains("zradlo")) {
  console.log("Had bude žrát");
   cilovePolicko.classList.remove("zradlo");  // Odstraní žrádlo z herní plochy
   stavHry.zradlo = []   // Odstraní žrádlo ze stavuHry
   pridejZradloNaNahodnePole()
   delkaHada++;
    if (delkaHada > nejdelsiHad) {
      localStorage.setItem("nejdelsiHad", delkaHada);
    }
    document.getElementById("delkaHada").textContent = delkaHada; 
    // upraví délku hada
    nejdelsiHad = parseInt(localStorage.getItem('nejdelsiHad'));
    document.getElementById("nejdelsiHad").textContent = nejdelsiHad;
  
    
  }
  //V BUDOUCNU TADY BUDE JAKÉSI  aktualizujHru();
   else {
    const souradniceKteraPrestavaBytHadem = stavHry.had.pop();
    const polickoKterePrestavaBytHadem = document.getElementById(souradniceKteraPrestavaBytHadem.x + ":" +  souradniceKteraPrestavaBytHadem.y)
    polickoKterePrestavaBytHadem.classList.remove("had");
  }
}

function autopohyb(udalost) {
  const jeToPrvniKlavesa = (posledniKlavesa === 0);
  posledniKlavesa = udalost.which;
  if (jeToPrvniKlavesa) {
    console.log ("Opravdu to je první klávesa!")
    clearInterval(stavHry.rychlost);
    stavHry.rychlost = setInterval(pohyb, 150)
  }
  console.log("Posledni klavesa je " + posledniKlavesa);
}

function zrychlení() { 
  if (stavHry.velikost > 12){
    console.log("Zrychluji hada");
    clearInterval(stavHry.rychlost);
    stavHry.rychlost = setInterval(pohyb, 100);
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
  clearInterval(stavHry.rychlost);
  stavHry.rychlost = null //had se zastaví
  posledniKlavesa = 0;
  let pole = document.querySelectorAll(".pole");
  pole.forEach(function(policko) {
    policko.classList.remove("had", "zradlo");
  });
  console.log("Odstraňuji žrádla a hada");

  delkaHada = 1;
  document.getElementById("delkaHada").textContent = delkaHada;


  
  //nový had a žrádlo
  pridejZradloNaNahodnePole();
  pridejHadaNaNahodnePole();
  document.addEventListener("keydown", autopohyb);
}

function kontrolaProhry(cilovePolicko) {
  if (cilovePolicko == null) {
    window.alert("Had narazil do zdi:(");
    return true
  }

  if (cilovePolicko.classList.contains("had")) { 
    window.alert("Sebe sežrat nemůžeš"); 
    return true
  }
  return false
}

function ulozDelkuHada() {
  localStorage.setItem('delkaHada', delkaHada);
  window.onload = function() {
    if (localStorage.getItem('delkaHada')) {
      delkaHada = parseInt(localStorage.getItem('delkaHada'));
      document.getElementById("delkaHada").textContent = delkaHada;
    }
  }
}



