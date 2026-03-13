
// Flip on click
document.querySelectorAll('.flip-card').forEach(card => {
    card.addEventListener('click', () => card.classList.toggle('flipped'));
});

const filterBtns = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.flip-card');
const emptyState = document.getElementById('empty-state');

function applyFilter(filter) {
    let visible = 0;
    cards.forEach(card => {
    const match = filter === 'all' || card.dataset.category === filter;
    card.style.display = match ? '' : 'none';
    if (match) visible++;
    if (!match) card.classList.remove('flipped');
    });
    emptyState.style.display = visible === 0 ? 'block' : 'none';
}

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyFilter(btn.dataset.filter);
    });
});

// Apply category on page load from server
const initialCategory = '<%= activeCategory %>';
applyFilter(initialCategory);