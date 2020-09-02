// @flow

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @since 2020-08-14
 */

import React from 'react';
import { Container } from 'react-bootstrap';

// Components
import FileInputDemo from './examples/file-input/FileInputDemo';

/** App functional component */
function App() {
	return (
		<Container className="mt-4">
			<FileInputDemo/>
		</Container>
	)
}

export default App;
