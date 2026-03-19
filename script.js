const heightInput = document.getElementById("height");
const widthInput = document.getElementById("width");
const scaleInput = document.getElementById("scale");
const fileSize = document.getElementById("size");
const imageInput = document.getElementById("image");
const typeInput = document.getElementById("type");

const sizeSpan = document.getElementById("imageSize");

const fileSelector = document.getElementById('fileSelector');

const canvas = document.getElementById("imageCanvas");
const ctx = canvas.getContext("2d");

heightInput.addEventListener("change", ChangeCanvasHeight);
widthInput.addEventListener("change", ChangeCanvasWidth);
scaleInput.addEventListener("change", ChangeCanvasScale);
typeInput.addEventListener("change", ChangeDataType);
imageInput.addEventListener("change", ChangeImageType);

const reader = new FileReader();
var fileByteArray = [];

function ChangeImageType() {

    if (imageInput.value == 0) // free aspect
    {
        sizeSpan.style.display = "inline";

    }
    else if (imageInput.value == 1) // whole file
    {
        sizeSpan.style.display = "none";

        widthInput.value = 256;
        heightInput.value = Math.ceil((fileByteArray.length * (typeInput.value == 0 ? 8 : 1)) / 256);

        ChangeCanvasHeight();
        ChangeCanvasWidth();


    }
}

function ChangeDataType() {

    ChangeImageType();
    DrawImageToCanvas();
}

fileSelector.addEventListener("change", (e) => {
    fileByteArray = [];
    reader.readAsArrayBuffer(e.target.files[0]);
    reader.onloadend = (evt) => {
        if (evt.target.readyState === FileReader.DONE) {
            const arrayBuffer = evt.target.result,
                array = new Uint8Array(arrayBuffer);
            for (const a of array) {
                fileByteArray.push(a);
            }

            if (typeInput.value == 0)
                fileSize.textContent = (fileByteArray.length * 8) + " bits";
            else if (typeInput.value == 1 || typeInput.value == 2)
                fileSize.textContent = (fileByteArray.length) + " bytes";

            ChangeImageType();
            DrawImageToCanvas();
        }
    }
})

function ChangeCanvasScale() {
    canvas.width = widthInput.value * scaleInput.value;
    canvas.height = heightInput.value * scaleInput.value;

    ctx.scale(scaleInput.value, scaleInput.value);

    DrawImageToCanvas();
}

function ChangeCanvasHeight() {
    canvas.height = heightInput.value * scaleInput.value;
    ctx.scale(scaleInput.value, scaleInput.value);

    DrawImageToCanvas();
}

function ChangeCanvasWidth() {
    canvas.width = widthInput.value * scaleInput.value;
    ctx.scale(scaleInput.value, scaleInput.value);

    DrawImageToCanvas();
}

ChangeCanvasHeight();
ChangeCanvasScale();

function DrawImageToCanvas() {

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, widthInput.value, heightInput.value);

    if (typeInput.value == 0) { // bits

        fileSize.innerHTML = "Showing <b>" + NumberWithCommas(Math.min((widthInput.value * heightInput.value), (fileByteArray.length * 8)) + "</b> of <b>" + NumberWithCommas(fileByteArray.length * 8)) + "</b> bits <b>(" + ((Math.min((widthInput.value * heightInput.value), (fileByteArray.length * 8)) / (fileByteArray.length * 8)) * 100).toFixed(2) + "%)</b>";

        ctx.fillStyle = "black";

        for (var index = 0; index < fileByteArray.length * 8; index++) {

            if (index > widthInput.value * heightInput.value) return;

            var byte = fileByteArray[Math.floor(index / 8)];

            var bit = ReadBitFromByte(byte, index % 8);

            var y = Math.floor(index / widthInput.value);
            var x = index % widthInput.value;

            if (bit) ctx.fillRect(x, y, 1, 1);

        }

    }
    else if (typeInput.value == 1) { // bytes - alpha

        fileSize.innerHTML = "Showing <b>" + NumberWithCommas(Math.min((widthInput.value * heightInput.value), (fileByteArray.length))) + "</b> of <b>" + NumberWithCommas(fileByteArray.length) + "</b> bytes <b>(" + ((Math.min((widthInput.value * heightInput.value), (fileByteArray.length)) / fileByteArray.length) * 100).toFixed(2) + "%)</b>";

        for (var index = 0; index < fileByteArray.length; index++) {

            if (index > widthInput.value * heightInput.value) return;

            var y = Math.floor(index / widthInput.value);
            var x = index % widthInput.value;

            var a = fileByteArray[(y * widthInput.value) + x];
            ctx.fillStyle = "rgba(0,0,0," + (a / 256) + ")";
            ctx.fillRect(x, y, 1, 1);

        }
    }

}

function ReadBitFromByte(byte, bitIndex) {

    return (byte & Math.pow(2, bitIndex)) == Math.pow(2, bitIndex);
}

// regex magic idk
function NumberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
