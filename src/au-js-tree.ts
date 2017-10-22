import { bindable, customElement } from "aurelia-templating";
import * as $ from "jquery";

@customElement("au-js-tree")
export class AuJsTree {
  @bindable() settings: JSTreeStaticDefaults;
  @bindable() data: any;

  // Event Handlers
  @bindable() selectionChanged: (event: JQueryEventObject, data: JsTreeSelectionChangedData) => void;
  @bindable() nodeMoved: (event: JQueryEventObject, data: JsTreeNodeMovedData) => void;

  public renderHost: HTMLDivElement;
  public instance: JSTree;

  public attached() {
    const settings = Object.assign({}, this.settings);

    if (this.data) {
      settings.core.data = this.data;
    }

    this.instance = $(this.renderHost).jstree(settings);
    (this.instance as any).on("select_node.jstree",
      (e: JQueryEventObject, data: JsTreeSelectionChangedData) => this.selectionChanged(e, data));

    (this.instance as any).on("move_node.jstree",
      (e: JQueryEventObject, data: JsTreeNodeMovedData) => this.nodeMoved(e, data));
  }

  public settingsChanged(newValue: JSTreeStaticDefaults) {
    if (this.instance) {
      ($(this.renderHost).jstree(true) as any).settings = newValue;
      $(this.renderHost).jstree(true).refresh(false, false);
    }
  }

  public dataChanged(newValue: any) {
    if (this.instance) {
      console.log(($(this.renderHost).jstree(true) as any).settings.core.data);
      console.log(newValue);
      ($(this.renderHost).jstree(true) as any).settings.core.data = newValue;
      $(this.renderHost).jstree(true).refresh(false, false);
    }
  }
}


export interface JsTreeSelectionChangedData {
  node: JsTreeNode;
}

export interface JsTreeNodeMovedData {
  node: JsTreeNode;
  // parents id
  parent: string;
  // position among children of parent node
  position: number;
  // id of the old parent
  old_parent: string;
  old_position: number;
  is_multi: boolean;
  old_instance: JSTree;
  new_instance: JSTree
}

export interface JsTreeNode {

}

export interface JsTreeJqEvent extends JQueryEventObject {

}
