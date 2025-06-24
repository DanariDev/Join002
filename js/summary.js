import { db, auth } from "./firebase-config.js";
import { ref, onValue, get, child } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

/**
 * Shorthand function to query a single DOM element
 * @param {string} s - CSS selector for the element
 * @returns {Element|null} - The first element matching the selector
 */
function $(s) {
    return document.querySelector(s);
};

/**
 * Handles authentication state changes and initializes summary data
 */
function handleAuthState() {
    onAuthStateChanged(auth, function (user) {
        if (!user) {
            return;
        }
        let name = localStorage.getItem('userName');
        showGreetingTime();
        showGreetingUser(name);
        loadTasksForSummary();
    });
};

/**
 * Displays a time-based greeting (morning, afternoon, or evening)
 */
function showGreetingTime() {
    const greetingTime = document.getElementById('summary-greeting-time');
    const currentHour = new Date().getHours();

    if (currentHour >= 18) {
        greetingTime.textContent = 'Good evening';
    } else if (currentHour >= 12) {
        greetingTime.textContent = 'Good afternoon';
    } else {
        greetingTime.textContent = 'Good morning';
    }
};

/**
 * Displays the user's name in the greeting
 * @param {string} name - The user's name
 */
function showGreetingUser(name) {
    let element = document.getElementById('summary-greeting-name');
    if (element) element.textContent = name;
};

/**
 * Loads tasks from Firebase for the summary view
 */
function loadTasksForSummary() {
    onValue(ref(db, "tasks"), function (snapshot) {
        let tasksObj = snapshot.val();
        if (!tasksObj) return;
        let tasks = [];
        for (let key in tasksObj) {
            tasks.push(tasksObj[key]);
        }
        updateSummary(tasks);
    }, { onlyOnce: true });
};

/**
 * Updates the summary with task counts and deadline
 * @param {Array<Object>} tasks - Array of task objects
 */
function updateSummary(tasks) {
    set("#todo .flex-column h2", count(tasks, "status", "todo"));
    set("#done .flex-column h2", count(tasks, "status", "done"));
    set("#atBoard h2", tasks.length);
    set("#onProgress h2", count(tasks, "status", "in-progress"));
    set("#awaitFeedback h2", count(tasks, "status", "await"));
    set("#urgent h2", count(tasks, "priority", "urgent"));
    showDeadline(tasks);
}

/**
 * Sets the text content of an element selected by CSS selector
 * @param {string} sel - CSS selector for the element
 * @param {string|number} val - Value to set as text content
 */
function set(sel, val) {
    let el = $(sel);
    if (el) el.textContent = val;
}

/**
 * Counts tasks matching a specific key-value pair
 * @param {Array<Object>} arr - Array of task objects
 * @param {string} key - Property to check (e.g., 'status', 'priority')
 * @param {string} val - Value to match
 * @returns {number} - Number of tasks matching the criteria
 */
function count(arr, key, val) {
    let count = 0;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i][key] && arr[i][key].toLowerCase() == val) {
            count++;
        }
    }
    return count;
}

/**
 * Displays the earliest future deadline from tasks
 * @param {Array<Object>} tasks - Array of task objects
 */
function showDeadline(tasks) {
    let dates = [];
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].dueDate) {
            let d = new Date(tasks[i].dueDate);
            if (d > new Date()) dates.push(d);
        }
    }
    dates.sort(function (a, b) { return a - b; });
    let date = dates[0] || new Date();
    $("#deadline-date").textContent = date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

/**
 * Adds hover effects to todo and done section images
 */
function summaryImgHover() {
    const todo = document.getElementById('todo');
    const done = document.getElementById('done');
    const todoImg = todo.querySelector('img');
    const doneImg = done.querySelector('img');
    todo.addEventListener('mouseover', () => {
        todoImg.src = 'assets/img/pencil-icon-hover.png';
    });
    todo.addEventListener('mouseout', () => {
        todoImg.src = 'assets/img/pencil-icon.png';
    });
    done.addEventListener('mouseover', () => {
        doneImg.src = 'assets/img/check-icon-hover.png';
    });
    done.addEventListener('mouseout', () => {
        doneImg.src = 'assets/img/check-icon.png';
    });
}

/**
 * Initializes authentication state handling and hover effects
 */
handleAuthState();
summaryImgHover();