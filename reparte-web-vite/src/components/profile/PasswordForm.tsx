import {useForm} from 'react-hook-form';
import {toast} from 'react-hot-toast';
import Button from '../Button';
import Input from '../Input';

interface PasswordFormProps {
    onSubmit: (data: PasswordFormData) => Promise<void>;
    isLoading?: boolean;
}

export interface PasswordFormData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export default function PasswordForm({onSubmit, isLoading}: Readonly<PasswordFormProps>) {
    const {register, handleSubmit, watch, reset, formState: {errors}} = useForm<PasswordFormData>();

    const handleFormSubmit = async (data: PasswordFormData) => {
        try {
            await onSubmit(data);
            reset();
            toast.success('Contraseña actualizada correctamente');
        } catch {
            toast.error('Error al actualizar la contraseña');
        }
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <Input
                label="Contraseña actual"
                type="password"
                {...register('currentPassword', {
                    required: 'La contraseña actual es necesaria'
                })}
                error={errors.currentPassword?.message}
            />

            <Input
                label="Nueva contraseña"
                type="password"
                {...register('newPassword', {
                    required: 'La nueva contraseña es necesaria',
                    minLength: {
                        value: 6,
                        message: 'La contraseña debe tener al menos 6 caracteres'
                    }
                })}
                error={errors.newPassword?.message}
            />

            <Input
                label="Confirma la nueva contraseña"
                type="password"
                {...register('confirmPassword', {
                    required: 'Confirme su nueva contraseña',
                    validate: value =>
                        value === watch('newPassword') || 'Las contraseñas no coinciden'
                })}
                error={errors.confirmPassword?.message}
            />

            <Button
                type="submit"
                className="w-full"
                isLoading={isLoading}
            >
                Actualizar Contraseña
            </Button>
        </form>
    );
}