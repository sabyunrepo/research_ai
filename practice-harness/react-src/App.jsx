const { createRoot } = require("react-dom/client");
const React = require("react");
const { useEffect, useId, useMemo, useRef, useState } = React;

const ACT1_PAGE_SIZE = 4;
const PROMPT_STEPS = ["상황 이해", "6칸 기준", "지시문 작성"];
const GLOSSARY_TERMS = [
  ["CLAUDE.md", "Claude Code가 프로젝트마다 읽는 규칙 파일입니다. 김아이가 매번 펼쳐 보는 회사 내규처럼 반복 기준을 적어 둡니다."],
  ["Beginner Claude Code Instructions", "초보자를 위한 Claude Code 기본 지침 원본입니다. 실습에서는 이 긴 원본을 짧은 프로젝트 규칙으로 줄입니다."],
  ["Verification-before-completion", "완료라고 말하기 전에 검증 증거를 먼저 확인하는 원칙입니다."],
  ["Approach comparison", "여러 해결 방법의 장단점과 위험을 비교해 선택을 돕는 정리입니다."],
  ["Requirement review", "사용자가 요구한 조건을 빠뜨리지 않았는지 확인하는 검토입니다."],
  ["Code quality review", "코드 구조, 유지보수성, 테스트 가능성을 확인하는 검토입니다."],
  ["Role Assignment", "작업을 역할별 담당자에게 나누어 맡기는 배정표입니다."],
  ["Verification Log", "검증 명령을 실행했는지와 결과가 어땠는지 남기는 기록입니다."],
  ["Remaining Risk", "작업 후에도 남아 있는 불확실성이나 추가 확인이 필요한 부분입니다."],
  ["Output Format", "AI 답변을 어떤 항목과 순서로 받을지 정한 출력 양식입니다."],
  ["Approval request", "구현으로 넘어가기 전에 사용자의 승인을 요청하는 단계입니다."],
  ["Current question", "브레인스토밍 중 지금 한 번에 답해야 하는 질문입니다."],
  ["Trigger summary", "이 Skill이 언제 실행되어야 하는지 짧게 요약한 문장입니다."],
  ["HTML/CSS", "웹 화면의 구조와 모양을 만드는 기본 언어입니다. HTML은 뼈대, CSS는 배치와 색상에 가깝습니다."],
  ["A/B", "두 가지 안을 비교해 어느 쪽이 더 나은지 실험하는 방식입니다."],
  ["ERD", "데이터베이스의 표와 관계를 그린 설계도입니다. 현재 화면 작업에는 범위가 너무 클 수 있습니다."],
  ["HARD-GATE", "다음 단계로 넘어가기 전에 반드시 멈추고 승인을 받아야 하는 강한 문턱입니다."],
  ["Superpowers", "반복 작업 절차를 Skill처럼 정리해 쓰는 워크플로우 예시 이름입니다."],
  ["Brainstorming", "바로 만들지 않고 질문과 비교를 통해 아이디어 범위를 좁히는 과정입니다."],
  ["Coordinator", "팀 작업의 목표, 제약, 역할 배정을 정리하는 조율 담당입니다."],
  ["Researcher", "자료와 근거를 읽고 확인하는 조사 담당입니다. 구현이나 최종 판단은 하지 않습니다."],
  ["Implementer", "합의된 범위 안에서 실제 구현과 테스트 실행을 맡는 담당입니다."],
  ["Reviewer", "요구사항 충족과 품질 위험을 검토하는 담당입니다. 직접 수정하지 않는 역할입니다."],
  ["Runbook", "실제로 어떤 순서로 실행했고 어떤 결과가 났는지 남기는 작업 기록 양식입니다."],
  ["Attempt", "같은 실습이나 실행을 한 번 시도한 기록입니다. 첫 번째 시도, 두 번째 시도처럼 비교할 수 있습니다."],
  ["Trigger", "어떤 상황이나 이벤트에서 절차가 시작되는지 정한 조건입니다."],
  ["State", "작업이 진행 중인지, 완료됐는지처럼 현재 상태를 기록한 값입니다."],
  ["Evidence", "완료라고 판단할 수 있게 보여 주는 증거입니다. 테스트 결과, 로그, 화면 확인 등이 포함됩니다."],
  ["Stop", "AI가 최종 답변을 내기 직전에 멈춰 검증할 수 있는 시점입니다."],
  ["Stop hook", "AI가 완료 답변을 내기 직전에 자동 검문을 실행하는 Hook입니다."],
  ["frontmatter", "Markdown 파일 맨 위에 쓰는 설정 영역입니다. 보통 --- 사이에 이름과 설명 같은 값을 둡니다."],
  ["description", "Skill이 언제 쓰이는지 설명하는 짧은 소개 문장입니다."],
  ["trigger", "어떤 상황에서 Skill이나 절차를 실행할지 정하는 시작 조건입니다."],
  ["tradeoff", "한 선택을 하면 얻는 점과 잃는 점이 함께 생기는 균형 관계입니다."],
  ["spec", "목표, 범위, 제약, 완료 기준을 정리한 설계 기준 문서입니다."],
  ["implementation", "계획이나 설계를 실제 코드나 결과물로 만드는 단계입니다."],
  ["plan", "실행 전에 순서와 범위를 정리한 작업 계획입니다."],
  ["local", "웹 서비스가 아니라 자기 컴퓨터나 현재 작업 환경에서 직접 실행한다는 뜻입니다."],
  ["diff", "수정 전과 수정 후 코드나 문서가 어떻게 달라졌는지 보여 주는 비교입니다."],
  ["edit/test/build", "수정하고, 테스트하고, 실행 가능한 결과물로 묶는 구현 담당 권한 묶음입니다."],
  ["read/search/browser", "파일을 읽고, 검색하고, 브라우저로 확인하는 조사 담당 권한 묶음입니다."],
  ["write/edit", "파일을 새로 쓰거나 수정하는 권한입니다. 조사 담당에게 주면 역할이 섞일 수 있습니다."],
  ["read/test/review", "읽고, 테스트 결과를 확인하고, 리뷰하는 검토 담당 권한 묶음입니다."],
  ["one question at a time", "한 번에 여러 질문을 던지지 않고 하나씩 묻고 답을 기다리는 방식입니다."],
  ["one-question-at-a-time", "한 번에 여러 질문을 던지지 않고 하나씩 묻고 답을 기다리는 방식입니다."],
  ["approach", "문제를 해결하는 방법 또는 접근안입니다."],
  ["constraints", "작업에서 지켜야 하는 제한 조건입니다. 기술, 시간, 범위, 금지 사항이 포함될 수 있습니다."],
  ["audience", "결과물을 보거나 사용할 사람입니다. 대상이 달라지면 설명 수준과 형식도 달라집니다."],
  ["goal", "이번 작업이 최종적으로 이루려는 목표입니다."],
  ["Subagent", "메인 작업자와 분리해 특정 역할만 맡기는 보조 AI 작업자입니다."],
  ["Evaluation", "결과가 기준을 만족하는지 확인하는 평가 절차입니다. 테스트, 리뷰, 채점표가 여기에 들어갑니다."],
  ["verification", "작업이 정말 끝났는지 증거로 확인하는 과정입니다. 테스트 실행, 화면 확인, 로그 확인 등이 포함됩니다."],
  ["acceptance criteria", "완료 여부를 판단하는 구체적인 기준입니다. 어디까지 되면 끝인지 정한 체크리스트입니다."],
  ["reference", "항상 켜둘 규칙은 아니지만 필요할 때 참고하는 보조 문서입니다."],
  ["settings", "도구 권한이나 동작 방식을 설정하는 파일 또는 설정값입니다. 규칙 문서와 달리 실제 실행 권한을 바꿀 수 있습니다."],
  ["global", "모든 프로젝트에 넓게 적용되는 가장 바깥 범위의 규칙 위치입니다."],
  ["user", "한 사용자 계정 전체에 적용되는 규칙 범위입니다."],
  ["project", "현재 프로젝트 폴더에 적용되는 규칙 범위입니다."],
  ["subfolder", "프로젝트 안의 특정 하위 폴더에만 적용되는 더 좁은 규칙 범위입니다."],
  ["destructive command", "파일 삭제, 초기화, 되돌리기처럼 되돌리기 어려운 명령입니다."],
  ["fallback", "기본 방법이 실패했을 때 쓰는 대체 방법입니다."],
  ["connector", "외부 서비스나 도구를 연결해 주는 장치입니다."],
  ["plugin", "기능을 추가하기 위해 설치하는 확장 묶음입니다."],
  ["GitHub", "코드와 변경 이력을 저장하고 리뷰하는 협업 서비스입니다."],
  ["git", "파일 변경 이력을 기록하고 되돌릴 수 있게 해 주는 버전 관리 도구입니다."],
  ["OS", "컴퓨터를 움직이는 기본 운영체제입니다. macOS, Windows, Linux 같은 것이 여기에 해당합니다."],
  ["API key", "외부 API를 사용할 때 본인 권한을 증명하는 비밀 열쇠입니다. 문서나 로그에 남기면 안 됩니다."],
  ["Skill", "반복 작업 절차를 파일로 만든 재사용 가능한 업무 매뉴얼입니다."],
  ["Steps", "절차를 순서대로 적어 둔 단계 목록입니다."],
  ["Tools", "AI가 호출해 실제 파일 읽기, 웹 확인, 명령 실행 같은 일을 하는 기능들입니다."],
  ["Prompt", "AI에게 이번 작업의 목표, 조건, 출력 형식을 알려 주는 요청문입니다."],
  ["Context", "AI가 현재 답변을 만들 때 참고하는 대화, 파일, 도구 설명 등 주변 정보입니다."],
  ["Hook", "특정 이벤트가 발생했을 때 자동으로 명령이나 검증을 실행하는 검문소입니다."],
  ["MCP", "AI 앱이 외부 도구와 표준 방식으로 연결되게 하는 약속입니다."],
  ["Agent", "특정 역할을 맡아 일하는 AI 작업자입니다. 강의에서는 김아이 팀의 역할 카드에 가깝습니다."],
  ["Tool", "AI가 호출해 실제 파일 읽기, 웹 확인, 명령 실행 같은 일을 하는 기능입니다."],
  ["API", "프로그램끼리 정해진 방식으로 기능이나 데이터를 주고받는 연결 규칙입니다."],
  ["JSON", "설정이나 데이터를 사람이 읽을 수 있는 텍스트 형태로 표현하는 형식입니다."],
  ["mock", "테스트나 연습에서 실제 외부 시스템 대신 쓰는 가짜 대체물입니다."],
  ["block", "조건이 맞지 않을 때 다음 단계로 넘어가지 못하게 막는 동작입니다."],
  ["complete", "작업이 끝났다고 표시한 상태입니다. 검증 증거 없이 complete로 두면 위험합니다."],
  ["processing", "작업이 아직 진행 중임을 나타내는 상태입니다."],
  ["loop guard", "같은 차단이나 재시도가 끝없이 반복되지 않게 막는 안전장치입니다."],
  ["loop", "조건을 만족할 때까지 작업과 검증을 반복하는 구조입니다."],
  ["checklist", "빠뜨리지 않도록 항목을 하나씩 확인하는 목록입니다."],
  ["requiredForUnlock", "해당 항목을 선택해야 통과나 잠금 해제가 가능한 필수 조건이라는 표시입니다."],
  ["blocksUnlock", "선택하면 통과나 잠금 해제를 막는 위험 조건이라는 표시입니다."],
  ["stopCondition", "언제 멈추고 언제 통과시킬지 정한 조건입니다."],
  ["hover", "마우스를 올렸을 때의 화면 상태입니다."],
  ["focus", "키보드나 클릭으로 입력 대상이 선택된 상태입니다."],
  ["grid", "화면을 줄과 칸으로 나누어 배치하는 CSS 방식입니다."],
  ["px", "화면에서 크기를 재는 단위인 픽셀입니다."],
  ["overflow", "글자나 요소가 정해진 영역 밖으로 넘치는 현상입니다."],
  ["CTA", "사용자가 눌러야 할 주요 행동 버튼이나 문구입니다."],
  ["UI", "사용자가 보고 누르는 화면 요소 전체를 뜻합니다."],
  ["반응형", "모바일과 데스크톱처럼 화면 크기가 달라도 읽고 누르기 좋게 배치가 바뀌는 방식입니다."],
  ["브라우저", "웹 페이지를 열어 보는 프로그램입니다. Chrome, Safari 같은 앱입니다."],
  ["컴포넌트", "버튼, 카드, 입력창처럼 재사용할 수 있게 나눈 화면 조각입니다."],
  ["코드블록", "코드와 일반 설명을 구분해 보여 주는 묶음입니다."],
  ["디자인 시스템", "색상, 버튼, 간격처럼 화면을 일관되게 만드는 공통 규칙 묶음입니다."],
  ["접근성", "마우스, 키보드, 보조 기술 등 다양한 방식으로도 화면을 사용할 수 있게 하는 기준입니다."],
  ["출력 형식", "AI 답변을 어떤 모양으로 받을지 정한 약속입니다. 예를 들어 HTML과 CSS 코드블록을 나눠 받는 방식입니다."],
  ["완료 기준", "이 일이 끝났다고 판단하기 위해 확인할 조건입니다."],
  ["제약 조건", "쓰면 안 되는 방식, 지켜야 할 기술, 색상, 도구 같은 제한입니다."],
  ["검증 기준", "작업이 맞게 끝났는지 판단하기 위해 미리 정해 둔 확인 기준입니다."],
  ["검증 명령", "테스트나 빌드처럼 결과를 증거로 확인하기 위해 실행하는 명령입니다."],
  ["통과 로그", "검증이 통과했다는 사실을 보여 주는 실행 기록입니다."],
  ["실행 기록", "어떤 명령을 실행했고 결과가 어땠는지 남기는 기록입니다."],
  ["역할 분리", "한 사람이 모든 판단을 하지 않도록 조사, 구현, 검토 같은 책임을 나누는 방식입니다."],
  ["도구 권한", "각 역할이 어떤 도구를 쓸 수 있는지 정한 허용 범위입니다."],
  ["요구사항", "사용자가 원한 조건과 결과입니다. 구현 전에 빠뜨리지 않았는지 확인해야 합니다."],
  ["코드 품질", "코드가 당장 동작하는지를 넘어 읽기 쉽고 유지보수 가능한지 보는 기준입니다."],
  ["프로젝트 맥락", "현재 작업과 관련된 기존 파일, 규칙, 목표, 제약 정보입니다."],
  ["범위 경계", "이번 작업에 포함할 것과 포함하지 않을 것을 나누는 선입니다."],
  ["접근안", "문제를 해결할 수 있는 후보 방법입니다."],
  ["승인 게이트", "다음 단계로 넘어가기 전에 사용자가 동의했는지 확인하는 문턱입니다."],
  ["트리거", "어떤 상황에서 Skill이나 절차를 실행할지 정하는 시작 조건입니다."],
  ["매뉴얼", "반복 업무를 같은 방식으로 처리하기 위해 적어 둔 절차입니다."],
  ["템플릿", "매번 새로 쓰지 않도록 미리 만들어 둔 기본 형식입니다."],
  ["프로젝트 루트", "프로젝트 폴더의 가장 바깥 위치입니다. 공통 규칙 파일을 두는 기준점입니다."],
  ["내규", "AI가 매번 지켜야 하는 프로젝트 규칙입니다."],
  ["토큰", "AI가 글을 읽고 쓸 때 나누어 처리하는 작은 조각입니다. 긴 문서는 토큰을 많이 씁니다."],
  ["개인정보", "이름, 연락처, 계정 정보처럼 외부에 노출되면 안 되는 개인 관련 정보입니다."],
].sort((a, b) => b[0].length - a[0].length);

