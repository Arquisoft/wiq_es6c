function Button(props){
    const {text, name, onClick, value, id} = props;
    return (
        <div className="border">
            <div className="inner" onClick={onClick} name={name} id={id} value={value}>{text}</div>
        </div>
    );
}

export default Button;