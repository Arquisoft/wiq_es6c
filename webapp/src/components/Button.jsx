function Button(props){
    const {text, name, onClick, value, id, hidden} = props;
    return (
        <div className="border">
            <div className="inner" onClick={onClick} name={name} id={id} value={value} hidden={hidden}>{text}</div>
        </div>
    );
}

export default Button;