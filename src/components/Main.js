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
    		this.centerInverse = this.centerInverse.bind(this);
    	}
    	state={
    		imageArr :[]
    	};
    	constant={
    	};
    	componentDidMount() {
    		this.constant.platformW = window.screen.availWidth;
    		this.constant.platformH = window.screen.availHeight;

    		this.constant.imgW = 210;
    		this.constant.imgH = 280;
    		this.constant.positionRange = {
    		        //分区范围
    		        leftTop: {
    		        	l: 0,
    		        	r: this.constant.platformW/ 2 - this.constant.imgW,
    		        	t: 10,
    		        	b: this.constant.platformH / 2 - this.constant.imgH  * 1.5
    		        },
    		        rightTop: {
    		        	l: this.constant.platformW / 2  + this.constant.imgW,
    		        	r: this.constant.platformW - this.constant.imgW,
    		        	t: 10,
    		        	b: this.constant.platformH / 2 - this.constant.imgH * 1.5
    		        },
    		        leftBottom: {
    		        	l: 0,
    		        	r: this.constant.platformW / 2 - this.constant.imgW,
    		        	t: this.constant.platformH / 2  + this.constant.imgH / 2,
    		        	b: this.constant.platformH - this.constant.imgH *  3
    		        },
    		        rightBottom: {
    		        	l: this.constant.platformW /2  + this.constant.imgW,
    		        	r: this.constant.platformW - this.constant.imgW ,
    		        	t: this.constant.platformH / 2 + this.constant.imgH / 2,
    		        	b: this.constant.platformH - this.constant.imgH  * 3
    		        },
    		        center: {
    		        	l: (this.constant.platformW - this.constant.imgW) / 2,
    		        	t: (this.constant.platformH - this.constant.imgH) / 2
    		        }
    		    };
		this.setState({
					imageArr:this.imageRandom()
				});
	};
	render() {
			var imagesAndNavIcon = this.state.imageArr.map((image, key) =>
                                <Image data = { image }
    			key = { key } index= {key} changeCenterImage = {this.changeCenterImage}
    			 centerInverse = {this.centerInverse}  ref={'image'+key}/>
                            )
                                var navIcons = this.state.imageArr.map((image,key) =>
                                    <NavIcon data={image} key={key} changeCenterImage = {this.changeCenterImage}
                                    centerInverse = {this.centerInverse}  index={key}/>
                                )
	    	return (
	    		 <div className = "platform">
	    		 	{imagesAndNavIcon}
                                        <div className="ctrl-bar">
                                         {navIcons}
                                        </div>
	    		 </div>
	    		);
	    	};

	imageRandom(index){
	    var
		centerImageIndex = index ||  Math.floor(Math.random() * imageArr.length),
		centerImage = imageArr[centerImageIndex]

		imageArr.splice(centerImageIndex, 1);
		centerImage.range = 'center';
		centerImage.position={
			left:this.constant.positionRange['center'].l,
			top:this.constant.positionRange['center'].t,
			'zIndex': '101',
			'isInverse':false
		};
    		    //获取随机分区
	    	    for (var i = 0, j = imageArr.length; i < j; i++) {
	    	    	imageArr[i].range = rangeRandom();
	    	    	var range = this.constant.positionRange[imageArr[i].range];
	    	    	imageArr[i].position = {
	    	    		left:Math.floor(Math.random() * (range.r - range.l) + range.l) + 'px',
	    	    		top:Math.floor(Math.random() * (range.b - range.t) + range.t) + 'px',
    				transform:'rotateZ('+degRandom()+'deg)',
	    	    	};
	    	    };
	    	    imageArr.splice(centerImageIndex, 0, centerImage);
	    	    return imageArr;

	};
	changeCenterImage(index){
		var tempArr = this.imageRandom(index);
		this.setState({
			imageArr:tempArr
		},);
	};
	centerInverse(index){
		var tempArr = this.state.imageArr;
		tempArr[index].isInverse = ! tempArr[index].isInverse;
		this.setState({
			imageArr:tempArr
		})
	};
    };


    class Image extends React.Component {
    	constructor(props){
    		super(props);
    		this.handelForwardClick =  this.handelForwardClick.bind(this);
    		this.handelBackClick = this.handelBackClick.bind(this);
    	}

    	handelForwardClick(e){
    		if(this.props.data.range != 'center'){
    			this.props.changeCenterImage(this.props.index);
    		}else{
    			this.props.centerInverse(this.props.index);
    		}
    	} ;
    	handelBackClick(e){
    		this.props.centerInverse(this.props.index);
    	};
    	render() {
    		var
    			position =  this.props.data.position,
    			inverse =  this.props.data.range== 'center' && this.props.data.isInverse ? 'inverse' : '' ;
    		return(
    			<div className = {"image-box  " + inverse }  style ={ position }>
	    			<div className = "back"   onClick={this.handelBackClick}>
	    				<span className="name">{this.props.data.imgName}</span>
	    			</div>
	    			<div className = "forward"   onClick={this.handelForwardClick} >
		    			<img src = { this.props.data.imgURL }  alt = {this.props.data.imgName}   />
	    			</div>
    			</div>
    			)
    		}
    	};

        class NavIcon extends React.Component{
            constructor(props){
                super(props);
                this.handleClick = this.handleClick.bind(this);
            };
            handleClick(e){
            	if(this.props.data.range == 'center')
            	      this.props.centerInverse(this.props.index);
                	else
                	      this.props.changeCenterImage(this.props.index);
            }
            render(){
                var reset = this.props.data.range == 'center' ? 'center-nav' : '';
                return (
                        <span className={"nav-icon "+ reset} onClick={this.handleClick}></span>
                    )
            }
        };



    	AppComponent.defaultProps = {};

    	export default AppComponent;
