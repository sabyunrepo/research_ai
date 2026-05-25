# CSS Motion Reference for LLMs

이 문서는 다른 LLM에게 `lecture-cuts` 슬라이드의 CSS 모션을 설명하거나, 같은 스타일의 모션을 새 슬라이드에 재사용시키기 위한 자료다.

## 한 줄 요약

이 프로젝트의 모션은 JavaScript 라이브러리 없이 `lecture-cuts/assets/style.css`의 순수 CSS `@keyframes`로 구현되어 있다. 핵심 패턴은 "등장", "연결선", "흐름", "강조", "루프"다.

## 어디에 구현되어 있는가

- 원본 CSS: `lecture-cuts/assets/style.css`
- keyframes 정의 구간: `@keyframes slow-spin`부터 `@keyframes layer-pop`까지
- 접근성 처리: `@media (prefers-reduced-motion: reduce)`에서 주요 애니메이션을 끈다.
- `lecture-deck/scripts/verify-deck.js`의 `requestAnimationFrame`은 모션 기능이 아니라 브라우저 렌더링 안정화용 검증 코드다.

## 구현 원칙

1. 모션은 설명을 돕는 보조 장치다. 텍스트를 읽기 어렵게 하거나 레이아웃을 흔들면 안 된다.
2. 움직임은 `transform`, `opacity`, `box-shadow`, `border-color`, `background-position` 위주로 만든다.
3. 반복 모션은 느리게 둔다. 보통 `2.6s`에서 `4.4s`, 루프 다이어그램은 `18s`다.
4. 새 요소가 순서대로 나타나야 하면 `--delay` CSS 변수를 쓴다.
5. 카드가 손그림처럼 조금 기울어야 하면 `--tilt` CSS 변수를 쓴다.
6. 모든 새 모션 대상은 `prefers-reduced-motion: reduce` 블록에 추가한다.

## 모션 카탈로그

### 1. `layer-pop`

용도: 카드, 노드, 단계 요소가 살짝 아래에서 올라오며 등장한다.

동작: `opacity: 0 -> 1`, `translateY(12px) -> 0`, `rotate(var(--tilt))` 유지.

주로 쓰는 곳:

- `.layer-node`
- `.context-chip`
- `.prompt-chip`
- `.example-card`
- `.hook-box`
- `.agent-node`
- `.gate-row`
- `.harness-choice`

CSS 예시:

```css
.motion-card {
  --tilt: -1deg;
  --delay: .12s;
  border: 3px solid var(--line);
  background: var(--surface);
  box-shadow: 8px 8px 0 rgba(37, 99, 235, .12);
  transform: rotate(var(--tilt));
  animation: layer-pop .65s ease both;
  animation-delay: var(--delay);
}

@keyframes layer-pop {
  from {
    opacity: 0;
    transform: translateY(12px) rotate(var(--tilt, -1deg));
  }
  to {
    opacity: 1;
    transform: translateY(0) rotate(var(--tilt, -1deg));
  }
}
```

HTML 예시:

```html
<div class="motion-card" style="--delay: .08s; --tilt: -1deg;">Prompt</div>
<div class="motion-card" style="--delay: .16s; --tilt: 1deg;">Context</div>
<div class="motion-card" style="--delay: .24s; --tilt: -1deg;">Skill</div>
```

사용 지침:

- 새 슬라이드에서 가장 기본 등장 효과로 사용한다.
- 카드가 여러 개면 `.08s`, `.16s`, `.24s`처럼 stagger delay를 준다.
- 이미 `transform`을 쓰는 요소에는 keyframe 내부 transform과 충돌하지 않게 `--tilt` 방식으로 통합한다.

### 2. `reasoning-pop`

용도: 절차 단계나 사고 과정 노드를 가운데 기준으로 등장시킨다.

동작: `translate(-50%, calc(-50% + 12px)) -> translate(-50%, -50%)`.

CSS 예시:

```css
.reasoning-step {
  position: absolute;
  left: var(--left, 50%);
  top: 50%;
  transform: translate(-50%, -50%);
  animation: reasoning-pop .65s ease both;
  animation-delay: var(--delay, 0s);
}

@keyframes reasoning-pop {
  from {
    opacity: 0;
    transform: translate(-50%, calc(-50% + 12px));
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
}
```

