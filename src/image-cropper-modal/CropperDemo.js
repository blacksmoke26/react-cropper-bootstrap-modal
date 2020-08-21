// @flow

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @since 2020-08-14
 */

import React from 'react';
import { Container, Card } from 'react-bootstrap';
import ImageCropperModal from './ImageCropperModal';

// Types
import type { Node } from 'react';
/**
 * Demo functional component
 */
function CropperDemo (): Node {
	const [file, setFile] = React.useState<File>(null);
	const [resizedImage, setResizedImage] = React.useState<string>(null);
	
	return (
		<Container className="mt-4">
			<h1 className="text-center mb-4">React-Cropper with Bootstrap Modal</h1>
			<Card className="text-center mb-4">
				<Card.Body>
				<label>
					<input type="file" onChange={(e) => {
						if ( e.target.files && e.target.files.length > 0 ) {
							setFile(e.target.files[0]);
							setResizedImage(null);
						} else {
							setFile(null);
							setResizedImage(null);
						}
					}}/>
				</label>
				</Card.Body>
			</Card>
			{file && (
				<ImageCropperModal file={file}
					onConfirm={( file: File ) => {
						setResizedImage(window.URL.createObjectURL(file));
						setFile(null);
					}} onDiscard={() => {
					setFile(null);
					setResizedImage(null);
				}}/>
			)}
			
			{resizedImage && (
				<Card className="text-center mb-4">
					<Card.Body>
						<a href={resizedImage} target="_blank" rel="noopener noreferrer">
							<img alt="" style={{height: '200px', width: 'auto'}} src={resizedImage}/>
						</a>
					</Card.Body>
				</Card>
			)}
		</Container>
	);
};

export default CropperDemo;
 
