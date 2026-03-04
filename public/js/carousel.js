(function () {
  function initCarousel() {
    const track = document.getElementById('carousel-track');
    const originalCards = Array.from(track.querySelectorAll('.carousel-card'));
    const originalTotal = originalCards.length;

    if (originalTotal === 0) return;

    const CARD_WIDTH = 220;
    const ROTATE_MS = 3000;

    const firstClone = originalCards[0].cloneNode(true);
    const lastClone  = originalCards[originalTotal - 1].cloneNode(true);
    firstClone.setAttribute('data-clone', 'true');
    lastClone.setAttribute('data-clone', 'true');

    track.insertBefore(lastClone, originalCards[0]);
    track.appendChild(firstClone);

    const cards = Array.from(track.querySelectorAll('.carousel-card'));
    const total = cards.length;
    let currentIndex = 1;

    function updateFanClasses() {
      cards.forEach((card, i) => {
        card.classList.remove('pos-center', 'pos-near', 'pos-far');
        let dist = Math.abs(i - currentIndex);
        if (dist > total / 2) dist = total - dist;
        if (dist === 0) card.classList.add('pos-center');
        else if (dist === 1) card.classList.add('pos-near');
        else card.classList.add('pos-far');
      });
    }

    function goToIndex(index, withTransition = true) {
      track.style.transition = withTransition ? 'transform 0.4s ease' : 'none';
      const wrapper = track.parentElement;
      const wrapperWidth = wrapper.offsetWidth || CARD_WIDTH * 3; // fallback
      const offset = -index * CARD_WIDTH + (wrapperWidth - CARD_WIDTH) / 2;
      track.style.transform = `translateX(${offset}px)`;
      currentIndex = index;
      updateFanClasses();
    }

    function next() { goToIndex(currentIndex + 1, true); }
    function prev() { goToIndex(currentIndex - 1, true); }

    track.addEventListener('transitionend', () => {
      if (cards[currentIndex] === firstClone) goToIndex(1, false);
      if (cards[currentIndex] === lastClone) goToIndex(originalTotal, false);
    });

    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    if (nextBtn) nextBtn.addEventListener('click', next);
    if (prevBtn) prevBtn.addEventListener('click', prev);

    let autoId = setInterval(next, ROTATE_MS);
    const carouselSection = document.getElementById('carousel-section');
    if (carouselSection) {
      carouselSection.addEventListener('mouseenter', () => {
        clearInterval(autoId);
        autoId = null;
      });
      carouselSection.addEventListener('mouseleave', () => {
        if (!autoId) autoId = setInterval(next, ROTATE_MS);
      });
    }

    goToIndex(1, false);
  }

  window.addEventListener('load', initCarousel);
})();
