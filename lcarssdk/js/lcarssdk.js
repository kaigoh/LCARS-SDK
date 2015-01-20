/** LCARS SDK 15019.204
* This file is a part of the LCARS SDK.
* https://github.com/AricwithanA/LCARS-SDK/blob/master/LICENSE.md
* For more information please go to http://www.lcarssdk.org.
**/

// @timing_sequence -  How quickly things append or are removed.  Also used in other functions as part of standardized timing.
// @allObjects - Holds all definitions of objects that have an ID. Access via:  var allObjects.objectID;
// @sdkAddonTemplates - Container for Addon Templates;
// @objectCount - Number of objects stored in allObjects;
var timing_sequence = 65;
var allObjects = {};
var sdkAddonTemplates = {}
var objectCount = 0;


/** +brief LCARS.XXX
 *          Each element is defined under the LCARS global variable.         
 *          This also allows for easy extensibility of the LCARS base API
 *          without the need to modify this file directly so upgrading
 *          does not conflict with custom needs of custom projects.
 */  
var LCARS = {
/** +brief Viewport Scaler
 *	&info - Scale viewport container in porportion and aspect ratio.
 *	@panelW - Width of container
 *	@panelH - Height of container
 *	@max -  true, Disables viewport container from expanding beyond its defined width/height.
 *	@wrapper - Wrapper DOM Object         
 */   
    scaler: function(panelW, panelH, wrapper, max){
        var windowH = $(window).height();
        var windowW = $(window).width();
        var ratio = panelW/panelH;
        
        var diffH = 1-((panelW - windowW)/panelW)
        var diffW = 1-((panelH - windowH)/panelH)
        if(max !== true  || max === true && diffW < 1 && diffH < 1 || max === true && diffW < 1 || diffH < 1){
            if(panelW > panelH){
                if(windowH < (windowW*ratio)){
                    $(wrapper).css('-webkit-transform', 'scale('+diffW+')');
                    $(wrapper).css('-ms-transform', 'scale('+diffW+')');
                    $(wrapper).css('transform', 'scale('+diffW+')');
                }
                
                if(windowW < (windowH*ratio)){
                    $(wrapper).css('-webkit-transform', 'scale('+diffH+')');
                    $(wrapper).css('-ms-transform', 'scale('+diffH+')');
                    $(wrapper).css('transform', 'scale('+diffH+')');
                }
            }
            if(panelW < panelH){
                if(windowH > (windowW*ratio)){
                    $(wrapper).css('-webkit-transform', 'scale('+diffH+')');
                    $(wrapper).css('-ms-transform', 'scale('+diffH+')');
                    $(wrapper).css('transform', 'scale('+diffH+')');
                }
                
                if(windowW > (windowH*ratio)){
                    $(wrapper).css('-webkit-transform', 'scale('+diffW+')');
                    $(wrapper).css('-ms-transform', 'scale('+diffW+')');
                    $(wrapper).css('transform', 'scale('+diffW+')');
                }
            }
        }else{
            $(wrapper).css('-webkit-transform', '');
            $(wrapper).css('-ms-transform',  '');
            $(wrapper).css('transform',  '');              
        }
        
        var bodyH = ((windowH - $(wrapper)[0].getBoundingClientRect().height)/2)
        var bodyW = ((windowW - $(wrapper)[0].getBoundingClientRect().width)/2)
        if(bodyH < 0){bodyH=0;}
        if(bodyW < 0){bodyW=0;}
        $(wrapper).css('top', bodyH);
        $(wrapper).css('left', bodyW);
    },

     
      
/** +brief Viewport Stepper - IN PRODUCTION, DO NOT USE.
 *	&info - Shrink Width and Height of viewport in steps of passed parameters.
 *	@panelW - Width of container
 *	@panelH - Height of container
 *	@baseStepV - Base Vertical step height     
 *	@spacingStepV - BaseStepV + spacing between (60+5=65)
 *	@baseStepH - Base Horizontal step width 
 *	@spacingStepH -  BaseStepV + spacing between (150+5=155)
 *	@wrapper - Wrapper DOM Object
 *          
        
    stepper: function(panelW, panelH, baseStepV, spacingStepV, baseStepH, spacingStepH, wrapper){
        var windowH = $(window).height();
        var windowW = $(window).width(); 
        var stepHeight = (Math.floor((windowH - baseStepV - 20)/spacingStepV) * spacingStepV) + baseStepV;	
        var newWidth = Math.round(stepHeight*(panelW/panelH)); 
        
        if(newWidth < windowW){
            $(wrapper).width(newWidth).height(stepHeight);  
        }else{       
            var stepWidth = (Math.floor((windowW - baseStepH - 20)/spacingStepH) * spacingStepH) + baseStepH;	
            var newHeight = Math.round(stepWidth*(panelH/panelW)); 
            $(wrapper).width(stepWidth).height(newHeight);  
        } 
    
        var bodyH = ((windowH - $(wrapper)[0].getBoundingClientRect().height)/2)
        var bodyW = ((windowW - $(wrapper)[0].getBoundingClientRect().width)/2)
        if(bodyH < 0){bodyH=0;}
        if(bodyW < 0){bodyW=0;}
        $(wrapper).css('top', bodyH);
        $(wrapper).css('left', bodyW);
    },
    */ 
    
 
/** +brief Randomly select color from array.
 *	@array - ['blue', 'yellow', 'grey']
 */	
    colorGen: function(array){
        var color = array[Math.floor(array.length * Math.random())];
        return color;  
    },
    
    
 /** +brief Object Settings
 *  &info - This maintains the settings applied within the DOM. 
 *  !note - If functionality needs to be added custom for a project
 *          add a 'LCARS.object.settings.xxx' with your own module to override.
 *          DO NOT EDIT THIS, WILL BE OVERWRITTEN WHEN SDK IS UPGRADED.
 */	   
    settings:{
        //Universal Set Call
        set:function(element, args){
            var elemID = $(element).attr('id');
            var original = allObjects[elemID];
            
            for (var prop in args) {
                if(args.type){var customSettings = LCARS[args.type].settings;}else{var customSettings = LCARS[original.type].settings;}
                
                if(customSettings && customSettings[prop] && customSettings[prop] !== null){
                    element = LCARS[allObjects[elemID].type].settings[prop]({element:element, args:args, original:original, set:true, elemID:elemID});
                }else if(LCARS.settings[prop]){
                    element = LCARS.settings[prop]({element:element, args:args, original:original, set:true,  elemID:elemID}); 
                }else{
                    original[prop] = args[prop];   
                }
                
            }
            return element;
        },
        
        //Universal Get Call
        get:function(element, arg, args){
            var elemID = $(element).attr('id');        
                var customSettings = LCARS[allObjects[elemID].type].settings
                if(customSettings && customSettings[arg]){
                    element = LCARS[allObjects[elemID].type].settings[arg]({elemID:elemID, args:args});
                }else{
                    element = LCARS.settings[arg]({elemID:elemID, args:args});
                }
            return element;           
        },      

        //Mouse/Touch Event Settings
        click:function(args){
            var elemID = $(args.element).attr('id');
            var targetObj = allObjects[elemID];              
            if(args.args.click != null && webviewInfo.input !== 'touch'){
                if(targetObj.click){$(args.element).off('click', targetObj.click);}
                targetObj.click = args.args.click;              
                if(targetObj.type === 'radioButton' || targetObj.type === 'checkboxButton'){
                    $(args.element).on('click', labelPreventSet);
                    $(args.element).on('click', targetObj.click);   
                }else{
                    $(args.element).on('click', targetObj.click);
                }
            }else if(args.args.click === null){
                if(targetObj.click){$(args.element).off('click');}
                targetObj.click = null;             
            }  
            return args.element;
        },
        
        mouseenter:function(args){
            var elemID = $(args.element).attr('id');
            var targetObj = allObjects[elemID];              
            if(args.args.mouseenter != null && webviewInfo.input !== 'touch'){
                if(targetObj.mouseenter){$(args.element).off('mouseenter');}
                targetObj.mouseenter = args.args.mouseenter;
                if(targetObj.type === 'radioButton' || targetObj.type === 'checkboxButton'){
                    $(args.element).on('mouseenter', targetObj.mouseenter);           
                    $(args.element).on('mouseenter', labelPreventDefault);
                }else{
                    $(args.element).on('mouseenter', targetObj.mouseenter);
                }
            }else if(args.args.mouseenter === null){
                if(targetObj.mouseenter){$(args.element).off('mouseenter');}
                targetObj.mouseenter = null;             
            }  
            return args.element;
        },
        
        mouseleave:function(args){
            var elemID = $(args.element).attr('id');
            var targetObj = allObjects[elemID];              
            if(args.args.mouseleave != null && webviewInfo.input !== 'touch'){
                if(targetObj.mouseleave){$(args.element).off('mouseleave');}
                targetObj.mouseleave = args.args.mouseleave;
                if(targetObj.type === 'radioButton' || targetObj.type === 'checkboxButton'){
                    $(args.element).on('mouseleave', targetObj.mouseleave);           
                    $(args.element).on('mouseleave', labelPreventDefault);
                }else{
                    $(args.element).on('mouseleave', targetObj.mouseleave);
                }
            }else if(args.args.mouseleave === null){
                if(targetObj.mouseleave){$(args.element).off('mouseleave');}
                targetObj.mouseleave = null;             
            }  
            return args.element;
        
        }, 
        
        hover:function(args){
            var elemID = $(args.element).attr('id');
            var targetObj = allObjects[elemID];              
            if(args.args.hover != null && webviewInfo.input !== 'touch'){
                if(targetObj.hover){$(args.element).off('hover');}
                targetObj.hover = args.args.hover;
                if(targetObj.type === 'radioButton' || targetObj.type === 'checkboxButton'){
                    $(args.element).on('hover', targetObj.hover);           
                    $(args.element).on('hover', labelPreventDefault);
                }else{
                    $(args.element).on('hover', targetObj.hover);
                }
            }else if(args.args.hover === null){
                if(targetObj.hover){$(args.element).off('hover');}
                targetObj.hover = null;             
            }  
            return args.element;
        }, 
        
        mousedown:function(args){
            var elemID = $(args.element).attr('id');
            var targetObj = allObjects[elemID];              
            if(args.args.mousedown != null && webviewInfo.input !== 'touch'){
                if(targetObj.mousedown){$(args.element).off('mousedown');}
                targetObj.mousedown = args.args.mousedown;
                if(targetObj.type === 'radioButton' || targetObj.type === 'checkboxButton'){
                    $(args.element).on('mousedown', targetObj.mousedown);           
                    $(args.element).on('mousedown', labelPreventDefault);
                }else{
                    $(args.element).on('mousedown', targetObj.mousedown);
                }
            }else if(args.args.mousedown === null){
                if(targetObj.mousedown){$(args.element).off('mousedown');}
                targetObj.mousedown = null;             
            }  
            return args.element;
        },
        
        mouseup:function(args){
            var elemID = $(args.element).attr('id');
            var targetObj = allObjects[elemID];              
            if(args.args.mouseup != null && webviewInfo.input !== 'touch'){
                if(targetObj.mouseup){$(args.element).off('mouseup');}
                targetObj.mouseup = args.args.mouseup;
                if(targetObj.type === 'radioButton' || targetObj.type === 'checkboxButton'){
                    $(args.element).on('mouseup', targetObj.mouseup);           
                    $(args.element).on('mouseup', labelPreventDefault);
                }else{
                    $(args.element).on('mouseup', targetObj.mouseup);
                }
            }else if(args.args.mouseup === null){
                if(targetObj.mouseup){$(args.element).off('mouseup');}
                targetObj.mouseup = null;             
            } 
            return args.element;
        },         

        tap:function(args){
            var elemID = $(args.element).attr('id');
            var targetObj = allObjects[elemID];              
            if(args.args.tap != null && webviewInfo.input === 'touch'){
                if(targetObj.tap){$(args.element).off('tap');}
                targetObj.tap = args.args.tap;
                if(targetObj.type === 'radioButton' || targetObj.type === 'checkboxButton'){
                    $(args.element).on('tap', targetObj.tap);           
                    $(args.element).on('tap', labelPreventSet);
                }else{
                    $(args.element).on('tap', targetObj.tap);
                }
            }else if(args.args.tap === null){
                if(targetObj.tap){$(args.element).off('tap');}
                targetObj.tap = null;             
            }  
            return args.element;
        }, 
        
        singleTap:function(args){
            var elemID = $(args.element).attr('id');
            var targetObj = allObjects[elemID];              
            if(args.args.singleTap != null && webviewInfo.input === 'touch'){
                if(targetObj.singleTap){$(args.element).off('singleTap');}
                targetObj.singleTap = args.args.singleTap;
                if(targetObj.type === 'radioButton' || targetObj.type === 'checkboxButton'){
                    $(args.element).on('singleTap', targetObj.singleTap);           
                    $(args.element).on('singleTap', labelPreventSet);
                }else{
                    $(args.element).on('singleTap', targetObj.singleTap);
                }
            }else if(args.args.singleTap === null){
                if(targetObj.singleTap){$(args.element).off('singleTap');}
                targetObj.singleTap = null;             
            }  
            return args.element;
        }, 
        
        doubleTap:function(args){
            var elemID = $(args.element).attr('id');
            var targetObj = allObjects[elemID];              
            if(args.args.doubleTap != null && webviewInfo.input === 'touch'){
                if(targetObj.doubleTap){$(args.element).off('doubleTap');}
                targetObj.doubleTap = args.args.doubleTap;
                if(targetObj.type === 'radioButton' || targetObj.type === 'checkboxButton'){
                    $(args.element).on('doubleTap', targetObj.doubleTap);           
                    $(args.element).on('doubleTap', labelPreventDefault);
                }else{
                    $(args.element).on('doubleTap', targetObj.doubleTap);
                }
            }else if(args.args.doubleTap === null){
                if(targetObj.doubleTap){$(args.element).off('doubleTap');}
                targetObj.doubleTap = null;             
            }  
            
            return args.element;
        }, 
        
        longTap:function(args){
            var elemID = $(args.element).attr('id');
            var targetObj = allObjects[elemID];              
            if(args.args.longTap != null && webviewInfo.input === 'touch'){
                if(targetObj.longTap){$(args.element).off('longTap');}
                targetObj.longTap = args.args.longTap;
                if(targetObj.type === 'radioButton' || targetObj.type === 'checkboxButton'){
                    $(args.element).on('longTap', targetObj.longTap);           
                    $(args.element).on('longTap', labelPreventDefault);
                }else{
                    $(args.element).on('longTap', targetObj.longTap);
                }
            }else if(args.args.longTap === null){
                if(targetObj.longTap){$(args.element).off('longTap');}
                targetObj.longTap = null;             
            }  
            return args.element;
        }, 
        
        swipe:function(args){
            var elemID = $(args.element).attr('id');
            var targetObj = allObjects[elemID];              
            if(args.args.swipe != null && webviewInfo.input === 'touch'){
                if(targetObj.swipe){$(args.element).off('swipe');}
                targetObj.swipe = args.args.swipe;
                if(targetObj.type === 'radioButton' || targetObj.type === 'checkboxButton'){
                    $(args.element).on('swipe', targetObj.swipe);           
                    $(args.element).on('swipe', labelPreventDefault);
                }else{
                    $(args.element).on('swipe', targetObj.swipe);
                }
            }else if(args.args.swipe === null){
                if(targetObj.swipe){$(args.element).off('swipe');}
                targetObj.swipe = null;             
            }  
            return args.element;
        },
        
        swipeLeft:function(args){
            var elemID = $(args.element).attr('id');
            var targetObj = allObjects[elemID];              
            if(args.args.swipeLeft != null && webviewInfo.input === 'touch'){
                if(targetObj.swipeLeft){$(args.element).off('swipeLeft');}
                targetObj.swipeLeft = args.args.swipeLeft;
                if(targetObj.type === 'radioButton' || targetObj.type === 'checkboxButton'){
                    $(args.element).on('swipeLeft', targetObj.swipeLeft);           
                    $(args.element).on('swipeLeft', labelPreventDefault);
                }else{
                    $(args.element).on('swipeLeft', targetObj.swipeLeft);
                }
            }else if(args.args.swipeLeft === null){
                if(targetObj.swipeLeft){$(args.element).off('swipeLeft');}
                targetObj.swipeLeft = null;             
            }  
            return args.element;
        },
        
        swipeRight:function(args){
            var elemID = $(args.element).attr('id');
            var targetObj = allObjects[elemID];              
            if(args.args.swipeRight != null && webviewInfo.input === 'touch'){
                if(targetObj.swipeRight){$(args.element).off('swipeRight');}
                targetObj.swipeRight = args.args.swipeRight;
                if(targetObj.type === 'radioButton' || targetObj.type === 'checkboxButton'){
                    $(args.element).on('swipeRight', targetObj.swipeRight);           
                    $(args.element).on('swipeRight', labelPreventDefault);
                }else{
                    $(args.element).on('swipeRight', targetObj.swipeRight);
                }
            }else if(args.args.swipeRight === null){
                if(targetObj.swipeRight){$(args.element).off('swipeRight');}
                targetObj.swipeRight = null;             
            }  
            return args.element;
        },
        
        swipeUp:function(args){
            var elemID = $(args.element).attr('id');
            var targetObj = allObjects[elemID];              
            if(args.args.swipeUp != null && webviewInfo.input === 'touch'){
                if(targetObj.swipeUp){$(args.element).off('swipeUp');}
                targetObj.swipeUp = args.args.swipeUp;
                if(targetObj.type === 'radioButton' || targetObj.type === 'checkboxButton'){
                    $(args.element).on('swipeUp', targetObj.swipeUp);           
                    $(args.element).on('swipeUp', labelPreventDefault);
                }else{
                    $(args.element).on('swipeUp', targetObj.swipeUp);
                }
            }else if(args.args.swipeUp === null){
                if(targetObj.swipeUp){$(args.element).off('swipeUp');}
                targetObj.swipeUp = null;             
            }  
            return args.element;
        }, 
        
        swipeDown:function(args){
            var elemID = $(args.element).attr('id');
            var targetObj = allObjects[elemID];              
            if(args.args.swipeDown != null && webviewInfo.input === 'touch'){
                if(targetObj.swipeDown){$(args.element).off('swipeDown');}
                targetObj.swipeDown = args.args.swipeDown;
                if(targetObj.type === 'radioButton' || targetObj.type === 'checkboxButton'){
                    $(args.element).on('swipeDown', targetObj.swipeDown);           
                    $(args.element).on('swipeDown', labelPreventDefault);
                }else{
                    $(args.element).on('swipeDown', targetObj.swipeDown);
                }
            }else if(args.args.swipeDown === null){
                if(targetObj.swipeDown){$(args.element).off('swipeDown');}
                targetObj.swipeDown = null;             
            }  
            return args.element;
        },         
     
        //Base Settings
        type:function(args){         
            if(args.set === true){
                if(args.args.type === null && args.original.type != null){     
                    $(args.element).removeClass(args.original.type); 
                    allObjects[args.elemID].type = null;
                }else if(typeof args.args.type === 'string'){
                    if(args.original.type){$(args.element).removeClass(args.original.type);}
                    $(args.element).addClass(args.args.type);
                    allObjects[args.elemID].type = args.args.type;
                }            
                return args.element;          
            }else{
                if(!allObjects[args.elemID].type){return null;}else{return allObjects[args.elemID].type;}
            }
        },
        
        color:function(args){         
            if(args.set === true){
                if(args.args.color === null && args.original.color != null){     
                    $(args.element).removeClass(args.original.color); 
                    allObjects[args.elemID].color = null;
                }else if(typeof args.args.color === 'string'){
                    if(args.original.color){$(args.element).removeClass(args.original.color);}
                    $(args.element).addClass(args.args.color);
                    allObjects[args.elemID].color = args.args.color;
                }            
                return args.element;          
            }else{
                if(!allObjects[args.elemID].color){return null;}else{return allObjects[args.elemID].color;}
            }
        },
        
        version:function(args){
            if(args.set === true){
                if(args.args.version === null && args.original.version != null){     
                    $(args.element).removeClass(args.original.version);
                    allObjects[args.elemID].version = null;
                }else if(typeof args.args.version === 'string'){
                    if(args.original.version){$(args.element).removeClass(args.original.version);}
                    $(args.element).addClass(args.args.version);
                    allObjects[args.elemID].version = args.args.version;
                }
                return args.element;
            }else{
                if(!allObjects[args.elemID].version){return null;}else{return allObjects[args.elemID].version;}
            }  
        },

        label:function(args){
            if(args.set === true){
                if(args.args.label === null && args.original.label != null){     
                    $(args.element).removeAttr('data-label');
                    allObjects[args.elemID].label = null;
                }else if(typeof args.args.label === 'string'){
                    $(args.element).attr('data-label', args.args.label);
                    allObjects[args.elemID].label = args.args.label;
                }
                return args.element;
            }else{
                if(!allObjects[args.elemID].label){return null;}else{return allObjects[args.elemID].label;}
                
            }  
        },
        
        altLabel:function(args){
            if(args.set === true){
                if(args.args.altLabel === null && args.original.altLabel != null){     
                    $(args.element).removeAttr('data-altLabel');
                    allObjects[args.elemID].altLabel = null;
                }else if(typeof args.args.altLabel === 'string'){
                    $(args.element).attr('data-altLabel', args.args.altLabel);
                    allObjects[args.elemID].altLabel = args.args.altLabel;
                }
                return args.element;
            }else{
                if(!allObjects[args.elemID].altLabel){return null;}else{return allObjects[args.elemID].altLabel;}
            }  
        },

        size:function(args){
            if(args.set === true){
                if(args.args.size === null && args.original.size != null){     
                    $(args.element).removeClass(args.original.size);
                    allObjects[args.elemID].size = null;
                }else if(typeof args.args.size === 'string'){
                    if(args.original.size){$(args.element).removeClass(args.original.size);}
                    $(args.element).addClass(args.args.size);
                    allObjects[args.elemID].size = args.args.size;
                }
                return args.element;
            }else{
                if(!allObjects[args.elemID].size){return null;}else{return allObjects[args.elemID].size;}
            }  
        },
        
        state:function(args){
            if(args.set === true){
                if(args.args.state === null && args.original.state != null){     
                    $(args.element).removeClass(args.original.state);
                    allObjects[args.elemID].state = null;
                }else if(typeof args.args.state === 'string'){
                    if(args.original.state){$(args.element).removeClass(args.original.state);}
                    $(args.element).addClass(args.args.state);
                    allObjects[args.elemID].state = args.args.state;
                }
                return args.element;
            }else{
                if(!allObjects[args.elemID].state){return null;}else{return allObjects[args.elemID].state;}
            }  
        }, 
        
        class:function(args){
            if(args.set === true){
                if(typeof args.args.class === 'string'){
                    $(args.element).addClass(args.args.class);
                    if(allObjects[args.elemID].class){
                        allObjects[args.elemID].class = allObjects[args.elemID].class + ' ' + args.args.class;
                    }else{
                        allObjects[args.elemID].class = args.args.class;
                    }
                }else if(Array.isArray(args.args.class)){
                    for (i = 0; i < args.args.class.length; i++) { 
                        var className = args.args.class[i];
                        $(args.element).removeClass(className);
                        var classN = allObjects[args.elemID].class
                        var re = new RegExp(className,"g");
                        var newClass = classN.replace(re, '');
                        allObjects[args.elemID].class = newClass;
                    }
                }
                return args.element;
            }else{
                if(!allObjects[args.elemID].class){return null;}else{return allObjects[args.elemID].class;}
            }  
        },
        
        flex:function(args){
            if(args.set === true){
                
                if(args.args.flex === null && args.original.flex != null){     
                    $(args.element).removeClass('flex'+args.original.flex);
                    allObjects[args.elemID].flex = null;   
                }else if(typeof args.args.flex === 'string'){
                    if(args.original.flex){$(args.element).removeClass('flex' + args.original.flex);}
                    $(args.element).addClass('flex' + args.args.flex);
                    allObjects[args.elemID].flex = 'flex' + args.args.flex;
                }          
                return args.element;
            
            }else{
                if(!allObjects[args.elemID].flex){return null;}else{return 'flex' + allObjects[args.elemID].flex;}          
            }  
        },
        
        flexC:function(args){
            if(args.set === true){
                
                if(args.args.flexC === null && args.original.flexC != null){     
                    $(args.element).removeClass('flexc'+args.original.flexC);
                    allObjects[args.elemID].flexC = null;   
                }else if(typeof args.args.flexC === 'string'){
                    if(args.original.flexC){$(args.element).removeClass('flexc' + args.original.flexC);}
                    $(args.element).addClass('flexc' + args.args.flexC);
                    allObjects[args.elemID].flexC = 'flexc' + args.args.flexC;
                }          
                return args.element;
            
            }else{
                if(!allObjects[args.elemID].flexC){return null;}else{return 'flexc' + allObjects[args.elemID].flexC;}   
            }  
        },
        
        noTransition:function(args){
            if(args.set === true){
                if(args.args.noTransition === false){     
                    $(args.element).removeClass('noTransition');
                    allObjects[args.elemID].noTransition = args.args.noTransition;
                }else if(args.args.noTransition === true){
                    $(args.element).addClass('noTransition');
                    allObjects[args.elemID].noTransition = args.args.noTransition;
                }
                return args.element;
            }else{
                if(!allObjects[args.elemID].noTransition){return null;}else{return allObjects[args.elemID].noTransition;}
            }  
        },
        
        noEvent:function(args){
            if(args.set === true){
                if(args.args.noEvent === false){     
                    $(args.element).removeClass('noEvent');
                    allObjects[args.elemID].noEvent = args.args.noEvent;
                }else if(args.args.noEvent === true){
                    $(args.element).addClass('noEvent');
                    allObjects[args.elemID].noEvent = args.args.noEvent;
                }
                return args.element;
            }else{
                if(!allObjects[args.elemID].noEvent){return null;}else{return allObjects[args.elemID].noEvent;}
            }  
        },
        
        hidden:function(args){
            if(args.set === true){
                if(args.args.hidden === false){     
                    $(args.element).removeClass('hidden');
                    allObjects[args.elemID].hidden = args.args.hidden;
                }else if(args.args.hidden === true){
                    $(args.element).addClass('hidden');
                    allObjects[args.elemID].hidden = args.args.hidden;
                }
                return args.element;
            }else{
                if(!allObjects[args.elemID].hidden){return null;}else{return allObjects[args.elemID].hidden;}
            }  
        },
        
        fade:function(args){
            if(args.set === true){
                if(args.args.fade === false){     
                    $(args.element).removeClass('fade');
                    allObjects[args.elemID].fade = args.args.fade;
                }else if(args.args.fade === true){
                    $(args.element).addClass('fade');
                    allObjects[args.elemID].fade = args.args.fade;
                }
                return args.element;
            }else{
                if(!allObjects[args.elemID].fade){return null;}else{return allObjects[args.elemID].fade;}
            }  
        },
        
        readOnly:function(args){
            if(args.set === true){
                if(args.args.readOnly === false){     
                    $(args.element).attr('readonly', false);
                    allObjects[args.elemID].readOnly = args.args.readOnly;
                }else if(args.args.readOnly === true){
                    $(args.element).attr('readonly', true);
                    allObjects[args.elemID].readOnly = args.args.readOnly;
                }
                return args.element;
            }else{
                if(!allObjects[args.elemID].readOnly){return null;}else{return allObjects[args.elemID].readOnly;}
            }  
        },
        
        checked:function(args){
            if(args.set === true){
                if(args.args.checked === false){     
                    $(args.element).find('input').prop('checked', false);
                    allObjects[args.elemID].checked = null;
                }else if(args.args.checked === true){
                    $(args.element).find('input').prop('checked', true);
                    allObjects[args.elemID].checked = true;
                }
                return args.element;
            }else{
                if(allObjects[args.elemID].checked){return allObjects[args.elemID].checked;}else{return null;}
            }  
        },
        
        password:function(args){
            if(args.set === true){
                if(args.args.password === false){     
                    $(args.element).attr('type', 'text');
                    allObjects[args.elemID].password = args.args.password;
                }else if(args.args.password === true){
                    $(args.element).attr('type', 'password');
                    allObjects[args.elemID].password = args.args.password;
                }
                return args.element;
            }else{
                if(!allObjects[args.elemID].password){return null;}else{return allObjects[args.elemID].password;}
            }  
        },
        
        inputValue:function(args){
            if(args.set === true){
                if(args.args.inputValue === null){     
                    $(args.element).removeAttr('value');
                    allObjects[args.elemID].inputValue = null;
                }else if(args.args.inputValue === 'string'){
                    $(args.element).attr('value', args.args.inputValue);
                    allObjects[args.elemID].inputValue = args.args.inputValue;
                }
                return args.element;
            }else{
                if(!allObjects[args.elemID].inputValue){return null;}else{return allObjects[args.elemID].inputValue;}
            }  
        },        
        
        text:function(args){
            if(args.set === true){
                if(args.args.text === null && args.original.text != null){     
                    if($(args.element).is('input')){
                        $(args.element).val('');
                    }else{
                        $(args.element).empty();
                    }                                       
                    allObjects[args.elemID].text = null;                
                }else if(typeof args.args.text === 'string'){
                    if($(args.element).is('input')){
                        $(args.element).val(args.args.text);
                    }else{
                        $(args.element).text(args.args.text);
                    }                   
                    allObjects[args.elemID].text = args.args.text;
                }
                return args.element;
            }else{
                if(!allObjects[args.elemID].text){return null;}else{return allObjects[args.elemID].text;}
            }  
        },
        
        name:function(args){
            if(args.set === true){
                if(args.args.name === null && args.original.name != null){     
                    $(args.element).removeAttr('name');
                    allObjects[args.elemID].name = null;
                }else if(typeof args.args.name === 'string'){
                    $(args.element).attr('name', args.args.name);
                    allObjects[args.elemID].name = args.args.name;
                }
                return args.element;
            }else{
                if(!allObjects[args.elemID].name){return null;}else{return allObjects[args.elemID].name;}
            }  
        },
        
        href:function(args){
            if(args.set === true){
                if(args.args.href === null && args.original.href != null){     
                    $(args.element).removeAttr('href');
                    allObjects[args.elemID].href = null;
                }else if(typeof args.args.href === 'string'){
                    $(args.element).attr('href', args.args.href);
                    allObjects[args.elemID].href = args.args.href;
                }
                return args.element;
            }else{
                if(!allObjects[args.elemID].href){return null;}else{return allObjects[args.elemID].href;}
            }  
        },
        
        src:function(args){
            if(args.set === true){
                if(args.args.src === null && args.original.src != null){     
                    $(args.element).removeAttr('src');
                    allObjects[args.elemID].src = null;
                }else if(typeof args.args.src === 'string'){
                    $(args.element).attr('src', args.args.src);
                    allObjects[args.elemID].src = args.args.src;
                }
                return args.element;
            }else{
                if(!allObjects[args.elemID].src){return null;}else{return allObjects[args.elemID].src;}
            }  
        },
        
        attrs:function(args){
            if(args.set === true){
                if(args.args.attrs === null && args.original.attrs !== null){
                    for (i = 0; i < allObjects[args.elemID].attrs.length; i++) { 
                        var domAttr = allObjects[args.elemID].attrs[i];
                        $(args.element).removeAttr(domAttr.attr);
                    }
                    allObjects[args.elemID].attrs = null;  
                }else{              
                    if(!allObjects[args.elemID].attrs){allObjects[args.elemID].attrs = []}             
                    for (i = 0; i < args.args.attrs.length; i++) { 
                        var domAttr = args.args.attrs[i];
                        var present = null;                  
                        
                        for (i = 0; i < allObjects[args.elemID].attrs.length; i++) { 
                            var orgAttr = allObjects[args.elemID].attrs[i];
                            if(orgAttr[domAttr.attr] === domAttr.attr){present = i;}
                        }
                        
                        if(domAttr.value === null ){ 
                            if(present !== null){
                                allObjects[args.elemID].attrs[present].value = null;
                            }
                            $(args.element).removeAttr(domAttr.attr);
                            
                        }else if(typeof domAttr.value === 'string'){
                            if(present !== null){
                                allObjects[args.elemID].attrs[present].value = domAttr.value;    
                            }else{
                                $(args.element).attr(domAttr.attr, domAttr.value);
                                allObjects[args.elemID].attrs.push(domAttr);
                            }
                        }
                    }
                }
                return args.element;
            }else{
               if(!allObjects[args.elemID].attrs){return null;}else{return allObjects[args.elemID].attrs;}
            }  
        },
        
        children:function(args){
            if(Array.isArray(args.args.children)){
                $(args.args.children).each(function(){
                    var childElement = LCARS[this.type].create(this);
                    $(args.element).append(childElement);            
                });                                   
            }else if(typeof args.args.children === 'string'){
                $(args.element).append(args.args.children);
            }
            allObjects[args.elemID].children = args.args.children;
            return args.element;
        },
        
        nbValue:function(args){
            if(args.set === true){ 
                if(args.args.nbValue === null && args.original.nbValue != null){     
                    $(args.element).empty();
                    allObjects[args.elemID].nbValue = null;
                    $(args.element).width(0);
                }else{
                    var nbvLength = args.args.nbValue.length;
                    var nbvWidth = (nbvLength * 25) + ((nbvLength-1) * 5) + 10;
                    $(args.element).width(nbvWidth);
                    $(args.element).text(args.args.nbValue);
                    allObjects[args.elemID].nbValue = args.args.nbValue;
                }                
            }else{
                if(!allObjects[args.elemID].nbValue){return null;}else{return allObjects[args.elemID].nbValue;}
            }                
            return args.element;
        },  
        
        colors:function(args){
             if(args.set === true){ 
                if(args.args.colors === null && args.original.colors != null){     
                    $(args.element).children(':not(.numericBlock)').each(function(){
                        LCARS.settings.set(this, {color:null});                     
                    });
                    allObjects[args.elemID].colors = null;
                }else if(Array.isArray(args.args.colors)){
                    var childrenElem = $(args.element).children(':not(.numericBlock)')
                    for (i = 0; i < childrenElem.length; i++) { 
                        var childElem = childrenElem[i];
                        if(args.args.colors[i]){
                            LCARS.settings.set(childElem, {color:args.args.colors[i]});  
                        }        
                    }           
                    allObjects[args.elemID].colors = args.args.colors;
                }                
            }else{
                if(!allObjects[args.elemID].colors){return null;}else{return allObjects[args.elemID].colors;}
            }                
            return args.element;
        },

        html:function(args){
            if(args.set === true){
                if(args.args.html === null && args.original.html != null){     
                    $(args.element).empty();                                      
                    allObjects[args.elemID].html = null;                
                }else if(typeof args.args.html === 'string'){
                    $(args.element).html(args.args.html);               
                    allObjects[args.elemID].html = args.args.html;
                }
                return args.element;
            }else{
                if(!allObjects[args.elemID].html){return null;}else{return allObjects[args.elemID].html;}
            }  
        },        
        
    },
  
  
/** +brief Object Definition Storage
*  &info - This stores each rendered elements definition into a global
*          variable, allObjects.  If there is no ID present, an ID will
*          be generated.  All rendered elements MUST have an ID, one way
*          or another.
*  EX:  allObjects.btn_ButtonID.label
*  @element - DOM object
*  @args - passed array settings making up the elements definition.
*/	  
    definition:function(element, args){
        //Clones args to prevent references and altering stored templates.
        var object = Object.create(args);
        objectCount += 1;
        if(object.id){
            allObjects[object.id] = {id:object.id, objectNumber:objectCount};
            $(element).attr('id', object.id);
            
        }else{
            var genID = object.type+'_'+objectCount;
            allObjects[genID] = {id:genID, objectNumber:objectCount};
            $(element).attr('id', genID);     
        } 
        element = LCARS.settings.set(element, object)

        return element;    
    },

   
/** +brief LCARS.create
 *  @keys - Keys are the same as the {type:value} of an objects definition.
 *          THESE MUST MATCH!
 *  >return - All LCARS.xxx.create/LCARS.settings.xxx calls MUST RETURN the created object.
 *  !note - The built in calls are meant to cover the main basic elements.
 *          There are a couple basic elements missing, which will be included
 *          in future versions.
 *  !note - Extensibility:  The reason the $.fn.createObject(); is universal, along with
 *          the unlimited settings, is beause of the KEY/TYPE relationship.  Extend the LCARS.xxx
 *          with additional code going 'LCARS.newObjectName.create = function(args){ //Do Something }
 *          and use the 'newObject' KEY as the element type '{type:'newObject'}
 *  
 *          Override universal settings by applying the setting key name under the element
 *          expression.  ex.  LCARS.complexButton.settings.label.  The LCARS.get/LCARS.set
 *          will use them instead of the native setting handling.
 *
 *  @LCARS.dialog - This is a generic call that has optinal settings to auto generate
 *                      header and footer title text.
 *  @args.appendTo - string selector for DOM element w/ id/class/other selector symbol.  ex.
 *                   {type:'button', color:'red', appendTo:'#customElement'}
 */	
    button:{
        create:function(args){
            if(args.href !== undefined){var element = $('<a class="button">');}else{var element = $('<div class="button">');}            
            element = LCARS.definition(element, args);
            return element;
        }
    },

    elbow:{
        create:function(args){
            if(args.href !== undefined){
                var element = $('<a class="elbow"><div class="innerRadius"></div><div class="bar"></div></a>');
            }else{
                var element =  $('<div class="elbow"><div class="innerRadius"></div><div class="bar"></div></div>');
            }	            
            element = LCARS.definition(element, args);                            
            return element;	    
        }
    },

    bar: {
        create:function(args){
            var element =  $('<div class="bar"></div>');					            
            element = LCARS.definition(element, args);    						            
            return element;	
        }
    },

    cap:{
        create:function(args){
            var element =  $('<div class="cap"></div>');					            
            element = LCARS.definition(element, args);            
            return element;	
        }
    },

    block:{
        create:function(args){
            var element =  $('<div class="block"></div>');					            
            element = LCARS.definition(element, args);            
            return element;
        }
    },

    complexButton:{
        create:function(args){
            if(args.href !== undefined){var element = $('<a class="complexButton">');}else{var element = $('<div class="complexButton">');}           
            if(args.template){        
                $(args.template).each(function(){               
                    var elementChild = LCARS[this.type].create(this);
                    $(element).append(elementChild);
                });
            }
            if(args.colors){
                saveColors = [];
                for (i = 0; i < args.colors.length; i++) { 
                    saveColors.push(args.colors[i]);
                }
                args.colors = [];
                element = LCARS.definition(element, args);
                args.colors = saveColors;
                element = LCARS.settings.set(element, {colors:saveColors});
            }else{
                element = LCARS.definition(element, args);
            }
            return element;	  
        },
        
        settings:{
            label:function(args){
                if(args.set === true){
                    var elemBtn = $(args.element).find('.button');
                    var btnID = $(elemBtn).attr('id');
                    if(args.args.label === null && args.original.label != null){     
                        $(elemBtn).removeAttr('data-label');
                        allObjects[args.elemID].label = null;
                        allObjects[btnID].label = null;
                    }else if(typeof args.args.label === 'string'){
                        $(elemBtn).attr('data-label', args.args.label);             
                        allObjects[args.elemID].label = args.args.label;
                        allObjects[btnID].label = args.args.label;
                    }
                    return args.element;
                }else{
                    if(!allObjects[args.elemID].label){return null;}else{return allObjects[args.elemID].label;}

                }  
            },
            
            altLabel:function(args){
                if(args.set === true){
                    var elemBtn = $(args.element).find('.button');
                    var btnID = $(elemBtn).attr('id');
                    if(args.args.altLabel === null && args.original.altLabel != null){     
                        $(elemBtn).removeAttr('data-altLabel');
                        allObjects[args.elemID].altLabel = null;
                        allObjects[args.btnID].altLabel = null;
                    }else if(typeof args.args.altLabel === 'string'){
                        $(elemBtn).attr('data-altLabel', args.args.altLabel);             
                        allObjects[args.elemID].altLabel = args.args.altLabel;
                        allObjects[args.btnID].altLabel = args.args.altLabel;
                    }
                    return args.element;
                }else{
                    if(!allObjects[args.elemID].altLabel){return null;}else{return allObjects[args.elemID].altLabel;}

                }  
            },
            nbValue:function(args){
                if(args.set === true){         
                    var elemNB = $(args.element).find('.numericBlock');
                    LCARS.settings.set(elemNB, {nbValue:args.args.nbValue});
                    allObjects[args.elemID].nbValue = args.args.nbValue;
                }else{
                    if(!allObjects[args.elemID].nbValue){return null;}else{return allObjects[args.elemID].nbValue;}
                }                
                return args.element;
            }            
        }   
    },

    radio:{
        create:function(args){       
            var element = $('<input type="radio">')
            element = LCARS.definition(element, args);
            return element;	
        }
    },

    radioButton:{
        create:function(args){
            var element = $('<label class="complexButton radioButton">');
            var input = LCARS.radio.create({type:'radio', name:args.name, checked:args.checked});
            $(element).prepend(input);
            if(args.template){        
                $(args.template).each(function(){
                    var nbCheck = 'numericBlock';
                    if(nbCheck.indexOf(this.class) > -1){
                        if(args.nbValue){this.nbValue = args.nbValue;}
                    }else{                  
                        if(this.type == 'button'){
                            if(args.label !== undefined){this.label = args.label;}
                            if(args.altLabel !== undefined){this.altLabel = args.altLabel;}
                        } 
                    }                   
                    var elementChild = LCARS[this.type].create(this);
                    $(element).append(elementChild);
                });
            }
            if(args.colors){
                saveColors = [];
                for (i = 0; i < args.colors.length; i++) { 
                    saveColors.push(args.colors[i]);
                }
                args.colors = [];
                element = LCARS.definition(element, args);
                args.colors = saveColors;
                element = LCARS.settings.set(element, args);
            }else{
                element = LCARS.definition(element, args);
            }
            return element; 
        },
        
        settings:{
            label:function(args){
                if(args.set === true){
                    var elemBtn = $(args.element).find('.button');
                    var btnID = $(elemBtn).attr('id');
                    if(args.args.label === null && args.original.label != null){     
                        $(elemBtn).removeAttr('data-label');
                        allObjects[args.elemID].label = null;
                        allObjects[btnID].label = null;
                    }else if(typeof args.args.label === 'string'){
                        $(elemBtn).attr('data-label', args.args.label);             
                        allObjects[args.elemID].label = args.args.label;
                        allObjects[btnID].label = args.args.label;
                    }
                    return args.element;
                }else{
                    if(!allObjects[args.elemID].label){return null;}else{return allObjects[args.elemID].label;}

                }  
            },
            
            altLabel:function(args){
                if(args.set === true){
                    var elemBtn = $(args.element).find('.button');
                    var btnID = $(elemBtn).attr('id');
                    if(args.args.altLabel === null && args.original.altLabel != null){     
                        $(elemBtn).removeAttr('data-altLabel');
                        allObjects[args.elemID].altLabel = null;
                        allObjects[args.btnID].altLabel = null;
                    }else if(typeof args.args.altLabel === 'string'){
                        $(elemBtn).attr('data-altLabel', args.args.altLabel);             
                        allObjects[args.elemID].altLabel = args.args.altLabel;
                        allObjects[args.btnID].altLabel = args.args.altLabel;
                    }
                    return args.element;
                }else{
                    if(!allObjects[args.elemID].altLabel){return null;}else{return allObjects[args.elemID].altLabel;}

                }  
            },
            nbValue:function(args){
                if(args.set === true){         
                    var elemNB = $(args.element).find('.numericBlock');
                    LCARS.settings.set(elemNB, {nbValue:args.args.nbValue});
                    allObjects[args.elemID].nbValue = args.args.nbValue;
                }else{
                    if(!allObjects[args.elemID].nbValue){return null;}else{return allObjects[args.elemID].nbValue;}
                }               
                return args.element;
            }            
        }
    },

    checkbox:{
        create:function(args){       
            var element = $('<input type="checkbox">')
            element = LCARS.definition(element, args);
            return element;
        }
    },        

    checkboxButton:{
        create:function(args){
            var element = $('<label class="complexButton checkboxButton">');
            var input = LCARS.checkbox.create({type:'checkboxButton', name:args.name, checked:args.checked});
            $(element).prepend(input);
            if(args.template){        
                $(args.template).each(function(){
                    var nbCheck = 'numericBlock';
                    if(nbCheck.indexOf(this.class) > -1){
                        if(args.nbValue){this.nbValue = args.nbValue;}
                    }else{                  
                        if(this.type == 'button'){
                            if(args.label !== undefined){this.label = args.label;}
                            if(args.altLabel !== undefined){this.altLabel = args.altLabel;}
                        } 
                    }                   
                    var elementChild = LCARS[this.type].create(this);
                    $(element).append(elementChild);
                });
            }
            if(args.colors){
                saveColors = [];
                for (i = 0; i < args.colors.length; i++) { 
                    saveColors.push(args.colors[i]);
                }
                args.colors = [];
                element = LCARS.definition(element, args);
                args.colors = saveColors;
                element = LCARS.settings.set(element, args);
            }else{
                element = LCARS.definition(element, args);
            }
            return element;
        },
        
        settings:{
            label:function(args){
                if(args.set === true){
                    var elemBtn = $(args.element).find('.button');
                    var btnID = $(elemBtn).attr('id');
                    if(args.args.label === null && args.original.label != null){     
                        $(elemBtn).removeAttr('data-label');
                        allObjects[args.elemID].label = null;
                        allObjects[btnID].label = null;
                    }else if(typeof args.args.label === 'string'){
                        $(elemBtn).attr('data-label', args.args.label);             
                        allObjects[args.elemID].label = args.args.label;
                        allObjects[btnID].label = args.args.label;
                    }
                    return args.element;
                }else{
                    if(!allObjects[args.elemID].label){return null;}else{return allObjects[args.elemID].label;}

                }  
            },
            
            altLabel:function(args){
                if(args.set === true){
                    var elemBtn = $(args.element).find('.button');
                    var btnID = $(elemBtn).attr('id');
                    if(args.args.altLabel === null && args.original.altLabel != null){     
                        $(elemBtn).removeAttr('data-altLabel');
                        allObjects[args.elemID].altLabel = null;
                        allObjects[args.btnID].altLabel = null;
                    }else if(typeof args.args.altLabel === 'string'){
                        $(elemBtn).attr('data-altLabel', args.args.altLabel);             
                        allObjects[args.elemID].altLabel = args.args.altLabel;
                        allObjects[args.btnID].altLabel = args.args.altLabel;
                    }
                    return args.element;
                }else{
                    if(!allObjects[args.elemID].altLabel){return null;}else{return allObjects[args.elemID].altLabel;}

                }  
            },
            nbValue:function(args){
                if(args.set === true){         
                    var elemNB = $(args.element).find('.numericBlock');
                    LCARS.settings.set(elemNB, {nbValue:args.args.nbValue});
                    allObjects[args.elemID].nbValue = args.args.nbValue;
                }else{
                    if(!allObjects[args.elemID].nbValue){return null;}else{return allObjects[args.elemID].nbValue;}
                }              
                return args.element;
            }            
        }             
    },

    wrapper:{
        create:function(args){
            var element = $('<div class="wrapper"></div>');            
            element = LCARS.definition(element, args);  
            
            return element;	
        }
    },

    title:{
        create:function(args){
            var element = $('<div>'+args.text+'</div>');					
            element = LCARS.definition(element, args);
            return element;
        }
    },

    img:{
        create:function(args){
            var element = $('<img>');					
            element = LCARS.definition(element, args);            
            return element;	 
        }
    },

    svg:{
        create:function(args){
            var element = $(args.xml);	
            element = LCARS.definition(element, args);               
            return element;	
        }
    },

    textInput:{
        create:function(args){
            if(args.password === true){
                var element = $('<input type="password" />');					
            }else{
                var element = $('<input type="text" />');					
            }  
            element = LCARS.definition(element, args);
            return element;
        }
    },

    bracket:{
        create:function(args){
            if(args.id){args.template.id = args.id;}
            var element = LCARS[args.template.type].create(args.template);
            element = LCARS.definition(element, args);
            return element;		
        }
    },

    dialog:{
        create:function(args){
            if(args.id){args.template.id = args.id;}
            var element = LCARS[args.template.type].create(args.template);
            element = LCARS.definition(element, args);
            return element;	        
        }, 
        
        settings:{
            headerTitle:function(args){
                var headerTitle = $(args.element).find('.header').children('.title');
                var titleID = $(headerTitle).attr('id');
                if(args.set === true){
                    if(args.args.headerTitle === null && args.original.headerTitle != null){     
                        $(headerTitle).text('');
                        allObjects[args.elemID].headerTitle = null;
                        allObjects[titleID].text = null;
                    }else if(typeof args.args.headerTitle === 'string'){
                        $(headerTitle).html(args.args.headerTitle);
                        allObjects[args.elemID].headerTitle = args.args.headerTitle;
                        allObjects[titleID].text = args.args.headerTitle;
                    }
                    return args.element;
                }else{
                    if(!allObjects[args.elemID].headerTitle){return null;}else{return allObjects[args.elemID].headerTitle;}
                }            
                return args.element;
            },
            
            footerTitle:function(args){
                var footerTitle = $(args.element).find('.footer').children('.title');
                var titleID = $(footerTitle).attr('id');
                if(args.set === true){
                    if(args.args.footerTitle === null && args.original.footerTitle != null){     
                        $(footerTitle).text('');
                        allObjects[args.elemID].footerTitle = null;
                        allObjects[titleID].text = null;
                    }else if(typeof args.args.footerTitle === 'string'){
                        $(footerTitle).html(args.args.footerTitle);
                        allObjects[args.elemID].footerTitle = args.args.footerTitle;
                        allObjects[titleID].text = args.args.footerTitle;
                    }
                    return args.element;
                }else{
                    if(!allObjects[args.elemID].footerTitle){return null;}else{return allObjects[args.elemID].footerTitle;}
                }            
                return args.element;             
            }
        }
    },
    
    htmlTag:{
        create:function(args){
            var element = $('<'+args.tag+'>');
            element = LCARS.definition(element, args);
            return element;
        }
    }    
    
}


