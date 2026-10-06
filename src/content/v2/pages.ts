/** Copy for the /v2 record, index, article, and topic pages. */

export const v2Record = {
  crumbs: { home: 'Record', projects: 'Projects', writing: 'Writing', topics: 'Topics' },
  review: {
    label: 'Review',
    text: 'This entry is still in editorial review. It renders here for local checking only and never appears in an index.',
  },
  answer: {
    heading: { text: 'In plain terms', emphasis: 'plain' },
    labels: { what: 'What it is', problem: 'The problem', how: 'How it works', role: 'Rami’s role' },
  },
  procedure: { heading: { text: 'How it works', emphasis: 'works' } },
  limits: { heading: 'Known limits', item: 'Limit' },
  readings: { heading: { text: 'What was measured', emphasis: 'measured' } },
  figures: { heading: { text: 'The figures', emphasis: 'figures' } },
  evidence: {
    heading: { text: 'Evidence and links', emphasis: 'links' },
    note: 'Where every claim on this page can be checked.',
  },
  related: {
    heading: { text: 'See also', emphasis: 'also' },
    note: 'The field note and the methods this entry is filed under.',
    noteKind: 'Field note',
    projectKind: 'Entry',
    topicKind: 'Method',
  },
  continue: { aria: 'Continue through the record', prev: 'Previous entry', next: 'Next entry', prevNote: 'Previous note', nextNote: 'Next note' },
  actions: { note: 'Read the field note', source: 'Evidence' },
  figureLabel: 'Fig.',
}

export const v2Index = {
  projects: {
    title: { text: 'Contents of the record', emphasis: 'record' },
    metaTitle: 'Projects — Rami Kronbi (v2 preview)',
    metaDescription:
      'Every ready entry in Rami Kronbi’s engineering record: what each system is, how it works, what it does not do, and where to check.',
    lede: 'Each entry names what was built, how it works, what it does not do, and where the evidence is.',
    countLabel: 'entries',
  },
  writing: {
    title: { text: 'Field notes', emphasis: 'notes' },
    metaTitle: 'Writing — Rami Kronbi (v2 preview)',
    metaDescription:
      'Technical field notes by Rami Kronbi on how the systems in his engineering record were built, measured, and limited.',
    lede: 'The technical notes behind the entries in the record: decisions, failures, and what was measured.',
    countLabel: 'notes',
  },
  topics: {
    title: { text: 'Index of methods', emphasis: 'methods' },
    metaTitle: 'Topics — Rami Kronbi (v2 preview)',
    metaDescription:
      'The methods Rami Kronbi’s engineering record is filed under, from computer vision and embedded systems to control and civic technology.',
    lede: 'Every entry and note is filed under the methods it uses. Throw the tags around; they always settle back into the index.',
    listHeading: { text: 'Every method', emphasis: 'method' },
    counts: (projects: number, notes: number) =>
      `${projects} ${projects === 1 ? 'entry' : 'entries'} · ${notes} ${notes === 1 ? 'note' : 'notes'}`,
  },
  filter: {
    label: 'Filter by method',
    all: 'All',
    unmatched: (topic: string) => `Not filed under ${topic}`,
    status: (shown: number, topic: string) => `${shown} filed under ${topic}`,
  },
}

export const v2Article = {
  margin: { contents: 'On this page', project: 'Entry', evidence: 'Evidence' },
  evidenceSummary: 'Evidence',
  related: {
    heading: { text: 'See also', emphasis: 'also' },
    note: 'The entry this note belongs to and the methods it is filed under.',
  },
}

export const v2Topic = {
  questions: { heading: { text: 'What this index connects', emphasis: 'connects' } },
  projects: { heading: { text: 'Entries filed here', emphasis: 'here' } },
  notes: { heading: { text: 'Notes filed here', emphasis: 'here' } },
  questionLabel: 'Q',
}
