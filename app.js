
// K/MK        master key
// WK       whitening key
// SK       subkey
//HIGHT STEPS:
//+ Key Schedule:
// - KeySchedule(MK,WK,SK) {
//  WhiteningKeyGeneration(MK,WK);
//  SubkeyGeneration(MK,SK);
//  }
//  - WhiteningKeyGeneration:
//  WhiteningKeyGeneration {
//     For i = 0 to 7{
//     If 0 ≤ i ≤3, then WKi = MKi+12;
//     Else, WKi =  MKi−4;
//     }
//     }
// ==>  for i = 0, 1, 2, 3:
// WKi = K(i+12)
// for i = 4, 5, 6, 7:
// WKi = K(i-4)
// ||: concatenation
// [^]: XOR operation
// [+]: addition modular A + B = 100 + 200 = 300 mod 256 = 44
// - Subkey Generation:
// (1) s0 = 0, s1 = 1, s2 = 0, s3 = 1, s4 = 1, s5 = 0, s6 = 1
//              d0 = s6 || s5 || s4 || s3 || s2 || s1 || s0

//          (2) for i = 1 to 127:
//                  s(i+6) = s(i+2) [^] s(i-1)
//                  di = s(i+6)||s(i+5)||s(i+4)||s(i+3)||s(i+2)||s(i+1)||si

//          (3) for i = 0 to 7:
//              for j = 0 to 7:
//                  SK(16*i+j) = K(j-i mod 8) [+] d(16*i+j)
//              for j = 0 to 7:
//                  SK(16*i+j+8) = K((j-i mod 8)+8) [+] d(16*i+j+8)

// P = P7||···P1||P0
// Initial Transformation
// X0 = X0,7||X0,6||···||X0,0
// InitialTransfomation(P,X0,WK3,WK2,WK1,WK0) {
//     X0,0 = P0 [+] WK0; X0,1 = P1; X0,2 = P2 [^] WK1; X0,3 =P3;
//     X0,4 = P4 [+] WK2; X0,5 = P5; X0,6 = P6 [^] WK3; X0,7 =P7;
// }

// Round Function
// F0(x)=x<<<1  [^] x<<<2 [^] x<<<7,
// F1(x)=x<<<3  [^] x<<<4 [^] x<<<6.
// For i = 0,··· ,31, RoundFunction transforms Xi = Xi,7||···||Xi,0 into Xi+1 =
//  Xi+1,7||···||Xi+1,0 as follows.
//  RoundFunction(Xi,Xi+1,SK4i+3,SK4i+2,SK4i+1,SK4i) {
//  Xi+1,1 = Xi,0; Xi+1,3 = Xi,2; Xi+1,5 = Xi,4; Xi+1,7 = Xi,6;
//  Xi+1,0 = Xi,7 [^] (F0(Xi,6) [+] SK4i+3);
//  Xi+1,2 = Xi,1 [+] (F1(Xi,0) [^] SK4i+2);
//  Xi+1,4 = Xi,3 [^] (F0(Xi,2) [+] SK4i+1);
//  Xi+1,6 = Xi,5 [+] (F1(Xi,4) [^] SK4i);
//  }

// Final Transformation
// FinalTransfomation(X32,C,WK7,WK6,WK5,WK4) {
//     C0 = X32,1 [+] WK4; C1 = X32,2; C2 =  X32,3 [^] WK5; C3 =  X32,4;
//     C4 = X32,5 [+] WK6; C5 = X32,6; C6 =  X32,7 [^] WK7; C7 =  X32,0;
// }
//C = C7||···C1||C0
//cipher text

// HightEncryption(P,MK) {
//     KeySchedule(MK,WK,SK);
//     HightEncryption(P,WK,SK) {
//     InitialTransfomation(P,X0,WK3,WK2,WK1,WK0);
//     For i =0to31{
//     RoundFunction(Xi,Xi+1,SK4i+3,SK4i+2,SK4i+1,SK4i);
//      }
//     FinalTransfomation(X32,C,WK7,WK6,,WK5,WK4);
//     }
// }

function DecToBin8Bit(num) {
    let bin = Number(num).toString(2).padStart(8, "0");
    return bin;
  }
  
  function BinToDec(bin) {
    return parseInt(bin,2);
  }
  

  const whiteningKey = (MK) => {
    let WK = new Array(8);
    for (let i = 0; i <= 7; i++) {
      (i <= 3) ?WK[i] =  MK[i+12] : WK[i] = MK[i-4];
    }
    return WK;
  };
  
  const subKey = (MK) => {
    let SK = [];
    let s = new Array(128).fill(0);
    let d = new Array(128).fill("");
  
    // Initialize `s`
    s[0] = '0';
    s[1] = '1';
    s[2] = '0';
    s[3] = '1';
    s[4] = '1';
    s[5] = '0';
    s[6] = '1';
    
    // Generate `d`
    for(let i=6;i>=0;i--){
        d[0] += s[i];
    }
    for (let i = 1; i <= 127; i++) {
        s[i + 6] = s[i + 2] ^ s[i - 1];
        for (let j = 6; j >= 0; j--) {
            d[i] += s[i + j];
        }
    }
    debugger
    // Generate subkeys
    for (let i = 0; i <= 7; i++) {
            for (let j = 0; j <= 7; j++) {
                let dec = BinToDec(d[16*i+j]);
                // SK[16 * i + j] = (MK[(j-i)%8] + Number.parseInt(dec.toString(16))) %256;
                SK[16 * i + j] = (MK[(j-i)%8] + BinToDec(d[16*i+j])) %256;
            }
            for (let j = 0; j <= 7; j++) {
                let dec = BinToDec(d[16*i+j+8]);
            //   SK[16 * i + j + 8] = ((MK[(j - i) % 8] + 8) + Number.parseInt(dec.toString(16))) % 256;
              SK[16 * i + j + 8] = ((MK[(j - i) % 8] + 8) + BinToDec(d[16*i+j+8])) % 256;
            }
        }
    return SK;
}
function InitialTransfomation(P, WK3, WK2, WK1, WK0) {
  let X0 = new Array(8);
  X0[0] =(P[0] + WK0) % 256;
  X0[1] = P[1];
  X0[2] = P[2] ^ WK1;
  X0[3] = P[3];
  X0[4] = (P[4] + WK2) % 256;
  X0[5] = P[5];
  X0[6] = P[6] ^ WK3;
  X0[7] = P[7];
  return X0;
}
  
