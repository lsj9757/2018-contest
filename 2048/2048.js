//初始变量
var checker_board=[];//计算罗盘
var grid = document.querySelectorAll(".pattern_grid");//dom罗盘
var scoreDom=document.querySelector("#score");//dom得分
var reInit = document.querySelector("#reInit");//dom重置
var generate_tags=false;//判断是否需要生成
var victory_tags;//判断是否胜利
var score;//得分
var coordX,coordY;//当前鼠标坐标
var base_color={
	"2":"#8FBC8F",
	"4":"#5F9EA0",
	"8":"#66CDAA",
	"16":"#20B2AA",
	"32":"#4682B4",
	"64":"#2E8B57",
	"128":"#008080",
	"256":"#808000",
	"512":"#2F4F4F",
	"1024":"#556B2F",
	"2048":"#006400"
};//数字颜色对应表


//初始游戏函数
init=()=>{
	score=0;victory_tags=false;
	init_calc();
	init_fill(grid,checker_board);
	var New_count= Math.floor(Math.random()*2+2);
	for(var i=0;i<New_count;i++){
		init_random();
	}
}

//初始游戏数据函数
init_calc=()=>{
	for(var i=0;i<4;i++){
		checker_board[i]=new Array();
		for(var j=0;j<4;j++){
			checker_board[i][j]=0;
		}
	}
	for(var i=0;i<grid.length;i++){
		grid[i].innerText="";
	}
}


//数据填入dom罗盘函数
init_fill=(grid,checker_board,score)=>{
	for(var i=0;i<4;i++){
		for(var j=0;j<4;j++){
			if(checker_board[i][j]!=0){
				grid[(i*4)+j].innerText=checker_board[i][j];
				grid[(i*4)+j].style.backgroundColor=base_color[checker_board[i][j]];
			}else{
				grid[(i*4)+j].innerText="";
				grid[(i*4)+j].style.backgroundColor="#F0E68C";
			}
		}
	}
	scoreDom.innerText=score;
}

//初始游戏随机数函数
init_random=()=>{
	var X = Math.floor(Math.random()*4); 
	var Y = Math.floor(Math.random()*4); 
	if(!checker_board[X][Y]&&!grid[(X*4)+Y].innerText){
		var New_number = Math.random(1)>0.5 ? 2 : 4;
		checker_board[X][Y]=New_number;
		init_fill(grid,checker_board,score);
		return true;
	}else{
		return false;
	}
}


init();//初始化游戏开始


//鼠标移动判断方向函数
dir_mouseMove=(lastX,lastY,coordX,coordY)=>{
	if(Math.abs(coordY-lastY)<100&&Math.abs(coordX-lastX)<100) return; //滑动距离太短无视
	else{
		var k =(lastY-coordY)/(lastX-coordX);
		if(k<1&&k>-1){
			if(coordX<lastX){
				action_calc("left");
			}else{
				action_calc("right");
			}
		}else{
			if(coordY<lastY){
				action_calc("up");
			}else{
				action_calc("down");
			}
		}		
	}
}

//鼠标按下函数
dir_mouseDown=(e)=>{
	e=window.event||e;
	coordX = e.clientX;
	coordY = e.clientY;
}


//手势按下函数
dir_touchDown=(e)=>{
	e=window.event||e;
	var touch = e.touches[0];//touch的prototype属性还不一样，真坑
	coordX = touch.clientX;
	coordY = touch.clientY;
}


//鼠标松开函数
dir_mouseUp=(e)=>{
	e=window.event||e;
	var lastX = coordX,lastY = coordY;
	coordX = e.clientX;
	coordY = e.clientY;
	dir_mouseMove(lastX,lastY,coordX,coordY);
}


//手势松开函数
dir_touchUp=(e)=>{
	e=window.event||e;
	var lastX = coordX,lastY = coordY;
	var touch = e.changedTouches[0];//touch的prototype属性还不一样，真坑
	coordX = touch.clientX;
	coordY = touch.clientY;
	dir_mouseMove(lastX,lastY,coordX,coordY);
}



//键盘方向判断函数
dir_keyboard=(e)=>{ 
	e=window.event||e;
	switch(e.keyCode){
    case 37: debounce(action_calc("left"),500);//左键
    break;
    case 38: debounce(action_calc("up"),500);//向上键
    break;
    case 39: debounce(action_calc("right"),500);//右键
    break;
    case 40: debounce(action_calc("down"),500);//向下键
    break;
	}
}

//函数防抖
debounce=(fn, delay)=>{ 
  var timer = null;
  return function() {
    var context = this;
    var args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function() {
      fn.apply(context, args);
    }, delay);
  }
}


document.addEventListener('mousedown',dir_mouseDown,false); //绑定鼠标事件
document.addEventListener('mouseup',debounce(dir_mouseUp,150),false); //绑定鼠标事件
document.addEventListener('touchstart',dir_touchDown,false); //绑定手势事件
document.addEventListener('touchend',debounce(dir_touchUp,150),false); //绑定手势事件
document.addEventListener('keydown',debounce(dir_keyboard,150),false);//绑定键盘事件
reInit.addEventListener('click',debounce(init,150),false);


//二维数组转置函数
action_transpose=(arr)=>{
	var transArray = arr.map((e,i)=>{
		return arr.map((row)=>{
			return row[i];
		})
	});
	return transArray;
}

