<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes'
import { usePanelDragging, useTerminalStream } from '@/composables/state';


const isDragging = usePanelDragging()
const stream = useTerminalStream()

const panelSizeEditor = useLocalStorage('codeground-right-panel-editor', 30)
const panelSizePreview = useLocalStorage('codeground-right-panel-preview', 30)

function startDragging() {
  isDragging.value = true
}

function endDragging(e: { size: number }[]) {
  isDragging.value = false
  panelSizeEditor.value = e[0].size;
  panelSizePreview.value = e[1].size

}
</script>

<template>
  <Splitpanes 
  max-h-full w-full 
  horizontal of-hidden relative
  @resize="startDragging" @resized="endDragging">
    <Pane :size="panelSizeEditor">
      <!-- Editor -->
      <Editor/>
    </Pane>
    <Pane :size="panelSizePreview">
      <!-- Preview -->
      <Preview/>
    </Pane>
    <Pane>
      <!-- Terminal -->
      <Terminal :stream="stream" min-h-0 />
    </Pane>
  </Splitpanes>
</template>