HTML 예시:

```html
<div class="reasoning-step" style="--left: 30%; --delay: .10s;">Read</div>
<div class="reasoning-step" style="--left: 50%; --delay: .20s;">Plan</div>
<div class="reasoning-step" style="--left: 70%; --delay: .30s;">Verify</div>
```

사용 지침:

- `left/top`으로 배치하는 absolute 노드에 적합하다.
- 일반 카드에는 `layer-pop`을 쓰고, 중앙 기준 위치 보존이 필요할 때만 이 모션을 쓴다.

### 3. `line-grow`

용도: 연결선이 왼쪽에서 오른쪽으로 그려지는 효과.

동작: `scaleX(0) -> scaleX(1)`, `opacity: 0 -> 1`.

CSS 예시:

```css
.connector-line {
  height: 4px;
  background: var(--accent);
  border-radius: 999px;
  transform-origin: left center;
  animation: line-grow .7s ease both;
  animation-delay: var(--delay, 0s);
}

@keyframes line-grow {
  from {
    opacity: 0;
    transform: scaleX(0);
  }
  to {
    opacity: 1;
    transform: scaleX(1);
  }
}
```

HTML 예시:

```html
<div class="connector-line" style="--delay: .18s;"></div>
```

사용 지침:

- 반드시 `transform-origin: left center`를 둔다.
- 세로선이나 대각선에는 그대로 쓰지 말고 별도 keyframe을 만들거나 부모를 회전시킨다.

### 4. `connector-pulse`

용도: 이미 그려진 연결선을 반복적으로 강조한다.

동작: opacity가 `.55 -> 1 -> .55`로 반복된다.

CSS 예시:

```css
.connector-line.is-live {
  animation:
    line-grow .7s ease both,
    connector-pulse 2.8s ease-in-out infinite;
  animation-delay: var(--delay, 0s), calc(var(--delay, 0s) + .7s);
}

@keyframes connector-pulse {
  0%, 100% {
    opacity: .55;
  }
  50% {
    opacity: 1;
  }
}
```

사용 지침:

- `line-grow` 뒤에 이어 붙여 쓰면 "먼저 선이 생기고, 그 다음 살아있는 연결처럼 pulsing"된다.
- 너무 많은 선에 동시에 쓰면 화면이 산만해진다. 핵심 연결선에만 쓴다.

### 5. `dashed-flow`

용도: 세로 점선 배경이 흐르는 효과.

동작: `background-position`이 아래 방향으로 이동한다.

CSS 예시:

```css
.flow-spine {
  width: 4px;
  border-radius: 999px;
  background: repeating-linear-gradient(
    to bottom,
    var(--line) 0 14px,
    transparent 14px 28px
  );
  opacity: .22;
  animation: dashed-flow 2.8s linear infinite;
}

@keyframes dashed-flow {
  to {
    background-position: 0 28px;
  }
}
```

사용 지침:

- 레이어 맵, 세로 플로우, 프로세스 축에 쓴다.
- `background-position` 기반이라 layout shift가 없다.

### 6. `funnel-flow`

용도: funnel 또는 pipeline 내부의 흐름을 표현한다.

동작: `background-position`이 `64px`만큼 이동한다.

CSS 예시:

```css
.context-funnel {
  background: repeating-linear-gradient(
    to bottom,
    rgba(37, 99, 235, .16) 0 16px,
    transparent 16px 32px
  );
  animation: funnel-flow 3.4s linear infinite;
}

@keyframes funnel-flow {
  to {
    background-position: 0 64px;
  }
}
```

사용 지침:

- 정보가 아래로 흘러가거나 좁혀지는 시각화에 쓴다.
- 점선 흐름보다 큰 면적의 흐름을 보여줄 때 적합하다.

### 7. `soft-pulse`

용도: 카드, 중심 노드, 완료 배지 같은 강조 요소가 부드럽게 살아있는 느낌을 준다.

동작: `box-shadow` 크기와 투명도가 커졌다 줄어든다.

CSS 예시:

```css
.pulse-card {
  box-shadow: 8px 8px 0 rgba(37, 99, 235, .12);
  animation: soft-pulse 3.6s ease-in-out infinite;
}

@keyframes soft-pulse {
  0%, 100% {
    box-shadow: 8px 8px 0 rgba(37, 99, 235, .12);
  }
  50% {
    box-shadow: 12px 12px 0 rgba(37, 99, 235, .20);
  }
}
```

