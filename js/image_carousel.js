document.addEventListener("DOMContentLoaded", async () => {
    let images = [];

    try {
        const response = await fetch("images.json");
        if (!response.ok) throw new Error("Network response was not ok");
        images = await response.json();
    } catch (error) {
        return;
    }
    
    let currentIndex = 0;
    const mainImg = document.getElementById("main-mobile-img");
    const thumbnails = document.querySelectorAll(".thumb");
    const prevBtn = document.querySelector(".prev-arrow");
    const nextBtn = document.querySelector(".next-arrow");

    function updateCarousel(index) {
        currentIndex = index;
        mainImg.src = images[currentIndex];
        
        thumbnails.forEach(t => t.classList.remove("active"));
        if (thumbnails[currentIndex]) {
            thumbnails[currentIndex].classList.add("active");
        }
    }

    prevBtn.addEventListener("click", () => {
        let newIndex = currentIndex - 1;
        if (newIndex < 0) newIndex = images.length - 1;
        updateCarousel(newIndex);
    });

    nextBtn.addEventListener("click", () => {
        let newIndex = currentIndex + 1;
        if (newIndex >= images.length) newIndex = 0;
        updateCarousel(newIndex);
    });

    thumbnails.forEach((thumb, index) => {
        thumb.addEventListener("click", () => {
            updateCarousel(index);
        });
    });
});