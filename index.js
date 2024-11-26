import {HightEncryption} from './app.js';

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

const runProgress = ()=>{
    const run = document.querySelector(".run");
    let i = 0;
    let id = setInterval(() => {
        i++;
        if(i>100) clearInterval(id);
        else{
            run.style.width = `${i}%`;
            percent.innerHTML = `${i}%`;
        }
    },15);
}

btn[0].addEventListener("click",()=>{
    if(inputT.value === "" || inputK.value === ""){
        inputT.value = "Chưa có plain text để mã hóa";
        inputK.value = "Chưa có key để mã hóa";
        setTimeout(()=>{
            inputT.value = "";
            inputK.value = "";
        },3000)
    }
    else if(inputT.value.length<8 || inputK.value.length<16){
        inputT.value = "Plain Text < 8 kí tự";
        inputK.value = "Key < 16 kí tự";
        setTimeout(()=>{
            inputT.value = "";
            inputK.value = "";
        },3000)
    }
    else{
        headLine1.style.width = "100px";
        headLine2.style.width = "350px";
        tailLine1.style.width = "100px";
        tailLine2.style.width = "350px";
        outputLine.style.width = "320px";
    runProgress();
    setTimeout(()=>{output.value = HightEncryption(inputT.value,inputK.value).join(" ");},1000);
    }
})