//Disables Rubber Banding in iOS.
$(document).ready(function(){
	if(webviewInfo.os === 'ios'){
        document.ontouchmove = function(event){
            event.preventDefault();
        }    
    }
});


//Used to sort alphabetically within an array.
function compare(a,b) {
  if (a.label < b.label)
     return -1;
  if (a.label > b.label)
    return 1;
  return 0;
}


/** + brief Label 'Double Event' Prevention
*
*   Radio and Checkbox buttons are created via a parent label wrapper
*   and the input element stored within, hidden and display:none.
*
*   Doing this causes events to trigger twice.
*
*   Click, Tap & Single Tap call the labelPreventSet().  This prevents and
*   sets the input DOM state along with updating the appropirate definitions.
*   
*   All other events should not trigger the input checked state change
*   and thus call the simple labelPreventDefault().
*
*   !note - Be careful with the labelPreventSet() function and async
*   checking of the input value to update the value once specific 
*   requirements are set.  labelPreventDefault() can be rewritten to 
*   work with specific observers. 
*
**/

function labelPreventDefault(){
    event.preventDefault();
}

function labelPreventSet(event){
    event.preventDefault();
    var input = $(this).find('input');
    var elemID = $(this).attr('id');
    var inputID = $(input).attr('id');
    if($(this).hasClass('checkboxButton')){
        if(allObjects[elemID].checked === true){
            $(input).prop('checked', false);   
            allObjects[elemID].checked = false;
            allObjects[inputID].checked = false;
        }else{      
            $(input).prop('checked', true);
            allObjects[elemID].checked = true;
            allObjects[inputID].checked = true;
        }
    }else{
        if(allObjects[elemID].checked !== true){    
            $(input).prop('checked', true);
            allObjects[elemID].checked = true;
            allObjects[inputID].checked = true;
            var nameGroup = $(this).attr('name')
            $('label[name="'+nameGroup+'"]:not(#'+elemID+')').each(function(){
                var input = $(this).find('input');
                var elemID = $(this).attr('id');
                var inputID = $(input).attr('id');
                allObjects[elemID].checked = false;
                allObjects[inputID].checked = false;
            });
        }  
    }
}


