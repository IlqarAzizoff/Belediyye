
/*
 * jQuery selectbox plugin
 *
 * Copyright (c) 2007 Sadri Sahraoui (brainfault.com)
 * Licensed under the GPL license and MIT:
 *   http://www.opensource.org/licenses/GPL-license.php
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * The code is inspired from Autocomplete plugin (http://www.dyve.net/jquery/?autocomplete)
 *
 * Revision: $Id$
 * Version: 0.5
 * 
 * Changelog :
 *  Version 0.5 
 *  - separate css style for current selected element and hover element which solve the highlight issue 
 *  Version 0.4
 *  - Fix width when the select is in a hidden div   @Pawel Maziarz
 *  - Add a unique id for generated li to avoid conflict with other selects and empty values @Pawel Maziarz
 */
jQuery.fn.extend({
	selectbox: function(options) {
		return this.each(function() {
			new jQuery.SelectBox(this, options);
		});
	}
});
 
 
/* pawel maziarz: work around for ie logging */
if (!window.console) {
	var console = {
		log: function(msg) { 
	 }
	}
}
/* */
 
jQuery.SelectBox = function(selectobj, options) {
	
	var opt = options || {};
	opt.inputClass = opt.inputClass || "selectbox";
	opt.containerClass = opt.containerClass || "selectbox-wrapper";
	opt.hoverClass = opt.hoverClass || "current";
	opt.currentClass = opt.selectedClass || "selected"
	opt.debug = opt.debug || false;
	
	var elm_id = selectobj.id;
	var active = -1;
	var inFocus = false;
	var hasfocus = 0;
	//jquery object for select element
	var $select = $(selectobj);
	// jquery container object
	var $container = setupContainer(opt);
	//jquery input object 
	var $input = setupInput(opt);
	// hide select and append newly created elements
	$select.hide().before($input).before($container);
	
	
	init();
	
	$input
	.click(function(){
    if (!inFocus) {
		  $container.toggle();
		}
	})
	.focus(function(){
	   if ($container.not(':visible')) {
	       inFocus = true;
	       $container.show();
	   }
	})
	.keydown(function(event) {
		switch(event.keyCode) {
			case 38: // up
				event.preventDefault();
				moveSelect(-1);
				break;
			case 40: // down
				event.preventDefault();
				moveSelect(1);
				break;
			//case 9:  // tab 
			case 13: // return
				event.preventDefault(); // seems not working in mac !
				$('li.'+opt.hoverClass).trigger('click');
				break;
			case 27: //escape
			  hideMe();
			  break;
		}
	})
	.blur(function() {
		if ($container.is(':visible') && hasfocus > 0 ) {
			if(opt.debug) console.log('container visible and has focus')
		} else {
			hideMe();	
		}
	});


	function hideMe() { 
		hasfocus = 0;
		$container.hide(); 
	}
	
	function init() {
		$container.append(getSelectOptions($input.attr('id'))).hide();
		var width = $input.css('width');
		$container.width(width);
    }
	
	function setupContainer(options) {
		var container = document.createElement("div");
		$container = $(container);
		$container.attr('id', elm_id+'_container');
		$container.addClass(options.containerClass);
		
		return $container;
	}
	
	function setupInput(options) {
		var input = document.createElement("input");
		var $input = $(input);
		$input.attr("id", elm_id+"_input");
		$input.attr("type", "text");
		$input.addClass(options.inputClass);
		$input.attr("autocomplete", "off");
		$input.attr("readonly", "readonly");
		$input.attr("tabIndex", $select.attr("tabindex")); // "I" capital is important for ie
		
		return $input;	
	}
	
	function moveSelect(step) {
		var lis = $("li", $container);
		if (!lis) return;

		active += step;

		if (active < 0) {
			active = 0;
		} else if (active >= lis.size()) {
			active = lis.size() - 1;
		}

		lis.removeClass(opt.hoverClass);

		$(lis[active]).addClass(opt.hoverClass);
	}
	
	function setCurrent() {	
		var li = $("li."+opt.currentClass, $container).get(0);
		var ar = (''+li.id).split('_');
		var el = ar[ar.length-1];
		$select.val(el);
		$input.val($(li).html());
		return true;
	}
	
	// select value
	function getCurrentSelected() {
		return $select.val();
	}
	
	// input value
	function getCurrentValue() {
		return $input.val();
	}
	
	function getSelectOptions(parentid) {
		var select_options = new Array();
		var ul = document.createElement('ul');
		$select.children('option').each(function() {
			var li = document.createElement('li');
			li.setAttribute('id', parentid + '_' + $(this).val());
			li.innerHTML = $(this).html();
			if ($(this).is(':selected')) {
				$input.val($(this).html());
				$(li).addClass(opt.currentClass);
			}
			ul.appendChild(li);
			$(li)
			.mouseover(function(event) {
				hasfocus = 1;
				if (opt.debug) console.log('over on : '+this.id);
				jQuery(event.target, $container).addClass(opt.hoverClass);
			})
			.mouseout(function(event) {
				hasfocus = -1;
				if (opt.debug) console.log('out on : '+this.id);
				jQuery(event.target, $container).removeClass(opt.hoverClass);
			})
			.click(function(event) {
			  var fl = $('li.'+opt.hoverClass, $container).get(0);
				if (opt.debug) console.log('click on :'+this.id);
				$('li.'+opt.currentClass).removeClass(opt.currentClass); 
				$(this).addClass(opt.currentClass);
				setCurrent();
				hideMe();
			});
		});
		return ul;
	}
	
};

/**
 * Cookie plugin
 * Copyright (c) 2006 Klaus Hartl (stilbuero.de)
 */
jQuery.cookie=function(name,value,options){if(typeof value!='undefined'){options=options||{};if(value===null){value='';options.expires=-1;}var expires='';if(options.expires &&(typeof options.expires=='number'||options.expires.toUTCString)){var date;if(typeof options.expires=='number'){date=new Date();date.setTime(date.getTime()+(options.expires*24*60*60*1000));}else{date=options.expires;}expires=';expires='+date.toUTCString();}var path=options.path?';path='+(options.path):'';var domain=options.domain?';domain='+(options.domain):'';var secure=options.secure?';secure':'';document.cookie=[name,'=',encodeURIComponent(value),expires,path,domain,secure].join('');}else{var cookieValue=null;if(document.cookie && document.cookie!=''){var cookies=document.cookie.split(';');for(var i=0;i<cookies.length;i++){var cookie=jQuery.trim(cookies[i]);if(cookie.substring(0,name.length+1)==(name+'=')){cookieValue=decodeURIComponent(cookie.substring(name.length+1));break;}}}return cookieValue;}};
/* jQuery Cycle Plugin (with Transition Definitions)
 * Examples and documentation at: http://jquery.malsup.com/cycle/
 * Copyright (c) 2007-2010 M. Alsup
 * Version: 2.88 (08-JUN-2010)
 */
