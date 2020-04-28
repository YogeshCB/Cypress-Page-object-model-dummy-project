import { Component, h } from "preact";
import { fabric } from "fabric";
import fabricHelpers from "./fabricHelpers";
import { getCropper, getAsset, getGrid, getShadedAreaRects } from "./utils";
import { defaultCanvasOptions } from "./constants";

const filter = new fabric.Image.filters.Grayscale();

export default class Canvas extends Component {
  constructor(props) {
    super(props);
  }

  sendToBackIfPresent(fabricObject) {
    if (fabricObject) {
      this.canvas.sendToBack(fabricObject);
    }
  }

  getObjectById(id) {
    if (this.canvas) {
      return this.canvas.getObjects().filter(o => o.id === id)[0];
    }
  }

  getShadedAreaRectArrayFabric() {
    const right = this.getObjectById("right");
    const left = this.getObjectById("left");
    const bottom = this.getObjectById("bottom");
    const top = this.getObjectById("top");
    return [right, left, bottom, top];
  }

  reorder() {
    const existingObjects = this.canvas.getObjects();
    const asset = existingObjects.filter(o => o.isAsset)[0];
    const cropper = existingObjects.filter(o => o.isCropper)[0];
    const grid = existingObjects.filter(o => o.isGrid)[0];

    // order matters
    [...this.getShadedAreaRectArrayFabric(), cropper, grid, asset].map(obj => this.sendToBackIfPresent(obj));

    if (this.canvas) {
      this.canvas.renderAll();
    }
  }

  triggerEdit() {
    if (this.onModified) {
      const existingObjects = this.canvas.getObjects();
      const asset = existingObjects.filter(o => o.isAsset)[0];
      const bound = asset.getBoundingRect();
      const assetHeight = asset.height * asset.scaleY;
      const assetWidth = asset.width * asset.scaleX;
      const originalAsset = this.props.asset;
      const rotateBy = Math.round(-asset.angle);
      const scale =
        originalAsset.height <= originalAsset.width ? this.canvas.width / originalAsset.width / 3 : this.canvas.height / originalAsset.height / 3;
      const resize = {
        h: Math.round(assetHeight / scale),
        w: Math.round(assetWidth / scale),
        as: "n"
      };

      if (this.props.enableCropper) {
        const cropper = existingObjects.filter(o => o.isCropper)[0];
        const cropperHeight = cropper.height * cropper.scaleY;
        const cropperWidth = cropper.width * cropper.scaleX;
        const x0 = Math.round((cropper.left - bound.left) / scale);
        const y0 = Math.round((cropper.top - bound.top) / scale);
        const x1 = Math.round(x0 + cropperWidth / scale);
        const y1 = Math.round(y0 + cropperHeight / scale);
        this.onModified({
          x0,
          y0,
          x1,
          y1,
          rotateBy,
          resize
        });
      } else {
        this.onModified({
          rotateBy,
          resize
        });
      }
    }
  }

  drawBoundingBox() {
    if (this.canvas) {
      this.canvas.contextContainer.strokeStyle = "white";
      this.canvas.forEachObject(obj => {
        if (obj.isAsset) {
          const bound = obj.getBoundingRect();
          this.canvas.contextContainer.strokeRect(bound.left + 0.5, bound.top + 0.5, bound.width, bound.height);
        }
      });
    }
  }

