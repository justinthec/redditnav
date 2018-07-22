const colorMap = {
  'rgb(244, 67, 54)' : 'red',
  'rgb(255, 87, 34)' : 'orange',
  'rgb(255, 193, 7)' : 'yellow',
  'rgb(76, 175, 80)' : 'green',
  'rgb(96, 125, 139)' : 'grey',
  'rgb(103, 58, 183)' : 'purple',
  'rgb(33, 150, 243)' : 'blue',
  'rgb(0, 188, 212)' : 'cyan'
}

const directions = {
  UP: 'up',
  DOWN: 'down'
}

const messages = {
  COLOR: 1,
  BUTTONPOS: 2,
  SCROLLSPEED: 3,
  SCROLLUP: 4,
  SCROLLDOWN: 5
}

const navButton = {
  POSN: {
    HIDDEN: 'hide',
    LEFT: 'left',
    RIGHT: 'right',
  },
  COLOR: 'rgb(255, 87, 34)'
}

const scrollKey = {
  UP: 'q',
  DOWN: 'w'
}

const speeds = {
  BASE_DURATION: 400, // 400ms
  MULTIPLIER: {
    SLOW: 2,
    MEDIUM: 1,
    FAST: 0.5,
    INSTANT: 0
  }
}

const logRes = res => console.log(res)

const resetClassList = cl => cl.remove('left', 'right', 'hide')

// Firefox/Chrome extension API compatibility stuff

// Promisify chrome's shitty api :^)
const _promisifyChrome = prop => (...args) =>
  new Promise(cb => prop(...args, res => cb(res)))

const _storageGet = key => _getProp('storage.sync.get')(key)
const _storageSet = i => _getProp('storage.sync.set')(i)

const _extensionGetUrl = uri => _getProp('extension.getURL')(uri)

const _onRuntimeMessage = f => _getProp('runtime.onMessage.addListener')(f)
const _queryTabs = q => _getProp('tabs.query')(q)
const _sendMessage = (id, msg) => _getProp('tabs.sendMessage')(id, msg)

const _traverse = (obj, sel) => {
  const doTraverse = (o, s) =>
    s.length === 1 ?
      o[s].bind(o) :
      doTraverse(o[s[0]], s.slice(1))
  return doTraverse(obj, sel.split('.'))
}

const _getProp = p => {
  try {
    return _traverse(browser, p)
  } catch (err) {
    if (err instanceof ReferenceError)
      return p.includes('storage') ||
             p.includes('tabs') ?
        _promisifyChrome(_traverse(chrome, p)) :
        _traverse(chrome, p)
    else
      console.log(err)
  }
}