사용 지침:

- "이것이 핵심"인 요소 하나 또는 둘에만 쓴다.
- layout에는 영향을 주지 않지만, 그림자가 커지므로 주변 여백이 너무 좁으면 잘려 보일 수 있다.

### 8. `gate-check`

용도: 검증 게이트 카드의 테두리를 주기적으로 강조한다.

동작: `border-color`가 `var(--line)`과 `var(--accent)` 사이를 오간다.

CSS 예시:

```css
.eval-gate {
  border: 3px solid var(--line);
  animation:
    layer-pop .65s ease both,
    gate-check 4.4s ease-in-out infinite;
  animation-delay: var(--delay, 0s);
}

@keyframes gate-check {
  0%, 100% {
    border-color: var(--line);
  }
  50% {
    border-color: var(--accent);
  }
}
```

사용 지침:

- QA, test, review, approval 같은 통과/차단 의미가 있는 요소에 적합하다.
- 일반 카드 강조에는 `soft-pulse`가 더 자연스럽다.

### 9. `rail-glow`

용도: 배경 레일 또는 경로를 희미하게 밝히는 효과.

동작: opacity가 `.16 -> .34 -> .16`으로 반복된다.

CSS 예시:

```css
.rail-highlight {
  opacity: .16;
  animation: rail-glow 3s ease-in-out infinite;
}

@keyframes rail-glow {
  0%, 100% {
    opacity: .16;
  }
  50% {
    opacity: .34;
  }
}
```

사용 지침:

- 주인공이 아닌 배경 구조에 쓴다.
- 텍스트나 카드 전체에 적용하지 않는다. 읽기 대비가 흔들릴 수 있다.

### 10. `guard-focus`

용도: 특정 guardrail 또는 체크포인트가 잠깐 나타났다가 사라지는 효과.

동작: 대부분 시간은 숨고, 중간 구간에서 opacity와 scale이 올라온다.

CSS 예시:

```css
.guard-focus {
  animation: guard-focus 5s ease-in-out infinite;
  animation-delay: calc(var(--delay, 0s) + .8s);
}

@keyframes guard-focus {
  0%, 20%, 100% {
    opacity: 0;
    transform: scale(.96);
  }
  42%, 58% {
    opacity: 1;
    transform: scale(1);
  }
}
```

사용 지침:

- 한 화면에서 순차적으로 강조되는 guardrail에 쓴다.
- 중요한 텍스트 자체를 이 모션으로 숨기면 안 된다. 장식/보조 표시용으로만 쓴다.

### 11. `folder-breathe`

용도: 폴더나 컨테이너가 가볍게 떠 있는 느낌을 준다.

동작: `translateY(0) -> translateY(-5px) -> 0`.

CSS 예시:

```css
.folder-body {
  animation: folder-breathe 4.2s ease-in-out infinite;
}

@keyframes folder-breathe {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}
```

사용 지침:

- 큰 묶음 요소 하나에만 적용한다.
- 내부 항목은 `layer-pop`으로 순차 등장시키면 잘 맞는다.

### 12. `arrow-nudge`

용도: 방향 전환이나 before/after 흐름을 보여주는 화살표.

동작: `translateX(0) -> translateX(8px) -> 0`.

CSS 예시:

```css
.example-arrow {
  color: var(--accent);
  animation: arrow-nudge 1.8s ease-in-out infinite;
}

@keyframes arrow-nudge {
  0%, 100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(8px);
  }
}
```

사용 지침:

- "A에서 B로"를 보여주는 화살표에 쓴다.
- 화살표 텍스트가 버튼처럼 보이면 안 된다. 클릭 요소에는 별도 interaction style이 필요하다.

### 13. `cloud-drift`

용도: 생각, 추론, 불확실성 같은 보조 개념을 떠다니게 표현한다.

동작: `translateY`와 `rotate`가 작게 변한다.

CSS 예시:

```css
.thought-cloud {
  border: 3px dashed var(--line);
  border-radius: 50%;
  animation: cloud-drift 3.6s ease-in-out infinite;
}

@keyframes cloud-drift {
  0%, 100% {
    transform: translateY(0) rotate(-1deg);
  }
  50% {
    transform: translateY(-6px) rotate(1deg);
  }
}
```