/** + brief $.fn Calls
*   
*   The SDK provides a handful of $.api calls for easy object
*   creation, manipulation and deletion. 
*
*   !note - Use the $.removeObject() when deleting an object from the
*           scene for proper cleanup within the environment.  
*           
*           DO NOT USE native $.remove() any object that has a stored definition.
*
*   The SDK does not provide $.api wrappers per specific settings, only a single universal
*   controller is provided, $.objectSettings();
*
*   An example would be $.objectLabel(); -> pass string - sets / pass nothing - returns
*   These are easy to create per a projects needs and are likely to be customized 
*   accordingly so not provided here.
*
*/

/** +brief Create Object
 *	@args - {}
 *  >return - When returning, only pass a single element or template.
 *  !note - This is the universal create call.  All objects, from a single button or bar 
 *          to entire widgets, this single call handles them all.  An entire UI
 *          can be created with a single create call.
 *  !note - This call directly interacts with the LCARS.create.X API.  While those API
 *          calls can be accessed directly, it is highly encouraged to use this $.fn structure.
 */	
$.fn.createObject = function(args){
    this.each(function(){
        var element = LCARS[this.type].create(this);
        
        if(args.appendTo == undefined && this.appendTo == undefined || args.return === true){return element; }else
        if(args.appendTo !== undefined){$(''+args.appendTo+'').append(element); setTimeout(function(){if(typeof this.success  === 'function'){this.success();}},0); }else
        if(args.appendTo == undefined && this.appendTo !== undefined){$(''+this.appendTo+'').append(element); setTimeout(function(){if(typeof this.success  === 'function'){this.success();}},0);}
    });
    setTimeout(function(){if(typeof args.success  === 'function'){args.success();}}, args.timing + 0);
}

