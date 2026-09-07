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

// 테마 색상 / 다크모드 스위처
const root = document.documentElement;
const THEME_KEY = 'portfolio-theme';
const MODE_KEY = 'portfolio-mode';
const themeDots = document.querySelectorAll('.theme-dot');
const modeToggles = document.querySelectorAll('.mode-toggle');

const applyTheme = (theme) => {
  root.setAttribute('data-theme', theme);
  try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
  themeDots.forEach(dot => dot.classList.toggle('is-active', dot.dataset.theme === theme));
};

const applyMode = (mode) => {
  root.setAttribute('data-mode', mode);
  try { localStorage.setItem(MODE_KEY, mode); } catch (e) {}
};

const savedTheme = (() => { try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; } })() || 'periwinkle';
const savedMode = (() => { try { return localStorage.getItem(MODE_KEY); } catch (e) { return null; } })() || 'light';
applyTheme(savedTheme);
applyMode(savedMode);

themeDots.forEach(dot => {
  dot.addEventListener('click', () => applyTheme(dot.dataset.theme));
});

modeToggles.forEach(toggle => {
  toggle.addEventListener('click', () => {
    const next = root.getAttribute('data-mode') === 'dark' ? 'light' : 'dark';
    applyMode(next);
  });
});

// 스크롤 등장 애니메이션 — 카드/블록들이 화면에 들어올 때 살짝 떠오르며 나타남
const revealTargets = document.querySelectorAll(
  '.project, .about-side .side-card, .solve-card, .skill-group, .built-block, .arch-block'
);
revealTargets.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
);
revealTargets.forEach(el => revealObserver.observe(el));

// 히어로 코드카드 — 마우스 움직임에 따라 은은하게 기울어지는 틸트 효과
const codeCard = document.querySelector('.code-card');
if (codeCard && window.matchMedia('(hover: hover)').matches) {
  const heroVisual = document.querySelector('.hero-visual');
  heroVisual.addEventListener('mousemove', (e) => {
    const rect = heroVisual.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    codeCard.style.transform = `rotate(2deg) rotateX(${y * -6}deg) rotateY(${x * 8}deg)`;
  });
  heroVisual.addEventListener('mouseleave', () => {
    codeCard.style.transform = 'rotate(2deg)';
  });
}
