export const usePanelDragging = () => useState('is-panel-dragging',() => false)

export const useTerminalStream = () => useState<ReadableStream | undefined>('terminal-stream',() => undefined)