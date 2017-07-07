

let Dialog = {

	showDialog(title,content,negativeBtnText,positiveBtnText,negativeUrl,positiveUrl) {
			let overlayWrap,dialogWrap,dialogTitle,dialogItem,dialogBtnWrap,dialogBtnN,dialogBtnP;
			let self = this;
			overlayWrap = (!$('.overlay-wrap').length)?$('<div></div>').hide().addClass('overlay-wrap').appendTo('body').animate({opacity: 'show'}, 200) : $('.overlay-wrap');
			dialogWrap = (!$('.dialog-container').length)?$('<div></div>').hide().addClass('dialog-container').appendTo('body').animate({bottom:0,opacity: 'show'}, 400) : $('.dialog-container');
			dialogWrap.html('');
			dialogTitle = $('<div></div>').addClass('dialog-title').appendTo(dialogWrap).html(title);
			dialogItem = $('<div></div>').addClass('dialog-item').appendTo(dialogWrap).html(content);
			dialogBtnWrap = $('<div></div>').addClass('dialog-btn-wrap').appendTo(dialogWrap);
			if(negativeBtnText!=undefined){
				dialogBtnN = (negativeUrl==undefined)?$('<div></div>').addClass('dialog-btn').appendTo(dialogBtnWrap).html(negativeBtnText):$('<a></a>').addClass('dialog-btn').attr('href',negativeUrl).appendTo(dialogBtnWrap).html(negativeBtnText);
				if(negativeUrl==undefined){
					dialogBtnN.bind('click',function(){
						self.removeDialog(dialogWrap);
					});
				}
			}
			if(positiveBtnText!=undefined){
				dialogBtnP = (positiveUrl==undefined)?$('<div></div>').addClass('dialog-btn dialog-btn-p').appendTo(dialogBtnWrap).html(positiveBtnText):$('<a></a>').addClass('dialog-btn dialog-btn-p').attr('href',positiveUrl).appendTo(dialogBtnWrap).html(positiveBtnText);
				if(positiveUrl==undefined){
					dialogBtnP.bind('click',function(){
						self.removeDialog(dialogWrap);
					});
				}

			}
			
		
	},

	removeDialog(obj) {
		obj.animate({opacity: '0'}, 100, function()
		{
			obj.remove();
			$('.overlay-wrap').remove();
		});
	}
}

export default Dialog