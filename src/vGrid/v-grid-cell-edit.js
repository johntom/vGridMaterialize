/*****************************************************************************************************************
 *    VGridCellEdit
 *    This just inserts the strings into html templates
 *    Created by vegar ringdal
 *
 ****************************************************************************************************************/

export class VGridCellEdit {

  //vars;
  first = -1;
  last= -1;
  editMode = false;
  parent = null;
  element = null;

  constructor(parent) {
    this.parent = parent;
    this.element = parent.element;
    this.addGridKeyListner();
  }



  setCellsFromElement(e, direction) {
    var thisTop;
    var element;
    var x = 10;
    var node = e;
    for (var i = 0; i < x; i++) {
      try {
        //21 march fix, will get bad result if I do it any other way
        if (node.classList.contains(this._private.css.row)) {
          for (var y = 0; y < this._private.htmlCache.rowsArray.length; y++) {
            if (node.style.transform === this._private.htmlCache.rowsArray[y].div.style.transform) {
              thisTop = this._private.htmlCache.rowsArray[y + direction].top;
              element = this._private.htmlCache.rowsArray[y + direction].div;
            }
          }
        }
        node = node.offsetParent;
      } catch (x) {
      }
    }
    //var rowHeight = this._private.rowHeight;
    //var currentRow = Math.round(thisTop / rowHeight);
    if (element) {
      this.cells = element.querySelectorAll("." + this._private.css.cellContent);
    }
    return thisTop;
  };

  setCellsFromTopValue(top) {
    var element = 0;
    for (var i = 0; i < this._private.htmlCache.rowsArray.length; i++) {
      if (this._private.htmlCache.rowsArray[i].top === top) {
        element = this._private.htmlCache.rowsArray[i].div;
      }
    }
    if (element) {
      this.cells = element.querySelectorAll("." + this._private.css.cellContent);
    }

  }



  removeEditCssClasses(element) {
    element.setAttribute("readonly", "false");
    element.classList.remove(this._private.css.editCell);
    element.classList.remove(this._private.css.editCellWrite);
    element.classList.remove(this._private.css.editCellFocus);
  }


  dispatchCellClick(index) {
    var event = new MouseEvent('click', {
      'view': window,
      'bubbles': true,
      'cancelable': true
    });
    this.setAsSingleClick = true;
    this.cells[index].dispatchEvent(event);
  }


  keyDownDelay(callback) {
    if (!this.timer) {
      this.timer = setTimeout(()=> {
        this.timer = null;
        callback();
      }, 150)
    }
  }



  addGridKeyListner() {

    this.element.onkeydown = function (e) {

      //console.log(e.keyCode);



      //page up
      if (e.keyCode === 33) {
        e.preventDefault();
        this.keyDownDelay(() => {
          if (this.curElement) {
            //get scrolltop
            var currentscrolltop = this.gridCtx.getScrollTop();

            //get content height/rows
            var rowHeight = this._private.rowHeight;
            var containerHeight = this._private.htmlCache.content.clientHeight;
            var containerRows = parseInt(containerHeight / rowHeight, 10);
            var buffer = parseInt(containerHeight / 2, 10);
            if (currentscrolltop !== (this._private.configFunctions.getCollectionLength() * rowHeight) - containerHeight) {
              buffer = buffer * 2;
            }

            //get cell with that top
            this.removeEditCssClasses(this.curElement);
            this.top = this.setCellsFromElement(this.curElement, 0);
            this.gridCtx.setScrollTop(currentscrolltop - (containerHeight - buffer));
            var newTop = this.top - (containerRows * rowHeight);
            if ((newTop / rowHeight) <= 0) {
              newTop = 0;
            }
            setTimeout(()=> {
              //need timeout atm here so I can do it after the grid have updated, Todo improve grid generator code
              this.setCellsFromTopValue(newTop);
              this.dispatchCellClick(this.index);
            }, 100)


          }
        });
      }


      //page down
      if (e.keyCode === 34) {
        e.preventDefault();
        this.keyDownDelay(() => {
          if (this.curElement) {
            //get scrolltop
            var currentscrolltop = this.gridCtx.getScrollTop();

            //get content height/rows

            var rowHeight = this._private.rowHeight;
            var containerHeight = this._private.htmlCache.content.clientHeight;
            var containerRows = parseInt(containerHeight / rowHeight, 10);
            var buffer = parseInt(containerHeight / 2, 10);
            if (currentscrolltop !== 0) {
              buffer = buffer * 2;
            }

            //get cell with that top
            this.removeEditCssClasses(this.curElement);
            this.top = this.setCellsFromElement(this.curElement, 0);
            this.gridCtx.setScrollTop(currentscrolltop + (containerHeight - buffer));
            var newTop = this.top + (containerRows * rowHeight);
            if ((newTop / rowHeight) >= this._private.configFunctions.getCollectionLength()) {
              newTop = this._private.configFunctions.getCollectionLength() * rowHeight;
              newTop = newTop - rowHeight
            }
            setTimeout(()=> {
              //need timeout atm here so I can do it after the grid have updated, Todo improve grid generator code
              this.setCellsFromTopValue(newTop);
              this.dispatchCellClick(this.index);

            }, 100)
          }
        });
      }

      //arrow down
      if (e.keyCode === 40) {
        e.preventDefault();
        this.keyDownDelay(() => {
          if (this.curElement) {
            this.removeEditCssClasses(this.curElement);
            this.top = this.setCellsFromElement(this.curElement, +1);
            this.dispatchCellClick(this.index)
          }
        });
      }





      //arrow right
      if (e.keyCode === 39 && !this.editMode) {
        e.preventDefault();
        this.keyDownDelay(() => {
          if (this.curElement) {
            if (!this.last) {
              this.removeEditCssClasses(this.curElement);
              this.dispatchCellClick(this.index + 1)
            }
          }
        });
      }


      //arrow left
      if (e.keyCode === 37 && !this.editMode) {
        e.preventDefault();
        this.keyDownDelay(() => {
          if (this.curElement) {
            if (!this.first) {
              this.removeEditCssClasses(this.curElement);
              this.dispatchCellClick(this.index - 1)
            }
          }
        });
      }



      //arrow up
      if (e.keyCode === 38) {
        e.preventDefault();
        this.keyDownDelay(() => {
          if (this.curElement) {
            this.removeEditCssClasses(this.curElement);
            this.top = this.setCellsFromElement(this.curElement, -1);
            this.dispatchCellClick(this.index)
          }
        });
      }




      //tab and shift key for tabing in other direction
      if (e.keyCode === 9 && e.shiftKey === true) {
        e.preventDefault();
        this.keyDownDelay(() => {
          if (this.curElement) {
            this.removeEditCssClasses(this.curElement);
            this.index = this.index - 1;
            if (this.first) {
              this.index = this.cells.length - 1;
              this.top = this.setCellsFromElement(this.curElement, -1)
            }
            this.dispatchCellClick(this.index)
          }
        });
      }



      //normal tabbing
      if (e.keyCode === 9 && e.shiftKey === false) {
        e.preventDefault();
        this.keyDownDelay(() => {
          if (this.curElement) {
            this.removeEditCssClasses(this.curElement);
            this.index = this.index + 1;
            if (this.last) {
              this.index = 0;
              this.top = this.setCellsFromElement(this.curElement, 1)
            }
            this.dispatchCellClick(this.index)
          }
        });
      }
    }.bind(this)
  }



