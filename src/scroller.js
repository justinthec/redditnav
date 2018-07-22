const scroller = {
  // Scrolling state used to debounce `animateScroll`
  scrolling: false,

  // Easing function for scroll animation, from http://gizma.com/easing/#quad3
  easeInOutQuad(progress, pos, dist, duration) {
    progress /= duration/2
    if (progress < 1)
      return progress * progress * (dist/2) + pos
    progress -= 1
    return (progress * (progress - 2) - 1) * (-dist / 2) + pos
  },

  // Performs the actual scroll to the next top-level comment
  animateScroll(targetPos) {
    const duration = speeds.BASE_DURATION * this.scrollSpeed
    if (this.scrolling || !targetPos)
      return

    // Get start time and initial position
    const ts = performance.now()
    const scrollY = window.scrollY

    const step = start => current => {
      const progress = current - start
      const stepDistance = this.easeInOutQuad(
        progress,
        scrollY,
        targetPos - scrollY,
        duration
      )

      window.scroll(0, stepDistance)
      if (progress < duration)
        window.requestAnimationFrame(step(start))
      else {
        window.scroll(0, targetPos)
        this.scrolling = false
      }
    }

    this.scrolling = true
    step(ts)(ts)
  },

  // Get the user's current (vertical) scroll position
  getCurrentPos(direction) {
    return direction === directions.DOWN ?
      Math.ceil(window.scrollY) :
      Math.floor(window.scrollY)
  },

  getCommentPos(comment, direction) {
    const commentTop = comment.getBoundingClientRect().top + window.scrollY

    // Rounds in the opposite direction of `getCurrentPos`
    // so that we don't get stuck due to subpixel memes
    return direction === directions.DOWN ?
      Math.floor(commentTop) :
      Math.ceil(commentTop)
  },

  // Returns the next parent comment in `direction`,
  // or null if there isn't a valid comment to scroll to.
  getNextParent(direction) {
    let belowLast = false
    const currentPos = this.getCurrentPos(direction)
    const comments =
      this.getComments().map(c => this.getCommentPos(c, direction))


    const targetIndex = comments.findIndex((commentPos, idx) => {
      if (idx === comments.length - 1)
        belowLast = currentPos > commentPos && direction === directions.UP

      return currentPos < commentPos ||
            (direction === directions.UP && currentPos === commentPos) ||
             belowLast
    })

    if (targetIndex >= 0)
      return direction === directions.UP && !belowLast ?
        comments[targetIndex - 1] :
        comments[targetIndex]
    else
      return null
  },

  goToNextParent(direction) {
    const nextParent = this.getNextParent(direction)

    nextParent ?
      this.animateScroll(nextParent) :
      null
  },

  async init(comments) {
    this.getComments = comments
    const config = await _storageGet({
      color: navButton.COLOR,
      buttonPos: navButton.POSN.RIGHT,
      scrollSpeed: speeds.MULTIPLIER.MEDIUM,
      scrollDown: scrollKey.DOWN,
      scrollUp: scrollKey.UP
    })

    this.setScrollSpeed(config)
    this.setKeybindings(config)

    // No need to continue if there's no button to add
    if (config.buttonPos === navButton.POSN.HIDDEN)
      return

    const buttonTemplate = await (
      await fetch(_extensionGetUrl('navbutton.html'))
    ).text()

    this.button = (new DOMParser())
      .parseFromString(buttonTemplate, "text/html")
      .getElementById('redditNavContainer')

    this.setButtonColor(config)
    this.setButtonPosition(config)
    document.body.appendChild(this.button)

    document.getElementById('redditNavUp')
      .addEventListener('click', () => this.goToNextParent(directions.UP))
    document.getElementById('redditNavDown')
      .addEventListener('click', () => this.goToNextParent(directions.DOWN))
  },

  setKeybindings(conf) {
    document.removeEventListener('keypress', this.onNextParent)
    for (const [k, v] of Object.entries(conf)) {
      if (k === 'scrollUp' || k === 'scrollDown')
        this[k] = v
    }
    this.onNextParent = event => {
      // Check if we're in a textarea
      if (event.target.value != null)
        return

      if (event.key === this.scrollUp)
        this.goToNextParent(directions.UP)
      else if (event.key === this.scrollDown)
        this.goToNextParent(directions.DOWN)
    }
    document.addEventListener('keypress', this.onNextParent)
  },

  setButtonColor(conf) {
    Array.from(this.button.getElementsByTagName('a'))
      .forEach(element => element.style.backgroundColor = conf.color)
    Array.from(this.button.getElementsByTagName('path'))
      .forEach(element => element.style.color = conf.color)
  },

  setButtonPosition(conf) {
    resetClassList(this.button.classList)
    switch (conf.buttonPos) {
      case navButton.POSN.RIGHT:
        this.button.classList.add('right')
        break
      case navButton.POSN.LEFT:
        this.button.classList.add('left')
        break
      default:
        this.button.classList.add('hide')
    }
  },

  setScrollSpeed(conf) {
    this.scrollSpeed = conf.scrollSpeed
  }
}

_onRuntimeMessage(req => {
  switch (req.message) {
    case messages.BUTTONPOS:
      scroller.setButtonPosition(req.changed)
      break
    case messages.COLOR:
      scroller.setButtonColor(req.changed)
      break
    case messages.SCROLLDOWN:
    case messages.SCROLLUP:
      scroller.setKeybindings(req.changed)
      break
    case messages.SCROLLSPEED:
      scroller.setScrollSpeed(req.changed)
      break
    default:
      return _storageGet()
  }
})
