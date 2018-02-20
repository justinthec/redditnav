// Passes a message to our content script so that changed
// properties (button color, position, etc.) can be reloaded
const passMessage = async (prop, changedVal) => {
  const msg = {
    message: messages[prop.toUpperCase()],
    changed: { [prop]: changedVal }
  }

  const tabs = await _queryTabs({ currentWindow: true, active: true })
  for (const tab of tabs) {
    _sendMessage(tab.id, msg ).catch(logRes)
  }
}

// Initialize the extension popup with current settings
_storageGet({
  buttonPos: navButton.POSN.RIGHT,
  color: navButton.COLOR,
  scrollSpeed: speeds.MULTIPLIER.MEDIUM,
  scrollUp: scrollKey.UP,
  scrollDown: scrollKey.DOWN
}).then(items => {
  document.getElementById(items.buttonPos).checked = true
  document.querySelector(`input[value="${items.scrollSpeed}"]`).checked = true
  document.querySelector(`.color--${colorMap[items.color]}`)
    .classList
    .add('activeColor')
  document.getElementById('up').value = items.scrollUp
  document.getElementById('down').value = items.scrollDown
}, logRes)


// Event listener for radio button settings (position, speed)
const addInputListener = (selector, prop) =>
  document.getElementsByClassName(selector)[0]
    .addEventListener('change', event =>
      _storageSet({
        [prop]: event.target.value
      }).then(
        () => passMessage(prop, event.target.value),
        logRes
      )
    )
addInputListener('section--posn', 'buttonPos')
addInputListener('section--speed', 'scrollSpeed')


// Event listener for nav button color selection palette
document.getElementsByClassName('colors-container')[0]
  .addEventListener('click', event => {
    const newColor = window.getComputedStyle(event.target).backgroundColor
    _storageSet({
      color: newColor
    }).then(() => {
      document.querySelector('.activeColor').classList.remove('activeColor')
      event.target.classList.add('activeColor')
      passMessage('color', newColor)
    }, logRes)
  })


// Allow pretty much any alphanumeric or symbol character.
// Doesn't include unicode chars such as ñ (due to poor JS support)
const isValidBinding = key =>
  /[$-/:-?{-~!@#"^_`\\\[\]a-z0-9]/i.test(key) && key.length === 1

document.getElementsByClassName('section--bindings')[0]
  .addEventListener('keypress', event => {
    if (isValidBinding(event.key))
      _storageGet({
        scrollDown: scrollKey.DOWN,
        scrollUp: scrollKey.UP
      }).then(bindings => {
        const changed =
          event.target.id === 'up' ?
            'scrollUp' :
            'scrollDown'
        const onSet = () => {
          passMessage(changed, event.key)
          event.target.value = event.key
        }

        switch (event.key) {
          case bindings.scrollDown && changed === 'scrollUp':
            _storageSet({
              scrollDown: bindings.scrollUp,
              scrollUp: event.key
            }).then(() => {
              onSet()
              document.getElementById('down').value = bindings.scrollUp
            }, logRes)
            break
          case bindings.scrollUp && changed === 'scrollDown':
            _storageSet({
              scrollDown: event.key,
              scrollUp: bindings.scrollDown
            }).then(() => {
              onSet()
              document.getElementById('up').value = bindings.scrollDown
            }, logRes)
            break
          default:
            _storageSet({ [changed]: event.key })
              .then(onSet, logRes)
        }
      })
    else
      console.log(`Keybindings are limited to alphanumeric keys and symbols.`)
  })