(function($){var ver="2.88";if($.support==undefined){$.support={opacity:!($.browser.msie)};}function debug(s){if($.fn.cycle.debug){log(s);}}function log(){if(window.console&&window.console.log){window.console.log("[cycle] "+Array.prototype.join.call(arguments," "));}}$.fn.cycle=function(options,arg2){var o={s:this.selector,c:this.context};if(this.length===0&&options!="stop"){if(!$.isReady&&o.s){log("DOM not ready, queuing slideshow");$(function(){$(o.s,o.c).cycle(options,arg2);});return this;}log("terminating; zero elements found by selector"+($.isReady?"":" (DOM not ready)"));return this;}return this.each(function(){var opts=handleArguments(this,options,arg2);if(opts===false){return;}opts.updateActivePagerLink=opts.updateActivePagerLink||$.fn.cycle.updateActivePagerLink;if(this.cycleTimeout){clearTimeout(this.cycleTimeout);}this.cycleTimeout=this.cyclePause=0;var $cont=$(this);var $slides=opts.slideExpr?$(opts.slideExpr,this):$cont.children();var els=$slides.get();if(els.length<2){log("terminating; too few slides: "+els.length);return;}var opts2=buildOptions($cont,$slides,els,opts,o);if(opts2===false){return;}var startTime=opts2.continuous?10:getTimeout(els[opts2.currSlide],els[opts2.nextSlide],opts2,!opts2.rev);if(startTime){startTime+=(opts2.delay||0);if(startTime<10){startTime=10;}debug("first timeout: "+startTime);this.cycleTimeout=setTimeout(function(){go(els,opts2,0,(!opts2.rev&&!opts.backwards));},startTime);}});};function handleArguments(cont,options,arg2){if(cont.cycleStop==undefined){cont.cycleStop=0;}if(options===undefined||options===null){options={};}if(options.constructor==String){switch(options){case"destroy":case"stop":var opts=$(cont).data("cycle.opts");if(!opts){return false;}cont.cycleStop++;if(cont.cycleTimeout){clearTimeout(cont.cycleTimeout);}cont.cycleTimeout=0;$(cont).removeData("cycle.opts");if(options=="destroy"){destroy(opts);}return false;case"toggle":cont.cyclePause=(cont.cyclePause===1)?0:1;checkInstantResume(cont.cyclePause,arg2,cont);return false;case"pause":cont.cyclePause=1;return false;case"resume":cont.cyclePause=0;checkInstantResume(false,arg2,cont);return false;case"prev":case"next":var opts=$(cont).data("cycle.opts");if(!opts){log('options not found, "prev/next" ignored');return false;}$.fn.cycle[options](opts);return false;default:options={fx:options};}return options;}else{if(options.constructor==Number){var num=options;options=$(cont).data("cycle.opts");if(!options){log("options not found, can not advance slide");return false;}if(num<0||num>=options.elements.length){log("invalid slide index: "+num);return false;}options.nextSlide=num;if(cont.cycleTimeout){clearTimeout(cont.cycleTimeout);cont.cycleTimeout=0;}if(typeof arg2=="string"){options.oneTimeFx=arg2;}go(options.elements,options,1,num>=options.currSlide);return false;}}return options;function checkInstantResume(isPaused,arg2,cont){if(!isPaused&&arg2===true){var options=$(cont).data("cycle.opts");if(!options){log("options not found, can not resume");return false;}if(cont.cycleTimeout){clearTimeout(cont.cycleTimeout);cont.cycleTimeout=0;}go(options.elements,options,1,(!opts.rev&&!opts.backwards));}}}function removeFilter(el,opts){if(!$.support.opacity&&opts.cleartype&&el.style.filter){try{el.style.removeAttribute("filter");}catch(smother){}}}function destroy(opts){if(opts.next){$(opts.next).unbind(opts.prevNextEvent);}if(opts.prev){$(opts.prev).unbind(opts.prevNextEvent);}if(opts.pager||opts.pagerAnchorBuilder){$.each(opts.pagerAnchors||[],function(){this.unbind().remove();});}opts.pagerAnchors=null;if(opts.destroy){opts.destroy(opts);}}function buildOptions($cont,$slides,els,options,o){var opts=$.extend({},$.fn.cycle.defaults,options||{},$.metadata?$cont.metadata():$.meta?$cont.data():{});if(opts.autostop){opts.countdown=opts.autostopCount||els.length;}var cont=$cont[0];$cont.data("cycle.opts",opts);opts.$cont=$cont;opts.stopCount=cont.cycleStop;opts.elements=els;opts.before=opts.before?[opts.before]:[];opts.after=opts.after?[opts.after]:[];opts.after.unshift(function(){opts.busy=0;});if(!$.support.opacity&&opts.cleartype){opts.after.push(function(){removeFilter(this,opts);});}if(opts.continuous){opts.after.push(function(){go(els,opts,0,(!opts.rev&&!opts.backwards));});}saveOriginalOpts(opts);if(!$.support.opacity&&opts.cleartype&&!opts.cleartypeNoBg){clearTypeFix($slides);}if($cont.css("position")=="static"){$cont.css("position","relative");}if(opts.width){$cont.width(opts.width);}if(opts.height&&opts.height!="auto"){$cont.height(opts.height);}if(opts.startingSlide){opts.startingSlide=parseInt(opts.startingSlide);}else{if(opts.backwards){opts.startingSlide=els.length-1;}}if(opts.random){opts.randomMap=[];for(var i=0;i<els.length;i++){opts.randomMap.push(i);}opts.randomMap.sort(function(a,b){return Math.random()-0.5;});opts.randomIndex=1;opts.startingSlide=opts.randomMap[1];}else{if(opts.startingSlide>=els.length){opts.startingSlide=0;}}opts.currSlide=opts.startingSlide||0;var first=opts.startingSlide;$slides.css({position:"absolute",top:0,left:0}).hide().each(function(i){var z;if(opts.backwards){z=first?i<=first?els.length+(i-first):first-i:els.length-i;}else{z=first?i>=first?els.length-(i-first):first-i:els.length-i;}$(this).css("z-index",z);});$(els[first]).css("opacity",1).show();removeFilter(els[first],opts);if(opts.fit&&opts.width){$slides.width(opts.width);}if(opts.fit&&opts.height&&opts.height!="auto"){$slides.height(opts.height);}var reshape=opts.containerResize&&!$cont.innerHeight();if(reshape){var maxw=0,maxh=0;for(var j=0;j<els.length;j++){var $e=$(els[j]),e=$e[0],w=$e.outerWidth(),h=$e.outerHeight();if(!w){w=e.offsetWidth||e.width||$e.attr("width");}if(!h){h=e.offsetHeight||e.height||$e.attr("height");}maxw=w>maxw?w:maxw;maxh=h>maxh?h:maxh;}if(maxw>0&&maxh>0){$cont.css({width:maxw+"px",height:maxh+"px"});}}if(opts.pause){$cont.hover(function(){this.cyclePause++;},function(){this.cyclePause--;});}if(supportMultiTransitions(opts)===false){return false;}var requeue=false;options.requeueAttempts=options.requeueAttempts||0;$slides.each(function(){var $el=$(this);this.cycleH=(opts.fit&&opts.height)?opts.height:($el.height()||this.offsetHeight||this.height||$el.attr("height")||0);this.cycleW=(opts.fit&&opts.width)?opts.width:($el.width()||this.offsetWidth||this.width||$el.attr("width")||0);if($el.is("img")){var loadingIE=($.browser.msie&&this.cycleW==28&&this.cycleH==30&&!this.complete);var loadingFF=($.browser.mozilla&&this.cycleW==34&&this.cycleH==19&&!this.complete);var loadingOp=($.browser.opera&&((this.cycleW==42&&this.cycleH==19)||(this.cycleW==37&&this.cycleH==17))&&!this.complete);var loadingOther=(this.cycleH==0&&this.cycleW==0&&!this.complete);if(loadingIE||loadingFF||loadingOp||loadingOther){if(o.s&&opts.requeueOnImageNotLoaded&&++options.requeueAttempts<100){log(options.requeueAttempts," - img slide not loaded, requeuing slideshow: ",this.src,this.cycleW,this.cycleH);setTimeout(function(){$(o.s,o.c).cycle(options);},opts.requeueTimeout);requeue=true;return false;}else{log("could not determine size of image: "+this.src,this.cycleW,this.cycleH);}}}return true;});if(requeue){return false;}opts.cssBefore=opts.cssBefore||{};opts.animIn=opts.animIn||{};opts.animOut=opts.animOut||{};$slides.not(":eq("+first+")").css(opts.cssBefore);if(opts.cssFirst){$($slides[first]).css(opts.cssFirst);}if(opts.timeout){opts.timeout=parseInt(opts.timeout);if(opts.speed.constructor==String){opts.speed=$.fx.speeds[opts.speed]||parseInt(opts.speed);}if(!opts.sync){opts.speed=opts.speed/2;}var buffer=opts.fx=="shuffle"?500:250;while((opts.timeout-opts.speed)<buffer){opts.timeout+=opts.speed;}}if(opts.easing){opts.easeIn=opts.easeOut=opts.easing;}if(!opts.speedIn){opts.speedIn=opts.speed;}if(!opts.speedOut){opts.speedOut=opts.speed;}opts.slideCount=els.length;opts.currSlide=opts.lastSlide=first;if(opts.random){if(++opts.randomIndex==els.length){opts.randomIndex=0;}opts.nextSlide=opts.randomMap[opts.randomIndex];}else{if(opts.backwards){opts.nextSlide=opts.startingSlide==0?(els.length-1):opts.startingSlide-1;}else{opts.nextSlide=opts.startingSlide>=(els.length-1)?0:opts.startingSlide+1;}}if(!opts.multiFx){var init=$.fn.cycle.transitions[opts.fx];if($.isFunction(init)){init($cont,$slides,opts);}else{if(opts.fx!="custom"&&!opts.multiFx){log("unknown transition: "+opts.fx,"; slideshow terminating");return false;}}}var e0=$slides[first];if(opts.before.length){opts.before[0].apply(e0,[e0,e0,opts,true]);}if(opts.after.length>1){opts.after[1].apply(e0,[e0,e0,opts,true]);}if(opts.next){$(opts.next).bind(opts.prevNextEvent,function(){return advance(opts,opts.rev?-1:1);});}if(opts.prev){$(opts.prev).bind(opts.prevNextEvent,function(){return advance(opts,opts.rev?1:-1);});}if(opts.pager||opts.pagerAnchorBuilder){buildPager(els,opts);}exposeAddSlide(opts,els);return opts;}function saveOriginalOpts(opts){opts.original={before:[],after:[]};opts.original.cssBefore=$.extend({},opts.cssBefore);opts.original.cssAfter=$.extend({},opts.cssAfter);opts.original.animIn=$.extend({},opts.animIn);opts.original.animOut=$.extend({},opts.animOut);$.each(opts.before,function(){opts.original.before.push(this);});$.each(opts.after,function(){opts.original.after.push(this);});}function supportMultiTransitions(opts){var i,tx,txs=$.fn.cycle.transitions;if(opts.fx.indexOf(",")>0){opts.multiFx=true;opts.fxs=opts.fx.replace(/\s*/g,"").split(",");for(i=0;i<opts.fxs.length;i++){var fx=opts.fxs[i];tx=txs[fx];if(!tx||!txs.hasOwnProperty(fx)||!$.isFunction(tx)){log("discarding unknown transition: ",fx);opts.fxs.splice(i,1);i--;}}if(!opts.fxs.length){log("No valid transitions named; slideshow terminating.");return false;}}else{if(opts.fx=="all"){opts.multiFx=true;opts.fxs=[];for(p in txs){tx=txs[p];if(txs.hasOwnProperty(p)&&$.isFunction(tx)){opts.fxs.push(p);}}}}if(opts.multiFx&&opts.randomizeEffects){var r1=Math.floor(Math.random()*20)+30;for(i=0;i<r1;i++){var r2=Math.floor(Math.random()*opts.fxs.length);opts.fxs.push(opts.fxs.splice(r2,1)[0]);}debug("randomized fx sequence: ",opts.fxs);}return true;}function exposeAddSlide(opts,els){opts.addSlide=function(newSlide,prepend){var $s=$(newSlide),s=$s[0];if(!opts.autostopCount){opts.countdown++;}els[prepend?"unshift":"push"](s);if(opts.els){opts.els[prepend?"unshift":"push"](s);}opts.slideCount=els.length;$s.css("position","absolute");$s[prepend?"prependTo":"appendTo"](opts.$cont);if(prepend){opts.currSlide++;opts.nextSlide++;}if(!$.support.opacity&&opts.cleartype&&!opts.cleartypeNoBg){clearTypeFix($s);}if(opts.fit&&opts.width){$s.width(opts.width);}if(opts.fit&&opts.height&&opts.height!="auto"){$slides.height(opts.height);}s.cycleH=(opts.fit&&opts.height)?opts.height:$s.height();s.cycleW=(opts.fit&&opts.width)?opts.width:$s.width();$s.css(opts.cssBefore);if(opts.pager||opts.pagerAnchorBuilder){$.fn.cycle.createPagerAnchor(els.length-1,s,$(opts.pager),els,opts);}if($.isFunction(opts.onAddSlide)){opts.onAddSlide($s);}else{$s.hide();}};}$.fn.cycle.resetState=function(opts,fx){fx=fx||opts.fx;opts.before=[];opts.after=[];opts.cssBefore=$.extend({},opts.original.cssBefore);opts.cssAfter=$.extend({},opts.original.cssAfter);opts.animIn=$.extend({},opts.original.animIn);opts.animOut=$.extend({},opts.original.animOut);opts.fxFn=null;$.each(opts.original.before,function(){opts.before.push(this);});$.each(opts.original.after,function(){opts.after.push(this);});var init=$.fn.cycle.transitions[fx];if($.isFunction(init)){init(opts.$cont,$(opts.elements),opts);}};function go(els,opts,manual,fwd){if(manual&&opts.busy&&opts.manualTrump){debug("manualTrump in go(), stopping active transition");$(els).stop(true,true);opts.busy=false;}if(opts.busy){debug("transition active, ignoring new tx request");return;}var p=opts.$cont[0],curr=els[opts.currSlide],next=els[opts.nextSlide];if(p.cycleStop!=opts.stopCount||p.cycleTimeout===0&&!manual){return;}if(!manual&&!p.cyclePause&&!opts.bounce&&((opts.autostop&&(--opts.countdown<=0))||(opts.nowrap&&!opts.random&&opts.nextSlide<opts.currSlide))){if(opts.end){opts.end(opts);}return;}var changed=false;if((manual||!p.cyclePause)&&(opts.nextSlide!=opts.currSlide)){changed=true;var fx=opts.fx;curr.cycleH=curr.cycleH||$(curr).height();curr.cycleW=curr.cycleW||$(curr).width();next.cycleH=next.cycleH||$(next).height();next.cycleW=next.cycleW||$(next).width();if(opts.multiFx){if(opts.lastFx==undefined||++opts.lastFx>=opts.fxs.length){opts.lastFx=0;}fx=opts.fxs[opts.lastFx];opts.currFx=fx;}if(opts.oneTimeFx){fx=opts.oneTimeFx;opts.oneTimeFx=null;}$.fn.cycle.resetState(opts,fx);if(opts.before.length){$.each(opts.before,function(i,o){if(p.cycleStop!=opts.stopCount){return;}o.apply(next,[curr,next,opts,fwd]);});}var after=function(){$.each(opts.after,function(i,o){if(p.cycleStop!=opts.stopCount){return;}o.apply(next,[curr,next,opts,fwd]);});};debug("tx firing; currSlide: "+opts.currSlide+"; nextSlide: "+opts.nextSlide);opts.busy=1;if(opts.fxFn){opts.fxFn(curr,next,opts,after,fwd,manual&&opts.fastOnEvent);}else{if($.isFunction($.fn.cycle[opts.fx])){$.fn.cycle[opts.fx](curr,next,opts,after,fwd,manual&&opts.fastOnEvent);}else{$.fn.cycle.custom(curr,next,opts,after,fwd,manual&&opts.fastOnEvent);}}}if(changed||opts.nextSlide==opts.currSlide){opts.lastSlide=opts.currSlide;if(opts.random){opts.currSlide=opts.nextSlide;if(++opts.randomIndex==els.length){opts.randomIndex=0;}opts.nextSlide=opts.randomMap[opts.randomIndex];if(opts.nextSlide==opts.currSlide){opts.nextSlide=(opts.currSlide==opts.slideCount-1)?0:opts.currSlide+1;}}else{if(opts.backwards){var roll=(opts.nextSlide-1)<0;if(roll&&opts.bounce){opts.backwards=!opts.backwards;opts.nextSlide=1;opts.currSlide=0;}else{opts.nextSlide=roll?(els.length-1):opts.nextSlide-1;opts.currSlide=roll?0:opts.nextSlide+1;}}else{var roll=(opts.nextSlide+1)==els.length;if(roll&&opts.bounce){opts.backwards=!opts.backwards;opts.nextSlide=els.length-2;opts.currSlide=els.length-1;}else{opts.nextSlide=roll?0:opts.nextSlide+1;opts.currSlide=roll?els.length-1:opts.nextSlide-1;}}}}if(changed&&opts.pager){opts.updateActivePagerLink(opts.pager,opts.currSlide,opts.activePagerClass);}var ms=0;if(opts.timeout&&!opts.continuous){ms=getTimeout(els[opts.currSlide],els[opts.nextSlide],opts,fwd);}else{if(opts.continuous&&p.cyclePause){ms=10;}}if(ms>0){p.cycleTimeout=setTimeout(function(){go(els,opts,0,(!opts.rev&&!opts.backwards));},ms);}}$.fn.cycle.updateActivePagerLink=function(pager,currSlide,clsName){$(pager).each(function(){$(this).children().removeClass(clsName).eq(currSlide).addClass(clsName);});};function getTimeout(curr,next,opts,fwd){if(opts.timeoutFn){var t=opts.timeoutFn.call(curr,curr,next,opts,fwd);while((t-opts.speed)<250){t+=opts.speed;}debug("calculated timeout: "+t+"; speed: "+opts.speed);if(t!==false){return t;}}return opts.timeout;}$.fn.cycle.next=function(opts){advance(opts,opts.rev?-1:1);};$.fn.cycle.prev=function(opts){advance(opts,opts.rev?1:-1);};function advance(opts,val){var els=opts.elements;var p=opts.$cont[0],timeout=p.cycleTimeout;if(timeout){clearTimeout(timeout);p.cycleTimeout=0;}if(opts.random&&val<0){opts.randomIndex--;if(--opts.randomIndex==-2){opts.randomIndex=els.length-2;}else{if(opts.randomIndex==-1){opts.randomIndex=els.length-1;}}opts.nextSlide=opts.randomMap[opts.randomIndex];}else{if(opts.random){opts.nextSlide=opts.randomMap[opts.randomIndex];}else{opts.nextSlide=opts.currSlide+val;if(opts.nextSlide<0){if(opts.nowrap){return false;}opts.nextSlide=els.length-1;}else{if(opts.nextSlide>=els.length){if(opts.nowrap){return false;}opts.nextSlide=0;}}}}var cb=opts.onPrevNextEvent||opts.prevNextClick;if($.isFunction(cb)){cb(val>0,opts.nextSlide,els[opts.nextSlide]);}go(els,opts,1,val>=0);return false;}function buildPager(els,opts){var $p=$(opts.pager);$.each(els,function(i,o){$.fn.cycle.createPagerAnchor(i,o,$p,els,opts);});opts.updateActivePagerLink(opts.pager,opts.startingSlide,opts.activePagerClass);}$.fn.cycle.createPagerAnchor=function(i,el,$p,els,opts){var a;if($.isFunction(opts.pagerAnchorBuilder)){a=opts.pagerAnchorBuilder(i,el);debug("pagerAnchorBuilder("+i+", el) returned: "+a);}else{a='<a href="#">'+(i+1)+"</a>";}if(!a){return;}var $a=$(a);if($a.parents("body").length===0){var arr=[];if($p.length>1){$p.each(function(){var $clone=$a.clone(true);$(this).append($clone);arr.push($clone[0]);});$a=$(arr);}else{$a.appendTo($p);}}opts.pagerAnchors=opts.pagerAnchors||[];opts.pagerAnchors.push($a);$a.bind(opts.pagerEvent,function(e){e.preventDefault();opts.nextSlide=i;var p=opts.$cont[0],timeout=p.cycleTimeout;if(timeout){clearTimeout(timeout);p.cycleTimeout=0;}var cb=opts.onPagerEvent||opts.pagerClick;if($.isFunction(cb)){cb(opts.nextSlide,els[opts.nextSlide]);}go(els,opts,1,opts.currSlide<i);});if(!/^click/.test(opts.pagerEvent)&&!opts.allowPagerClickBubble){$a.bind("click.cycle",function(){return false;});}if(opts.pauseOnPagerHover){$a.hover(function(){opts.$cont[0].cyclePause++;},function(){opts.$cont[0].cyclePause--;});}};$.fn.cycle.hopsFromLast=function(opts,fwd){var hops,l=opts.lastSlide,c=opts.currSlide;if(fwd){hops=c>l?c-l:opts.slideCount-l;}else{hops=c<l?l-c:l+opts.slideCount-c;}return hops;};function clearTypeFix($slides){debug("applying clearType background-color hack");function hex(s){s=parseInt(s).toString(16);return s.length<2?"0"+s:s;}function getBg(e){for(;e&&e.nodeName.toLowerCase()!="html";e=e.parentNode){var v=$.css(e,"background-color");if(v.indexOf("rgb")>=0){var rgb=v.match(/\d+/g);return"#"+hex(rgb[0])+hex(rgb[1])+hex(rgb[2]);}if(v&&v!="transparent"){return v;}}return"#ffffff";}$slides.each(function(){$(this).css("background-color",getBg(this));});}$.fn.cycle.commonReset=function(curr,next,opts,w,h,rev){$(opts.elements).not(curr).hide();opts.cssBefore.opacity=1;opts.cssBefore.display="block";if(w!==false&&next.cycleW>0){opts.cssBefore.width=next.cycleW;}if(h!==false&&next.cycleH>0){opts.cssBefore.height=next.cycleH;}opts.cssAfter=opts.cssAfter||{};opts.cssAfter.display="none";$(curr).css("zIndex",opts.slideCount+(rev===true?1:0));$(next).css("zIndex",opts.slideCount+(rev===true?0:1));};$.fn.cycle.custom=function(curr,next,opts,cb,fwd,speedOverride){var $l=$(curr),$n=$(next);var speedIn=opts.speedIn,speedOut=opts.speedOut,easeIn=opts.easeIn,easeOut=opts.easeOut;$n.css(opts.cssBefore);if(speedOverride){if(typeof speedOverride=="number"){speedIn=speedOut=speedOverride;}else{speedIn=speedOut=1;}easeIn=easeOut=null;}var fn=function(){$n.animate(opts.animIn,speedIn,easeIn,cb);};$l.animate(opts.animOut,speedOut,easeOut,function(){if(opts.cssAfter){$l.css(opts.cssAfter);}if(!opts.sync){fn();}});if(opts.sync){fn();}};$.fn.cycle.transitions={fade:function($cont,$slides,opts){$slides.not(":eq("+opts.currSlide+")").css("opacity",0);opts.before.push(function(curr,next,opts){$.fn.cycle.commonReset(curr,next,opts);opts.cssBefore.opacity=0;});opts.animIn={opacity:1};opts.animOut={opacity:0};opts.cssBefore={top:0,left:0};}};$.fn.cycle.ver=function(){return ver;};$.fn.cycle.defaults={fx:"fade",timeout:4000,timeoutFn:null,continuous:0,speed:1000,speedIn:null,speedOut:null,next:null,prev:null,onPrevNextEvent:null,prevNextEvent:"click.cycle",pager:null,onPagerEvent:null,pagerEvent:"click.cycle",allowPagerClickBubble:false,pagerAnchorBuilder:null,before:null,after:null,end:null,easing:null,easeIn:null,easeOut:null,shuffle:null,animIn:null,animOut:null,cssBefore:null,cssAfter:null,fxFn:null,height:"auto",startingSlide:0,sync:1,random:0,fit:0,containerResize:1,pause:0,pauseOnPagerHover:0,autostop:0,autostopCount:0,delay:0,slideExpr:null,cleartype:!$.support.opacity,cleartypeNoBg:false,nowrap:0,fastOnEvent:0,randomizeEffects:1,rev:0,manualTrump:true,requeueOnImageNotLoaded:true,requeueTimeout:250,activePagerClass:"activeSlide",updateActivePagerLink:null,backwards:false};})(jQuery);
/*
 * jQuery Cycle Plugin Transition Definitions
 * This script is a plugin for the jQuery Cycle Plugin
 * Examples and documentation at: http://malsup.com/jquery/cycle/
 * Copyright (c) 2007-2010 M. Alsup
 * Version:	 2.72
 */
