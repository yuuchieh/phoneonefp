let initialX = 0,
  initialY = 0;
let moveElement = false;
let isMouseDown = false;
// Outer元素的範圍
let outerElem = document.querySelector(".outer");
let outerRect = outerElem.getBoundingClientRect();
var editButton = document.getElementById('editButton');

var win = window;
var MINWIDTH = 200; // 定义常量最小宽度
var defaults = {
    selector: '.downer, [downer]',
    maxWidth: true,
    whenDisabled: function () {
        return win.imgResizable === false || document.imgResizable === false;
    },
    minWidth: MINWIDTH,
    // 拖拽完成
    onFinish: function () {}
};


var params = {};
for (var key in defaults) {
    params[key] = defaults[key];
}

// 存放临时数据的地方
var store = {};
// 匹配目标元素的选择器
var strSelector = params.selector;
var strSelectorImg = strSelector.split(',').map(function (selector) {
    return 'img' + selector.trim();
}).join();
var strSelectorActive = strSelector.split(',').map(function (selector) {
    return selector.trim() + '.active';
}).join();

// 载入必要的 CSS 样式
var eleStyle = document.createElement('style');
var strSvg = "data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke='%23914AFF' d='M2.5 2.5h25v25h-25z'/%3E%3Cpath d='M0 0v12h2V2h10V0H0zM0 30V18h2v10h10v2H0zM30 0H18v2h10v10h2V0zM30 30H18v-2h10V18h2v12z' fill='%23914AFF'/%3E%3C/svg%3E";
eleStyle.innerHTML = strSelectorImg + '{display:inline-block;vertical-align: bottom;font-size:12px;border: 3px solid transparent;margin:-1px;position: relative;-webkit-user-select: none; user-select: none; }' + strSelectorActive + '{border-image: url("' + strSvg + '") 12 / 12px / 0; cursor: default; z-index: 1;}';
document.head.appendChild(eleStyle);

// document.addEventListener('DOMContentLoaded', function() {
  
//     previewButton.addEventListener('click', function() {
//       var canvas = document.createElement('canvas');
//       var context = canvas.getContext('2d');
      
//       // 設定 canvas 的寬度和高度
//       canvas.width = upper.offsetWidth;
//       canvas.height = upper.offsetHeight;
  
//       // 繪製下層圖片
//       context.drawImage(
//         downer, 
//         0, 0, //從downer的x,y開始畫
//         714,1280, //畫downer多大
//         0,0, //從新圖片的x,y開始畫
//         714, 2000, //畫多大
//       );
      
//       // 繪製上層圖片
//       context.drawImage(upper, 0, 0, upper.width, upper.height);
  
//       // 取得合成後的圖片 URL
//       var compositeImageURL = canvas.toDataURL();
  
//       // 預覽合成後的圖片
//       var previewWindow = window.open();
//       previewWindow.document.write('<img src="' + compositeImageURL + '">');
//     });
// });

// 先點擊編輯，进入可拉伸状态
document.addEventListener('DOMContentLoaded', function() {
    var upper = document.querySelector('.upper');
    var downer = document.querySelector('.downer');
    var editButton = document.getElementById('editButton');
    var previewButton = document.getElementById('previewButton');
    var downer = document.querySelector('.downer');
    var isActive = false;
    
    // 先點擊編輯，进入可拉伸状态
    editButton.onclick = ()=>{
        isActive = !isActive; // 切換狀態
      
        if (isActive) {
          downer.classList.add('active');
          editButton.textContent = '取消';
          // 進入拉伸狀態的相應程式碼
        } else {
          downer.classList.remove('active');
          editButton.textContent = '編輯';
          // 退出拉伸狀態的相應程式碼
        }
    }

    //點擊預覽
    previewButton.onclick = ()=>{
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        
        // 設定 canvas 的寬度和高度
        canvas.width = upper.width-4;
        canvas.height = upper.height;
        
        // 繪製下層圖片
        context.drawImage(
            downer, 
            -100, 0, //從downer的x,y開始畫
            380,380, //話來源的多少長寬
        );

        // 繪製上層圖片
        context.drawImage(upper,
            0, 0,
            upper.width, upper.height,
        );
    
        // 取得合成後的圖片 URL
        var compositeImageURL = canvas.toDataURL();
    
        const preview = document.querySelector('.popup-image');
        const img = preview.querySelector('img');
        img.src = compositeImageURL;
        document.querySelector('.popup-image').style.display = 'block';
    }
    //取消預覽
    document.querySelector('.popup-image span').onclick =() =>{
        document.querySelector('.popup-image').style.display = 'none';
    }


  });

