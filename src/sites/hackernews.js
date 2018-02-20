const hackerNav = {
  comments() {
    return Array.from(
      document.getElementsByClassName(`athing comtr`)
    ).filter(
      comment => comment.querySelector(`img[width='0']`) ? true : false
    )
  }
}
scroller.init(hackerNav.comments)
