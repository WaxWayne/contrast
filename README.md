Image contrast manipulation with JavaScript and WebAssembly

# Overview

Loads an image into two canvases, one for displaying the original image
and one for the contrast adjusted image result.
The contrast is computed based on the following formula, where C is the
UI input value range from -255..255 and F the derived correction factor for
each color component:

```
    (259 * (C + 255))
F = -----------------
    (255 * (259 - C))
```

Then a color adjusted component R' can be calculated from original R by

```
R' = ClampUint8(((R - 128) * F) + 128)
```

ClampUint8 is the clamping function which returns 0 for negative values, 255 for values greater 255 and the value otherwise.

# Running the demo

WebAssembly library requires Rust with target wasm32-unknown-unknown.

## Build Rust WASM libary and JS bindings

```
cargo build --target wasm32-unknown-unknown --release
wasm-bindgen target/wasm32-unknown-unknown/release/contrast.wasm --out-dir ./wasm
```

## Build and start demo app

1. Run npm installation and startup script.

```
npm install && npm run dev
```

2. Open localhost:8080 in your browser.

3. Select and open a JPG or PNG image.

4. Initially "use WebAssembly" is unchecked and moving the contrast manipulation slider will run the image manipulation in JavaScript.

5. Compare with checked "Use WebAssembly" option vs. unchecked setting in various browsers like FireFox, Chrome, Safari and Edge.

Have fun :-)