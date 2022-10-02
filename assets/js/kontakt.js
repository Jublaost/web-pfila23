
let successMessage2 = document.getElementById("success-message-2");
let errorMessage2 = document.getElementById("error-message-2");
let kontaktform = document.getElementById("contactform");

if (kontaktform) {
    kontaktform.onsubmit = (event) => {
        // prevent multibple actions
        kontaktform.getElementsByTagName("button")[0].disabled = true;

        event.preventDefault(); // Don't let the browser submit the form.
        var payload = {};

        // Build JSON key-value pairs using the form fields.
        kontaktform.querySelectorAll("input, textarea").forEach(field => {
            payload[field.name] = field.value;
        });

        grecaptcha.ready(() => {
            grecaptcha.execute('6LeQ0EsiAAAAAPOYVCLnkcsc6HE46vtuRfa1jgf6', { action: 'submit' }).then((token) => {
                payload['g-recaptcha-response'] = token;
                fetch("https://pfila23.azurewebsites.net/api/KontaktForm", {
                method: 'post',
                body: JSON.stringify(payload)
                }).then(resp => {
                    if (!resp.ok) {
                        console.error(resp);
                        errorMessage2.style.display = "block";
                        kontaktform.style.display = "none";
                        return;
                    }
                    // Display success message.
                    successMessage2.style.display = "block";
                    kontaktform.style.display = "none";
                });
            });
        });
    }
}
