/**
 * carousel.js
 * Fan-style carousel: center card is largest, adjacent smaller, outer smallest.
 * Supports wrapping (circular).
 */

(function () {
  const track = document.getElementById('carousel-track');
  const cards = Array.from(track.querySelectorAll('.carousel-card'));
  const total = cards.length;

  if (total === 0) return;

  let centerIndex = Math.floor(total / 2); // start with middle card active

  /**
   * Assign position classes based on distance from center.
   * pos-center  → 0 steps away
   * pos-near    → 1 step away
   * pos-far     → 2+ steps away
   */
  function updatePositions() {
    cards.forEach((card, i) => {
      card.classList.remove('pos-center', 'pos-near', 'pos-far');

      // Shortest circular distance
      let dist = Math.abs(i - centerIndex);
      if (dist > total / 2) dist = total - dist;

      if (dist === 0) {
        card.classList.add('pos-center');
      } else if (dist === 1) {
        card.classList.add('pos-near');
      } else {
        card.classList.add('pos-far');
      }
    });
  }

  function next() {
    centerIndex = (centerIndex + 1) % total;
    updatePositions();
  }

  function prev() {
    centerIndex = (centerIndex - 1 + total) % total;
    updatePositions();
  }

  document.getElementById('nextBtn').addEventListener('click', next);
  document.getElementById('prevBtn').addEventListener('click', prev);

  // Keyboard nav
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft')  prev();
  });

  // Init
  updatePositions();
})();