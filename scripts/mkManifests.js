const fs = require('fs')
const path = require('path')

const VERSION = "3.0.0"

const BROWSERS = ['chrome', 'firefox']

// Site name should be the same as <sitename>.js in src/sites
const SITES = {
  reddit: "*://*.reddit.com/r/*/comments/*",
  hackernews: "*://news.ycombinator.com/item*"
}

const SITE_MATCHES = {
  reddit: "*://*.reddit.com/*",
  hackernews: "*://news.ycombinator.com/*"
}

const baseManifest = {
  "name": "Reddit Nav",
  "description": "Effortlessly scroll through comment threads on Reddit.",
  "version": VERSION,
  "icons": {
    "48": "popup/icon48.png",
    "128": "popup/icon128.png"
  },
  "permissions": ["storage"],
  "content_scripts": [],
}

BROWSERS.forEach(browser => {
  // Create a deep copy to avoid modifying the base manifest
  let manifest = JSON.parse(JSON.stringify(baseManifest))

  if (browser === 'chrome') {
    manifest.manifest_version = 3
    manifest.action = {
      "default_icon": "popup/icon128.png",
      "default_popup": "popup/popup.html",
      "default_title": "RedditNav"
    }
    manifest.host_permissions = Object.values(SITES)
    manifest.web_accessible_resources = [{
      "resources": ["navbutton.html"],
      "matches": Object.values(SITE_MATCHES)
    }]
  }

  if (browser === 'firefox') {
    manifest.manifest_version = 2
    manifest.browser_action = {
      "default_icon": "popup/icon128.png",
      "default_popup": "popup/popup.html",
      "default_title": "RedditNav"
    }
    manifest.web_accessible_resources = ["navbutton.html"]
    manifest.applications = { 'gecko': { 'id': 'redditnav@smjc' } }
  }

  const mfst = Object.entries(SITES).reduce((a, [k, v]) => {
    a.content_scripts.push({
      "matches": [v],
      "css": ["navbutton.css"],
      "js": [ "util.js", "scroller.js", `sites/${k}.js`]
    })
    return a
  }, manifest)

  const manifestPath = path.join(__dirname, '..', 'lib', browser)
  fs.mkdirSync(manifestPath, { recursive: true })

  fs.writeFile(
    path.join(manifestPath, 'manifest.json'),
    JSON.stringify(mfst, null, 2), // Pretty print JSON
    err => err ? console.log(err) : null
  )
})
