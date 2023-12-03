import { defineConfig, presetAttributify, presetIcons, presetUno } from 'unocss'

export default defineConfig({
  shortcuts: {
    'b-base': 'b-gray:50',
  },
  presets: [
    presetUno(),
    presetIcons(),
    presetAttributify(),
  ],
})
