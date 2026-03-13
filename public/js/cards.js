// Flip on click
document.querySelectorAll('.flip-card').forEach(card => {
    card.addEventListener('click', () => card.classList.toggle('flipped'));
});

const filterBtns = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.flip-card');
const emptyState = document.getElementById('empty-state');

// this filter will allow the user to click on a category from the 
// home page and directly go to the category on the cards.ejs page
// displaying the categories card count
function applyFilter(filter) {
    let visible = 0;
    cards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.style.display = match ? '' : 'none';
        if (match) visible++;
        if (!match) card.classList.remove('flipped');
    });
    emptyState.style.display = visible === 0 ? 'block' : 'none';

    const label = filter === 'all' ? 'in the collection' : `in ${filter}`;
    document.getElementById('card-count').textContent = 
        `${visible} card${visible !== 1 ? 's' : ''} ${label}`;
}

//these are the filter buttons based on the available categories. 
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        applyFilter(btn.dataset.filter);
    });
});

// Read initial category from the card-grid data attribute (set by EJS in cards.ejs)
const initialCategory = document.getElementById('card-grid').dataset.activeCategory || 'all';
applyFilter(initialCategory);