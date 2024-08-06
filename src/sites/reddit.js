const redditNav = {
  comments() {
    const hostName = window.location.hostname;
    const oldQuery = '.sitetable.nestedlisting > .comment:not(.deleted)';
    const newQuery = 'shreddit-comment-tree > shreddit-comment > [slot="commentAvatar"]';

    return Array.from(
      document.querySelectorAll(hostName.startsWith('old') ? oldQuery : newQuery)
    )
  }
}
scroller.init(redditNav.comments)

