const TOTAL_CATS = 10;
let currentIndex = 0;
let likedCats = [];
const cardContainer = document.getElementById("cardContainer");
const progress = document.getElementById("progress");
const result = document.getElementById("result");
const likeCount = document.getElementById("likeCount");
const plural = document.getElementById("plural");
const likedCatsContainer = document.getElementById("likedCats");
const restartBtn = document.getElementById("restartBtn");

const cats = Array.from({ length: TOTAL_CATS }, (_, i) => 
  `https://cataas.com/cat?random=${Date.now() + i}`
);

function updateProgress() {
  progress.textContent = `${currentIndex + 1} / ${TOTAL_CATS}`;
}

function createCard(imageUrl) {
  const card = document.createElement("div");
  card.className = "card";
  const img = document.createElement("img");
  img.src = imageUrl;
  const like = document.createElement("div");
  like.className = "like";
  like.textContent = "👍🏻";
  const dislike = document.createElement("div");
  dislike.className = "dislike";
  dislike.textContent = "👎🏻";
  card.append(img, like, dislike);
  
  let startX = 0;
  let currentX = 0;
  
  card.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
  });
  
  card.addEventListener("touchmove", e => {
    currentX = e.touches[0].clientX - startX;
    card.style.transform = `translateX(${currentX}px) rotate(${currentX / 20}deg)`;
    like.style.opacity = currentX > 50 ? 1 : 0;
    dislike.style.opacity = currentX < -50 ? 1 : 0;
  });
  
  card.addEventListener("touchend", () => {
    if (currentX > 100) {
      likedCats.push(imageUrl);
      swipe(card, 1);
    } else if (currentX < -100) {
      swipe(card, -1);
    } else {
      card.style.transform = "";
      like.style.opacity = 0;
      dislike.style.opacity = 0;
    }
  });
  
  return card;
}

function swipe(card, direction) {
  card.style.transition = "0.3s";
  card.style.transform = `translateX(${direction * 1000}px) rotate(${direction * 30}deg)`;
  setTimeout(() => {
    card.remove();
    currentIndex++;
    if (currentIndex < TOTAL_CATS) {
      loadCard();
    } else {
      showResult();
    }
  }, 300);
}

function loadCard() {
  updateProgress();
  const card = createCard(cats[currentIndex]);
  cardContainer.appendChild(card);
}

function showResult() {
  cardContainer.style.display = "none";
  progress.style.display = "none";
  result.classList.remove("hidden");
  
  likeCount.textContent = likedCats.length;
  plural.style.display = likedCats.length === 1 ? "none" : "inline";
  
  if (likedCats.length === 0) {
    const emptyMsg = document.createElement("div");
    emptyMsg.className = "empty-message";
    emptyMsg.textContent = "You didn't like any cats 😿\nMaybe try again?";
    likedCatsContainer.appendChild(emptyMsg);
  } else {
    likedCats.forEach(src => {
      const img = document.createElement("img");
      img.src = src;
      likedCatsContainer.appendChild(img);
    });
  }
}

function restart() {
  currentIndex = 0;
  likedCats = [];
  likedCatsContainer.innerHTML = "";
  result.classList.add("hidden");
  cardContainer.style.display = "block";
  progress.style.display = "block";
  loadCard();
}

restartBtn.addEventListener("click", restart);

loadCard();