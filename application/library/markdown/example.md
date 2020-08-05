# ** Başlık **
Yazılarınızda uzunca konular işliyorsanız bunu bölümlere ayırmak iyi bir fikirdir. Gönderiler içinde başlık bulunmasının bazı güzel sonuçları olur.
* Gönderideki başlıkları tararız ve otomatik biçimde makalenize özel _içindekiler_ tablosu oluştururuz
* Her başlık kendine özel benzersiz bir linke sahip olur
* Tıklandığında, başlığı ekranın en üstünden itibaren başlayacak şekilde odaklarız
* Çok uzun makaleleri içindeki bir başlığa odaklanacak şekilde paylaşabilirsiniz

Bütün bunları sadece sizin oluşturduğunuz basit başlıkları kullanarak otomatik biçimde yapabiliriz.

Bir satırın ilk karakteri olarak bir tane (: diyez işareti) `#` (sharp) ve bir boşluk bıraktıktan sonra başlık metnini girebilirsiniz.
```markdown
# Ana Başlık
## Alt başlık
### daha alt başlık
#### çok alt başlık
##### neredeyse en alt başlık
###### fazladan bir tane girinti unutulmuş başlık
```

Not: Diyez işaretinden sonra boşluk bırakmadan metin yazarsanız bu [ hashtag ]( #hashtag )olarak yorumlanır.

## ** Başlık Biçimlendirme ** 
Başlıkları italik veya kalın yaparak vurgulayabilirsiniz. İstiyorsanız her iki biçimi birlikte uygulayabilirsiniz.
```markdown
## Normal Başlık
## * İtalik Başlık *
## ** Kalın Başlık **
## *** İtalik ve Kalın Başlık ***
```
-----------------
## Normal Başlık
## * İtalik Başlık *
## ** Kalın Başlık **
## *** İtalik ve Kalın Başlık ***

-----------------

# ** Satır Sonu & Paragraf **
Yazı giriş alanında nasıl bir satır düzeni görüyorsanız gönderide de aynı düzeni göreceksiniz. Paragraf oluşturmak için de peş peşe iki satır arası verip alt satıra geçmeniz yeterli.

---------

# ** Vurgu **
Gönderilerde vurgu kullanabilirsiniz. İki tane vurgu biçimi destekliyoruz: italik ve kalın. Bunları tek tek kullanabileceğiniz gibi aynı anda da kullanabilirsiniz.

```markdown
Önemli bir şeyi * italik * yazabilirsiniz.
Daha önemli bir şeyi ** kalın ** yazabilirsiniz.
Çok önemli bir şeyi *** kalın ve italik *** yazabilirsiniz.
```
---------------
Önemli bir şeyi * italik * yazabilirsiniz.
Daha önemli bir şeyi ** kalın ** yazabilirsiniz.
Çok önemli bir şeyi *** kalın ve italik *** yazabilirsiniz.

##  ** Alternatif ** 
Bazen yıldız işaretini vurgu yapma amaçlı değil de yazmış olduğunuz yazının konusu nedeniyle kullanmış olabilirsiniz ve bu bazen vurgu yapmak istiyorsunuz olarak algılanabilir. Aynı satırda önce kendi anlamıyla yıldız karakteri kullanacaksanız sonra da yıldız karakteri kullanarak vurgu yapacaksanız vurgu sınırları bozulur. Bu durumdan kurtulmak için alternatif karakter olan _alt tire_ `_` karakterini kullanın.

```markdown
Yıldız işaretini * kullanırken önemli bilgi _italik_ yazılabilir.
Daha * önemliler __kalın__ yazılırken,
çok * daha önemliler ___kalın ve italik___ yazılabilirler.
```
-------------
Yıldız işaretini * kullanırken önemli bilgi _italik_ yazılabilir.
Daha * önemliler __kalın__ yazılırken,
çok * daha önemliler ___kalın ve italik___ yazılabilirler.

İki karakter de aynı işlevi gösterir, birbirinin yerine kullanabilirsiniz.

Bu karakterlerin vurgu yeteneği sadece kullanıldığı satırda geçerlidir. Enter veya return butonlarıyla yeni satıra geçerseniz vurgulamalar için istediğiniz joker vurgu karakterini tekrar seçebilme özgürlüğünüz başlar. 

------

# ** Alıntı **
Alıntı oluşturmak için `>` karakterini kullanabilirsiniz.
```markdown
> Anlatmaya değer sözler özeldir.
```

Bu alıntı şöyle görünür;
> Anlatmaya değer sözler özeldir.

##  ** Alıntı Sahibi ** 
Alıntı yaptığınız sözün kime ait olduğunu gösterebilirsiniz.
```markdown
> Sevmek sevmekse, sevmemek sevmemektir.
>> Excalibur_17
```

Ekranda şöyle görünür;
> Sevmek sevmekse, sevmemek sevmemektir.
>> Excalibur_17

##  ** Çok Satırlı Alıntılar ** 
Alıntı blokları içinde de satır araları verebilirsiniz. Yeni satıra geçin ve satırın başına `>` işareti koymayı unutmayın.
```markdown
> Beni görmek demek
> mutlaka yüzümü
> görmek değildir.
>
> Benim fikirlerimi,
> benim duygularımı
> anlıyorsanız ve
> hissediyorsanız
> bu kafidir.
>> Mustafa Kemal Atatürk
```
--------------
> Beni görmek demek
> mutlaka yüzümü
> görmek değildir.
>
> Benim fikirlerimi,
> benim duygularımı
> anlıyorsanız ve
> hissediyorsanız
> bu kafidir.
>> Mustafa Kemal Atatürk

##  ** Zengin Alıntılar ** 
Alıntılar içinde hepsi olmasa da bazı biçimlendirmeler kullanabilir daha etkili alıntı blokları oluşturabilirsiniz. Örneğin alıntı blokları içindeyken başlık ekleyebilir, sözcüklere vurgu yapabilir, başlıklara bkz verebilir, başka sitelere link verebilirsiniz.

> ## __ İyi Bir Alıntı, Başlığı Olan Alıntıdır __
> ----
>
> Örneğin [google.com](https://google.com "Google'a gitmek için tıklayın!") adresine link verebilirsiniz. Önemli sözcükleri ** kalın ** yazabilirsiniz. İtalik de yazabilirdiniz ama zaten buradaki her şey italik.
>
> Örneğin (: The Martian) başlığına bkz verebilirsiniz. Bunu kısa yöntemle (*: The Martian) yapabileceğiniz gibi;
>
> (bkz: The Martian)
>
> gibi belirgin biçimde de yapabilirsiniz.
> ----------
> Bölümleri ayırmak için yukarıdaki gibi düz çizgiler çekebilirsiniz.
>
> ----- Bölüm 2 -----------------------------
> Etiketli yatay çizgiler de çekebilirsiniz.
>> Bu alanı çok satırlı kullanabilirsiniz
>>
>> Alıntı sahibine bkz verebilirsiniz
>>
>> (bkz: Freeman)
>> (: Anthony Hopkins)
>> (*: Morgan Freeman) (*: Hugh Laurie)
>>
>> Özel [link](.) ekleyebilirsiniz
>>
>> veya alıntı kaynağının adresini direkt yapıştırabilirsiniz
>>
>> https://biliyon.net

------------------

# ** Liste **
Verilecek bilgiyi maddeler halinde yazmak daha akılda kalıcıdır.

##  ** Numaralı Listeler ** 
Bir satırın başındayken herhangi bir sayısal değer yazıp peşinden bir nokta ve peşinden bir boşluk bırakarak sıra numaralı bir madde oluşturabilirsiniz.

```markdown
1. İlk madde
5. İkinci madde
10. Üçüncü madde
```
------------------
1. İlk madde
5. İkinci madde
10. Üçüncü madde

Dikkat: Sıra numarası olarak yazdığınız sayısal değerin bir önemi bulunmuyor sadece sayısal bir değer olması yeterli. Böylece oluşturduğunuz listelerde sıralamayı bozup bozmadığınızı düşünmek zorunda kalmazsınız veya uzun bir listenin başlarından bir maddeyi silecek olursanız sonraki maddelerin sıra numaralarını da tek tek düzeltmeniz gerekmez. Listeniz yeni duruma otomatik olarak adapte olur.

##  ** Numarasız Listeler ** 
Bir satırın başındayken `*` işaretini yazıp peşinden bir boşluk bırakırsanız numarasız bir madde oluşturmaya başlamış olursunuz.

```markdown
* İlk madde
* İkinci madde
* Üçüncü madde
```
------------------------
* İlk madde
* İkinci madde
* Üçüncü madde

##  ** Zengin Listeler ** 
İster numaralı olsun ister numarasız, liste maddeleri içinde vurgulama (kalın, italik) yapabilir, linkler oluşturabilir, bkz verebilirsiniz. Bunun dışında kalan biçimlendirmeler desteklenmemektedir.

---- ** Malzemeler ** -----
* 1 (: yumurta)
* 2 yemek kaşığı ** kuru maya ** (bkz: kuru maya)
* *** 2 su bardağı un ***
* 1 paket * Dr. Oetker * kabartma tozu (*: Dr. Oetker)
* 1,5 litre [süt](https://google.com)

-------------

# ** Kod **
Yazılarınızda kod paylaşabilirsiniz. Kod bloklarının arka planı beyazdır ve yazı tipindeki her karakter aynı genişlikte yer kaplar. Normalde birden fazla boşluk (space) bıraksanız bile sadece 1 tane boşluk varmış gibi davranılır. Fazladan bırakılan boşluklar yok sayılır ancak kod bloklarında her bir boşluk işlev gösterir. Bu özellikleri kullanarak kod alanlarında sadece yazılım kodu değil örneğin matematik formülleri gibi başka türden bilgileri de paylaşabilirsiniz.

##  ** Satır İçi Kod ** 
Blok şeklinde ekranı en bakımından tamamen kaplamak yerine satır içinde harflerin arasında görünen kod bölmeleridir. Oluşturmak için bir tane `` ` `` yani (: Aksan İşareti) (backtick) ve ardından yazacağınız kodu girip kod yazımı bittiğinde aynı işaretle sonlandırmanız gerekiyor.

```markdown
`E=m*c^2`
```

Ekranda şöyle görünür:
Satır içi kodların soluna ve `E=m*c^2` sağına başka sözcükler getirebilirsiniz.

Dikkat: Kod içinde Aksan İşareti kullanmanız gerekiyorsa başlangıç ve bitişlere bir tane yerine ** iki tane** aksan işareti yerleştirin.

```markdown
``Burada istediğim kadar ` karakteri ` kullanabilirim.``
```
---------
``Burada istediğim kadar ` karakteri ` kullanabilirim.``

Not: Maalesef bu alanda peş peşe aksan işareti kullanamazsınız. Bunu yapmanız gerekiyorsa blok kod oluşturun.

##  ** Blok Kod ** 
Kod blokları ekranı en bakımından tamamen kaplar. Tek satırda gösterilemeyecek kadar uzun ve karışık kodları, kod blokları içinde gösterebilirsiniz. Kod blokları çok satır ve çoklu boşlukları destekler. Oluşturmak için satırın en başında peş peşe üç tane aksan işareti `` ` `` veya peş peşe üç tane *** yaklaşık *** işareti `~` yazılmalı. Bundan sonra yeni satıra geçilerek kodları özgürce istediğiniz kadar sekme, boşluk ve yeni satır bırakarak girebilirsiniz. Kodların bittiği en son noktadan alt satıra geçmeli ve yine açılış için kullandığınız karakteri üç defa peş peşe yazmalısınız.

~~~markdown
```
kodlar burada
çok satırlı


çok           boşluklu ve
özel karakterler ``` rezerve olmadan
özgürce ~~~ kullanılabilir.
```
~~~

Bu girdi ekranda şöyle görünür;
```
kodlar burada
çok satırlı


çok           boşluklu ve
özel karakterler ``` rezerve olmadan
özgürce ~~~ kullanılabilir.
```

~~~markdown
Örneğin ```
böyle kod bloğu oluşturamazsınız. Açış karakterleri
satırın en başında olmak zorunda.

Ayrıca kapanış karakterlerinin de önünde başka karakterler
olmamalı. Bunlar da bir satırdaki ilk karakterler olmak zorunda. ```
~~~

##  ** Renklendirilmiş Yazılım Kodları ** 
Kod bloklarını yazılım kodu paylaşmak için kullandığınızda bu yazılım kodunda bulunan komut ve söz dizimlerini renklendirebiliriz. Bunu yapabilmemiz için paylaştığınız kodun hangi programlama diline ait olduğunu belirtmeniz yeterlidir.

~~~markdown
```javascript
var Car = Type( "Car" ).prototype(
{
    construct: function( speed, gears, color, cc, fuelLevel )
    {
        
    }
});
```
~~~

Dikkat: Bir programlama dilini renklendirmeyi desteklemiyor olsak bile siz yine de adını yazın. Gelecekte bu desteği sağlayacak olursak sizin bir işlem yapmanıza gerek kalmadan eski gönderilerinizi görüntüleyenler paylaştığınız kodu renklendirilmiş olarak görmeye başlarlar.

-------------

# ** Yatay Çizgi **
Yazıları bölümlere daha belirgin biçimde ayırmak için yatay çizgiler kullanabilirsiniz. Oluşturmak için bir satırın en başında (: tire) (dash) `-`, (: alt tire) (underscore) `_` veya yıldız işareti `*` karakterinden birini *** en az 4 tane *** peş peşe yazmalısınız.

```markdown
çeşitli bilgiler
----------------
başka bilgiler
```

Ekranda şöyle görünür:

çeşitli bilgiler
----------------
başka bilgiler

##  ** Başlıklı Yatay Çizgi (bağlam) ** 
Sadece düz bir çizgi bazen yetmeyebilir. Bu durumda yatay çizgi üzerine başlık yerleştirebilirsiniz. Yine normal yatay çizgi oluşturmak için kullandığınız karakterleri kullanabilirsiniz. En az bir tane çizgi oluşturma karakteri, peşinden başlık metni ve peşinden en az 4 tane çizgi oluşturma karakteri yazmalısınız.

```markdown
- Malzemeler ----
* yumurta
* bayat ekmek
* kıyma
```

- Malzemeler ----
* yumurta
* bayat ekmek
* kıyma

Şöyle de yazabilirdiniz:
```markdown
---------- Malzemeler ----------
```

---------- Malzemeler ----------

İki şekilde de tamamen aynı sonucu alırsınız.

---------------------

# ** Dışarı Giden Link **
Yazılarınız içinden başka sitelere link verebilirsiniz.

##  ** Otomatik Linkleme ** 
Paylaşmak istediğiniz url http ile başlıyorsa yani tam url ise ve biçimlendirmek istemiyor sadece tıklanabilir olmasını istiyorsanız tek yapmanız gereken görünmesini istediğiniz yere sayfa adresini yazmak/yapıştırmak. Bunlar otomatik olarak tıklanabilir link şeklinde biçimlendirilir.

Örneğin `https://google.com` adresini yazdığınızda https://google.com şeklinde tıklanabilir link haline dönüştürülür.

Uzun makaleler içinde bu linklerin daha okunaklı görünmesini istiyorsanız alternatif olarak `<  https://google.com  >` yapısını kullanabilirsiniz. Bu girdi ekranda yine diğeriyle aynı <https://google.com> şekilde görünür. `<>` işaretlerini sadece siz görürsünüz.

Otomatik linklendirme yapılmasını istemiyor olabilirsiniz. Yani paylaştığınız adresin olduğu gibi görünmesini istiyorsanız satır içi kod olarak `` `https://biliyon.net/bit-1` `` şeklinde yazabilirsiniz. Kod bloklarındaki linkler işlenmez.

##  ** Gelişmiş Linkler ** 
Bu yöntemle oluşturacağınız link üzerinde bir çok şeyi düzenleyebilirsiniz:
* link içinde görünecek tıklanabilir metin
* link üzerine mouse ile gelince görünecek ipucu kutucuğunda ne yazacağı 
* linke tıklanınca gidilecek sayfa adresi bilgilerini verebilirsiniz.

Link yapısı şöyledir: `[ tıklanabilir metin ]( url "ipucu metni" )`

```markdown
Su, insanlar için yaşamsal bir sıvıdır.
Kaynak: [ wiki ]( https://tr.wikipedia.org/wiki/Su "Suyla ilgili wikipedi'den bilgi al" )
```

Su, insanlar için yaşamsal bir sıvıdır.
Kaynak: [ wiki ]( https://tr.wikipedia.org/wiki/Su "Suyla ilgili wikipedi'den bilgi al" )

Dikkat: Sadece url bölümü zorunludur diğer bölümlerin içini doldurmanız gerekmez. Örneğin `[ ]( https://biliyon.net )` şeklinde bir kullanım [](https://biliyon.net) şeklinde işlev gösterir. Bunun yerine [Otomatik Linkleme](#otomatik-linkleme) yöntemi aynı sonucu veren çok daha pratik bir yoldur.

##  ** Aynı Yazı İçindeki Bir Başlığa Sıçrama Linki Vermek ** 
Yazı içinde oluşturduğunuz her bir başlık otomatik olarak bir url'e sahip olur. Böylece bu başlıklar link verilebilir olurlar. Siz de bir yazar olarak bazen okuyucuyu sayfadan ayrılmaksızın aynı yazının başka bölümlerine göz atması için yönlendirmek isteyebilirsiniz. Bunun için oluşturacağınız linkin url bölümüne yönlendirmek istediğiniz başlığın sadece `#gidilecek-başlık` bölümünü yazmanız yeterli.

```markdown
[Başlık Biçimlendirme](#başlık-biçimlendirme)
```

Örneğin [Başlık Biçimlendirme](#başlık-biçimlendirme) linkine tıklayınca sayfa değişmeden ilgili başlığa sıçrayabilirsiniz.

Dikkat: Başlığın kodunu değil de site adresini de içeren tam url'ini url bölümüne yazarsanız başlığa sıçrama yapılmaz onun yerine yeni sekmede açılır. Duruma göre belki bu da tercih edilebilir.

--------

# ** E-posta **
Yazılarınızda e-posta adresleri paylaşabilirsiniz. Tek yapmanız gereken e-posta adresini direkt yazmak. Bu adres otomatik olarak link haline getirilir. Tıklandığında ziyaretçinin bilgisayarında yüklü olan e-posta uygulaması açılır ve e-posta adresi bu uygulamaya gönderilir.

```markdown
iletisim@biliyon.net
```
------
iletisim@biliyon.net

------------------

# ** Biliyon.net Ana Başlıklarına Bakınız Bağlantısı Vermek **
Biliyon.net'teki ana başlıklara (yazılar içinde geçen başlıklar değil, ana başlıklar) yazılarınız içinden linkler vermek iyi bir alışkanlıktır. Bunun için çok basit yöntemlerimiz var.

##  ** Direkt Bakınız ** 
Yazı içinde geçen ve kendine ait başlığı olan kelime/cümleleri hemen oldukları yerde linklendirmeyi sağlar.

```markdown
Türkiye'nin başkenti (:ankara) isimli şehirdir.
```
----------
Türkiye'nin başkenti (:ankara) isimli şehirdir.

##  ** Kısa Bakınız ** 
Bir başlığa link vermek istiyorsanız ancak başlık metninin tamamının ekranda görünmesine gerek yoksa tercih edilebilecek bir linkleme yöntemidir.

```markdown
Su 0 santigrat derecede donar. (*: suyun donma noktası)
```
------
Su 0 santigrat derecede donar. (*: suyun donma noktası)

##  ** Normal Bakınız ** 
Bir başlığa bakınız linki verdiğinizi vurgulu biçimde göstermenizi sağlayan bakınız linkleridir.

```markdown
Su yaklaşık 100 santigrat derecede kaynar.
(bkz: suyun kaynama noktası)
```
------
Su yaklaşık 100 santigrat derecede kaynar.
(bkz: suyun kaynama noktası)

## ** Gönderi Numarasına Bakınız **
Bir gönderiye ID numarasını kullanarak bakınız linki verebilirsiniz. Bu bağlantılara tıklandığında sadece gönderinin gösterildiği kendi özel sayfası açılır.

```markdown
Bu konuya (: #72) numaralı gönderimde değindim.
Bu konuda daha önce yazdım. (*: #72) (*: #87)
Bunları daha önce söyledik.
(bkz: #72 )
```
------------
Bu konuya (: #72) numaralı gönderimde değindim.
Bu konuda daha önce yazdım. (*: #72) (*: #87)
Bunları daha önce söyledik.
(bkz: #72 )

## ** Kullanıcı Profiline Bakınız **
Bir kullanıcının profil sayfasına çok basit bir şekilde link verebilirsiniz. Bir tane `@` işareti ve bitişik biçimde kullanıcı adını yazıp bunu bir bakınız olarak ayarlamanız yeterli.

```markdown
(bkz: @biliyon)
```
---------------
(bkz: @biliyon)

Not: Bütün bakınız yöntemlerini kullanabilirsiniz.

## ** Kıstas Eklenmiş Başlıklar **
Bir ana başlığa nasıl link verilir biliyoruz. Peki bu linke tıklayan kullanıcıların o başlığa gitmesini ama sadece bir kullanıcının yazdığı gönderileri görmesini isteseydik? Peki ya başlık "mısır" sözcüğünde olduğu gibi birden fazla anlama geliyorsa ve biz ülke olan Mısır'dan bahsediyorsak ve link açıldığında sadece bu konuda yazılan gönderiler görünsün istiyorsak?

### *** Kullanıcı Filtreleme ***
Sadece belli bir kullanıcının yazdığı gönderileri filtreleyebiliriz.
```markdown
Bilgi için (: mısır/@freeman) hakkında yazdıklarıma bakınız.
```
-------------
Bilgi için (: mısır/@freeman) hakkında yazdıklarıma bakınız.

### *** Anlam Ayrımı ***
Sadece belli bir anlama gelen gönderileri filtreleyebilirsiniz.
```markdown
Bilgi için (bkz: mısır/$bitki) hakkında yazdıklarıma bakınız.
```
-------------
Bilgi için (bkz: mısır/$bitki) hakkında yazdıklarıma bakınız.

### *** Birlikte Kullanım ***
Bu filtreleri birlikte kullanabilirsiniz.
```markdown
Bilgi için (: mısır/@freeman/$ülke) göz atabilirsiniz.
```
-------
Bilgi için (: mısır/@freeman/$ülke) göz atabilirsiniz.

-----------------

# ** Hashtag **
Biliyon.net, ana konu başlıkları altına yazılar yazabileceğiniz bir sitedir. Ana başlıklar sayesinde her şeyi anlamsal olarak kategorize edip düzenli bir hale getirebiliyoruz.

Hashtag'ler ise bir sosyalleşme aracıdır. Yazıları, başlıkların statik yapısından kurtarır, sosyal gereksinimlere ayak uyduran dinamik bir yapıya kavuşturur.

Örneğin korkuya neden olmuş şiddetli bir deprem gerçekleşmiş olsun. Bu konuda henüz kimse yapmamışsa uygun bir başlık oluşturup bunun altına tanım, makale ve forum tandanslı gönderiler girilir. Bu arada devlet veya popüler bir haber kanalı veya bir internet fenomeni/ünlü kişi deprem bölgesindeki insanlar için bir kampanya başlatmış olsun. Bu dinamik gelişen durum için yeni bir başlık açarsak, ikisi de aynı konuda olduğu halde esas konuyu takip ettiğimiz başlıktaki ilgi diğer açılacak tali başlıklara devreder. Ancak depremle ilgili esas başlıkta kalıp, kampanya'ya destek/eleştiri için yazdığımız gönderilere hashtag eklersek ana olay kendi başlığı altında tam güçle takip edilirken bir koldan da kampanya sürdürülebilir. Üstelik aynı gönderi içinden başka kampanyalara (hashtag'lere) destek verilebilir. Konu dağılmamış olur.

Hashtag oluşturmak için yazının herhangi bir yerinde bir tane diyez `#` (sharp) işareti yazıp boşluk bırakmadan hashtag sözcüğünü yazmalısınız.
--------------------
#SesimiDuyanVarMı gibi.

Dikkat: bir satırın en başındaysanız ve diyez işaretinden sonra bir boşluk bırakacak olursanız bu, [ yazı içi başlık ]( #başlık ) olarak yorumlanır. Hashtag oluştururken diyez `#` işaretinden sonra boşluk bırakmayın!

Dikkat: hali hazırda devam eden bir hashtag varsa ve siz bunun adını yazarken bir veya birkaç karakteri yanlış yazdıysanız yazınız bu yanlış yazılan yeni hashtag altında yayınlanır. Editörler bu tür yanlış açılmış hashtag'leri fark ederse birleştirirler ancak bu gerçekleşene kadar yazınız olması gereken hashtag altında yayınlanmaz. Hashtag'leri doğru yazmak sizin sorumluluğunuzdadır.

-----------------

# ** Fotoğraf Eklemek **
Biliyon.net üzerine kendi bilgisayar/telefonunuzdaki fotoğrafları yükleyebilirsiniz. Yüklenen her fotoğraf kendisine özel bir numaraya sahip olur. Bu numarayı kullanarak isteyen her yazar istediği her fotoğrafı kendi yazısı içine yerleştirebilir. Biliyon.net aradığınız fotoğrafı kolayca bulmanızı sağlayabilen gezgin uygulamalara sahiptir. Bu aparat üzerinden bulup seçtiğiniz fotoğraf yazınıza otomatik eklenir. Ancak kullanmak istediğiniz fotoğrafın numarasını zaten bir şekilde biliyorsanız ve gezgin kullanmanıza gerek yoksa fotoğrafı basitçe kendiniz de yazınıza yerleştirebilirsiniz.

```markdown
![ alternatif metin ]( numara "ipucu metni" )
```
------
![ Norveç ]( 3 "Norveç")

Tıpkı harici bağlantılar oluştururken kullanılan söz dizimi gibi. Tek fark en başta bir tane (: ünlem işareti) `!` olması. Alternatif metin ve ipucu metni bölümlerini doldurmak zorunlu olmamakla birlikte bu alanları doldurmak arama motorlarına ve internet bağlantısı kötü olduğu için fotoğrafı yükleyemeyen ziyaretçiler için bilgi verici olacağından bilgi girmenizi tavsiye ederiz. Bu, yazdığınız yazıya daha fazla ziyaretçi gelmesini sağlayabilir.

Not: *** Alternatif metin *** alanına gireceğiniz metinsel ifade, fotoğraf bir nedenle yüklenemeyecek olursa fotoğrafın olacağı yerde gösterilmek için kullanılır.

Örneğin aşağıdaki kullanım şekli de doğrudur:

```markdown
![ ]( 1 )
```

Bu yöntem, her ne kadar sonuç veren bir kullanım şekli olsa da tekrar belirtmek gerekir ki * alternatif metin * alanı ile * ipucu metni * alanlarını doldurmanızı ısrarla tavsiye ediyoruz.

--------------

# ** Youtube Videoları **
Biliyon.net, kendi üzerine video yüklemeyi desteklemez. Bunun yerine youtube videolarının linklerini paylaşabilirsiniz. ** Youtube linklerini direkt yazı içine yapıştırabilirsiniz **. Harici link ekleme işlemini uygulamanız gerekmez. Biliyon.net youtube linklerini özel biçimde işlemektedir.

Youtube link kısaltma sisteminin oluşturduğu `https://youtu.be/xxXxxXx-XX_` şeklindeki kısa linkleri ve `https://youtube.com/watch?v=xxXxxXx-XX_` şeklindeki normal linkleri yazınıza yapıştırabilirsiniz.

Bir yazınıza youtube linki ekleyip yayınlarsanız biliyon.net bu videoya ait ön izleme fotoğrafını, açıklamasını ve süresini youtube sunucularından alıp kendi üzerinde kayıt altına alır. Böylece paylaştığınız video gelecekte youtube'dan kaldırılsa bile yazılarınızı okuyanlar video bilgilerine hala ulaşabilir. Ayrıca eklediğiniz video youtube'un kendi oynatıcısı ile direkt yazınızın içinde izlenebilir. Okuyucular bir taraftan yazınızı okurken bir taraftan videoyu izleyebilir.

Youtube videoları da fotoğraflar gibi ortaktır. Aynı videoyu isteyen her yazar kendi yazıları içinde paylaşabilir.

Ayrıca biliyon.net üzerinde paylaşılan her bir youtube videosunun biliyon.net üzerinde kendisine ait bir sayfası oluşturulur. Bu sayfa üzerinden ilgili videoya biliyon.net yazarları/üyeleri yorum yapabilir. Yorumlar biliyon.net üzerinde tutulur ve biliyon.net'e özeldir. Youtube üzerinde yayınlanmaz veya youtube üzerinde yapılmış yorumlar da biliyon.net üzerinde görünmez.

Tek yapmanız gereken, bir youtube videosunun adres satırından adresini kopyalayıp yazınızda istediğiniz bir alana yapıştırmak.

Örneğin https://youtu.be/xxXxxXx-XX_ gibi.

Dikkat: Youtube video adreslerini [dışarı giden link](#dışarı-giden-link) ekleme yöntemiyle sayfanıza ekleyecek olursanız video yukarıda sayılan ayrıcalıkların tümünden mahrum kalır. Normal bir harici link nasıl işliyorsa bu video linkine de o şekilde davranılır. Bu da yine duruma göre belki tercih edilebilir.

--------------

# ** Tablolar **
Tekrar eden bilgileri tablo halinde sunarak bir sürü bilgiyi çok az alan harcayıp kolay anlaşılır biçimde okuyucuya aktarabilirsiniz.

Tablo oluştururken ** başlıklar satırı **, ** hizalama satırı ** ve ** içerik satırları ** olmak üzere 3 ana satır oluşturmanız gerekiyor.

## ** 1- Başlıklar Satırı **
İlk satırda tablonuzdaki konuların başlıklarını oluşturmalısınız.
```markdown
| Sıra No. | Şehir | Plaka Kodu | Telefon Alan Kodu |
```

## ** 2- Hizalama Satırı **
İkinci satırda her bir başlığın ve onun altındaki içeriğin hücrenin hangi tarafında bulunacağını söylemelisiniz.
```markdown
| --- | :--- | :---: | ---: |
```

Not: Sol taraftaki iki nokta üst üste işareti sola hizalama, sağ taraftaki sağa hizalama, iki taraftaki ortalama anlamına gelir. Hiç iki nokta üst üste işareti kullanmazsanız sol tarafa hizalamak istediğiniz varsayılır yani sol tarafa hizalamak istiyorsanız iki nokta üst üste işareti kullanmanız şart değildir.

## ** 3- İçerik Satırları **
Yukarıdaki iki satırı yazdıktan sonra tablonuz ekranda belirmiş olmalı. Artık tablo içeriğini oluşturabilirsiniz.
```markdown
| 1 | ** Ankara **    | 01 | 312 |
| 2 | (: İzmir)       | 35 | 232 |
| 3 | (bkz: İstanbul) | 34 | 212 |
```

Dikkat: İçerik alanında vurgu, bakınız ve dışarı giden linkler ve satır içi kod oluşturabilirsiniz. Bunun dışında kalan biçimlendirmeler desteklenmez.

## ** Sonuç **
```markdown
| Sıra No. | Şehir           | Plaka Kodu | Telefon Alan Kodu |
| -------- | :-------------- | :--------: | ----------------: |
| 1        | ** Ankara **    | 01         | 312               |
| 2        | (: İzmir)       | 35         | 232               |
| 3        | (bkz: İstanbul) | 34         | 212               |
```
-------------------
| Sıra No. | Şehir           | Plaka Kodu | Telefon Alan Kodu |
| -------- | :-------------- | :--------: | ----------------: |
| 1        | ** Ankara **    | 01         | 312               |
| 2        | (: İzmir)       | 35         | 232               |
| 3        | (bkz: İstanbul) | 34         | 212               |

## ** Bitişik Nizam **
Yazı yazarken tablonuzun kalem gibi düzgün görünmesi gerekmez.
```markdown
| Sıra No. | Şehir | Plaka Kodu | Telefon Alan Kodu |
| - | :- | :-: | -: |
| 1 | ** Ankara ** | 01 | 312 |
| 2 | (: İzmir) | 35 | 232 |
| 3 | (bkz: İstanbul) | 34 | 212 |
```

Bu şekilde de tamamen aynı sonucu alırsınız. Özellikle büyük bir tablo oluşturuyorsanız yer konusunda avantaj sağlayabilir.

----------------

# ** Dialog & Konuşma & Mesajlaşma **
Yazılarınız içinde bazen kişilerin yasal yönden sorun teşkil etmeyecek konuşma içeriğini paylaşmanız gerekebilir. Bu konuşmalar tek, iki kişi veya ikiden fazla kişi arasında geçiyor olabilir. Bu tür konuşmaları görsel yönü güçlü biçimde okuyucuya aktarmak için kısaca * dialog * dediğimiz yapıları kullanabilirsiniz.

## ** Söz Dizimi Yapısı **
Diyalog blokları (: at işareti) `@` ile başlayıp aynı işaretle bitmelidir. Bunlar bir satırdaki ilk karakterler olmalı.

### ** Basit söz dizimi **
Bloğun içindeki her satırın başında o cümleyi kuran kişinin adı ve ondan hemen sonra bu konuşmanın sağ tarafta yer alması için `>` sol tarafta yer alması için `<` işareti yazılmalıdır. Sonra da konuşma metni yazılır. Her yeni satırda bu prosedür tekrarlanmalıdır.

```markdown
@
İlk Kişi < İlk kişiye ait sözler.
İlk Kişi < İlk kişiye ait diğer sözler.
İkinci > İkinci kişiye ait sözler.
Üçüncü < Üçüncü kişiye ait sözler.
Dördüncü < Dördüncü kişiye ait sözler.
Beşinci > Beşinci kişiye ait sözler.
@
```

----- Sonuç ----------

@
İlk Kişi < İlk kişiye ait sözler.
İlk Kişi < İlk kişiye ait diğer sözler.
İkinci > İkinci kişiye ait sözler.
Üçüncü < Üçüncü kişiye ait sözler.
Dördüncü < Dördüncü kişiye ait sözler.
Beşinci > Beşinci kişiye ait sözler.
@
-----------------

### ** Kısayol Oluşturma **
Uzun bir konuşmayı aktarıyorsanız her satırda söz sahibinin tam adını, söz konumlandırma işaretini sürekli uzun uzun yazmak yorucu olabilir. Bundan kurtulmak için ilk satırdaki `@` işaretinden sonra aynı satırda kısayollar oluşturabilirsiniz.

```markdown
@ İlk Kişi | İkinci > 2 | Üçüncü < 3 | Dördüncü < 4 | Beşinci > 5
: İlk kişiye ait bütün sözler direkt yazılabilir.
2: İkinci kişiye ait sözler sağda.
3: Üçüncü kişiye ait sözler.
2< İkinci kişinin sözleri bu defa bir kereliğine sağda değil solda
4: Dördüncü kişiye ait sözler.
5: Beşinci kişiye ait sözler.
2: İkinci kişinin sözleri kısa yolda belirlenen tarafta
@
```

İlk konuşmacıyı en başa sadece adını yazarak, kısayol atamadan tanımlayabilirsiniz. Artık söz yazarken her satırın başında sadece (: iki nokta üst üste) `:` karakteri yazarak bu kişiye atıfta bulunabilirsiniz.

Kısayol oluştururken konuşmacıları birbirinden ayırmak için `|` işareti kullanmalısınız.

İkinci ve sonraki konuşmacıları tanımlarken önce konuşmacının tam adı sonra bu konuşmacının sözlerinin ** varsayılan olarak ** ekranın hangi tarafında yer alacağı ve bu konuşmacı için kısa bir sözcük veya işaret yazmalısınız. `Tam Ad > x` gibi. Artık bu konuşmacının yazacağınız her sözü için `x: sözler` yazmanız yeterli olur.

Üstteki paragrafta kısayol alanındaki bir konuşmacının sözleri için varsayılan yerleşim tarafını belirleyebiliyorsunuz demiştik. Ancak o satıra mahsus bu kullanıcının sözünün kısa yolda belirlediğiniz değil de diğer tarafta olmasını istiyorsanız sözü yazarken `:` işaretini değil de `> veya <` işaretini yazarak o söz girişine özel yerleşim pozisyonunu değiştirebilirsiniz. `x > sözler` gibi.

---- Sonuç ------------

@ İlk Kişi | İkinci > 2 | Üçüncü < 3 | Dördüncü < 4 | Beşinci > 5
: İlk kişiye ait bütün sözler direkt yazılabilir.
2: İkinci kişiye ait sözler sağda.
3: Üçüncü kişiye ait sözler.
2< İkinci kişinin sözleri bu defa bir kereliğine sağda değil solda
4: Dördüncü kişiye ait sözler.
5: Beşinci kişiye ait sözler.
2: İkinci kişinin sözleri kısayolda belirlenen tarafta
@

-----------------------------

# ** Duyoji **
Biliyon.net sesli emojiler, yani yüz ifadeleri yerine ses efektleriyle duygu aktarımını destekler. Oluşturmak için iki tane nokta `..` yazıp peşinden duyoji adını yazıp peşinden tekrar iki nokta yazmalısınız. `.. DuyojiAdı > Görünür Metin ..` gibi.

------ ** Desteklenen duyojiler ** --------
| İsim    | Dinle                         |
| ------: | ----------------------------- |
| komik   | .. komik > ahahaha ..         |
| wow     | .. wow > wow wow wow ..       |
| şeytani | .. şeytani > şeytani gülüş .. |
| whaat   | .. whaat > nasıl yaa ..       |

```markdown
Lütfen herkes atına sahip çıksın. .. wow > hey hey hey! ..
```
--------------
Lütfen herkes atına sahip çıksın. .. wow > hey hey hey! ..

Bu bağlantıya tıkladığınızda/dokunduğunuzda veya üzerine mouse ile gelip bir süre beklediğinizde ses efektini duyarsınız.

Dikkat: görünür metin alanı zorunlu değildir. İsterseniz sadece duyoji adını `.. wow ..` şeklinde yazabilirsiniz. Bu durumda görünür alan içine duyoji adı .. wow .. şeklinde yerleştirilir. 

--------------------

# ** Spoiler **
Bir romanın sonunu tartışmak güzel bir fikirdir. Ancak o kitabı henüz okumadıysanız bunu hemen bilmek istemezsiniz. Bu tür hassas bilgileri spoiler blokları içinde göstermelisiniz.

## ** Basit Spoiler **
4 tane ters taksim işareti `\` yani (: back slash) ile başlayıp peşinden yeni satıra geçip hassas bilgileri yazabilirsiniz. Son olarak yeni satıra geçip bu kez 4 tane taksim işareti `/` yani (: slash) ile bitirmelisiniz. Kolay hatırlamak için taksim işaretleri sağ tarafa bakan bir yay şekli çizmeli.

```markdown
\\\\
(: Bruce Willis) o filmde ölüymüş kanka.
(bkz: o film)
////
```
--------------
\\\\
(: Bruce Willis) o filmde ölüymüş kanka.
(bkz: o film)
////

## ** Başlıklı Spoiler **
İsterseniz spoiler başlığını değiştirebilirsiniz.

```markdown
\\\\ ** Çok fena spoiler vereceğim **
(: Bruce Willis) _o filmde_ ölüymüş kanka. (*: o film)
////
```
--------------
\\\\ ** Çok fena spoiler vereceğim **
(: Bruce Willis) _o filmde_ ölüymüş kanka. (*: o film)
////

Dikkat: Lütfen spoiler uyarısı oluşturmak için başka yazı araçlarıyla kendi uyarılarınızı oluşturmayın. Teknoloji geliştikçe spoiler arayüzünde geliştirmelere gitsek bile hassas bilgileri spoiler bloğu içine almadığınız için yazılarınız kapsam dışı kalabilir.
