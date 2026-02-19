import type { Metadata } from 'next'
import LoginForm from '@/components/admin/LoginForm'
import Image from 'next/image'

export const metadata: Metadata = {
    title: 'Login Admin | Café Canastra',
    robots: {
        index: false,
        follow: false,
    },
}

export default function LoginPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div className="flex flex-col items-center">
                    <Image
                        src="/logo-canastra.png" // Assumes this exists in public/
                        alt="Café Canastra"
                        width={120}
                        height={120}
                        className="mb-4"
                        priority
                    />
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                        Acesso Administrativo
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Entre com suas credenciais para gerenciar o blog.
                    </p>
                </div>

                <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <LoginForm />
                </div>
            </div>
        </div>
    )
}