const GLOSSARY_EXPLANATIONS = new Map(GLOSSARY_TERMS.map(([term, explanation]) => [term.toLowerCase(), explanation]));
const GLOSSARY_PATTERN = new RegExp(
  `(?<![A-Za-z0-9가-힣])(${GLOSSARY_TERMS.map(([term]) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})(?![A-Za-z0-9가-힣])`,
  "gi",
);

function stableSessionId() {
  const existing = window.localStorage.getItem("practiceHarnessSessionId");
  if (existing) return existing;
  const next = `learner-${Math.random().toString(36).slice(2, 8)}`;
  window.localStorage.setItem("practiceHarnessSessionId", next);
  return next;
}

async function fetchJson(url, options) {
  const response = await fetch(url, options);
  const body = await response.json().catch(() => ({}));
  if (!response.ok || body.ok === false) {
    throw new Error(body.error?.message || `요청 실패 (${response.status})`);
  }
  return body;
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.top = "-1000px";
  document.body.append(field);
  field.select();
  document.execCommand("copy");
  field.remove();
}

function routeForPractice(practice) {
  return practice ? `/act/${practice.act}` : "/";
}

function practiceFromLocation(practices) {
  const match = window.location.pathname.match(/^\/act\/(\d+)$/);
  if (match) {
    const act = Number(match[1]);
    return practices.find((practice) => practice.act === act);
  }
  const practiceMatch = window.location.pathname.match(/^\/practices\/([a-z0-9-]+)$/i);
  if (practiceMatch) return practices.find((practice) => practice.id === practiceMatch[1]);
  return practices[0];
}

