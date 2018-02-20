const fs = require('fs')

const VERSION = "2.0.0"

const BROWSERS = ['chrome', 'firefox']

// Site name should be the same as <sitename>.js in src/sites
const SITES = {
  reddit: "*://*.reddit.com/r/*/comments/*",
  hackernews: "*://news.ycombinator.com/item*"
}

const manifest = {
  "manifest_version": 2,

  "name": "Reddit Nav",
  "description": "Effortlessly scroll through comment threads on Reddit.",
  "version": VERSION,

  "browser_action": {
    "default_icon": "popup/icon128.png",
    "default_popup": "popup/popup.html",
    "default_title": "RedditNav"
  },
  "icons": {
    "48": "popup/icon48.png",
    "128": "popup/icon128.png"
  },
  "permissions": ["storage"],
  "web_accessible_resources": ["navbutton.html"],
  "content_scripts": [],
}

BROWSERS.forEach(browser => {
  const mfst = Object.entries(SITES).reduce((a, [k, v]) => {
    a.content_scripts.push({
      "matches": [v],
      "css": ["navbutton.css"],
      "js": [ "util.js", "scroller.js", `sites/${k}.js`]
    })
    return a
  }, manifest)

  if (browser === 'firefox')
    mfst.applications = { 'gecko': { 'id': 'redditnav@smjc' } }

  fs.writeFile(
    `lib/${browser}/manifest.json`,
    JSON.stringify(mfst),
    err => err ? console.log(err) : null
  )
})