/** +brief Remove Object
 *	^syntax - $(element).removeObject(success);
 *  !note - If object has an ID and has a definition within the 'allObjects' variable
 *          it checks to see if there is an attached 'remove' event specifically for that object.
 *          This allows elements to trigger events when they are removed from the view.
 *  !note - Removes definition object from global variable, 'allObjects'.
 */	
$.fn.removeObject = function(success){
    this.each(function(){
        var objectID = $(this).attr('id');    
        $(this).remove();
        if(allObjects.hasOwnProperty(objectID)){if(typeof allObjects[objectID].remove === 'function'){setTimeout(function(){delete allObjects[objectID];}, timing_sequence);}}
        $(this).find('[id]').each(function() { 
            var elemID = $(this).attr('id');
            delete allObjects[elemID];
        });
    });
    if(typeof success === 'function'){setTimeout(function(){success();}, timing_sequence);}
}                         
                             
/** +brief Sequence Remove - Delay and sequential
 *  !note - Remove elements and triggers optional individual element remove function.
 *  @args - {fade:true, timing:int, success:function(){}}
 *  @args.fade - true/false - Override objects fade setting.
 *  @args.timing - Transition time for fading. 
 *  !note - If object has an ID and has a definition within the 'allObjects' variable
 *          it checks to see if there is an attached 'remove' event specifically for that object.
 *          This allows elements to trigger events when they appear within view.
 */	    