사용 지침:

- 보조 시각 요소에만 사용한다.
- 주요 제목이나 본문 텍스트에는 쓰지 않는다.

### 14. `tick-pop`

용도: 체크 표시 또는 작은 상태 표시가 튀어 오르는 느낌.

동작: `translateY(0) -> translateY(-6px) -> 0`.

CSS 예시:

```css
.schedule-tick {
  animation: tick-pop 2.8s ease-in-out infinite;
}

@keyframes tick-pop {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}
```

사용 지침:

- 작은 아이콘, 체크, tick mark에 적합하다.
- 큰 카드에는 `folder-breathe`나 `soft-pulse`가 더 안정적이다.

### 15. `slow-spin`

용도: 루프 다이어그램의 외곽 링을 천천히 회전시킨다.

동작: `rotate(360deg)`.

CSS 예시:

```css
.loop-ring::before {
  content: "";
  position: absolute;
  inset: -4px;
  border: 4px dashed var(--accent);
  border-radius: 50%;
  opacity: .28;
  animation: slow-spin 18s linear infinite;
}

@keyframes slow-spin {
  to {
    transform: rotate(360deg);
  }
}
```

사용 지침:

- 매우 느리게 둔다. 빠른 회전은 강의 슬라이드에서 산만하다.
- decorative ring에만 적용하고, 읽어야 하는 텍스트에는 직접 적용하지 않는다.

### 16. `orbit-upright`

용도: 원 궤도 위에서 요소가 돌지만, 내부 텍스트는 똑바로 보이게 한다.

동작: 부모를 회전시키고, 마지막 rotate로 방향을 반대로 보정한다.

CSS 예시:

```css
.loop-item {
  --orbit-radius: 150px;
  --start: 0deg;
  --end: 360deg;
  --counter-start: 0deg;
  --counter-end: -360deg;
  position: absolute;
  left: 50%;
  top: 50%;
  animation: orbit-upright 18s linear infinite;
}

@keyframes orbit-upright {
  from {
    transform: rotate(var(--start)) translateX(var(--orbit-radius)) rotate(var(--counter-start));
  }
  to {
    transform: rotate(var(--end)) translateX(var(--orbit-radius)) rotate(var(--counter-end));
  }
}
```

HTML 예시:

```html
<div class="loop-ring">
  <div class="loop-item" style="--start: 0deg; --end: 360deg; --counter-start: 0deg; --counter-end: -360deg;">
    <span>Plan</span>
  </div>
  <div class="loop-item" style="--start: 120deg; --end: 480deg; --counter-start: -120deg; --counter-end: -480deg;">
    <span>Edit</span>
  </div>
  <div class="loop-item" style="--start: 240deg; --end: 600deg; --counter-start: -240deg; --counter-end: -600deg;">
    <span>Verify</span>
  </div>
</div>
```

사용 지침:

- `--start`와 `--counter-start`는 반대값이어야 한다.
- `--end`와 `--counter-end`도 반대값이어야 텍스트가 뒤집히지 않는다.
- 궤도 반경은 `--orbit-radius`로 조정한다.

## 새 슬라이드에 모션을 넣는 기본 패턴

### 1. HTML 구조

```html
<section class="slide">
  <div class="visual motion-diagram">
    <div class="motion-card" style="--delay: .08s; --tilt: -1deg;">Input</div>
    <div class="connector-line is-live" style="--delay: .16s;"></div>
    <div class="motion-card pulse-card" style="--delay: .24s; --tilt: 1deg;">Gate</div>
  </div>
</section>
```

### 2. CSS 구조

```css
.motion-diagram {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 72px 1fr;
  align-items: center;
  gap: 18px;
}

.motion-card {
  --tilt: -1deg;
  border: 3px solid var(--line);
  border-radius: var(--radius);
  background: var(--surface);
  box-shadow: 8px 8px 0 rgba(37, 99, 235, .12);
  transform: rotate(var(--tilt));
  animation: layer-pop .65s ease both;
  animation-delay: var(--delay, 0s);
}

.connector-line {
  height: 4px;
  border-radius: 999px;
  background: var(--accent);
  transform-origin: left center;
}

.connector-line.is-live {
  animation:
    line-grow .7s ease both,
    connector-pulse 2.8s ease-in-out infinite;
  animation-delay: var(--delay, 0s), calc(var(--delay, 0s) + .7s);
}

.pulse-card {
  animation:
    layer-pop .65s ease both,
    soft-pulse 3.6s ease-in-out infinite;
  animation-delay: var(--delay, 0s), calc(var(--delay, 0s) + .8s);
}
```

