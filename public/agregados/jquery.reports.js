/*!
 * jQuery Simple report Plugin v1.0.0
 * https://github.com/agrudic/report
 *
 * Copyright 2014 Aleksandar Zgonjan, Anton Grudiæ.Klaudio Bariša
 * Released under the MIT license
 * http://opensource.org/licenses/mit-license.php
 */
(
	function($) {
		$.fn.report = function(template, options) {
		
			var template = $(template);
			var report = this;
			var page = null;
			var content = null;
			var height = 0;
			var count = 0;
			
			var settings = $.extend({
				pageHeaderClass      : 'report-page-header',
				pageFooterClass      : 'report-page-footer',
				contentHeaderClass   : 'report-content-header',
				contentFooterClass   : 'report-content-footer',
				contentClass            : 'report-content',
				pageClass               : 'page',
				lastPageClass           : 'report-last-page',
				pageNumberClass         : 'report-page-number',
				pageCountClass          : 'report-page-count',
				removeTemplate          : true,
				appendStyle             : true
			}, options);
			
			function appendPage() {
				page = $('<div class="' + settings.pageClass + '"></div>');
				report.append(page);
				
				page.append($('.' + settings.pageHeaderClass, template).clone());
				page.append($('.' + settings.pageFooterClass, template).clone());
				page.append($('.' + settings.contentHeaderClass, template).clone());
				
				content = $('.' + settings.contentClass, template).clone().empty();
				page.append(content);
				
				count++;
			}
			
			// append default styles
			if(settings.appendStyle) {
				$('head').append($('<style> .report-content div{background-color:#efefef!important;border-bottom:solid 1px #fff;padding:50px}.report-template{width:210mm;margin:50px auto}.report .report-page-footer{position:absolute;width:200mm}.report{background-color:#efefef}.report .page{background-color:#fff;width:210mm;position:relative;margin:0;padding:5mm}.report-page-footer,.report-page-header{background-color:green!important;padding:20px}.report-content-footer,.report-content-header{background-color:#9acd32!important;padding:20px}@media print{@page{size:A4 portrait;margin:0}.report .page{page-break-after:always;height:292mm;margin:0}.report-template{display:none}.report .report-page-footer{bottom:0}.report-last-page{page-break-after:never}}@media screen{.report .page{box-shadow:0 0 5px 0 gray;height:297mm;margin:10px auto}.report .report-page-footer{bottom:5mm}.report{padding:40px 0}} </style>'));
			}
			
			appendPage();
			
			// calculate max content height
			height = page.height();
			
			page.children().each(function() {
				height -= $(this).innerHeight();
			});
			
			// generate report
			$('.' + settings.contentClass + ' div', template).each(function() {
				var item = $(this);
				
				if((content.height() + item.innerHeight()) > height) {
					appendPage();
				}
				
				content.append(item.clone());
			});
			
			// append report footer
			var footer = $('.' + settings.contentFooterClass, template);
			
			if((content.height() + footer.innerHeight()) > height) {
				appendPage();
			}
			
			page.append(footer.clone());
			
			// add last page class
			page.addClass(settings.lastPageClass);
			
			// enumerate pages
			$('.' + settings.pageClass, report).each(function(index) {
			   $('.' + settings.pageNumberClass, this).text(index + 1);
			   $('.' + settings.pageCountClass, this).text(count);
			});
			
			// remove template
			if(settings.removeTemplate) {
				template.remove();
			}
		};
		
	})(jQuery);