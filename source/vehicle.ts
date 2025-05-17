import {vec2_t} from "@cl/math/vec2.ts";

export class wheel_t {
    size: vec2_t;
    rotation: number;
};

export class axle_t {
    offset: vec2_t;
};

export class frame_t {
    position: vec2_t;
    size: vec2_t;
    rotation: number;
    axles: axle_t;
    back: frame_t|null;
    front: frame_t|null;
}
