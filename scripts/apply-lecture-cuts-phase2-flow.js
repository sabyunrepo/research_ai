#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const deckRoot = path.join(root, "lecture-cuts");
const slidesPath = path.join(deckRoot, "assets", "slides.js");

function loadSlides() {
  const code = fs.readFileSync(slidesPath, "utf8");
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(code, context, { filename: "lecture-cuts/assets/slides.js" });
  return context.window.LECTURE_SLIDES;
}

function speaker(paragraphs) {
  return `<strong>상세 발표 스크립트</strong>${paragraphs.map((text) => `<p>${text}</p>`).join("")}`;
}

function replaceMain(file, nextMain) {
  const fullPath = path.join(deckRoot, file);
  const html = fs.readFileSync(fullPath, "utf8");
  const mainPattern = /<main\b[^>]*class=["'][^"']*\bslide\b[^"']*["'][^>]*>[\s\S]*<\/main>/i;
  if (!mainPattern.test(html)) throw new Error(`main.slide not found in ${file}`);
  const next = html.replace(mainPattern, nextMain);
  fs.writeFileSync(fullPath, next);
}

function replaceTitle(file, title) {
  const fullPath = path.join(deckRoot, file);
  const html = fs.readFileSync(fullPath, "utf8");
  fs.writeFileSync(fullPath, html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`));
}

function updateNav(file, previous, next) {
  const fullPath = path.join(deckRoot, file);
  const html = fs.readFileSync(fullPath, "utf8");
  const links = [];
  if (previous) links.push(`<a href="${previous}">Prev</a>`);
  links.push('<a href="index.html">Index</a>');
  links.push('<a href="deck.html">Deck</a>');
  links.push('<a href="presenter-review.html">Review</a>');
  if (next) links.push(`<a href="${next}">Next</a>`);
  const nav = `<nav class="nav">${links.join("")}</nav>`;
  fs.writeFileSync(fullPath, html.replace(/<nav\b[^>]*class=["'][^"']*\bnav\b[^"']*["'][^>]*>[\s\S]*?<\/nav>/i, nav));
}

function updateIndex(slides) {
  const indexPath = path.join(deckRoot, "index.html");
  let html = fs.readFileSync(indexPath, "utf8");
  html = html.replace(/<p class="meta-line">[\s\S]*?<\/p>/, `<p class="meta-line">${slides.length}장 · HTML/CSS 발표자료 하네스 실습 · 이어받기 체크포인트 포함</p>`);
  const cards = [
    ["00-title.html", "assets/handdrawn/01-harness.png", "00. 타이틀", "프롬프트 팁이 아니라 작업 환경 설계"],
    ["01-why-harness.html", "assets/handdrawn/01-harness.png", "01. 왜 하네스인가", "AI는 똑똑하지만 일관되지는 않음"],
    ["01-1-inconsistency-before-after.html", "assets/handdrawn/01-harness.png", "01-1. Before/After", "같은 요청도 환경이 다르면 달라짐"],
    ["02-failure-patterns.html", "assets/handdrawn/08-hooks.png", "02. 실패 패턴", "읽기 누락, 검증 우회, 컨텍스트 오염"],
    ["00-1-workbench-preview.html", "assets/handdrawn/12-workflow.png", "전체 지도. 작업장 미리보기", "반복 실패를 막는 최종 하네스 구조"],
    ["13-spec-driven.html", "assets/handdrawn/05-spec.png", "13. 명세 기반 작업", "가장 안쪽의 기본 제어"],
    ["04-prompt-layer.html", "assets/handdrawn/02-prompt-layer.png", "04. 프롬프트 레이어", "한 번의 요청을 안정화하기"],
    ["05-persona.html", "assets/handdrawn/02-prompt-layer.png", "05. 페르소나", "역할 이름보다 판단 기준"],
    ["06-few-shot.html", "assets/handdrawn/02-prompt-layer.png", "06. 예시 기반 요청", "좋은 예와 나쁜 예를 한 화면에서 비교"],
    ["07-reasoning-prompts.html", "assets/handdrawn/02-prompt-layer.png", "07. 추론형 모델 요청", "“단계별로 생각해” 남발하지 않기"],
    ["08-claude-md.html", "assets/handdrawn/03-context.png", "08. CLAUDE.md", "항상 로드되는 프로젝트 기억"],
    ["09-context-engineering.html", "assets/handdrawn/03-context.png", "09. 컨텍스트 설계", "필요한 정보만 작업대에 올리기"],
    ["10-skills.html", "assets/handdrawn/04-skills.png", "10. 스킬", "반복 절차를 매뉴얼로 승격"],
    ["11-skill-structure.html", "assets/handdrawn/04-skills.png", "11. 스킬 구조", "호출 조건, 실행 코드, 참고 자료"],
    ["12-superpowers.html", "assets/handdrawn/06-superpowers.png", "12. Superpowers", "스킬 기반 개발 규율 패키지"],
    ["14-subagents.html", "assets/handdrawn/07-subagents.png", "14. 서브에이전트", "격리된 전문 작업자"],
    ["15-agent-teams.html", "assets/handdrawn/07-subagents.png", "15. 에이전트 팀", "안전한 병렬화와 위험한 병렬화를 비교"],
    ["18-mcp.html", "assets/handdrawn/09-mcp.png", "18. MCP / 도구 레이어", "외부 시스템과 연결"],
    ["18-4-practice-agent-tool-split.html", "assets/handdrawn/09-mcp.png", "실습 5. 역할/도구 분리", "Main, Subagent, MCP Tool, Human Review"],
    ["16-hooks.html", "assets/handdrawn/08-hooks.png", "16. 훅", "지시가 아니라 반드시 실행되는 자동화"],
    ["17-hook-advanced.html", "assets/handdrawn/08-hooks.png", "17. 훅 심화", "종료 전 검증과 별도 리뷰"],
    ["19-evaluation.html", "assets/handdrawn/10-evaluation.png", "19. 평가와 검증", "테스트, 기준표, 사람 리뷰"],
    ["20-loop-schedule.html", "assets/handdrawn/11-loop.png", "20. 반복과 예약 실행", "한 번이 아니라 계속 돌리는 구조"],
    ["20-2-practice-verification-gate.html", "assets/handdrawn/10-evaluation.png", "실습 6. 검증 게이트", "언제, 무엇을, 어떤 기준으로 통과시킬지"],
    ["21-final-workflow.html", "assets/handdrawn/12-workflow.png", "21. 최종 워크플로우", "HTML/CSS 발표자료 자동화 하네스 v1"],
    ["21-10-practice-few-shot-placement.html", "assets/handdrawn/02-prompt-layer.png", "통합 실습. 예시 배치", "최종 워크플로우에서 출력 형식 고정"],
    ["21-5-handoff-why.html", "assets/handdrawn/12-workflow.png", "21-5. Handoff", "다음 세션을 위한 상태 파일"],
    ["21-8-practice-handoff.html", "assets/handdrawn/12-workflow.png", "실습 8. 이어받기 문서 작성", "현재 상태, 결정, 검증, 다음 요청"],
    ["21-9-practice-personal-harness.html", "assets/handdrawn/12-workflow.png", "실습 9. 내 프로젝트 하네스", "규칙, 스킬, 검증 후보 3개"],
  ];
  const cardHtml = cards.map(([href, img, title, subtitle]) => `      <a class="cut-card" href="${href}"><img src="${img}" alt=""><div><strong>${title}</strong><span>${subtitle}</span></div></a>`).join("\n");
  html = html.replace(/<section class="cut-grid">[\s\S]*?<\/section>/, `<section class="cut-grid">\n${cardHtml}\n    </section>`);
  fs.writeFileSync(indexPath, html);
}

const slides = loadSlides();
const byFile = new Map(slides.map((slide) => [slide.file, slide]));

const speakerUpdates = {
  "01-why-harness.html": [
    "AI 코딩 도구를 처음 쓰면 속도에 놀랍니다. 그런데 실무에서 며칠만 굴려보면 다른 문제가 보입니다. 어제는 파일을 잘 읽더니 오늘은 추측으로 고치고, 방금 테스트를 돌리라고 했는데 다음 작업에서는 또 생략합니다.",
    "이때 많은 분들이 프롬프트를 더 길게 씁니다. 하지만 반복되는 실수는 대화창의 문장 길이 문제가 아닙니다. AI가 일하는 작업 조건이 매번 달라지는 문제입니다.",
    "오늘의 목표는 AI를 더 세게 다그치는 것이 아닙니다. AI가 흔들려도 같은 길로 돌아오게 만드는 작업장을 세우는 겁니다. 규칙은 프로젝트 지침으로, 절차는 매뉴얼로, 검증은 검문소로 올려서 반복 실패를 구조로 막겠습니다.",
    "바로 다음 장에서 같은 요청이 왜 다른 결과로 갈라지는지 보겠습니다. 그 차이를 먼저 확인해야, 뒤에서 나오는 하네스 지도가 기능 목록이 아니라 실제 해법으로 보입니다.",
  ],
  "02-failure-patterns.html": [
    "이제 실패를 구체적으로 보겠습니다. 현장에서 AI가 망가지는 방식은 생각보다 반복적입니다. 파일을 보지 않고 고치고, 테스트를 약하게 만들고, 오래된 대화 맥락을 현재 결정처럼 붙잡습니다.",
    "이런 장면을 모델 지능 부족으로만 보면 매번 더 좋은 모델을 기다리게 됩니다. 하지만 절차 문제로 보면 지금 당장 고칠 수 있습니다. 작업장에 들어오면 도면부터 보고, 조립 뒤에는 검사를 통과하고, 오래된 도면은 치우게 만들면 됩니다.",
    "그래서 이 섹션은 일부러 해결책보다 먼저 둡니다. 우리에게 필요한 것은 멋진 용어가 아니라, 실제로 반복되는 고통을 어느 장치로 막을지 판단하는 감각입니다.",
    "첫 번째 실패는 가장 흔합니다. AI가 파일을 읽기 전에 이미 머릿속으로 API를 만들어버리는 경우입니다.",
  ],
  "02-1-why-llms-fail.html": [
    "LLM은 빈칸을 싫어합니다. 모르는 부분을 만나면 멈춰서 확인하기보다, 그럴듯한 추론으로 메우려는 힘이 있습니다.",
    "프로젝트 파일, 최신 규칙, 테스트 결과가 눈앞에 없으면 모델은 '아마 이런 구조겠지'라고 가정합니다. 문제는 이 가정이 꽤 자연스럽게 들린다는 점입니다. 틀렸는데도 자신 있게 말하니까 더 위험합니다.",
    "그래서 하네스의 첫 원칙은 간단합니다. 상상할 공간을 줄이고, 실제 근거를 눈앞에 놓는 겁니다. 읽어야 할 파일, 지켜야 할 기준, 통과해야 할 검증을 작업 전에 좁혀줘야 합니다.",
    "이제 이 원리가 실제 코드 수정에서 어떻게 터지는지 보겠습니다.",
  ],
  "02-5-improvement-process-guardrails.html": [
    "반복 실패를 막는 첫 처방은 '더 똑똑하게 해'가 아닙니다. 작업 순서를 정하는 겁니다.",
    "자동차 공장에서 새 작업자에게 '알아서 사고 없이 조립해 보세요'라고 말하면 품질이 흔들립니다. 바닥에 작업선을 그리고, 필요한 공구를 정하고, 출구에 검문소를 세워야 합니다. AI 작업도 같습니다.",
    "기본 작업선은 읽기, 계획, 수정, 검증, 보고입니다. 수정 전에는 실제 파일을 읽고, 손대기 전에는 계획을 세우고, 끝났다고 말하기 전에는 증거를 가져오게 합니다.",
    "이 절차가 두 번 이상 반복된다면 프롬프트 팁으로 남겨두지 않습니다. 팀 규칙은 CLAUDE.md 같은 프로젝트 지침으로 올리고, 반복 절차와 검증은 더 단단한 레이어로 옮깁니다.",
    "이제 실패 유형과 최소 작업선을 봤으니, 다음 장부터 그 작업선을 실제 작업장 구조로 펼쳐보겠습니다.",
  ],
  "02-6-improvement-turn-failure-into-rule.html": [
    "이제 레이어의 책임을 봤으니, 앞에서 본 실패를 지도 위에 올려보겠습니다. 같은 실수가 반복되면 더 이상 채팅창에서 설득하지 않습니다. 시스템의 어느 위치에 올릴지 결정합니다.",
    "반복 원칙은 CLAUDE.md 같은 프로젝트 지침으로, 반복 절차는 Skill로, 독립적인 판단은 Subagent로, 외부 확인은 MCP나 Tool로 보냅니다. 절대 빠지면 안 되는 검증은 Hook과 Evaluation으로 강제합니다.",
    "이 화면은 앞으로 강의 전체를 읽는 열쇠입니다. 뒤에 나오는 모든 레이어는 새 기능 소개가 아니라, 방금 본 실패를 막기 위한 배치입니다.",
    "이제 남은 질문은 하나입니다. 어떤 실패를 얼마나 강하게 하네스로 올릴 것인가. 그 기준은 빈도와 위험도입니다.",
  ],
  "00-1-workbench-preview.html": [
    "방금 우리는 AI가 왜 흔들리는지, 그리고 그때 빠지는 최소 작업선이 무엇인지 봤습니다.",
    "그래서 답도 바뀌어야 합니다. 프롬프트를 더 길게 쓰는 것만으로는 부족합니다. 우리가 만들 것은 AI가 같은 기준으로 일하게 만드는 작업장입니다.",
    "작업장의 벽에는 CLAUDE.md 같은 항상 지켜야 할 프로젝트 지침이 붙어 있고, 작업대에는 필요한 공구와 매뉴얼만 올라옵니다. 외부 시스템은 MCP나 Tool로 연결하고, 역할이 섞이면 Subagent로 분리합니다. 출구에는 Hook과 Evaluation이라는 검문소를 둡니다.",
    "이제 전체 지도를 보겠습니다. 어떤 지시는 프롬프트에 남기고, 어떤 것은 프로젝트 지침과 절차와 검증으로 올릴지 레이어별 책임을 잡아보겠습니다.",
  ],
  "13-spec-driven.html": [
    "큰 지도를 봤으니 가장 안쪽부터 시작하겠습니다. AI에게 일을 맡길 때 첫 번째 기본기는 명세입니다.",
    "명세는 거창한 문서가 아닙니다. 이번 작업에서 만들 것, 만들지 않을 것, 지켜야 할 제약, 통과 기준을 먼저 고정하는 계약서입니다.",
    "이 계약이 있어야 뒤의 프롬프트, 예시, 검증이 같은 방향을 봅니다. 계약 없이 바로 구현을 시작하면 AI의 속도는 장점이 아니라 위험이 됩니다.",
    "이제 즉흥 요청과 명세 기반 요청이 어떻게 다른지 비교해 보겠습니다.",
  ],
  "13-1-vibe-vs-spec.html": [
    "느낌으로 시작하는 작업은 빠릅니다. 문제는 그 느낌이 대화가 길어지는 동안 계속 바뀐다는 겁니다.",
    "명세 기반 작업은 먼저 기준을 밖으로 꺼냅니다. 목표와 제외 범위를 파일에 남겨두면, AI가 중간에 다른 가정을 끌어와도 다시 돌아갈 기준점이 생깁니다.",
    "특히 제외 범위가 중요합니다. AI는 시키지 않은 일도 그럴듯하면 붙이려 합니다. 지금 하지 않을 일을 적어두는 것만으로도 작업 범위가 훨씬 안정됩니다.",
    "그럼 좋은 명세가 무엇을 고정해야 하는지 네 가지 항목으로 보겠습니다.",
  ],
  "13-2-spec-contract.html": [
    "좋은 명세는 네 가지를 잠급니다. 목표, 제외 범위, 제약, 통과 기준입니다.",
    "목표는 어디로 갈지 정합니다. 제외 범위는 AI가 마음대로 넓히지 못하게 막습니다. 제약은 사용할 도구와 팀 규칙을 고정합니다. 통과 기준은 완료 보고를 증거로 바꿉니다.",
    "이 네 가지가 없으면 AI는 빈칸을 상상으로 채웁니다. 반대로 네 가지가 선명하면 이후 계획과 리뷰가 모두 같은 기준표를 보게 됩니다.",
    "다음 장에서는 나쁜 명세와 좋은 명세가 실제로 어떤 차이를 만드는지 보겠습니다.",
  ],
  "13-3-spec-bad-good.html": [
    "나쁜 명세는 해석을 남깁니다. '로그인 UX를 개선해 줘'라고 하면 속도를 높이라는 건지, 문구를 바꾸라는 건지, 오류 처리를 추가하라는 건지 사람마다 다르게 이해합니다.",
    "좋은 명세는 확인을 남깁니다. 어떤 오류 메시지를 보여줄지, 몇 번 실패하면 어떻게 처리할지, 어떤 테스트로 통과를 볼지까지 적습니다.",
    "AI와 일할 때 이 차이는 더 커집니다. AI는 빠르게 만들기 때문에, 방향이 흐리면 빠르게 엉뚱한 곳으로 갑니다.",
    "명세는 작성하고 끝나는 문서가 아닙니다. 다음 장에서 보듯 계획과 실행과 리뷰를 계속 붙잡는 기준표가 되어야 합니다.",
  ],
  "13-4-spec-plan-review-flow.html": [
    "명세는 서랍에 넣어두는 문서가 아닙니다. 작업대 위에 계속 펼쳐두는 도면입니다.",
    "흐름은 Spec, Plan, Execution, Review입니다. 먼저 무엇을 만들지 고정하고, 그 기준으로 작업 순서를 쪼개고, 작은 단위로 실행한 뒤, 다시 처음 명세와 결과를 대조합니다.",
    "이 흐름이 있으면 AI가 빠르게 움직여도 방향을 잃지 않습니다. 리뷰도 감상이 아니라 계약 대조가 됩니다.",
    "이제 우리가 매일 쓰는 프롬프트로 내려가 보겠습니다. 프롬프트도 이 하네스의 가장 작은 제어 장치입니다.",
  ],
  "04-prompt-layer.html": [
    "프롬프트는 하네스의 반대말이 아닙니다. 가장 안쪽에 있는 작은 제어 장치입니다.",
    "이번 한 번만 필요한 말은 프롬프트에 둡니다. 표로 정리해 달라, 보안 관점만 봐 달라, 이 파일만 읽어 달라 같은 지시는 가볍게 처리하면 됩니다.",
    "하지만 매번 반복되는 말은 프롬프트에 계속 붙여넣지 않습니다. 규칙은 CLAUDE.md 같은 기억으로, 절차는 Skill로, 빠지면 안 되는 확인은 Hook이나 Evaluation으로 올립니다.",
    "프롬프트 레이어에서 우리가 볼 것은 네 가지입니다. 요청 구조, 입력 경계, 페르소나의 판단 기준, 그리고 few-shot과 추론 요청의 적절한 강도입니다.",
  ],
  "04-1-prompt-anatomy.html": [
    "좋은 요청은 긴 문단이 아니라 잘 나뉜 작업 발주서에 가깝습니다.",
    "여섯 칸을 나눠보세요. 목표, 증상, 확인할 파일, 제약, 검증 방법, 보고 형식입니다. 이 칸들이 채워지면 AI가 마음대로 상상할 빈칸이 줄어듭니다.",
    "특히 검증 방법과 보고 형식은 뒤에 붙이는 장식이 아닙니다. 작업 시작부터 완료의 기준을 정하는 장치입니다.",
    "다음은 이 여섯 칸이 서로 섞이지 않도록 입력 경계를 세우는 방법입니다.",
  ],
  "05-persona.html": [
    "페르소나는 '시니어처럼 말해줘'라는 역할극으로 끝나면 약합니다. 우리가 필요한 것은 말투가 아니라 판단 기준입니다.",
    "예를 들어 코드 리뷰어라면 칭찬보다 결함을 먼저 보게 해야 합니다. 1순위는 실제 장애 가능성, 2순위는 회귀와 테스트 누락, 3순위는 유지보수 위험처럼 우선순위를 쥐여주는 겁니다.",
    "이렇게 기준이 선명해지면 AI는 전문가처럼 보이는 문장을 쓰는 데서 멈추지 않고, 우리가 실제로 필요한 결함을 찾기 시작합니다.",
    "이 기준을 매일 반복해서 쓴다면 Skill이나 Subagent로 승격시킬 수 있습니다. 페르소나는 독립 역할과 절차를 설계하기 전의 첫 스케치입니다.",
    "다음 장에서는 '시니어처럼'이라는 넓은 지시가 왜 약한지 먼저 확인하겠습니다.",
  ],
  "06-few-shot.html": [
    "Few-shot은 AI에게 새 지식을 주입하는 기술이라기보다, 답변의 모양을 고정하는 기술입니다.",
    "보고서, 리뷰, 분류처럼 형식이 중요한 작업에서는 예시 하나가 긴 설명보다 강합니다. 파일 경로를 어디에 쓰는지, 우선순위를 어떻게 붙이는지, 이유를 어느 깊이까지 적는지 모델이 그대로 따라옵니다.",
    "다만 예시를 많이 넣는 것이 능사는 아닙니다. 작업대가 좁아집니다. 산출물과 가장 가까운 좋은 예, 그리고 피해야 할 나쁜 예를 짧게 보여주는 편이 낫습니다.",
    "다음 화면에서 좋은 예와 나쁜 예를 한 번에 비교하겠습니다. 이 비교가 few-shot을 쓸 때의 기준선입니다.",
  ],
  "06-1-good-few-shot.html": [
    "Few-shot은 좋은 예만 보여주면 절반만 한 겁니다. AI는 우리가 보여준 모양을 그대로 복제하므로, 좋은 산출물의 깊이와 나쁜 산출물의 경계를 같이 줘야 합니다.",
    "좋은 예시는 실제 결과물과 닮아 있습니다. 원본, 레이아웃, 시각 기준, 검증 명령처럼 모델이 따라야 할 필드와 깊이가 살아 있습니다.",
    "나쁜 예시는 '멋지게', '보기 좋게'처럼 확인할 수 없는 말로 끝납니다. 검증 기준이 없으면 완료 기준도 사라집니다.",
    "그래서 실무에서는 성공 예시 하나와 실패 예시 하나를 짧게 붙여두세요. 모델에게 이 모양은 따라 하고, 이 선은 넘지 말라는 경계가 생깁니다.",
  ],
  "07-reasoning-prompts.html": [
    "few-shot으로 출력 모양을 잡았다면, 이제 추론 요청의 강도를 조절해야 합니다.",
    "예전에는 '단계별로 생각해'를 거의 만능 주문처럼 붙였습니다. 하지만 최신 추론형 모델에는 장황한 생각 유도보다 목표, 제약, 통과 기준을 간결하게 주는 편이 더 안정적인 경우가 많습니다.",
    "복잡한 분석이 필요한 작업에는 판단 기준과 출력 형식을 요구합니다. 단순 변환이나 정리 작업에는 과도한 추론을 요구하지 않습니다.",
    "핵심은 모델에게 오래 생각하라고 말하는 것이 아니라, 어떤 기준으로 결과를 낼지 선명하게 주는 것입니다.",
  ],
  "15-1-parallel-safe.html": [
    "병렬화는 속도를 올리는 좋은 방법입니다. 하지만 모든 일을 여러 AI에게 나눠주면 빨라지는 것은 아닙니다.",
    "안전한 경우는 서로 독립된 작업입니다. 보안, 성능, 테스트처럼 관점이 다르거나, 서로 다른 파일을 읽기만 하거나, 외부 자료를 조사하는 일은 병렬화에 맞습니다.",
    "위험한 경우는 같은 결정을 여러 agent에게 맡길 때입니다. 같은 파일을 동시에 고치거나, 데이터 모델을 각각 정하거나, UI 패턴을 따로 만들면 마지막에 통합 비용이 폭발합니다.",
    "그래서 병렬화의 원칙은 간단합니다. 분산은 넓게 하되 결정권은 한 곳에 둡니다. main agent가 통합 기준을 들고 있어야 팀이 하나의 결과물로 모입니다.",
  ],
  "16-1-hook-event.html": [
    "Hook은 세 조각으로 보면 가장 쉽습니다. 언제 시작할지, 무엇을 실행할지, 결과를 어떻게 돌려줄지입니다.",
    "첫째는 Event입니다. 파일 수정 뒤인지, 세션 종료 직전인지, 시작할 때인지 길목을 고릅니다. 길목을 잘못 고르면 검문소가 너무 자주 열려 작업이 느려집니다.",
    "둘째는 Matcher와 Command입니다. 예를 들어 Edit이나 Write 뒤에만 `pnpm test`를 실행하게 묶을 수 있습니다. 처음에는 echo로 확인하고, 충분히 좁힌 뒤 lint나 test로 올리는 게 안전합니다.",
    "셋째는 Result입니다. pass는 완료 보고의 증거가 되고, fail은 agent의 다음 수정 행동으로 돌아가야 합니다. Hook은 부탁이 아니라 실행되는 검문소입니다.",
  ],
};

Object.entries(speakerUpdates).forEach(([file, paragraphs]) => {
  const slide = byFile.get(file);
  if (!slide) throw new Error(`slide not found: ${file}`);
  slide.speaker = {
    ...(slide.speaker || {}),
    html: speaker(paragraphs),
  };
});

Object.entries({
  "06-1-good-few-shot.html": "Few-shot은 좋은 예와 나쁜 예를 함께 보여 줍니다",
  "15-1-parallel-safe.html": "병렬화는 안전한 경우와 위험한 경우를 나눕니다",
  "16-1-hook-event.html": "Hook은 실행 파이프라인입니다",
}).forEach(([file, title]) => {
  const slide = byFile.get(file);
  if (!slide) throw new Error(`slide not found: ${file}`);
  slide.reviewTitle = title;
  slide.speaker = {
    ...(slide.speaker || {}),
    heading: title,
  };
});

replaceTitle("06-1-good-few-shot.html", "Few-shot은 좋은 예와 나쁜 예를 함께 보여 줍니다");
replaceMain(
  "06-1-good-few-shot.html",
  '<main class="slide"><section class="copy"><div class="eyebrow">06</div><h2>Few-shot은 좋은 예와 나쁜 예를 함께 보여 줍니다</h2><p class="subtitle">성공 예시는 따라 할 모양을, 실패 예시는 넘지 말아야 할 경계를 고정합니다.</p><ul class="bullets"><li>Good: 필드명, 작성 깊이, 검증 기준이 실제 산출물과 가깝습니다.</li><li>Bad: “멋지게”처럼 취향만 남기고 완료 기준을 지웁니다.</li><li>예시는 많기보다 최종 산출물과 가까워야 합니다.</li></ul><div class="note"><strong>발표 포인트</strong>good/bad few-shot을 한 화면에서 비교해 예시의 역할과 실패 경계를 동시에 설명합니다.</div></section><section class="slide-media"><div class="css-visual expand-compare-visual" aria-label="few-shot good and bad comparison"><div class="compare-card good"><strong>Good</strong><span>layout / visual / verify 포함</span></div><div class="compare-arrow">vs</div><div class="compare-card bad"><strong>Bad</strong><span>멋지게 / 보기 좋게 / 검증 없음</span></div></div></section></main>'
);

replaceTitle("15-1-parallel-safe.html", "병렬화는 안전한 경우와 위험한 경우를 나눕니다");
replaceMain(
  "15-1-parallel-safe.html",
  '<main class="slide"><section class="copy"><div class="eyebrow">15</div><h2>병렬화는 안전한 경우와 위험한 경우를 나눕니다</h2><p class="subtitle">독립된 작업은 나눠도 되지만, 같은 결정을 나눠 맡기면 통합 비용이 커집니다.</p><ul class="bullets"><li>Safe: 관점이 분리된 리뷰</li><li>Safe: 서로 다른 파일 읽기와 외부 조사</li><li>Risky: 같은 파일 수정, 중복 결정, 통합 기준 부재</li></ul><div class="note"><strong>발표 포인트</strong>안전한 병렬화와 위험한 병렬화를 한 화면에서 비교해 통합 비용의 위험을 직관적으로 설명합니다.</div></section><section class="slide-media"><div class="css-visual expand-compare-visual" aria-label="safe and risky parallel agents comparison"><div class="compare-card good"><strong>Safe</strong><span>분리된 축 / 읽기 전용 / 통합자 있음</span></div><div class="compare-arrow">vs</div><div class="compare-card bad"><strong>Risky</strong><span>동일 파일 / 중복 결정 / 기준 없음</span></div></div></section></main>'
);

replaceTitle("16-1-hook-event.html", "Hook은 실행 파이프라인입니다");
replaceMain(
  "16-1-hook-event.html",
  '<main class="slide"><section class="copy"><div class="eyebrow">16</div><h2>Hook은 실행 파이프라인입니다</h2><p class="subtitle">Event, Command, Result를 묶어 pass/fail 피드백을 agent에게 돌려줍니다.</p><ul class="bullets"><li>Event: PostToolUse, Stop, SessionStart</li><li>Command: matcher로 좁히고 echo에서 test로 확장</li><li>Result: pass는 증거, fail은 다음 수정으로 회수</li></ul><div class="note"><strong>발표 포인트</strong>Event, Command, Result로 나뉘던 설명을 하나의 자동화 검문소 파이프라인으로 통합합니다.</div></section><section class="slide-media"><div class="css-visual expand-flow-visual" aria-label="hook event command result pipeline"><div class="flow-step" style="--delay:0.00s"><b>01</b><span>Event</span></div><div class="flow-step" style="--delay:0.08s"><b>02</b><span>Matcher</span></div><div class="flow-step" style="--delay:0.16s"><b>03</b><span>Command</span></div><div class="flow-step" style="--delay:0.24s"><b>04</b><span>Pass / Fail</span></div><div class="flow-step" style="--delay:0.32s"><b>05</b><span>Agent decision</span></div><div class="flow-line"></div></div></section></main>'
);

["06-2-bad-few-shot.html", "15-2-parallel-risk.html", "16-2-hook-command.html", "16-3-hook-result.html"].forEach((file) => byFile.delete(file));
const nextSlides = slides.filter((slide) => byFile.has(slide.file));

const sections = new Map();
nextSlides.forEach((slide) => {
  const key = slide.sectionId || slide.sectionTitle || "unknown";
  if (!sections.has(key)) sections.set(key, []);
  sections.get(key).push(slide);
});
sections.forEach((items) => {
  items.forEach((slide, index) => {
    slide.sectionIndex = index + 1;
    slide.sectionTotal = items.length;
    slide.sectionStart = index === 0;
  });
});

fs.writeFileSync(slidesPath, `window.LECTURE_SLIDES = ${JSON.stringify(nextSlides, null, 2)};\n`);
nextSlides.forEach((slide, index) => updateNav(slide.file, nextSlides[index - 1]?.file, nextSlides[index + 1]?.file));
updateIndex(nextSlides);
