export async function login(email: string, password: string){
    const apiUrl: string = import.meta.env.VITE_API_URL;

    try{
        const response = await fetch(`${apiUrl}/auth/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        console.log(response);
        const data = await response.json();

        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('name', data.name);
    }catch(error){
        console.error(error);
        throw Error('Error on fecth user');
    }
}