const getFabricObject = object => {
	if (object.type === "shape") {
		if (object.subType == "rectangle") {
			return new fabric.Rect({
				...object.attributes,
				id: object.id,
				type: object.type,
				isCropper: object.isCropper
			});
		} else if (object.subType == "circle") {
			return new fabric.Circle({
				...object.attributes,
				id: object.id,
				type: object.type
			});
		} else if (object.subType == "polygon") {
			return new fabric.Polygon(object.points, {
				...object.attributes,
				id: object.id,
				type: object.type
			});
		}
	} else if (object.type === "text") {
		return new fabric.IText(object.value, {
			...object.attributes,
			id: object.id,
			type: object.type
		});
	}
	return object;
};

const attributeTransformer = (attributes, type, subType, fabricObject) => {
	if (type === "image") {
		return {
			...attributes,
			height: fabricObject.height,
			width: fabricObject.width,
			scaleY: attributes.height ? attributes.height / fabricObject.height : 1,
			scaleX: attributes.width ? attributes.width / fabricObject.width : 1
		};
	}
	return attributes;
};

export default {
	attributeTransformer,
	getFabricObject
};