$.fn.removeObjectSequence = function(args){		
    var array = this;
    var count = array.length
    var numberStart = args.number || 0;
    var object = array[numberStart]
    var objectID = $(object).attr('id');
    if(!args.timing){args.timing = 0;}
    if($(object).hasClass('fade') && args.fade !== false){
        $(object).css('opacity', '0');
        setTimeout(function(){$(object).addClass('hidden');}, args.timing+timing_sequence);
        if(allObjects.hasOwnProperty(objectID)){if(typeof allObjects[objectID].remove === 'function'){setTimeout(function(){allObjects[objectID].remove();}, args.timing+timing_sequence);}}
        setTimeout(function(){ $(object).remove();}, args.timing+timing_sequence);
    }else{
        $(object).addClass('hidden');
        if(allObjects.hasOwnProperty(objectID)){if(typeof allObjects[objectID].remove === 'function'){setTimeout(function(){allObjects[objectID].remove();}, args.timing+timing_sequence);}}
        setTimeout(function(){ $(object).remove();}, timing_sequence);
    } 
    
    if(numberStart+1 !== count){
        setTimeout(function(){ $(array).removeObjectSequence({timing:args.timing, number:numberStart+1, success:args.success}); }, timing_sequence);
    }else{
       if(typeof args.success  === 'function'){setTimeout(function(){ args.success();}, args.timing+timing_sequence);}
    }
  
}

