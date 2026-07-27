// 섹션 스크롤에 따라 좌측(모바일: 상단) 내비게이션 활성 상태 갱신
const sections = document.querySelectorAll('.section');
const explorerLinks = document.querySelectorAll('.explorer-link');
const mobileLinks = document.querySelectorAll('.mobile-nav a');

const setActive = (id) => {
  explorerLinks.forEach(link => {
    link.classList.toggle('is-active', link.dataset.target === id);
  });
  mobileLinks.forEach(link => {
    link.classList.toggle('is-active', link.dataset.target === id);
  });
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setActive(entry.target.id);
      }
    });
  },
  { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
);

sections.forEach(section => observer.observe(section));

// 스크롤 유도 버튼
document.querySelectorAll('[data-target]').forEach(el => {
  el.addEventListener('click', (e) => {
    const target = document.getElementById(el.dataset.target);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
