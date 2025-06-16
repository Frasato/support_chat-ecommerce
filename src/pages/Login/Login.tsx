import { useState } from "react";
import { login } from "../../services/login";
import { useNavigate } from "react-router";

const Login = () => {

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const navigate = useNavigate();

    async function auth(e: React.FormEvent){
        e.preventDefault();
        if(email == '' || password == ''){
            return;
        }

        await login(email, password);
        navigate('/');
    }

    const handlerEmail = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
    const handlerPassword = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);

    return(
        <section>
            <form onSubmit={auth}>
                <img src="" alt="" />
                <label>Email</label>
                <input type="text" onChange={(e) => handlerEmail(e)}/>
                <label>Senha</label>
                <input type="password" onChange={(e) => handlerPassword(e)}/>
                <button type="submit">Entrar</button>
            </form>
        </section>
    );
}

export default Login;