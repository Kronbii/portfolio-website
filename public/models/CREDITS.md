# 3D model credits

Attribution is required wherever these are displayed publicly.

## Sketchfab — CC Attribution 4.0 (http://creativecommons.org/licenses/by/4.0/)

| File | Model | Author | Faces | Size | Source |
|---|---|---|---|---|---|
| `eachine-e58.glb` | Eachine E58 Pocket Drone - Game Ready Asset | [the_Thorminator](https://sketchfab.com/the_Thorminator) | 20,758 | 386 KB | https://sketchfab.com/3d-models/none-95c15555467b455ea9e2e923904e9b60 |
| `eachine-e58-web.glb` | Eachine E58 Pocket Drone (web build of the row above) | [the_Thorminator](https://sketchfab.com/the_Thorminator) | 20,758 | 379 KB | https://sketchfab.com/3d-models/none-95c15555467b455ea9e2e923904e9b60 |

`eachine-e58-web.glb` is what the home page's drone and the intro load. It is
derived from `eachine-e58.glb` with the glTF-Transform API: the source tilt is
reset on its nodes, the lenses' `KHR_materials_transmission` is removed,
the packed metallic-roughness map is resized to 512 px and the lens maps to
256 px (base colour and normal maps are untouched), and the geometry uses
meshopt (`EXT_meshopt_compression`, high) instead of Draco.

`eachine-e58.glb` (Draco geometry) is kept for the drone-swarm closing shot in
the backlog; nothing on the site loads it today.

The Draco decoder is served from `/public/draco`, copied from
`three/examples/jsm/libs/draco/gltf`.



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
