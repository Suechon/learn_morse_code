

<script setup>
import axios from "axios";
import { onMounted, computed, reactive, inject, ref } from "vue";
const DOT = "・";
const DASH = "－";
let keydownTime = ref(null);
let keyupTime = ref(null);
// let beforePressDuration = ref(0);
let inputSignal = ref("");
let displaySignal = ref("");
let unJudgeWord = ref("");
let judgedWord = ref("");
let unJudgeSignal = ref("");
let jugingSignal = ref("");
let judgedSignal = ref("");
let bar = ref("");
let interval = ref("");
// 問題に出す単語リスト
let words = ref([]);
let dialog = ref(true);
let messageFlg = ref(false);
let slideValue = ref("");
const selector = {
  0: "3",
  1: "5",
  2: "10",
  3: "20",
};

const morseCodeMap = inject("morseCodeMap");
const WORD_LIST = inject("wordList");
const wordList = ref([]);
wordList.value = [...WORD_LIST.value];

onMounted(() => {
  // ダブルタップで拡大無効
  document.addEventListener(
    "dblclick",
    function (e) {
      e.preventDefault();
    },
    { passive: false }
  );
  bar.value = document.getElementById("bar");
  document.addEventListener("keydown", keydown_event);
  document.addEventListener("keyup", keyup_event);
  // wordsList.value = ["NEKO", "SOS", "DISCOUNT"];
  // unJudgeWord.value = "NEKO";
});

const btnPush = (e) => {
  console.log("push");
  pushCommon();
};
const btnUp = (e) => {
  console.log("up");
  upCommon();
};

const keydown_event = (e) => {
  if (e.keyCode != 32) return;
  pushCommon();
};
const keyup_event = (e) => {
  if (e.keyCode != 32) return;
  upCommon();
};
const pushCommon = () => {
  if (keydownTime.value != null) return;
  keydownTime.value = Date.now();

  let barWidth = 0;

  // 棒を延ばすアニメーション
  bar.value.classList.remove("red");
  interval = setInterval(function () {
    barWidth += 2;
    bar.value.style.width = barWidth + "px";

    if (barWidth >= 100) {
      bar.value.classList.add("red");
    }
    if (barWidth >= 200) {
      clearInterval(interval);
    }
  }, 1);

  // intervalの計算
  // if (keyupTime.value != null) {
  //   let interVal = keydownTime.value - keyupTime.value;
  //   if (300 < interVal) {
  //     // interval一定以上だったら次の文字
  //     inputSignal.value = "";
  //   }
  //   // 初期化
  //   keyupTime.value = null;
  // }
};

const upCommon = () => {
  keyupTime.value = Date.now();

  // バー伸びとめる
  clearInterval(interval);
  var barWidth = 0;
  interval = setInterval(function () {
    barWidth -= 1;
    bar.value.style.width = barWidth + "px";

    if (barWidth <= 0) {
      clearInterval(interval);
    }
  }, 0);

  let pressDuration = keyupTime.value - keydownTime.value;

  if (pressDuration <= 180) {
    inputSignal.value += DOT;
  } else {
    inputSignal.value += DASH;
  }

  displaySignal.value = inputSignal.value;

  // ここまでで信号が確定するので文字の判定をする
  judgeCode();
  // 初期化
  keydownTime.value = null;
};

