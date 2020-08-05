define(
[

],
function()
{
	// bu metot çalıştırıldığında app nesnesini context olarak
	// alır yani this sözcüğü app nesnesine refere eder
	return function()
	{
		// bu metot app global değişkeninin bir alt metodu gibi call edildiği için
		// this sözcüğü direkt app nesnesine refere eder ve onun üzerine istediğimiz
		// gibi olay dinleyiciler attach edebiliriz
		// $( this )
	}
});
