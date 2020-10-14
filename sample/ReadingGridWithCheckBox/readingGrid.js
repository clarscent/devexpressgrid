var Grid = {
    config: {
        setGrid : function (gridId, header, headerCss) {
            Header.config.setHeaders(gridId, header, headerCss);
        },

        setGridData: function (gridId, data) {
            $(gridId).dxDataGrid({dataSource:data});
        },

        setEditMode : function (gridId, addMode, updateMode, deleteMode, selMode) {
            $(gridId).dxDataGrid({
                editing: {
                    mode: "batch",
                    allowAdding: addMode,
                    allowUpdating: updateMode,
                    allowDeleting: deleteMode
                },

                selection: {
                    mode: selMode
                },

            });
        },

    },

    method: {
        getGridInstance : function (gridId) {
            return $(gridId).dxDataGrid('instance');
        },

        getGridData : function (gridId) {
            let gridItems = Grid.method.getGridInstance(gridId)._controllers.data._dataSource._items;
            console.log("gridItems", gridItems);
        },

        getCheckedData : function (gridId) {
            let selectedRowsData = $(gridId).dxDataGrid("instance").getSelectedRowsData();
            console.log("selectedRowsData", selectedRowsData);
        },

        addRow : function (gridId, data) {
            var dataSource = $(gridId).dxDataGrid("instance").getDataSource();
            dataSource.store().insert(data).then(function() {
                dataSource.reload();
            });
        }
    }
}

var Header = {
    config: {
        setHeaders : function (gridId, header, css) {
            if (css == null) {
                css = new Array()
            }
            header = Header.method.__mergeHeaderTemplate(header, css);
            $(gridId).dxDataGrid({columns: header});
            Grid.config.setEditMode(gridId, true, true, true, "multiple");
        }
    },

    method: {
        __mergeHeaderTemplate : function (header, css) {
            for (let k = 0 ; k < header.length ; k++) {
                header[k].headerCellTemplate = function (header, info) {
                    header.append(
                        $("<div>")
                            .html(info.column.caption.replace(/\n/g, "<br/>"))
                    );
                    for (let j = 0 ; j < css.length ; j++) {
                        header.parent().css(css[j].attr, css[j].value);
                    }
                }

                if (header[k].columns != null) {
                    header[k].columns = this.__mergeHeaderTemplate(header[k].columns, css);
                }
            }
            return header;
        },

    }
}

var Attribute = function (attr, value) {
    return {attr: attr, value: value};
}
