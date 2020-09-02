// @flow

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @link http://junaidatari.com Author Website
 * @since 2020-09-02
 */

/**
 * @public
 * @static
 * Get filename and mine type */
export function getFileInfo ( file: Object, mime: string = '' ): { filename: string, mime: string } {
	const pos: number = String(file.name).lastIndexOf('.');
	
	if ( mime === 'image/jpeg' ) {
		const filename = `${String(file.name)
			.substr(0, pos < 0 ? String(file.name).length : pos)}.jpg`;
		
		return {
			filename,
			mime: 'image/jpeg'
		};
	}
	
	return {
		filename: file.name,
		mime: file.type,
	};
}
