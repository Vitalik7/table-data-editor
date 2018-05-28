import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      elements: [],
      text: '',
      text2: '',
      textJson: '',
      mode: 'all',
      data: null
    }
    this.handleFileSelect = this.handleFileSelect.bind(this);
    this.displayData = this.displayData.bind(this);
    this.addElement = this.addElement.bind(this)
    this.inputChange = this.inputChange.bind(this)
    this.inputValue = this.inputValue.bind(this)
    this.nameChange = this.nameChange.bind(this)
    this.valueChange = this.valueChange.bind(this)
    this.removeElement = this.removeElement.bind(this)
    this.checkboxChange = this.checkboxChange.bind(this)
    this.changeMode = this.changeMode.bind(this)
    this.inputEmpty = this.inputEmpty.bind(this)
    this.changeValue = this.changeValue.bind(this)
    this.updateData = this.updateData.bind(this)
    this.exportToJson = this.exportToJson.bind(this)
  }

  displayData(content) {
      this.setState({textJson: content});
    }

  handleFileSelect(evt) {
      let files = evt.target.files;
      if (!files.length) {
        alert('No file select');
        return;
      }
      let file = files[0];
      let that = this;
      let reader = new FileReader();
      reader.onload = function(e) {
        that.displayData(e.target.result);
      };
      reader.readAsText(file);
  }

  addElement(event) {
    event.preventDefault()
    this.setState({
      text: '',
      text2: '',
      elements: this.state.elements.concat([{
        name: this.state.text,
        value: this.state.text2
      }])
    }, () => {
      this.setState({
        textJson: JSON.stringify(this.state.elements)
      })
    })
  }

  inputChange(e) {
    this.setState({
      text: e.target.value
     })
  }

  inputValue(e) {
    this.setState({
      text2: e.target.value
     })
  }

  nameChange(e, ind) {
    this.state.elements[ind].name = e.target.value
    this.setState({
      elements: this.state.elements,
      textJson: JSON.stringify(this.state.elements)
    })
  }

  valueChange(e, ind) {
    this.state.elements[ind].value = e.target.value
    this.setState({
      elements: this.state.elements,
      textJson: JSON.stringify(this.state.elements)
    })
  }

  removeElement(index) {
    this.state.elements.splice(index, 1)
    this.setState({
      elements: this.state.elements
    })
  }

  checkboxChange(index) {
    this.state.elements[index].checked = !this.state.elements[index].checked
    this.setState({
      elements: this.state.elements
    })
  }

  changeMode(newMode) {
    this.setState({
      mode: newMode
    })
  }

  inputEmpty(){
    if (this.state.text == '') {
      alert('Write text!!')
      return
    }
  }

  changeValue (e) {
    let newValue = e.target.value
    this.setState({
      textJson: newValue
     })
}

  updateData (e, ind) {
    try {
      let parsed = JSON.parse(this.state.textJson)
      if (Array.isArray(parsed)) {
        let isCorrectArray = parsed.every((element) => {
          return element.name && element.value
        })
        if (isCorrectArray) {
          this.setState({
            elements: parsed
          })
        } else {
          throw 'invalid elements'
        }
      } else {
        throw 'not array'
      }
    } catch (e) {
      alert('need format = [{name\":\"...\",\"value\":\"...\"},\n{\"name\":\"...\",\"value\":\"...\"}]')
    }
    e.preventDefault()
  }

  exportToJson () {
    let dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.state.elements));
    let dlAnchorElem = document.getElementById('downloadAnchorElem');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', 'text-data-editor.json');
    dlAnchorElem.click();

  }

  render() {
    const jsonStr = JSON.stringify(this.state.elements)
    const textJson = this.state.textJson
    const data = this.state.data;

    return (
      <div>
      <div className='json'>
      <div>
       <input type="file" onChange={this.handleFileSelect}/>
       {data && <p> {data} </p>}
     </div>
        <h3>JSON</h3>
        <textarea
          onChange={this.changeValue}
          placeholder={
            '[{"name":"...","value":"..."}' +  ',\n' + '{"name":"...","value":"..."}]'
          }
          value={textJson}
          rows="10" cols="40"></textarea>
         <a id="downloadAnchorElem" style={{display:'none'}}></a>
         <div>
           <Button  onClick={this.exportToJson} className='exportData'> export data to json </Button>
           <Button  onClick={this.updateData} className='updateData'> update data </Button>
         </div>
      </div>
      <form onSubmit={this.addElement} >
        <TextField
          name='name'
          type='text'
          className='TextField'
          placeholder='name'
          value={this.state.text}
          onChange={this.inputChange}
        />
        <TextField
          name='value'
          type='text'
          className='TextField'
          placeholder='value'
          value={this.state.text2}
          onChange={this.inputValue}
        />
        <Button variant="fab" type='submit' onClick={this.inputEmpty}>+</Button>
      </form>

      <ul>
        {this.state.elements.map((element, index) => {
          if (this.state.mode === 'checked' && !element.checked) {
            return
          } else if (this.state.mode === 'unchecked' && element.checked) {
            return
          }
          return (
           <li key={index} >
             <input
               type='checkbox'
               checked={element.checked}
               onChange={() => this.checkboxChange(index)}
             />
             <TextField
               name='name'
               type='text'
               placeholder='name'
               className='TextField'
               style={{
                 textDecoration: element.checked ? 'line-through' : 'none',
                 color: element.checked ? 'gray' : 'black'
               }}
               value={element.name}
               onChange={event => this.nameChange(event, index)}
             />
             <TextField
               name='value'
               type='text2'
               placeholder='value'
               className='TextField'
               style={{
                 textDecoration: element.checked ? 'line-through' : 'none',
                 color: element.checked ? 'gray' : 'black'
               }}
               value={element.value}
               onChange={event => this.valueChange(event, index)}
             />
             <button onClick={() => this.removeElement(index)} style={{color: 'red'}} > X </button>
           </li>
          )
        }
      )}
      </ul>
      <div className='btns'>
        <Button className='btnMode' onClick={() => {this.changeMode('all')}}>All</Button>
        <Button className='btnMode' onClick={() => {this.changeMode('checked')}}>Checked</Button>
        <Button className='btnMode' onClick={() => {this.changeMode('unchecked')}}>Unchecked</Button>
      </div>
    </div>
    );
  }
}

export default App;
