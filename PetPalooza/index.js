$(document).ready(function() {

    function initCarousel(carousel) {
        var carouselWidth = carousel.find('.carousel-inner')[0].scrollWidth;
        var cardWidth = carousel.find('.carousel-item').width();
        var scrollPosition = 0;


        carousel.find('.carousel-control-next').on('click', function() {
            if (scrollPosition < (carouselWidth - (cardWidth * 2))) {
                console.log('next');
                scrollPosition += cardWidth;
                carousel.find('.carousel-inner').animate({ scrollLeft: scrollPosition }, 200);
            }
        });


        carousel.find('.carousel-control-prev').on('click', function() {
            if (scrollPosition > 0) {
                console.log('prev');
                scrollPosition -= cardWidth;
                carousel.find('.carousel-inner').animate({ scrollLeft: scrollPosition }, 200);
            }
        });
    }

    $('.carousel').each(function() {
        initCarousel($(this));
    });

    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl)) 

    
    
});