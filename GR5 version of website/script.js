// data model with detailed metrics for each word
const words = [
  {
    title: 'Tuff',
    meaning: 'Used to call something cool',
    age: 'teens',
    metrics: { definitionHelp: 92, usageHelp: 90, ageTagAccuracy: 88 },
    comments: 421,
    rank: 1
  },
  {
    title: 'Fire',
    meaning: 'Something thats exciting or great',
    age: 'teens',
    metrics: { definitionHelp: 90, usageHelp: 85, ageTagAccuracy: 80 },
    comments: 365,
    rank: 2
  },
  {
    title: 'Drip',
    meaning: 'Clothes that look nice',
    age: 'teens',
    metrics: { definitionHelp: 85, usageHelp: 75, ageTagAccuracy: 80 },
    comments: 298,
    rank: 3
  },
  {
    title: 'Snaking',
    meaning: "Going behind someone's back",
    age: 'teens',
    metrics: { definitionHelp: 80, usageHelp: 70, ageTagAccuracy: 75 },
    comments: 267,
    rank: 4
  },
  {
    title: 'Whippersnapper',
    meaning: 'Someone thats young and overconfident',
    age: 'seniors',
    metrics: { definitionHelp: 65, usageHelp: 55, ageTagAccuracy: 60 },
    comments: 45
  }
];

const ageGroups = {
  Kids: 'kids',
  Teens: 'teens',
  'Young Adults': 'young-adults',
  Adults: 'adults',
  Seniors: 'seniors'
};

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function computeQuality(metrics) {
  const sum =
    metrics.definitionHelp +
    metrics.usageHelp +
    metrics.ageTagAccuracy;
  return Math.round(sum / 3);
}

function getLetterGrade(q) {
  if (q >= 90) return 'A';
  if (q >= 80) return 'B';
  if (q >= 70) return 'C';
  if (q >= 60) return 'D';
  return 'F';
}

// Render the global top popular slangs (by rank)
function renderPopularTopN(n = 4) {
  const ul = document.querySelector('.popular-words');
  ul.innerHTML = '';
  words
    .filter(w => w.rank)
    .sort((a, b) => a.rank - b.rank)
    .slice(0, n)
    .forEach(w => {
      const li = document.createElement('li');

      // rank badge
      const badge = document.createElement('div');
      badge.className = 'rank-badge';
      badge.textContent = `#${w.rank}`;
      li.appendChild(badge);

      // compute quality & tooltip
      const q = computeQuality(w.metrics);
      const grade = getLetterGrade(q);
      const tooltip =
        `definition accuracy: ${q}%\n` +
        `${w.metrics.definitionHelp}% say this definition helped them understand their kids\n` +
        `${w.metrics.usageHelp}% say they were able to use this word in a conversation\n` +
        `${w.metrics.ageTagAccuracy}% say the age group tag is correct`;

      li.innerHTML += `
        <div class="word-title">${
          w.title
        }${w.rank === 1 ? ' <span class="rank-text">(Most Popular)</span>' : ''}</div>
        <div class="word-meaning">${w.meaning}</div>
        <span class="age-group">${capitalize(w.age)}</span>
        <div class="word-stats">
          <div>
            Rating: 
            <span class="letter-grade" title="${tooltip}">${grade}</span>
          </div>
          <div>💬 ${w.comments} comments</div>
        </div>
      `;

      // make the whole card clickable
      li.style.cursor = 'pointer';
      li.addEventListener('click', () => {
        window.location.href = `word.html?word=${encodeURIComponent(
          w.title
        )}`;
      });

      ul.appendChild(li);
    });
}

// Render the age‐filtered list, sorted by rank if present
function renderList(ageGroup) {
  const container = document.querySelector('.words-list');
  container.innerHTML = '';
  const filtered = words
    .filter(w => w.age === ageGroup)
    .sort((a, b) => (a.rank || Infinity) - (b.rank || Infinity));

  if (!filtered.length) {
    container.innerHTML = `
      <div class="no-words-message">
        No slang words found for this age group. Be the first to suggest one!
      </div>`;
    return;
  }

  filtered.forEach(w => {
    const q = computeQuality(w.metrics);
    const grade = getLetterGrade(q);
    const tooltip =
      `definition accuracy: ${q}%\n` +
      `${w.metrics.definitionHelp}% say this definition helped them understand their kids\n` +
      `${w.metrics.usageHelp}% say they were able to use this word in a conversation\n` +
      `${w.metrics.ageTagAccuracy}% say the age group tag is correct`;

    const div = document.createElement('div');
    div.className = 'word-item';
    div.innerHTML = `
      <div class="word-info">
        <div class="word-title">${w.title}</div>
        <div class="word-meaning">${w.meaning}</div>
        <span class="age-group">${capitalize(w.age)}</span>
      </div>
      <div class="word-stats">
        <div>
          Rating: 
          <span class="letter-grade" title="${tooltip}">${grade}</span>
        </div>
        <div>💬 ${w.comments}</div>
      </div>
    `;

    // clickable
    div.style.cursor = 'pointer';
    div.addEventListener('click', () => {
      window.location.href = `word.html?word=${encodeURIComponent(
        w.title
      )}`;
    });

    container.appendChild(div);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderPopularTopN();

  // set up category buttons
  const categoryButtons = document.querySelectorAll('.category-btn');
  categoryButtons.forEach(btn =>
    btn.addEventListener('click', () => {
      categoryButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderList(ageGroups[btn.textContent]);
    })
  );

  // default to Teens
  const teensBtn = Array.from(categoryButtons).find(
    b => b.textContent === 'Teens'
  );
  if (teensBtn) teensBtn.click();

  // search suggestions
  const slangArr = words.map(w => w.title.toLowerCase());
  const search = document.getElementById('search-bar');
  const sugg = document.getElementById('suggestions');
  search.addEventListener('input', function () {
    const query = this.value.toLowerCase();
    sugg.innerHTML = '';
    if (!query) {
      sugg.style.display = 'none';
      return;
    }
    const matches = slangArr.filter(w => w.startsWith(query));
    if (matches.length) {
      matches.forEach(m => {
        const li = document.createElement('li');
        li.textContent = m;
        li.addEventListener('click', () => {
          search.value = m;
          sugg.style.display = 'none';
        });
        sugg.appendChild(li);
      });
    } else {
      const li = document.createElement('li');
      li.textContent = 'No results';
      li.style.color = '#666';
      sugg.appendChild(li);
    }
    sugg.style.display = 'block';
  });
  document.addEventListener('click', e => {
    if (e.target !== search) sugg.style.display = 'none';
  });
});