//正序移动计算结果
action_orderCalc=(checker_board)=>{
	for(var i=0;i<4;i++){
		for(var j=0;j<3;j++){
			for(var k=j+1;k<4;k++){
				if(checker_board[i][j]!=0){
					if(checker_board[i][k]!=0&&checker_board[i][j]==checker_board[i][k]){
						checker_board[i][j]*=2;
						checker_board[i][k]=0;
						generate_tags=true;
						score+=checker_board[i][j];
						if(checker_board[i][j]==2048)victory_tags=true;
						break;
					}else if(checker_board[i][k]!=0&&checker_board[i][j]!=checker_board[i][k]){
						break;
					}
				}else{
					if(checker_board[i][k]!=0){
						checker_board[i][j]=checker_board[i][k];
						checker_board[i][k]=0;
						generate_tags=true;
					}
				}
			}					
		}
	}
	return checker_board;
}


//倒序移动计算结果
action_reorderCalc=(checker_board)=>{
	for(var i=0;i<4;i++){
		for(var j=3;j>0;j--){
			for(var k=j-1;k>-1;k--){
				if(checker_board[i][j]!=0){
					if(checker_board[i][k]!=0&&checker_board[i][j]==checker_board[i][k]){
						checker_board[i][j]*=2;
						checker_board[i][k]=0;
						generate_tags=true;
						score+=checker_board[i][j];
						if(checker_board[i][j]==2048)victory_tags=true; //若得分等于2048则将胜利标记置为true
						break;
					}else if(checker_board[i][k]!=0&&checker_board[i][j]!=checker_board[i][k]){
						break;
					}
				}else{
					if(checker_board[i][k]!=0){
						checker_board[i][j]=checker_board[i][k];
						checker_board[i][k]=0;
						generate_tags=true;
					}
				}
			}					
		}
	}
	return checker_board;
}

//移动随机生成函数
action_generate=()=>{
	var empty=0;//判断罗盘还有多少个格子
	checker_board.map((e,i)=>{
		e.map((x)=>{
			if(x==0){
				empty++;
			}
		});
	});
	//罗盘还有空格子的时候才生成
	if(empty!=0){
		var New_count= Math.floor(Math.random()*3);
		while(empty<New_count){
				New_count--;//使生成的数不多于空格子
			}
		if(New_count>0){
			for(var i=0;i<New_count;i++){
				if(!init_random()) i--;
			}
		}
	}
}

//判断正序是否能移动
action_orderCan=(checker_board)=>{   
    for(var i = 0;i<4;i++)  
        for(var j = 0;j<4;j++)  
            if( checker_board[i][j]!=0&&j!= 0)  
                if( checker_board[i][j-1]==0||checker_board[i][j-1]==checker_board[i][j])  
                    return true;                        
    return false;  
} 

//判断倒序是否能移动 
action_reorderCan=(checker_board)=>{   
    for(var i = 0;i<4;i++)  
        for(var j = 0;j<4;j++)  
            if(checker_board[i][j] !=0 && j != 3)  
                if(checker_board[i][j+1] == 0||checker_board[i][j+1]==checker_board[i][j])  
                    return true;                       
    return false;  
}  


//判输
action_isfail=()=>{
	var judg=checker_board.every((e,i)=>{
		return e.every((x)=>x!=0);
	});
	if(judg){
		if(!action_orderCan(checker_board)&&!action_reorderCan(checker_board)){
			checker_board=action_transpose(checker_board);
			if(!action_orderCan(checker_board)&&!action_reorderCan(checker_board)){
				return false;
			}else{
				checker_board=action_transpose(checker_board);
				return true;
			}
		}else{
			return true;
		}
	}else{
		return true;
	}
	
}


//移动处理函数
action_calc=(dir)=>{
	if(action_isfail()){ //是否游戏失败
		switch(dir){
			case "left":{
				checker_board=action_orderCalc(checker_board);//得到正序计算结果
				init_fill(grid,checker_board,score); //填入dom罗盘
				if(generate_tags==true){ //是否需要生成操作
					action_generate();
					generate_tags=false; //生成之后重新置为false
				}				
				break;
			}
			case "right":{
				checker_board=action_reorderCalc(checker_board);//得到倒序计算结果
				init_fill(grid,checker_board,score); //填入dom罗盘
				if(generate_tags==true){ //是否需要生成操作
					action_generate();
					generate_tags=false; //生成之后重新置为false
				}
				break;
			}
			case "up":{
				checker_board=action_transpose(checker_board); //二维数组转置
				checker_board=action_orderCalc(checker_board); 
				checker_board=action_transpose(checker_board); //操作完成之后重新转置回来
				init_fill(grid,checker_board,score);
				if(generate_tags==true){
					action_generate();
					generate_tags=false;
				}
				break;
			}
			case "down":{
				checker_board=action_transpose(checker_board); //二维数组转置
				checker_board=action_reorderCalc(checker_board);
				checker_board=action_transpose(checker_board); //操作完成之后重新转置回来
				init_fill(grid,checker_board,score);
				if(generate_tags==true){
					action_generate();
					generate_tags=false;
				}
				break;
			}		
		}
		if(victory_tags){	//若有胜利标记则提示游戏胜利
			alert("恭喜您游戏胜利！您的总得分为:"+score);
			init();
		}
	}else{
		alert("游戏失败！您的总得分为:"+score);
		init();
	}
}

