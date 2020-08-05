define(
[
	"../type",
	"../typo/capitalize",

],
function( Helper, capitalize )
{
	/**
	 * Verilen nesnenin verilen türden olup olmadığını söyler.
	 * 
	 * @param {mixed} variable sınanacak bir nesne
	 * @param {String|Function} target tür
	 * @return {Boolean|String}
	 */
	return function( variable, target )
	{
		var targetType = Helper.type( target );

		if( "String" == targetType )
		{
			var prefixedTarget;
			var iTarget = target.toLowerCase();

			if( Helper.config.knownTypes.indexOf( iTarget ) > -1 )
			
				return Helper.type( variable ).toLowerCase() == iTarget;

			else if( Helper[ prefixedTarget = "is" + capitalize( iTarget )])

				return Helper[ prefixedTarget ]( variable );

			else if( variable && variable.type && variable.is )

				return variable.is( target );

			else
			
				return variable && variable.constructor.name === target;
		}
		else if( "Function" == targetType )

			return variable instanceof target;

		else if( Helper.isPrimitive( variable ) && Helper.isPrimitive( target ))

			return variable === target;

		else if( ! target )
		
			return (
			(
				variable.prototype &&
				variable.prototype.constructor &&
				variable.prototype.constructor.name
			)) || variable.constructor.name;
	}
});
