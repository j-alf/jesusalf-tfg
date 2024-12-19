import {ReactNode} from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
}

export default function Card({children, className = ''}: Readonly<CardProps>) {
    return (
        <div className={`bg-white/95 backdrop-blur-sm shadow-xl rounded-lg p-8 ${className}`}>
            {children}
        </div>
    );
}