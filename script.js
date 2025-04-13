document.addEventListener('DOMContentLoaded', function() {
    // Dropdown menu script
    const dropdowns = document.querySelectorAll('.has-dropdown');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', function(e) {
            if (e.target.tagName === 'A' && e.target.parentElement === this) {
                e.preventDefault();
                const subMenu = this.querySelector('.sub-menu');
                const icon = this.querySelector('.dropdown-icon');
                subMenu.classList.toggle('active');
                icon.classList.toggle('rotate');
            }
        });
    });
});