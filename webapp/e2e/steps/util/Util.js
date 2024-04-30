async function login(page) {
    username = "pablo"
    password = "pabloasw"
    await expect(page).toFill('input[name="username"]', username);
    await expect(page).toFill('input[name="password"]', password);
    await expect(page).toClick('button', { text: 'Iniciar sesión' })
}

export default {login};