import PropTypes from 'prop-types';

function Button(props){
    const {text, name, onClick, value, id, hidden} = props;

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            onClick(event);
        }
    };

    return (
        <div className="border">
            <button
                className="inner" 
                onClick={onClick} 
                onKeyDown={handleKeyDown}
                tabIndex={0} 
                name={name} 
                id={id} 
                value={value} 
                hidden={hidden}
                aria-label={text} 
                >
                {text}
            </button>
        </div>
    );
}

Button.propTypes = {
    text: PropTypes.string,
    name: PropTypes.string,
    onClick: PropTypes.func,
    value: PropTypes.any,
    id: PropTypes.string,
    hidden: PropTypes.bool
};

export default Button;