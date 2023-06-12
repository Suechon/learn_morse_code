<script setup>
import { ref, provide, readonly } from "vue";
const morseCodeMap = ref(new Map());
// morseCodeMap.value.set("A", "01");
// morseCodeMap.value.set("B", "1000");
// morseCodeMap.value.set("C", "1010");
// morseCodeMap.value.set("D", "100");
// morseCodeMap.value.set("E", "0");
// morseCodeMap.value.set("F", "0010");
// morseCodeMap.value.set("G", "110");
// morseCodeMap.value.set("H", "0000");
// morseCodeMap.value.set("I", "00");
// morseCodeMap.value.set("J", "0111");
// morseCodeMap.value.set("K", "101");
// morseCodeMap.value.set("L", "0100");
// morseCodeMap.value.set("M", "11");
// morseCodeMap.value.set("N", "10");
// morseCodeMap.value.set("O", "111");
// morseCodeMap.value.set("P", "0110");
// morseCodeMap.value.set("Q", "1101");
// morseCodeMap.value.set("R", "010");
// morseCodeMap.value.set("S", "000");
// morseCodeMap.value.set("T", "1");
// morseCodeMap.value.set("U", "001");
// morseCodeMap.value.set("V", "0001");
// morseCodeMap.value.set("W", "011");
// morseCodeMap.value.set("X", "1001");
// morseCodeMap.value.set("Y", "1011");
// morseCodeMap.value.set("Z", "1100");
morseCodeMap.value.set("A", "・－");
morseCodeMap.value.set("B", "－・・・");
morseCodeMap.value.set("C", "－・－・");
morseCodeMap.value.set("D", "－・・");
morseCodeMap.value.set("E", "・");
morseCodeMap.value.set("F", "・・－・");
morseCodeMap.value.set("G", "－－・");
morseCodeMap.value.set("H", "・・・・");
morseCodeMap.value.set("I", "・・");
morseCodeMap.value.set("J", "・－－－");
morseCodeMap.value.set("K", "－・－");
morseCodeMap.value.set("L", "・－・・");
morseCodeMap.value.set("M", "－－");
morseCodeMap.value.set("N", "－・");
morseCodeMap.value.set("O", "－－－");
morseCodeMap.value.set("P", "・－－・");
morseCodeMap.value.set("Q", "－－・－");
morseCodeMap.value.set("R", "・－・");
morseCodeMap.value.set("S", "・・・");
morseCodeMap.value.set("T", "－");
morseCodeMap.value.set("U", "・・－");
morseCodeMap.value.set("V", "・・・－");
morseCodeMap.value.set("W", "・－－");
morseCodeMap.value.set("X", "－・・－");
morseCodeMap.value.set("Y", "－・－－");
morseCodeMap.value.set("Z", "－－・・");
provide("morseCodeMap", readonly(morseCodeMap));
</script>
<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

