let user = localStorage.getItem("user");
let habits = JSON.parse(localStorage.getItem("habits")) || [];

// LOGIN
function login() {
  let name = document.getElementById("username").value;
  if (name === "") return;

  localStorage.setItem("user", name);
  loadApp();
}

// LOAD APP
function loadApp() {
  document.getElementById("auth").style.display = "none";
  document.getElementById("app").style.display = "block";

  user = localStorage.getItem("user");
  document.getElementById("welcome").innerText = "Welcome " + user;

  displayHabits();
}

// ADD HABIT (Streak Enabled)
function addHabit() {
  let input = document.getElementById("habitInput");
  let habitName = input.value;

  if (habitName === "") return;

  let habit = {
    name: habitName,
    done: false,
    streak: 0,
    lastDate: "" // YYYY-MM-DD
  };

  habits.push(habit);
  localStorage.setItem("habits", JSON.stringify(habits));

  input.value = "";
  displayHabits();
}

// DISPLAY HABITS
function displayHabits() {
  let list = document.getElementById("habitList");
  list.innerHTML = "";

  habits.forEach((habit, index) => {
    let li = document.createElement("li");

    li.innerHTML = `
      <input type="checkbox" ${habit.done ? "checked" : ""} 
        onchange="toggleHabit(${index})">

      <span style="text-decoration:${habit.done ? "line-through" : "none"}">
        ${habit.name}
      </span>

      <p>🔥 Streak: ${habit.streak}</p>

      <button onclick="editHabit(${index})">Edit</button>
      <button onclick="deleteHabit(${index})">Delete</button>
    `;

    list.appendChild(li);
  });
}

// TOGGLE HABIT (Streak + Daily Reset)
function toggleHabit(index) {
  let today = new Date().toISOString().slice(0,10); // YYYY-MM-DD
  let habit = habits[index];

  if (habit.lastDate === today) {
    // Already ticked today → uncheck
    habit.done = !habit.done;
  } else {
    // New day logic
    if (habit.lastDate) {
      let last = new Date(habit.lastDate);
      let diff = (new Date(today) - last)/(1000*60*60*24);

      if (diff === 1) habit.streak += 1; // consecutive day
      else habit.streak = 1; // missed day → reset streak
    } else {
      habit.streak = 1; // first time tick
    }

    habit.done = true;
    habit.lastDate = today;
  }

  localStorage.setItem("habits", JSON.stringify(habits));
  displayHabits();
}

// DELETE HABIT
function deleteHabit(index) {
  habits.splice(index, 1);
  localStorage.setItem("habits", JSON.stringify(habits));
  displayHabits();
}

// EDIT HABIT
function editHabit(index) {
  let newHabit = prompt("Edit habit:");
  if (newHabit) {
    habits[index].name = newHabit;
    localStorage.setItem("habits", JSON.stringify(habits));
    displayHabits();
  }
}

// PROFILE
function openProfile() {
  let newName = prompt("Change your name:");
  if (newName) {
    localStorage.setItem("user", newName);
    loadApp();
  }
}

// SETTINGS
function openSettings() {
  alert("Settings coming soon!");
}

// SEARCH (optional)
window.onload = function () {
  let search = document.getElementById("search");

  if (search) {
    search.addEventListener("input", function () {
      let value = this.value.toLowerCase();
      let items = document.querySelectorAll("#habitList li");

      for (let i = 0; i < items.length; i++) {
        let text = items[i].innerText.toLowerCase();
        items[i].style.display = text.includes(value) ? "block" : "none";
      }
    });
  }

  if (user) {
    loadApp();
  }
};