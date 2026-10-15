// 페이지 이동, 메뉴 등

document.addEventListener("DOMContentLoaded", () => {

  const menuToggle =
    document.querySelector(".menu-toggle");

  const siteNav =
    document.querySelector(".site-nav");

  // 모바일 메뉴 열기 / 닫기
  if (menuToggle && siteNav) {

    menuToggle.addEventListener("click", () => {

      const isOpen =
        siteNav.classList.toggle("is-open");

      menuToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
      );

      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "메뉴 닫기" : "메뉴 열기"
      );

      menuToggle.textContent =
        isOpen ? "✕" : "☰";

    });

  }

  // 현재 페이지 메뉴 활성화
  const currentPage =
    window.location.pathname.split("/").pop()
    || "index.html";

  document.querySelectorAll(".site-nav a")
    .forEach(link => {

      const linkPage =
        new URL(link.href).pathname.split("/").pop();

      const active =
        linkPage === currentPage ||
        (
          currentPage.startsWith("project-") &&
          linkPage === "projects.html"
        );

      if (active) {
        link.classList.add("is-active");
        link.setAttribute("aria-current", "page");
      }

    });

  // 프로젝트 필터
  const projectTabs =
    document.querySelectorAll(".project-tab");

  const projects =
    document.querySelectorAll(
      ".project[data-category]"
    );

  const counts = {
    all: projects.length,
    team: [...projects].filter(
      p => p.dataset.category === "team"
    ).length,
    personal: [...projects].filter(
      p => p.dataset.category === "personal"
    ).length
  };

  const countIds = {
    all: "allCount",
    team: "teamCount",
    personal: "personalCount"
  };

  Object.entries(countIds).forEach(([key, id]) => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = counts[key];
    }
  });

  projectTabs.forEach(tab => {

    tab.addEventListener("click", () => {

      const filter = tab.dataset.filter;

      projectTabs.forEach(item => {
        const active = item === tab;

        item.classList.toggle("is-active", active);
        item.setAttribute(
          "aria-pressed",
          String(active)
        );
      });

      projects.forEach(project => {
        project.hidden =
          filter !== "all" &&
          project.dataset.category !== filter;
      });

    });

  });

});
