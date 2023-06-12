

<script setup>
import { onMounted, computed, inject, ref } from "vue";
const DOT = "・";
const DASH = "－";
let keypressTime = ref(null);
let keyupTime = ref(null);
let beforePressDuration = ref(0);
let inputSignal = ref("");
let displaySignal = ref("");
let unJudgeWord = ref("NEKO");
let judgedWord = ref("");
let unJudgeSignal = ref("");
let jugingSignal = ref("");
let judgedSignal = ref("");

const morseCodeMap = inject("morseCodeMap");

onMounted(() => {
  buildExampleSignal();
  document.addEventListener("keypress", keypress_event);
  document.addEventListener("keyup", keyup_event);
  // document.getElementById(
  //   "word"
  // ).innerHTML = `<span class="neon">${unJudgeWord.value}</span>`;
});

const keypress_event = (e) => {
  if (e.keyCode != 32) return;
  if (keypressTime.value != null) return;

  keypressTime.value = Date.now();

  // intervalの計算
  // if (keyupTime.value != null) {
  //   let interVal = keypressTime.value - keyupTime.value;
  //   if (300 < interVal) {
  //     // interval一定以上だったら次の文字
  //     inputSignal.value = "";
  //   }
  //   // 初期化
  //   keyupTime.value = null;
  // }
};

const keyup_event = (e) => {
  if (e.keyCode != 32) return;
  keyupTime.value = Date.now();
  let pressDuration = keyupTime.value - keypressTime.value;

  // if (beforePressDuration.value == 0) {
  if (pressDuration <= 230) {
    // dot:0
    // console.log("短い" + pressDuration);
    inputSignal.value += DOT;
  } else {
    // dash:1
    // console.log("長い" + pressDuration);
    inputSignal.value += DASH;
  }
  // beforePressDuration.value = pressDuration;
  // } else {
  //   if (pressDuration <= beforePressDuration.value) {
  //     console.log("短い" + beforePressDuration.value + ";" + pressDuration);
  //     beforePressDuration.value = pressDuration + 50;
  //     inputSignal.value += DOT;
  //   } else {
  //     beforePressDuration.value = pressDuration - 100;
  //     console.log("長い" + beforePressDuration.value + ";" + pressDuration);
  //     inputSignal.value += DASH;
  //   }
  // }
  displaySignal.value = inputSignal.value;
  console.log(displaySignal.value);

  // if (pressDuration <= 200) {
  //   // dot:0
  //   console.log("短い" + pressDuration);
  //   inputSignal.value += DOT;
  // } else {
  //   // dash:1
  //   console.log("長い" + pressDuration);
  //   inputSignal.value += DASH;
  // }

  // ここまでで信号が確定するので文字の判定をする
  judgeCode();
  // 初期化
  keypressTime.value = null;
};
const buildExampleSignal = () => {
  var chars = unJudgeWord.value.split("");
  chars.forEach(function (char) {
    unJudgeSignal.value += morseCodeMap.value.get(char) + " ";
  });
  // 末尾の空白消す
  unJudgeSignal.value = unJudgeSignal.value.slice(0, -1);
  judgedSignal.value = "";
  return;
};
// 文字の判定処理
const judgeCode = () => {
  if (inputSignal == null || inputSignal.value.length < 1) return;

  const judgeChar = unJudgeWord.value.substring(0, 1);
  const correctMorse = morseCodeMap.value.get(judgeChar);

  for (let i = 0; i < inputSignal.value.length; i++) {
    if (inputSignal.value[i] != correctMorse[i]) {
      // console.log("みすってる");
      // iぶんのjudgedSignalを削除する
      // 確定してる文字をとりだす
      var confirmSignal = judgedSignal.value.substring(
        0,
        judgedSignal.value.length - i
      );
      // ミスってるところとりだす
      var missSignal = judgedSignal.value.slice(judgedSignal.value.length - i);
      // 正解してるsignalをいれなおす
      judgedSignal.value = confirmSignal;
      // 失敗したsignalを未判定にいれなおす
      unJudgeSignal.value = missSignal + unJudgeSignal.value;

      inputSignal.value = "";
      return;
    }
  }
  if (inputSignal.value.length != correctMorse.length) {
    // 一部の信号はあってる
    changeSignalColor();
    return;
  }
  changeSignalColor();
  changeTextColor(judgeChar);

  // 初期化
  inputSignal.value = "";

  // 全部の文字が終わった場合
  if (unJudgeWord.value.length == 0) {
    console.log("finish");
    unJudgeWord.value = "INU";
    judgedWord.value = "";
    displaySignal.value = "";
    buildExampleSignal();
  }
};
const changeTextColor = (judgeChar) => {
  judgedWord.value += judgeChar;
  unJudgeWord.value = unJudgeWord.value.slice(1);
  // let tag = `<span class="collectText">${judgedWord.value}</span><span class="neon">${unJudgeWord.value}</span>`;
  // word.value = unJudgeWord;
  // document.getElementById("word").innerHTML = tag;
};
const changeSignalColor = () => {
  var targetSignal = unJudgeSignal.value.substring(0, 1);
  if (targetSignal != DOT && targetSignal != DASH) {
    targetSignal = unJudgeSignal.value.substring(1, 2);
    judgedSignal.value += " ";
    unJudgeSignal.value = unJudgeSignal.value.slice(1);
  }
  judgedSignal.value += targetSignal;
  unJudgeSignal.value = unJudgeSignal.value.slice(1);
};
</script>
//------------------------------------------------- 
<template>
  <v-container class="align-center" fill-height fluid>
    <v-col>
      <v-row class="text-center justify-center">
        <v-col class="mb-4">
          <div>
            <span class="collectText">{{ judgedWord }}</span>
            <span class="neon">{{ unJudgeWord }}</span>
          </div>
          <div>
            <span class="neonSignal">{{ judgedSignal }}</span>
            <span class="graySignal">{{ unJudgeSignal }}</span>
          </div>
          <div align="center">
            <v-col cols="4">
              <div class="displaySignal">{{ displaySignal }}</div>
            </v-col>
          </div>

          <br />

          <!-- --------------------------------------------------------------------------------------------------------------- -->
          <br />
          <!-- {{ inputSignal }} -->

          <!-- <div id="word"></div> -->
          <!-- <span v-for="items in judgedSignal" :key="items.value">
          <span v-if="items == 0" class="collectSignal">
            <v-icon class="collectSignal">mdi-circle-small</v-icon>
          </span>
          <span v-else-if="items == 1" class="collectSignal">
            <v-icon class="collectSignal">mdi-minus</v-icon>
          </span>
          <span v-else class="ma-2"> </span>
        </span> -->
          <!-- <span v-for="items in unJudgeSignal" :key="items.value">
          <span v-if="items == 0"><v-icon>mdi-circle-small</v-icon></span>
          <span v-else-if="items == 1"><v-icon>mdi-minus</v-icon></span>
          <span v-else class="ma-2"> </span>
        </span> -->
        </v-col>
      </v-row>
    </v-col>
  </v-container>
