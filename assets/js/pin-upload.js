document.addEventListener("DOMContentLoaded", () => {
  const uploadButton = document.getElementById("upload_pin");
  const removeButton = document.getElementById("remove_pin");
  const inputField = document.getElementById("slp_custom_pin_url");
  const preview = document.getElementById("slp_pin_preview");

  if (uploadButton && inputField) {
    uploadButton.addEventListener("click", function () {
      const frame = wp.media({
        title: "Selecciona el ícono del pin",
        multiple: false,
        library: { type: "image" },
        button: { text: "Usar esta imagen" },
      });

      frame.on("select", function () {
        const attachment = frame.state().get("selection").first().toJSON();
        inputField.value = attachment.url;
        if (preview) {
          preview.src = attachment.url;
          preview.style.display = "block";
        }
        if (removeButton) {
          removeButton.style.display = "inline-block";
        }
      });

      frame.open();
    });
  }

  if (removeButton && inputField) {
    removeButton.addEventListener("click", function () {
      const confirmDelete = confirm(
        "¿Estás seguro de que deseas quitar el ícono personalizado del pin?"
      );

      if (!confirmDelete) return;

      inputField.value = "";
      if (preview) {
        preview.src = "";
        preview.style.display = "none";
      }
      removeButton.style.display = "none";
    });
  }
});