//Events Object
let events = {
    mouse: {
      down: "mousedown",
      move: "mousemove",
      up: "mouseup",
    },
    touch: {
      down: "touchstart",
      move: "touchmove",
      up: "touchend",
    },
  };
  let deviceType = "";
  //Detech touch device
  const isTouchDevice = () => {
    try {
      //We try to create TouchEvent (it would fail for desktops and throw error)
      document.createEvent("TouchEvent");
      deviceType = "touch";
      return true;
    } catch (e) {
      deviceType = "mouse";
      return false;
    }
  };
  isTouchDevice();


//Start (mouse down / touch start)
document.addEventListener(events[deviceType].down, (event) => {

    // isMouseDown = true;
    // console.log("isMouseDown: "+isMouseDown);
    var eleTarget = event.target;
        if (eleTarget.matches && eleTarget.matches(strSelectorActive)) {
            //console.log("eleTarget.style.cursor: "+eleTarget.style.cursor);

            //由標是move就是移動，是resize就是拉縮
            if(eleTarget.style.cursor=='move'){
                // console.log("move confirm")
                store.image = eleTarget;
                store.reszing = false;
                moveElement = true;
                event.preventDefault();
                //initial x and y points
                initialX = !isTouchDevice() ? event.clientX : event.touches[0].clientX;
                initialY = !isTouchDevice() ? event.clientY : event.touches[0].clientY;
                //Start movement
            }else{
                event.preventDefault();
                // console.log("resize confirm")
                store.reszing = true;
                moveElement = false;
                store.image = eleTarget;
                store.clientX = event.clientX;
                store.clientY = event.clientY;
                // 此时图片的尺寸
                store.imageWidth = eleTarget.width || eleTarget.clientWidth;
                store.imageHeight = eleTarget.height || eleTarget.clientHeight;
                // 此时图片的拉伸方位
                store.position = eleTarget.position;
                // 最大宽度
                if (typeof params.maxWidth == 'number') {  
                    store.maxWidth = params.maxWidth;
                } else if (params.maxWidth) {
                    // 使用第一个非内联水平的祖先元素的尺寸作为最大尺寸
                    var eleParent = (function (element) {
                        var step = function (ele) {
                            var display = getComputedStyle(ele).style;
                            if (/inline/.test(display)) {
                                return step(ele.parentElement);
                            }

                            return ele;
                        }

                        return step(element);
                    })(eleTarget.parentElement);
                    // 设置最大尺寸
                    if (eleParent) {
                        //計算downer左邊距離outer左邊多少px
                        var downerRect = eleTarget.getBoundingClientRect();
                        var downerLeft = downerRect.left;
                        var outerLeft = outerRect.left;
                        var distance = downerLeft - outerLeft;
                        
                        store.maxWidth = eleParent.clientWidth - distance - 4;
                    }
                }
            }
        }
});

