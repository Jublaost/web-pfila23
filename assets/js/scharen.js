(async () => {
    getScharen();
})();

async function getScharen() {
    let response = await fetch("https://pfila23.azurewebsites.net/api/GetScharen");
    let data = await response.json();
    console.log(data)
    let container = document.getElementById("registered-scharen");
    container.innerHTML = "";
    for (let i of data) {
        let element = document.createElement("p");
        element.innerHTML = `${i.schar}`;
        container.appendChild(element);
    }
}