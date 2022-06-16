Example App using Three.js and Typescript bundled with parcel 🚀🔥.

Modified from Alberto Adrián Pucheta's repo: https://github.com/adrianrey05/parcel-typescript-threejs

And Academy's node.js typescript starter project.

## Install

```
yarn
```

## Run

in dev mode:

```
yarn run start
```

then open [http://localhost:1234](http://localhost:1234) in your browser.

## Build

```
yarn run build
```

# Road geometry debugging ideas

- Use the normal material (perhaps single-sided if it makes a difference)
- try with just 2 control points
- stretch the curve over, say, 100 world units and visualise the specific positions data we're working with for say 10 segments.
- try with wireframes to count triangles, so we can see triangles vs segments
- try with custom shader with custom info in uv for debugging (e.g. put t in uv.y, or t > 0.5 : 1 : 0)
  - e.g. have a shader represent 0.0, 0.1, 0.2, 0.9 as one of ten colours
- remove normals and UVs so that the BufferGeometry is as simple as possible