</template>

<style>
/*!
 * "Alfa Slab One" is lisenced under the SIL Open Font License 1.1
 * by https://fonts.googleapis.com/css2?family=Alfa+Slab+One
 */
@import url("https://fonts.googleapis.com/css2?family=Jura:wght@300&display=swap");

/* ------ */
:root {
  --text-size: 100px;
}

.collectText {
  /* padding: 20px; */
  font-family: "Jura", sans-serif;
  font-size: var(--text-size);
  text-shadow: 0 0 10px #00b3ff, 0 0 20px #00b3ff, 0 0 40px #00b3ff,
    0 0 80px #00b3ff, 0 0 120px #00b3ff, 0 0 200px #00b3ff;
}
.neonSignal {
  /* padding: 20px; */
  font-size: 40px;
  font-family: "Jura", sans-serif;
  text-shadow: 0 0 7px #c4c4c6, 0 0 10px #c4c4c6, 0 0 21px #c4c4c6,
    0 0 42px #c4c4c6, 0 0 82px #c4c4c6, 0 0 92px #c4c4c6, 0 0 102px #c4c4c6,
    0 0 151px #c4c4c6;
}
.graySignal {
  font-size: 40px;
  font-family: "Jura", sans-serif;
  color: #929291;
}
.neon {
  /* padding: 20px; */
  font-size: var(--text-size);
  font-family: "Jura", sans-serif;
  color: #929291;
}
.displaySignal {
  font-size: 30px;
  height: 50px;
  width: 300px;
  border: 1px solid #fff;
  /* border-radius: 2rem; */
  /* padding: ; */
  box-shadow: 0 0 1px #fff, 0 0 1px #fff, 0 0 10px #c4c4c6, 0 0 10px #c4c4c6,
    0 0 10px #c4c4c6, inset 0 0 5px #c4c4c6;
}
</style>
