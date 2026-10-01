# CEO Bench live demo · interactive prototype v2

Follows the 14-scene v2 storyboard: create a task, evaluate a baseline agent, grade it, train, run the trained agent, re-evaluate, recap.

Run from the folder above this one (so the narrative link resolves), then open http://127.0.0.1:8770/prototype/

```sh
python3 -m http.server 8770 --bind 127.0.0.1
```

- `content.js` holds all step titles, narration, and facilitator notes. Edit copy there.
- `data.js` holds the 4 pod packets, reference answers, rubrics, and agent attempts.
- Arrow keys change steps. Work is saved in this browser only.
- The narrative (what to say, do, and disclose per step) is a separate page that reads `content.js`. Open a step directly with `#step-9`.

Everything is a rehearsal fixture. Packets, agent attempts, the training curve, and scores are authored; no model is called. There is no backend: pods share one browser.

Check with `node verify.cjs`.
