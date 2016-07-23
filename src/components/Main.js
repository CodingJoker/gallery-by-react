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
    }
    class AppComponent extends React.Component {
    	componentWillMount() {
    		var
    		centerImageIndex = Math.floor(Math.random() * imageArr.length),
    		centerImage = imageArr[centerImageIndex]

    		imageArr.splice(centerImageIndex, 1);
    		centerImage.range = 'center';
        //获取随机分区
        for (var i = 0, j = imageArr.length; i < j; i++) {
        	imageArr[i].range = rangeRandom();
        };
        imageArr.splice(centerImageIndex, 0, centerImage);
    };
    render() {
    	return (
    		 < div className = "platform" > {
    		imageArr.map((image, key) => < Image data = { image }
    			key = { key }
    			/>)
    		} < /div>
    		);
    	}
    };

    class Image extends React.Component {
    	constructor(props){
    		super(props);
    		this.handleHover = () => this.handleHover;
    	}
    	state = {
    		position: {
    			left: '0px',
    			top: '0px'
    		},
    		hoverClass:''
    	};
    	componentWillMount() {
    		var
    		rangeName = this.props.data.range,
    		range = positionRange[rangeName],
    		isCenter = rangeName == 'center';

    		this.setState({
    			position: {
    				left: isCenter ? range.l + 'px' : Math.floor(Math.random() * (range.r - range.l) + range.l) + 'px',
    				top: isCenter ? range.t + 'px' : Math.floor(Math.random() * (range.b - range.t) + range.t) + 'px'
    			}
    		});
    	};
    	handelHover(e){
    		console.log('ok')
    		this.setState({
    			hoverClass:'hover'
    		})
    	} ;
    	render() {
    		return(
    			<div className = {"image-box  " + this.state.hoverClass } style ={ this.state.position }>
	    			<div className = "forward"  onClick={this.handlerHover} >
		    			<img src = { this.props.data.imgURL }  alt = {this.props.data.imgName}   />
	    			</div>
	    			<div className = "back">
	    				<span className="name">{this.props.data.imgName}</span>
	    			</div>
    			</div>
    			)
    		}
    	};





    	AppComponent.defaultProps = {};

    	export default AppComponent;
