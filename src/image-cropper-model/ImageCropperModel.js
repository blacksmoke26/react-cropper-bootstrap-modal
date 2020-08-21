// @flow

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @link http://junaidatari.com Author Website
 * @since 2020-08-14
 */

import React from 'react';
import ReactCropper from 'react-cropper';
import { Button, Modal, Row, Col } from 'react-bootstrap';
import Slider from 'rc-slider';

// Types
import type { Node } from 'react';
import * as PropTypes from 'prop-types';
import { ReactCropperProps } from 'react-cropper';
import type Cropper from 'cropperjs';

// Styles
import 'cropperjs/dist/cropper.css';
import 'rc-slider/assets/index.css';

/**
 * ImageCropperModel `props` type
 * @type {Object}
 */
type Props = {
	/** File or Blob object */
	file: File,
	/** Multilingual message */
	i18n?: {
		heading: string,
		confirm: string,
		discard: string,
		zoom: string,
		rotate: string,
	},
	/** Override MIME type (set null for auto retrieve) */
	mime?: string,
	/** Export image quality (1-100) */
	quality?: number,
	/** Cropper options */
	cropper?: ReactCropperProps,
	/** Cropped canvas options */
	croppedCanvas?: Cropper.GetCroppedCanvasOptions,
	/** Event handler: Trigger when confirm button clicked */
	onConfirm ( file: File, cropper: Cropper ): void,
	/** Event handler: Trigger when discard button clicked */
	onDiscard (): void,
};

/**
 * ImageCropperModel functional component
 */
const ImageCropperModel = ( props: Props ): Node => {
	const [cropper, setCropper] = React.useState<Cropper>();
	const [show, setShow] = React.useState<boolean>(false);
	const [image, setImage] = React.useState<string>(null);
	const [zoom, setZoom] = React.useState<number>(1);
	const [rotate, setRotate] = React.useState<number>(0);
	const imageRef = React.useRef<HTMLImageElement>(null);
	
	React.useEffect(() => {
		if ( props.file ) {
			const reader = new FileReader();
			reader.addEventListener('load', () => {
				setImage(reader.result);
				setShow(true);
			});
			
			reader.readAsDataURL(props.file);
		}
	}, [props.file]);
	
	/**
	 * Get file info
	 * @returns {{filename: string, mime: string}}
	 */
	const getFileInfo = (): {filename: string, mime: string} => {
		const pos: number = String(props.file.name).lastIndexOf('.');
		
		if ( props.mime === 'image/jpeg' ) {
			const filename = `${String(props.file.name)
				.substr(0, pos < 0 ? String(props.file.name).length : pos)}.jpg`;
			
			return {
				filename,
				mime: 'image/jpeg'
			};
		}
		
		return {
			filename: props.file.name,
			mime: props.file.type,
		};
	};
	
	
	/**
	 * Crop image
	 * @returns {void}
	 * @event {Props:onConfirm}
	 */
	const cropImage = () => {
		if ( !cropper ) {
			return ;
		}
		
		const canvasData: HTMLCanvasElement = cropper.getCroppedCanvas(props.croppedCanvas);
		
		const fileInfo = getFileInfo();
		
		canvasData.toBlob((blob) => {
			setCropper(null);
			setImage(null);
			setShow(false);
			const fileOb = new File([blob], fileInfo.filename, {type: blob.type, lastModified: new Date()});
			typeof props.onConfirm === 'function' && props.onConfirm.call(null, fileOb, cropper);
		}, fileInfo.mime, props.quality);
	};
	
	const handleClose = () => {
		setShow(false);
	};
	
	const onConfirm = () => {
		cropImage();
	};
	
	return (
		<Modal show={show} onHide={handleClose} animation={false} size="xl">
			<Modal.Header closeButton>
				<Modal.Title>{props.i18n.heading}</Modal.Title>
			</Modal.Header>
			<Modal.Body className="text-center">
				{image && (
					<ReactCropper
						ref={imageRef}
						src={image}
						style={{height: 500, width: '100%'}}
						initialAspectRatio={16 / 9}
						viewMode={1}
						dragMode="move"
						cropBoxResizable={false}
						cropBoxMovable={false}
						zoom={false}
						toggleDragModeOnDblclick={false}
						checkOrientation={true}
						onInitialized={instance => setCropper(instance)}
						{...props.cropOptions}
					/>
				)}
			</Modal.Body>
			<Modal.Footer className="d-block">
				<Row>
					<Col xs={6}>
						<div className="float-left mb-4 d-block" style={{width: 200, marginRight: '65px'}}>
							<small>{props.i18n.zoom}</small> <Slider min={0} step={.1} max={4} marks={{
							'0.1': '0x', '1': '1x', '2': '2x', '3': '3x', '4': '4x',
						}} value={zoom} onChange={(value) => {
							setZoom(value);
							cropper.zoomTo(value);
						}}/>
						</div>
						<div className="float-left mb-3 d-block" style={{width: 200}}>
							<small>{props.i18n.rotate}</small> <Slider min={-180} max={180} marks={{
							'-180': '-180°', '0': '0°', '180': '180°',
						}} value={rotate} onChange={(value) => {
							setRotate(value);
							cropper.rotateTo(value);
						}}/>
						</div>
						<div className="clearfix"></div>
					</Col>
					<Col xs={6} style={{
						display: 'flex',
						alignSelf: 'center',
						justifyContent: 'flex-end',
					}}>
						<Button variant="primary" className="mr-1" onClick={onConfirm}>
							{props.i18n.confirm}
						</Button>
						{' '}
						<Button variant="secondary" onClick={handleClose}>
							{props.i18n.discard}
						</Button>
					</Col>
				</Row>
			</Modal.Footer>
		</Modal>
	);
};

ImageCropperModel.propTypes = {
	onConfirm: PropTypes.func,
	onDiscard: PropTypes.func,
	mime: PropTypes.string,
	quality: PropTypes.number,
	file: PropTypes.objectOf(File).isRequired,
	i18n: PropTypes.shape({
		heading: PropTypes.string,
		confirm: PropTypes.string,
		discard: PropTypes.string,
	}),
	cropper: PropTypes.object,
	croppedCanvas: PropTypes.object,
}

ImageCropperModel.defaultProps = {
	i18n: {
		heading: 'Crop Image',
		confirm: 'Confirm',
		discard: 'Discard',
		zoom: 'Zoom',
		rotate: 'Rotate',
	},
	mime: null,
	quality: 70,
	cropper: {
		minCropBoxWidth: 854,
		minCropBoxHeight: 480,
	},
	croppedCanvas: {
		minWidth: 854, maxWidth: 1200,
		minHeight: 480, maxHeight: 600,
		imageSmoothingQuality: 'medium',
	},
	onConfirm: () => {},
	onDiscard: () => {},
}

export default ImageCropperModel;
 
