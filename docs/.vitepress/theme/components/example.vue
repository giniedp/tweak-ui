<template>
  <div class="example-frame" ref="frame"></div>
</template>

<style>

</style>
<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
export type RunFn = (canvas: HTMLCanvasElement, tools: HTMLElement) => RunDisposeFn
export type RunDisposeFn = () => void

const examples = import.meta.glob('/**/example*.ts');

const frame = ref<HTMLElement | null>(null)
const props = defineProps({
  name: String
})
let toDispose: RunDisposeFn | null = null
let isMounted = false
onMounted(async () => {
  isMounted = true
  try {
    const exampleName = location.pathname + (props.name || 'example.ts')
    const exampleLoader = examples[exampleName]
    const module = await exampleLoader()
    if (isMounted) {
      module.default(frame.value) || null
    }
  } catch (e) {
    console.error(e)
  }
})

onUnmounted(() => {
  isMounted = false
  if (toDispose) {
    toDispose()
    toDispose = null
  }
})

</script>
