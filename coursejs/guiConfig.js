"use strict";

var GuiConfig = GuiConfig || {};

GuiConfig.textureNames = [
  "tbd",
];

GuiConfig.dropdownOptions = {};

GuiConfig.dropdownOptions.textures = [
  "circuit_pattern.png",
];

// GuiConfig.dropdownOptions.fade = [
//   "None",
//   "Fade",
//   "Box",
// ];

GuiConfig.dropdownOptions.pinned = [
  "None",
  "Corners",
  "OneEdge",
  "TwoEdges",
  "FourEdges",
  "Random",
];


// Each entry of GuiConfig.defs will have one Gui element created for it.
/* Parameters are as follows:
    - folderName: what folder to place this entry in
    - name: text to display as a label for this GUI element
    - param: name of the field of SceneParams to be mutated
    - range: [min, max, step] for numerical-valued fields
    - onChange: a function f(newValue) that applies the results of this
                variable having changed
    - type: optionally a type hint to indicate the type of value being selected
            ("color", "string", "num", "boolean")
*/
GuiConfig.defs = [
  {
    name: "auto rotate",
    param: "rotate",
  },
    /***************************************************
   *             Polygon Properties folder
   ***************************************************/
  {
    folderName: "Polygon Properties",
    name: "Side Length",
    param: "sideLength",
    range: [100, 600, 10],
    onChange: Sim.restartNgon,
  },
  {
    folderName: "Polygon Properties",
    name: "Number vertices",
    param: "nverts",
    range: [3, 10, 1],
    onChange: Sim.restartNgon,
  },
  {
    folderName: "Polygon Properties",
    name: "Dot Size",
    param: "dotSize",
    range: [1, 10, 1],
    onChange: Sim.restartNgon,
  },

   /***************************************************
   *             Chaos Properties folder
   ***************************************************/
  {
    folderName: "Chaos Properties",
    name: "R Parameter",
    param: "r",
    range: [0, 1, 0.1],
    onChange: Sim.restartNgon,
  },
  {
    folderName: "Chaos Properties",
    name: "Restrict Vertices",
    param: "restrict",
    onChange: Sim.restartNgon,
  },

    /***************************************************
   *             Simulation Properties folder
   ***************************************************/
  {
    folderName: "Simulation Properties",
    name: "Fade",
    param: "fade",
    onChange: Sim.restartNgon,
  },
  {
    folderName: "Simulation Properties",
    name: "Pause",
    param: "pause",
  },
  {
    folderName: "Simulation Properties",
    name: "Spin",
    param: "spin",
  },
  // {
  //   // folderName: "Simulation Properties",
  //   name: "Dot Color",
  //   param: "dotColor",
  //   // type: "color",
  //   onChange: Sim.restartNgon,
  // },

    {
    // folderName: "Simulation Properties",
    name: "Background",
    param: "backgroundColor",
    type: "color",
    onChange: Scene.update,
  },

  // {
  //   name: "Speed",
  //   param: "speed",
  //   range: [500, 10000, 500],
  //   onChange: Sim.restartNgon,
  // },
  
  /***************************************************
   *             Scene folder
   ***************************************************/

  /***************************************************
   *             Behavior folder
   ***************************************************/
  
  /***************************************************
   *             Appearance folder
   ***************************************************/
  
   /***************************************************
    *             Top level
    ***************************************************/

    {
      name: "tile",
      param: "tile",
      onClick: Sim.tile,
    },
    {
      name: "Restore defaults",
      param: "restoreDefaults",
      onClick: Params.restoreDefaults,
    }


 ];