  componentDidMount() {
    const { canvasOptions = {}, onModified, asset, enableCropper, grid, showGrid } = this.props;
    const mergedCanvasOptions = { ...defaultCanvasOptions, ...canvasOptions };
    this.onModified = onModified;
    this.canvas = new fabric.Canvas(`fabric-canvas`, mergedCanvasOptions);

    this.setState({ canvasLoaded: true });
    const canvasContainer = document.getElementById("canvas-parent");
    if (canvasContainer) {
      this.canvas.setHeight(canvasContainer.clientHeight);
      this.canvas.setWidth(canvasContainer.clientWidth);
    }
    this.canvas.setBackgroundColor(defaultCanvasOptions.backgroundColor, this.canvas.renderAll.bind(this.canvas));

    if (this.canvas) {
      this.canvas.selection = false;
      const cropperFabricObject = fabricHelpers.getFabricObject(getCropper(asset));
      this.canvas.add(cropperFabricObject);
      cropperFabricObject.lockRotation = true;
      cropperFabricObject.center();

      fabric.Image.fromURL(getGrid(asset, grid).imageUrl, fabricObject => {
        const scale =
          fabricObject.height <= fabricObject.width ? this.canvas.width / fabricObject.width / 3 : this.canvas.height / fabricObject.height / 3;
        const assetObject = getGrid(asset, getGrid);
        fabricObject.set({
          ...fabricHelpers.attributeTransformer(assetObject.attributes, assetObject.type, assetObject.subType, fabricObject),
          id: assetObject.id,
          isGrid: true,
          scaleX: scale,
          scaleY: scale,
          centeredScaling: true,
          snapAngle: 90,
          snapThreshold: 5
        });
        this.canvas.add(fabricObject);
        this.canvas.sendToBack(fabricObject);
        this.canvas.centerObject(fabricObject);
        if (showGrid) {
          this.showObject(fabricObject);
        } else {
          this.hideObject(fabricObject);
        }
        this.reorder();
      });

      const cropper = this.canvas.getObjects().filter(o => o.isCropper)[0];

      getShadedAreaRects(asset, this.canvas, cropper).map(rect => {
        this.canvas.add(fabricHelpers.getFabricObject(rect));
      });

      if (!enableCropper) {
        this.showCropper();
      }

      cropperFabricObject.on("moving", this.calculateShadedArea.bind(this));
      cropperFabricObject.on("scaling", this.calculateShadedArea.bind(this));
      cropperFabricObject.on("scaled", this.calculateShadedArea.bind(this));
      cropperFabricObject.on("moved", this.calculateShadedArea.bind(this));

      this.canvas.on("object:modified", this.triggerEdit.bind(this));
      this.canvas.on("after:render", this.drawBoundingBox.bind(this));
      this.canvas.on("object:moving", this.checkBounding.bind(this));
      this.canvas.on("object:moved", this.checkBounding.bind(this));
      this.canvas.on("object:scaled", this.checkBounding.bind(this));
      this.canvas.on("object:rotated", this.checkBounding.bind(this));

      this.reorder();
    }
  }

  checkBounding = () => {
    const existingObjects = this.canvas.getObjects();
    const cropper = existingObjects.filter(o => o.isCropper)[0];
    const asset = existingObjects.filter(o => o.isAsset)[0];
    if (cropper && asset) {
      const bound = asset.getBoundingRect();
      const top = cropper.top;
      const bottom = top + cropper.height * cropper.scaleY;
      const left = cropper.left;
      const right = left + cropper.width * cropper.scaleX;

      const topBound = bound.top;
      const bottomBound = topBound + bound.height;
      const leftBound = bound.left;
      const rightBound = leftBound + bound.width;

      cropper.set({
        left: Math.min(Math.max(left, leftBound), rightBound - cropper.width * cropper.scaleX),
        top: Math.min(Math.max(top, topBound), bottomBound - cropper.height * cropper.scaleY)
      });

      if (cropper.height * cropper.scaleY > bound.height) {
        cropper.set({
          top: topBound,
          height: bound.height,
          scaleY: 1
        });
        this.calculateShadedArea();
      }

      if (cropper.width * cropper.scaleX > bound.width) {
        cropper.set({
          left: leftBound,
          width: bound.width,
          scaleX: 1
        });
        this.calculateShadedArea();
      }
    }
  };

