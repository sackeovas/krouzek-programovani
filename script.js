let had = [document.querySelector(".had")]

function pohniHadem(dolu, doprava) {
  const hadiHlava = had[0]
  console.log("Had je na " + hadiHlava.id);

  let radek = parseInt(hadiHlava.id.split(":")[0]);
  let sloupec = parseInt(hadiHlava.id.split(":")[1]);
  const idCil = radek + dolu + ":" + (sloupec + doprava);
  console.log("Had bude na " + idCil);

  const cilovePolicko = document.getElementById(idCil);

  had.unshift(cilovePolicko);

  cilovePolicko.classList.add("had");

  if (cilovePolicko.classList.contains("zradlo")) {
    console.log("Had bude žrát");
    cilovePolicko.classList.remove("zradlo");
  
    generateFood()
  } else {
    const polickoKterePrestavaBytHadem = had.pop();
    polickoKterePrestavaBytHadem.classList.remove("had");
  }
}

let posledniKlavesa = 0;
function autopohyb(udalost) {
  const jeToPrvniKlavesa = (posledniKlavesa === 0);
  posledniKlavesa = udalost.which;
  if (jeToPrvniKlavesa) {
    setInterval(pohyb, 300);
  }
  console.log("Posledni klavesa je " + posledniKlavesa);

  }

generateFood()

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
function generateFood() {
  let x = Math.floor(Math.random() * 4)+1;
  let y = Math.floor(Math.random() * 4)+1;
 let zradlo = document.getElementById (x + ":"+y)
 zradlo.classList.add("zradlo");
}

document.addEventListener("keydown", autopohyb);