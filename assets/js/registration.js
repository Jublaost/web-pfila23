let successMessage = document.getElementById("success-message");
let errorMessage = document.getElementById("error-message");
let registrationform = document.getElementsByTagName("form")[0];
//const backendUrl = "http://localhost:7071";
const backendUrl = "https://pfila23.azurewebsites.net";

(async () => {
    getScharen();
})();

async function getScharen() {
    let response = await fetch(backendUrl + "/api/GetScharen");
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
if (checkbox) {
    checkbox.addEventListener("change", () => {
        let element = document.getElementById("container-vormund");
        if (checkbox.checked) {
            element.classList.add("hide");
            registrationform.getElementsByTagName("button")[0].disabled = false;
            element.getElementsByTagName("input")[0].required = false;
        } else {
            element.classList.remove("hide");
            registrationform.getElementsByTagName("button")[0].disabled = true;
            element.getElementsByTagName("input")[0].required = true;
        }
    });
}

let noimpf = document.getElementById("noimpfausweis");
if (noimpf) {
    noimpf.addEventListener("change", () => {
        let element = document.getElementById("container-impfausweis");
        if (noimpf.checked) {
            element.classList.add("hide");
            element.getElementsByTagName("input")[0].required = false;
        } else {
            element.classList.remove("hide");
            element.getElementsByTagName("input")[0].required = true;
        }
    });
}
noimpfausweis

var canvas = document.getElementById("signature-pad");

function resizeCanvas() {
    var ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext("2d").scale(ratio, ratio);
}
window.onresize = resizeCanvas;
resizeCanvas();

var signaturePad = new SignaturePad(canvas, {
    backgroundColor: 'rgb(250,250,250)'
});

document.getElementById("clear").addEventListener('click', function () {
    canvas.classList.remove("hide");
    document.getElementById("set").classList.remove("hide");
    document.getElementById("signature").src = ''
    document.getElementById("signature").classList.add("hide");
    signaturePad.clear();
    registrationform.getElementsByTagName("button")[0].disabled = true;
})

document.getElementById("set").addEventListener('click', () => {
    canvas.classList.add("hide");
    document.getElementById("set").classList.add("hide");
    document.getElementById("signature").classList.remove("hide");
    var imagedata = canvas.toDataURL("image/png");
    let img = document.getElementById("signature").src = imagedata
    registrationform.getElementsByTagName("button")[0].disabled = false;
})

document.getElementById("impfausweis").addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file.size > 4000000) {
        document.getElementById("too-big-message").classList.remove("hide");
        document.getElementById("impfausweis").value = '';
    } else {
        document.getElementById("too-big-message").classList.add("hide");
        const reader = new FileReader();
        reader.onloadend = () => {
            document.getElementById("impfausweis-selected").src = reader.result;
        }
        reader.readAsDataURL(file)
    }
})

if (registrationform) {
    registrationform.onsubmit = (event) => {
        // prevent multibple actions
        registrationform.getElementsByTagName("button")[0].disabled = true;

        event.preventDefault(); // Don't let the browser submit the form.
        var payload = {};

        registrationform.querySelectorAll(".form-check-input").forEach(field => {
            if (field.checked) {
                if (payload[field.name]) {
                    payload[field.name] += ";" + field.value;
                } else {
                    payload[field.name] = field.value;
                }
            }
        })

        let signature = document.getElementById("signature").src;
        payload.signature = signature;

        let formId = registrationform.id;
        console.log("FORMID: ", formId)

        let api = "";

        if (formId == "tn-form") {
            api = "/api/RegisterTeilnehmende?code=3u3MZRLYlprHT1j6uKlq0mQQGlAUC6QKn86sQ5mS9KAHAzFu0ErE0Q=="
            //api = "/api/RegisterTeilnehmende"
        } else if (formId == "leitende-form") {
            api = "/api/RegisterLeitende?code=youtwfo6GfJO8OUz_5hIO43PnBht2tPzWikzjLGSeVDWAzFuUg2aQg=="
            //api = "/api/RegisterLeitende"
        } else {
            errorMessage.style.display = "block";
            return
        }

        // Build JSON key-value pairs using the form fields.
        registrationform.querySelectorAll(".form-control").forEach(field => {
            payload[field.name] = field.value;
        });

        let impfausweis = document.getElementById("impfausweis-selected").src;
        payload.impfausweis = impfausweis;

        grecaptcha.ready(() => {
            grecaptcha.execute('6LeQ0EsiAAAAAPOYVCLnkcsc6HE46vtuRfa1jgf6', { action: 'submit' }).then((token) => {
                payload['g-recaptcha-response'] = token;
                console.log(api)
                fetch(backendUrl + api, {
                    method: 'post',
                    body: JSON.stringify(payload)
                }).then(resp => {
                    if (!resp.ok) {
                        console.error(resp);
                        errorMessage.style.display = "block";
                        registrationform.style.display = "none";
                        return;
                    }
                    // Display success message.
                    successMessage.style.display = "block";
                    registrationform.style.display = "none";
                    getScharen();
                });
            });
        });
    }
}

