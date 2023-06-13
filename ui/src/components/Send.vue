

<script setup>
import axios from "axios";
import { onMounted, computed, reactive, inject, ref } from "vue";
const DOT = "・";
const DASH = "－";
let keydownTime = ref(null);
let keyupTime = ref(null);
// let beforePressDuration = ref(0);
let wordsList = ref([]);
let inputSignal = ref("");
let displaySignal = ref("");
let unJudgeWord = ref("");
let judgedWord = ref("");
let unJudgeSignal = ref("");
let jugingSignal = ref("");
let judgedSignal = ref("");
let bar = ref("");
let interval = ref("");

const morseCodeMap = inject("morseCodeMap");

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
  // axios
  //   .get("https://random-word-api.vercel.app/api?words=3&type=uppercase")
  //   .then((response) => {
  //     wordsList.value = response.data;
  //     unJudgeWord.value = wordsList.value[0];
  //     buildExampleSignal();
  //   })
  //   .catch((error) => console.log(error));
  wordsList.value = ["NEKO", "SOS", "DISCOUNT"];
  unJudgeWord.value = "NEKO";
  buildExampleSignal();
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
    unJudgeSignal.value += morseCodeMap.value.get(char) + " ";
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
    // unJudgeWord.value = "INU";
    var index = wordsList.value.indexOf(judgedWord.value);
    judgedWord.value = "";
    displaySignal.value = "";
    if (index != wordsList.value.length - 1) {
      unJudgeWord.value = wordsList.value[index + 1];
      buildExampleSignal();
    }
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
            GUIDE
            <div align="center">
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
  font-size: 6vmin;
  font-family: "Jura", sans-serif;
  text-shadow: 0 0 7px #c4c4c6, 0 0 10px #c4c4c6, 0 0 21px #c4c4c6,
    0 0 42px #c4c4c6, 0 0 82px #c4c4c6, 0 0 92px #c4c4c6, 0 0 102px #c4c4c6,
    0 0 151px #c4c4c6;
}
.graySignal {
  font-size: 6vmin;
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

/* .btn-circle-border-simple:hover {
  background: #b3e1ff;
} */
</style>
