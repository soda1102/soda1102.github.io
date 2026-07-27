// 섹션 스크롤에 따라 좌측(모바일: 상단) 내비게이션 활성 상태 갱신
const sections = document.querySelectorAll('.section');
const explorerLinks = document.querySelectorAll('.explorer-link');
const mobileLinks = document.querySelectorAll('.mobile-nav a');
const explorerHighlight = document.getElementById('explorerHighlight');

const moveHighlight = (link) => {
  if (!link || !explorerHighlight) return;
  explorerHighlight.style.transform = `translateY(${link.offsetTop}px)`;
  explorerHighlight.style.height = `${link.offsetHeight}px`;
};

const setActive = (id) => {
  explorerLinks.forEach(link => {
    const active = link.dataset.target === id;
    link.classList.toggle('is-active', active);
    if (active) moveHighlight(link);
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

// 초기 하이라이트 위치 세팅 (폰트 로딩 이후 높이가 바뀔 수 있어 살짝 지연)
window.addEventListener('load', () => {
  const active = document.querySelector('.explorer-link.is-active');
  moveHighlight(active);
});
window.addEventListener('resize', () => {
  const active = document.querySelector('.explorer-link.is-active');
  moveHighlight(active);
});

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