//Move
document.addEventListener(events[deviceType].move, (event) => {
    var eleTarget = event.target;
    //if movement == true then set top and left to new X andY while removing any offset
    //   console.log("outer height: " + outerRect.height);
    //   console.log("outer width: " + outerRect.width);
    //   console.log("downerElem height: " + downerElem.offsetHeight);
    //   console.log("downerElem width: " + downerElem.offsetWidth);
    if (moveElement) {
        event.preventDefault();
        let newX = !isTouchDevice() ? event.clientX : event.touches[0].clientX;
        let newY = !isTouchDevice() ? event.clientY : event.touches[0].clientY;

        // 計算元素在outer範圍內的位置
        let newTop = eleTarget.offsetTop - (initialY - newY);
        let newLeft = eleTarget.offsetLeft - (initialX - newX);

        // 檢查是否超出outer範圍，如果是則限制在邊界內
        if (newTop < 0) {
            newTop = 0;
        } else if (newTop + eleTarget.offsetHeight > outerRect.height) {
            newTop = outerRect.height - eleTarget.offsetHeight;
        }

        if (newLeft < 0) {
            newLeft = 0;
        } else if (newLeft + eleTarget.offsetWidth > outerRect.width) {
            newLeft = outerRect.width - eleTarget.offsetWidth;
        }

        // 設置元素的新位置
        eleTarget.style.top = newTop + "px";
        eleTarget.style.left = newLeft + "px";

        initialX = newX;
        initialY = newY;
    }

    if (store.reszing) {
        event.preventDefault();

        // 移动距离
        var distanceX = event.clientX - store.clientX;
        var distanceY = event.clientY - store.clientY;
        // 变化的尺寸
        var width = 0;
        var height = 0;
        // 方位计算是加还是减
        var scale = 1;
        // 不同方位有着不同的判断逻辑
        var position = store.position;
        // 左下角
        if ((position == 'bottom left' || position == 'top right') && distanceX * distanceY < 0) {
        // 左下方是变大，右上是变小
        // distanceX- distanceY+ 变大，distanceX+ distanceY-是变小
        // 右上角
        // 左下方是变小，右上是变大，正好和 'bottom left' 相反
        if (position == 'top right') {
            scale = -1;
        }
        width = store.imageWidth - distanceX * scale;
        height = store.imageHeight + distanceY * scale;
        } else if ((position == 'top left' || position == 'bottom right') && distanceX * distanceY > 0) {
        // 左上角
        // distanceX+, distanceY+是缩小
        // distanceX-, distanceY-是放大
        // 如果是右下角，则相反
        if (position == 'bottom right') {
            scale = -1;
        }
        width = store.imageWidth - distanceX * scale;
        height = store.imageHeight - distanceY * scale;
        }
        if (!width && !height) {
        return;
        }
        // 目标尺寸
        var imageWidth = 0;
        var imageHeight = 0;
        // 图像的原始比例
        var ratio = store.imageWidth / store.imageHeight;
        // 最小宽度
        var minWidth = (params.minWidth && Number(params.minWidth) > 0 ) ? Number(params.minWidth) : MINWIDTH;
        // 选择移动距离大的方向
        if (Math.abs(distanceX) > Math.abs(distanceY)) {
        // 宽度变化为主，如果宽度小于最小宽度值，则配置最小宽度值
        imageWidth = width < minWidth ? minWidth : width;
        imageHeight = width / ratio;
        } else {
        // 高度变化为主
        imageHeight = height;
        imageWidth = height * ratio;
        }
        // 最终设置图片的尺寸
        store.image.width = Math.round(imageWidth);
        store.image.height = Math.round(imageHeight);
    } else if (eleTarget.matches && eleTarget.matches(strSelectorActive) && !isMouseDown) {
        // 根据位置设置手形
        var clientX = event.clientX;
        var clientY = event.clientY;
        var bounding = eleTarget.getBoundingClientRect();
        var isOnEdge = (
            (event.clientX - bounding.left < 20 && event.clientY - bounding.bottom > -20) ||
            (event.clientX - bounding.right > -20 && event.clientY - bounding.top < 20)
        );
        
        // 边缘判断
        if ((clientX - bounding.left < 20 && clientY - bounding.bottom > -20)
            || (clientX - bounding.right > -20 && clientY - bounding.top < 20)
        ) {
            eleTarget.style.cursor = 'nesw-resize';
            // 判断位置
            if (clientX - bounding.left < 20) {
                eleTarget.position = 'bottom left';
            } else {
                eleTarget.position = 'top right';
            }
        } else if ((clientX - bounding.left < 20 && clientY - bounding.top < 20)
            || (clientX - bounding.right > -20 && clientY - bounding.bottom > -20)
        ) {
            eleTarget.style.cursor = 'nwse-resize';
            // 判断位置
            if (clientX - bounding.left < 20) {
                eleTarget.position = 'top left';
            } else {
                eleTarget.position = 'bottom right';
            }
        } else {
            eleTarget.style.cursor = 'move';
            eleTarget.position = 'center center';
        }
    }
});

//mouse up / touch end
document.addEventListener(
  events[deviceType].up,
  (stopMovement = (e) => {
    moveElement = false;
    isMouseDown = false;
    console.log("isMouseDown"+isMouseDown);
    // 图片尺寸超出100%限制
    if (store.image && store.maxWidth && store.image.width > store.maxWidth) {
        // 目标尺寸
        var imageWidth = store.maxWidth;
        var imageHeight = imageWidth / (store.imageWidth / store.imageHeight);
        // 最终设置图片的尺寸
        store.image.width = Math.round(imageWidth);
        store.image.height = Math.round(imageHeight);
    }
    if (store.reszing) {
        store.reszing = false;
        params.onFinish();
    }
  })
);


