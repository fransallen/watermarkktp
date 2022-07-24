// Inisialisasi variabel
let val = "";
let textValue = "";
let textObj = {};
let startX;
let startY;
let selectedText = 0;
let angle = 0;
let isDownloadable = false;
let src = "";

const img = new Image();
img.addEventListener("load", function () {
  const canvas = ctx.canvas;
  const hRatio = canvas.width / img.width;
  const vRatio = canvas.height / img.height;
  const ratio = Math.min(hRatio, vRatio);
  const centerShift_x = (canvas.width - img.width * ratio) / 2;
  const centerShift_y = (canvas.height - img.height * ratio) / 2;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(
    img,
    0,
    0,
    img.width,
    img.height,
    centerShift_x,
    centerShift_y,
    img.width * ratio,
    img.height * ratio,
  );
  draggable();
});

// Inisialisasi element
const inputWatermark = document.querySelector("#input-watermark");
const inputFile = document.querySelector("#inputFile");
const labelFile = document.querySelector(".label-file");
const selectFont = document.querySelector("#select-font");
const selectPosition = document.querySelector("#select-position");
const selectFontSize = document.querySelector("#select-font-size");
const inputColor = document.querySelector("#colorPicker");
const inputTextColor = document.querySelector("#text-colorPicker");
const inputOpacity = document.querySelector("#opacity");
const inputTextOpacity = document.querySelector("#opacity-input");
const inputRotate = document.querySelector("#rotate");
const inputTextRotate = document.querySelector("#rotate-input");
const resetButton = document.querySelector("#reset");
const downloadButton = document.querySelector("#download");
const canvasWrapper = document.querySelector("#canvas-wrapper");
const draggableFile = document.querySelector(".draggable-file");

// Section Canvas
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

let canvasOffset = canvas.getBoundingClientRect();
let offsetX = canvasOffset.left;
let offsetY = canvasOffset.top;
let scrollX = canvas.scrollLeft;
let scrollY = canvas.scrollTop;

// Section file reader
let reader = new FileReader();

reader.addEventListener("load", function (event) {
  img.src = event.target.result;
  src = event.target.result;
  canvas.classList.add("show");

  isDownloadable = true;
});

// Section Event Listener

// Pada saat window browser di resize
window.addEventListener("resize", () => {
  canvasOffset = canvas.getBoundingClientRect();
  offsetX = canvasOffset.left;
  offsetY = canvasOffset.top;
  scrollX = canvas.scrollLeft;
  scrollY = canvas.scrollTop;
});

// Pada saat semua dom element telah selesai dimuat
window.addEventListener("DOMContentLoaded", () => {
  inputFile.addEventListener("change", handleImage, false);

  const elementsBerulang = [inputColor, selectFont];
  elementsBerulang.forEach((element) =>
    element.addEventListener("input", () => draggable()),
  );

  const elementsBerulangWithImg = [selectFontSize, inputOpacity];
  elementsBerulangWithImg.forEach((element) =>
    element.addEventListener("input", () => draggable(img)),
  );

  inputWatermark.addEventListener("input", function () {
    textValue = inputWatermark.value;
    draggable();
  });

  inputRotate.addEventListener("input", function () {
    let rotVal = inputRotate.value;
    document.getElementById("rotate-input").value = rotVal;
    draggable(img);
  });

  inputTextRotate.addEventListener("input", function () {
    let rotVal = inputTextRotate.value;
    document.getElementById("rotate").value = rotVal;
    draggable(img);
  });

  inputOpacity.addEventListener("input", function () {
    let opacVal = inputOpacity.value;
    document.getElementById("opacity-input").value = opacVal;
    draggable(img);
  });

  inputTextOpacity.addEventListener("input", function () {
    let opacVal = inputTextOpacity.value;
    document.getElementById("opacity").value = opacVal;
    draggable(img);
  });

  inputColor.addEventListener("input", function () {
    let opacVal = inputColor.value;
    document.getElementById("text-colorPicker").value = opacVal;
    draggable(img);
  });

  inputTextColor.addEventListener("input", function () {
    let colorVal = inputTextColor.value;
    document.getElementById("colorPicker").value = colorVal;
    draggable(img);
  });

  selectPosition.addEventListener("input", function () {
    const position = selectPosition.value;

    switch (position) {
      case "top":
        textObj.y = 90;
        textObj.x = 400;
        break;
      case "top-left":
        textObj.y = 90;
        textObj.x = 100;
        break;
      case "top-right":
        textObj.y = 90;
        textObj.x = 700;
        break;
      case "center":
        textObj.y = 300;
        textObj.x = 400;
        break;
      case "center-left":
        textObj.y = 300;
        textObj.x = 100;
        break;
      case "center-right":
        textObj.y = 300;
        textObj.x = 700;
        break;
      case "bottom":
        textObj.y = 500;
        textObj.x = 400;
        break;
      case "bottom-left":
        textObj.y = 500;
        textObj.x = 100;
        break;
      case "bottom-right":
        textObj.y = 500;
        textObj.x = 700;
        break;
    }

    draggable(img);
  });

  dispatchEvent(selectPosition, "input");

  canvas.addEventListener("click", function (e) {
    selectedText = 1;
    mouseXY(e);
    setTimeout(() => {
      selectedText = 0;
    }, 1);
  });

  canvas.addEventListener("pointerdown", mouseDown, false);
  canvas.addEventListener("pointermove", mouseXY, false);
  canvas.addEventListener("pointerup", mouseXY, false);

  canvas.addEventListener("mousedown", mouseDown, false);
  canvas.addEventListener("mousemove", mouseXY, false);
  document.body.addEventListener("mouseup", mouseUp, false);

  downloadButton.addEventListener("click", function () {
    if (!isDownloadable)
      return alert(
        "Gambar belum ditambahkan, silakan tambah gambar terlebih dahulu",
      );
    if (isWMEmpty()) return alert("Watermark belum ditentukan!");

    const image = canvas.toDataURL("image/png");

    downloadButton.setAttribute("href", image);
  });

  resetButton.addEventListener("click", function () {
    inputWatermark.value = "";
    dispatchEvent(inputWatermark, "input");

    document.querySelector("#colorPicker").value = "#000000";
    document.querySelector("#text-colorPicker").value = "#000000";

    selectFont.value = "times New Roman";

    dispatchEvent(selectPosition, "input");

    selectFontSize.value = "20";

    inputRotate.value = "0";
    inputTextRotate.value = "0";

    inputOpacity.value = "0.5";
    inputTextOpacity.value = "0.5";
  });

  inputFile.addEventListener("change", function () {
    const filename = this.value.split("\\").pop();

    inputFile.nextElementSibling.innerHTML = `<span id="file-name">${filename}</span>`;

    if (document.querySelector("#file-name").innerHTML === "") {
      document.querySelector("#file-name").innerHTML = "Pilih Gambar";
    }

    draggableFile.classList.add("hidden");
    canvasWrapper.classList.remove("relative");
  });

  draggableFile.addEventListener("dragover", dragOverHandler, false);
  draggableFile.addEventListener("drop", dropHandler, false);
});

