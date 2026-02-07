/**
 * Highlights the current page link in the sidebar and footer.
 */
document.addEventListener("DOMContentLoaded", () => {
  const current = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  const links = document.querySelectorAll(".sidebar .nav-link, .sidebar-footer-links a");

  links.forEach((link) => {
    const href = (link.getAttribute("href") || "").split("#")[0].split("?")[0].toLowerCase();
    if (href && href === current) {
      link.classList.add("is-active");
    }
  });
});
