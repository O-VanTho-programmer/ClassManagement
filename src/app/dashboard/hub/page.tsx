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
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import LoadingState from "@/components/QueryState/LoadingState";
import ErrorState from "@/components/QueryState/ErrorState";
import { useRouter } from "next/navigation";
import LayoutDashboard from "@/components/LayoutDashboard/LayoutDashboard";
import { useQueryClient } from "@tanstack/react-query";
import EmptyStateHubs from "@/components/EmptyStateHubs/EmptyStateHubs";

export default function HubPage() {

    const user = useUser();
    const { showAlert } = useAlert();
    const router = useRouter();
    const queryClient = useQueryClient();


    const { data: hubsData = [], isLoading, isError, error } = useGetUserHubsQuery();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const [hubs, setHubs] = useState<Hub[] | []>([]);

    useEffect(() => {
        if (hubsData) {
            setHubs(hubsData);
        }
    }, [hubsData]);

    const handleOpenCreateModal = () => {
        if (user) {
            setIsCreateModalOpen(true);
            return;
        }
        router.push('/auth');
    };

    const handleCreateHub = async (newHubData: HubAddDto) => {
        const res = await newHubApi(newHubData);
        if (res?.status === 200) {
            showAlert("Hub created successfully", "success");
            queryClient.invalidateQueries({ queryKey: ['get_user_hubs', user?.Id] });
            setIsCreateModalOpen(false);
        } else {
            showAlert("Hub creation failed", "error");
            return;
        }
    };

    const handleHubClick = (hub: Hub) => {
        router.push(`hub/${hub.id}/classes`);
    };

    if (isLoading && !hubs) return <LoadingState fullScreen message="Loading your hubs..." />;
    if (isError) return (
        <ErrorState
            fullScreen
            title="Error Loading Hubs"
            message={error?.message || "Something went wrong while loading your hubs. Please try again."}
            onRetry={() => window.location.reload()}
        />
    );

    const currentUserHubs = hubs.filter(hub => hub.isOwner === 1);
    const guestHubs = hubs.filter(hub => hub.isOwner === 0);
    const hubStats = getHubStatsSum(currentUserHubs, user?.Name);

    if (currentUserHubs.length === 0 && guestHubs.length === 0) {
        return (
            <LayoutDashboard>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
                    <EmptyStateHubs onCreate={handleOpenCreateModal} />
                    {/* Create Hub Modal */}
                    <CreateHubModal
                        isOpen={isCreateModalOpen}
                        onClose={() => setIsCreateModalOpen(false)}
                        onSubmit={handleCreateHub}
                    />
                </div>
            </LayoutDashboard>
        );
    }

    return (
        <LayoutDashboard>
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
                        <Button color="blue" icon={Plus} title="Create New Hub" onClick={handleOpenCreateModal} />
                    </div>

                    {/* My hubs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {currentUserHubs.map((hub) => (
                            <HubCard
                                key={hub.id}
                                hub={hub}
                                isOwner={hub.isOwner === 1}
                                onClick={handleHubClick}
                            />
                        ))}
                    </div>

                    {/* Guest Hubs */}
                    {guestHubs && guestHubs.length > 0 && (
                        <>
                            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Guest Hubs</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {guestHubs.map((hub) => (
                                    <HubCard
                                        key={hub.id}
                                        hub={hub}
                                        isOwner={false}
                                        onClick={handleHubClick}
                                    />
                                ))}
                            </div>
                        </>
                    )}

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
        </LayoutDashboard>
    );
}