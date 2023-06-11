
<script setup>
import { onMounted, ref } from "vue";
let keypressTime = ref(null);
let keyupTime = ref(null);
let inputSignal = ref("");
let signal = ref("");
let unJudgeWord = ref("NEKO");
let judgeWord = ref("");
const morseCodeMap = ref(new Map());
morseCodeMap.value.set("A", "01");
morseCodeMap.value.set("B", "1000");
morseCodeMap.value.set("C", "1010");
morseCodeMap.value.set("D", "100");
morseCodeMap.value.set("E", "0");
morseCodeMap.value.set("F", "0010");
morseCodeMap.value.set("G", "110");
morseCodeMap.value.set("H", "0000");
morseCodeMap.value.set("I", "00");
morseCodeMap.value.set("J", "0111");
morseCodeMap.value.set("K", "101");
morseCodeMap.value.set("L", "0100");
morseCodeMap.value.set("M", "11");
morseCodeMap.value.set("N", "10");
morseCodeMap.value.set("O", "111");
morseCodeMap.value.set("P", "0110");
morseCodeMap.value.set("Q", "1101");
morseCodeMap.value.set("R", "010");
morseCodeMap.value.set("S", "000");
morseCodeMap.value.set("T", "1");
morseCodeMap.value.set("U", "001");
morseCodeMap.value.set("V", "0001");
morseCodeMap.value.set("W", "011");
morseCodeMap.value.set("X", "1001");
morseCodeMap.value.set("Y", "1011");
morseCodeMap.value.set("Z", "1100");

onMounted(() => {
  document.addEventListener("keypress", keypress_event);
  document.addEventListener("keyup", keyup_event);
  document.getElementById("word").innerHTML = unJudgeWord.value;
  // document.getElementById("word").innerHTML = `<span>${unJudgeWord}</span>`;
});

const keypress_event = (e) => {
  if (e.keyCode != 32) return;
  if (keypressTime.value != null) return;

  keypressTime.value = Date.now();

  // intervalの計算
  /**if (keyupTime.value != null) {
    let interVal = keypressTime.value - keyupTime.value;
    if (250 < interVal) {
      // interval一定以上だったら次の文字
      inputSignal.value = "";
    }
    // 初期化
    keyupTime.value = null;
  } */
};

const keyup_event = (e) => {
  if (e.keyCode != 32) return;
  keyupTime.value = Date.now();
  let pressDuration = keyupTime.value - keypressTime.value;

  if (pressDuration <= 180) {
    // dot:0
    inputSignal.value += "0";
  } else {
    // dash:1
    inputSignal.value += "1";
  }

  // ここまでで信号が確定するので文字の判定をする
  judgeCode();
  // changeColor();
  // 色をかえる
  // 初期化
  keypressTime.value = null;
};

const judgeCode = () => {
  if (inputSignal == null || inputSignal.value.length < 1) return;

  let judgeChar = unJudgeWord.value.substring(0, 1);

  let correctMorse = morseCodeMap.value.get(judgeChar);

  for (let i = 0; i < inputSignal.value.length; i++) {
    console.log(inputSignal.value[i] + "::" + correctMorse[i]);
    if (inputSignal.value[i] != correctMorse[i]) {
      inputSignal.value = "";
      console.log("NG");
      return;
    }
  }
  if (inputSignal.value.length != correctMorse.length) {
    // 一部の信号はあってる
    return;
  }
  changeColor(judgeChar);
  // 初期化
  inputSignal.value = "";
  console.log("OK");
};
const changeColor = (judgeChar) => {
  // let judgeChar = unJudgeWord.value.substring(0, 1);

  judgeWord.value += judgeChar;
  unJudgeWord.value = unJudgeWord.value.slice(1);
  let tag = `<span style="color:pink">${judgeWord.value}</span><span>${unJudgeWord.value}</span>`;
  // word.value = unJudgeWord;
  document.getElementById("word").innerHTML = tag;
};
</script>


<template>
  <div class="about">
    <!-- {{ unJudgeWord }} -->
    {{ inputSignal }}
    <p id="word"></p>
  </div>
</template>