### 3. 접근성 처리

새로 만든 animated class를 reduced-motion 블록에 추가한다.

```css
@media (prefers-reduced-motion: reduce) {
  .motion-card,
  .connector-line,
  .pulse-card {
    animation: none;
  }
}
```

## 다른 LLM에게 줄 작업 프롬프트

아래 프롬프트를 그대로 붙여 넣으면 이 프로젝트의 모션 스타일을 유지한 새 시각 요소를 만들게 할 수 있다.

```text
이 프로젝트의 CSS 모션은 순수 CSS @keyframes 기반이다. 외부 라이브러리, JS 애니메이션, transition 기반 인터랙션을 추가하지 말라.

기존 스타일 기준:
- 등장 효과는 layer-pop을 기본으로 사용한다.
- absolute 중앙 배치 노드는 reasoning-pop을 사용한다.
- 연결선은 line-grow로 먼저 그리고, 필요하면 connector-pulse를 두 번째 animation으로 붙인다.
- 핵심 카드 강조는 soft-pulse를 사용한다.
- 검증/승인 게이트는 gate-check를 사용한다.
- 흐름 축은 dashed-flow 또는 funnel-flow를 사용한다.
- 루프 다이어그램은 slow-spin과 orbit-upright를 사용한다.
- 여러 요소가 순서대로 등장하면 --delay를 .08s 단위로 늘린다.
- 손그림 카드 기울기는 --tilt로 제어한다.
- 모든 새 animated class는 @media (prefers-reduced-motion: reduce)에 추가한다.

새 모션을 만들기 전에 기존 keyframes로 해결 가능한지 먼저 판단하라. 새 keyframes는 기존 16개로 표현할 수 없을 때만 추가하라.

산출물에는 다음을 포함하라:
1. HTML 예시
2. CSS 예시
3. 어떤 기존 keyframes를 썼는지
4. prefers-reduced-motion에 추가할 selector
5. 왜 이 모션이 슬라이드 메시지를 돕는지 한 문장
```

## LLM이 자주 틀리는 부분

- `transform`을 이미 쓰는 요소에 새 `transform` animation을 덮어써서 위치가 깨진다. 해결: `--tilt`, `translate(-50%, -50%)`처럼 기존 transform 구조를 keyframe 안에 포함한다.
- 반복 애니메이션을 너무 빠르게 만든다. 해결: 강조는 3초 이상, 루프는 15초 이상으로 둔다.
- 모든 카드에 `soft-pulse`를 붙인다. 해결: 한 화면에서 핵심 요소 1-2개만 pulse한다.
- `prefers-reduced-motion` 처리를 빼먹는다. 해결: 새 animated selector를 reduced-motion 블록에 반드시 추가한다.
- 텍스트 자체를 깜빡이거나 숨긴다. 해결: 텍스트는 항상 읽을 수 있게 두고, 주변 선/그림자/배경만 움직인다.

## 빠른 선택 가이드

| 만들고 싶은 효과 | 사용할 모션 |
| --- | --- |
| 카드가 등장 | `layer-pop` |
| 중앙 기준 노드가 등장 | `reasoning-pop` |
| 선이 그려짐 | `line-grow` |
| 연결선이 살아있는 느낌 | `connector-pulse` |
| 점선 흐름 | `dashed-flow` |
| 넓은 funnel 흐름 | `funnel-flow` |
| 핵심 카드 강조 | `soft-pulse` |
| 검증 게이트 강조 | `gate-check` |
| 배경 레일 강조 | `rail-glow` |
| 체크포인트 focus | `guard-focus` |
| 폴더/묶음이 떠 있음 | `folder-breathe` |
| 화살표 방향 유도 | `arrow-nudge` |
| 생각 구름 drift | `cloud-drift` |
| 작은 체크 pop | `tick-pop` |
| 루프 링 회전 | `slow-spin` |
| 아이템 궤도 회전 | `orbit-upright` |

