# lecture-cuts story flow map

Purpose: keep the 4-hour workshop ordered from learner pain to basic control, then to the complete harness.

## Flow Principle

The deck should not open with the full solution map. Learners first need to recognize the practical failure mode: AI is capable but inconsistent. After the failure patterns are concrete, the deck introduces the workshop "workbench" and then walks from the innermost control layer to the full operating workflow.

## Current Story Order

1. **Opening / Problem**: Slide 01-03  
   Establish that the workshop is about stable work environments, not magic prompts.
2. **Failure Patterns**: Slide 04-09  
   Show predictable failures and the minimum work line before naming the full harness.
3. **Whole Map**: Slide 10-12  
   Present the workbench map, responsibility/failure mapping, and frequency/risk promotion criteria after learners feel the need.
4. **Spec / Prompt**: Slide 13-21  
   Start with the smallest control surface: contract, request shape, input boundaries, and reasoning strength.
5. **Context / Memory**: Slide 22-25  
   Separate always-on project guidance from current-task context.
6. **Skills / Superpowers**: Slide 26-31  
   Move repeated procedures into reusable manuals and workflow discipline.
7. **Agents / Tools**: Slide 32-39  
   Split roles, context, permissions, and external systems.
8. **Hooks / Verification**: Slide 40-47  
   Turn important checks from advice into execution, evidence, and looped repair.
9. **Final Workflow**: Slide 48-56  
   Assemble the full deck automation harness and write handoff/action plans.

## Editing Notes

- Keep `lecture-cuts/assets/slides.js` as the canonical presentation order.
- If a slide moves across a story boundary, update both its speaker script and its visible `div.note`.
- Compression pass 2 has been applied:
  - Persona and few-shot standalone prompt slides were removed from Spec/Prompt because their durable versions are covered by Subagent/Skill/Final Workflow.
  - The separate layer-map slide has been absorbed into the workbench-preview slide.
  - Failure-to-harness mapping is now one whole-map slide placed after layer responsibility.
  - Repeated concept/detail pairs have been compressed across Spec, Persona, Context, Skills, Agents/Tools, Hooks, Evaluation, and Handoff.
  - Parallel safe/risky comparison is now one comparison slide.
  - Hook event/command/result is now one pipeline slide.
