// Selecting DOM elements
const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const addButton = document.getElementById("add-button");
const clearAllBtn = document.getElementById("clear-all-btn");
const filterOptions = document.querySelectorAll(".filter-option");

let currentFilter = "all";

// Add task when clicking the Add button
addButton.addEventListener("click", addTask);

// Add task when pressing Enter
inputBox.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        addTask();
    }
});

// Clear all tasks when clicking Clear All button
clearAllBtn.addEventListener("click", function () {
    if (confirm("Are you sure you want to clear all tasks?")) {
        listContainer.innerHTML = "";
        saveData();
        showFilteredTasks();
    }
});

// Filter tasks
filterOptions.forEach(option => {
    option.addEventListener("click", function () {
        // Update active class
        filterOptions.forEach(opt => opt.classList.remove("active"));
        this.classList.add("active");

        // Update current filter
        currentFilter = this.getAttribute("data-filter");

        // Show filtered tasks
        showFilteredTasks();
    });
});

// Function to add a new task
function addTask() {
    if (inputBox.value.trim() === '') {
        // Shake animation for empty input
        inputBox.classList.add("shake");
        setTimeout(() => {
            inputBox.classList.remove("shake");
        }, 500);
        return;
    }

    // Create new task element
    let li = document.createElement("li");
    li.innerHTML = inputBox.value;
    listContainer.appendChild(li);

    // Create delete button
    let span = document.createElement("span");
    span.innerHTML = "×";
    li.appendChild(span);

    // Clear input field
    inputBox.value = "";

    // Save to local storage and update display
    saveData();
    showFilteredTasks();

    // Focus back on input for better UX
    inputBox.focus();
}

// Event listener for clicking on tasks (mark as complete) or delete button
listContainer.addEventListener("click", function (e) {
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked");
        saveData();

        // If we're in a filtered view, update the display
        if (currentFilter !== "all") {
            showFilteredTasks();
        }
    } else if (e.target.tagName === "SPAN") {
        // Add fade-out animation before removing
        e.target.parentElement.classList.add("fade-out");

        // Remove after animation completes
        setTimeout(() => {
            e.target.parentElement.remove();
            saveData();
            showFilteredTasks();
        }, 300);
    }
}, false);

// Save data to local storage
function saveData() {
    localStorage.setItem("todoData", listContainer.innerHTML);
}

// Load data from local storage
function loadData() {
    listContainer.innerHTML = localStorage.getItem("todoData") || "";
}

// Filter tasks based on current filter
function showFilteredTasks() {
    const tasks = listContainer.querySelectorAll("li");

    tasks.forEach(task => {
        const isCompleted = task.classList.contains("checked");

        switch (currentFilter) {
            case "pending":
                task.style.display = isCompleted ? "none" : "block";
                break;
            case "completed":
                task.style.display = isCompleted ? "block" : "none";
                break;
            default: // "all"
                task.style.display = "block";
        }
    });

    clearAllBtn.style.display = tasks.length > 0 ? "inline-block" : "none";
}

const style = document.createElement('style');
style.textContent = `
    .shake {
        animation: shake 0.5s linear;
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        50% { transform: translateX(5px); }
        75% { transform: translateX(-5px); }
    }
    
    .fade-out {
        animation: fadeOut 0.3s ease;
        opacity: 0;
    }
    
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-10px); }
    }
`;
document.head.appendChild(style);

// Initialize the app
document.addEventListener("DOMContentLoaded", function () {
    loadData();
    showFilteredTasks();

    inputBox.focus();
});