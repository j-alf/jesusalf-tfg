import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import AppRoutes from './routes'
import { AuthProvider } from './contexts/AuthContext'
import {GroupProvider} from "./contexts/GroupContext.tsx";

const queryClient = new QueryClient()

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <AuthProvider>
                    <GroupProvider>
                        <AppRoutes />
                    <Toaster position="top-center" />
                    </GroupProvider>
                </AuthProvider>
            </BrowserRouter>
        </QueryClientProvider>
    );
}

export default App
