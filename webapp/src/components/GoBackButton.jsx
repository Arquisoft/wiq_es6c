import Button from "./Button";
import { useNavigate } from 'react-router-dom'; // Importa useHistory



function GoBackButton(){
    const navigation = useNavigate();

    const goBack = async () => {
        navigation('/menu')
    }

    return (
        <Button text = "Volver al menú" name="goBack" onClick={() => goBack()} />
    );
}



export default GoBackButton;