function rotate(x, time) {
  x = [...x];
  for (let i = 0; i < time; i++) {
    let temp = x[0];
    for (let j = 0; j < x.length - 1; j++) {
      x[j] = x[j + 1];
    }
    x[x.length - 1] = temp;
  }
  return x.join("");
}
  
const F0 = (x) => {
  x = DecToBin8Bit(x);
  let x1 = x.split(""),
    x2 = x.split(""),
    x7 = x.split("");
  x1 = rotate(x1, 1);
  x2 = rotate(x2, 2);
  x7 = rotate(x7, 7);
  x1 = BinToDec(x1);
  x2 = BinToDec(x2);
  x7 = BinToDec(x7);
  return x1 ^ x2 ^ x7;
};

const F1 = (x) => {
  x = DecToBin8Bit(x);
  let x3 = x.split(""),
    x4 = x.split(""),
    x6 = x.split("");
  x3 = rotate(x3, 3);
  x4 = rotate(x4, 4);
  x6 = rotate(x6, 6);
  x3 = BinToDec(x3);
  x4 = BinToDec(x4);
  x6 = BinToDec(x6);
  return x3 ^ x4 ^ x6;
};



function roundFunction(Xi, Xip1, SK43, SK42, SK41, SK4) {
  Xip1 = new Array(8);
  Xip1[1] = Xi[0];
  Xip1[3] = Xi[2];
  Xip1[5] = Xi[4];
  Xip1[7] = Xi[6];
  Xip1[0] =Xi[7] ^ ((F0(Xi[6]) + SK43) % 256);
  Xip1[2] =(Xi[1] + (F1(Xi[0]) ^ SK42)) % 256;
  Xip1[4] =Xi[3] ^ ((F0(Xi[2]) + SK41) % 256);
  Xip1[6] =((Xi[5] + (F1(Xi[2]) ^ SK4)) % 256);
  return Xip1;
}
  
function finalTransfomation(X32, C, WK7, WK6, WK5, WK4) {
  C[0] = (X32[1] + WK4) % 256;
  C[1] = X32[2];
  C[2] = X32[3] ^ WK5;
  C[3] = X32[4];
  C[4] = (X32[5] + WK6) % 256;
  C[5] = X32[6];
  C[6] = X32[7] ^ WK7;
  C[7] = X32[0];
  return C;
}
  
const StringToHex = (input)=>{
  let temp = input.split("");
  temp = temp.map(item => item.charCodeAt());
  temp = temp.map(item => item.toString(16)).join(" ");
  return temp;
}

export const HightEncryption = (P, MK) => {
  debugger
  P = StringToHex(P).split(" ");
  console.log(P);
  MK = StringToHex(MK).split(" ");
  console.log(MK);
  let C = new Array(8).fill("");
  let WK = whiteningKey(MK);
  let SK = subKey(MK);
  let X = [];
  X[0] = InitialTransfomation(P, WK[3], WK[2], WK[1], WK[0]);
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
  C = finalTransfomation(X[X.length - 1], C, WK[7], WK[6], WK[5], WK[4]);
  C = C.map(item => item.toString(16));
  return C;
};
  
  // Example usage:
// let P = [0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07];
// let MK = [0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x41, 0x42, 0x43, 0x44,0x45,0x46];
let P = "01234567";
let MK = "0123456789ABCDEF";
let C = HightEncryption(P,MK);
// Array(8) [ '54', '2E', 'A9', '42', '32', '68', 'A9', '36' ]
console.log(C);
console.log(C.map(item => item.toString(16)).join(" "));

let temp = [];
temp[0] = "2";
console.log(4 ** temp[0]);
console.log(typeof Number.parseInt(temp[0]));
console.log(Number.parseInt(temp[0]).toString(2));
temp[0] = temp[0].concat("213");
let t = "";
t = t.replace(t.charAt(0).toString(), "213");
console.log("B" ^ "1");
console.log(("1" + "1") % 256);
console.log([...t]);
console.log("1".charCodeAt());
console.log(0x88 === 136);
let dec = 64;
console.log(Number.parseInt(dec.toString(16)));
console.log(StringToHex("abc"));