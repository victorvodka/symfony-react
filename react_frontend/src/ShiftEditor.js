import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import axios from 'axios';
import TextField from 'material-ui/TextField';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

class ShiftEditor extends React.Component {
  constructor(props) {
    console.log(props);
    super(props);
    this.data = props.data;
    this.userId = props.userId;
    if(this.data.shift){
      this.state={
        manager_id:this.data.shift.manager_id,
        employee_id:this.data.shift.employee_id,
        start_time:this.data.shift.start_time,
        end_time:this.data.shift.end_time,
        break:this.data.shift.break
      }
    } else {
      this.state={
        manager_id:'',
        employee_id:'',
        start_time:'',
        end_time:'',
        break:''
      }
    }
  }

  displayShiftData(response) {
      console.log(response);
      if(response.data.code === 200){
       console.log("Shift saved!");
       this.props.appContext.setState({contentDetails:['Shift saved']})
       this.props.appContext.setState({loginPage:[],contentScreen:[]});
      } else {
        console.log("some error ocurred",response.data.error);
        alert(response.data.error);
      }
    }

    saveShift(event){
      var butttonLabel = "My Shifts";
      if(this.role=='manager') {
        butttonLabel = "Shift Browser";
      }

      var self = this;
      console.log(this.state)
      var managerId = this.state.manager_id;
      var employee_id = this.state.employee_id;
      //the backend does not like to get '' -- it wants null
      if(managerId == '') {
        managerId = null;
      }
      if(employee_id == '') {
        employee_id = null;
      }
      var payload={
        "manager_id": managerId,
        "employee_id":employee_id,
        //value = {new Date(this.state.start_time).toString().split(' GMT')[0]}
        "start_time":this.state.start_time,
        "end_time":this.state.end_time,
        "break":this.state.break,
      }

      var restMethod = 'POST';
      var fullUrl = this.props.appContext.apiBaseUrl+'shift/save';
      if(this.data.shift && this.data.shift.id){
        fullUrl+="/"+ this.data.shift.id
        restMethod = 'PUT';
      }
      console.log(payload);

    if(restMethod == 'PUT') {
        //i wish axios let me pass in push or post as a parameter instead of making me make two code blocks
        axios.put(fullUrl, payload)
       .then(function (response) {
         console.log(response);
         self.displayShiftData(response);
       })
      .catch(function (error) {
        console.log(error);
      });

    } else {
      console.log(payload);
      axios.post(fullUrl, payload)
       .then(function (response) {
          self.displayShiftData(response);
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  }

  //makes the date as simple as possible for editing
  showDateInForm(dateStringIn) {
    var out = dateStringIn.split('+')[0].replace('T', ' ');
    if(out.length>19) {
      out = out.substr(0,19);
    }
    return out;
  }

  render() {
    const style = {
      margin: 15,
    };
    console.log(this.state);
    var manager_id = this.state.manager_id;
    if(!manager_id) {
      this.state.manager_id = this.userId;
    }

    return (
        <div className="shiftEditor">
        <h2>Shift Editor</h2>
        <MuiThemeProvider>
          <div>
            <div className='labledFormRow'>
             <div className='formLabel'>Manager</div>
            <DropDownMenu className='employeeDropdown'  value={this.state.manager_id} onChange={(event,newValue) => {this.setState({manager_id:newValue})   ;console.log(this.state.employee_id)  }}>
              <MenuItem value='' primaryText='none' />
              {this.data.managers.map((x,y)=><MenuItem key={y} value={x.id} primaryText={x.name} />)}
            </DropDownMenu>
          </div>
          <div className='labledFormRow'>
           <div className='formLabel'>Employee</div>
           <DropDownMenu className='employeeDropdown'  value={this.state.employee_id} onChange={(event,newValue) => {this.setState({employee_id:newValue})}}>
              <MenuItem value='' primaryText='none' />
             {this.data.employees.map((x,y)=><MenuItem key={x.id} value={x.id} primaryText={x.name} />)}
           </DropDownMenu>
           </div>
           <TextField
             hintText="I'm not really clear what break is and why it's a float!"
             floatingLabelText="Break"
             value = {this.state.break}
             onChange = {(event,newValue) => this.setState({break:newValue})}
             />
           <br/>
           <TextField
             hintText="When the shift begins"
             floatingLabelText="Start Time"
             value = {this.showDateInForm(this.state.start_time)}
             onChange = {(event,newValue) => this.setState({start_time:newValue})}
             />
           <br/>
           <TextField
             hintText="When the shift enda"
             floatingLabelText="End Time"
             value = {this.showDateInForm(this.state.end_time)}
             onChange = {(event,newValue) => this.setState({end_time:newValue})}
             />
           <br/>
           <RaisedButton label="Save Shift" primary={true} style={style} onClick={(event) => this.saveShift(event)}/>
          </div>
         </MuiThemeProvider>


        </div>

    );
  }
}

export default ShiftEditor;
