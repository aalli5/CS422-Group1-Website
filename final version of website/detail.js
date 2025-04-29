// detail.js

// same data model as on homepage
const words = [
    {
      title: 'Tuff',
      meaning: 'Used to call something cool',
      age: 'teens',
      metrics: { definitionHelp: 92, usageHelp: 90, ageTagAccuracy: 88 },
      comments: [
        'Super helpful! Now I know what my teen means by "Tuff."',
        'Great example sentences.'
      ]
    },
    {
      title: 'Fire',
      meaning: 'Something thats exciting or great',
      age: 'teens',
      metrics: { definitionHelp: 90, usageHelp: 85, ageTagAccuracy: 80 },
      comments: [
        'Love this definition!',
        'I’ll use this in chat now.',
        'Could use more context, but helpful.'
      ]
    },
    {
      title: 'Drip',
      meaning: 'Clothes that look nice',
      age: 'teens',
      metrics: { definitionHelp: 85, usageHelp: 75, ageTagAccuracy: 80 },
      comments: [
        'Nice explanation.',
        'Perfect for styling tips.'
      ]
    },
    {
      title: 'Snaking',
      meaning: "Going behind someone's back",
      age: 'teens',
      metrics: { definitionHelp: 80, usageHelp: 70, ageTagAccuracy: 75 },
      comments: [
        'Spot on!',
        'Makes sense.'
      ]
    },
    {
      title: 'Whippersnapper',
      meaning: 'Someone thats young and overconfident',
      age: 'seniors',
      metrics: { definitionHelp: 65, usageHelp: 55, ageTagAccuracy: 60 },
      comments: [
        'Ha, good one!',
        'Never heard this before.'
      ]
    }
  ];
  
  function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
  
  function computeQuality(m) {
    return Math.round((m.definitionHelp + m.usageHelp + m.ageTagAccuracy) / 3);
  }
  
  // parse ?word=…
  const params = new URLSearchParams(window.location.search);
  const target = params.get('word');
  const word = words.find(
    w => w.title.toLowerCase() === (target||'').toLowerCase()
  );
  
  if (!word) {
    document.getElementById('detail-title').textContent = 'Word not found';
  } else {
    // Header
    document.getElementById('detail-title').textContent = word.title;
    document.getElementById('detail-age').textContent = capitalize(word.age);
  
    // Definition
    document.getElementById('detail-definition').textContent = word.meaning;
  
    // Overall accuracy + tooltip
    const q = computeQuality(word.metrics);
    const tooltip =
      `definition accuracy: ${q}%\n` +
      `${word.metrics.definitionHelp}% say this definition helped them understand their kids\n` +
      `${word.metrics.usageHelp}% say they were able to use this word in a conversation\n` +
      `${word.metrics.ageTagAccuracy}% say the age group tag is correct`;
  
    document.getElementById('detail-accuracy').textContent =
      `Definition Accuracy: ${q}%`;
    document.getElementById('detail-tooltip').textContent = tooltip;
  
    // Individual metrics
    document.getElementById('metric1-percent').textContent =
      `${word.metrics.definitionHelp}% Say Yes`;
    document.getElementById('metric2-percent').textContent =
      `${word.metrics.usageHelp}% Say Yes`;
    document.getElementById('metric3-percent').textContent =
      `${word.metrics.ageTagAccuracy}% Say Yes`;
  
    // Sample comments
    const commentsContainer = document.getElementById('sample-comments');
    word.comments.forEach((c,i) => {
      const block = document.createElement('div');
      block.className = 'sample-comment';
      block.innerHTML = `
        <div class="comment-text">${c}</div>
        <div class="comment-actions">
          <input type="radio" name="vote-${i}" id="up-${i}" class="vote-radio"/>
          <label for="up-${i}" class="vote-button">👍</label>
          <input type="radio" name="vote-${i}" id="down-${i}" class="vote-radio"/>
          <label for="down-${i}" class="vote-button">👎</label>
        </div>
      `;
      commentsContainer.appendChild(block);
    });
  }
  