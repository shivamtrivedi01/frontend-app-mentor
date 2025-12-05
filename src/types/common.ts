interface MyRolesInfo {
    course_roles: string[];
    is_staff: boolean;
    is_superuser: boolean;
}

interface MentorUser {
    username: string
    email: string
    date_joined: string
    is_active: boolean
    id: number
    has_mentorship: boolean
}

export {
    MyRolesInfo,
    MentorUser,
}
