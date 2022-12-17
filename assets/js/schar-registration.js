let successMessage = document.getElementById("success-message");
let errorMessage = document.getElementById("error-message");
let registrationform = document.getElementById("registrationform");

function onMusterblockChange(show) {
  if (show) {
    document.getElementById("if-no-musterblock-div").classList.remove("hide");
  } else {
    document.getElementById("if-no-musterblock-div").classList.add("hide");
  }
}

function onTentsChange(show) {
  if (show) {
    document.getElementById("if-tents-div").classList.remove("hide");
  } else {
    document.getElementById("if-tents-div").classList.add("hide");
  }
}

if (registrationform) {
  registrationform.onsubmit = (event) => {
    // prevent multibple actions
    registrationform.getElementsByTagName("button")[0].disabled = true;

    event.preventDefault(); // Don't let the browser submit the form.
    var payload = {};

    // Build JSON key-value pairs using the form fields.
    registrationform.querySelectorAll("input, textarea").forEach(field => {
      payload[field.name] = field.value;
    });

    grecaptcha.ready(() => {
      grecaptcha.execute('6LeQ0EsiAAAAAPOYVCLnkcsc6HE46vtuRfa1jgf6', { action: 'submit' }).then((token) => {
        payload['g-recaptcha-response'] = token;
        fetch("https://pfila23.azurewebsites.net/api/RegisterSchar", {
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
