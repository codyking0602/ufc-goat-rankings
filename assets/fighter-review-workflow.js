window.FIGHTER_REVIEW_WORKFLOW = {
  meta: {
    title: "Locked Fighter Review Workflow",
    status: "Use this process for every UFC GOAT fighter audit before live insertion.",
    updated: "2026-06-30"
  },
  steps: [
    {
      order: 1,
      name: "Scoring review first",
      rule: "Use the locked review-card format. Do not skip to compare copy until scoring inputs are locked."
    },
    {
      order: 2,
      name: "Lock disputed inputs",
      rule: "Cody locks fact-based inputs only: prime window, loss penalty, title wins, opponent credit, division multiplier, round totals, finish rate, elite years. No manual moving."
    },
    {
      order: 3,
      name: "Recalculate card",
      rule: "After inputs are locked, recalculate prime rounds won, prime finish rate, times finished in prime, active elite years if needed, loss penalty, final score, and rank impact."
    },
    {
      order: 4,
      name: "Comparison profile",
      rule: "Only after scoring is locked, write debate-ready compare-mode profile language. Do not say the model punishes a fighter. Explain the resume naturally."
    },
    {
      order: 5,
      name: "Matchup blurbs",
      rule: "Add matchup blurbs against nearby/relevant fighters. Keep them natural and objective."
    },
    {
      order: 6,
      name: "App/repo update",
      rule: "Only after scoring card, compare profile, and matchup blurbs are complete should files be updated for live use."
    }
  ],
  lockedReviewCardTemplate: {
    header: "Added / Reviewing Fighter Name",
    scoreLine: "Fighter Name score: XX.XX",
    currentRankLine: "Current rank: #X, between Fighter A and Fighter B.",
    tableRows: [
      "UFC record",
      "Adjusted title wins",
      "Division-adjusted opponent quality",
      "Prime rounds won",
      "Prime finish rate",
      "Times finished in prime",
      "Active elite years",
      "Loss penalty",
      "Final score"
    ],
    requiredSections: [
      "Short source/validation paragraph",
      "Division strength used",
      "Big assumptions",
      "Why not ranked higher"
    ],
    banned: [
      "Final call section",
      "Manual move up/down recommendation",
      "Subjective override language",
      "The model punishes him",
      "Placeholder values like need sheet loaded when doing the review card"
    ]
  },
  reminderRules: [
    "If Cody skips ahead before the scoring card is locked, say: We haven’t locked the scoring card yet.",
    "If scoring is locked but compare-mode writing is not done, say: Scoring is locked, but compare-mode writing is not done yet.",
    "If compare copy is done but matchup blurbs are not complete, say: Compare copy is done, but we haven’t added matchup blurbs yet.",
    "If a requested card lacks exact source values, get the source first instead of filling placeholders."
  ]
};
