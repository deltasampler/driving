import {gl_init} from "@engine/gl.ts";
import {cam2_compute_proj, cam2_compute_view, cam2_move_right, cam2_move_up, cam2_new, cam2_proj_mouse, cam2_zoom} from "@cl/camera/cam2.ts";
import {io_init, io_kb_key_down, io_key_down, io_m_button_down, io_m_button_up, io_m_move, kb_event_t, m_event_t} from "@engine/io.ts";
import {create_canvas} from "@engine/canvas.ts";
import {obb_rdata_build, obb_rdata_instance, obb_rdata_new, obb_rend_build, obb_rend_init, obb_rend_render} from "@engine/obb_rend.ts";
import {vec4} from "@cl/math/vec4.ts";
import {vec2, vec2n_add, vec2_copy, vec2n_muls, vec2_set, vec2n_sub, vec2_t, vec2m_add, vec2n_copy} from "@cl/math/vec2.ts";
import {rand_in} from "@cl/math/rand.ts";
import {mtv_aabb_aabb2, point_inside_aabb} from "@cl/collision/collision2.ts";

class wheel_t {
    position: vec2_t;
    size: vec2_t;
    rotation: number;
};

function wheel_new(position: vec2_t, size: vec2_t, rotation: number): wheel_t {
    const wheel = new wheel_t();
    wheel.position = vec2n_copy(position);
    wheel.size = vec2n_copy(size);
    wheel.rotation = rotation;

    return wheel;
}

const wheels: wheel_t[] = [];
wheels.push(wheel_new(vec2(-2.0, 0.0), vec2(1.0, 2.0), 0.0));
wheels.push(wheel_new(vec2(2.0, 0.0), vec2(1.0, 2.0), 0.0));
const wheel_left = wheels[0];
const wheel_right = wheels[1];

io_init();

const canvas_el = create_canvas(document.body);
const gl = gl_init(canvas_el);

const camera = cam2_new();

const obb_rdata = obb_rdata_new();
obb_rdata_build(obb_rdata, 16);

obb_rend_init();
obb_rend_build(obb_rdata);

function update() {
    if (io_key_down("KeyA")) {
        // cam2_move_right(camera, -1.0);
        wheel_left.rotation += 0.01;
        wheel_right.rotation += 0.01;
    }

    if (io_key_down("KeyD")) {
        // cam2_move_right(camera, 1.0);
        wheel_left.rotation -= 0.01;
        wheel_right.rotation -= 0.01;
    }

    if (io_key_down("KeyS")) {
        // cam2_move_up(camera, -1.0);
    }

    if (io_key_down("KeyW")) {
        // cam2_move_up(camera, 1.0);
    }

    if (io_key_down("KeyQ")) {
        cam2_zoom(camera, -1.0);
    }

    if (io_key_down("KeyE")) {
        cam2_zoom(camera, 1.0);
    }

    cam2_compute_proj(camera, canvas_el.width, canvas_el.height);
    cam2_compute_view(camera);
}

function render(): void {
    gl.viewport(0, 0, canvas_el.width, canvas_el.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    for (let i = 0; i < wheels.length; i += 1) {
        const wheel = wheels[i];

        obb_rdata_instance(obb_rdata, i, wheel.position, wheel.size, wheel.rotation, 0, vec4(170, 170, 170, 255), vec4(255, 0, 255, 255), 0.1);
    }

    obb_rdata.len = wheels.length;
    obb_rend_render(obb_rdata, camera);
}

function loop(): void {
    update();
    render();

    requestAnimationFrame(loop);
}

loop();