const buildExampleSignal = () => {
  var chars = unJudgeWord.value.split("");
  chars.forEach(function (char) {
    unJudgeSignal.value += morseCodeMap.value.get(char) + "　";
  });
  // 末尾の空白消す
  unJudgeSignal.value = unJudgeSignal.value.slice(0, -1);
  judgedSignal.value = "";
  keydownTime.value = 0;
  keyupTime.value = 0;
  return;
};
// 文字の判定処理
const judgeCode = () => {
  if (inputSignal == null || inputSignal.value.length < 1) return;

  const judgeChar = unJudgeWord.value.substring(0, 1);
  const correctMorse = morseCodeMap.value.get(judgeChar);

  for (let i = 0; i < inputSignal.value.length; i++) {
    if (correctMorse == null || inputSignal.value[i] != correctMorse[i]) {
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
      keydownTime.value = 0;
      keyupTime.value = 0;
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
    if (words.value.length == 1) {
      messageFlg.value = true;
      reset();
      return;
    }
    judgedWord.value = "";
    displaySignal.value = "";
    // 問題単語リストの頭を削除
    words.value.splice(0, 1);
    // 問題単語リストの新頭を問題とする
    unJudgeWord.value = words.value[0];
    buildExampleSignal();
  }
};
const changeTextColor = (judgeChar) => {
  judgedWord.value += judgeChar;
  unJudgeWord.value = unJudgeWord.value.slice(1);
};
const changeSignalColor = () => {
  var targetSignal = unJudgeSignal.value.substring(0, 1);
  if (targetSignal != DOT && targetSignal != DASH) {
    targetSignal = unJudgeSignal.value.substring(1, 2);
    judgedSignal.value += "　";
    unJudgeSignal.value = unJudgeSignal.value.slice(1);
  }
  judgedSignal.value += targetSignal;
  unJudgeSignal.value = unJudgeSignal.value.slice(1);
};

const start = () => {
  console.log("start");
  selectWords();
  dialog.value = false;

  // 実行
  unJudgeWord.value = words.value[0];
  buildExampleSignal();
};
async function reset() {
  // 全ての問題を出し終わった
  unJudgeWord.value = "";
  displaySignal.value = "";
  await sleep(1000);
  dialog.value = true;
}
const selectWords = () => {
  var num = 1;
  if (slideValue.value == 0) {
    num = 3;
  }
  if (slideValue.value == 1) {
    num = 5;
  }
  if (slideValue.value == 2) {
    num = 10;
  }
  if (slideValue.value == 3) {
    num = 20;
  }
  for (var i = 0; i < num; i++) {
    if (wordList.value.length == 0) {
      return;
    }
    var word =
      wordList.value[Math.floor(Math.random() * wordList.value.length)];
    words.value.push(word);
    // 使った単語は削除する
    var index = wordList.value.indexOf(word);
    wordList.value.splice(index, 1);
  }
};

function sleep(msec) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve();
    }, msec);
  });
}
</script>
//------------------------------------------------- 
<template>
  <v-container class="align-center" fill-height fluid>
    <v-col>
      <v-row class="text-center justify-center">
        <v-col class="mb-4">
          <!-- 文字 -->
          <v-col cols="12">
            <div>
              <span class="collectText">{{ judgedWord }}</span>
              <span class="neon">{{ unJudgeWord }}</span>
            </div>
          </v-col>

          <!-- お手本 -->
          <v-col cols="12">
            <div>
              <span class="neonSignal">{{ judgedSignal }}</span>
              <span class="graySignal">{{ unJudgeSignal }}</span>
            </div>
          </v-col>
          <!-- 入力文字 -->
          <v-col cols="12">
            <div align="center">
              <!-- <v-col cols="12"> -->
              <div class="displaySignal">{{ displaySignal }}</div>
              <!-- </v-col> -->
            </div>
          </v-col>
          <v-col cols="12" class="pa-10">
            <div align="center">
              GUIDE
              <div class="bar-container" align="left">
                <div id="bar" class="bar"></div>
              </div>
            </div>
          </v-col>
          <!-- 携帯で表示するボタン -->
          <v-col cols="12">
            <div class="pt-13 hidden-lg-and-up">
              <button
                v-wave
                class="btn-circle"
                @touchstart="btnPush"
                @mouseup="btnUp"
              >
                <v-icon size="x-large">mdi-waveform</v-icon>
              </button>
            </div>
          </v-col>
        </v-col>
      </v-row>
    </v-col>

    <!-- ---------------------------------------------------------------------------------- -->

    <v-dialog
      v-model="dialog"
      transition="dialog-bottom-transition"
      persistent
      width="800"
    >
      <v-card height="800" color="#222629">
        <v-container fluid>
          <v-col>
            <v-row
              no-gutters
              v-if="messageFlg"
              dense
              class="mb-12 text-center justify-center"
            >
              <v-col cols="12" class="align-center">
                <div class="bubbly" style="color: #c4c4c6; font-size: 4vmin">
                  <i>GOOD JOB!!</i>
                </div>
                <v-divider class="mt-12"></v-divider>
              </v-col>
            </v-row>
            <v-row dense class="text-center justify-center">
              <div style="color: #c4c4c6; font-size: 3vmin">
                MORSE CODE ALPHABET
              </div>

              <v-col cols="10" class="my-10">
                WORDS
                <v-slider
                  v-model="slideValue"
                  dark
                  color="#c4c4c6"
                  track-color="#00b3ff"
                  :ticks="selector"
                  :max="3"
                  step="1"
                  show-ticks="always"
                  tick-size="5"
                ></v-slider>
                <v-btn
                  class="collectText"
                  style="font-size: 10vmin"
                  variant="plain"
                  x-latge
                  @click="start"
                >
                  START
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-container>
      </v-card>
    </v-dialog>
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
  --text-size: 10vmin;
  /* リンク長押しのポップアップを無効化 */
  -webkit-touch-callout: none;
  /* テキスト長押しの選択ボックスを無効化 */
  -webkit-user-select: none;
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
  font-size: 5vmin;
  font-family: "Jura", sans-serif;
  text-shadow: 0 0 7px #c4c4c6, 0 0 10px #c4c4c6, 0 0 21px #c4c4c6,
    0 0 42px #c4c4c6, 0 0 82px #c4c4c6, 0 0 92px #c4c4c6, 0 0 102px #c4c4c6,
    0 0 151px #c4c4c6;
}
.graySignal {
  font-size: 5vmin;
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

.bar-container {
  width: 200px; /* バーの長さに合わせて調整 */
  height: 5px; /* バーの太さに合わせて調整 */
  background-color: #000; /* バーの背景色 */
}

.bar {
  width: 0;
  height: 100%;
  /* バーの色 */
  background-color: #fff;
  /* アニメーションの設定 */
  transition: width ease-in-out, background-color ease-in-out; /* アニメーションの設定 */
  box-shadow: 0 0 0rem #fff, 0 0 0.2rem #fff, 0 0 2rem #b9b5b9,
    0 0 0.8rem #b9b5b9, 0 0 2.8rem #b9b5b9, inset 0 0 1.3rem #fff;
}
.bar.red {
  background-color: #64aece; /* バーの赤色 */
  box-shadow: 0 0 0rem #1095ce, 0 0 0.2rem #1095ce, 0 0 2rem #227599,
    0 0 0.8rem #227599, 0 0 2.8rem #227599, inset 0 0 1.3rem #227599;
}

.btn-circle {
  display: inline-block;
  text-decoration: none;
  color: #668ad8;
  width: 120px;
  height: 120px;
  line-height: 120px;
  border-radius: 50%;
  border: solid 2px #668ad8;
  text-align: center;
  overflow: hidden;
  font-weight: bold;
  transition: 0.4s;
}

.bubbly {
  font-family: "Helvetica", "Arial", sans-serif;
  display: inline-block;
  /* font-size: 1em; */
  /* padding: 1em 2em; */
  padding: 0.5em 1em;
  margin-top: 100px;
  margin-bottom: 60px;
  -webkit-appearance: none;
  appearance: none;
  color: #fff;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  position: relative;
  transition: transform ease-in 0.1s, box-shadow ease-in 0.25s;
}
.bubbly:focus {
  outline: 0;
}
.bubbly:before,
.bubbly:after {
  position: absolute;
  content: "";
  display: block;
  width: 140%;
  height: 100%;
  left: -20%;
  z-index: -1000;
  transition: all ease-in-out 0.5s;
  background-repeat: no-repeat;
}
.bubbly:before {
  display: block;
  top: -75%;
  background-image: radial-gradient(circle, #ff0081 20%, transparent 20%),
    radial-gradient(circle, transparent 20%, #ff0081 20%, transparent 30%),
    radial-gradient(circle, #ff0081 20%, transparent 20%),
    radial-gradient(circle, #ff0081 20%, transparent 20%),
    radial-gradient(circle, transparent 10%, #ff0081 15%, transparent 20%),
    radial-gradient(circle, #ff0081 20%, transparent 20%),
    radial-gradient(circle, #ff0081 20%, transparent 20%),
    radial-gradient(circle, #ff0081 20%, transparent 20%),
    radial-gradient(circle, #ff0081 20%, transparent 20%);
  background-size: 10% 10%, 20% 20%, 15% 15%, 20% 20%, 18% 18%, 10% 10%, 15% 15%,
    10% 10%, 18% 18%;
  animation: topBubbles ease-in-out 2.5s infinite forwards;
}
.bubbly:after {
  display: block;
  bottom: -75%;
  background-image: radial-gradient(circle, #ff0081 20%, transparent 20%),
    radial-gradient(circle, #ff0081 20%, transparent 20%),
    radial-gradient(circle, transparent 10%, #ff0081 15%, transparent 20%),
    radial-gradient(circle, #ff0081 20%, transparent 20%),
    radial-gradient(circle, #ff0081 20%, transparent 20%),
    radial-gradient(circle, #ff0081 20%, transparent 20%),
    radial-gradient(circle, #ff0081 20%, transparent 20%);
  background-size: 15% 15%, 20% 20%, 18% 18%, 20% 20%, 15% 15%, 10% 10%, 20% 20%;
  animation: bottomBubbles ease-in-out 2.5s infinite forwards;
}

@keyframes topBubbles {
  0% {
    background-position: 5% 90%, 10% 90%, 10% 90%, 15% 90%, 25% 90%, 25% 90%,
      40% 90%, 55% 90%, 70% 90%;
  }
  50% {
    background-position: 0% 80%, 0% 20%, 10% 40%, 20% 0%, 30% 30%, 22% 50%,
      50% 50%, 65% 20%, 90% 30%;
  }
  100% {
    background-position: 0% 70%, 0% 10%, 10% 30%, 20% -10%, 30% 20%, 22% 40%,
      50% 40%, 65% 10%, 90% 20%;
    background-size: 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%;
  }
}
@keyframes bottomBubbles {
  0% {
    background-position: 10% -10%, 30% 10%, 55% -10%, 70% -10%, 85% -10%,
      70% -10%, 70% 0%;
  }
  50% {
    background-position: 0% 80%, 20% 80%, 45% 60%, 60% 100%, 75% 70%, 95% 60%,
      105% 0%;
  }
  100% {
    background-position: 0% 90%, 20% 90%, 45% 70%, 60% 110%, 75% 80%, 95% 70%,
      110% 10%;
    background-size: 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%;
  }
}
</style>
