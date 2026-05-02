<script setup lang="ts">
import backgroundUrl from '../assets/background.jpg'
</script>

<template>
	<div id="background" :style="{ backgroundImage: `url(${backgroundUrl})` }"></div>
</template>