// Section fungsi-fungsi
const isWMEmpty = () => inputWatermark.value.replace(/^\s+|\s+$/g, "") === "";

function mouseUp() {
  canvas.classList.add("grab");
  canvas.classList.remove("grabbing");
  selectedText = 0;
  mouseXY();
}

function mouseDown() {
  canvas.classList.add("grabbing");
  canvas.classList.remove("grab");
  selectedText = 1;
  mouseXY();
}

function mouseXY(e) {
  try {
    e.preventDefault();
    canvasX = e.pageX - canvas.offsetLeft;
    canvasY = e.pageY - canvas.offsetTop;
    changePosXY(canvasX, canvasY);
  } catch (error) {}
}

function changePosXY(x, y) {
  if (selectedText) {
    textObj.x = x;
    textObj.y = y;
    draggable();
  }
}

function draggable(img, text_x = 0, text_y = 0) {
  let y = text_x > 0 ? text_x : canvas.height / 3;
  let x = text_y > 0 ? text_y : canvas.width / 2;
  const color = inputColor.value;

  const font = selectFont.value;
  const fontSize = selectFontSize.value;

  if (textObj.x && textObj.y) {
    y = textObj.y;
    x = textObj.x;
  }

  let text = {
    text: textValue,
    x,
    y,
  };

  angle = inputRotate.value;
  const opacity = inputOpacity.value;

  const rgbaCol = `rgba(${parseInt(color.slice(-6, -4), 16)},
    ${parseInt(color.slice(-4, -2), 16)},
    ${parseInt(color.slice(-2), 16)},
    ${opacity})`;

  const metrics = ctx.measureText(textValue);
  const actualHeight = Math.ceil(
    metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent,
  );

  ctx.font = `${fontSize}px ${font}`;
  ctx.fillStyle = rgbaCol;
  ctx.textAlign = "center";
  text.width = Math.ceil(ctx.measureText(textValue).width);
  text.height = actualHeight;

  textObj = text;
  theimg();
}

function theimg() {
  const acanvas = ctx.canvas;
  const hRatio = acanvas.width / img.width;
  const vRatio = acanvas.height / img.height;
  const ratio = Math.min(hRatio, vRatio);
  const centerShift_x = (acanvas.width - img.width * ratio) / 2;
  const centerShift_y = (acanvas.height - img.height * ratio) / 2;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(
    img,
    0,
    0,
    img.width,
    img.height,
    centerShift_x,
    centerShift_y,
    img.width * ratio,
    img.height * ratio,
  );
  ctx.save();

  const text = textObj;

  ctx.textAlign = "center";
  ctx.translate(text.x, text.y);
  ctx.rotate(angle * (Math.PI / 180));

  const splitedText = text.text.split("\n");
  const fontSize = selectFontSize.value;

  splitedText.forEach((text, i) => ctx.fillText(text, 0, fontSize * (i + 1)));

  ctx.restore();
}

function validateImage() {
  var img = inputFile.value.toLowerCase();
  regex = new RegExp("(.*?).(jpg|jpeg|png)$");
  if (!regex.test(img)) {
    alert("Format gambar yang Anda masukan salah");
    return false;
  } else {
    return true;
  }
}

function handleImage(e) {
  if (validateImage(e.target.files[0])) {
    reader.readAsDataURL(e.target.files[0]);
  }
}

function dispatchEvent(element, eventName) {
  if ("createEvent" in document) {
    const event = document.createEvent("HTMLEvents");
    event.initEvent(eventName, false, true);

    element.dispatchEvent(event);
  } else {
    element.fireEvent(eventName); // only for backward compatibility (older browsers)
  }
}

function dropHandler(ev) {
  ev.preventDefault();
  if (ev.dataTransfer.items) {
    for (const item of ev.dataTransfer.items) {
      if (item.kind === "file") {
        const file = item.getAsFile();

        if (file.type.includes("image/")) {
          reader.readAsDataURL(file);
          draggableFile.classList.add("hidden");
          canvasWrapper.classList.remove("relative");
        }
      }
    }
  } else {
    for (const file of ev.dataTransfer.files) {
      reader.readAsDataURL(file);
    }
  }
}

function dragOverHandler(ev) {
  ev.preventDefault();
}
