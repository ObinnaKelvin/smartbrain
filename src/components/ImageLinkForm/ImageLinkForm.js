import React from 'react';
import './ImageLinkForm.css';


const ImageLinkForm = ({onInputChange, onButtonSubmit}) =>{
	return(

		<div>
			<p className = 'f3'>
				{'Smart Brain can detect faces in your pictures. Try it out...'}
			</p>
			<div className = 'center'>
				<div className='center form pa4 br3 shadow-5'>
					<input className = 'f4 pa2 w-70 center' type='text' onChange={onInputChange}/>
					<button className = 'm2 w-40 grow f4 link ph3 pv2 dib white bg-light-purple' onClick={onButtonSubmit}>Detect</button>
				</div>	
			</div>
		</div>
	)
} 


export default ImageLinkForm;