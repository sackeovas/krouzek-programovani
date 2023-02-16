let had = [document.querySelector(".had")]
let plocha = document.getElementById("plocha")

window.onload = function btnAppears() {
  let startButton = document.getElementById("startButton");
    startButton.style.display = "block";
  plocha.style.display = "none";
  
  
  startButton.addEventListener('click', function() {
    startButton.style.display = "none";
    plocha.style.display = "inline-block"
  });
}



function pohniHadem(dolu, doprava) {
  const hadiHlava = had[0]
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
  let x = Math.floor(Math.random() * 4) + 1;
  let y = Math.floor(Math.random() * 4) + 1;
  let nahodnePolicko = document.getElementById(x + ":" + y)
  if (nahodnePolicko.classList.contains("had") == false) {   //tohle můžu zapsat i takto: !nahodnePolicko.classList.contains("had")
    nahodnePolicko.classList.add("zradlo");
  }
}

function kontrolaProhry(cilovePolicko){
  if (cilovePolicko==null) {
    clearInterval() //had se zastaví
    window.alert ("Had narazil do zdi:(")
    
    window.location.reload(); //page reload   

    
  }
  else if (cilovePolicko.classList.contains ("had")) {
    clearInterval() //had se zastaví
    window.alert ("Sebe sežrat nemůžeš")
    window.location.reload();

    
  }
}




document.addEventListener("keydown", autopohyb);