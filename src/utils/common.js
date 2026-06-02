import router from '@system.router'
import vibrator from '@system.vibrator'
import storage from './storage.js'

let vibrateEnabled = false

storage.get({
  key: 'EBOOK_VIBRATE_ON_TOUCH',
  success: (data) => { vibrateEnabled = data === 'true' },
  fail: () => { vibrateEnabled = false }
})

export function refreshVibrateSetting() {
  storage.get({
    key: 'EBOOK_VIBRATE_ON_TOUCH',
    success: (data) => { vibrateEnabled = data === 'true' },
    fail: () => { vibrateEnabled = false }
  })
}

export function vibrateIfEnabled() {
  if (vibrateEnabled) {
    try { vibrator.vibrate({ mode: 'short' }) } catch (e) {}
  }
}

export function goBackWithVibration() {
  vibrateIfEnabled()
  router.back()
}
