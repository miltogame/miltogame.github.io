
const $ = (sel) => document.querySelector(sel);

function detectBasePath() {
  try {
    const scripts = document.getElementsByTagName('script');
    const thisScript = scripts[scripts.length - 1];
    const url = new URL(thisScript.src);
    const p = url.pathname;
    const base = p.replace(/\/script\.js$/i, '');
    return base === '' ? '' : base;
  } catch { return ''; }
}
const BASE = detectBasePath();

function stripBase(pathname) {
  if (!BASE) return pathname;
  return pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname;
}

function slugify(s) {
  return s.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\uAC00-\uD7A3\w\-]/g, '');
}

function b64d(s) { return decodeURIComponent(escape(atob(s))); }

const LEVELS = [
  {
    slug: "start",
    title: "시작",
    riddle: `
      <p><strong>환영합니다</strong><br>
      먼저 자격 확인을 위해 간단한 질문을 드릴게요.</p>
      <p><strong>당신은 어디서 오셨나요?</strong></p>
    `,
    answer_b64: "bWlsdG9waWE=", // miltopia
    next: "miltopia",
  },
  {
    slug: "miltopia",
    title: "인증",
    riddle: `
      <p>인증되었습니다.</p>
      <p>이곳에서는 필수로 해야하는 것이 있어요.<br>
      안 해도 입장은 가능하지만 금방 쫓겨나지 않을까요?😮</p>
      <p class="hint">힌트 <span class="code">/1</span></p>
    `,
    answer_b64: "V1R2QQ==", // WTvA
    next: "WTvA",
  },
  {
    slug: "WTvA",
    title: "규칙",
    riddle: `
      <p>멋져요. 카페 규칙을 전부 숙지하셨군요!?<br>
      이제 이곳에서 놀 준비가 끝났어요</p>
      <p>아시겠지만 여기엔 친구들이 정말 많아요.</p>
    `,
    answer_b64: "NzAwMA==", // 7000
    next: "7000",
  },
  {
    slug: "7000",
    title: "준비물",
    riddle: `
      <p>하지만 친구들과 정식으로 놀기 위해선 이것이 필요해요</p>
      <p class="hint">hint <span class="code">+</span></p>
    `,
    answer_b64: "MTAxOQ==", // 1019
    next: "1019",
  },
  {
    slug: "1019",
    title: "목적",
    riddle: `
      <p>잠깐! 즐기기 전에 우리는 무엇을 위해 이곳에 모였나요?</p>
    `,
    answer_b64: "bWlseXRvcnk=", // milytory
    next: "milytory",
  },
  {
    slug: "milytory",
    title: "무대",
    riddle: `
      <p>좋아요 이제 여긴 모두 우리의 무대에요</p>
      <p class="hint">hint (가로줄 3개)</p>
    `,
    answer_b64: "MjI=", // 22
    next: "22",
  },
  {
    slug: "22",
    title: "엔딩",
    riddle: `
      <p>오래오래 같이 놀아요~</p>
      <p><strong>끝 🎉</strong></p>
    `,
  },
];

const LEVEL_MAP = Object.fromEntries(LEVELS.map(l => [l.slug, l]));

function pathFor(slug) {
  const clean = slug ? (slug.startsWith('/') ? slug : '/' + slug) : '/';
  return (BASE || '') + clean;
}

function goTo(slug) {
  history.pushState({}, '', pathFor(slug));
  render();
}

function findLevelByPath(pathname) {
  const rawPath = stripBase(decodeURIComponent(pathname));
  const slug = rawPath.replace(/^\/+/, '') || 'start'; // default to /start
  return LEVEL_MAP[slug] || LEVEL_MAP['start'];
}

function viewFor(level) {
  const formHtml = level.next
    ? `
      <form id="answer-form" autocomplete="off">
        <label for="answer">정답을 URL에 쓰듯 입력하고 Enter</label>
        <input id="answer" type="text" placeholder="예: 정답이면 /정답 으로 이동" required />
        <button type="submit">이동</button>
        <p class="hint">대소문자/공백 무시, 한글 가능</p>
      </form>`
    : `<p><a href="${pathFor('/start')}" onclick="event.preventDefault(); goTo('start');">다시 시작하기</a></p>`;

  return `
  <section class="card">
    <div class="badge">${level.title}</div>
    <h1>${level.slug === 'start' ? '미궁 시작' : level.title}</h1>
    ${level.riddle}
    ${formHtml}
  </section>`;
}

function render() {
  const level = findLevelByPath(location.pathname);
  $("#app").innerHTML = viewFor(level);

  const form = document.getElementById("answer-form");
  if (form && level.next) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = document.getElementById("answer").value;
      const normalizedInput = slugify(input);
      const correct = slugify(b64d(level.answer_b64));
      if (normalizedInput === correct) {
        goTo(level.next);
      } else {
        form.classList.remove('shake');
        void form.offsetWidth;
        form.classList.add('shake');
      }
    });
  }
}

window.addEventListener("popstate", render);
window.addEventListener("DOMContentLoaded", render);
