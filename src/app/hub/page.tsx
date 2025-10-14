'use client';
import { useAlert } from "@/components/AlertProvider/AlertContext";
import Button from "@/components/Button/Button";
import CreateHubModal from "@/components/CreateHubModal/CreateHubModal";
import HubCard from "@/components/HubCard/HubCard";
import Statistics from "@/components/StatisticSummary/StatisticSummary";
import { useUser } from "@/context/UserContext";
import { useGetUserHubsQuery } from "@/hooks/useGetUserHubsQuery";
import { newHubApi } from "@/lib/api/newHub";
import getHubStatsSum from "@/utils/getHubStatsSum";
import { Hub, HubAddDto } from "@/types/Hub";
import { Plus, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HubPage() {

    const user = useUser();
    const { showAlert } = useAlert();
    const router = useRouter();

    const { data: hubsData, isLoading, isError, error } = useGetUserHubsQuery();
    const [hubs, setHubs] = useState<Hub[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useEffect(() => {
        if (hubsData) {
            setHubs(hubsData);
        }
    }, [hubsData]);

    // API call
    const userHubs = hubs; // Filter by current user

    const hubStats = getHubStatsSum(userHubs, user?.Name);

    const handleOpenCreateModal = () => {
        if (user) {
            setIsCreateModalOpen(true)
            return;
        }

        router.push('/auth');
    }

    const handleCreateHub = async (newHubData: HubAddDto) => {
        const res = await newHubApi(newHubData);

        if (res?.status === 200) {
            showAlert("Hub created successfully", "success");
        } else {
            showAlert("Hub creation failed", "error");
            return;
        }

        const newHub: Hub = {
            name: newHubData.name,
            description: newHubData.description,
            numberOfClasses: 0,
            numberOfTeachers: newHubData.includedTeachers.length,
            owner: newHubData.owner,
            id: Math.max(...hubs.map(h => h.id)) + 1,
        };
        setHubs(prev => [newHub, ...prev]);
        setIsCreateModalOpen(false);
    };

    const handleHubClick = (hub: Hub) => {
        router.push(`/hub/${hub.id}/classes`);
    };

    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your hubs...</p>
                </div>
            </div>
        );
    }

    // Show error state
    if (isError) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Hubs</h2>
                    <p className="text-gray-600 mb-6">
                        {error?.message || "Something went wrong while loading your hubs. Please try again."}
                    </p>
                    <Button 
                        color="blue" 
                        icon={RefreshCw}
                        title="Retry" 
                        onClick={() => window.location.reload()} 
                    />
                </div>
            </div>
        );
    }

    if (userHubs.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
                <div className="text-center max-w-2xl">
                    {/* Empty State Illustration */}
                    <div className="mb-8">
                        <svg className="mx-auto h-32 w-32 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>

                    <h1 className="text-4xl font-bold text-gray-900 mb-4">No Hubs Found</h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
                        You don't have any teaching hubs yet. Create your first hub to organize your classes and collaborate with other teachers.
                    </p>

                    {/* Big Create Hub Button */}
                    <button
                        onClick={handleOpenCreateModal}
                        className="cursor-pointer inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-2xl font-bold text-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create Your First Hub
                    </button>

                    {/* Additional Info */}
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Organize Classes</h3>
                            <p className="text-gray-600 text-sm">Group related classes together for better management</p>
                        </div>

                        <div className="text-center">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Collaborate</h3>
                            <p className="text-gray-600 text-sm">Work together with other teachers in your hub</p>
                        </div>

                        <div className="text-center">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Track Progress</h3>
                            <p className="text-gray-600 text-sm">Monitor performance and analytics across all hub classes</p>
                        </div>
                    </div>
                </div>

                {/* Create Hub Modal */}
                <CreateHubModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onSubmit={handleCreateHub}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">My Teaching Hubs</h1>
                        <p className="text-xl text-gray-600">
                            Manage your teaching hubs and collaborate with other educators
                        </p>
                    </div>

                    <Button color="blue" icon={Plus} title="Create New Hub"
                        onClick={handleOpenCreateModal} />
                </div>

                {/* Hubs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {userHubs.map((hub) => (
                        <HubCard
                            key={hub.id}
                            hub={hub}
                            isOwner={hub.owner.match(user?.Name) ? true : false}
                            onClick={handleHubClick}
                        />
                    ))}
                </div>

                {/* Statistics */}
                <Statistics
                    stats={hubStats}
                    columns={4}
                    className="mt-12"
                />
            </div>

            {/* Create Hub Modal */}
            <CreateHubModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateHub}
            />
        </div>
    );
}