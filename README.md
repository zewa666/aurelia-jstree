# aurelia-jstree
An Aurelia wrapper component for [jsTree](https://www.jstree.com/).

## Install
Make sure to npm install jQuery and jsTree alongside this wrapper.

```bash
npm install jquery jstree aurelia-jstree --save
```

## Aurelia CLI Support
If your Aurelia CLI build is based on RequireJS or SystemJS you can setup the plugin using the following dependency declaration:

```json
...
"dependencies": [
  {
    "name":"jquery",
    "path":"../node_modules/jquery/dist",
    "main":"jquery.min",
    "export": "$"
  },
  {
    "name":"jstree",
    "path":"../node_modules/jstree/dist",
    "main":"jstree.min"
  },
  {
    "name": "aurelia-jstree",
    "path": "../node_modules/aurelia-jstree/dist/amd",
    "main": "index"
  }
]
```

## Configuration
In your `main.ts` you'll have to load jstree and register the plugin:

```typescript
import {Aurelia} from 'aurelia-framework'
import environment from './environment';
import "jstree"; // <------------ MAKE SURE TO IMPORT JSTREE

export function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    .feature('resources');

  ...

  aurelia.use.plugin("aurelia-jstree");  // <----- REGISTER THE PLUGIN

  aurelia.start().then(() => aurelia.setRoot());
}
```


## Usage
Once the plugin is installed and configured you can use the `au-js-tree` custom component.
An example for a simple filebrowser is provided below:

```html
<au-js-tree settings.bind="jstreeConfig"
            data.bind="data"
            selection-changed.bind="onSelectionChanged"
            node-moved.bind="onNodeMoved"></au-js-tree>
```

The `settings.core` should not contain the `data` property. It should be provided
separately via the `data binding` to ensure proper re-renders on prop changes.

```typescript
export class App {
  public jstreeConfig = {
    plugins: ["dnd"],
    core: {
      check_callback: function (operation, node, node_parent, node_position, more) {
        // operation can be 'create_node', 'rename_node', 'delete_node', 'move_node' or 'copy_node'
        console.log(operation);
        if (operation === "move_node") {
          console.group("D&D");
          console.log("node", node);
          console.log("parent", node_parent);
          console.log("position", node_position);
          console.log("more", more);
          console.log(node_parent.original.isFolder);
          console.groupEnd();
          
          return node_parent.original.isFolder === true; //only allow dropping inside folders
        }
        return true;  //allow all other operations
      }
    },
    dnd: {
      check_while_dragging: true
    }
  }

  public data = [
    {
      text: "Root folder",
      state: { opened: true },
      isFolder: true,
      children: [
        {
          text: "File 1",
          state: { selected: true },
          icon: "jstree-file"
        },
        {
          text: "File 2",
          icon: "jstree-file"
        },
        {
          text: "Subfolder",
          state: { opened: false },
          icon: "jstree-folder",
          children: [],
          isFolder: true
        }
      ]
    }
  ];

  onSelectionChanged = (e: JQueryEventObject, data: any) => {
    console.group("Selection was changed");
    console.log(this);
    console.log(e);
    console.log(data);
    console.groupEnd();
  }

  onNodeMoved = (e: JQueryEventObject, data: JsTreeNodeMovedData) => {
    console.group("Node was moved");
    console.log(e);
    console.log(data);
    console.groupEnd();
  }
}
```


## Acknowledgement
Thanks goes to Dwayne Charrington for his Aurelia-TypeScript starter package https://github.com/Vheissu/aurelia-typescript-plugin
