import {useState} from 'react';
import {Tab, TabGroup, TabList, TabPanel, TabPanels} from '@headlessui/react';
import {useAuth} from '../hooks/useAuth';
import {userService} from '../services/userService';
import Layout from '../components/Layout';
import Card from '../components/Card';
import ProfileForm, {ProfileFormData} from '../components/profile/ProfileForm';
import PasswordForm, {PasswordFormData} from '../components/profile/PasswordForm';

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

export default function Profile() {
    const {user, setUser} = useAuth();
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

    if (!user) {
        return null;
    }

    const handleProfileSubmit = async (data: ProfileFormData) => {
        setIsUpdatingProfile(true);
        try {
            const updatedUser = await userService.updateCurrentUser(data);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    const handlePasswordSubmit = async (data: PasswordFormData) => {
        setIsUpdatingPassword(true);
        try {
            await userService.updatePassword({
                currentPassword: data.currentPassword,
                newPassword: data.newPassword
            });
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-2xl mx-auto">
                <Card>
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Ajustes de cuenta
                        </h2>
                    </div>

                    <TabGroup>
                        <TabList className="flex space-x-1 rounded-xl bg-blue-900/20 p-1 mb-6">
                            <Tab
                                className={({selected}) =>
                                    classNames(
                                        'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                                        'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                                        selected
                                            ? 'bg-white text-blue-700 shadow'
                                            : 'text-blue-700 hover:bg-white/[0.12] hover:text-blue-800'
                                    )
                                }
                            >
                                Perfil
                            </Tab>
                            <Tab
                                className={({selected}) =>
                                    classNames(
                                        'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                                        'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                                        selected
                                            ? 'bg-white text-blue-700 shadow'
                                            : 'text-blue-700 hover:bg-white/[0.12] hover:text-blue-800'
                                    )
                                }
                            >
                                Contraseña
                            </Tab>
                        </TabList>

                        <TabPanels>
                            <TabPanel>
                                <ProfileForm
                                    user={user}
                                    onSubmit={handleProfileSubmit}
                                    isLoading={isUpdatingProfile}
                                />
                            </TabPanel>
                            <TabPanel>
                                <PasswordForm
                                    onSubmit={handlePasswordSubmit}
                                    isLoading={isUpdatingPassword}
                                />
                            </TabPanel>
                        </TabPanels>
                    </TabGroup>
                </Card>
            </div>
        </Layout>
    );
}