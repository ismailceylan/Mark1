define(
{
	/**
	 * 4 kanallı, ilk üç kanalda 256 renk destekleyen, diğer kanalda 256 farklı alpha
	 * karışım oranını adresleyebilen renk kodlama sisteminin olası hexadecimal
	 * dönüşümleriyle eşleşen büyük ve küçük harf farkına duyarsız düzenli ifade.
	 *
	 * #?fce
	 * #?fce3
	 * #?ffccee
	 * #?ffccee33
	 * 
	 * @type {RegExp}
	 */
	hexadecimalRGBAPattern: /^#?([a-f0-9]{3}|[a-f0-9]{4}|[a-f0-9]{6}|[a-f0-9]{8})$/i
});