  calculateShadedArea = () => {
    if (this.canvas) {
      const cropper = this.canvas.getObjects().filter(o => o.isCropper)[0];
      const [right, left, bottom, top] = this.getShadedAreaRectArrayFabric();

      if (left && right && bottom && top && cropper) {
        left.set({
          left: 0,
          height: this.canvas.height,
          width: cropper.left
        });

        right.set({
          left: cropper.left + cropper.width * cropper.scaleX,
          height: this.canvas.height,
          width: this.canvas.width - cropper.left - cropper.width * cropper.scaleX
        });

        top.set({
          left: cropper.left,
          height: cropper.top,
          width: cropper.width * cropper.scaleX
        });

        bottom.set({
          left: cropper.left,
          top: cropper.top + cropper.height * cropper.scaleY,
          height: this.canvas.height - cropper.top - cropper.height * cropper.scaleY,
          width: cropper.width * cropper.scaleX
        });
      }
    }
  };

  hideObject(object) {
    if (object) {
      object.set({
        opacity: 0,
        hasControls: false,
        evented: false,
        hasBorders: false
      });
    }
  }

  showObject(object) {
    if (object) {
      object.set({
        opacity: 1,
        hasControls: true,
        evented: true,
        hasBorders: false
      });
    }
  }

  hideCropper() {
    const cropper = this.canvas.getObjects().filter(o => o.isCropper)[0];
    this.hideObject(cropper);
    [...this.getShadedAreaRectArrayFabric()].map(obj => {
      if (obj) {
        obj.set({ opacity: 0 });
      }
    });
  }

  showCropper() {
    const cropper = this.canvas.getObjects().filter(o => o.isCropper)[0];
    this.showObject(cropper);
    [...this.getShadedAreaRectArrayFabric()].map(obj => {
      if (obj) {
        obj.set({ opacity: 0.6 });
      }
    });
  }

  render() {
    const { asset, canvasOptions, enableCropper, showGrid } = this.props;
    const { canvasLoaded } = this.state;
    if (this.canvas) {
      const existingObjects = this.canvas.getObjects();
      const grid = existingObjects.filter(o => o.isGrid)[0];
      const assetObject = getAsset(asset);
      const sameAsset = existingObjects.filter(o => o.isAsset && o.id === assetObject.id)[0];
      const oldAsset = existingObjects.filter(o => o.isAsset && o.id !== assetObject.id)[0];

      this.canvas.remove(oldAsset);

      if (!sameAsset) {
        fabric.Image.fromURL(
          getAsset(asset).imageUrl,
          fabricObject => {
            const scale =
              fabricObject.height <= fabricObject.width
                ? this.canvas.width / fabricObject.width / 3
                : this.canvas.height / fabricObject.height / 3;

            fabricObject.set({
              ...fabricHelpers.attributeTransformer(assetObject.attributes, assetObject.type, assetObject.subType, fabricObject),
              id: assetObject.id,
              isAsset: true,
              scaleX: scale,
              scaleY: scale,
              lockMovementX: true,
              lockMovementY: true,
              centeredScaling: true,
              snapAngle: 90,
              snapThreshold: 5
            });

            if (showGrid) {
              const filter = new fabric.Image.filters.Grayscale();
              fabricObject.filters.push(filter);
              fabricObject.applyFilters();
            }

            const setCoords = fabricObject.setCoords.bind(fabricObject);
            fabricObject.on({
              moving: setCoords,
              scaling: setCoords,
              rotating: setCoords
            });

            this.canvas.add(fabricObject);
            this.canvas.sendToBack(fabricObject);
            this.canvas.centerObject(fabricObject);
            this.reorder();
          },
          { crossOrigin: "anonymous" }
        );
      } else {
        if (showGrid) {
          sameAsset.filters.push(filter);
        } else {
          sameAsset.filters = [];
        }
        sameAsset.applyFilters();
        this.canvas.sendToBack(sameAsset);
      }

      enableCropper ? this.showCropper() : this.hideCropper();
      showGrid ? this.showObject(grid) : this.hideObject(grid);

      this.canvas.renderAll();
    }

    return (
      <div id="canvas-parent" style={{ height: "100%", width: "100%", position: "absolute" }}>
        <canvas id={`fabric-canvas`} style={{ height: "0", width: "0", position: "absolute" }}/>
      </div>
    );
  }
}
