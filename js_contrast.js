import("./wasm/contrast").then(({ contrast_in_rust }) => {
  const image2canvas = (id, image) => {
    const canvas = document.getElementById(id);
    const canvasWH = Math.max(image.width, image.height);
    canvas.width = canvasWH;
    canvas.height = canvasWH;
    const context = canvas.getContext("2d");
    context.drawImage(
      image,
      (canvasWH - image.width) / 2,
      (canvasWH - image.height) / 2
    );
  };

  const addImage = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = readerEvent => {
      const newImage = new Image();
      newImage.src = readerEvent.target.result;
      newImage.onload = () => {
        image2canvas("src-image", newImage);
        image2canvas("dst-image", newImage);
      };
    };
    reader.readAsDataURL(file);
  };

  const scaleByteValue = (byteValue, scale) =>
    Math.floor((byteValue - 128) * scale + 128);

  const contrast_in_javascript = (
    dstContext,
    srcContext,
    width,
    height,
    value
  ) => {
    const srcData = srcContext.getImageData(0, 0, width, height);
    const dstData = dstContext.getImageData(0, 0, width, height);

    const factor = (259.0 * (value + 255)) / (255 * (259 - value));

    for (let i = 0; i < srcData.data.length; i = i + 4) {
      dstData.data[i] = scaleByteValue(srcData.data[i], factor);
      dstData.data[i + 1] = scaleByteValue(srcData.data[i + 1], factor);
      dstData.data[i + 2] = scaleByteValue(srcData.data[i + 2], factor);
    }

    dstContext.putImageData(dstData, 0, 0);
  };

  const changeContrast = e => {
    const contrastValue = Number.parseInt(e.target.value, 10);
    document.getElementById("adjust-contrast-value").textContent =
      e.target.value;
    const srcCanvas = document.getElementById("src-image");
    const { width, height } = srcCanvas;
    const srcContext = srcCanvas.getContext("2d");
    const dstContext = document.getElementById("dst-image").getContext("2d");
    const useWasm = document.getElementById("use-webassembly").checked;

    const startTime = Date.now();
    let contrastFn = useWasm ? contrast_in_rust : contrast_in_javascript;
    contrastFn(dstContext, srcContext, width, height, contrastValue);
    const duration = Date.now() - startTime;
    document.getElementById(
      "processing-duration"
    ).textContent = `${duration} ms`;
  };

  const switchWebAssembly = e => {
    if (e.target.checked) {
      console.log("WebAssembly ON");
    } else {
      console.log("WebAssembly OFF");
    }
  };

  document.getElementById("src-picker").addEventListener("change", addImage);
  document
    .getElementById("adjust-contrast-js")
    .addEventListener("change", changeContrast);
  document
    .getElementById("use-webassembly")
    .addEventListener("change", switchWebAssembly);
});