(function($){$.fn.cycle.transitions.none=function($cont,$slides,opts){opts.fxFn=function(curr,next,opts,after){$(next).show();$(curr).hide();after();};};$.fn.cycle.transitions.scrollUp=function($cont,$slides,opts){$cont.css("overflow","hidden");opts.before.push($.fn.cycle.commonReset);var h=$cont.height();opts.cssBefore={top:h,left:0};opts.cssFirst={top:0};opts.animIn={top:0};opts.animOut={top:-h};};$.fn.cycle.transitions.scrollDown=function($cont,$slides,opts){$cont.css("overflow","hidden");opts.before.push($.fn.cycle.commonReset);var h=$cont.height();opts.cssFirst={top:0};opts.cssBefore={top:-h,left:0};opts.animIn={top:0};opts.animOut={top:h};};$.fn.cycle.transitions.scrollLeft=function($cont,$slides,opts){$cont.css("overflow","hidden");opts.before.push($.fn.cycle.commonReset);var w=$cont.width();opts.cssFirst={left:0};opts.cssBefore={left:w,top:0};opts.animIn={left:0};opts.animOut={left:0-w};};$.fn.cycle.transitions.scrollRight=function($cont,$slides,opts){$cont.css("overflow","hidden");opts.before.push($.fn.cycle.commonReset);var w=$cont.width();opts.cssFirst={left:0};opts.cssBefore={left:-w,top:0};opts.animIn={left:0};opts.animOut={left:w};};$.fn.cycle.transitions.scrollHorz=function($cont,$slides,opts){$cont.css("overflow","hidden").width();opts.before.push(function(curr,next,opts,fwd){$.fn.cycle.commonReset(curr,next,opts);opts.cssBefore.left=fwd?(next.cycleW-1):(1-next.cycleW);opts.animOut.left=fwd?-curr.cycleW:curr.cycleW;});opts.cssFirst={left:0};opts.cssBefore={top:0};opts.animIn={left:0};opts.animOut={top:0};};$.fn.cycle.transitions.scrollVert=function($cont,$slides,opts){$cont.css("overflow","hidden");opts.before.push(function(curr,next,opts,fwd){$.fn.cycle.commonReset(curr,next,opts);opts.cssBefore.top=fwd?(1-next.cycleH):(next.cycleH-1);opts.animOut.top=fwd?curr.cycleH:-curr.cycleH;});opts.cssFirst={top:0};opts.cssBefore={left:0};opts.animIn={top:0};opts.animOut={left:0};};$.fn.cycle.transitions.slideX=function($cont,$slides,opts){opts.before.push(function(curr,next,opts){$(opts.elements).not(curr).hide();$.fn.cycle.commonReset(curr,next,opts,false,true);opts.animIn.width=next.cycleW;});opts.cssBefore={left:0,top:0,width:0};opts.animIn={width:"show"};opts.animOut={width:0};};$.fn.cycle.transitions.slideY=function($cont,$slides,opts){opts.before.push(function(curr,next,opts){$(opts.elements).not(curr).hide();$.fn.cycle.commonReset(curr,next,opts,true,false);opts.animIn.height=next.cycleH;});opts.cssBefore={left:0,top:0,height:0};opts.animIn={height:"show"};opts.animOut={height:0};};$.fn.cycle.transitions.shuffle=function($cont,$slides,opts){var i,w=$cont.css("overflow","visible").width();$slides.css({left:0,top:0});opts.before.push(function(curr,next,opts){$.fn.cycle.commonReset(curr,next,opts,true,true,true);});if(!opts.speedAdjusted){opts.speed=opts.speed/2;opts.speedAdjusted=true;}opts.random=0;opts.shuffle=opts.shuffle||{left:-w,top:15};opts.els=[];for(i=0;i<$slides.length;i++){opts.els.push($slides[i]);}for(i=0;i<opts.currSlide;i++){opts.els.push(opts.els.shift());}opts.fxFn=function(curr,next,opts,cb,fwd){var $el=fwd?$(curr):$(next);$(next).css(opts.cssBefore);var count=opts.slideCount;$el.animate(opts.shuffle,opts.speedIn,opts.easeIn,function(){var hops=$.fn.cycle.hopsFromLast(opts,fwd);for(var k=0;k<hops;k++){fwd?opts.els.push(opts.els.shift()):opts.els.unshift(opts.els.pop());}if(fwd){for(var i=0,len=opts.els.length;i<len;i++){$(opts.els[i]).css("z-index",len-i+count);}}else{var z=$(curr).css("z-index");$el.css("z-index",parseInt(z)+1+count);}$el.animate({left:0,top:0},opts.speedOut,opts.easeOut,function(){$(fwd?this:curr).hide();if(cb){cb();}});});};opts.cssBefore={display:"block",opacity:1,top:0,left:0};};$.fn.cycle.transitions.turnUp=function($cont,$slides,opts){opts.before.push(function(curr,next,opts){$.fn.cycle.commonReset(curr,next,opts,true,false);opts.cssBefore.top=next.cycleH;opts.animIn.height=next.cycleH;});opts.cssFirst={top:0};opts.cssBefore={left:0,height:0};opts.animIn={top:0};opts.animOut={height:0};};$.fn.cycle.transitions.turnDown=function($cont,$slides,opts){opts.before.push(function(curr,next,opts){$.fn.cycle.commonReset(curr,next,opts,true,false);opts.animIn.height=next.cycleH;opts.animOut.top=curr.cycleH;});opts.cssFirst={top:0};opts.cssBefore={left:0,top:0,height:0};opts.animOut={height:0};};$.fn.cycle.transitions.turnLeft=function($cont,$slides,opts){opts.before.push(function(curr,next,opts){$.fn.cycle.commonReset(curr,next,opts,false,true);opts.cssBefore.left=next.cycleW;opts.animIn.width=next.cycleW;});opts.cssBefore={top:0,width:0};opts.animIn={left:0};opts.animOut={width:0};};$.fn.cycle.transitions.turnRight=function($cont,$slides,opts){opts.before.push(function(curr,next,opts){$.fn.cycle.commonReset(curr,next,opts,false,true);opts.animIn.width=next.cycleW;opts.animOut.left=curr.cycleW;});opts.cssBefore={top:0,left:0,width:0};opts.animIn={left:0};opts.animOut={width:0};};$.fn.cycle.transitions.zoom=function($cont,$slides,opts){opts.before.push(function(curr,next,opts){$.fn.cycle.commonReset(curr,next,opts,false,false,true);opts.cssBefore.top=next.cycleH/2;opts.cssBefore.left=next.cycleW/2;opts.animIn={top:0,left:0,width:next.cycleW,height:next.cycleH};opts.animOut={width:0,height:0,top:curr.cycleH/2,left:curr.cycleW/2};});opts.cssFirst={top:0,left:0};opts.cssBefore={width:0,height:0};};$.fn.cycle.transitions.fadeZoom=function($cont,$slides,opts){opts.before.push(function(curr,next,opts){$.fn.cycle.commonReset(curr,next,opts,false,false);opts.cssBefore.left=next.cycleW/2;opts.cssBefore.top=next.cycleH/2;opts.animIn={top:0,left:0,width:next.cycleW,height:next.cycleH};});opts.cssBefore={width:0,height:0};opts.animOut={opacity:0};};$.fn.cycle.transitions.blindX=function($cont,$slides,opts){var w=$cont.css("overflow","hidden").width();opts.before.push(function(curr,next,opts){$.fn.cycle.commonReset(curr,next,opts);opts.animIn.width=next.cycleW;opts.animOut.left=curr.cycleW;});opts.cssBefore={left:w,top:0};opts.animIn={left:0};opts.animOut={left:w};};$.fn.cycle.transitions.blindY=function($cont,$slides,opts){var h=$cont.css("overflow","hidden").height();opts.before.push(function(curr,next,opts){$.fn.cycle.commonReset(curr,next,opts);opts.animIn.height=next.cycleH;opts.animOut.top=curr.cycleH;});opts.cssBefore={top:h,left:0};opts.animIn={top:0};opts.animOut={top:h};};$.fn.cycle.transitions.blindZ=function($cont,$slides,opts){var h=$cont.css("overflow","hidden").height();var w=$cont.width();opts.before.push(function(curr,next,opts){$.fn.cycle.commonReset(curr,next,opts);opts.animIn.height=next.cycleH;opts.animOut.top=curr.cycleH;});opts.cssBefore={top:h,left:w};opts.animIn={top:0,left:0};opts.animOut={top:h,left:w};};$.fn.cycle.transitions.growX=function($cont,$slides,opts){opts.before.push(function(curr,next,opts){$.fn.cycle.commonReset(curr,next,opts,false,true);opts.cssBefore.left=this.cycleW/2;opts.animIn={left:0,width:this.cycleW};opts.animOut={left:0};});opts.cssBefore={width:0,top:0};};$.fn.cycle.transitions.growY=function($cont,$slides,opts){opts.before.push(function(curr,next,opts){$.fn.cycle.commonReset(curr,next,opts,true,false);opts.cssBefore.top=this.cycleH/2;opts.animIn={top:0,height:this.cycleH};opts.animOut={top:0};});opts.cssBefore={height:0,left:0};};$.fn.cycle.transitions.curtainX=function($cont,$slides,opts){opts.before.push(function(curr,next,opts){$.fn.cycle.commonReset(curr,next,opts,false,true,true);opts.cssBefore.left=next.cycleW/2;opts.animIn={left:0,width:this.cycleW};opts.animOut={left:curr.cycleW/2,width:0};});opts.cssBefore={top:0,width:0};};$.fn.cycle.transitions.curtainY=function($cont,$slides,opts){opts.before.push(function(curr,next,opts){$.fn.cycle.commonReset(curr,next,opts,true,false,true);opts.cssBefore.top=next.cycleH/2;opts.animIn={top:0,height:next.cycleH};opts.animOut={top:curr.cycleH/2,height:0};});opts.cssBefore={left:0,height:0};};$.fn.cycle.transitions.cover=function($cont,$slides,opts){var d=opts.direction||"left";var w=$cont.css("overflow","hidden").width();var h=$cont.height();opts.before.push(function(curr,next,opts){$.fn.cycle.commonReset(curr,next,opts);if(d=="right"){opts.cssBefore.left=-w;}else{if(d=="up"){opts.cssBefore.top=h;}else{if(d=="down"){opts.cssBefore.top=-h;}else{opts.cssBefore.left=w;}}}});opts.animIn={left:0,top:0};opts.animOut={opacity:1};opts.cssBefore={top:0,left:0};};$.fn.cycle.transitions.uncover=function($cont,$slides,opts){var d=opts.direction||"left";var w=$cont.css("overflow","hidden").width();var h=$cont.height();opts.before.push(function(curr,next,opts){$.fn.cycle.commonReset(curr,next,opts,true,true,true);if(d=="right"){opts.animOut.left=w;}else{if(d=="up"){opts.animOut.top=-h;}else{if(d=="down"){opts.animOut.top=h;}else{opts.animOut.left=-w;}}}});opts.animIn={left:0,top:0};opts.animOut={opacity:1};opts.cssBefore={top:0,left:0};};$.fn.cycle.transitions.toss=function($cont,$slides,opts){var w=$cont.css("overflow","visible").width();var h=$cont.height();opts.before.push(function(curr,next,opts){$.fn.cycle.commonReset(curr,next,opts,true,true,true);if(!opts.animOut.left&&!opts.animOut.top){opts.animOut={left:w*2,top:-h/2,opacity:0};}else{opts.animOut.opacity=0;}});opts.cssBefore={left:0,top:0};opts.animIn={left:0};};$.fn.cycle.transitions.wipe=function($cont,$slides,opts){var w=$cont.css("overflow","hidden").width();var h=$cont.height();opts.cssBefore=opts.cssBefore||{};var clip;if(opts.clip){if(/l2r/.test(opts.clip)){clip="rect(0px 0px "+h+"px 0px)";}else{if(/r2l/.test(opts.clip)){clip="rect(0px "+w+"px "+h+"px "+w+"px)";}else{if(/t2b/.test(opts.clip)){clip="rect(0px "+w+"px 0px 0px)";}else{if(/b2t/.test(opts.clip)){clip="rect("+h+"px "+w+"px "+h+"px 0px)";}else{if(/zoom/.test(opts.clip)){var top=parseInt(h/2);var left=parseInt(w/2);clip="rect("+top+"px "+left+"px "+top+"px "+left+"px)";}}}}}}opts.cssBefore.clip=opts.cssBefore.clip||clip||"rect(0px 0px 0px 0px)";var d=opts.cssBefore.clip.match(/(\d+)/g);var t=parseInt(d[0]),r=parseInt(d[1]),b=parseInt(d[2]),l=parseInt(d[3]);opts.before.push(function(curr,next,opts){if(curr==next){return;}var $curr=$(curr),$next=$(next);$.fn.cycle.commonReset(curr,next,opts,true,true,false);opts.cssAfter.display="block";var step=1,count=parseInt((opts.speedIn/13))-1;(function f(){var tt=t?t-parseInt(step*(t/count)):0;var ll=l?l-parseInt(step*(l/count)):0;var bb=b<h?b+parseInt(step*((h-b)/count||1)):h;var rr=r<w?r+parseInt(step*((w-r)/count||1)):w;$next.css({clip:"rect("+tt+"px "+rr+"px "+bb+"px "+ll+"px)"});(step++<=count)?setTimeout(f,13):$curr.css("display","none");})();});opts.cssBefore={display:"block",opacity:1,top:0,left:0};opts.animIn={left:0};opts.animOut={left:0};};})(jQuery);
/**
 * jQuery Lightbox
 * Version 0.5 - 11/29/2007
 * @author Warren Krewenki
 **/
