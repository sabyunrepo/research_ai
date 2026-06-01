(() => {
  const gallery = document.querySelector("#template-gallery");
  if (!gallery) return;

  const fallbackTemplates = [
    {
      id: "opening-hero",
      title: "Opening Hero",
      use: "Act opening",
      rule: "큰 손글씨 문장 + 작은 낙서 하나",
      motion: "문장만 먼저 들어오고 낙서는 200ms 뒤에 뜬다.",
      eyebrow: "Act 1",
      headline: "김아이는 일을 시작하기 전에 책상부터 정리한다.",
      message: "오늘의 핵심 행동을 한 문장으로 잡는다.",
      visualComponent: "workbench",
      sourceComponent: "workbench-visual",
      sourceDom: "lecture-cuts/00-1-workbench-preview.html",
      motionCue: "reveal-anchor",
    },
    {
      id: "single-concept",
      title: "Single Concept",
      use: "new idea",
      rule: "정의 한 문장 + 비유 그림",
      motion: "비유 그림은 설명 순서가 필요할 때만 나타난다.",
      eyebrow: "Concept",
      headline: "Context는 자료 더미가 아니라 일할 수 있는 책상이다.",
      message: "용어보다 먼저 눈에 보이는 비유를 둔다.",
      visualComponent: "harness",
      sourceComponent: "harness-visual",
      sourceDom: "lecture-cuts/01-why-harness.html",
      motionCue: "connect-context",
    },
    {
      id: "assertion-scene",
      title: "Assertion Scene",
      use: "claim with evidence",
      rule: "주장 문장 + 한 장면",
      motion: "주장 뒤에 근거 장면만 짧게 올라온다.",
      eyebrow: "Claim",
      headline: "좋은 지시는 길지 않고 빠진 조건이 없다.",
      message: "bullet 대신 결론과 실패 장면을 나란히 둔다.",
      visualComponent: "evidence",
      sourceComponent: "practice-gate-visual",
      sourceDom: "lecture-cuts practice gate family",
      motionCue: "evidence-check",
    },
    {
      id: "kimai-structure",
      title: "Kimai Image Structure",
      use: "Kimai generated image",
      rule: "기존 김아이 장면 이미지를 큰 구조도로 둔다.",
      motion: "이미지 프레임만 짧게 올라오고 설명 텍스트는 고정한다.",
      eyebrow: "Scene",
      headline: "김아이 장면은 설명 구조를 담은 큰 그림으로 쓴다.",
      message: "이미지가 있을 때도 템플릿 프레임과 여백 규칙을 공통으로 적용한다.",
      visualComponent: "kimai-structure",
      sourceComponent: "kimai-image-structure",
      sourceDom: "generated-decks/kimai-workshop-content/assets/visuals/act0-kimai-capable-kimai-new-employee.png",
      motionCue: "image-frame",
    },
    {
      id: "term-bridge",
      title: "Term Bridge",
      use: "first glossary use",
      rule: "회사말 먼저, 실제 용어는 보조 라벨",
      motion: "회사말에서 실제 용어로 시선이 이동한다.",
      eyebrow: "Glossary",
      headline: "업무 매뉴얼은 Codex에게 Skill처럼 작동한다.",
      message: "낯선 용어는 익숙한 말에 붙여서 소개한다.",
      visualComponent: "bridge",
      sourceComponent: "handoff-bridge-visual",
      sourceDom: "lecture-cuts handoff bridge family",
      motionCue: "term-bridge",
    },
    {
      id: "three-step-flow",
      title: "Workflow Strip",
      use: "workflow map",
      rule: "목표부터 기록까지 검증 가능한 경로만 둔다.",
      motion: "실제 순서가 있을 때만 선과 단계가 차례로 들어온다.",
      eyebrow: "Flow",
      headline: "목표에서 기록까지 한 줄로 보여야 일이 끝난다.",
      message: "흐름은 발표자가 짚을 순서만 남긴다.",
      visualComponent: "flow",
      sourceComponent: "guardrail-flow-visual",
      sourceDom: "lecture-cuts/21-final-workflow.html",
      motionCue: "step-flow",
    },
    {
      id: "decision-gate",
      title: "Decision Gate",
      use: "quality decision",
      rule: "검문소 질문 + 증거 기준 + PASS/HOLD 판정",
      motion: "판정선은 계속 살아 있고, HOLD에서 PASS로 시선이 이동한다.",
      eyebrow: "Gate",
      headline: "제출 전에는 주장보다 증거를 먼저 본다.",
      message: "PASS를 말하기 전에 확인할 기준을 드러낸다.",
      visualComponent: "gate",
      sourceComponent: "practice-gate-visual",
      sourceDom: "lecture-cuts practice gate family",
      motionCue: "gate-check",
    },
    {
      id: "brief-window",
      title: "Brief Window",
      use: "task brief",
      rule: "목표, 증상, 범위, 제한, 검증, 보고만 남긴다.",
      motion: "창은 고정하고 현재 확인할 줄만 짧게 강조한다.",
      eyebrow: "Brief",
      headline: "업무 지시는 파일처럼 열어 보고 확인한다.",
      message: "김아이가 추측하지 않도록 조건을 한 창에 정리한다.",
      visualComponent: "brief",
      sourceComponent: "brief-window-visual",
      sourceDom: "user reference image #2 / 디자인.md browser-window style",
      motionCue: "brief-scan",
    },
    {
      id: "practice-handoff",
      title: "Practice Handoff",
      use: "practice transition",
      rule: "기존 김아이 기준 이미지 + 행동 카드",
      motion: "김아이는 고정하고 실습 행동 카드만 차례로 들어온다.",
      eyebrow: "Practice",
      headline: "이제 김아이에게 줄 업무 지시서를 직접 고친다.",
      message: "실습 UI는 덱 안에 섞지 않고 별도 화면으로 넘긴다.",
      visualComponent: "handoff",
      sourceComponent: "handoff-checklist-visual",
      sourceDom: "lecture-cuts handoff checklist family",
      motionCue: "handoff-list",
    },
    {
      id: "recap-map",
      title: "Recap Map",
      use: "wrap-up",
      rule: "배운 조각을 업무 루틴으로 다시 묶기",
      motion: "마지막 지도만 짧게 정착한다.",
      eyebrow: "Wrap",
      headline: "내 하네스는 목표, 재료, 검증 기준을 남기는 습관이다.",
      message: "다음 업무에 붙일 위치를 마지막에 보여 준다.",
      visualComponent: "loop",
      sourceComponent: "loop-visual",
      sourceDom: "lecture-cuts workflow loop family",
      motionCue: "loop-map",
    },
  ];

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function visualComponent(name, sourceComponent, motionCue) {
    const sourceAttr = escapeHtml(sourceComponent);
    if (name === "workbench") {
      return `<div class="lc-visual lc-workbench-visual" data-visual-component="workbench" data-source-component="${sourceAttr}" data-motion-cue="${escapeHtml(motionCue)}" aria-hidden="true">
        <div class="lc-workbench-core">김</div>
        <span class="lc-workbench-card memory">내규<small>CLAUDE.md</small></span>
        <span class="lc-workbench-card skill">자료<small>context</small></span>
        <span class="lc-workbench-card agent">매뉴얼<small>skill</small></span>
        <span class="lc-workbench-card tool">도구<small>tool</small></span>
        <span class="lc-workbench-card hook">검문소<small>hook</small></span>
        <span class="lc-workbench-card eval">증거<small>eval</small></span>
      </div>`;
    }
    if (name === "harness") {
      return `<div class="lc-visual lc-harness-visual" data-visual-component="harness" data-source-component="${sourceAttr}" data-motion-cue="${escapeHtml(motionCue)}" aria-hidden="true">
        <div class="lc-harness-center">책상</div>
        <span class="lc-harness-rail context">자료</span>
        <span class="lc-harness-rail rule">규칙</span>
        <span class="lc-harness-rail example">예시</span>
        <span class="lc-harness-rail verify">검증</span>
      </div>`;
    }
    if (name === "evidence") {
      return `<div class="lc-visual lc-claim-evidence-visual" data-visual-component="evidence" data-source-component="${sourceAttr}" data-motion-cue="${escapeHtml(motionCue)}" aria-hidden="true">
        <div class="lc-evidence-sheet">
          <strong>요청서</strong>
          <span class="filled"></span>
          <span class="missing"></span>
          <span class="filled short"></span>
        </div>
        <div class="lc-evidence-tags">
          <div class="lc-evidence-gap">빠진 조건</div>
          <div class="lc-evidence-check">근거 확인</div>
          <div class="lc-evidence-verdict">보완 제출</div>
        </div>
      </div>`;
    }
    if (name === "kimai-structure") {
      return `<div class="lc-visual lc-kimai-structure-visual" data-visual-component="kimai-structure" data-source-component="${sourceAttr}" data-motion-cue="${escapeHtml(motionCue)}">
        <figure class="lc-kimai-image-frame">
          <img src="assets/visuals/act0-kimai-capable-kimai-new-employee.png" alt="김아이 기존 장면 이미지 템플릿 예시">
        </figure>
      </div>`;
    }
    if (name === "bridge") {
      return `<div class="lc-visual lc-handoff-bridge-visual" data-visual-component="bridge" data-source-component="${sourceAttr}" data-motion-cue="${escapeHtml(motionCue)}" aria-hidden="true">
        <section><strong>업무 말</strong><span>업무 매뉴얼</span><span>절차</span><em>익숙한 말</em></section>
        <div class="lc-bridge-file"><span>Skill</span></div>
        <section><strong>AI 말</strong><span>Skill</span><span>재사용 절차</span><em>실제 용어</em></section>
      </div>`;
    }
    if (name === "flow") {
      return `<div class="lc-visual lc-guardrail-flow-visual" data-visual-component="flow" data-source-component="${sourceAttr}" data-motion-cue="${escapeHtml(motionCue)}" aria-hidden="true">
        <span><b>01</b>목표</span>
        <span><b>02</b>자료</span>
        <span><b>03</b>지시</span>
        <span><b>04</b>실행</span>
        <span><b>05</b>검증</span>
        <span><b>06</b>기록</span>
        <i class="lc-flow-line"></i>
      </div>`;
    }
    if (name === "gate") {
      return `<div class="lc-visual lc-decision-gate-visual" data-visual-component="gate" data-source-component="${sourceAttr}" data-motion-cue="${escapeHtml(motionCue)}" aria-hidden="true">
        <div class="lc-gate-board">
          <strong>제출?</strong>
          <span class="gate-line"></span>
          <em>증거 확인 후 판정</em>
        </div>
        <span class="lc-gate-card goal">목표<br><small>맞음</small></span>
        <span class="lc-gate-card evidence">근거<br><small>있음</small></span>
        <span class="lc-gate-card retry">재검토<br><small>필요</small></span>
        <div class="lc-gate-verdict"><b>HOLD</b><b>PASS</b></div>
      </div>`;
    }
    if (name === "brief") {
      const rows = [
        ["목표", "결제 실패 원인 수정"],
        ["증상", "쿠폰 적용 뒤 500 오류"],
        ["범위", "checkout/, payments/"],
        ["제한", "DB schema 변경 금지"],
        ["검증", "pnpm test checkout"],
        ["보고", "파일, 명령, 결과, 위험"],
      ];
      return `<div class="lc-visual lc-brief-window-visual" data-visual-component="brief" data-source-component="${sourceAttr}" data-motion-cue="${escapeHtml(motionCue)}" aria-hidden="true">
        <div class="lc-brief-window">
          <div class="lc-window-dots"><i></i><i></i><i></i></div>
          ${rows.map(([label, value]) => `<p><strong>${escapeHtml(label)}:</strong> <span>${escapeHtml(value)}</span></p>`).join("")}
        </div>
      </div>`;
    }
    if (name === "handoff") {
      return `<div class="lc-visual lc-practice-handoff-composite" data-visual-component="handoff" data-source-component="${sourceAttr}" data-motion-cue="${escapeHtml(motionCue)}" aria-hidden="true">
        <div class="lc-practice-kimai-ref"></div>
        <div class="lc-practice-handoff-steps">
          <span><b>01</b>업무 지시서 열기</span>
          <span><b>02</b>빠진 조건 고치기</span>
          <span><b>03</b>검증 로그 확인</span>
        </div>
      </div>`;
    }
    return `<div class="lc-visual lc-loop-visual" data-visual-component="loop" data-source-component="${sourceAttr}" data-motion-cue="${escapeHtml(motionCue)}" aria-hidden="true">
      <div class="lc-loop-ring">
        <i class="lc-loop-path"></i>
        <i class="lc-loop-runner"></i>
        <span class="write">목표</span>
        <span class="run">실행</span>
        <span class="check">검증</span>
        <span class="keep">기록</span>
        <strong>루틴</strong>
      </div>
    </div>`;
  }

  function renderTemplate(template) {
    return `<article class="candidate-card" data-template="${escapeHtml(template.id)}" data-motion-cue="${escapeHtml(template.motionCue)}">
      <section class="candidate-preview" aria-label="${escapeHtml(template.title)} template preview">
        <div class="candidate-slide candidate-slide--${escapeHtml(template.id)}">
          <p class="candidate-eyebrow">${escapeHtml(template.eyebrow)}</p>
          <h3>${escapeHtml(template.headline)}</h3>
          <p>${escapeHtml(template.message)}</p>
          ${visualComponent(template.visualComponent, template.sourceComponent, template.motionCue)}
        </div>
      </section>
      <section class="candidate-info">
        <p class="template-kicker">${escapeHtml(template.id)}</p>
        <h2>${escapeHtml(template.title)}</h2>
        <dl class="template-meta">
          <div><dt>Use</dt><dd>${escapeHtml(template.use)}</dd></div>
          <div><dt>Rule</dt><dd>${escapeHtml(template.rule)}</dd></div>
          <div><dt>Motion</dt><dd>${escapeHtml(template.motion)}</dd></div>
          <div><dt>Source</dt><dd>${escapeHtml(template.sourceDom)}</dd></div>
        </dl>
      </section>
    </article>`;
  }

  async function loadTemplates() {
    try {
      const response = await fetch("assets/template-component-registry.json", { cache: "no-store" });
      if (!response.ok) throw new Error(`registry HTTP ${response.status}`);
      const registry = await response.json();
      return Array.isArray(registry.templates) ? registry.templates : fallbackTemplates;
    } catch (_error) {
      return fallbackTemplates;
    }
  }

  function bindMotionReplay() {
    const cards = [...gallery.querySelectorAll(".candidate-card")];
    cards.forEach((card) => card.classList.add("is-visible"));

    const reveal = (card) => {
      card.classList.remove("is-visible");
      window.requestAnimationFrame(() => card.classList.add("is-visible"));
    };

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) reveal(entry.target);
        });
      }, { threshold: 0.35 });
      cards.forEach((card) => observer.observe(card));
    } else {
      cards.forEach(reveal);
    }

    cards.forEach((card) => {
      card.addEventListener("pointerenter", () => reveal(card));
      card.addEventListener("focusin", () => reveal(card));
    });
  }

  loadTemplates().then((templates) => {
    gallery.innerHTML = templates.map(renderTemplate).join("");
    bindMotionReplay();
  });
})();
