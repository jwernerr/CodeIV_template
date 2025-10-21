let currentUser: string | null = null;

async function register() {
    const username = (document.getElementById("username") as HTMLInputElement)?.value;
    const password = (document.getElementById("password") as HTMLInputElement)?.value;

    const res = await fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    alert(data.message);
}

async function login() {
    const username = (document.getElementById("username") as HTMLInputElement)?.value;
    const password = (document.getElementById("password") as HTMLInputElement)?.value;

    const res = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    if (!res.ok) {
        const data = await res.json();
        alert(data.message);
        return;
    }

    const data = await res.json();
    
    if (data.success) {
        currentUser = username;

        const greetingElem = document.getElementById("greeting");
        if (greetingElem) greetingElem.innerText = "Hello " + currentUser;

        const loginFormElem = document.getElementById("loginForm");
        if (loginFormElem) loginFormElem.style.display = "none";

        const welcomeElem = document.getElementById("welcome");
        if (welcomeElem) welcomeElem.style.display = "block";
    } else {
        alert(data.message);
    }
}

function logout() {
    currentUser = null;

    const loginFormElem = document.getElementById("loginForm");
    if (loginFormElem) loginFormElem.style.display = "block";

    const welcomeElem = document.getElementById("welcome");
    if (welcomeElem) welcomeElem.style.display = "none";
}

async function saveAvatar(){
    let hatS: HTMLInputElement = <HTMLInputElement>document.getElementById("hat");
    const eyesS: HTMLInputElement = <HTMLInputElement>document.getElementById("eyes");
    const noseS: HTMLInputElement = <HTMLInputElement>document.getElementById("nose");
    const mouthS: HTMLInputElement = <HTMLInputElement>document.getElementById("mouth");

    let hat:number=Number(hatS.value);
    let eyes: number = Number(eyesS.value);
    let nose:number=Number(noseS.value);
    let mouth:number=Number(mouthS.value);

    const res = await fetch("/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hat,eyes,nose,mouth})
    });
}

function showCurrentAvatar(){
    
}

// Event Listener erst setzen, wenn DOM geladen ist
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("loginBtn")?.addEventListener("click", login);
    document.getElementById("registerBtn")?.addEventListener("click", register);
    document.getElementById("logoutBtn")?.addEventListener("click", logout);
    document.getElementById("showCurrentAvatarBtn")?.addEventListener("click", showCurrentAvatar);
    document.getElementById("saveAvatarBtn")?.addEventListener("click", saveAvatar);
});
