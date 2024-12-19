import {ButtonHTMLAttributes} from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
    isLoading?: boolean;
}

export default function Button({
                                   children,
                                   variant = 'primary',
                                   isLoading,
                                   disabled,
                                   className = '',
                                   ...props
                               }: Readonly<ButtonProps>) {
    const baseStyles = 'px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors';
    const variants = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500'
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className} ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <div className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"
                                fill="none"/>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                    Cargando...
                </div>
            ) : (
                children
            )}
        </button>
    );
}