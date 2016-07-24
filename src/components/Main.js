require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

let imageArr = require('json/image.json');
imageArr = (function getImageUrl(imageDataArr) {
	for (var i = 0, j = imageDataArr.length; i < j; i++) {
		var singleImageData = imageDataArr[i];
		singleImageData.imgURL = require('../images/' + singleImageData.imgName);
		imageDataArr[i] = singleImageData;
	}
	return imageDataArr;
}(imageArr));

var
platformW = window.screen.availWidth,
platformH = window.screen.availHeight,
imgTemp = document.getElementsByTagName("img")[0],
imgW = 210,
imgH = 227,
positionRange = {
        //分区范围
        leftTop: {
        	l: 0,
        	r: platformW/ 2 - imgW,
        	t: 10,
        	b: platformH / 2 - imgH  * 1.5
        },
        rightTop: {
        	l: platformW / 2  + imgW,
        	r: platformW - imgW,
        	t: 10,
        	b: platformH / 2 - imgH * 1.5
        },
        leftBottom: {
        	l: 0,
        	r: platformW / 2 - imgW,
        	t: platformH / 2  + imgH / 2,
        	b: platformH - imgH *  2
        },
        rightBottom: {
        	l: platformW /2  + imgW,
        	r: platformW - imgW ,
        	t: platformH / 2 + imgH / 2,
        	b: platformH - imgH  * 2
        },
        center: {
        	l: (platformW - imgW) / 2,
        	t: (platformH - imgH) / 2
        }
    },
    rangeRandomHock = ['leftTop', 'rightTop', 'leftBottom', 'rightBottom'];
//分区随机函数
var rangeRandom = function() {
	return rangeRandomHock[Math.floor(Math.random() * 4)];
},
    //位置随机函数
    positionRandom = function(range) {
    	var
    	position = {
    		left: Math.floor(Math.random() * (range.r - range.l) + range.l),
    		top: Math.floor(Math.random() * (range.b - range.t) + range.t)
    	}
    	return position;
    },
    //旋转随机函数❤️
    degRandom = function(){
    	return Math.floor(10 - Math.random() * 20);
    }
    class AppComponent extends React.Component {
    	constructor(props){
    		super(props);
    		this.changeCenterImage = this.changeCenterImage.bind(this);
    		this.imageRandom = this.imageRandom.bind(this);
    	}
    	state={
    		imageArr :[]
    	};
    	componentWillMount() {
		this.setState({
					imageArr:this.imageRandom()
				},function(){
					console.log("centerImage: "+ this.state.centerImageIndex);
		});
	};
	render() {
	    	return (
	    		 <div className = "platform">
	    		 	<ImageBox imageArr={this.state.imageArr} changeCenterImage={this.changeCenterImage} />
	    		 </div>
	    		);
	    	};
	imageRandom(index){
	    var
		centerImageIndex = index ||  Math.floor(Math.random() * imageArr.length),
		centerImage = imageArr[centerImageIndex]

		imageArr.splice(centerImageIndex, 1);
		centerImage.range = 'center';
    		    //获取随机分区
	    	    for (var i = 0, j = imageArr.length; i < j; i++) {
	    	    	imageArr[i].range = rangeRandom();
	    	    };
	    	    imageArr.splice(centerImageIndex, 0, centerImage);
	    	    return imageArr;

	};
	changeCenterImage(index){
		var tempArr = this.imageRandom(index);
		console.log(tempArr);
		this.setState({
			imageArr:tempArr
		},function(){
			console.log(this.state.imageArr)
		});
	}
    };

    class ImageBox extends React.Component{
    	render(){
    		return (
    				<div>
	    				{
						this.props.imageArr.map((image, key) => <Image data = { image }
			    			key = { key } index= {key} changeCenterImage = {this.props.changeCenterImage}
			    			/>)
		    			}
	    			</div>
    			)
    	}
    };

    class Image extends React.Component {
    	constructor(props){
    		super(props);
    		this.handelForwardClick =  this.handelForwardClick.bind(this);
    		this.handelBackClick = this.handelBackClick.bind(this);
    	}
    	state = {
    		position: {
    			left: '0px',
    			top: '0px',
    			transform:'rotateZ(30deg)'
    		},
    		hoverClass:'',
    		forwardCtrl:{
    			display:'block'
    		},
    		backCtrl:{
    			display:'none'
    		}
    	};
    	componentWillMount() {
    		var
    		rangeName = this.props.data.range,
    		range = positionRange[rangeName],
    		isCenter = rangeName == 'center';

    		this.setState({
    			position: {
    				left: isCenter ? range.l + 'px' : Math.floor(Math.random() * (range.r - range.l) + range.l) + 'px',
    				top: isCenter ? range.t + 'px' : Math.floor(Math.random() * (range.b - range.t) + range.t) + 'px',
    				transform:isCenter ? '' : 'rotateZ('+degRandom()+'deg)'
    			}
    		});
    	};
    	handelForwardClick(e){
    		if(this.props.data.range != 'center'){
    			console.log(this.props.index);
    			this.props.changeCenterImage(this.props.index);
    		}else{
    			this.setState({
	    			hoverClass:'hover',
	    			backCtrl:{
	    				display:'block'
	    			},
	    			forward:{
	    				display:'none'
	    			}
    			})
    		}
    	} ;
    	handelBackClick(e){
    		this.setState({
    			hoverClass:'',
    			backCtrl:{
    				display:'none'
    			},
    			forward:{
    				display:'block'
    			}
    		});
    	};
    	render() {
    		return(
    			<div className = {"image-box  " + this.state.hoverClass } style ={ this.state.position }>
	    			<div className = "back"  style={this.state.backCtrl} onClick={this.handelBackClick}>
	    				<span className="name">{this.props.data.imgName}</span>
	    			</div>
	    			<div className = "forward" style={this.state.forwardCtrl}  onClick={this.handelForwardClick} >
		    			<img src = { this.props.data.imgURL }  alt = {this.props.data.imgName}   />
	    			</div>
    			</div>
    			)
    		}
    	};





    	AppComponent.defaultProps = {};

    	export default AppComponent;