/** +brief Show Object
 *	@args - {fade:boolean, timing:int, success:function(){}}
 *  @args.fade - true/false - Override objects fade setting.
 *  @args.timing - Transition time for fading.
 *  !note - If object has an ID and has a definition within the 'allObjects' variable
 *          it checks to see if there is an attached 'show' event specifically for that object.
 *          This allows elements to trigger events when they appear within view.
 */	
$.fn.showObject = function(args){
    this.each(function(){
        var objectID = $(this).attr('id'); 
        if($(this).hasClass('fade') && args.fade !== false){
            $(this).removeClass('hidden');
            $(this).css('opacity', '1');
            
            if(allObjects.hasOwnProperty(objectID)){if(typeof allObjects[objectID].show === 'function'){setTimeout(function(){allObjects[objectID].show();}, args.timing + timing_sequence);}}
        }else{
            $(this).removeClass('hidden');
            if(allObjects.hasOwnProperty(objectID)){if(typeof allObjects[objectID].show === 'function'){setTimeout(function(){allObjects[objectID].show();}, args.timing + timing_sequence);}}
        }   
    });
    if(typeof args.success === 'function'){setTimeout(function(){ args.success();}, args.timing+timing_sequence);}
    return this;   
}

/** +brief Sequence Show - Delay and sequential
 *  !note - Show elements and triggers optional individual element Show function.
 *  @args - {fade:boolean, timing:250, success:function(){}}
 *  @args.fade - true/false - Override objects fade setting.
 *  @args.timing - Transition time for fading.
 *  !note - If object has an ID and has a definition within the 'allObjects' variable
 *          it checks to see if there is an attached 'show' event specifically for that object.
 *          This allows elements to trigger events when they appear within view.
 */	     
