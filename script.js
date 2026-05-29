const typeSelect = document.getElementById("typeSelect");
const percentFields = document.getElementById("percentFields");
const definedFields = document.getElementById("definedFields");

const cardsContainer = document.getElementById("cardsContainer");

typeSelect.addEventListener("change", () => {

  if(typeSelect.value === "percent"){
    percentFields.style.display = "block";
    definedFields.style.display = "none";
  } else {
    percentFields.style.display = "none";
    definedFields.style.display = "block";
  }

});

document.getElementById("addCardBtn").addEventListener("click", createCard);

function createCard(){

  const title = document.getElementById("titleInput").value || "Sin título";

  const type = typeSelect.value;

  const status = document.getElementById("statusSelect").value;

  let progress = 0;
  let bubbleText = "";

  if(type === "percent"){

    progress = parseInt(document.getElementById("percentInput").value);

    bubbleText = `${progress}%`;

  } else {

    const executed = parseInt(document.getElementById("executedInput").value);

    const total = parseInt(document.getElementById("totalInput").value);

    progress = (executed / total) * 100;

    bubbleText = `${executed}/${total}`;

  }

  let icon = "✅";

  if(status === "regular") icon = "⚠️";

  if(status === "bad") icon = "❌";

  const card = document.createElement("div");

  card.classList.add("card");

  card.innerHTML = `

    <div class="card-top">
      <div class="card-title">${title}</div>
      <div>${icon}</div>
    </div>

    <div class="progress-wrapper">

      <div class="progress-bubble" style="left:${progress}%;">
        ${bubbleText}
      </div>

      <div class="progress-bar">

        <div class="progress-fill" style="width:${progress}%;">
        </div>

      </div>

    </div>

    <div class="card-buttons">

      <button class="small-btn download-btn">
        Descargar PNG
      </button>

      <button class="small-btn delete-btn">
        Eliminar
      </button>

    </div>

  `;

  cardsContainer.prepend(card);

  saveCards();

  card.querySelector(".delete-btn").addEventListener("click", () => {
    card.remove();
    saveCards();
  });

  card.querySelector(".download-btn").addEventListener("click", async () => {

    const canvas = await html2canvas(card);

    const link = document.createElement("a");

    link.download = "progress-figure.png";

    link.href = canvas.toDataURL();

    link.click();

  });

}

function saveCards(){

  localStorage.setItem(
    "pfg-cards",
    cardsContainer.innerHTML
  );

}

window.addEventListener("load", () => {

  const saved = localStorage.getItem("pfg-cards");

  if(saved){

    cardsContainer.innerHTML = saved;

    restoreButtons();

  }

});

function restoreButtons(){

  document.querySelectorAll(".delete-btn").forEach(btn => {

    btn.addEventListener("click", (e) => {

      e.target.closest(".card").remove();

      saveCards();

    });

  });

  document.querySelectorAll(".download-btn").forEach(btn => {

    btn.addEventListener("click", async (e) => {

      const card = e.target.closest(".card");

      const canvas = await html2canvas(card);

      const link = document.createElement("a");

      link.download = "progress-figure.png";

      link.href = canvas.toDataURL();

      link.click();

    });

  });

}