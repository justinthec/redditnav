const redditNav = {
  comments() {
    return Array.from(
      document.querySelectorAll(
        `.sitetable.nestedlisting > .comment:not(.deleted)`
      )
    )
  }
}
scroller.init(redditNav.comments)

