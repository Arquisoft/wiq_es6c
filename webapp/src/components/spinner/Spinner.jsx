import React from "react";
import './Spinner.css';

class Spinner extends React.Component {
	state = {
		value: this.props.value || 0
	}
	
	constructor(props) {
		super(props);
		
		this.increment = this.increment.bind(this);
		this.decrement = this.decrement.bind(this);
	}
	
	get value() {
	  return this.state.value;
	}
  
	increment() {
	  const { max } = this.props;
	  
	  if (typeof max === 'number' && this.value >= max) return;
	  
	  this.setState({ value: this.value + 1 });
	}
  
	decrement() {
	  const { min } = this.props;
	  
	  if (typeof min === 'number' && this.value <= min) return;
	  
	  this.setState({ value: this.value - 1 });
	}
	
	render() {
	  return (
		<div className="input-number">
		  <button id={this.props.id+"-"} type="button" onClick={this.decrement}>&minus;</button>
		  <span id={this.props.id}>{this.value}</span>
		  <button d={this.props.id+"+"} type="button" onClick={this.increment}>&#43;</button>     
		</div>
	  )
	}
  }

export default Spinner;