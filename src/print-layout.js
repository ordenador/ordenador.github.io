// Move existing sections only while printing. The approved screen DOM and
// disclosure state are restored when the print dialog closes (including cancel).
export function installPrintLayout() {
  const stylesheet = document.querySelector('link[href="/print.css"]');
  // Vite adds the main bundle's stylesheet after template links. Keep the paper
  // overrides last without fetching a duplicate or affecting screen styles.
  if (stylesheet) document.head.appendChild(stylesheet);
  let active;
  const media = window.matchMedia('print');

  function prepare() {
    if (active) return;
    const resume = document.getElementById('resumeContent');
    if (!resume || !stylesheet?.sheet) return;
    // Chromium fires native beforeprint before matchMedia('print') becomes true.
    // Temporarily activate the same media-gated stylesheet for synchronous paper
    // measurements. afterprint returns it to print-only, including cancellation.
    stylesheet.media = 'all';
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
      if (positions.some(([existing]) => existing === node)) {
        parent.appendChild(node);
        return;
      }
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
    // Measure at the paper width declared by print.css, independently of the
    // screen viewport. A4 minus the two 16 mm margins leaves 265 mm in height.
    const pxPerMm = columns.getBoundingClientRect().width / 178;
    const pageHeight = 265 * pxPerMm;
    const career = resume.querySelector('.experience-section');
    const roleParent = roles[0]?.parentElement;
    const earlier = roles.slice(1);
    const continuation = document.createElement('div');
    continuation.className = 'print-continuation';
    const continuedColumns = document.createElement('div');
    continuedColumns.className = 'print-columns';
    const continuedLeft = document.createElement('div');
    const continuedRight = document.createElement('div');
    continuedLeft.className = continuedRight.className = 'print-left-column';
    const titleText = resume.querySelector('#experience-title').textContent;
    for (const column of [continuedLeft, continuedRight]) {
      const title = document.createElement('h2');
      title.className = 'section-title';
      title.textContent = titleText;
      column.appendChild(title);
    }
    continuedColumns.append(continuedLeft, continuedRight);
    continuation.appendChild(continuedColumns);
    resume.appendChild(continuation);
    active.continuation = continuation;
    earlier.forEach((node) => moveNode(node, continuedLeft));
    move('.certification-section', continuedRight);
    // Fill the first career column only with whole entries that actually fit.
    // Leave a small safety allowance for Chromium's page fragmentation rounding.
    for (const node of earlier) {
      roleParent.appendChild(node);
      const bottom = career.getBoundingClientRect().bottom - resume.getBoundingClientRect().top;
      if (bottom > pageHeight - 8) {
        continuedLeft.appendChild(node);
        break;
      }
    }
    // The shorter supporting column can carry the next chronological role.
    // Move compact secondary sections to the continuation before measuring it.
    for (const selector of ['.languages-section', '.interests-section'])
      move(selector, continuedRight);
    const firstRightCareer = document.createElement('section');
    firstRightCareer.className = 'print-first-career';
    const rightTitle = continuedLeft.firstElementChild.cloneNode(true);
    firstRightCareer.appendChild(rightTitle);
    right.appendChild(firstRightCareer);
    for (const node of earlier.filter((entry) => !career.contains(entry))) {
      firstRightCareer.appendChild(node);
      const bottom =
        firstRightCareer.getBoundingClientRect().bottom - resume.getBoundingClientRect().top;
      if (bottom > pageHeight - 8) {
        continuedLeft.appendChild(node);
        break;
      }
    }
    if (firstRightCareer.children.length === 1) firstRightCareer.remove();
    const interests = resume.querySelector('.interests-section');
    if (interests) {
      right.appendChild(interests);
      if (
        right.getBoundingClientRect().bottom - resume.getBoundingClientRect().top >
        pageHeight - 8
      )
        continuedRight.appendChild(interests);
    }
    const remaining = earlier.filter(
      (node) => !career.contains(node) && !firstRightCareer.contains(node)
    );
    let bestSplit = 0;
    let bestHeight = Infinity;
    // Preserve career reading order, balancing measured block heights rather
    // than a fixed job count. Certification space participates in that balance.
    for (let split = 0; split <= remaining.length; split++) {
      remaining.forEach((node, index) => {
        const column = index < split ? continuedLeft : continuedRight;
        column.insertBefore(node, column.querySelector('section'));
      });
      const height = Math.max(
        continuedLeft.getBoundingClientRect().height,
        continuedRight.getBoundingClientRect().height
      );
      if (height < bestHeight) {
        bestHeight = height;
        bestSplit = split;
      }
    }
    remaining.forEach((node, index) => {
      const column = index < bestSplit ? continuedLeft : continuedRight;
      column.insertBefore(node, column.querySelector('section'));
    });
    if (history) history.open = true;
  }

  function restore() {
    if (!active) return;
    for (const [node, marker] of active.positions) marker.replaceWith(node);
    if (active.history) active.history.open = active.historyWasOpen;
    active.columns.remove();
    active.continuation?.remove();
    active = undefined;
    stylesheet.media = 'print';
  }
  window.addEventListener('beforeprint', prepare);
  window.addEventListener('afterprint', restore);
  media.addEventListener('change', (event) => (event.matches ? prepare() : restore()));
}
