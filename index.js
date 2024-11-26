import { HightEncryption, whiteningKey,subKey,InitialTransfomation,finalTransfomation,StringToHex,roundFunction} from "./app.js";

const btn = document.querySelectorAll(".btnBox button");
const headLine1 = document.querySelector(".headLine1");
const headLine2 = document.querySelector(".headLine2");
const tailLine1 = document.querySelector(".tailLine1");
const tailLine2 = document.querySelector(".tailLine2");
const outputLine = document.querySelector(".outputLine");
const progress = document.querySelector(".progress");
const percent = document.querySelector(".percent");

const output = document.querySelector("#outputText");
const inputT = document.querySelector("#inputText");
const inputK = document.querySelector("#inputKey");
const runGene = document.querySelector(".runGene");
const modulBox = document.querySelector(".modulBox");
const boxes = document.querySelectorAll(".box");

const sub = document.querySelectorAll(".sub");

const calDistance = (box, runGene) => {
  return (modulBox.offsetWidth - runGene.offsetWidth) / 2 - box.offsetWidth;
};

const runProgress = () => {
  const run = document.querySelector(".run");
  let i = 0;
  let id = setInterval(() => {
    i++;
    if (i > 100) clearInterval(id);
    else {
      run.style.width = `${i}%`;
      percent.innerHTML = `${i}%`;
    }
  }, 15);
};

const insertText = (i,varName)=>{
    let obj={};
    const ps = document.querySelectorAll("p");
    console.log(varName);
    varName.forEach((item,index)=>{
        obj[`${varName}${index}`] = item; 
    })
    ps[i].innerHTML = "";
    for (const element in obj) {
        ps[i].innerHTML+=element;
    }
    for (const key in obj) {
        if (obj.hasOwnProperty( key)) {
            delete obj[key];
        }
    }
}

btn[0].addEventListener("click", () => {
  if (inputT.value === "" || inputK.value === "") {
    inputT.value = "Chưa có plain text để mã hóa";
    inputK.value = "Chưa có key để mã hóa";
    setTimeout(() => {
      inputT.value = "";
      inputK.value = "";
    }, 3000);
  } else if (inputT.value.length < 8 || inputK.value.length < 16) {
    inputT.value = "Plain Text < 8 kí tự";
    inputK.value = "Key < 16 kí tự";
    setTimeout(() => {
      inputT.value = "";
      inputK.value = "";
    }, 3000);
  } else {
    debugger
    headLine1.style.width = "100px";
    headLine2.style.width = `${calDistance(boxes[0], runGene)}px`;
    tailLine1.style.width = "100px";
    tailLine2.style.width = `${calDistance(boxes[1], runGene)}px`;
    outputLine.style.width = `${calDistance(boxes[2], runGene)}px`;
    runProgress();
    setTimeout(() => {
      output.value = HightEncryption(inputT.value, inputK.value).join(" ");
      const body = document.querySelector("body");
      body.style.overflow = "visible";
    }, 1000);
    let P = StringToHex(inputT.value).split(" ");
    let MK = StringToHex(inputK.value).split(" ");
    let X = [];
    const ps = document.querySelectorAll("p");
    const WK = whiteningKey(inputK.value);
    const SK = subKey(MK);
    X[0] = InitialTransfomation(inputT.value,WK[3],WK[2],WK[1],WK[0]);
    console.log(InitialTransfomation(P,WK[3],WK[2],WK[1],WK[0]));
    console.log(WK);
    console.log(typeof P[0]);
    console.log(MK);
    ps[0].innerHTML = `${whiteningKey(MK).join(" ")}`;
    ps[1].innerHTML = `SK[0] = ${subKey(MK)[0]} -> SK[${subKey(MK).length-1}] = ${subKey(MK)[subKey(MK).length-1]}`;
    ps[2].innerHTML = `X[0] = ${X[0]}`;
    for (let i = 0; i <= 31; i++) {
        X[i + 1] = roundFunction(
          X[i],
          X[i + 1],
          SK[4 * i + 3],
          SK[4 * i + 2],
          SK[4 * i + 1],
          SK[4 * i]
        );
      }
    ps[3].innerHTML = `X[31] = ${X[31]}`;
    ps[4].innerHTML = HightEncryption(inputT.value, inputK.value).join(" ");
  }
});

btn[1].addEventListener("click", () => {
  const run = document.querySelector(".run");
  inputT.value = "";
  inputK.value = "";
  output.value = "";
  headLine1.style.width = "0px";
  headLine2.style.width = "0px";
  tailLine1.style.width = "0px";
  tailLine2.style.width = "0px";
  outputLine.style.width = "0px";
  run.style.width = `0%`;
  percent.innerHTML = `0%`;
  const body = document.querySelector("body");
  body.style.overflow = "hidden";
});

window.addEventListener("scroll", () => {
  sub.forEach((s) => {
    let scrollY = window.scrollY;
    // let marginTop = Number.parseInt(getComputedStyle(s).marginTop,10);
    let offsetTop = s.offsetTop;
    let height = s.offsetHeight;
    if (scrollY + window.innerHeight >= offsetTop && scrollY <= offsetTop + height) {
        s.classList.add('show');
      } else {
        s.classList.remove('show');
      }
      
  });
});