function percentScore(score, maxScore) {
  if (!maxScore) return 0;
  return Math.max(0, Math.min(100, Math.round((score / maxScore) * 100)));
}

function questionMaxScore(question) {
  return (question?.choices || [])
    .filter((choice) => choice.kind === "required")
    .reduce((sum, choice) => sum + Math.max(0, choice.points || 0), 0);
}

function glossaryParts(text) {
  const value = String(text);
  GLOSSARY_PATTERN.lastIndex = 0;
  const parts = [];
  let lastIndex = 0;
  let match;
  while ((match = GLOSSARY_PATTERN.exec(value))) {
    if (match.index > lastIndex) parts.push(value.slice(lastIndex, match.index));
    const label = match[0];
    parts.push({
      label,
      explanation: GLOSSARY_EXPLANATIONS.get(label.toLowerCase()) || "",
    });
    lastIndex = match.index + label.length;
  }
  if (lastIndex < value.length) parts.push(value.slice(lastIndex));
  return parts;
}

function GlossaryTerm({ label, explanation }) {
  const tooltipId = useId();
  const activeTooltipId = "glossaryPopover";
  const show = (event) => {
    const target = event.currentTarget;
    const doc = target.ownerDocument;
    const win = doc.defaultView || window;
    let popover = doc.querySelector(`#${activeTooltipId}`);
    if (!popover) {
      popover = doc.createElement("div");
      popover.id = activeTooltipId;
      popover.className = "glossary-popover";
      popover.setAttribute("role", "tooltip");
      doc.body.append(popover);
    }
    popover.dataset.owner = tooltipId;
    popover.textContent = explanation;
    popover.classList.add("is-visible");
    const rect = target.getBoundingClientRect();
    const popoverRect = popover.getBoundingClientRect();
    const margin = 12;
    const left = Math.min(
      Math.max(rect.left + rect.width / 2 - popoverRect.width / 2, margin),
      win.innerWidth - popoverRect.width - margin,
    );
    const top = rect.top > popoverRect.height + margin * 2
      ? rect.top - popoverRect.height - margin
      : rect.bottom + margin;
    popover.style.left = `${left}px`;
    popover.style.top = `${Math.min(Math.max(top, margin), win.innerHeight - popoverRect.height - margin)}px`;
  };
  const hide = (event) => {
    const popover = event.currentTarget.ownerDocument.querySelector(`#${activeTooltipId}`);
    if (popover?.dataset.owner === tooltipId) popover.classList.remove("is-visible");
  };
  const onKeyDown = (event) => {
    if (event.key !== "Escape") return;
    hide(event);
    event.stopPropagation();
  };
  return (
    <span
      className="glossary-term"
      data-glossary={explanation}
      tabIndex={0}
      role="button"
      aria-describedby={activeTooltipId}
      aria-label={`${label}: ${explanation}`}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      onKeyDown={onKeyDown}
    >
      {label}
    </span>
  );
}

function GlossaryText({ children }) {
  if (children === null || children === undefined) return null;
  return glossaryParts(children).map((part, index) => {
    if (typeof part === "string") return part;
    return <GlossaryTerm key={`${part.label}-${index}`} label={part.label} explanation={part.explanation} />;
  });
}

function StatusBanner({ submitState }) {
  if (submitState.status === "idle") return null;
  if (submitState.status === "error") {
    return (
      <div className="status-banner error" role="alert">
        <strong>{submitState.title || "제출하지 못했습니다."}</strong>
        <span>{submitState.message}</span>
      </div>
    );
  }
  return (
    <div className="status-banner loading" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <strong>{submitState.message}</strong>
      <span>잠시만 기다리세요. 중복 제출을 막기 위해 버튼을 잠갔습니다.</span>
    </div>
  );
}

