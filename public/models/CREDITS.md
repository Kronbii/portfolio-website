# 3D model credits

Attribution is required wherever these are displayed publicly.

## Sketchfab — CC Attribution 4.0 (http://creativecommons.org/licenses/by/4.0/)

| File | Model | Author | Faces | Size | Source |
|---|---|---|---|---|---|
| `dji-matrice-300.glb` | Quadcopter DJI Matrice 300 RTK | [19vitali99](https://sketchfab.com/19vitali99) | 904,053 | 1502 KB | https://sketchfab.com/3d-models/none-6677d02d66df4b73aad0d8e7bb9e3d9c |
| `dji-fpv.glb` | Dji FPV by SDC -  High performance drone | [SDC PERFORMANCE™️](https://sketchfab.com/SDC PERFORMANCE™️) | 429,806 | 634 KB | https://sketchfab.com/3d-models/none-d471ea8c6235457b8e131842e2cf3783 |
| `fpv-racing.glb` | FPV Racing Drone | [jbabs](https://sketchfab.com/jbabs) | 272,218 | 706 KB | https://sketchfab.com/3d-models/none-22f2ba667d6a4b7eaebd05539cb9ffb9 |
| `fpv-racer.glb` | Fpv Racing Drone Quadcopter | [eagleanurag](https://sketchfab.com/eagleanurag) | 272,218 | 1543 KB | https://sketchfab.com/3d-models/fpv-racing-drone-quadcopter-fa8b1ca2695e4022a9b4c70401f04b05 |
| `delivery-drone.glb` | DeliveryDrone | [KonPrineas](https://sketchfab.com/KonPrineas) | 231,230 | 811 KB | https://sketchfab.com/3d-models/none-bf65cd5ffe614ec18bb235d20caeeb1a |
| `parrot-drone.glb` | Parrot Camo drone | [domiiniic](https://sketchfab.com/domiiniic) | 172,978 | 754 KB | https://sketchfab.com/3d-models/parrot-camo-drone-351867524b9b478fa406aad31d838ef4 |
| `camera-drone-anim.glb` | animated drone with camera (FREE) | [ulunkwulunk](https://sketchfab.com/ulunkwulunk) | 83,712 | 2134 KB | https://sketchfab.com/3d-models/none-a8e2c50f69264e75bb6277779fb5028b |
| `beta85x-scan.glb` | Drone Beta85X HD - 3D Scan | [Yannoid](https://sketchfab.com/Yannoid) | 69,366 | 546 KB | https://sketchfab.com/3d-models/none-eba0a1a03147490cac1c809093ae7a76 |
| `quadcopter-annelida.glb` | Quadcopter drone | [Annelida](https://sketchfab.com/Annelida) | 65,712 | 303 KB | https://sketchfab.com/3d-models/none-ca8f0f70a1014e77a6777dc248e9bf5a |
| `fpv-drone.glb` | FPV Drone | [Jeyhun1985](https://sketchfab.com/Jeyhun1985) | 58,840 | 566 KB | https://sketchfab.com/3d-models/none-0294037f390a4351926c11caf3e5c43e |
| `camera-drone-midpoly.glb` | Camera Drone Midpoly Gameready | [valterjherson1](https://sketchfab.com/valterjherson1) | 50,706 | 1631 KB | https://sketchfab.com/3d-models/none-e4a6c7c71fdb43af8ecb36a3ee7f73ba |
| `tricopter.glb` | Tricopter | [pierre.paslier](https://sketchfab.com/pierre.paslier) | 36,144 | 81 KB | https://sketchfab.com/3d-models/none-ac47df697aee4834a2b3ff24c83eb180 |
| `uav.glb` | UAV | [dread_comrade](https://sketchfab.com/dread_comrade) | 28,712 | 49 KB | https://sketchfab.com/3d-models/none-e39be240a697462c945e96a9a0f5d9d3 |
| `eachine-e58.glb` | Eachine E58 Pocket Drone - Game Ready Asset | [the_Thorminator](https://sketchfab.com/the_Thorminator) | 20,758 | 386 KB | https://sketchfab.com/3d-models/none-95c15555467b455ea9e2e923904e9b60 |
| `eachine-e58-web.glb` | Eachine E58 Pocket Drone (web build of the row above) | [the_Thorminator](https://sketchfab.com/the_Thorminator) | 20,758 | 379 KB | https://sketchfab.com/3d-models/none-95c15555467b455ea9e2e923904e9b60 |

`eachine-e58-web.glb` is what the /v2 home drone and intro load. It is
derived from `eachine-e58.glb` with the glTF-Transform API: the source tilt is
reset on its nodes, the lenses' `KHR_materials_transmission` is removed,
the packed metallic-roughness map is resized to 512 px and the lens maps to
256 px (base colour and normal maps are untouched), and the geometry uses
meshopt (`EXT_meshopt_compression`, high) instead of Draco.

Each is processed with `gltf-transform optimize --texture-compress webp
--texture-size 1024 --compress draco`. Draco alone was not enough: it
compresses geometry but not textures, and `delivery-drone` arrived at 49MB of
which 46.6MB was 13 texture images against 2.7MB of geometry. The full pass
took it to 790KB. Geometry is otherwise unmodified.

The Draco decoder is served from `/public/draco`, copied from
`three/examples/jsm/libs/draco/gltf`.

Textured models keep their own PBR materials by default — flat-tinting them
throws away exactly the detail they were chosen for. The gallery's Retint
toggle overrides that.

## Poly Pizza — CC Attribution (CC-BY)

| File | Source model | Faces | Poly Pizza page |
|---|---|---|---|
| `racing-quad.glb` | "Drone" | 4,564 | https://poly.pizza/m/DNbUoMtG3H |
| `fixed-wing-uav.glb` | "Predator Drone" | 434 | https://poly.pizza/m/3Eio09miiAF |
| `quadcopter.glb` | "Drone" | 2,397 | https://poly.pizza/m/3Ae_y67lzvd |

These ship as light grey plastic and are retinted at runtime.

`quadcopter.glb` is retained on disk but unused: 2,397 faces across 65 meshes
read as visibly faceted on curved surfaces at hero size. Safe to delete once
nothing references it.

**TODO before shipping publicly:** the Poly Pizza creator names are still
missing — confirm each on its model page and list it here and in the footer.
The Sketchfab authors above are confirmed from the API.

## MuJoCo Menagerie — BSD 3-Clause

| File | Model | Source |
|---|---|---|
| `unitree-go2.glb` | Unitree Go2 quadruped | https://github.com/google-deepmind/mujoco_menagerie/tree/main/unitree_go2 |

Built from the menagerie's 16 OBJ visual meshes (themselves converted from
Unitree's public URDF): grouped by body and finish into 13 parts in MuJoCo's
frame (z up, metres; the two feet folded into the calves), welded, simplified
with `gltf-transform simplify --ratio 0.06 --error 0.004` (about 30k triangles
a robot, from about 400k), and compressed with `gltf-transform meshopt
--level high` (81KB). Normals are rebuilt at load with a 30° crease. Its
licence asks that the notice travel with it:

> Copyright (c) 2016-2022 HangZhou YuShu TECHNOLOGY CO.,LTD. ("Unitree Robotics")
> All rights reserved.
>
> Redistribution and use in source and binary forms, with or without
> modification, are permitted provided that the following conditions are met:
>
> * Redistributions of source code must retain the above copyright notice, this
>   list of conditions and the following disclaimer.
> * Redistributions in binary form must reproduce the above copyright notice,
>   this list of conditions and the following disclaimer in the documentation
>   and/or other materials provided with the distribution.
> * Neither the name of the copyright holder nor the names of its
>   contributors may be used to endorse or promote products derived from
>   this software without specific prior written permission.
>
> THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
> AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
> IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
> DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
> FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
> DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
> SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
> CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
> OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
> OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
