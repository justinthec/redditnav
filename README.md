![image](http://i.imgur.com/VnfEuzT.png?2) [![image](https://developer.chrome.com/webstore/images/ChromeWebStore_BadgeWBorder_v2_206x58.png)](https://chrome.google.com/webstore/detail/reddit-nav/dpkijnoebmekoiafbkledpjhkpgllkfe) [![image](./ff_icon.png)](#)
---------

RedditNav is an improvement to the way you browse comments on Reddit and Reddit-like sites such as HackerNews, enabling you to more efficiently waste time like never before.
Getting tired of a comment chain? Just hit the colorful floating button or your preferred hotkey, and RedditNav will take you to the next top-level comment.

![gif](https://giant.gfycat.com/WarmheartedFastAgouti.gif)
##### [Demo Video](http://www.youtube.com/watch?v=42zCcd-rNzo)

# Features

- Don't like Q and W as the default keybindings? Feel free to change them to whatever you like!
- Set your preferred button position and color, or just hide the button altogether
- Choose between various scroll speeds, including instant
- Extensible design; adding support for new Reddit-like sites is quick and easy. Got a site you'd like to see supported? Just submit a feature request!

#### [Get RedditNav for Chrome](https://chrome.google.com/webstore/detail/reddit-nav/dpkijnoebmekoiafbkledpjhkpgllkfe)
#### [Get RedditNav for Firefox](#)

# Contributing

1. Clone the repo with `git clone https://github.com/justinthec/redditnav && cd redditnav`
2. Start a new branch for your changes with `git checkout -b <branch-name>`
3. `npm install`
4. Make changes in `src/`
5. When you want to test your chages, do `npm run build`.
    * When testing Chrome, navigate to `chrome://extensions/`, check "Developer Mode" and load `lib/chrome` as an unpacked extension.
    * When testing Firefox, simply `npm run dev:ff`. Note that you may need to provide a target (e.g `yarn run dev:ff -f nightly` for Firefox Nightly) if you don't use the stable version of Firefox. Valid targets are `firefox (default), beta, nightly, firefoxdeveloperedition`.
6. When you feel that you're finished, just bump the `VERSION` in `scripts/mkManifests.js` according to [semver](https://semver.org/)
7. Push your local branch with `git push -u origin <branch-name>` and submit a pull request.