function PracticeNavigator({ practices, current, onSelect, disabled }) {
  return (
    <nav className="stage-nav" aria-label="실습 목록">
      <ol className="practice-list">
        {practices.map((practice) => (
          <li key={practice.id}>
            <button
              type="button"
              disabled={disabled}
              aria-current={practice.id === current?.id ? "true" : undefined}
              onClick={() => onSelect(practice)}
            >
              {practice.act}. {practice.title.replace(/^실습 \d+:\s*/, "")}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function isRequiredChoice(choice) {
  return choice.kind === "required" || choice.required === true;
}

function isBlockingChoice(choice) {
  return choice.kind === "noise" || choice.kind === "pollution" || choice.blocking === true;
}

function Heading({ practice }) {
  if (!practice) return <div id="practice-heading" className="practice-heading" />;
  return (
    <div id="practice-heading" className="practice-heading">
      <p><GlossaryText>{`Act ${practice.act} · ${practice.type}`}</GlossaryText></p>
      <h1><GlossaryText>{practice.title}</GlossaryText></h1>
      <p><GlossaryText>{`통과 기준 ${percentScore(practice.unlockThreshold, practice.maxScore)}점. 각 실습은 강의 뒤에 개별로 풀 수 있고, Act 1은 문제별로 결과를 확인합니다.`}</GlossaryText></p>
    </div>
  );
}

function LearningGuide({ practice }) {
  const learning = practice.learning || {};
  const body = (
    <>
      <p className="lead"><GlossaryText>{learning.task}</GlossaryText></p>
      <p><GlossaryText>{learning.why}</GlossaryText></p>
      {learning.hints?.length ? (
        <>
          <h3>힌트</h3>
          <ul className="hint-list">
            {learning.hints.map((hint) => <li key={hint}><GlossaryText>{hint}</GlossaryText></li>)}
          </ul>
        </>
      ) : null}
      {learning.bridge ? <p className="bridge-note"><GlossaryText>{learning.bridge}</GlossaryText></p> : null}
    </>
  );
  return (
    <section className="learning-guide">
      <p className="step-label">오늘 할 일</p>
      <h2><GlossaryText>{learning.goal}</GlossaryText></h2>
      {body}
    </section>
  );
}

function SubmitBar({ label = "실행", disabled, onReset }) {
  return (
    <div className="actions">
      <button className="secondary-button" type="button" disabled={disabled} onClick={onReset}>초기화</button>
      <button className="primary-button" type="submit" disabled={disabled}>
        {disabled ? "검사 중..." : label}
      </button>
    </div>
  );
}

function feedbackMessage(item) {
  if (typeof item === "string") return item;
  return item.message || item.feedback || String(item);
}

function FeedbackItemList({ items, itemClassName = "" }) {
  return (
    <>
      {items.map((item, index) => (
        <div className={`feedback-item ${itemClassName}`.trim()} key={`${feedbackMessage(item)}-${index}`}>
          <GlossaryText>{feedbackMessage(item)}</GlossaryText>
        </div>
      ))}
    </>
  );
}

function Act1Practice({ practice, onSubmit, disabled }) {
  const [started, setStarted] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [choicePageIndex, setChoicePageIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [questionResult, setQuestionResult] = useState(null);
  const question = practice.questions[questionIndex];
  const pageChoices = question.choices.slice(
    choicePageIndex * ACT1_PAGE_SIZE,
    choicePageIndex * ACT1_PAGE_SIZE + ACT1_PAGE_SIZE,
  );
  const isLastChoicePage = choicePageIndex >= Math.ceil(question.choices.length / ACT1_PAGE_SIZE) - 1;
  const selected = new Set(answers[question.id] || []);

  useEffect(() => {
    function goToNextQuestion() {
      setQuestionIndex((current) => Math.min(current + 1, practice.questions.length - 1));
      setChoicePageIndex(0);
      setQuestionResult(null);
    }
    window.addEventListener("practice-harness:act1-next-question", goToNextQuestion);
    return () => window.removeEventListener("practice-harness:act1-next-question", goToNextQuestion);
  }, [practice.questions.length]);

  if (!started) {
    return (
      <form className="practice-form" onSubmit={(event) => event.preventDefault()} aria-busy={disabled}>
        <LearningGuide practice={practice} />
        <div className="actions">
          <button type="button" className="primary-button" disabled={disabled} onClick={() => setStarted(true)}>문제 시작</button>
        </div>
      </form>
    );
  }

  function toggle(choiceId) {
    setQuestionResult(null);
    setAnswers((current) => {
      const currentSet = new Set(current[question.id] || []);
      if (currentSet.has(choiceId)) currentSet.delete(choiceId);
      else currentSet.add(choiceId);
      return { ...current, [question.id]: Array.from(currentSet) };
    });
  }

  function evaluateQuestion() {
    const selectedIds = answers[question.id] || [];
    const requiredChoices = question.choices.filter(isRequiredChoice);
    const blockingChoices = question.choices.filter(isBlockingChoice);
    const missingRequired = requiredChoices.filter((choice) => !selectedIds.includes(choice.id));
    const selectedBlocking = blockingChoices.filter((choice) => selectedIds.includes(choice.id));
    const passed = missingRequired.length === 0 && selectedBlocking.length === 0;
    setQuestionResult({
      passed,
    });
    onSubmit(
      { answers: { ...answers, [question.id]: selectedIds } },
      {
        kind: "act1-question",
        questionId: question.id,
        questionTitle: question.title,
        passed,
        hasNextQuestion: questionIndex < practice.questions.length - 1,
      },
    );
  }

  return (
    <form className="practice-form" onSubmit={(event) => event.preventDefault()} aria-busy={disabled}>
      <section className="section-block act1-choice-card">
        <p className="step-label">문제 {questionIndex + 1}/{practice.questions.length} · 선택지 {choicePageIndex + 1}</p>
        <h2><GlossaryText>{question.prompt}</GlossaryText></h2>
        <div className="option-list">
          {pageChoices.map((choice) => (
            <label className="choice-row" key={choice.id}>
              <input
                type="checkbox"
                name={question.id}
                value={choice.id}
                checked={selected.has(choice.id)}
                onChange={() => toggle(choice.id)}
                disabled={disabled}
              />
              <span><GlossaryText>{choice.label}</GlossaryText></span>
              <small>{choice.kind}</small>
            </label>
          ))}
        </div>
        <div className="context-step-controls">
          {choicePageIndex > 0 ? (
            <button type="button" className="secondary-button" disabled={disabled} onClick={() => setChoicePageIndex(choicePageIndex - 1)}>이전</button>
          ) : null}
          {questionResult ? (
            <>
              {questionResult.passed && questionIndex < practice.questions.length - 1 ? (
                <button type="button" className="primary-button" disabled={disabled} onClick={() => {
                  setQuestionIndex(questionIndex + 1);
                  setChoicePageIndex(0);
                  setQuestionResult(null);
                }}>다음 문제 풀기</button>
              ) : null}
              {!questionResult.passed ? (
                <button type="button" className="primary-button" disabled={disabled} onClick={() => {
                  setQuestionResult(null);
                }}>선택 고치기</button>
              ) : null}
            </>
          ) : (
            <button type="button" className="primary-button" disabled={disabled} onClick={() => {
              if (isLastChoicePage) evaluateQuestion();
              else setChoicePageIndex(choicePageIndex + 1);
            }}>{isLastChoicePage ? "문제 확인" : "다음 선택지"}</button>
          )}
        </div>
      </section>
    </form>
  );
}

function Act2Practice({ practice, onSubmit, disabled }) {
  const [step, setStep] = useState(0);
  const [prompt, setPrompt] = useState("");
  const [promptError, setPromptError] = useState("");
  const canSubmit = prompt.trim().length > 0;

  function updatePrompt(value) {
    setPrompt(value);
    if (value.trim()) setPromptError("");
  }

  function submitPrompt(event) {
    event.preventDefault();
    if (!prompt.trim()) {
      setPromptError("김아이에게 보낼 지시문을 입력해야 실행할 수 있습니다.");
      return;
    }
    onSubmit({ prompt: prompt.trim() });
  }

  return (
    <form className="practice-form practice-form-prompt-brief" onSubmit={submitPrompt} aria-busy={disabled}>
      <section className="section-block prompt-step-slide">
        <p className="step-label">단계 {step + 1}/3 · {PROMPT_STEPS[step]}</p>
        {step === 0 ? (
          <>
            <LearningGuide practice={practice} />
            {practice.learning?.beforeExample ? (
              <div className="example-callout">
                <strong>Before</strong>
                <span><GlossaryText>{practice.learning.beforeExample}</GlossaryText></span>
                <small><GlossaryText>이 요청은 김아이가 목표와 완료 기준을 추측하게 만듭니다.</GlossaryText></small>
              </div>
            ) : null}
          </>
        ) : step === 1 ? (
          <>
            <h2>좋은 업무 지시의 6칸</h2>
            <p><GlossaryText>아래 6칸이 모두 들어가야 김아이가 추측하지 않고 작업할 수 있습니다.</GlossaryText></p>
            <div className="pill-grid">
              {(practice.learning?.ingredients || []).map((item) => (
                <div className="pill-card" key={item.label}>
                  <strong><GlossaryText>{item.label}</GlossaryText></strong>
                  <span><GlossaryText>{item.description}</GlossaryText></span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <h2>김아이에게 보낼 지시문</h2>
            <p><GlossaryText>목표, 맥락, 제약, 완료 기준, 출력 형식을 한 번에 확인할 수 있게 적으세요.</GlossaryText></p>
            <label className="field-label" htmlFor="prompt">입력</label>
            <textarea id="prompt" name="prompt" value={prompt} disabled={disabled} aria-describedby="prompt-help prompt-error" onInput={(event) => updatePrompt(event.target.value)} onChange={(event) => updatePrompt(event.target.value)} />
            <p id="prompt-help" className="field-help"><GlossaryText>입력 후 실행을 누르면 검증 중 모달이 뜨고, 점수와 빠진 항목이 결과 모달에 표시됩니다.</GlossaryText></p>
            {promptError ? <p id="prompt-error" className="field-error" role="alert">{promptError}</p> : null}
          </>
        )}
        <div className="context-step-controls">
          {step > 0 ? (
            <button type="button" className="secondary-button" disabled={disabled} onClick={() => setStep(step - 1)}>이전</button>
          ) : null}
          {step < 2 ? (
            <button type="button" className="primary-button" disabled={disabled} onClick={() => setStep(step + 1)}>다음</button>
          ) : (
            <button type="submit" className="primary-button" disabled={disabled || !canSubmit}>{disabled ? "검사 중..." : canSubmit ? "실행" : "지시문 입력 필요"}</button>
          )}
        </div>
      </section>
    </form>
  );
}

function CopyButton({ text, children }) {
  const [state, setState] = useState("idle");
  return (
    <button type="button" className="secondary-button small-button" onClick={async () => {
      try {
        await copyText(text);
        setState("copied");
      } catch (_error) {
        setState("failed");
      } finally {
        setTimeout(() => setState("idle"), 1200);
      }
    }}>
      {state === "copied" ? "복사됨" : state === "failed" ? "복사 실패" : children}
    </button>
  );
}

function TextPractice({ practice, fieldName, onSubmit, disabled }) {
  const learning = practice.learning || {};
  const [value, setValue] = useState("");
  return (
    <form className={`practice-form practice-form-${practice.type}`} onSubmit={(event) => {
      event.preventDefault();
      const submittedValue = event.currentTarget.elements[fieldName].value;
      onSubmit({ [fieldName]: submittedValue });
    }} aria-busy={disabled}>
      <LearningGuide practice={practice} />
      {learning.starterTemplate ? (
        <section className="section-block template-block">
          <div className="template-header">
            <h2>기본 제공 Skill 템플릿</h2>
            <CopyButton text={learning.starterTemplate}>템플릿 복사</CopyButton>
          </div>
          <p><GlossaryText>이 템플릿은 출발점입니다. 대괄호 placeholder를 실제 규칙과 출력 형식으로 바꿔야 통과할 수 있습니다.</GlossaryText></p>
          <pre>{learning.starterTemplate}</pre>
        </section>
      ) : null}
      <section className="section-block">
        <h2>Skill 문서 초안</h2>
        <label className="field-label" htmlFor={fieldName}>입력</label>
        <textarea id={fieldName} name={fieldName} value={value} disabled={disabled} onInput={(event) => setValue(event.target.value)} onChange={(event) => setValue(event.target.value)} />
      </section>
      <SubmitBar disabled={disabled} onReset={() => setValue("")} />
    </form>
  );
}

function ClaudeMemoryPractice({ practice, onSubmit, disabled }) {
  const learning = practice.learning || {};
  const defaultScope = "project";
  const defaultRemovedRuleIds = (learning.ruleCards || [])
    .filter((rule) => rule.kind === "remove")
    .map((rule) => rule.id);
  const [documentValue, setDocumentValue] = useState(learning.defaultDocument || "");

  return (
    <form className="practice-form practice-form-claude-memory" onSubmit={(event) => {
      event.preventDefault();
      onSubmit({
        scope: defaultScope,
        removedRuleIds: defaultRemovedRuleIds,
        document: event.currentTarget.elements.document.value,
      });
    }} aria-busy={disabled}>
      <LearningGuide practice={practice} />
      {learning.sourceTemplate ? (
        <section className="section-block template-block">
          <div className="template-header">
            <div>
              <p className="step-label">기본 제공 파일 확인</p>
              <h2>Beginner Claude Code Instructions 원본</h2>
            </div>
            <CopyButton text={learning.sourceTemplate}>원본 전체 복사</CopyButton>
          </div>
          <p><GlossaryText>이 원본을 그대로 복사하지 말고, 프로젝트 루트에 항상 켜둘 짧은 CLAUDE.md만 아래에 정리하세요.</GlossaryText></p>
          <pre>{learning.sourceTemplate}</pre>
        </section>
      ) : null}
      <section className="section-block">
        <h2>프로젝트 루트에 남길 CLAUDE.md 초안</h2>
        <label className="field-label" htmlFor="document">입력</label>
        <textarea id="document" name="document" value={documentValue} disabled={disabled} onInput={(event) => setDocumentValue(event.target.value)} onChange={(event) => setDocumentValue(event.target.value)} />
      </section>
      <SubmitBar disabled={disabled} onReset={() => {
        setDocumentValue(learning.defaultDocument || "");
      }} />
    </form>
  );
}

function LocalRunbookPractice({ practice, onSubmit, disabled }) {
  const learning = practice.learning || {};
  const [record, setRecord] = useState(learning.runbookTemplate || "");
  return (
    <form className="practice-form practice-form-local-runbook" onSubmit={(event) => {
      event.preventDefault();
      onSubmit({ record: event.currentTarget.elements.record.value });
    }} aria-busy={disabled}>
      <LearningGuide practice={practice} />
      {learning.teamPrompt ? (
        <section className="section-block template-block">
          <div className="template-header">
            <h2>한 번에 복사</h2>
            <CopyButton text={learning.teamPrompt}>팀 프롬프트 복사</CopyButton>
          </div>
          <pre>{learning.teamPrompt}</pre>
        </section>
      ) : null}
      {learning.roleTemplates?.length ? (
        <section className="section-block">
          <h2>역할별 프롬프트 템플릿</h2>
          <div className="role-template-grid">
            {learning.roleTemplates.map((role) => (
              <article className="role-template-card" key={role.role}>
                <div className="template-header">
                  <h3><GlossaryText>{role.title}</GlossaryText></h3>
                  <CopyButton text={role.body}>복사</CopyButton>
                </div>
                <p><GlossaryText>{role.body}</GlossaryText></p>
              </article>
            ))}
          </div>
        </section>
      ) : null}
      {learning.toolPermissions?.length ? (
        <section className="section-block">
          <h2>Skill 배정과 Tool 권한 안내</h2>
          <ul className="permission-list">
            {learning.toolPermissions.map((permission) => <li key={permission}><GlossaryText>{permission}</GlossaryText></li>)}
          </ul>
        </section>
      ) : null}
      <section className="section-block">
        <h2>실행 기록 템플릿</h2>
        <label className="field-label" htmlFor="record">로컬 실행 후 기록</label>
        <textarea id="record" name="record" value={record} disabled={disabled} onInput={(event) => setRecord(event.target.value)} onChange={(event) => setRecord(event.target.value)} />
      </section>
      <SubmitBar disabled={disabled} onReset={() => setRecord(learning.runbookTemplate || "")} />
    </form>
  );
}

function ChecklistPractice({ practice, onSubmit, disabled }) {
  const [selected, setSelected] = useState(new Set());
  const groups = practice.groups || [{ id: "items", title: "선택 항목", items: practice.items || [] }];
  function toggle(id) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
  return (
    <form className="practice-form" onSubmit={(event) => {
      event.preventDefault();
      onSubmit({ selectedIds: Array.from(selected) });
    }} aria-busy={disabled}>
      <LearningGuide practice={practice} />
      <section className="section-block">
        <h2>완료 전 검문소 조건</h2>
        {groups.map((group) => (
          <div className="option-list" key={group.id}>
            <h3>{group.title}</h3>
            {(group.items || []).map((item) => (
              <label className="choice-row" key={item.id}>
                <input type="checkbox" name="selectedIds" value={item.id} checked={selected.has(item.id)} disabled={disabled} onChange={() => toggle(item.id)} />
                <span><GlossaryText>{item.label}</GlossaryText></span>
                <small>{item.blocksUnlock ? "차단" : item.requiredForUnlock ? "필수" : ""}</small>
              </label>
            ))}
          </div>
        ))}
      </section>
      <SubmitBar disabled={disabled} onReset={() => setSelected(new Set())} />
    </form>
  );
}

function ResultActions({ resultContext, onRetry }) {
  return (
    <div className="result-actions">
      <button type="button" className="secondary-button" onClick={onRetry}>결과 닫기</button>
      {resultContext?.kind === "act1-question" && resultContext.hasNextQuestion ? (
        <button type="button" className="primary-button" onClick={() => {
          onRetry();
          window.dispatchEvent(new CustomEvent("practice-harness:act1-next-question"));
        }}>다음 문제로</button>
      ) : null}
    </div>
  );
}

function JudgeResult({ judge }) {
  if (!judge) return null;
  return (
    <section className="result-section judge-result">
      <h3>AI 보조 검토 · {judge.verdict || "review"}</h3>
      <p className="judge-meta">
        {typeof judge.confidence === "number" ? `신뢰도 ${Math.round(judge.confidence * 100)}%` : ""}
        {judge.shouldReviewManually ? " · 사람 검토 권장" : ""}
      </p>
      <p><GlossaryText>{judge.summary || "AI 보조 검토 결과가 도착했습니다."}</GlossaryText></p>
      {[
        ["잘한 점", judge.strengths],
        ["위험", judge.risks],
        ["개선 제안", judge.suggestions],
      ].map(([title, items]) => items?.length ? (
        <div className="judge-list-block" key={title}>
          <strong>{title}</strong>
          <ul>{items.map((item) => <li key={item}><GlossaryText>{item}</GlossaryText></li>)}</ul>
        </div>
      ) : null)}
    </section>
  );
}

function focusableElements(container) {
  return Array.from(container.querySelectorAll([
    "button:not([disabled])",
    "input:not([disabled])",
    "textarea:not([disabled])",
    "select:not([disabled])",
    "a[href]",
    "[tabindex]:not([tabindex='-1'])",
  ].join(","))).filter((element) => !element.hasAttribute("aria-hidden"));
}

function AttemptHistory({ attempts, currentAttemptId }) {
  if (!attempts || attempts.length < 2) return null;
  const currentIndex = attempts.findIndex((item) => item.attemptId === currentAttemptId);
  const previous = currentIndex > 0 ? attempts[currentIndex - 1] : attempts[attempts.length - 2];
  const current = attempts.find((item) => item.attemptId === currentAttemptId) || attempts[attempts.length - 1];
  const bestScore = Math.max(...attempts.map((item) => percentScore(item.score, item.maxScore)));
  const previousScore = previous ? percentScore(previous.score, previous.maxScore) : null;
  const currentScore = percentScore(current.score, current.maxScore);
  const delta = previousScore === null ? 0 : currentScore - previousScore;
  const deltaLabel = delta > 0 ? `+${delta}점` : `${delta}점`;
  const recentAttempts = attempts.slice(-4).reverse();
  return (
    <section className="result-section attempt-history">
      <h3>시도 비교</h3>
      <p><GlossaryText>다시 제출한 결과가 이전 시도보다 어떻게 달라졌는지 확인하세요.</GlossaryText></p>
      <div className="attempt-summary-grid">
        <div>
          <strong>{bestScore}점</strong>
          <span>현재 세션 최고 점수</span>
        </div>
        <div>
          <strong>{deltaLabel}</strong>
          <span>직전 시도 대비 변화</span>
        </div>
      </div>
      <ol className="attempt-list">
        {recentAttempts.map((item) => (
          <li key={item.attemptId} className={item.attemptId === currentAttemptId ? "current" : ""}>
            <span>{item.attemptId === currentAttemptId ? "이번 시도" : `${item.attemptNumber}번째 시도`}</span>
            <strong>{percentScore(item.score, item.maxScore)}점</strong>
            <small>{item.unlocked ? "통과" : "재시도 필요"}</small>
          </li>
        ))}
      </ol>
    </section>
  );
}

function act1QuestionResult({ attempt, practice, resultContext }) {
  if (resultContext?.kind !== "act1-question") return null;
  const question = (practice?.questions || []).find((item) => item.id === resultContext.questionId);
  const questionScore = (attempt.questionScores || []).find((item) => item.questionId === resultContext.questionId);
  if (!question || !questionScore) return null;
  return {
    question,
    score: questionScore.score,
    maxScore: questionMaxScore(question),
    feedback: (attempt.feedback || []).filter((item) => item.questionId === resultContext.questionId),
  };
}

function ResultDialog({ attempt, practice, loading, resultContext, attemptHistory, onRetry }) {
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!loading && !attempt) return undefined;
    const previousFocus = document.activeElement;
    window.setTimeout(() => {
      if (attempt) closeButtonRef.current?.focus();
      else dialogRef.current?.focus();
    }, 0);
    return () => {
      if (previousFocus && typeof previousFocus.focus === "function" && document.contains(previousFocus)) {
        previousFocus.focus();
      }
    };
  }, [attempt?.attemptId, loading]);

  function onDialogKeyDown(event) {
    if (event.key === "Escape" && attempt) {
      event.preventDefault();
      onRetry();
      return;
    }
    if (event.key !== "Tab" || !dialogRef.current) return;
    const focusable = focusableElements(dialogRef.current);
    if (!focusable.length) {
      event.preventDefault();
      dialogRef.current.focus();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  if (!loading && !attempt) return null;

  if (loading) {
    const usesAiReview = practice?.act >= 2 && practice?.act <= 5;
    return (
      <div className="result-modal-backdrop" role="presentation">
        <section id="result-dialog" ref={dialogRef} tabIndex={-1} onKeyDown={onDialogKeyDown} className="result-dialog is-pending" role="dialog" aria-modal="true" aria-live="polite" aria-labelledby="result-dialog-title" aria-describedby="result-dialog-description">
          <div className="pending-dialog-header">
            <span className="spinner large-spinner" aria-hidden="true" />
            <div>
              <h2 id="result-dialog-title">검증 중</h2>
              <p id="result-dialog-description">
                <GlossaryText>{usesAiReview ? "기본 채점 후 AI 보조 검토를 실행하고 있습니다." : "기본 채점을 실행하고 있습니다."}</GlossaryText>
              </p>
            </div>
          </div>
          <div id="score-meter" className="score-meter pending">
            <strong>검사 중...</strong>
            <span>결과가 준비되면 이 창에서 바로 점수와 빠진 항목을 보여줍니다.</span>
          </div>
          <div id="feedback-list" className="feedback-list pending-steps" role="status" aria-live="polite">
            <div className="feedback-item pass">
              <strong>1. 입력 접수</strong>
              <span>제출 버튼을 잠그고 중복 제출을 막았습니다.</span>
            </div>
            <div className="feedback-item active">
              <strong>2. 채점 실행</strong>
              <span>{usesAiReview ? "기본 점수와 AI 보조 검토를 순서대로 확인합니다." : "기본 채점 기준으로 점수를 계산합니다."}</span>
            </div>
            <div className="feedback-item">
              <strong>3. 결과 준비</strong>
              <span>점수, 빠진 항목, 다시 시도할 내용을 정리합니다.</span>
            </div>
          </div>
        </section>
      </div>
    );
  }
  const hasNextAct1Question = resultContext?.kind === "act1-question" && resultContext.hasNextQuestion;
  const act1Result = act1QuestionResult({ attempt, practice, resultContext });
  const act1QuestionPassed = resultContext?.kind === "act1-question" && resultContext.passed;
  const nextAction = act1Result
    ? act1QuestionPassed
      ? hasNextAct1Question
        ? "이 문제를 통과했습니다. 다음 문제로 이동하세요."
        : "이 문제를 통과했습니다. 결과를 확인하고 닫아도 됩니다."
      : hasNextAct1Question
        ? "이 문제 점수가 부족합니다. 빠진 항목을 고치거나 다음 문제로 넘어갈 수 있습니다."
        : "이 문제 점수가 부족합니다. 아래 항목을 고친 뒤 다시 확인하세요."
    : attempt.unlocked
    ? "통과했습니다. 결과를 확인하고 닫아도 됩니다."
    : hasNextAct1Question
      ? "점수가 부족해도 강의 흐름상 다음 문제로 넘어갈 수 있습니다."
      : "점수가 부족합니다. 아래 항목을 고친 뒤 다시 제출하세요.";
  const passedChecks = (attempt.verificationLog || []).filter((entry) => entry.status === "pass");
  const displayScore = act1Result
    ? percentScore(act1Result.score, act1Result.maxScore)
    : percentScore(attempt.score, attempt.maxScore);
  const feedbackItems = act1Result ? act1Result.feedback : attempt.feedback || [];
  const passedForDisplay = act1Result ? act1QuestionPassed : attempt.unlocked;
  return (
    <div className="result-modal-backdrop" role="presentation">
      <section id="result-dialog" ref={dialogRef} tabIndex={-1} onKeyDown={onDialogKeyDown} className="result-dialog" role="dialog" aria-modal="true" aria-live="polite" aria-labelledby="result-dialog-title">
        <div className="result-dialog-header">
          <h2 id="result-dialog-title">검증 결과</h2>
          <button type="button" ref={closeButtonRef} className="secondary-button small-button" onClick={onRetry}>닫기</button>
        </div>
        <div id="score-meter" className={`score-meter ${passedForDisplay ? "pass" : "fail"}`}>
          <strong>{displayScore}점</strong>
          <span>{nextAction}</span>
        </div>
        <div id="feedback-list" className="feedback-list">
          <section className="result-section next-action">
            <h3>다음 행동</h3>
            <p><GlossaryText>{nextAction}</GlossaryText></p>
          </section>
          <section className="result-section">
            <h3>빠진 항목</h3>
            <FeedbackItemList items={feedbackItems.length ? feedbackItems : [{ message: "빠진 항목이 없습니다." }]} />
          </section>
          <section className="result-section">
            <h3>좋았던 점</h3>
            <FeedbackItemList items={passedChecks.length ? passedChecks.slice(0, 3) : [{ message: "아직 통과한 검증 항목이 없습니다." }]} itemClassName="pass" />
          </section>
          {!passedForDisplay ? (
            <section className="result-section">
              <h3>다시 시도할 때</h3>
              <p><GlossaryText>점수가 낮은 이유를 하나씩 고친 뒤 같은 입력을 다시 제출해 점수 변화를 확인하세요.</GlossaryText></p>
            </section>
          ) : null}
          <AttemptHistory attempts={attemptHistory} currentAttemptId={attempt.attemptId} />
          {attempt.unlockArtifact ? (
            <section className="result-section unlock-artifact">
              <div className="unlock-artifact-header">
                <h3>{attempt.unlockArtifact.title}</h3>
                <CopyButton text={attempt.unlockArtifact.body}>프롬프트 복사</CopyButton>
              </div>
              <p><GlossaryText>{practice?.learning?.unlockIntro || ""}</GlossaryText></p>
              <pre>{attempt.unlockArtifact.body}</pre>
            </section>
          ) : null}
          <JudgeResult judge={attempt.judgeResult} />
          {attempt.providerWarnings?.length ? (
            <section className="result-section judge-warning">
              <h3>AI 보조 검토</h3>
              <p><GlossaryText>AI 보조 검토를 사용할 수 없습니다. 기본 채점 결과를 확인하세요.</GlossaryText></p>
            </section>
          ) : null}
        </div>
        <details id="verification-log" className="verification-log">
          <summary>검증 로그 {attempt.verificationLog?.length || 0}개</summary>
          {(attempt.verificationLog || []).map((entry) => (
            <div className={`log-item ${entry.status}`} key={entry.checkId}>
              <strong>{entry.status.toUpperCase()}</strong>
              <span><GlossaryText>{entry.message}</GlossaryText></span>
            </div>
          ))}
        </details>
        <ResultActions resultContext={resultContext} onRetry={onRetry} />
      </section>
    </div>
  );
}

function PracticeRenderer({ practice, onSubmit, disabled }) {
  if (!practice) return null;
  if (practice.type === "multi-question-choice") return <Act1Practice practice={practice} onSubmit={onSubmit} disabled={disabled} />;
  if (practice.type === "prompt-brief") return <Act2Practice practice={practice} onSubmit={onSubmit} disabled={disabled} />;
  if (practice.type === "claude-memory") return <ClaudeMemoryPractice practice={practice} onSubmit={onSubmit} disabled={disabled} />;
  if (practice.type === "skill-document") return <TextPractice practice={practice} fieldName="document" onSubmit={onSubmit} disabled={disabled} />;
  if (practice.type === "local-runbook") return <LocalRunbookPractice practice={practice} onSubmit={onSubmit} disabled={disabled} />;
  if (practice.type === "checklist-unlock") return <ChecklistPractice practice={practice} onSubmit={onSubmit} disabled={disabled} />;
  return <p>지원하지 않는 실습입니다.</p>;
}

function App() {
  const [practices, setPractices] = useState([]);
  const [practice, setPractice] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [resultContext, setResultContext] = useState(null);
  const [sessionId, setSessionId] = useState(stableSessionId);
  const [submitState, setSubmitState] = useState({ status: "idle", message: "" });
  const [isLoadingPractice, setIsLoadingPractice] = useState(true);
  const [attemptHistoryByPractice, setAttemptHistoryByPractice] = useState({});
  const pendingClientAttemptIds = useRef({});

  const isSubmitting = submitState.status === "submitting";

  useEffect(() => {
    fetchJson("/api/practices").then((body) => {
      setPractices(body.practices);
      const next = practiceFromLocation(body.practices);
      if (next) selectPractice(next, false);
      else setIsLoadingPractice(false);
    }).catch((error) => {
      setIsLoadingPractice(false);
      setSubmitState({
        status: "error",
        title: "실습 화면을 불러오지 못했습니다.",
        message: error.message,
      });
    });
  }, []);

  useEffect(() => {
    function onPopState() {
      const next = practiceFromLocation(practices);
      if (next) selectPractice(next, false);
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [practices]);

  async function selectPractice(next, updateHistory = true) {
    setAttempt(null);
    setResultContext(null);
    setIsLoadingPractice(true);
    setSubmitState({ status: "idle", message: "" });
    if (updateHistory) {
      const path = routeForPractice(next);
      if (window.location.pathname !== path) window.history.pushState({ practiceId: next.id }, "", path);
    }
    try {
      const body = await fetchJson(`/api/practices/${next.id}`);
      setPractice(body.practice);
    } catch (error) {
      setPractice(next);
      setSubmitState({
        status: "error",
        title: "실습 화면을 불러오지 못했습니다.",
        message: error.message,
      });
    } finally {
      setIsLoadingPractice(false);
    }
  }

  function clientAttemptIdFor(currentPractice) {
    if (pendingClientAttemptIds.current[currentPractice.id]) return pendingClientAttemptIds.current[currentPractice.id];
    const id = `${currentPractice.id}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    pendingClientAttemptIds.current[currentPractice.id] = id;
    return id;
  }

  async function submitAttempt(input, nextResultContext = null) {
    if (!practice || isSubmitting) return;
    setAttempt(null);
    setResultContext(nextResultContext);
    setSubmitState({
      status: "submitting",
      message: practice.act >= 2 && practice.act <= 5 ? "기본 채점 후 AI 보조 검토를 실행 중입니다." : "기본 채점을 실행 중입니다.",
    });
    try {
      const body = await fetchJson(`/api/practices/${practice.id}/attempts`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          learnerSessionId: sessionId.trim(),
          clientAttemptId: clientAttemptIdFor(practice),
          input,
        }),
      });
      delete pendingClientAttemptIds.current[practice.id];
      setAttemptHistoryByPractice((current) => ({
        ...current,
        [practice.id]: (current[practice.id] || []).concat(body.attempt),
      }));
      setAttempt(body.attempt);
      setSubmitState({ status: "idle", message: "" });
    } catch (error) {
      setSubmitState({
        status: "error",
        title: "제출하지 못했습니다.",
        message: error.message,
      });
    }
  }

  const currentKey = useMemo(() => practice?.id || "none", [practice?.id]);

  return (
    <div className="practice-app-shell">
      <details className="session-box operator-session">
        <summary>세션</summary>
        <label htmlFor="session-id">수강생 세션</label>
        <input id="session-id" value={sessionId} onChange={(event) => {
          setSessionId(event.target.value);
          window.localStorage.setItem("practiceHarnessSessionId", event.target.value);
        }} />
      </details>
      <main id="presentation-layout" className="layout learner-layout">
        <PracticeNavigator practices={practices} current={practice} onSelect={selectPractice} disabled={isSubmitting} />
        <section id="practice-slide" className="workbench" aria-live="polite">
          <Heading practice={practice} />
          {isLoadingPractice ? (
            <div className="status-banner loading" role="status" aria-live="polite">
              <span className="spinner" aria-hidden="true" />
              <strong>실습 화면을 불러오는 중입니다.</strong>
              <span>입력 폼과 예시 자료를 준비하고 있습니다.</span>
            </div>
          ) : null}
          <StatusBanner submitState={submitState} />
          <PracticeRenderer key={currentKey} practice={practice} onSubmit={submitAttempt} disabled={isSubmitting || isLoadingPractice} />
        </section>
        <ResultDialog
          attempt={attempt}
          practice={practice}
          loading={isSubmitting}
          resultContext={resultContext}
          attemptHistory={practice ? attemptHistoryByPractice[practice.id] || [] : []}
          onRetry={() => {
            setAttempt(null);
            setResultContext(null);
            setSubmitState({ status: "idle", message: "" });
          }}
        />
      </main>
    </div>
  );
}

createRoot(document.getElementById("practice-root")).render(<App />);
