"use strict";

var GuiConfig = GuiConfig || {};

GuiConfig.textureNames = [
  "tbd",
];

GuiConfig.dropdownOptions = {};

GuiConfig.dropdownOptions.textures = [
  "circuit_pattern.png",
];

GuiConfig.dropdownOptions.objects = [
  "None",
  "Sphere",
  "Box",
];

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
  /***************************************************
   *                Top level
   ***************************************************/
  {
    name: "Side Length",
    param: "sideLength",
    range: [100, 800, 20],
    onChange: Sim.restartTriangle,
  },
  {
    name: "R Parameter",
    param: "r",
    range: [0, 1, 0.1],
    onChange: Sim.restartTriangle,
  },
  {
    name: "Speed",
    param: "speed",
    range: [250, 1500, 250],
    onChange: Sim.restartTriangle,
  },
  {
    name: "Dot Size",
    param: "dotSize",
    range: [1, 10, 1],
    onChange: Sim.restartTriangle,
  },
  
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
  //  {
  //    name: "Restart simulation",
  //    param: "restartCloth",
  //    onClick: Sim.restartTriangle,
  //  },
   {
     name: "Restore defaults",
     param: "restoreDefaults",
     onClick: Params.restoreDefaults,
   }
 ];