$.fn.showObjectSequence = function(args){		
    var array = this;
    var count = array.length
    var numberStart = args.number || 0;
    var object = array[numberStart]
    var objectID = $(object).attr('id'); 
    if(!args.timing){args.timing = 0;}
    if($(object).hasClass('fade') && args.fade !== false){
        $(object).removeClass('hidden');
        $(object).css('opacity', '1');
        if(allObjects.hasOwnProperty(objectID)){if(typeof allObjects[objectID].show === 'function'){setTimeout(function(){allObjects[objectID].show();}, args.timing+timing_sequence);}}
    }else{
        $(object).removeClass('hidden');
        if(allObjects.hasOwnProperty(objectID)){if(typeof allObjects[objectID].show === 'function'){setTimeout(function(){allObjects[objectID].show();}, args.timing+timing_sequence);}}
    }    
    
    if(numberStart+1 !== count){
        setTimeout(function(){ $(array).showObjectSequence({timing:args.timing, number:numberStart+1, success:args.success}); }, args.timing+timing_sequence);
    }else{
       if(typeof args.success  === 'function'){setTimeout(function(){ args.success();}, args.timing+timing_sequence);}
    }         
}

/** +brief Hide Object
 *	@args - {fade:boolean, timing:int, success:function(){}}
 *  @args.fade - true/false - Override objects fade setting.
 *  @args.timing - Transition time for fading.
 *  !note - If object has an ID and has a definition within the 'allObjects' variable
 *          it checks to see if there is an attached 'hide' event specifically for that object.
 *          This allows elements to trigger events when they disappear within view.
 */	
$.fn.hideObject = function(args){
    this.each(function(){
        var objectID = $(this).attr('id'); 
        if($(this).hasClass('fade') && args.fade !== false){
            $(this).css('opacity', '0');
            setTimeout(function(){$('#'+objectID+'').addClass('hidden');}, args.timing+timing_sequence);
            if(allObjects.hasOwnProperty(objectID)){if(typeof allObjects[objectID].hide === 'function'){setTimeout(function(){allObjects[objectID].hide();}, args.timing+timing_sequence);}}
        }else{
            $(this).addClass('hidden');
            if(allObjects.hasOwnProperty(objectID)){if(typeof allObjects[objectID].hide === 'function'){setTimeout(function(){allObjects[objectID].hide();}, args.timing+timing_sequence);}}
        }   
    });
    if(typeof args.success === 'function'){setTimeout(function(){ args.success();}, args.timing+timing_sequence);}
    return this;   
}

