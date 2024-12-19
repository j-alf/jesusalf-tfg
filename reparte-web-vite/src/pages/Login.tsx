import {useState} from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import {toast} from 'react-hot-toast';
import {useAuth} from '../hooks/useAuth';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import AuthLayout from '../components/AuthLayout';
import {Logo} from "../components/Logo.tsx";

interface LoginForm {
    email: string;
    password: string;
}

export default function Login() {
    const {login} = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const {register, handleSubmit, formState: {errors}} = useForm<LoginForm>();

    const onSubmit = async (data: LoginForm) => {
        try {
            setIsLoading(true);
            await login(data.email, data.password);
            toast.success('¡Bienvenido de nuevo!');

            const from = location.state?.from?.pathname || '/groups';
            navigate(from);
        } catch {
            toast.error('Email o contraseña incorrectos');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout>
            <Card className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Logo variant="dark" size="xl" className="mb-6"/>
                    <h2 className="text-3xl font-bold text-gray-900">
                        Inicia sesión en ReparTe
                    </h2>
                    {location.state?.from?.pathname?.startsWith('/join/') && (
                        <p className="mt-2 text-sm text-gray-600">
                            Inicie sesión en su cuenta
                        </p>
                    )}
                </div>
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <Input
                        label="Email"
                        type="email"
                        {...register('email', {
                            required: 'El email es necesario',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Email incorrecto'
                            }
                        })}
                        error={errors.email?.message}
                    />
                    <Input
                        label="Contraseña"
                        type="password"
                        {...register('password', {
                            required: 'La contraseña es necesaria',
                            minLength: {
                                value: 6,
                                message: 'La contraseña debe tener al menos 6 caracteres'
                            }
                        })}
                        error={errors.password?.message}
                    />

                    <Button
                        type="submit"
                        className="w-full"
                        isLoading={isLoading}
                    >
                        Iniciar sesión
                    </Button>

                    <div className="text-center text-sm">
                        <Link
                            to="/register"
                            state={location.state}
                            className="text-blue-600 hover:text-blue-500 font-medium"
                        >
                            ¿No tienes una cuenta? Regístrate
                        </Link>
                    </div>
                </form>
            </Card>
        </AuthLayout>
    );
}
