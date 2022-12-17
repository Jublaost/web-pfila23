(async () => {
    getScharen();
})();

async function getScharen() {
    let response = await fetch("https://pfila23.azurewebsites.net/api/GetScharen");
    let data = await response.json();
    let container = document.getElementById("schar");
    //container.innerHTML = "";
    for (let i of data) {
        let element = document.createElement("option");
        element.innerHTML = `${i.schar}`;
        element.value = `${i.schar}`;
        container.appendChild(element);
    }
}

let checkbox = document.getElementById("age");
checkbox.addEventListener("change", () => {
    let element = document.getElementById("container-vormund");
    if (checkbox.checked) {
        element.classList.add("hide");
        element.required = false;
    } else {
        element.classList.remove("hide");
        element.required = true;
    }
});