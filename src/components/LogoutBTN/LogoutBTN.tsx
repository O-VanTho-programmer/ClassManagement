'use client';
import { logout } from '@/lib/api/auth/logout';
import React from 'react'

type LogoutBTNProps = {
    style?: string
}

export default function LogoutBTN({ style = '' }: LogoutBTNProps) {

    const handeLogout = async () => {
        try {
            const res = await logout();

            if (res.status === 200) {
                window.location.href = '/auth';
            }

        } catch (error) {

        }
    }

    return (
        <button onClick={handeLogout} className={`w-full h-full cursor-pointer ${style}`}>
            Logout
        </button>
    )
}