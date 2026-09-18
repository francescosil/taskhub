
function saluta(){
    return new Promise((resolve,reject)=>{setTimeout(()=>{
        resolve("ciao mondo")
    },1000)
})
}

saluta().then(r=>console.log(r))

async function esegui() {
    try{
    const succ=await saluta()
    console.log(succ)}
    catch(err){console.log(err)}

}

esegui()




function getNumero() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(5);
    }, 1000);
  });
}

getNumero().then(r=>console.log(r*2))
getNumero().then(r=>r*2).then(r=>console.log(r))







function numeroIniziale() {
  return new Promise(resolve => {
    setTimeout(() => resolve(4), 500);
  });
}


numeroIniziale().then(r=>r+3).then(r=>r*2).then(r=>console.log(r))






function fallisce() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject("Errore grave");
    }, 500);
  });
}

fallisce().catch(console.log("errore gestito"))




function getNumeroAsync() {
  return new Promise(resolve => {
    setTimeout(() => resolve(7), 800);
  });
}


async function esegui2(){
    try{
        const num=await getNumeroAsync()
        const num1=num*3
        console.log(num1)
    }
    catch(err){console.log(err)}
}

esegui2();

function puoFallire() {
  return new Promise((resolve, reject) => {
    const ok = false;
    setTimeout(() => {
      ok ? resolve("Tutto bene") : reject("Ops");
    }, 500);
  });
}

async function esegui3(){
    try{
        const succ=await puoFallire()
        console.log(succ)
    }
    catch(err){console.log(err)}
}

esegui3();