/** +brief Sequence Hide - Delay and sequential
 *  !note - Hide elements and triggers optional individual element remove function.
 *  @args - {fade:true, timing:250,  success:function(){}}
 *  @args.fade - true/false - Override objects fade setting.
 *  @args.timing - Transition time for fading. 
 */	    
$.fn.hideObjectSequence = function(args){		
    var array = this;
    var count = array.length
    var numberStart = args.number || 0;
    var object = array[numberStart]
    var objectID = $(this).attr('id');
    if(!args.timing){args.timing = 0;}
    if($(object).hasClass('fade') && args.fade !== false){
        $(object).css('opacity', '0');
        setTimeout(function(){$(object).addClass('hidden');}, args.timing+timing_sequence);
        if(allObjects.hasOwnProperty(objectID)){if(typeof allObjects[objectID].hide === 'function'){setTimeout(function(){allObjects[objectID].hide();}, args.timing+timing_sequence);}}
    }else{
        $(object).addClass('hidden');
        if(allObjects.hasOwnProperty(objectID)){if(typeof allObjects[objectID].hide === 'function'){setTimeout(function(){allObjects[objectID].hide();}, args.timing+timing_sequence);}}
    } 
    
    if(numberStart+1 !== count){
        setTimeout(function(){ $(array).hideObjectSequence({timing:args.timing, number:numberStart+1, success:args.success}); }, args.timing+timing_sequence);
    }else{
       if(typeof args.success  === 'function'){setTimeout(function(){ args.success();}, args.timing+timing_sequence);}
    }  
}


/** +brief Object Setting
 *  ex. $.fn.objectSettings({color:'red'}, function(){});
 *  ex. $.fn.objectSettings('color', {secondary:arg}, function(){});
 *  @setting - Setting(s) to change.  Matches setting name used in object definitions.
 *  @args - Secondary set of arguments that can be passed when getting.
 *  >return - Pass String Name - $.fn.objectSettings('color'); 
 *
 *  !note - Look to each setting for proper value type to be
 *          passed through the settings.  Most settings use string/null
 *          as the set/get flags.  Some settings, like class, use a
 *          string/array combination to apply and remove class names.
 */	    
$.fn.objectSettings = function(setting, args, success){		
    if(typeof setting === 'string'){ 
        if(typeof args === 'function'){args();}
        if(typeof success === 'function'){success();}
        return LCARS.settings.get($(this), setting, args);
    }else{ 
        $(this).each(function(){
            LCARS.settings.set($(this), setting);
        });
        if(typeof args === 'function'){args();}
        return this; 
    }  
}

/** +brief Get Definition
*   @id - boolean, if true returns ID strings else definition objects.
*   >return - {} else null.
*	!note:  Pass only a single object.
**/	
$.fn.getDefinition = function(){
    var elemID = $(this).attr('id');
    if(allObjects[elemID]){
        return allObjects[elemID];
    }else{
        return null;
    }
}

/** +brief Get Children
*   
*   >return - [].
*	!note:  Pass only a single object.
**/	
$.fn.getChildren = function(id){ 
    var allChildren = []
    $(this).children().each(function(){
        var elemID = $(this).attr('id');
        if(id === true){
            allChildren.push(elemID);
        }else{
            allChildren.push(allObjects[elemID]);    
        }
    });
    return allChildren;
} 
        
        
/** +brief Viewport Settings
 *  +Scale a wrappered interface, respecting aspect ratio of the interface.
 *  +Shrink the viewport height/width in specific increments
 *  ^syntax - $(element).viewport('scale', {width:1080, height:1920, max:true});
 *  ^syntax - $(element).viewport('step', {width:1080, height:1920, baseStepV:60, spacingStepV:65, baseStepH:150, spacingStepH:155});
 *  @width - Target viewport default width
 *  @height - Target viewport default height
 *  @max - When scale ratio equals 1 or greater, disables scaling and interface renders at default width/height.
 *  @baseStepV - Base element heights.  Standard is 60px generally.
 *  @spacingStepV - Stepping value, add baseStepV to spacing value (60px height + 5px spacing = 65px).
 *  @baseStepH - Base element width.  Standard is 150px generally.
 *  @spacingStepH - Stepping value, add spacingStepH to spacing value (150px width + 5px spacing = 155px).
 *  !note - 'Standard' spacing is relative.  There are a few spacing standards within the LCARS
 *          methodology.
 */	
$.fn.viewport = function(action, args){
    var element = this;
    if(action === 'scale'){
        LCARS.scaler(args.width, args.height, element, args.max);
        window.onresize = function(event) {
            LCARS.scaler(args.width, args.height, element, args.max); 
        }
    }else if(action === 'step'){
        LCARS.stepper(args.width, args.height, args.baseStepV, args.spacingStepV, args.baseStepH, args.spacingStepH, element);
        window.onresize = function(event) {
            LCARS.stepper(args.width, args.height, args.baseStepV, args.spacingStepV, args.baseStepH, args.spacingStepH, element);    
        }
    }
    
}


/** +brief Has Attribute 
 *	@arg - String: attribute value
 *  @string - Boolean:  Returns attribute value if true.
 *  >return - true/false/string
 *	!note:  Pass only a single object.
 */	
$.fn.hasAttr = function(arg, string){
    var check = $(this)[0].hasAttribute(arg);
    if(string === true){
        return $(this).attr(arg);
    }else{
        return check;
    }
}


/** +brief Element Scrolling
 *	@arg - {target:object, step:int}
 *	@arg - ex. {target:$('body'), step:65}
 *	!note:  Pass only a single object.
 */	
$.fn.scrollUp = function(args){    
    $(args.target).each(function(){
       var scrollVal = $(this).scrollTop();
	   $(this).scrollTop(scrollVal-args.step);
    });  
}

$.fn.scrollDown = function(args){    
    $(args.target).each(function(){
       var scrollVal = $(this).scrollTop();
	   $(this).scrollTop(scrollVal+args.step);
    });
    
}

$.fn.scrollLeft = function(args){    
   $(args.target).each(function(){ 
        var scrollVal = $(this).scrollLeft();
	   $(this).scrollLeft(scrollVal-args.step);
   });
}

$.fn.scrollRight = function(args){    
    $(args.target).each(function(){
        var scrollVal = $(this).scrollLeft();	
        $(this).scrollLeft(scrollVal+args.step); 
    });
}


//Touch Specific Modifications
if(webviewInfo.input === "touch"){

    /**
    * Native webview check states are click events
    * which are 300ms slower than tap/touchstart.
    * This prevents the native click event on touch
    * interaction automatically.
    */
    $(document).on('click', '.touch .checkboxButton, .touch .radioButton', function(e){event.preventDefault();});

    //IE Specific for Touch.
    if(webviewInfo.ie === true){
        /**
        * For IE Active States.  Clicking on a child element does not 
        * trigger its parents css :active state in IE.  JS is required with class change.
        */
        $(document).on('touchstart', '.ie.touch .complexButton:not(.disabled):not(.noEvent), .ie.touch :not(.complexButton)>.button:not(.disabled):not(.noEvent), .ie.touch .elbow:not(.disabled):not(.noEvent)', function(){
            $(this).addClass('active');
        });

        $(document).on('touchend', '.ie.touch .complexButton.active, .ie.touch .button.active, .ie.touch .elbow.active', function(e){      
            $(this).removeClass('active'); 
        });

        $(document).on('touchcancel', '.ie.touch .complexButton.active, .ie.touch .button.active, .ie.touch .elbow.active', function(e){      
            $(this).removeClass('active'); 
        });

        $(document).on('mousedown', '.ie .complexButton:not(.disabled):not(.noEvent), .ie :not(.complexButton)>.button:not(.disabled):not(.noEvent), .ie .elbow:not(.disabled):not(.noEvent)', function(){
            $(this).addClass('active');
        });

        $(document).on('mouseup', '.ie .complexButton.active, .ie.button.active, .ie .elbow.active', function(e){      
            $(this).removeClass('active'); 
        });

        $(document).on('mouseup', '.ie body', function(e){      
            var $activeElements = $('.complexButton.active, .elbow.active') 
            if($activeElements.length > 0){
                $activeElements.removeClass('active'); 
            } 
        });
    }

    //Browsers native input checked state is a click event, even on a touch screen.
    $(document).on('click', '.checkboxButton, .radioButton', function(event){event.preventDefault();});


    /**
    * For Touch Active States.
    *
    * Only used because the :active CSS state is a click event and thus has the 300ms delay after click end.
    */
    $(document).on('touchstart', '.complexButton:not(.disabled):not(.noEvent), :not(.complexButton)>.button:not(.disabled):not(.noEvent), .elbow:not(.disabled):not(.noEvent)', function(){
        $(this).addClass('active');
    });

    $(document).on('touchend', '.complexButton.active, .button.active, .elbow.active', function(e){      
        $(this).removeClass('active'); 
    });

    $(document).on('touchcancel', '.complexButton.active, .button.active, .elbow.active', function(e){      
        $(this).removeClass('active'); 
    });

}