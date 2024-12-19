import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import AuthLayout from '../components/AuthLayout';
import {Logo} from "../components/Logo.tsx";

interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Register() {
  const { register: registerUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>();

  const onSubmit = async (data: RegisterForm) => {
    try {
      setIsLoading(true);
      await registerUser(data.firstName, data.lastName, data.email, data.password);
      toast.success('¡Registro completado!');

    } catch {
      toast.error('Error en el registro. Inténtelo nuevamente.');
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
              Crea una cuenta de ReparTe
            </h2>
            {location.state?.from?.pathname?.startsWith('/join/') && (
                <p className="mt-2 text-sm text-gray-600">
                  Cree una cuenta para empezar a repartir
                </p>
            )}
          </div>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4">
              <Input
                  label="Nombre"
                  {...register('firstName', {
                    required: 'El nombre es necesario',
                    minLength: {
                      value: 2,
                      message: 'El nombre debe tener al menos 2 caracteres'
                    }
                  })}
                  error={errors.firstName?.message}
              />
              <Input
                  label="Apellido"
                  {...register('lastName', {
                    required: 'El apellido es necesario',
                    minLength: {
                      value: 2,
                      message: 'El apellido debe tener al menos 2 caracteres'
                    }
                  })}
                  error={errors.lastName?.message}
              />
            </div>
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
            <Input
                label="Confirmar contraseña"
                type="password"
                {...register('confirmPassword', {
                  required: 'Por favor confirme su contraseña',
                  validate: value =>
                      value === watch('password') || 'Las contraseñas no coinciden'
                })}
                error={errors.confirmPassword?.message}
            />

            <Button
                type="submit"
                className="w-full"
                isLoading={isLoading}
            >
              Crear cuenta
            </Button>

            <div className="text-center text-sm">
              <Link
                  to="/login"
                  state={location.state}
                  className="text-blue-600 hover:text-blue-500 font-medium"
              >
                ¿Ya tienes cuenta? Inicia sesión
              </Link>
            </div>
          </form>
        </Card>
      </AuthLayout>
  );
}

/*import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import AuthLayout from '../components/AuthLayout';

interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Register() {
  const { register: registerUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>();

  const onSubmit = async (data: RegisterForm) => {
    try {
      setIsLoading(true);
      const redirectPath = localStorage.getItem('invite_redirect');
      await registerUser(data.firstName, data.lastName, data.email, data.password, redirectPath);
      toast.success('Registration successful!');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <AuthLayout>
        <Card className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Create your account
            </h2>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4">
              <Input
                  label="First Name"
                  {...register('firstName', {
                    required: 'First name is required',
                    minLength: {
                      value: 2,
                      message: 'First name must be at least 2 characters'
                    }
                  })}
                  error={errors.firstName?.message}
              />
              <Input
                  label="Last Name"
                  {...register('lastName', {
                    required: 'Last name is required',
                    minLength: {
                      value: 2,
                      message: 'Last name must be at least 2 characters'
                    }
                  })}
                  error={errors.lastName?.message}
              />
            </div>
            <Input
                label="Email"
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                error={errors.email?.message}
            />
            <Input
                label="Password"
                type="password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
                error={errors.password?.message}
            />
            <Input
                label="Confirm Password"
                type="password"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: value =>
                      value === watch('password') || 'Passwords do not match'
                })}
                error={errors.confirmPassword?.message}
            />

            <Button
                type="submit"
                className="w-full"
                isLoading={isLoading}
            >
              Create Account
            </Button>

            <div className="text-center text-sm">
              <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Already have an account? Sign in
              </Link>
            </div>
          </form>
        </Card>
      </AuthLayout>
  );
}*/

/*
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import AuthLayout from '../components/AuthLayout';

interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Register() {
  const { register: registerUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>();

  const onSubmit = async (data: RegisterForm) => {
    try {
      setIsLoading(true);
      await registerUser(data.firstName, data.lastName, data.email, data.password);
      toast.success('Registration successful!');
    } catch {
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <AuthLayout>
        <Card className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Create your account
            </h2>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4">
              <Input
                  label="First Name"
                  {...register('firstName', {
                    required: 'First name is required',
                    minLength: {
                      value: 2,
                      message: 'First name must be at least 2 characters'
                    }
                  })}
                  error={errors.firstName?.message}
              />
              <Input
                  label="Last Name"
                  {...register('lastName', {
                    required: 'Last name is required',
                    minLength: {
                      value: 2,
                      message: 'Last name must be at least 2 characters'
                    }
                  })}
                  error={errors.lastName?.message}
              />
            </div>
            <Input
                label="Email"
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                error={errors.email?.message}
            />
            <Input
                label="Password"
                type="password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
                error={errors.password?.message}
            />
            <Input
                label="Confirm Password"
                type="password"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: value =>
                      value === watch('password') || 'Passwords do not match'
                })}
                error={errors.confirmPassword?.message}
            />

            <Button
                type="submit"
                className="w-full"
                isLoading={isLoading}
            >
              Create Account
            </Button>

            <div className="text-center text-sm">
              <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Already have an account? Sign in
              </Link>
            </div>
          </form>
        </Card>
      </AuthLayout>
  );
}*/