(function(a){a.fn.lightbox=function(h){var s=a.extend({},a.fn.lightbox.defaults,h);return this.each(function(){a(this).click(function(){e();n(this);return false;});});function e(){a("#overlay").remove();a("#lightbox").remove();s.inprogress=false;if(s.jsonData&&s.jsonData.length>0){var y=s.jsonDataParser?s.jsonDataParser:a.fn.lightbox.parseJsonData;s.imageArray=[];s.imageArray=y(s.jsonData);}var v='<div id="outerImageContainer"><div id="imageContainer"><iframe id="lightboxIframe" /><img id="lightboxImage"><div id="hoverNav"><a href="javascript://" title="'+s.strings.prevLinkTitle+'" id="prevLink"></a><a href="javascript://" id="nextLink" title="'+s.strings.nextLinkTitle+'"></a></div><div id="loading"><a href="javascript://" id="loadingLink"><img src="'+s.fileLoadingImage+'"></a></div></div></div>';var x='<div id="imageDataContainer" class="clearfix"><div id="imageData"><div id="imageDetails"><span id="caption"></span><span id="numberDisplay"></span></div><div id="bottomNav">';if(s.displayHelp){x+='<span id="helpDisplay">'+s.strings.help+"</span>";}x+='<a href="javascript://" id="bottomNavClose" title="'+s.strings.closeTitle+'"><img src="'+s.fileBottomNavCloseImage+'"></a></div></div></div>';var w;if(s.navbarOnTop){w='<div id="overlay"></div><div id="lightbox">'+x+v+"</div>";a("body").append(w);a("#imageDataContainer").addClass("ontop");}else{w='<div id="overlay"></div><div id="lightbox">'+v+x+"</div>";a("body").append(w);}a("#overlay").click(function(){l();}).hide();a("#lightbox").click(function(){l();}).hide();a("#loadingLink").click(function(){l();return false;});a("#bottomNavClose").click(function(){l();return false;});a("#outerImageContainer").width(s.widthCurrent).height(s.heightCurrent);a("#imageDataContainer").width(s.widthCurrent);if(!s.imageClickClose){a("#lightboxImage").click(function(){return false;});a("#hoverNav").click(function(){return false;});}}function u(){var v=new Array(a(document).width(),a(document).height(),a(window).width(),a(window).height());return v;}function g(){var x,v;if(self.pageYOffset){v=self.pageYOffset;x=self.pageXOffset;}else{if(document.documentElement&&document.documentElement.scrollTop){v=document.documentElement.scrollTop;x=document.documentElement.scrollLeft;}else{if(document.body){v=document.body.scrollTop;x=document.body.scrollLeft;}}}var w=new Array(x,v);return w;}function o(x){var w=new Date();var v=null;do{v=new Date();}while(v-w<x);}function n(z){a("select, embed, object").hide();var w=u();a("#overlay").hide().css({width:"100%",height:w[1]+"px",opacity:s.overlayOpacity}).fadeIn();imageNum=0;if(!s.jsonData){s.imageArray=[];if(!z.rel||(z.rel=="")){s.imageArray.push(new Array(z.href,s.displayTitle?z.title:""));}else{a("a").each(function(){if(this.href&&(this.rel==z.rel)){s.imageArray.push(new Array(this.href,s.displayTitle?this.title:""));}});}}if(s.imageArray.length>1){for(i=0;i<s.imageArray.length;i++){for(j=s.imageArray.length-1;j>i;j--){if(s.imageArray[i][0]==s.imageArray[j][0]){s.imageArray.splice(j,1);}}}while(s.imageArray[imageNum][0]!=z.href){imageNum++;}}var v=g();var y=v[1]+(w[3]/10);var x=v[0];a("#lightbox").css({top:y+"px",left:x+"px"}).show();if(!s.slideNavBar){a("#imageData").hide();}t(imageNum);}function t(v){if(s.inprogress==false){s.inprogress=true;s.activeImage=v;a("#loading").show();a("#lightboxImage").hide();a("#hoverNav").hide();a("#prevLink").hide();a("#nextLink").hide();if(s.slideNavBar){a("#imageDataContainer").hide();a("#imageData").hide();k();}else{k();}}}function k(){imgPreloader=new Image();imgPreloader.onload=function(){var z=imgPreloader.width;var v=imgPreloader.height;if(s.fitToScreen){var x=u();var y;var w=x[2]-2*s.borderSize;var A=x[3]-200;if(imgPreloader.height>A){z=parseInt((A/imgPreloader.height)*imgPreloader.width);v=A;}else{if(imgPreloader.width>w){v=parseInt((w/imgPreloader.width)*imgPreloader.height);z=w;}}}a("#lightboxImage").attr("src",s.imageArray[s.activeImage][0]).width(z).height(v);m(z,v);};imgPreloader.src=s.imageArray[s.activeImage][0];}function l(){p();a("#lightbox").hide();a("#overlay").fadeOut();a("select, object, embed").show();}function f(){if(s.loopImages&&s.imageArray.length>1){preloadNextImage=new Image();preloadNextImage.src=s.imageArray[(s.activeImage==(s.imageArray.length-1))?0:s.activeImage+1][0];preloadPrevImage=new Image();preloadPrevImage.src=s.imageArray[(s.activeImage==0)?(s.imageArray.length-1):s.activeImage-1][0];}else{if((s.imageArray.length-1)>s.activeImage){preloadNextImage=new Image();preloadNextImage.src=s.imageArray[s.activeImage+1][0];}if(s.activeImage>0){preloadPrevImage=new Image();preloadPrevImage.src=s.imageArray[s.activeImage-1][0];}}}function m(y,w){s.widthCurrent=a("#outerImageContainer").outerWidth();s.heightCurrent=a("#outerImageContainer").outerHeight();var v=Math.max(350,y+(s.borderSize*2));var x=(w+(s.borderSize*2));s.xScale=(v/s.widthCurrent)*100;s.yScale=(x/s.heightCurrent)*100;wDiff=s.widthCurrent-v;hDiff=s.heightCurrent-x;a("#imageDataContainer").animate({width:v},s.resizeSpeed,"linear");a("#outerImageContainer").animate({width:v},s.resizeSpeed,"linear",function(){a("#outerImageContainer").animate({height:x},s.resizeSpeed,"linear",function(){d();});});if((hDiff==0)&&(wDiff==0)){if(jQuery.browser.msie){o(250);}else{o(100);}}a("#prevLink").height(w);a("#nextLink").height(w);}function d(){a("#loading").hide();a("#lightboxImage").fadeIn("fast");c();f();s.inprogress=false;}function c(){a("#numberDisplay").html("");if(s.imageArray[s.activeImage][1]){a("#caption").html(s.imageArray[s.activeImage][1]).show();}if(s.imageArray.length>1){var w;w=s.strings.image+(s.activeImage+1)+s.strings.of+s.imageArray.length;if(!s.disableNavbarLinks){if((s.activeImage)>0||s.loopImages){w='<a title="'+s.strings.prevLinkTitle+'" href="#" id="prevLinkText">'+s.strings.prevLinkText+"</a>"+w;}if(((s.activeImage+1)<s.imageArray.length)||s.loopImages){w+='<a title="'+s.strings.nextLinkTitle+'" href="#" id="nextLinkText">'+s.strings.nextLinkText+"</a>";}}a("#numberDisplay").html(w).show();}if(s.slideNavBar){a("#imageData").slideDown(s.navBarSlideSpeed);}else{a("#imageData").show();}var v=u();a("#overlay").height(v[1]);q();}function q(){if(s.imageArray.length>1){a("#hoverNav").show();if(s.loopImages){a("#prevLink,#prevLinkText").show().click(function(){t((s.activeImage==0)?(s.imageArray.length-1):s.activeImage-1);return false;});a("#nextLink,#nextLinkText").show().click(function(){t((s.activeImage==(s.imageArray.length-1))?0:s.activeImage+1);return false;});}else{if(s.activeImage!=0){a("#prevLink,#prevLinkText").show().click(function(){t(s.activeImage-1);return false;});}if(s.activeImage!=(s.imageArray.length-1)){a("#nextLink,#nextLinkText").show().click(function(){t(s.activeImage+1);return false;});}}b();}}function r(y){var z=y.data.opts;var v=y.keyCode;var w=27;var x=String.fromCharCode(v).toLowerCase();if((x=="x")||(x=="o")||(x=="c")||(v==w)){l();}else{if((x=="p")||(v==37)){if(z.loopImages){p();t((z.activeImage==0)?(z.imageArray.length-1):z.activeImage-1);}else{if(z.activeImage!=0){p();t(z.activeImage-1);}}}else{if((x=="n")||(v==39)){if(s.loopImages){p();t((z.activeImage==(z.imageArray.length-1))?0:z.activeImage+1);}else{if(z.activeImage!=(z.imageArray.length-1)){p();t(z.activeImage+1);}}}}}}function b(){a(document).bind("keydown",{opts:s},r);}function p(){a(document).unbind("keydown");}};a.fn.lightbox.parseJsonData=function(c){var b=[];a.each(c,function(){b.push(new Array(this.url,this.title));});return b;};a.fn.lightbox.defaults={fileLoadingImage:"/style/loading.gif",fileBottomNavCloseImage:"/style/close.gif",overlayOpacity:0.8,borderSize:10,imageArray:new Array,activeImage:null,inprogress:false,resizeSpeed:350,widthCurrent:250,heightCurrent:250,xScale:1,yScale:1,displayTitle:true,navbarOnTop:false,slideNavBar:false,navBarSlideSpeed:350,displayHelp:false,strings:{help:" \u2190 / P - previous image\u00a0\u00a0\u00a0\u00a0\u2192 / N - next image\u00a0\u00a0\u00a0\u00a0ESC / X - close image gallery",prevLinkTitle:"previous image",nextLinkTitle:"next image",prevLinkText:"&laquo; Previous",nextLinkText:"Next &raquo;",closeTitle:"close image gallery",image:"Image ",of:" of "},fitToScreen:false,disableNavbarLinks:false,loopImages:false,imageClickClose:true,jsonData:null,jsonDataParser:null};})(jQuery);


