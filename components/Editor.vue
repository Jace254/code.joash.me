<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes'
import type { VirtualFile } from '~/structures/VirtualFile'
import { filesToVirtualFsTree } from '~/templates/utils'

const props = withDefaults(
  defineProps<{
    files: VirtualFile[]
  }>(),
  {
    files: () => [],
  },
)

const ui = useUiState()
const play = usePlaygroundStore()

const files = computed(() => props.files.filter(file => !isFileIgnored(file.filepath)))
const directory = computed(() => filesToVirtualFsTree(files.value))

const selectedFile = ref<VirtualFile>()
const input = ref<string>('')

// Select the first file by default.
watchEffect(() => {
  if (selectedFile.value == null && files.value.length > 0)
    selectFile(files.value[0])
})

function selectFile(file: VirtualFile) {
  selectedFile.value = file
}

watch(selectedFile, (file) => {
  input.value = file?.read() || ''
})

const onTextInput = useDebounceFn(_onTextInput, 500)
function _onTextInput() {
  if (input.value != null)
    selectedFile?.value?.write(input.value)
}

function startDragging() {
  ui.isPanelDragging = true
}

function endDragging(e: { size: number }[]) {
  ui.isPanelDragging = false
  ui.panelFileTree = e[0].size
}

// For panes size initialization on SSR
const isMounted = useMounted()
const panelInitFileTree = computed(() => isMounted.value || {
  width: `${ui.panelFileTree}%`,
})
const panelInitEditor = computed(() => isMounted.value || {
  width: `${100 - ui.panelFileTree}%`,
})
</script>

<template>
  <div
    h-full
    grid="~ rows-[min-content_1fr]"
  >
    <div
      flex="~ gap-2 items-center"
      border="b base dashed"
      bg-faded px4 py2
    >
      <div i-ph-code-block-duotone text-xl/>
      <span text-sm>Editor</span>
      <div flex-auto />
      <button
        v-if="play.status === 'ready'"
        rounded 
        hover="bg-active"
        title="Download as ZIP"
        @click="play.downloadZip()"
      >
        <div i-ph-download-duotone text-xl />
      </button>
      <button
        rounded 
        title="Toggle terminal"
        hover="bg-active"
        :class="ui.showTerminal ? '' : 'op50'"
        @click="ui.toggleTerminal()"
      >
        <div i-ph-terminal-window-duotone text-xl />
      </button>
    </div>
    <Splitpanes
      @resize="startDragging"
      @resized="endDragging"
    >
      <Pane
        flex="~ col" h-full of-auto py1
        :size="ui.panelFileTree"
        :style="panelInitFileTree"
      >
        <EditorFileSystemTree
          v-model="selectedFile"
          :directory="directory"
          :depth="-1"
        />
      </Pane>
      <PaneSplitter />
      <Pane
        :size="100 - ui.panelFileTree"
        :style="panelInitEditor"
      >
        <LazyEditorMonaco
          v-if="selectedFile"
          v-model="input"
          :filepath="selectedFile.filepath"
          h-full w-full
          @change="onTextInput"
        />
      </Pane>
    </Splitpanes>
  </div>
</template>
