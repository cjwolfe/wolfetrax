document.addEventListener('DOMContentLoaded', () => {
    
    // Core Dynamic Accordion Mechanism
    const tracks = document.querySelectorAll('.expandable-track');

    // Set initial layout state for the featured track
    // const featuredTrack = document.querySelector('.project-card.featured');
    // if (featuredTrack) {
    //     featuredTrack.classList.add('open');
    //     const featuredContent = featuredTrack.querySelector('.expandable-content');
    //     if (featuredContent) {
    //         // Give it time to render then set base height
    //         setTimeout(() => {
    //             featuredContent.style.maxHeight = featuredContent.scrollHeight + "px";
    //         }, 100);
    //     }
    // }
    
    tracks.forEach(track => {
        const trigger = track.querySelector('.expandable-trigger');
        const content = track.querySelector('.expandable-content');

        if (trigger && content) {
            trigger.addEventListener('click', (e) => {
                if (e.target.closest('.btn') || e.target.closest('a')) {
                    return;
                }

                const isOpen = track.classList.contains('open');

                // Close all other open sections first
                tracks.forEach(otherTrack => {
                    if (otherTrack !== track && otherTrack.classList.contains('open')) {
                        const otherContent = otherTrack.querySelector('.expandable-content');
                        if (otherContent) {
                            otherContent.style.maxHeight = null;
                        }
                        otherTrack.classList.remove('open');
                    }
                });

                // Toggle the clicked section
                if (isOpen) {
                    content.style.maxHeight = null;
                    track.classList.remove('open');
                } else {
                    content.style.maxHeight = content.scrollHeight + "px";
                    track.classList.add('open');
                }
                // Nudge the browser window to smoothly follow the opened card
                setTimeout(() => {
                    track.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'nearest' 
                    });
                }, 150); // Waited 150ms for the height expansion transition to begin
            });
        }
    });

    // Smooth scroll configuration
    // const scrollIndicator = document.querySelector('.scroll-indicator');
    // const mainContent = document.querySelector('.portfolio-container');

    // if (scrollIndicator && mainContent) {
    //     scrollIndicator.addEventListener('click', () => {
    //         mainContent.scrollIntoView({ behavior: 'smooth' });
    //     });
    // }

    // Sticky header scroll opacity transformation
    const header = document.querySelector('.site-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.backgroundColor = 'rgba(13, 13, 13, 0.95)';
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        } else {
            header.style.backgroundColor = 'rgba(13, 13, 13, 0.85)';
            header.style.boxShadow = 'none';
        }
    });

    // Simulated cart counter behavior
    const storeButtons = document.querySelectorAll('.btn-small, .btn-secondary, .btn-primary');
    const cartCountElement = document.querySelector('.cart-count');
    let currentCartCount = 0;

    storeButtons.forEach(button => {
        if (button.textContent.toLowerCase().includes('store')) {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                currentCartCount++;
                if (cartCountElement) {
                    cartCountElement.textContent = currentCartCount;
                    cartCountElement.style.backgroundColor = '#7000ff';
                    setTimeout(() => {
                        cartCountElement.style.backgroundColor = '#222222';
                    }, 300);
                }
            });
        }
    });
});