function initializeMAP(){
	var yerevan = new google.maps.LatLng(40.163273, 44.514843);
	var browserSupportFlag =  new Boolean();
  var myOptions = {
    zoom: 4,
    center: yerevan,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  var map = new google.maps.Map(document.getElementById("map"), myOptions);
  
  var georssLayer = new google.maps.KmlLayer('http://www.cover-color.ru/js/stores.kml');
	georssLayer.setMap(map);
}

jQuery.fn.inputtoggle = function(){
    var input = arguments[0] || {};
    var passive_color=input.passive_color || "#eee";
    var active_color="#fff";
    var hint=input.hint;
    var field=input.field;
    
    if(!$(field).length){return "";}
    
    if(($(field).val()!=hint)&&($(field).val()!='')){$(field).css({color:active_color,'font-style':'normal'});}
		else{$(field).val(hint);$(field).css({color:passive_color,'font-style':'italic'});}
		
		$(field).focus(function(){
			if($(field).val()==hint){
				$(field).val('');
				$(field).css({color:active_color,'font-style':'normal'});
			}
		});
		
		$(field).blur(function(){
			if($(field).val()==''){
				$(field).val(hint);
				$(field).css({color:passive_color,'font-style':'italic'});
			}
		});
};


$(document).ready(function(){
	var LANGUAGE=document.body.getAttribute('xml:lang');

	
	if ($.browser.msie && $.browser.version == 6){
		$("#toolbar").prepend('<div class="bg"></div>');
		$("#location").wrapInner('<div class="content"></div>');
		$("#location").prepend('<div class="bg"></div>');
		$("#header").prepend('<div id="banners-bg"></div>');
	}
	
	$("#menu li a span").css({'text-shadow': '1px 1px 2px rgba(0, 0, 0, 0.7)'});
	
	$('#location select').selectbox();
	
	$("window").inputtoggle({field:"#search .input",hint:$("#search .input").attr("alt")});
	
	var startingSlide=parseInt($.cookie('slides'),10);
	if(!startingSlide>0){startingSlide=0;}
	
	$('#slides').cycle({ 
    fx:      'fade', 
    speed:    500, 
    timeout:  5000,
    startingSlide:startingSlide,
    after:function(curr, next, opts){
			$.cookie('slides', opts.currSlide)
    }
	});
	$("#header").css({'z-index':5});
	$("#menu").css({'z-index':7});

	if($("#map").length>0){
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = "http://maps.google.com/maps/api/js?sensor=false&callback=initializeMAP";
		document.body.appendChild(script);
	}

	$("#content a[href$='.jpg'], #content a[href$='.png'], #content a[href$='.gif']").attr({"rel":"content"});
	$("a[href$='.jpg'], a[href$='.png'], a[href$='.gif']").lightbox({fitToScreen:true,loopImages:true,imageClickClose:true,disableNavbarLinks:true});
	
	
	
	
	if($("form#order-form").length>0){
		
		$("#order-form td input").change(function(){
			var orderprice=0;
			if(parseInt($(this).val(),10)>0){
				$('.volume, .price, .quantity',$(this).parent().parent()).css({"background-color":"#ffffcd"});
			}else{
				$('.volume, .price, .quantity',$(this).parent().parent()).css({"background-color":"#fff"});
			}
			
			$("#order-form td input").each(function(index) {
				//alert(index + ': ' + $(this).text());
				if(parseInt($(this).val(),10)>0){
					orderprice+=parseInt($(this).val(),10)*parseInt($('.price',$(this).parent().parent()).html(),10);
				}
			});
			/*
			if(parseInt($(this).val(),10)>0){
				var myprice=parseInt($(this).val(),10)*parseInt($('.price',$(this).parent().parent()).html(),10);
			}else{var myprice=0;}
			*/
			$("#order-form .summary input").val(orderprice);
			$("#order-form .summary span").html(orderprice);
		});
		
		
		
		$("#order-form").submit(function(){

			if($("#form-Firstname").val().length==0){
				$("#form-Firstname").get(0).focus();
				if(LANGUAGE=="hy"){alert("??????? ??? ??????? ??? ??????");}
				else if(LANGUAGE=="ru"){alert("?????????? ??????? ???? ???");}
				else{alert("Please fill your name");}
				return false;
			}
			
			if($("#form-Lastname").val().length==0){
				$("#form-Lastname").get(0).focus();
				if(LANGUAGE=="hy"){alert("??????? ??? ??????? ??? ?????????");}
				else if(LANGUAGE=="ru"){alert("?????????? ??????? ???? ???????");}
				else{alert("Please fill your surname");}
				return false;
			}
			
			var emailMatch  = /^([^@])+\@([^@])+\.([a-zA-Z0-9]{2,10})+$/;
			if(($("#form-Email").val().length==0) || (!$("#form-Email").val().match(emailMatch))){
				$("#form-Email").get(0).focus();
				if(LANGUAGE=="hy"){alert("??????? ??? ??????? ??? ??-????? ??????");}
				else if(LANGUAGE=="ru"){alert("?????????? ??????? ???? ????? ??-?????");}
				else{alert("Please fill your email address");}
				return false;
			}
			
			if($("#form-Phone").val().length==0){
				$("#form-Phone").get(0).focus();
				if(LANGUAGE=="hy"){alert("??????? ??? ??????? ??? ???????? ??????");}
				else if(LANGUAGE=="ru"){alert("?????????? ??????? ???? ????? ????????");}
				else{alert("Please fill your phone number");}
				return false;
			}
			
			var securityMatch  = /^[a-zA-Z0-9]{5}$/;
			if(($("#form-Security").val().length!=5) || (!$("#form-Security").val().match(securityMatch))){
				$("#form-Security").get(0).focus();
				if(LANGUAGE=="hy"){alert("??????? ??? ??????? ??????? ??? ??????? ???????????? ????");}
				else if(LANGUAGE=="ru"){alert("?????????? ??????? ??? ???????????? ?? ????????");}
				else{alert("Please fill the security code shown on the image");}
				return false;
			}
		});
	}
	
	
	
	
	if($("#color-chooser").length>0){
		var colors= {
"01":{id:"01", "en":"MAIS", "ru":"MAIS01", "hy":"MAIS", "yerangs":{
	0: "e99e3a",
		1: "f9d177",
		2: "fce1a3",
		3: "ffefbd",
		4: "fff3d0",
		5: "fef8e3"
	}},
	"02":{id:"02", "en":"CREAM", "ru":"CREAM", "hy":"CREAM", "yerangs":{
	0: "cc864a",
		1: "f8cf89",
		2: "ffe2a3",
		3: "ffe8b9",
		4: "ffefd6",
		5: "fef4e5"
		}},
	"03":{id:"03", "en":"COGNAC", "ru":"COGNAC", "hy":"COGNAC", "yerangs":{
	0: "d88e4f",
		1: "fad3a5",
		2: "ffe2be",
		3: "ffebd3",
		4: "fff0de",
		5: "fef5e8"
	}},
	"04":{id:"04", "en":"CHAMPAGNE", "ru":"CHAPMAPGNE", "hy":"CHAMPAGNE", "yerangs":{
	0: "b05f3e",
		1: "f6c08c",
		2: "fad0a9",
		3: "fcdec0",
		4: "fce6d4",
		5: "fff2e7"
	}},
	"05":{id:"05", "en":"SOMON", "ru":"SOMON", "hy":"SOMON", "yerangs":{
	0: "ba6d48",
		1: "eca680",
		2: "ffc19e",
		3: "ffe1c9",
		4: "ffecdf",
		5: "fef5ed"
	}},
	"06":{id:"06", "en":"LAND", "ru":"LAND", "hy":"LAND", "yerangs":{
	0: "cb6652",
		1: "f5b6a1",
		2: "f7c8b4",
		3: "fbdaca",
		4: "f9eadc",
		5: "f8eae2"
	}},
	"07":{id:"07", "en":"CORAL", "ru":"CORAL", "hy":"CORAL", "yerangs":{
	0: "a3313e",
		1: "c05157",
		2: "dc6d6f",
		3: "eb9ca0",
		4: "f1c5c2",
		5: "f3e0df"
	}},
	"08":{id:"08", "en":"CLARET RED", "ru":"CLARET RED", "hy":"CLARET RED", "yerangs":{
	0: "995c55",
		1: "c6a4ad",
		2: "ddc8cc",
		3: "e3d5dc",
		4: "ece2e8",
		5: "efe7ee"
	}},
	"09":{id:"09", "en":"AMPHORA", "ru":"AMPHORA", "hy":"AMPHORA", "yerangs":{
		0: "79514c",
		1: "a57e75",
		2: "bc988f",
		3: "d2b3aa",
		4: "e8d7d3",
		5: "f1e5e0"
	}},
	"10":{id:"10", "en":"HAVANA", "ru":"HAVANA", "hy":"HAVANA", "yerangs":{
		0: "a7684f",
		1: "e3b797",
		2: "edc3a3",
		3: "f6cfaf",
		4: "ffe5ca",
		5: "ffecd4"
	}},
	"11":{id:"11", "en":"BEIGE", "ru":"BEIGE", "hy":"BEIGE", "yerangs":{
	0: "8e6743",
		1: "bb976e",
		2: "dec096",
		3: "f4ddbc",
		4: "f8ead3",
		5: "fcf5e9"
	}},
	"12":{id:"12", "en":"MUSTARD", "ru":"MUSTARD", "hy":"MUSTARD", "yerangs":{
		0: "a87744",
		1: "dabb8f",
		2: "e9d0af",
		3: "f3dcba",
		4: "f8e3bf",
		5: "fceed5"
	}},
	"13":{id:"13", "en":"TOBACCO", "ru":"TOBACCO", "hy":"TOBACCO", "yerangs":{
		0: "B08747",
		1: "DFC17A",
		2: "EFDCAA",
		3: "F7EBC3",
		4: "F8ECC8",
		5: "FCF6E3"
	}},
	"14":{id:"14", "en":"AMAZON", "ru":"AMAZON", "hy":"AMAZON", "yerangs":{
		0: "939951",
		1: "C3C693",
		2: "D2DAA5",
		3: "E5E9B9",
		4: "F1F5D2",
		5: "F8FBE3"
	}},
	"15":{id:"15", "en":"TIBET", "ru":"TIBET", "hy":"TIBET", "yerangs":{
		0: "596A44",
		1: "A7B39E",
		2: "BFCEBA",
		3: "D1DDCD",
		4: "E8F4E8",
		5: "F4FCF1"
	}},
	"16":{id:"16", "en":"SAND", "ru":"SAND", "hy":"SAND", "yerangs":{
		0: "75685C",
		1: "A59A8D",
		2: "BCB4A8",
		3: "D3CDC3",
		4: "E4E1D9",
		5: "ECEBE4"
	}},
	"17":{id:"17", "en":"TURQUOISE", "ru":"TURQUOISE", "hy":"TURQUOISE", "yerangs":{
		0: "51B9A0",
		1: "BFEFEA",
		2: "D0F3F1",
		3: "DCF6F4",
		4: "E4F8F7",
		5: "EDFBF3"
	}},
	"18":{id:"18", "en":"BLUE", "ru":"BLUE", "hy":"BLUE", "yerangs":{
		0: "5692BF",
		1: "9AD2E9",
		2: "C4E4F5",
		3: "C4E4F5",
		4: "E0F0FA",
		5: "EBF5FB"
	}},
	"19":{id:"19", "en":"IRIS", "ru":"IRIS", "hy":"IRIS", "yerangs":{
		0: "63758C",
		1: "ACBBD0",
		2: "C1CFDD",
		3: "CDD7E1",
		4: "DCE3E8",
		5: "E6EAEE"
	}},
	"20":{id:"20", "en":"REDBUD", "ru":"REDBUD", "hy":"REDBUD", "yerangs":{
		0: "8E5966",
		1: "A3717D",
		2: "B98A97",
		3: "DDC5CB",
		4: "ECE1E4",
		5: "F5F0F1"
	}},
	"21":{id:"21", "en":"READ", "ru":"READ", "hy":"READ", "yerangs":{
		0: "DC291B",
		1: "F3633F",
		2: "FD9470",
		3: "FFBDA3",
		4: "FFDFCF",
		5: "FFEDE4"
	}},
	"22":{id:"22", "en":"ROSE", "ru":"ROSE", "hy":"ROSE", "yerangs":{
		0: "E00585",
		1: "ED86B9",
		2: "F3A8CD",
		3: "F9C8E1",
		4: "FCDBEC",
		5: "FDEDF5"
	}},
	"23":{id:"23", "en":"SMOKE", "ru":"SMOKE", "hy":"SMOKE", "yerangs":{
		0: "44463C",
		1: "ADADAF",
		2: "C6C8C9",
		3: "D7D7D8",
		4: "E6E8E4",
		5: "EFF1EE"
	}},
	"24":{id:"24", "en":"BLACK", "ru":"BLACK", "hy":"BLACK", "yerangs":{
		0: "313130",
		1: "808180",
		2: "AEAFAF",
		3: "C2C3C3",
		4: "DCE3E8",
		5: "EAEAEA"
	}}
}
 
var proportions={
	"1":1,
	"2":5,
	"3":10,
	"4":20,
	"5":40,
	"ratio":{en:"Nisb&#601;t", ru:"Nisb&#601;t", hy:"Nisb&#601;t"},
	"kg":{en:"kq", ru:"kq", hy:"kq"},
	"paint":{en:"R&#601;ng", ru:"R&#601;ng", hy:"R&#601;ng"},
	"gouache":{en:"Qua&#351;", ru:"Qua&#351;", hy:"Qua&#351;"},
	"select-tint":{en:"Z&#601;hm&#601;t olmasa ton se&#231;in", ru:"Z&#601;hm&#601;t olmasa r&#601;ng se&#231;in", hy:"Z&#601;hm&#601;t olmasa r&#601;ng se&#231;in"}
}

	
		$("#content").css({"margin-left":"0px", "width":"950px"});
		$("#naviation").remove();
		
		function selectcolor(){
			$("#color-chooser .colors li").removeClass("active")
			$("#color-chooser .colors li a[href$='#"+activecolor+"']").parent().addClass("active");
			
			$("#color-chooser .yerangner li:eq(0) a").html(activecolor+" "+colors[activecolor][LANGUAGE]);
			$("#color-chooser .yerangner li:eq(0) a").css({backgroundColor:"#"+colors[activecolor].yerangs[0]});
			
			$("#color-chooser .yerangner li:eq(1) a").css({backgroundColor:"#"+colors[activecolor].yerangs[1]});
			$("#color-chooser .yerangner li:eq(2) a").css({backgroundColor:"#"+colors[activecolor].yerangs[2]});
			$("#color-chooser .yerangner li:eq(3) a").css({backgroundColor:"#"+colors[activecolor].yerangs[3]});
			$("#color-chooser .yerangner li:eq(4) a").css({backgroundColor:"#"+colors[activecolor].yerangs[4]});
			$("#color-chooser .yerangner li:eq(5) a").css({backgroundColor:"#"+colors[activecolor].yerangs[5]});

			$("#color-chooser .interior").css({"background-color":$("#color-chooser .yerangner li:eq("+activeyerangindex+") a").css("background-color")});
			
			if(activeyerangindex>0){$("#color-chooser .txt").html(proportions["ratio"][LANGUAGE]+" 1:"+proportions[activeyerangindex]+" = 1"+proportions["kg"][LANGUAGE]+" "+proportions["gouache"][LANGUAGE]+" / "+proportions[activeyerangindex]+proportions["kg"][LANGUAGE]+" "+proportions["paint"][LANGUAGE]);}
			else{$("#color-chooser .txt").html(proportions["select-tint"][LANGUAGE]);}
		}
	
		var activecolor="03";
		var activeyerangindex=0;
	
		$("#color-chooser").append('<ul class="colors"></ul>');
		for (i in colors)	{
			current=colors[i].id;
			if(current==activecolor){
				$("#color-chooser .colors").append('<li class="active"><a href="#'+current+'" style="background-color:#'+colors[current].yerangs[0]+'"></a></li>');
			}else{
				$("#color-chooser .colors").append('<li><a href="#'+current+'" style="background-color:#'+colors[current].yerangs[0]+'"></a></li>');
			}
		}

		$("#color-chooser").append('<ul class="yerangner"></ul>');
		var j=0;
		for (j=0;j<=5;j++){
			if(j==0){
				$("#color-chooser .yerangner").append('<li class="active"><a href="#"></a></li>');
			}else if(j<4){
				$("#color-chooser .yerangner").append('<li><a href="#"></a></li>');
			}else{
				$("#color-chooser .yerangner").append('<li><a href="#" class="black"></a></li>');
			}
		}
		$("#color-chooser .yerangner li:eq(1) a").html(proportions["ratio"][LANGUAGE]+" 1:"+proportions[1]);
		$("#color-chooser .yerangner li:eq(2) a").html(proportions["ratio"][LANGUAGE]+" 1:"+proportions[2]);
		$("#color-chooser .yerangner li:eq(3) a").html(proportions["ratio"][LANGUAGE]+" 1:"+proportions[3]);
		$("#color-chooser .yerangner li:eq(4) a").html(proportions["ratio"][LANGUAGE]+" 1:"+proportions[4]);
		$("#color-chooser .yerangner li:eq(5) a").html(proportions["ratio"][LANGUAGE]+" 1:"+proportions[5]);	
		
		$("#color-chooser").append('<div class="interior"></div>');
		
		$("#color-chooser").append('<div class="txt"></div>');
		$("#color-chooser .txt").html(proportions["select-tint"][LANGUAGE]);
		
		
		
		selectcolor();
		
		
		$("#color-chooser .colors li a").click(function(){
			var l=$(this).attr("href");
			activecolor=l.substr(l.lastIndexOf("#")+1,l.length-l.lastIndexOf("#"));
			selectcolor();
			return false;
		});
		
		
		
		$("#color-chooser ul.yerangner li a").click(function(){return false;});
		$("#color-chooser ul.yerangner li a").hover(function(){
			$("#color-chooser ul.yerangner li").removeClass("active")
			$(this).parent().addClass("active");
			
			activeyerangindex=$("#color-chooser ul.yerangner li").index($(this).parent());
			
			$("#color-chooser .interior").css({backgroundColor:$(this).css("background-color")});
			
			if(activeyerangindex>0){$("#color-chooser .txt").html(proportions["ratio"][LANGUAGE]+" 1:"+proportions[activeyerangindex]+" = 1"+proportions["kg"][LANGUAGE]+" "+proportions["gouache"][LANGUAGE]+" / "+proportions[activeyerangindex]+proportions["kg"][LANGUAGE]+" "+proportions["paint"][LANGUAGE]);}
			else{$("#color-chooser .txt").html(proportions["select-tint"][LANGUAGE]);}
			
			return false;
		},
		function(){
			return false;}
		);


	}

});