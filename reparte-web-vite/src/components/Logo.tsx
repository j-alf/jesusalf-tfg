import logoDark  from '../assets/reparte-dark.png';
import logoLight from '../assets/reparte-light.png';

interface LogoProps {
    className?: string;
    variant?: 'light' | 'dark';
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Logo({ className = '', variant = 'dark', size = 'md' }: Readonly<LogoProps>) {
    const logoSrc = variant === 'dark' ? logoDark : logoLight;

    const sizeClasses = {
        sm: 'h-8',
        md: 'h-12',
        lg: 'h-16',
        xl: 'h-24'
    };

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <img
                src={logoSrc}
                alt="ReparTe Logo"
                className={sizeClasses[size]}
            />
        </div>
    );
}