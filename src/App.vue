<script setup lang="ts">
import { ref } from 'vue'
import GameBoard from './components/GameBoard.vue'
import { type BoardDimensions } from './components/GameBoard.vue'
const dim=ref({x:20,y:10} as BoardDimensions)
</script>

<template>
  <GameBoard :dimensions="dim"/>
</template>