# KimAI Image Prompt Template

새 김아이 이미지를 만들 때 아래 블록을 기본 프롬프트 앞부분에 붙입니다.

## Base Identity Block

```text
Use the project-local KimAI character reference.
KimAI is a cute Korean office AI assistant and new employee, drawn in a flat hand-drawn lecture-slide style.
Keep the character consistent with these fixed features: round childlike face, short white hair with one upward curl, large black oval eyes, tiny mouth, pale blue cheek circles, white collared shirt, bright blue necktie, small rectangular name badge, over-ear headset on the right side, slim antenna with a small ball tip, friendly professional expression.
Style: white background, thick rounded black linework, clean minimal shapes, one blue accent color #2563eb, no gradients, no 3D rendering, no complex background, no realistic human skin texture.
```

## Scene Block

```text
Scene: <describe the slide scene in one sentence>.
KimAI action: <typing / pointing / holding checklist / organizing documents / presenting / thinking>.
Props: <laptop / document stack / clipboard / board / plant / mug>, kept large and simple.
Composition: one clear focal action, generous white space, no more than three main props.
```

## Text Safety Block

```text
Do not put important Korean or English text inside the image.
Use blank cards, blank boards, simple document lines, or icon-like marks instead.
Leave large clean empty areas where exact slide text can be added later in HTML or by local text compositing.
No labels, no numbers, no watermark, no tiny text.
```

## Avoid Block

```text
Avoid: metal robot, futuristic city, neon, dark theme, mascot animal ears, extra characters, busy UI screens, code screens, real company logos, tiny unreadable documents, cropped hands, cropped antenna, missing headset, missing blue tie.
```

## Full Prompt Example

```text
Use the project-local KimAI character reference.
KimAI is a cute Korean office AI assistant and new employee, drawn in a flat hand-drawn lecture-slide style.
Keep the character consistent with these fixed features: round childlike face, short white hair with one upward curl, large black oval eyes, tiny mouth, pale blue cheek circles, white collared shirt, bright blue necktie, small rectangular name badge, over-ear headset on the right side, slim antenna with a small ball tip, friendly professional expression.
Style: white background, thick rounded black linework, clean minimal shapes, one blue accent color #2563eb, no gradients, no 3D rendering, no complex background, no realistic human skin texture.

Scene: KimAI sits at a clean desk and sorts three stacks of work material before starting a task.
KimAI action: organizing documents on the desk while looking focused and helpful.
Props: laptop with a simple blue robot-face icon, three document stacks, one checklist clipboard.
Composition: one clear focal action, generous white space, no more than three main props.

Do not put important Korean or English text inside the image.
Use blank cards, blank boards, simple document lines, or icon-like marks instead.
Leave large clean empty areas where exact slide text can be added later in HTML or by local text compositing.
No labels, no numbers, no watermark, no tiny text.

Avoid: metal robot, futuristic city, neon, dark theme, mascot animal ears, extra characters, busy UI screens, code screens, real company logos, tiny unreadable documents, cropped hands, cropped antenna, missing headset, missing blue tie.
```

## Using The Reference Images

When the image tool supports image references, attach these files as visual references:

1. `kimai-turnaround-reference.png` for body/headset consistency.
2. `kimai-expression-accessory-reference.png` for face, expression, and props.
3. `kimai-pose-reference.png` for slide-ready work poses.

When the tool does not support direct local image references, paste the Base Identity Block and inspect the reference images manually before accepting the output.
