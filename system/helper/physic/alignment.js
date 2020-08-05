define( function()
{
	/**
	 * Verilen bir elementi diğer elementin istenen bir yönüne yerleştirir. Tooltip ve rightclick
	 * menü veya dropdown menü pencerelerinin konumlarını ayarlar.
	 * 
	 * @param  {Object String} cmd    ayar komutları yönler için: "top,left,bottom,right,top-left,
	 *                                bottom-left,top-right,bottom-right", ekrana bağlı ölçü: "fixed", taşma
	 *                                durumları: "fit,reverse,overflow"
	 *                                
	 * @param  {Object jQuery} popup  konumlandırılacak elementin jquery ile seçilmiş örneği
	 * @param  {Object jQuery} target hedef elementin jquery ile seçilmiş örneği
	 * 
	 * @param  {Object e}      e      ekran boyutları aşılırsa tetiklenecek olaylar 
	 *                         		  [over_top|over_left|over_right|over_bottom]
	 *                         		  
	 * @return {Object}               geriye hesaplanmış üst ve sol boşluk değeri döner 
	 *                                (örn: {top: '125px', left: '150px' })
	 */
	return function alignment( cmd, target, popup, e )
	{
		var w     = $( window ),
			
			scr_t = w.scrollTop(),
			scr_l = w.scrollLeft(),
			
			pop_h = popup.height(),
			pop_w = popup.width(),

			dir   = cmd.split( ' ' )[ 0 ],

			win_w = w.width()  - 25, // kaydırma çubuklarını düştük
			win_h = w.height() - 25,

			top, left, target;

		// hedef mouse ise işleyiş farklı olmalı
		if( target.plugin && target.plugin == 'mouse by ismail' )
		{
			var tar_h = 15,   
				tar_w = 20,   
				tar_t = target.pageY,
				tar_l = target.pageX;

			target = 'mouse';
		}
		else
		{
			var tar_h = target.outerHeight(),
				tar_w = target.outerWidth(),
				tar_t = target.offset().top,
				tar_l = target.offset().left;

			target = 'element';
		}

		// popup'lar daima fixed olduğu için döküman yüksekliğini gözardı edince
		// sadece ekran baz alınmış olur.
		tar_t -= scr_t;

		switch( dir )
		{
			case 'top':
				top  = tar_t - pop_h;
				left = tar_l + tar_w - tar_w / 2 - pop_w / 2;
				break;

			case 'bottom':
				top  = tar_h + tar_t;
				left = tar_l + tar_w - tar_w / 2 - pop_w / 2;
				break;

			case 'left':
				top  = tar_t + tar_h - tar_h / 2 - pop_h / 2;
				left = tar_l - pop_w;
				break;

			case 'right':
				top  = tar_t + tar_h - tar_h / 2 - pop_h / 2;
				left = tar_l + tar_w;
				break;

			case 'bottom-left':
				top  = tar_h + tar_t;
				left = tar_l - pop_w + tar_w / 2 + 10;
				break;
				
			case 'bottom-right':
				top  = tar_h + tar_t;
				left = tar_l + tar_w / 2 - 10;
				break;

			case 'top-left':
				top  = tar_t - pop_h;
				left = tar_l - pop_w + tar_w / 2 + 10;
				break;

			case 'top-right':
				top  = tar_t - pop_h;
				left = tar_l + tar_w / 2 - 10;
				break;

			case 'start-bottom-left':
				top  = tar_h + tar_t;
				left = tar_l;
				break;
			
			case 'start-bottom-right':
				top  = tar_h + tar_t;
				left = tar_l - pop_w;
				break;
			
			case 'start-top-right':
				top  = tar_t;
				left = tar_l + tar_w;
				break;
			
			case 'start-top-left':
				top  = tar_t - pop_h;
				left = tar_l;
				break;
			
			case 'end-bottom-left':
				top  = tar_t + tar_h;
				left = tar_l - pop_w;
				break;
			
			case 'end-bottom-right':
				top  = tar_t + tar_h;
				left = tar_l + tar_w - pop_w;
				break;
			
			case 'end-top-right':
				top  = tar_t - pop_h;
				left = tar_l + tar_w - pop_w;
				break;
			
			case 'end-top-left':
				top  = tar_t - pop_h;
				left = tar_l - pop_w;
				break;
		}

		// taşma durumuna izin verilmişse olduğu gibi çıktıyı verelim
		if( cmd.indexOf( 'overflow' ) > -1 )
		{
			// hiçbir işlem yapmıyoruz runtime return satırına atlayacak
		}
		// mevcut yönde taşma oluyorsa yönü tersine çevirelim yani hedefin bittiği yerden popup
		// başlarsa ekrandan taşıyorsa popup hedefin tam zıttı yönünde biterse yön ters çevrilmiş olur
		else
		{
			// left değeri negatifse popup ekranın solundan taşıyor demektir, popup'ı hedefin 
			// sağına alalım
			if( left < 0 )
			{
				// popupı sağ tarafa alıyoruz
				left = tar_l + tar_w + 7;

				// callback tanımlıysa taşma olayını tetikleyelim
				if( e && e.overflow.left ) e.overflow.left();
			}

			// top değeri negatifse popup ekranın üstünden taşıyor demektir, popupı hedefin
			// alt tarafına alalım
			if( top < 0 )
			{
				top = tar_h + tar_t + 7;

				// callback tanımlıysa olayı tetikleyelim
				if( e && e.overflow.top ) e.overflow.top();
			}

			// popup bir hedefin sağ tarafına konumlandırılmış diyelim ama hedef ekranın sağ tarafına
			// zaten oldukça yakınsa popup'a yer kalmadığından ekranın sağından taşabilir bu durumda
			// popupı hedefin soluna bitiştireceğiz, ancak popup çok genişse hedefin solunda kalan
			// boşluğa da sığmayıp ekranın solundan taşabilir veya hedefin üzerini kapatabilir o yüzden
			// önce sağda duran popupı sola alacağız sonra da soldan taşıyorsa bu defa başlangıcını
			// mantıken ekranın en solu yapıp hedefin üzerini kapatmaması için de hedefin hemen altından 
			// ekranda uzamasını sağlayarak mümkün olan en iyi sonucu almaya çalışmış olacağız
			if( win_w < left + pop_w )
			{
				// sonuç olarak nereden taşma yaşanmışsa o taraf için
				// olay tetiklemesi yapacağız
				var of;

				// sağa taşma tespit ettik popup'ı hedefin başladığı yerde bitecek şekilde
				// yeniden ayarlayalım
				left = tar_l - pop_w - 7;

				of = 'right';

				// şimdi sola aldığımız popup bu defa sol taraftan taşıyor mu diye bakacağız
				if( left < 0 )
				{
					// bu defa da soldan taşma tespit ettik demek ki popup ekranın çoğunu kaplıyor
					// popup ekranın başladığı yerden başlarsa iyi olabilir
					left = 0;
					top  = tar_t + tar_h + 7;
					
					of = 'left';
				}
				// mouse kullanımında bazen bu değer sağdan taşmaya devam eder tekrar sağdan taşıyor mu bakalım
				else if( win_w < left + pop_w )
				{
					// hala sağdan taşıyorsa büyük ihtimalle mouse kullanılıyor demektir
					// bu defa popupı ekranın sağına yapıştırabiliriz mouse kullanımında sorun olmaz
					left = win_w - pop_w;

					of = 'right';
				}

				// callback tanımlıysa olayı tetikleyelim
				if( e && e.overflow[ of ]) e.overflow[ of ]();
			}

			// aynı taşma kontrollerini dikey eksen için yapalım
			// popup aşağıdan taşıyor mu bakalım
			if( win_h < top + pop_h )
			{
				var of;

				// aşağı taşma tespit ettik popup'ı hedefin başladığı yerde bitecek şekilde
				// yeniden ayarlayalım
				top = tar_t - pop_h - 7;

				of = 'bottom';

				// şimdi yukarı aldığımız popup bu defa yukarı taraftan taşıyor mu diye bakacağız
				if( top < 0 )
				{
					// bu defa da yukarıdan taşma tespit ettik demek ki popup ekranın çoğunu kaplıyor
					// popup ekranın başladığı yerden başlarsa iyi olabilir
					top = 0;

					of = 'top';
				}
				// mouse kullanımında bazen bu değer aşağıdan taşamaya devam eder tekrar aşağı taşıyor mu bakalım
				else if( win_h < top + pop_h )
				{
					// hala aşağıdan taşıyorsa büyük ihtimalle mouse kullanılıyor demektir
					// bu defa popupı ekranın altına yapıştırabiliriz mouse kullanımında sorun olmaz
					top = win_h - pop_h;

					of = 'bottom';
				}

				// callback tanımlıysa olayı tetikleyelim
				if( e && e.overflow[ of ]) e.overflow[ of ]();
			}
		}

		// tüm ayarlamalar bitti, hesaplanan değerleri döndürelim
		return (
		{
			overflow: of,
			top:  top  + 'px',
			left: left + 'px'
		});
	}
});
