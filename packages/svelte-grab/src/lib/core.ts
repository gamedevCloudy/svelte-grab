import { createGrabStore } from './store.js'
import { EventListenerManager } from './events.js'
import { setupPointerTracking } from './pointer.js'
import { getElementContext } from './context.js'
import { tryCopy, formatSnippet } from './copy.js'
import { getPlugins } from './plugin-registry.js'
import { mountOverlay } from './overlay/overlay.js'
import { ACTIVATION_KEY } from './constants.js'
import { freeze, unfreeze } from './freeze.js'
import { getElementsInRect } from './drag-select.js'
import { addToHistory } from './history.js'
import type { GrabOptions } from './types.js'

declare global {
  interface Window {
    __SVELTE_GRAB__?: { destroy: () => void }
  }
}

export function init(options: GrabOptions = {}): () => void {
  if (typeof window === 'undefined') return () => {}
  if (window.__SVELTE_GRAB__) return window.__SVELTE_GRAB__.destroy

  const store = createGrabStore()
  const events = new EventListenerManager()
  const activationKey = options.activationKey ?? ACTIVATION_KEY

  const unmountOverlay = mountOverlay(store)
  setupPointerTracking(store, events)

  // Helper: grab a single element and return to `returnPhase` when done
  function grabElement(el: Element, returnPhase: 'idle' | 'active') {
    if (options.freezeOnGrab) freeze()
    store.setPhase('copying')
    getElementContext(el).then(ctx => {
      store.setLastCopied(ctx)
      options.onCopy?.(ctx)
      addToHistory({
        content: formatSnippet(ctx),
        elementName: ctx.componentName ?? ctx.element.tagName.toLowerCase(),
      })
      return tryCopy([ctx], getPlugins())
    }).catch(err => {
      options.onError?.(err instanceof Error ? err : new Error(String(err)))
    }).finally(() => {
      if (options.freezeOnGrab) unfreeze()
      store.setPhase(returnPhase)
    })
  }

  // Keydown: Cmd/Ctrl+C toggles active or grabs; Escape exits active
  events.add(document, 'keydown', (e) => {
    const ke = e as KeyboardEvent

    if (ke.key === 'Escape') {
      if (store.get().phase === 'active') {
        store.setActive(false)
      }
      return
    }

    if ((ke.metaKey || ke.ctrlKey) && ke.key === activationKey) {
      const { hoveredElement, phase } = store.get()
      if (!hoveredElement) {
        // Toggle active mode when nothing is hovered
        store.setActive(phase !== 'active')
        ke.preventDefault()
        return
      }
      ke.stopPropagation()
      ke.preventDefault()
      const wasActive = phase === 'active'
      grabElement(hoveredElement, wasActive ? 'active' : 'idle')
    }
  }, { capture: true })

  // Click-to-select while active
  events.add(document, 'click', (e) => {
    if (store.get().phase !== 'active') return
    const el = store.get().hoveredElement
    if (!el) return
    e.preventDefault()
    e.stopPropagation()
    grabElement(el, 'active')
  }, { capture: true })

  // Context menu while active
  events.add(document, 'contextmenu', (e) => {
    if (store.get().phase !== 'active') return
    const el = store.get().hoveredElement
    if (!el) return
    e.preventDefault()
    const me = e as MouseEvent
    store.showContextMenu(me.clientX, me.clientY, el)
  }, { capture: true })

  // Drag multi-select while active
  let dragStart: { x: number; y: number } | null = null

  events.add(document, 'mousedown', (e) => {
    if (store.get().phase !== 'active') return
    const me = e as MouseEvent
    if (me.button !== 0) return
    dragStart = { x: me.clientX, y: me.clientY }
  }, { capture: true })

  events.add(document, 'mousemove', (e) => {
    if (!dragStart) return
    const me = e as MouseEvent
    const x = Math.min(dragStart.x, me.clientX)
    const y = Math.min(dragStart.y, me.clientY)
    const w = Math.abs(me.clientX - dragStart.x)
    const h = Math.abs(me.clientY - dragStart.y)
    if (w > 5 || h > 5) store.setDragRect({ x, y, w, h })
  }, { capture: true })

  events.add(document, 'mouseup', (e) => {
    const me = e as MouseEvent
    const dr = store.get().dragRect
    store.setDragRect(null)
    dragStart = null
    if (!dr || (dr.w < 5 && dr.h < 5)) return
    e.preventDefault()
    e.stopPropagation()
    const rect = new DOMRect(dr.x, dr.y, dr.w, dr.h)
    const elements = getElementsInRect(rect)
    if (elements.length === 0) return
    store.setPhase('copying')
    Promise.all(elements.map(getElementContext)).then(ctxs => {
      options.onCopy?.(ctxs[0])
      for (const ctx of ctxs) {
        addToHistory({
          content: formatSnippet(ctx),
          elementName: ctx.componentName ?? ctx.element.tagName.toLowerCase(),
        })
      }
      return tryCopy(ctxs, getPlugins())
    }).catch(err => {
      options.onError?.(err instanceof Error ? err : new Error(String(err)))
    }).finally(() => {
      store.setPhase('active')
    })
  }, { capture: true })

  function destroy() {
    events.dispose()
    unmountOverlay()
    store.reset()
    delete window.__SVELTE_GRAB__
  }

  window.__SVELTE_GRAB__ = { destroy }
  return destroy
}
