// Move existing sections only while printing. The approved screen DOM and
// disclosure state are restored when the print dialog closes (including cancel).
export function installPrintLayout() {
  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = '/print.css';
  stylesheet.media = 'print';
  document.head.appendChild(stylesheet);
  let active;
  const media = window.matchMedia('print');

  function prepare() {
    if (active) return;
    const resume = document.getElementById('resumeContent');
    if (!resume) return;
    const columns = document.createElement('div');
    columns.className = 'print-columns';
    const left = document.createElement('div');
    left.className = 'print-left-column';
    const right = document.createElement('div');
    right.className = 'print-right-column';
    columns.append(left, right);
    const positions = [];
    const roles = [...resume.querySelectorAll('.experience-item')];
    function moveNode(node, parent) {
      if (!node) return;
      const marker = document.createComment('print section position');
      node.before(marker);
      positions.push([node, marker]);
      parent.appendChild(node);
    }
    function move(selector, parent) {
      moveNode(resume.querySelector(selector), parent);
    }
    const history = resume.querySelector('.career-history');
    active = { columns, positions, history, historyWasOpen: history?.open };
    move('.education-section', left);
    move('.experience-section', left);
    for (const selector of [
      '.profile-section',
      '.findme-section',
      '.skills-section',
      '.languages-section',
      '.interests-section',
    ])
      move(selector, right);
    resume.appendChild(columns);
    // Keep the classic first page and use both columns for the career continuation,
    // instead of leaving an empty right column across a third page.
    const earlier = roles.slice(1);
    if (earlier.length) {
      const continuation = document.createElement('div');
      continuation.className = 'print-continuation';
      const title = document.createElement('h2');
      title.className = 'section-title';
      title.textContent =
        resume.querySelector('#experience-title').textContent +
        (document.documentElement.lang === 'es' ? ' (continuación)' : ' (continued)');
      const continuedColumns = document.createElement('div');
      continuedColumns.className = 'print-columns';
      const continuedLeft = document.createElement('div');
      continuedLeft.className = 'print-left-column';
      const continuedRight = document.createElement('div');
      continuedRight.className = 'print-left-column';
      continuedColumns.append(continuedLeft, continuedRight);
      continuation.append(title, continuedColumns);
      const split = Math.ceil(earlier.length / 2);
      earlier.forEach((node, index) =>
        moveNode(node, index < split ? continuedLeft : continuedRight)
      );
      move('.certification-section', continuedRight);
      resume.appendChild(continuation);
      active.continuation = continuation;
    } else move('.certification-section', right);
    if (history) history.open = true;
  }

  function restore() {
    if (!active) return;
    for (const [node, marker] of active.positions) marker.replaceWith(node);
    if (active.history) active.history.open = active.historyWasOpen;
    active.columns.remove();
    active.continuation?.remove();
    active = undefined;
  }
  window.addEventListener('beforeprint', prepare);
  window.addEventListener('afterprint', restore);
  media.addEventListener('change', (event) => (event.matches ? prepare() : restore()));
}
