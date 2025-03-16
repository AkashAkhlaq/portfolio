document.addEventListener("DOMContentLoaded", () => {
    // Smooth Scrolling
    document.querySelectorAll("nav ul li a").forEach(anchor => {
        anchor.addEventListener("click", function(event) {
            event.preventDefault();
            const sectionId = this.getAttribute("href").substring(1);
            document.getElementById(sectionId).scrollIntoView({
                behavior: "smooth"
            });
        });
    });

    // Animate Skill Bars
    const skillBars = document.querySelectorAll(".progress");
    function animateSkills() {
        skillBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = "0%";
            setTimeout(() => {
                bar.style.width = width;
            }, 500);
        });
    }

    // Trigger animation when the skills section is in view
    const skillsSection = document.getElementById("skills");
    const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            animateSkills();
        }
    }, { threshold: 0.5 });

    observer.observe(skillsSection);
});
