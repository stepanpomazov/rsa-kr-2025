import { HTMLAttributes, forwardRef } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'outline' | 'elevated'
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = 'default', ...props }, ref) => {
        const variants = {
            default: 'bg-white border border-gray-200',
            outline: 'border-2 border-gray-300',
            elevated: 'bg-white shadow-lg',
        }

        return (
            <div
                ref={ref}
                className={cn(
                    'rounded-lg p-6',
                    variants[variant],
                    className
                )}
                {...props}
            />
        )
    }
)

Card.displayName = 'Card'

export { Card }