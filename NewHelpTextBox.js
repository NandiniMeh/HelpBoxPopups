define( [ "qlik" ], function ( qlik) {
'use strict';
var list=[];

// getList() adds names of all objects in the current sheet (except the helpbox extension) to list.
function getList() {
     list = [];
     var Lvalues = [];
	 var app = qlik.currApp(this);
         var currentSheetId = qlik.navigation.getCurrentSheetId();
         app.getAppObjectList( 'sheet', function(reply){  
         $.each(reply.qAppObjectList.qItems, function(key, value) {
          if(currentSheetId.sheetId==value.qInfo.qId){  
              for(var counter = 0; counter < value.qData.cells.length; counter++) {
			    if (value.qData.cells[counter].type != 'NewHelpTextBox') {
				  Lvalues.value = value.qData.cells[counter].name;
				  Lvalues.label = value.qData.cells[counter].name;
				  list.push(Lvalues);
				  Lvalues = [];
				}
			  }
          }
       });
    });
}

getList();
return {
		definition: {
			type: "items",
			component: "accordion",
			items: {
				HelpBoxInfo: {
                    type: "array",
					ref: "modals",
					label: "Help Text Box Info",
					itemTitleRef: "BoxTitle",
					allowAdd: true,
					allowRemove: true,
					addTranslation: "Add Dialog",
					items: {
                        ShowBoxTitle: {
                            type: "boolean",
                            component: "switch",
                            label: "Show box title",
                            ref: "ShowBoxTitle",
                            options: [{
                                value: true,
                                label: "On"
                            }, {
                                value: false,
                                label: "Off"
                                }],
                            defaultValue: false
                        },
						BoxTitle: {
                            ref: "BoxTitle",
							label: "Help Box Title",
							type: "string",
							defaultValue: "Title",
							expression: "optional",
                        },
						BoxWidth: {
                            ref: "BoxWidth",
							label: "Width of box as % of window",
							type: "string",
							defaultValue: "20",
							expression: "optional"
						},
						BoxHeight: {
                            ref: "BoxHeight",
                            label: "Height of box as % of window",
							type: "string",
							defaultValue: "20",
							expression: "optional"
						},
						HelpText: {
							label: "HTML Help Text",
							component: "textarea",
							rows: 7,
							maxlength: 100000,
                            ref: "HelpText",
							expression: "optional",
						},
						
						HelpBoxModal: {
                            type: "boolean",
                            component: "switch",
                            label: "Modal",
                            ref: "HelpBoxModal",
                            options: [{
                                value: true,
                                label: "On"
                            }, {
                                value: false,
                                label: "Off"
                            }],
                            defaultValue: false
                        },
						
						Objects: {
						  type: "string",
						  component: "dropdown",
						  label: "Objects",
						  ref: "Objects",
						  options : function() {
						  debugger;
						  return list;
						  },
						  
						  defaultValue: "Select"
						},
						
						xOffset: {
                            ref: "xOffset",
                            label: "Enter x offset",
							type: "string",
							defaultValue: "0",
							expression: "optional"
						},
						
					    yOffset: {
                            ref: "yOffset",
                            label: "Enter y offset",
							type: "string",
							defaultValue: "0",
							expression: "optional"
						},


		
				   }
				},
				settings: {
					uses: "settings",
					items: {
						HelpIcon:{
							label:"Help Icon Settings",
							type:"items",
							items:{
                                HelpIconColor: {
                                    type: "string",
									label: "Help Icon Color Expression",
                                    ref: "HelpIconColor",
                                    expression: "optional"
								},
                                HelpIconSize: {
                                    type: "string",
                                    component: "dropdown",
                                    label: "Help Icon Size",
                                    ref: "HelpIconSize",
                                    options: [{
                                        value: "2",
                                        label: "Large (20px)",
                                        tooltip: "Large icon"
                                    }, {
                                        value: "1",
                                        label: "Medium (16px)",
                                        tooltip: "Medium icon"
                                    }, {
                                        value: "0",
                                        label: "Small (12px)",
                                        tooltip: "Small icon"
                                    }],
                                    defaultValue: "1"
                                }
                            }
						},
					}
				}
			}
		},
		support: {
			snapshot: false,
			export: false,
			exportData: false
		},
		
		paint: function ($element, layout) {
		
		    var templateHTML = '';
			var linkHTML = '';
			var objectID = layout.qInfo.qId;
			var arr = new Array();
			
			// linkHTML creates question mark icon for extension
			linkHTML += ' <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"> ';
			linkHTML += ' <i class="fa fa-question-circle view-dialogs" style="font-size:30px;color:red"></i> ';
			linkHTML += ' </span> '

			$element.html(linkHTML);

            // For each modal created in properties, new HTML template created and added to an array
			$.each(layout.modals, function (k, v) {
			templateHTML += '<div id="help-box-modal-background-' + objectID + k + '" class="lui-modal-background" style="display: none;"></div>';
		    templateHTML += '<div id="help-box-container-' + objectID + k + '" style="display: none;">';
            templateHTML += '  <div id="help-box-content-' + objectID + k + '" style="">';
            templateHTML += '    <div class="lui-dialog dialog-content"  style="">';
            templateHTML += '      <div class="lui-dialog__header" style="' + (layout.modals[k].ShowBoxTitle ? '': 'display:none;') + '">';
            templateHTML += '        <div class="lui-dialog__title" id="Dialog-Title' + objectID + k + '"></div>';
            templateHTML += '      </div>';
            templateHTML += '      <div id="help-text-' + objectID + k + '" class="lui-dialog__body"></div>';
            templateHTML += '  </div>';
            templateHTML += '</div>';
			templateHTML += '</div>';
			
			arr.push(templateHTML);
			templateHTML = '';
			});
			
			$.each(arr, function (k,v) {
			if ($('#help-box-container-' + objectID + k).length == 0) {
                $('#grid').append(arr[k]);
            }
			
			$(".view-dialogs").click(function () {
			
			if ($( ".view-dialogs" ).hasClass( 'selection' )) {
				$( ".view-dialogs" ).removeClass( 'selection' );
				$.each(layout.modals, function (k, v) {
				$('#help-box-container-' + objectID + k).css("display", "none");
                $('#help-box-modal-background-' + objectID + k).css("display", "none");
				});
			 } else {
			$( ".view-dialogs" ).addClass( 'selection' );
			$.each(layout.modals, function (k, v) {
			if (layout.modals[k].HelpBoxModal) {
			$("#help-box-container-" + objectID + k).css("border", "200px");
            $("#help-box-container-" + objectID + k).css("border-color", "#3a9321");
            $("#Dialog-Title" + objectID + k).html(layout.modals[k].BoxTitle);
		    $("#help-box-container-" + objectID + k).css("display", "");
            $(".dialog-content").css("width", layout.modals[k].BoxWidth + "%");
			$("#help-box-container-" + objectID + k).css("position", "absolute");
			$("#help-box-container-" + objectID + k).css("right","80%");
			$("#help-text-" + objectID + k).show().css("height", ((layout.modals[k].BoxHeight / 100) * window.innerHeight) + "px").html(layout.modals[k].HelpText);
			    }
			  });
			 }
			});
			

		// Function to adjust left and top CSS properties of each box to display on top of selected object
	     var x_box;
		 var y_box;
		 var counter = 0;
		 var app = qlik.currApp(this);
         var currentSheetId = qlik.navigation.getCurrentSheetId();
         app.getAppObjectList( 'sheet', function(reply){  
         $.each(reply.qAppObjectList.qItems, function(key, value) {
          if(currentSheetId.sheetId==value.qInfo.qId){  
              for(var counter = 0; counter < value.qData.cells.length; counter++) {
			    if (value.qData.cells[counter].name == layout.modals[k].Objects) {
				  x_box = value.qData.cells[counter].bounds.x + parseInt(layout.modals[k].xOffset);
		          $("#help-box-container-" + objectID + k).css("left", x_box + "%");
				  y_box = value.qData.cells[counter].bounds.y + parseInt(layout.modals[k].yOffset);
				  $("#help-box-container-" + objectID + k).css("top", y_box + "%");
				}
			  }
           }
       });
    });;
	       			
	});

			//needed for export
			return qlik.Promise.resolve();
		}
	};

} );

