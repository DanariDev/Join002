import { db, auth } from "./firebase-config.js";
import { ref, onValue, get, child } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";


function $(s) {
    return document.querySelector(s);
};


function handleAuthState() {
    onAuthStateChanged(auth, function (user) {
        if (!user) {
            return;
        }
        let name = localStorage.getItem('userName');
        showGreetingTime()
        showGreetingUser(name);
        loadTasksForSummary();
    });
};


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


function showGreetingUser(name) {
    let element = document.getElementById('summary-greeting-name');
    if (element) element.textContent = name;
};


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

function updateSummary(tasks) {
    set("#todo .flex-column h2", count(tasks, "status", "todo"));
    set("#done .flex-column h2", count(tasks, "status", "done"));
    set("#atBoard h2", tasks.length);
    set("#onProgress h2", count(tasks, "status", "in-progress"));
    set("#awaitFeedback h2", count(tasks, "status", "await"));
    set("#urgent h2", count(tasks, "priority", "urgent"));
    showDeadline(tasks);
}

function set(sel, val) {
    let el = $(sel);
    if (el) el.textContent = val;
}

function count(arr, key, val) {
    let count = 0;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i][key] && arr[i][key].toLowerCase() == val) {
            count++;
        }
    }
    return count;
}

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

handleAuthState();
summaryImgHover()