<template>
  <div>
    <treelist
      :data-source="localData"
      :height="'540px'"
      :editable="true"
      :selectable="'row'"
      :columns="columns"
      :toolbar="toolbar"
      :hasChildren="hasChildren"
      @edit="onEdit"
      @save="onSave"
      @remove="onRemove"
      @dataBound="onDataBound"
      @dataBinding="onDataBinding"
      @expand="onExpand"
    >
    </treelist>
  </div>
</template>
<script>
import "@progress/kendo-ui";
import kendo from "@progress/kendo-ui";
import "@progress/kendo-theme-default/dist/all.css";
import { TreeList } from "@progress/kendo-treelist-vue-wrapper";
import { sendRequest } from "./requester.js";

let selectedObj;

export default {
  name: "App",
  components: {
    treelist: TreeList
  },
  data: function() {
    return {
      editable: true,
      columns: [
        { field: "code", title: "Код" },
        { field: "name", title: "Название" },
        {
          field: "redactedDate",
          title: "Дата последнего изменения",
          template:
            "#= redactedDate =='' ? '' : kendo.toString(new Date(redactedDate), ' dd.MM.yyyy hh:mm:ss' )#",
          editable: function() {
            return false;
          }
        },
        {
          field: "createdDate",
          title: "Дата создания",
          template:
            "#= createdDate =='' ? '' : kendo.toString(new Date(createdDate), ' dd.MM.yyyy hh:mm:ss' )#",
          editable: function() {
            return false;
          }
        },
        { command: ["edit", "destroy"] }
      ],
      toolbar: [
        {
          name: "create"
        }
      ],
      localData: new kendo.data.TreeListDataSource({
        transport: {
          read: function(options) {
            sendRequest("read", options);
          },
          update: function(options) {
            sendRequest("update", options);
          },
          create: function(options) {
            let result;
            if (selectedObj != undefined)
              if (
                selectedObj.indexOf("proj#") > -1 &&
                options.data.code.indexOf("proj#") == -1
              )
                result = confirm(
                  'Создать как дочерний выделенного объекта "' +
                    selectedObj +
                    "?"
                );
            options.data.parentName = result ? selectedObj : null;
            options.data.createdDate = new Date();
            options.data.redactedDate = new Date();
            sendRequest("create", options);
          },
          destroy: function(options) {
            sendRequest("destroy", options);
          },
          parameterMap: function(options, operation) {
            console.log("parameterMap");
            if (operation !== "read" && options.models) {
              return { models: kendo.stringify(options.models) };
            }
          }
        },
        editable: true,
        schema: {
          model: {
            fields: [
              { field: "code", title: "Код" },
              { field: "name", title: "Название" },
              {
                field: "redactedDate",
                title: "Дата последнего изменения",
                template:
                  "#= kendo.toString(new Date(redactedDate), ' dd.MM.yyyy hh:mm:ss' )#"
              },
              {
                field: "createdDate",
                title: "Дата создания",
                template:
                  "#= kendo.toString(new Date(createdDate), ' dd.MM.yyyy hh:mm:ss' )#"
              }
            ],
            expanded: false
          }
        }
      }),
      onSave: function(ev) {
        if (ev.sender.select()[0].cells[0].innerText != undefined)
          selectedObj = ev.sender.select()[0].cells[0].innerText;
      }
    };
  },
  methods: {
    parameterMap: function(options, operation) {
      console.log("OK", options, operation);
      if (operation !== "read" && options.models) {
        return { models: kendo.stringify(options.models) };
      }
    },

    onRemove: function(ev) {
      console.log("Event :: remove");
    },
    onDataBound: function(ev) {
      console.log("Event :: dataBound", ev);
    },
    onDataBinding: function(ev) {
      console.log("Event :: dataBinding", ev);
    },
    onExpand: function(e) {
      console.log("expand", e.model.code);
      console.log(selectedObj);
    },
  }
};
</script>
