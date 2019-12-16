use wasm_bindgen::prelude::*;
use wasm_bindgen::Clamped;
use web_sys::{CanvasRenderingContext2d, ImageData};

fn scale_color_byte(color: u8, factor: i32) -> u8 {
    let scaled_color = ((color as i32 - 128) * factor) / 256 + 128;
    if scaled_color > 255 {
        255
    } else if scaled_color < 0 {
        0
    } else {
        scaled_color as u8
    }
}

#[wasm_bindgen]
pub fn contrast(
    dst_ctx: &CanvasRenderingContext2d,
    src_image_data: &ImageData,
    width: u32,
    height: u32,
    value: i32,
) -> Result<(), JsValue> {
    let factor: i32 = (259 * 256 * (value + 255)) / (255 * (255 - value));
    let src_rgba = src_image_data.data();
    let mut dst_rgba: Vec<u8> = Vec::with_capacity(src_rgba.len());
    for i in 0..src_rgba.len() / 4 {
        dst_rgba.push(scale_color_byte(src_rgba[i * 4], factor));
        dst_rgba.push(scale_color_byte(src_rgba[i * 4 + 1], factor));
        dst_rgba.push(scale_color_byte(src_rgba[i * 4 + 2], factor));
        dst_rgba.push(src_rgba[i * 4 + 3]);
    }
    let dst_data =
        ImageData::new_with_u8_clamped_array_and_sh(Clamped(&mut dst_rgba), width, height)?;
    dst_ctx.put_image_data(&dst_data, 0.0, 0.0)
}
