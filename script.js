const startDate = new Date("2018-09-16T00:00:00+08:00");

const formatNumber = (value) => new Intl.NumberFormat("zh-CN").format(value);

function updateTogetherCounter() {
  const now = new Date();
  const diff = now - startDate;

  const totalSeconds = Math.max(0, Math.floor(diff / 1000));
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);

  document.getElementById("daysTogether").textContent = formatNumber(totalDays);
  document.getElementById("hoursTogether").textContent = formatNumber(totalHours);
  document.getElementById("minutesTogether").textContent = formatNumber(totalMinutes);
  document.getElementById("secondsTogether").textContent = formatNumber(totalSeconds);
}

function setupRevealAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.18 }
  );

  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
}

function createStarfield() {
  const canvas = document.getElementById("stars");
  const context = canvas.getContext("2d");
  const stars = [];
  const STAR_COUNT = 160;

  function resize() {
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    context.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);

    stars.length = 0;
    for (let i = 0; i < STAR_COUNT; i += 1) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 1.8,
        alpha: Math.random() * 0.7 + 0.15,
        speed: Math.random() * 0.25 + 0.05,
      });
    }
  }

  function render() {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (const star of stars) {
      star.y += star.speed;
      if (star.y > window.innerHeight) {
        star.y = -10;
        star.x = Math.random() * window.innerWidth;
      }

      context.beginPath();
      context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      context.fillStyle = `rgba(255, 247, 225, ${star.alpha})`;
      context.fill();
    }

    requestAnimationFrame(render);
  }

  resize();
  render();
  window.addEventListener("resize", resize);
}

updateTogetherCounter();
setInterval(updateTogetherCounter, 1000);
setupRevealAnimations();
createStarfield();
