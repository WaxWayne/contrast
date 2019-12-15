import * as wasm from './contrast_bg.wasm';

const heap = new Array(32);

heap.fill(undefined);

heap.push(undefined, null, true, false);

let stack_pointer = 32;

function addBorrowedObject(obj) {
    if (stack_pointer == 1) throw new Error('out of js stack');
    heap[--stack_pointer] = obj;
    return stack_pointer;
}
/**
* @param {any} dst_ctx
* @param {any} src_image_data
* @param {number} width
* @param {number} height
* @param {number} value
*/
export function contrast(dst_ctx, src_image_data, width, height, value) {
    try {
        wasm.contrast(addBorrowedObject(dst_ctx), addBorrowedObject(src_image_data), width, height, value);
    } finally {
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function handleError(e) {
    wasm.__wbindgen_exn_store(addHeapObject(e));
}

let cachegetUint8ClampedMemory = null;
function getUint8ClampedMemory() {
    if (cachegetUint8ClampedMemory === null || cachegetUint8ClampedMemory.buffer !== wasm.memory.buffer) {
        cachegetUint8ClampedMemory = new Uint8ClampedArray(wasm.memory.buffer);
    }
    return cachegetUint8ClampedMemory;
}

function getClampedArrayU8FromWasm(ptr, len) {
    return getUint8ClampedMemory().subarray(ptr / 1, ptr / 1 + len);
}

let cachegetUint8Memory = null;
function getUint8Memory() {
    if (cachegetUint8Memory === null || cachegetUint8Memory.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory;
}

let WASM_VECTOR_LEN = 0;

function passArray8ToWasm(arg) {
    const ptr = wasm.__wbindgen_malloc(arg.length * 1);
    getUint8Memory().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

let cachegetInt32Memory = null;
function getInt32Memory() {
    if (cachegetInt32Memory === null || cachegetInt32Memory.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory;
}

const lTextDecoder = typeof TextDecoder === 'undefined' ? require('util').TextDecoder : TextDecoder;

let cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

function getStringFromWasm(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory().subarray(ptr, ptr + len));
}

export const __wbindgen_object_drop_ref = function(arg0) {
    takeObject(arg0);
};

export const __widl_f_put_image_data_CanvasRenderingContext2D = function(arg0, arg1, arg2, arg3) {
    try {
        getObject(arg0).putImageData(getObject(arg1), arg2, arg3);
    } catch (e) {
        handleError(e)
    }
};

export const __widl_f_new_with_u8_clamped_array_and_sh_ImageData = function(arg0, arg1, arg2, arg3) {
    try {
        const ret = new ImageData(getClampedArrayU8FromWasm(arg0, arg1), arg2 >>> 0, arg3 >>> 0);
        return addHeapObject(ret);
    } catch (e) {
        handleError(e)
    }
};

export const __widl_f_data_ImageData = function(arg0, arg1) {
    const ret = getObject(arg1).data;
    const ret0 = passArray8ToWasm(ret);
    const ret1 = WASM_VECTOR_LEN;
    getInt32Memory()[arg0 / 4 + 0] = ret0;
    getInt32Memory()[arg0 / 4 + 1] = ret1;
};

export const __wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm(arg0, arg1));
};

export const __wbindgen_rethrow = function(arg0) {
    throw takeObject(arg0);
};

