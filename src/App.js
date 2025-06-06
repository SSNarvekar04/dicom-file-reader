import React, { Component } from 'react';
import dicomParser from 'dicom-parser';

class App extends Component{
  constructor(props){
    super(props);
    this.state= {
      fileName: '',
      fileContent:'',

    };
  }
  handleFileChange = e=> {
    const file = e.target.files[0];
    const fileName = file.name;
    const fileType = file.type;

    const reader = new FileReader();
    if (fileType == 'application/dicom' || fileName.toLowerCase().endsWith('.dcm')) {
    reader.readAsArrayBuffer(file);
    reader.onload= () => {
     try {
        const arrayBuffer = reader.result;
        const byteArray = new Uint8Array(arrayBuffer);
        const dataSet = dicomParser.parseDicom(byteArray);

        const patientName = dataSet.string('x00100010');
        const patientId = dataSet.string('x00100020');
        const patientSex = dataSet.string('x00100040');
        const patientBirthDate = dataSet.string('x00100030');
        const patientAge = dataSet.string('x00101010');
        const studyInstanceUID = dataSet.string('x0020000D');
        const InstanceNumber = dataSet.string('x00200013') || '';
        const ImageType = (dataSet.string('x00080008') || '');
        const SamplesPerPixel = dataSet.uint16('x00280002');
        const Rows = dataSet.uint16('x00280010');
        const Columns = dataSet.uint16('x00280009');
        

        this.setState({
          fileName: file.name, 
          fileContent: `Patient Name: ${patientName}, Patient ID: ${patientId}, Patient Sex: ${patientSex}, PatientBirthDate: ${patientBirthDate}, PatientAge: ${patientAge},
          StudyInstanceUID: ${studyInstanceUID}, InstanceNumber:${InstanceNumber}, ImageType:${ImageType}, SamplesPerPixel:${SamplesPerPixel}, Rows:${Rows}, Columns:${Columns}`
        });
       } catch (err) {
        console.log('DICOM parse error:', err);
        this.setState({
          fileName: file.name,
          fileContent: 'Error parsing DICOM file',
        });
      }
    };
      
    reader.onerror = () => {
      console.log('file error', reader.error)
      }; 

  } 
};
  render() {
    return (
      <div>
        <h1>File Reader</h1>
        <input type="file" onChange={this.handleFileChange} />
        <br />
        <p>{this.state.fileName}</p>
        <pre>{this.state.fileContent}</pre>
      </div>
    );
  }
};
export default App;