// login.js

// Gestion de l'affichage Connexion / Inscription
document.getElementById("showLogin").addEventListener("click", () => {
    document.getElementById("loginForm").classList.remove("hidden");
    document.getElementById("registerForm").classList.add("hidden");
});

document.getElementById("showRegister").addEventListener("click", () => {
    document.getElementById("registerForm").classList.remove("hidden");
    document.getElementById("loginForm").classList.add("hidden");
});

// Envoi des infos d'inscription au backend
const registerForm = document.getElementById("registerForm");
registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const inputs = registerForm.querySelectorAll("input");
    const data = {
        name: inputs[0].value,
        email: inputs[1].value,
        password: inputs[2].value,
        confirmPassword: inputs[3].value
    };

    fetch("http://localhost:8000/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(data => alert(data.message))
    .catch(err => alert("Erreur lors de l'inscription"));
});

// Envoi des infos de connexion au backend
const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const inputs = loginForm.querySelectorAll("input");
    const data = {
        email: inputs[0].value,
        password: inputs[1].value
    };

    fetch("http://localhost:8000/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
    })
    .then(data => alert(data.message))
    .catch(err => alert("Échec de la connexion"));
});
