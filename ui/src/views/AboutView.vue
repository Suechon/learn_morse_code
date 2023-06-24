<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
</script>


<template>
  <div>
    <v-row class="text-center justify-center">
      <v-col cols="12">
        <h1 class="mt-12">404 NOT FOUND</h1>
        <v-btn class="mt-3" @click="router.push('/')" variant="outlined">
          TOP
        </v-btn>
      </v-col>
      <v-col cols="8">
        <v-img
          class="mt-0 pt-0"
          src="404cat.jpg"
          aspect-ratio="1/1"
          height="400"
        >
        </v-img>
      </v-col>
    </v-row>
  </div>
</template>

