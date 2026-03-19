# binary-file-visualiser

https://round747.github.io/binary-file-visualiser/

This project displays any file as an image visually representing its bits or bytes. You can also change the dimensions of the image, or automatically show the whole file.

### Image

- `Free aspect`: Allows you change the width and height of the image. Multiples of 8 look the most interesting.
- `Whole file`: Sets the width of the image to 256, and automatically sets the height to fit the entire file selected. This may lag/freeze the browser depending on the size of the file.

### Data

- `Bits`: Each pixel of the image represents a single bit of the file. Black means a 1, and white means a 0.
- `Bytes (alpha)`: Each pixel of the image represents a byte of the file. The integer value of the byte is represented as a gradient. 0 is white, and 255 is black.
