import {useForm} from 'react-hook-form';
import {toast} from 'react-hot-toast';
import {User} from '../../services/authService';
import Button from '../Button';
import Input from '../Input';

interface ProfileForm {
    user: User;
    onSubmit: (data: ProfileFormData) => Promise<void>;
    isLoading?: boolean;
}

export interface ProfileFormData {
    firstName: string;
    lastName: string;
    email: string;
}

export default function ProfileForm({user, onSubmit, isLoading}: Readonly<ProfileForm>) {
    const {register, handleSubmit, formState: {errors}} = useForm<ProfileFormData>({
        defaultValues: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        }
    });

    const handleFormSubmit = async (data: ProfileFormData) => {
        try {
            await onSubmit(data);
            toast.success('Perfil actualizado correctamente');
        } catch {
            toast.error('Error al actualizar el perfil');
        }
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
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

            <Button
                type="submit"
                className="w-full"
                isLoading={isLoading}
            >
                Actualizar Perfil
            </Button>
        </form>
    );
}