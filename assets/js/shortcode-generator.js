document.addEventListener("DOMContentLoaded", function () {
  const widthInput = document.getElementById("slp_width");
  const heightInput = document.getElementById("slp_height");
  const shortcodeOutput = document.getElementById("slp_shortcode");

  function updateShortcode() {
    const width = widthInput.value.trim() || "100%";
    const height = heightInput.value.trim() || "400px";
    shortcodeOutput.value = `[store_locator width="${width}" height="${height}"]`;
  }

  widthInput.addEventListener("input", updateShortcode);
  heightInput.addEventListener("input", updateShortcode);

  updateShortcode();
});
