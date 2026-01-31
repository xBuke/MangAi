(function () {
  var listEl = document.getElementById('blog-list');
  var loadingEl = document.getElementById('blog-loading');
  var baseUrl = 'post.html';

  function renderPost(post) {
    var card = document.createElement('article');
    card.className = 'blog-card';
    var dateFormatted = formatDate(post.date);
    card.innerHTML =
      '<h2 class="blog-card-title"><a href="' +
      escapeAttr(baseUrl + '?slug=' + encodeURIComponent(post.slug)) +
      '">' +
      escapeHtml(post.title_hr) +
      '</a></h2>' +
      '<p class="blog-card-meta">' +
      'Ažurirano: ' + escapeHtml(dateFormatted) +
      ' · ' +
      escapeHtml(post.reading_time_minutes + ' min čitanja') +
      '</p>' +
      '<p class="blog-card-excerpt">' +
      escapeHtml(post.excerpt_hr) +
      '</p>' +
      '<a href="' +
      escapeAttr(baseUrl + '?slug=' + encodeURIComponent(post.slug)) +
      '" class="blog-card-link">Pročitaj članak →</a>';
    return card;
  }

  function formatDate(iso) {
    try {
      var d = new Date(iso);
      return d.toLocaleDateString('hr-HR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return iso;
    }
  }

  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function escapeAttr(text) {
    return text.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  fetch('posts.json')
    .then(function (res) {
      if (!res.ok) throw new Error('Ne mogu učitati članke.');
      return res.json();
    })
    .then(function (posts) {
      if (loadingEl) loadingEl.remove();
      if (!Array.isArray(posts) || posts.length === 0) {
        listEl.innerHTML = '<p class="blog-loading">Nema objavljenih članaka.</p>';
        return;
      }
      var sorted = posts.slice().sort(function (a, b) {
        return (b.date || '').localeCompare(a.date || '');
      });
      sorted.forEach(function (post) {
        listEl.appendChild(renderPost(post));
      });
    })
    .catch(function () {
      if (loadingEl) loadingEl.remove();
      listEl.innerHTML = '<p class="blog-loading">Greška pri učitavanju članaka. Osvježite stranicu.</p>';
    });
})();
