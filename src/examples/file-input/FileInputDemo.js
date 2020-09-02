// @flow

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @since 2020-08-14
 */

import React from 'react';
import { Card } from 'react-bootstrap';
import Viewer from 'react-viewer';

// Components
import CropperModel from './../../components/cropper-modal/CropperModel';

/** FileInputDemo functional component */
function FileInputDemo () {
	const [file, setFile] = React.useState<Object>(null);
	const [resizedImage, setResizedImage] = React.useState<string>(null);
	const [viewImages, setViewImages] = React.useState<{src: string, alt: string}[]>([]);
	
	/** Event: File input change  */
	const onFileInputChange = ( e: Object ): void => {
		if ( e.target.files && e.target.files.length > 0 ) {
			setFile(e.target.files[0]);
		}
		
		e.target.value = null;
	};
	
	return (
		<Card className="text-center mb-4">
			<Card.Header as="h5">
				React-Cropper with Bootstrap Modal (File Input)
			</Card.Header>
			<Card.Body>
				<input accept="image/jpeg,image/png" type="file" onChange={onFileInputChange}/>
				
				<CropperModel file={file}
					onConfirm={( croppedFile: Object ) => {
						setResizedImage(window.URL.createObjectURL(croppedFile));
					}}
					onCompleted={() => setFile(null)}/>
				
				{!!resizedImage && (
					<Card className="text-center mt-4">
						<Card.Body>
							<a href="/" onClick={e => {
								e.preventDefault();
								e.stopPropagation();
								setViewImages([{src: resizedImage, alt: 'Cropped preview'}]);
							}}>
								<img src={resizedImage} alt="Cropped preview"
									style={{height: '400px', width: 'auto'}}/>
							</a>
						</Card.Body>
						{!!viewImages.length && (
							<Viewer visible={true}
								images={viewImages} onClose={() => setViewImages([])}/>
						)}
					</Card>
				)}
			</Card.Body>
		</Card>
	);
}

export default FileInputDemo;
 
