let  pieDetailLabelFormat = {
    category:'<b>{point.name}</b>',
    value:'<b>{point.y}</b>',
    percent:'{point.percentage:.1f} %',
    categoryPercent:'<b>{point.name}</b>:<br>{point.percentage:.1f} %',
    valuePercent:'{point.y} ({point.percentage:.1f} %)',
    all:'<b>{point.name}</b>:<br>{point.y} ({point.percentage:.1f} %)',
};

export const legendConvert = function(obj){
	let legends = {};
	if(obj.show.value){
		let layout = obj.legendPosition.value.split('-');
		legends = {
			enabled: true,
			layout: layout[0],
			align: 'center',
			verticalAlign: layout[1],
			itemMarginTop: 1,
			itemMarginBottom: 1
		};
	}else{
		legends = {
			enabled: false
		};
	}
	return legends;
}
export const titleConvert = function(obj){
	let title = {};
	if(obj.show.value){
		title = {
			align: obj.alignment.value,
			text: obj.titleText.value,
			style:{
				// fontFamily: obj.fontFamily.value,
				fontSize: obj.textSize.value,
				color: obj.fontColor.value
			}
		};
	}else{
		title = {
			text:null
		};
	}
	return title
}
export const pieDetailLabelConvert = function(obj){
	let pieDetailLabel = {}
	if(obj.show.value){
		pieDetailLabel = {
			enabled: true,
			format: pieDetailLabelFormat[obj.pieLableStyle.value]
		};
	}else{
		pieDetailLabel = {
			enabled: false
		};
	}
	return pieDetailLabel
}
 export const generalConvert = function(obj){
	 let general = {}
	 return general
 }