import { useState } from "react";
import { login } from "../../services/login";
import { useNavigate } from "react-router";
import "./loginStyle.scss";
import { FiLock, FiLogIn, FiMail } from "react-icons/fi";

const Login = () => {

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function auth(e: React.FormEvent){
        setIsLoading(true);
        e.preventDefault();
        if(email == '' || password == ''){
            return;
        }

        await login(email, password);
        setIsLoading(false);
        navigate('/');
    }

    const handlerEmail = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
    const handlerPassword = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);

    return(
        <section className="login-page">
            <div className="login-container">
                <div className="login-header">
                    <div className="logo">
                        <FiLogIn size={24} />
                    </div>
                    <h1>Bem-vindo de volta</h1>
                    <p>Entre para acessar sua conta</p>
                </div>
                
                <form className="login-form" onSubmit={auth}>
                    <div className="form-group">
                        <label>Email</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => handlerEmail(e)}
                            placeholder="seu@email.com"
                            required
                        />
                        <FiMail className="input-icon" />
                    </div>
                    
                    <div className="form-group">
                        <label>Senha</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => handlerPassword(e)}
                            placeholder="••••••••"
                            required
                        />
                        <FiLock className="input-icon" />
                    </div>
                    
                    <button 
                        type="submit" 
                        className="login-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>
            </div>
        </section>
    );
}

export default Login;