  elementBlur() {
    this.removeEditCssClasses(this.curElement);
    this.top = this.setCellsFromElement(this.curElement, 0);
    this.callbackDone(this.callbackObject());
    this.editMode = false;
    this.setCellsFromTopValue(this.top);
    this.dispatchCellClick(this.index)
  }



  elementKeyDown() {
    this.curElement.onkeydown = (e) => {
      if (e.keyCode == 13) {
        this.elementBlur();
        return false;
      }
      if (this.readOnly === true && e.keyCode !== 9) {
        return false;
      } else {
        return true;
      }
    };
  }




  callbackObject() {
    return {
      attribute: this.attribute,
      value: this.curElement.value,
      oldValue: this.oldValue,
      element: this.curElement
    };
  }




  elementKeyUp() {
    this.curElement.onkeyup = () => {
      this.callbackKey(this.callbackObject());
    };
  }




  editCellhelper(e, readOnly, callbackDone, callbackKey) {

    if (!this._private) {
      this._private = this.parent.gridContext.ctx._private;
      this.gridCtx = this.parent.gridContext.ctx;
    }

    if (e.target.classList.contains(this._private.css.cellContent)) {

      this.curElement = e.target;
      this.readOnly = readOnly;
      this.callbackDone = callbackDone;
      this.callbackKey = callbackKey;
      this.oldValue = e.target.value;
      this.attribute = e.target.getAttribute(this._private.atts.dataAttribute);
      this.index = this._private.attributeArray.indexOf(this.attribute);
      this.type = e.type;
      this.cells = this.curElement.offsetParent.offsetParent.querySelectorAll("." + this._private.css.cellContent);
      this.row = this.parent.filterRow;

      //override the double click, just to make it simple to focus on correct cell
      if (this.setAsSingleClick) {
        this.setAsSingleClick = false;
        this.type = "click"
      }


      setTimeout(()=> {
        this._private.htmlCache.header.scrollLeft = this._private.htmlCache.content.scrollLeft
      }, 10);


      if (this.index === this.cells.length - 1) {
        this.last = true;
      } else {
        this.last = false;
      }
      if (this.index === 0) {
        this.first = true;
      } else {
        this.first = false;
      }


      e.target.classList.add(this._private.css.editCell);
      e.target.classList.add(this._private.css.editCellWrite);


      if (this.type === "dblclick" || this.editMode) {
        this.editMode = true;
        if(this.readOnly === false){
          if (e.target.classList.contains(this._private.css.editCellFocus)) {
            e.target.classList.remove(this._private.css.editCellFocus);
          }
          e.target.removeAttribute("readonly");//if I dont do this, then they cant enter
        } else {
          e.target.classList.add(this._private.css.editCellFocus);
        }
      } else {
        e.target.classList.add(this._private.css.editCellFocus);
      }

      this.elementKeyUp();
      this.elementKeyDown();
      this.curElement.onblur = (e)=> {
        this.removeEditCssClasses(e.target);
      };

      this.curElement.focus();

    }
  };

}
