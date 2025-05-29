import { db, auth } from "./firebase-config.js";
import { ref, onValue, get, child } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";


function $(s) {
    return document.querySelector(s);
}

function handleAuthState() {
    onAuthStateChanged(auth, function (user) {
        if (!user) {
            window.location.href = "login.html";
            return;
        }
        let isGuest = localStorage.getItem("isGuest") == "true";
        let name = isGuest ? "Guest" : "User";
        if (!isGuest) loadUserName(user.uid, name);
        else showGreeting(name);
        loadTasksForSummary();
    });
}

function loadUserName(uid, defaultName) {
    get(child(ref(db), "users/" + uid)).then(function (snap) {
        let name = snap.exists() ? snap.val().name : defaultName;
        showGreeting(name);
    });
}

function showGreeting(name) {
    let el = document.getElementById("summary-name");
    if (el) el.textContent = name;
}


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
}

function updateSummary(tasks) {
    set(".todo .metric h2", count(tasks, "status", "todo"));
    set(".done .metric h2", count(tasks, "status", "done"));
    set(".mini:nth-child(1) h2", tasks.length);
    set(".mini:nth-child(2) h2", count(tasks, "status", "in-progress"));
    set(".mini:nth-child(3) h2", count(tasks, "status", "await"));
    set(".urgent .metric h2", count(tasks, "priority", "urgent"));
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