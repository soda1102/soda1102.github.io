// 페이지 이동, 메뉴 등

// ======================================
// PORTFOLIO NAVIGATION
// 메뉴 / 프로젝트 필터 / 카드 확장
// ======================================

document.addEventListener("DOMContentLoaded", () => {

  // ==================================
  // 1. 모바일 메뉴
  // ==================================

  const menuToggle =
    document.querySelector(".menu-toggle");

  const siteNav =
    document.querySelector(".site-nav");

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

  // ==================================
  // 2. 현재 페이지 메뉴 활성화
  // ==================================

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

  // ==================================
  // 3. 프로젝트 요소
  // ==================================

  const grid =
    document.getElementById("portfolioGrid");

  if (!grid) return;

  const cards = [...grid.querySelectorAll(
    ".portfolio-card[data-category]"
  )];

  const tabs = [...document.querySelectorAll(
    ".project-tab[data-filter]"
  )];

  // 프로젝트의 원래 순서 기억
  const originalOrder = [...cards];

  // 현재 선택된 프로젝트
  let selectedCard = null;

  // 현재 필터
  let currentFilter =
    document.querySelector(
      ".project-tab.is-active"
    )?.dataset.filter || "team";

  // ==================================
  // 4. 프로젝트 개수 표시
  // ==================================

  const counts = {
    all: cards.length,
    team: cards.filter(
      card => card.dataset.category === "team"
    ).length,
    personal: cards.filter(
      card => card.dataset.category === "personal"
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

  // ==================================
  // 5. 선택된 카드 닫기
  // ==================================

  function closeCard(card) {

    if (!card) return;

    const openButton =
      card.querySelector(".project-open");

    const detail =
      card.querySelector(".project-detail");

    card.classList.remove("is-expanded");

    if (detail) {
      detail.hidden = true;
    }

    if (openButton) {
      openButton.setAttribute(
        "aria-expanded",
        "false"
      );
    }

    if (selectedCard === card) {
      selectedCard = null;
    }
  }

  // ==================================
  // 6. 카드 순서 복구
  // ==================================

  function restoreOrder() {
    originalOrder.forEach(card => {
      grid.appendChild(card);
    });
  }

  // ==================================
  // 7. 카드 펼치기
  // ==================================

  function openCard(card) {

    // 이미 펼쳐진 카드면 닫기
    if (selectedCard === card) {
      closeCard(card);
      restoreOrder();
      return;
    }

    // 다른 프로젝트가 펼쳐져 있다면 닫기
    if (selectedCard) {
      closeCard(selectedCard);
    }

    // 원래 카드 순서 복구
    restoreOrder();

    // 선택한 프로젝트를 맨 앞으로 이동
    grid.prepend(card);

    // 카드 확장
    card.classList.add("is-expanded");

    const detail =
      card.querySelector(".project-detail");

    const openButton =
      card.querySelector(".project-open");

    if (detail) {
      detail.hidden = false;
    }

    if (openButton) {
      openButton.setAttribute(
        "aria-expanded",
        "true"
      );
    }

    selectedCard = card;

    // 펼친 카드를 보기 좋게 스크롤
    requestAnimationFrame(() => {
      const top =
        card.getBoundingClientRect().top +
        window.scrollY - 25;

      window.scrollTo({
        top,
        behavior: window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches ? "instant" : "smooth"
      });
    });
  }

  // ==================================
  // 8. 카드 버튼 이벤트
  // ==================================

  cards.forEach(card => {

    const openButton =
      card.querySelector(".project-open");

    const closeButton =
      card.querySelector(".project-close");

    if (openButton) {
      openButton.addEventListener("click", () => {
        openCard(card);
      });
    }

    if (closeButton) {
      closeButton.addEventListener("click", () => {
        closeCard(card);
        restoreOrder();

        const button =
          card.querySelector(".project-open");

        if (button) button.focus();
      });
    }
  });

  // ==================================
  // 9. 팀 / 개인 프로젝트 필터
  // ==================================

  function applyFilter(filter) {

    currentFilter = filter;

    // 펼쳐진 프로젝트 닫기
    if (selectedCard) {
      closeCard(selectedCard);
    }

    restoreOrder();

    tabs.forEach(tab => {

      const active =
        tab.dataset.filter === filter;

      tab.classList.toggle(
        "is-active",
        active
      );

      tab.setAttribute(
        "aria-pressed",
        String(active)
      );
    });

    cards.forEach(card => {
      const category = card.dataset.category;

      card.hidden =
        filter !== "all" &&
        category !== filter;
    });
  }

  tabs.forEach(tab => {

    tab.addEventListener("click", () => {
      applyFilter(tab.dataset.filter);
    });
  });

  // 페이지 최초 진입 시 필터 적용
  applyFilter(currentFilter);

});
